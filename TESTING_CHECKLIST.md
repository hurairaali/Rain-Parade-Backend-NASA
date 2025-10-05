# Testing Checklist - Rain Parade Application

## ✅ Pre-Test Requirements

### Services Running
- [ ] Frontend: http://localhost:3000
- [ ] Backend: http://localhost:8000
- [ ] Backend health check returns `"status": "healthy"`

---

## 🧪 Backend API Tests (Terminal)

### Test 1: Health Check
```bash
curl http://localhost:8000/api/health
```
**Expected:** `{"success": true, "data": {"status": "healthy"}}`

### Test 2: Weather Variables
```bash
curl http://localhost:8000/api/weather/variables
```
**Expected:** List of conditions: hot, cold, windy, wet, uncomfortable

### Test 3: Weather Analysis (New York - Known Working)
```bash
curl -X POST http://localhost:8000/api/weather/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "location": {"latitude": 40.7128, "longitude": -74.006, "name": "New York"},
    "date": "2024-06-15",
    "conditions": ["hot"],
    "thresholds": [{"condition": "hot", "value": 90, "unit": "°F", "enabled": true}],
    "timeRange": {"start": 2015, "end": 2023}
  }' | python3 -m json.tool | head -30
```
**Expected:** 
- `probabilities`: Array with data (not empty)
- `trends`: Array with yearly data (not empty)
- `probability`: Number between 0-100

### Test 4: Multiple Conditions
```bash
curl -X POST http://localhost:8000/api/weather/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "location": {"latitude": 40.7128, "longitude": -74.006, "name": "New York"},
    "date": "2024-01-15",
    "conditions": ["cold", "windy"],
    "thresholds": [
      {"condition": "cold", "value": 32, "unit": "°F", "enabled": true},
      {"condition": "windy", "value": 15, "unit": "mph", "enabled": true}
    ],
    "timeRange": {"start": 2015, "end": 2023}
  }' | python3 -m json.tool | head -50
```
**Expected:** Multiple entries in `probabilities` array

---

## 🌐 Frontend Tests (Browser)

### Test 1: Home Page
**URL:** http://localhost:3000

- [ ] Page loads without errors
- [ ] Gradient background (dark blue/purple)
- [ ] "Rain Parade" title visible
- [ ] "NASA Space Apps 2025" subtitle
- [ ] Hero section with description
- [ ] "Get Started" button (blue, glowing)

### Test 2: Location Selection
**Action:** Click "Get Started"

#### Mapbox Map Display
- [ ] Dark-themed map appears
- [ ] Map fills the container (500px height)
- [ ] Globe projection visible
- [ ] Zoom controls on right side
- [ ] Fullscreen button visible
- [ ] Navigation controls working

#### Browser Console Checks (F12 → Console)
Look for these logs:
```
✅ 🗺️ Initializing Mapbox GL JS...
✅ Token available: Yes
✅ Token length: 93
✅ Map loaded successfully
```

#### Map Interaction
- [ ] **Click anywhere on map**
  - Blue marker (NASA blue) appears
  - Map smoothly flies to that location
  - Zoom level increases to 10

- [ ] **Search Box**
  - Type a city name (at least 3 characters)
  - Suggestions appear (if implemented)
  - Can select a location

### Test 3: Query Input
**After selecting location, Query Parameters card appears**

#### Date Selection
- [ ] Calendar icon visible
- [ ] Date picker opens on click
- [ ] Can select past/future dates
- [ ] Selected date displays correctly

#### Weather Conditions
- [ ] 5 condition cards displayed:
  - 🔥 Very Hot
  - ❄️ Very Cold  
  - 💨 Very Windy
  - 🌧️ Very Wet
  - 😰 Very Uncomfortable

- [ ] Click to toggle condition (active = highlighted)
- [ ] Threshold input appears when enabled
- [ ] Can adjust threshold values
- [ ] Unit labels correct (°F, mph, inches, index)

#### Submit Button
- [ ] "Analyze Weather Likelihood →" button visible
- [ ] Button DISABLED when no conditions selected
- [ ] Button ENABLED when at least 1 condition selected
- [ ] Button glows with gradient (purple to pink)

### Test 4: Loading State
**Action:** Click "Analyze Weather Likelihood"

- [ ] Loading spinner appears (rotating circle)
- [ ] Message: "Analyzing Weather Data..."
- [ ] Sub-message: "Fetching historical data from NASA POWER API"
- [ ] Query input is disabled/hidden during loading

### Test 5: Results Dashboard

#### Header
- [ ] "Weather Analysis Results" title
- [ ] Location displayed (name or coordinates)
- [ ] Query date formatted nicely
- [ ] Risk badge displayed:
  - Low Risk (green) / Medium (yellow) / High (red)
