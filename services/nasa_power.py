"""
NASA POWER API Service
Fetches historical weather data from NASA POWER API
"""
import requests
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, Optional, List
import logging

logger = logging.getLogger(__name__)


class NASAPowerService:
    """Service to interact with NASA POWER API"""
    
    BASE_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"
    
    # Weather parameter mappings
    PARAMETERS = {
        'hot': 'T2M_MAX',           # Maximum temperature
        'cold': 'T2M_MIN',          # Minimum temperature
        'windy': 'WS10M',           # Wind speed at 10m
        'wet': 'PRECTOTCORR',       # Precipitation corrected
        'uncomfortable': 'RH2M'      # Relative humidity (for heat index calculation)
    }
    
    # Parameter-specific start years (NASA POWER DAILY data starts from 1981 for all parameters)
    PARAMETER_START_YEARS = {
        'T2M_MAX': 1981,      # Temperature daily data from 1981
        'T2M_MIN': 1981,      # Temperature daily data from 1981
        'WS10M': 1981,        # Wind data starts from 1981
        'PRECTOTCORR': 1981,  # Precipitation from 1981
        'RH2M': 1981          # Humidity from 1981
    }
    
    def __init__(self):
        self.session = requests.Session()
    
    def fetch_historical_data(
        self, 
        latitude: float, 
        longitude: float, 
        start_year: int, 
        end_year: int,
        parameter: str
    ) -> Optional[Dict]:
        """
        Fetch historical weather data from NASA POWER API
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            start_year: Start year for data
            end_year: End year for data
            parameter: NASA POWER parameter code
            
        Returns:
            JSON response from API or None if error
        """
        # Calculate appropriate end date
        # NASA POWER typically has data up to previous year or with significant delay
        current_year = datetime.now().year
        
        # NASA POWER API often doesn't have current year data available yet
        # Use 2 years back as safe default (data often lags significantly)
        if end_year >= current_year - 1:
            # Use 2023 or earlier for reliable data
            end_year = current_year - 2
            end_date_str = f"{end_year}1231"
            logger.info(f"Adjusted end year to {end_year} (NASA POWER data availability)")
        else:
            # For past years, use December 31
            end_date_str = f"{end_year}1231"
        
        # Adjust start year based on parameter availability
        # Different parameters have different start dates in NASA POWER
        parameter_start_year = self.PARAMETER_START_YEARS.get(parameter, 1981)
        if start_year < parameter_start_year:
            start_year = parameter_start_year
            logger.info(f"Adjusted start year to {start_year} for parameter {parameter}")
        
        # Round coordinates to 4 decimal places for NASA API compatibility
        # (too many decimals can cause 422 errors)
        rounded_lat = round(latitude, 4)
        rounded_lon = round(longitude, 4)
        
        params = {
            "parameters": parameter,
            "community": "RE",  # Renewable Energy community
            "longitude": f"{rounded_lon}",
            "latitude": f"{rounded_lat}",
            "start": f"{start_year}0101",
            "end": end_date_str,
            "format": "JSON",
        }
        
        try:
            response = self.session.get(
                self.BASE_URL, 
                params=params, 
                timeout=30
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            logger.error(f"NASA POWER API error: {e}")
            return None
    
    def parse_data_to_dataframe(
        self, 
        json_data: Dict, 
        parameter: str
    ) -> pd.DataFrame:
        """
        Parse NASA POWER JSON response to pandas DataFrame
        
        Args:
            json_data: JSON response from API
            parameter: Parameter code
            
        Returns:
            DataFrame with date and parameter columns
        """
        data = json_data.get("properties", {}).get("parameter", {}).get(parameter, {})
        
        if not data:
            # Try alternative structure
            alt = json_data.get("properties", {}).get("parameter", {})
            if alt:
                data = list(alt.values())[0] if alt else {}
                logger.info(f"Using alternative data structure for {parameter}")
        
        if not data:
            logger.warning(f"No data found in NASA response for parameter: {parameter}")
            logger.debug(f"Response structure: {list(json_data.get('properties', {}).get('parameter', {}).keys())}")
            return pd.DataFrame()
        
        logger.info(f"Found {len(data)} data points for parameter {parameter}")
        
        records = []
        for date_str, value in data.items():
            try:
                if len(date_str) == 8:  # YYYYMMDD
                    date = pd.to_datetime(date_str, format="%Y%m%d")
                elif len(date_str) == 6:  # YYYYMM
                    date = pd.to_datetime(date_str + "01", format="%Y%m%d")
                else:
                    continue
                
                # Filter out invalid values (-999 is NASA's missing data indicator)
                if value != -999:
                    records.append({"date": date, parameter: value})
            except Exception as e:
                logger.warning(f"Error parsing date {date_str}: {e}")
                continue
        
        df = pd.DataFrame(records).sort_values("date").reset_index(drop=True)
        return df
    
    def get_data_for_condition(
        self,
        latitude: float,
        longitude: float,
        condition: str,
        start_year: int = 1980,
        end_year: int = None
    ) -> pd.DataFrame:
        """
        Get historical data for a specific weather condition
        
        Args:
            latitude: Location latitude
            longitude: Location longitude
            condition: Weather condition (hot, cold, windy, wet, uncomfortable)
            start_year: Start year for data
            end_year: End year (defaults to current year)
            
        Returns:
            DataFrame with historical data
        """
        if end_year is None:
            end_year = datetime.now().year
        
        parameter = self.PARAMETERS.get(condition)
        if not parameter:
            logger.error(f"Unknown condition: {condition}")
            return pd.DataFrame()
        
        json_data = self.fetch_historical_data(
            latitude, longitude, start_year, end_year, parameter
        )
        
        if not json_data:
            return pd.DataFrame()
        
        return self.parse_data_to_dataframe(json_data, parameter)
    
    def get_day_of_year_data(
        self,
        df: pd.DataFrame,
        day_of_year: int,
        parameter: str
    ) -> pd.DataFrame:
        """
        Filter dataframe for specific day of year across all years
        
        Args:
            df: Input dataframe
            day_of_year: Day of year (1-366)
            parameter: Parameter column name
            
        Returns:
            Filtered dataframe
        """
        df["doy"] = df["date"].dt.dayofyear
        filtered = df[df["doy"] == day_of_year].copy()
        return filtered


# Create singleton instance
nasa_power_service = NASAPowerService()
