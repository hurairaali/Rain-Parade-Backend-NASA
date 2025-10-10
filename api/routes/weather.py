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
            
            # Calculate statistics
            stats = statistics_service.calculate_basic_stats(values)
            
            # Calculate probability
            probability = statistics_service.calculate_probability(
                values, threshold_value, condition
            )
            
            # Calculate trend
            trend_info = statistics_service.calculate_trend(day_data, parameter)
            
            # Create probability data
            prob_data = ProbabilityData(
                condition=condition,
                probability=probability,
                mean=stats.get("mean", 0),
                median=stats.get("median", 0),
                stdDev=stats.get("std", 0),
                percentile25=stats.get("percentile25", 0),
                percentile75=stats.get("percentile75", 0),
                percentile90=stats.get("percentile90", 0)
            )
            probabilities.append(prob_data)
            
            # Create trend data for each year
            for _, row in day_data.iterrows():
                trends.append(TrendData(
                    year=row["date"].year,
                    value=float(row[parameter]),
                    condition=condition
                ))
            
            # Generate summary
            summary = statistics_service.generate_summary(
                condition,
                probability,
                trend_info["trend"],
                stats.get("mean", 0),
                threshold_obj.unit
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