- [ ] "New Query" button visible

#### Summary Card
- [ ] Blue left border
- [ ] Summary text describing likelihood
- [ ] Metadata:
  - Data Source: "NASA POWER"
  - Years Analyzed: number
  - Last Updated: timestamp

#### Probability Cards
For each selected condition:
- [ ] Condition icon and name
- [ ] Large probability percentage
- [ ] Circular progress indicator
- [ ] Statistics:
  - Mean, Median, Std Deviation
  - 25th, 75th, 90th percentiles
  - All with units

#### Charts/Visualizations
- [ ] **Probability Chart**
  - Bar chart with colored bars per condition
  - Y-axis: Probability %
  - X-axis: Conditions
  - Legend visible

- [ ] **Trend Chart**
  - Line chart showing historical trends
  - X-axis: Years (1980-2023)
  - Y-axis: Values
  - Multiple lines if multiple conditions
  - Hover tooltips work

- [ ] **Distribution Chart** (if present)
  - Shows data distribution
  - Properly labeled axes

#### Export Panel
- [ ] Download buttons visible:
  - [ ] Download CSV
  - [ ] Download JSON
- [ ] Buttons functional (downloads file)

---

## 🐛 Common Issues & Fixes

### Issue 1: Blank Map
**Symptoms:** Map area is empty/dark
**Check:**
1. Browser console for errors
2. Network tab for canceled requests
3. `.env` file exists with `VITE_MAPBOX_TOKEN`

**Fix:**
```bash
cd /home/zeroday/Rain-Parade/frontend
cat .env  # Should show token on ONE line
```

### Issue 2: Empty Data (probabilities: [])
**Symptoms:** API returns 200 but arrays are empty
**Check Backend Logs:**
```bash
# Look for "NASA POWER API error: 422"
```

**Fixes:**
1. Use coordinates with less decimal precision (e.g., 40.71 instead of 40.71234567890)
2. Use known working locations: New York (40.7128, -74.006)
3. Ensure `timeRange.end` is 2023 or earlier
4. Try different condition (hot/cold/wet)

### Issue 3: Backend Not Responding
**Symptoms:** Network errors, connection refused
**Fix:**
```bash
# Restart backend
lsof -ti:8000 | xargs kill -9
cd /home/zeroday/Rain-Parade/backend
source venv/bin/activate
python main.py
```

### Issue 4: Frontend Not Updating
**Symptoms:** Changes not reflecting
**Fix:**
```bash
# Hard refresh browser: Ctrl + Shift + R
# Or clear browser cache
```

---

## 📊 Test Scenarios

### Scenario 1: Summer Heat Wave (June 15)
**Location:** New York (40.7128, -74.006)
**Date:** June 15, 2024
**Conditions:** Very Hot (>90°F)
**Expected:** Low to medium probability (~10-30%)

### Scenario 2: Winter Cold Snap (January 15)
**Location:** New York (40.7128, -74.006)
**Date:** January 15, 2024
**Conditions:** Very Cold (<32°F)
**Expected:** Higher probability (~40-60%)

### Scenario 3: Multiple Conditions
**Location:** Chicago (41.8781, -87.6298)
**Date:** March 15, 2024
**Conditions:** Cold + Windy
**Expected:** Both probabilities shown, separate charts

### Scenario 4: Different Time Range
**Location:** Los Angeles (34.0522, -118.2437)
**Date:** July 4, 2024
**Conditions:** Very Hot (>95°F)
**Time Range:** 2010-2023 (shorter range)
**Expected:** Data only from recent years

---

## ✅ Final Checks

### Performance
- [ ] Map loads within 2 seconds
- [ ] API responses < 5 seconds
- [ ] No console errors
- [ ] Smooth animations

### Responsive Design
- [ ] Works on desktop (1920x1080)
- [ ] Works on tablet (768px width)
- [ ] Works on mobile (375px width)
- [ ] Map resizes properly

### Data Accuracy
- [ ] Probabilities between 0-100
- [ ] Trends show historical patterns
- [ ] Risk levels make sense
- [ ] Units are correct

### Edge Cases
- [ ] Selects location at edge of map (e.g., near poles)
- [ ] Selects far future date
- [ ] Selects all 5 conditions at once
- [ ] Tries to submit without selecting conditions

---

## 📝 Notes

- NASA POWER API has ~2 year data lag (2025 data not available yet)
- Some coordinates may return 422 errors (use rounded values)
- Map requires valid Mapbox token
- Backend needs to be running before frontend tests

**Last Updated:** October 5, 2025

