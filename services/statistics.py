"""
Statistical analysis service for weather data
"""
import numpy as np
import pandas as pd
from typing import Dict, List, Tuple
from scipy import stats
import logging

logger = logging.getLogger(__name__)


class StatisticsService:
    """Service for statistical analysis of weather data"""
    
    @staticmethod
    def calculate_basic_stats(values: pd.Series) -> Dict[str, float]:
        """
        Calculate basic statistical measures
        
        Args:
            values: Series of numerical values
            
        Returns:
            Dictionary with statistical measures
        """
        if values.empty:
            return {}
        
        return {
            "mean": float(values.mean()),
            "median": float(values.median()),
            "std": float(values.std()),
            "min": float(values.min()),
            "max": float(values.max()),
            "percentile25": float(values.quantile(0.25)),
            "percentile75": float(values.quantile(0.75)),
            "percentile90": float(values.quantile(0.90)),
        }
    
    @staticmethod
    def calculate_probability(
        values: pd.Series,
        threshold: float,
        condition: str
    ) -> float:
        """
        Calculate probability of exceeding threshold
        
        Args:
            values: Series of values
            threshold: Threshold value
            condition: Type of condition (determines if > or < threshold)
            
        Returns:
            Probability as percentage (0-100)
        """
        if values.empty:
            return 0.0
        
        # For cold, we want probability of being at or below threshold
        if condition == 'cold':
            count = (values <= threshold).sum()
        else:
            # For hot, windy, wet, uncomfortable - probability of at or above threshold
            count = (values >= threshold).sum()
        
        probability = (count / len(values)) * 100
        return float(probability)
    
    @staticmethod
    def calculate_trend(df: pd.DataFrame, value_column: str) -> Dict[str, any]:
        """
        Calculate trend over time using linear regression
        
        Args:
            df: DataFrame with 'date' column
            value_column: Column name for values
            
        Returns:
            Dictionary with trend info
        """
        if df.empty or len(df) < 2:
            return {"slope": 0, "trend": "stable", "r_squared": 0}
        
        df = df.copy()
        df["year"] = df["date"].dt.year
        
        # Linear regression
        years = df["year"].values
        values = df[value_column].values
        
        try:
            slope, intercept, r_value, p_value, std_err = stats.linregress(years, values)
            
            # Determine trend direction
            if abs(slope) < 0.01:  # Negligible slope
                trend = "stable"
            elif slope > 0:
                trend = "increasing"
            else:
                trend = "decreasing"
            
            return {
                "slope": float(slope),
                "intercept": float(intercept),
                "r_squared": float(r_value ** 2),
                "p_value": float(p_value),
                "trend": trend
            }
        except Exception as e:
            logger.error(f"Trend calculation error: {e}")
            return {"slope": 0, "trend": "stable", "r_squared": 0}
    
    @staticmethod
    def calculate_risk_level(probabilities: List[float]) -> str:
        """
        Determine overall risk level based on probabilities
        
        Args:
            probabilities: List of probability values
            
        Returns:
            Risk level: 'low', 'medium', or 'high'
        """
        if not probabilities:
            return "low"
        
        avg_prob = sum(probabilities) / len(probabilities)
        
        if avg_prob >= 60:
            return "high"
        elif avg_prob >= 30:
            return "medium"
        else:
            return "low"
    
    @staticmethod
    def generate_summary(
        condition: str,
        probability: float,
        trend: str,
        mean_value: float,
        unit: str
    ) -> str:
        """
        Generate comprehensive human-readable summary
        
        Args:
            condition: Weather condition
            probability: Probability percentage
            trend: Trend direction
            mean_value: Mean value
            unit: Unit of measurement
            
        Returns:
            Detailed summary text
        """
        condition_text = {
            'hot': 'high temperatures',
            'cold': 'low temperatures',
            'windy': 'strong winds',
            'wet': 'heavy precipitation',
            'uncomfortable': 'uncomfortable conditions'
        }.get(condition, condition)
        
        condition_name = condition.capitalize()
        
        # Probability assessment
        if probability < 15:
            prob_text = "very low"
            recommendation = f"Excellent conditions expected - {condition_name} conditions are unlikely to occur."
        elif probability < 30:
            prob_text = "low"
            recommendation = f"Generally favorable conditions - {condition_name} conditions are not expected."
        elif probability < 45:
            prob_text = "moderate"
            recommendation = f"Some caution advised - there's a fair chance of {condition_name} conditions."
        elif probability < 60:
            prob_text = "moderately high"
            recommendation = f"Planning advised - {condition_name} conditions have occurred frequently in the past."
        elif probability < 75:
            prob_text = "high"
            recommendation = f"Strong likelihood of {condition_name} conditions - prepare accordingly."
        else:
            prob_text = "very high"
            recommendation = f"Expect {condition_name} conditions - historical data shows frequent occurrence."
        
        # Trend analysis
        if trend == "increasing":
            trend_text = f"Historical data shows an increasing trend, suggesting {condition_text} are becoming more common over time."
        elif trend == "decreasing":
            trend_text = f"Historical data shows a decreasing trend, suggesting {condition_text} are becoming less common over time."
        else:
            trend_text = f"Historical data shows stable conditions with no significant trend over time."
        
        return (f"**{condition_name} Conditions**: There is a {prob_text} likelihood ({probability:.1f}%) of {condition_text}. "
                f"{recommendation} {trend_text} "
                f"The historical average for this date is {mean_value:.1f} {unit}.")


# Create singleton instance
statistics_service = StatisticsService()

