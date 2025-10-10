# Rain Parade - FastAPI Backend

Backend API for the Rain Parade weather analysis application using NASA POWER data.

## 🚀 Features

- **FastAPI Framework** - Modern, fast, high-performance
- **NASA POWER API Integration** - Historical weather data from 1980+
- **Statistical Analysis** - Probability calculations, trend analysis
- **Geocoding** - Location search and reverse geocoding
- **CORS Enabled** - Works with React frontend
- **Auto Documentation** - Swagger UI at `/docs`

## 📋 Prerequisites

- Python 3.9+
- pip

## 🛠️ Installation

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Create virtual environment:**
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. **Install dependencies:**
```bash
pip install -r requirements.txt
```

4. **Create environment file (optional):**
```bash
cp .env.example .env
```

## 🎯 Running the Server

### Development Mode
```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

The API will be available at:
- **API**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## 📚 API Endpoints

### Weather Analysis
- `POST /api/weather/analyze` - Analyze weather likelihood
- `GET /api/weather/variables` - Get available weather variables

### Location
- `GET /api/location/search?q={query}` - Search locations
- `GET /api/location/reverse?lat={lat}&lon={lon}` - Reverse geocode

### Health
- `GET /api/health` - Health check endpoint
- `GET /` - Root endpoint with API info

## 🏗️ Project Structure

```
backend/
├── main.py                 # FastAPI application entry point
├── requirements.txt        # Python dependencies
├── .env.example           # Environment variables template
├── api/
│   └── routes/
│       ├── weather.py     # Weather analysis endpoints
│       └── location.py    # Location/geocoding endpoints
├── models/
│   └── schemas.py         # Pydantic models
├── services/
│   ├── nasa_power.py      # NASA POWER API service
│   └── statistics.py      # Statistical analysis service
├── utils/                 # Utility functions
└── config/                # Configuration files
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file:

```env
HOST=0.0.0.0
PORT=8000
DEBUG=True
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
```

### CORS Configuration

The backend is configured to accept requests from:
- http://localhost:3000
- http://localhost:3001
- http://localhost:5173
- Your local network IP on port 3000/3001

Edit `main.py` to add more origins if needed.

## 📊 Data Sources

### NASA POWER API
- **Source**: https://power.larc.nasa.gov/
- **Data**: Global meteorological and solar energy data
- **Coverage**: 1980 - Present
- **Resolution**: Daily values
- **No API Key Required**: Free access

### Weather Parameters

| Condition | Parameter | Description |
|-----------|-----------|-------------|
| Hot | T2M_MAX | Maximum Temperature at 2m |
| Cold | T2M_MIN | Minimum Temperature at 2m |
| Windy | WS10M | Wind Speed at 10m |
| Wet | PRECTOTCORR | Precipitation Corrected |
| Uncomfortable | RH2M | Relative Humidity at 2m |

## 🧪 Testing

### Test Health Endpoint
```bash
curl http://localhost:8000/api/health
```

### Test Weather Analysis
```bash
curl -X POST http://localhost:8000/api/weather/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "location": {"latitude": 40.7128, "longitude": -74.0060},
    "date": "2024-10-05",
    "conditions": ["hot"],
    "thresholds": [
      {"condition": "hot", "value": 30, "unit": "°C", "enabled": true}
    ]
  }'
```

### Test Location Search
```bash
curl "http://localhost:8000/api/location/search?q=New+York"
```

## 📦 Dependencies

- **fastapi** - Web framework
- **uvicorn** - ASGI server
- **pandas** - Data manipulation
- **numpy** - Numerical computing
- **scipy** - Statistical functions
- **requests** - HTTP client for NASA API
- **geopy** - Geocoding services
- **pydantic** - Data validation

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

### Import Errors
Make sure you're in the backend directory and virtual environment is activated:
```bash
cd /path/to/Rain-Parade/backend
source venv/bin/activate
```

### NASA API Timeout
If NASA POWER API is slow, increase timeout in `services/nasa_power.py`:
```python
timeout=60  # Increase from 30
```

## 🚢 Deployment

### Docker (Optional)
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Cloud Deployment
- **Heroku**: `Procfile` with `web: uvicorn main:app --host 0.0.0.0 --port $PORT`
- **AWS**: Deploy on EC2 or Elastic Beanstalk
- **Google Cloud**: Deploy on Cloud Run

## 📝 License

MIT License - NASA Space Apps Challenge 2025

## 🙏 Acknowledgments

- NASA Earth Science Division
- NASA POWER API
- FastAPI Framework
- OpenStreetMap (via Geopy)


