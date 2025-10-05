"""
Debug script to test NASA API and data processing
"""
import sys
sys.path.insert(0, '/home/zeroday/Rain-Parade/backend')

from services.nasa_power import nasa_power_service
from datetime import datetime

# Test parameters
lat = 41.94
lon = -97.78
condition = 'hot'
start_year = 1980
end_year = 2023

print(f"🧪 Testing NASA API for location: {lat}, {lon}")
print(f"Condition: {condition}, Years: {start_year}-{end_year}\n")

# Step 1: Get data for condition
print("Step 1: Fetching data from NASA...")
df = nasa_power_service.get_data_for_condition(
    lat, lon, condition, start_year, end_year
)

print(f"✅ Data fetched: {len(df)} rows")
if not df.empty:
    print(f"Columns: {df.columns.tolist()}")
    print(f"Date range: {df['date'].min()} to {df['date'].max()}")
    print(f"Sample data:\n{df.head()}\n")
else:
    print("❌ DataFrame is empty!\n")
    sys.exit(1)

# Step 2: Filter for specific day of year (June 15 = day 167)
print("Step 2: Filtering for day of year 167 (June 15)...")
parameter = nasa_power_service.PARAMETERS.get(condition)
day_data = nasa_power_service.get_day_of_year_data(df, 167, parameter)

print(f"✅ Filtered data: {len(day_data)} rows")
if not day_data.empty:
    print(f"Years found: {sorted(day_data['date'].dt.year.unique().tolist())}")
    print(f"Sample filtered data:\n{day_data.head()}\n")
    print(f"Values: {day_data[parameter].dropna().tolist()[:10]}")
else:
    print("❌ No data for day 167!")
    print(f"Available days of year: {sorted(df['date'].dt.dayofyear.unique().tolist())[:20]}")

print("\n✅ Debug test complete!")


