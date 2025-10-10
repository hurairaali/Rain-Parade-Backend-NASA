"""
Location geocoding API routes
"""
from fastapi import APIRouter, HTTPException, Query
from typing import List
from geopy.geocoders import Nominatim
from geopy.exc import GeocoderTimedOut, GeocoderServiceError
import logging

from models.schemas import Location, LocationSearchResult

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api/location", tags=["location"])

# Initialize geocoder
geolocator = Nominatim(user_agent="rain_parade_nasa_app")


@router.get("/search", response_model=List[LocationSearchResult])
async def search_locations(q: str = Query(..., min_length=2)):
    """
    Search for locations by name
    
    Args:
        q: Search query string
        
    Returns:
        List of matching locations with coordinates
    """
    try:
        # Search for locations
        locations = geolocator.geocode(
            q, 
            exactly_one=False, 
            limit=5,
            timeout=10
        )
        
        if not locations:
            return []
        
        results = []
        for idx, loc in enumerate(locations):
            results.append(LocationSearchResult(
                id=f"loc_{idx}",
                name=loc.address.split(',')[0],
                address=loc.address,
                latitude=loc.latitude,
                longitude=loc.longitude
            ))
        
        return results
        
    except (GeocoderTimedOut, GeocoderServiceError) as e:
        logger.error(f"Geocoding error: {e}")
        raise HTTPException(status_code=503, detail="Geocoding service unavailable")
    except Exception as e:
        logger.error(f"Location search error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/reverse", response_model=Location)
async def reverse_geocode(
    lat: float = Query(..., ge=-90, le=90),
    lon: float = Query(..., ge=-180, le=180)
):
    """
    Reverse geocode coordinates to location name
    
    Args:
        lat: Latitude
        lon: Longitude
        
    Returns:
        Location object with name and address
    """
    try:
        location = geolocator.reverse(
            f"{lat}, {lon}",
            timeout=10
        )
        
        if not location:
            # Return coordinates only if no address found
            return Location(
                latitude=lat,
                longitude=lon,
                name="Unknown Location"
            )
        
        return Location(
            latitude=lat,
            longitude=lon,
            name=location.address.split(',')[0],
            address=location.address
        )
        
    except (GeocoderTimedOut, GeocoderServiceError) as e:
        logger.error(f"Reverse geocoding error: {e}")
        raise HTTPException(status_code=503, detail="Geocoding service unavailable")
    except Exception as e:
        logger.error(f"Reverse geocode error: {e}")
        raise HTTPException(status_code=500, detail=str(e))


