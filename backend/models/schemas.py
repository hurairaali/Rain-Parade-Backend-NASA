"""
Pydantic models/schemas for API requests and responses
"""
from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime
from datetime import date as date_type


# Location Models
class Location(BaseModel):
    latitude: float
    longitude: float
    name: Optional[str] = None
    address: Optional[str] = None
    bounds: Optional[dict] = None


# Weather Condition Types
WeatherConditionType = Literal['hot', 'cold', 'windy', 'wet', 'uncomfortable']


class WeatherThreshold(BaseModel):
    condition: WeatherConditionType
    value: float
    unit: str
    enabled: bool


class QueryParams(BaseModel):
    location: Location
    date: str  # Accept string and convert to date
    dayOfYear: Optional[int] = None
    conditions: List[WeatherConditionType]
    thresholds: List[WeatherThreshold]
    timeRange: Optional[dict] = Field(default_factory=lambda: {"start": 1980, "end": datetime.now().year - 1})
    
    @property
    def parsed_date(self) -> date_type:
        """Convert date string to date object, handling ISO format with timezone"""
        if isinstance(self.date, str):
            # Handle ISO format with timezone (e.g., "2025-10-05T10:37:03.655Z")
            if 'T' in self.date:
                return datetime.fromisoformat(self.date.replace('Z', '+00:00')).date()
            # Handle simple date format (e.g., "2025-10-05")
            return datetime.strptime(self.date, "%Y-%m-%d").date()
        return self.date


# Weather Data Models
class ProbabilityData(BaseModel):
    condition: WeatherConditionType
    probability: float  # 0-100
    mean: float
    median: float
    stdDev: float
    percentile25: float
    percentile75: float
    percentile90: float


class TrendData(BaseModel):
    year: int
    value: float
    condition: WeatherConditionType


class WeatherMetadata(BaseModel):
    dataSource: str
    lastUpdated: str
    yearsAnalyzed: int


class WeatherResults(BaseModel):
    location: Location
    queryDate: str  # Return as string for consistent JSON serialization
    probabilities: List[ProbabilityData]
    trends: List[TrendData]
    historicalData: dict
    summary: str
    riskLevel: Literal['low', 'medium', 'high']
    metadata: WeatherMetadata


# API Response Models
class APIResponse(BaseModel):
    success: bool
    data: Optional[dict] = None
    error: Optional[str] = None
    message: Optional[str] = None


# Location Search Models
class LocationSearchResult(BaseModel):
    id: str
    name: str
    address: str
    latitude: float
    longitude: float
