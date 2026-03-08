"""
Weather analysis API routes
"""
from fastapi import APIRouter, HTTPException
from typing import List
import logging
from datetime import datetime

from models.schemas import (
    QueryParams, WeatherResults, ProbabilityData,
    TrendData, WeatherMetadata, APIResponse
)
from services.nasa_power import nasa_power_service
from services.statistics import statistics_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/weather", tags=["weather"])

# NASA POWER returns temperatures in Celsius; frontend may send thresholds in °F
TEMP_CONDITIONS = ("hot", "cold")


def _is_fahrenheit(unit: str) -> bool:
    """Return True if unit is Fahrenheit."""
    if not unit:
        return False
    u = unit.strip().upper()
    return u == "°F" or "F" in u and "C" not in u


def _threshold_to_celsius(value: float, unit: str) -> float:
    """Convert threshold to Celsius when unit is Fahrenheit. Otherwise return value unchanged."""
    if _is_fahrenheit(unit):
        return (value - 32.0) * 5.0 / 9.0
    return value


def _celsius_to_fahrenheit(c: float) -> float:
    """Convert Celsius to Fahrenheit."""
    return (c * 9.0 / 5.0) + 32.0


def _std_celsius_to_fahrenheit(std_c: float) -> float:
    """Convert standard deviation from Celsius to Fahrenheit (scale by 9/5)."""
    return std_c * 9.0 / 5.0


@router.post("/analyze", response_model=WeatherResults)
async def analyze_weather(query: QueryParams):
    """
    Analyze weather likelihood based on historical NASA data
    
    Args:
        query: Query parameters including location, date, conditions, thresholds
        
    Returns:
        Weather analysis results with probabilities, trends, and statistics
    """
    try:
        location = query.location
        target_date = query.parsed_date  # Use parsed_date property
        day_of_year = target_date.timetuple().tm_yday
        
        # Time range - ensure end year is not in the future
        start_year = query.timeRange.get("start", 1980)
        requested_end_year = query.timeRange.get("end", datetime.now().year)
        current_year = datetime.now().year
        end_year = min(requested_end_year, current_year)  # Don't allow future years
        
        probabilities = []
        trends = []
        all_summaries = []
        
        # Analyze each selected condition
        for threshold_obj in query.thresholds:
            if not threshold_obj.enabled:
                continue
            
            condition = threshold_obj.condition
            threshold_value = threshold_obj.value
            unit = threshold_obj.unit or ""

            # Use threshold in Celsius for probability (NASA POWER data is in Celsius)
            if condition in TEMP_CONDITIONS:
                threshold_for_calc = _threshold_to_celsius(threshold_value, unit)
            else:
                threshold_for_calc = threshold_value

            # Get historical data from NASA POWER
            df = nasa_power_service.get_data_for_condition(
                location.latitude,
                location.longitude,
                condition,
                start_year,
                end_year
            )
            
            if df.empty:
                logger.warning(f"No data for condition: {condition}")
                continue
            
            # Get parameter name
            parameter = nasa_power_service.PARAMETERS.get(condition)
            
            # Filter for specific day of year
            day_data = nasa_power_service.get_day_of_year_data(
                df, day_of_year, parameter
            )
            
            if day_data.empty:
                logger.warning(f"No data for day {day_of_year}, condition: {condition}")
                continue
            
            values = day_data[parameter].dropna()

            # Calculate statistics (NASA data is in Celsius for temp conditions)
            stats = statistics_service.calculate_basic_stats(values)

            # Probability: compare in Celsius
            probability = statistics_service.calculate_probability(
                values, threshold_for_calc, condition
            )

            # Calculate trend
            trend_info = statistics_service.calculate_trend(day_data, parameter)

            # For temperature conditions with °F output, convert stats to Fahrenheit
            mean_display = stats.get("mean", 0)
            median_display = stats.get("median", 0)
            std_display = stats.get("std", 0)
            p25 = stats.get("percentile25", 0)
            p75 = stats.get("percentile75", 0)
            p90 = stats.get("percentile90", 0)
            if condition in TEMP_CONDITIONS and _is_fahrenheit(unit):
                mean_display = _celsius_to_fahrenheit(mean_display)
                median_display = _celsius_to_fahrenheit(median_display)
                std_display = _std_celsius_to_fahrenheit(std_display)
                p25 = _celsius_to_fahrenheit(p25)
                p75 = _celsius_to_fahrenheit(p75)
                p90 = _celsius_to_fahrenheit(p90)

            # Create probability data (values in requested unit)
            prob_data = ProbabilityData(
                condition=condition,
                probability=probability,
                mean=mean_display,
                median=median_display,
                stdDev=std_display,
                percentile25=p25,
                percentile75=p75,
                percentile90=p90
            )
            probabilities.append(prob_data)

            # Trend values in requested unit for display
            for _, row in day_data.iterrows():
                val = float(row[parameter])
                if condition in TEMP_CONDITIONS and _is_fahrenheit(unit):
                    val = _celsius_to_fahrenheit(val)
                trends.append(TrendData(
                    year=row["date"].year,
                    value=val,
                    condition=condition
                ))

            # Summary: mean_display and unit so displayed value matches unit
            summary = statistics_service.generate_summary(
                condition,
                probability,
                trend_info["trend"],
                mean_display,
                unit
            )
            all_summaries.append(summary)
        
        # Determine overall risk level
        risk_level = statistics_service.calculate_risk_level(
            [p.probability for p in probabilities]
        )
        
        # Combine summaries
        combined_summary = " ".join(all_summaries) if all_summaries else \
            "Based on historical data, weather conditions analysis is available."
        
        # Prepare historical data structure
        historical_data = {
            "years": sorted(list(set(t.year for t in trends))),
            "values": [[t.value for t in trends if t.year == year] 
                      for year in sorted(list(set(t.year for t in trends)))]
        }
        
        # Create metadata
        metadata = WeatherMetadata(
            dataSource="NASA POWER",
            lastUpdated=datetime.now().isoformat(),
            yearsAnalyzed=end_year - start_year + 1
        )
        
        # Return results
        return WeatherResults(
            location=location,
            queryDate=target_date.isoformat(),  # Convert date to string
            probabilities=probabilities,
            trends=trends,
            historicalData=historical_data,
            summary=combined_summary,
            riskLevel=risk_level,
            metadata=metadata
        )
        
    except Exception as e:
        logger.error(f"Weather analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@router.get("/variables")
async def get_available_variables():
    """
    Get list of available weather variables
    
    Returns:
        List of available weather parameters
    """
    return {
        "success": True,
        "data": {
            "variables": list(nasa_power_service.PARAMETERS.keys()),
            "parameters": nasa_power_service.PARAMETERS
        }
    }
