"""
Test Suite for NASA Space Apps Challenge - Backend API
Tests all requirements from the challenge specification
"""
import requests
import json
from datetime import datetime, date
import time

# Configuration
BASE_URL = "http://localhost:8000"
TEST_RESULTS = []

def print_test_result(test_name, passed, message=""):
    """Print and store test results"""
    status = "✅ PASS" if passed else "❌ FAIL"
    result = f"{status} | {test_name}"
    if message:
        result += f" | {message}"
    print(result)
    TEST_RESULTS.append({
        "test": test_name,
        "passed": passed,
        "message": message
    })
    return passed

def test_health_check():
    """Test: API is running and accessible"""
    try:
        response = requests.get(f"{BASE_URL}/api/health", timeout=5)
        return print_test_result(
            "API Health Check",
            response.status_code == 200,
            f"Status: {response.status_code}"
        )
    except Exception as e:
        return print_test_result("API Health Check", False, str(e))

def test_location_search():
    """Test: Location search functionality"""
    try:
        response = requests.get(
            f"{BASE_URL}/api/location/search",
            params={"q": "New York"},
            timeout=10
        )
        data = response.json()
        passed = (
            response.status_code == 200 and
            isinstance(data, list) and
            len(data) > 0 and
            "latitude" in data[0] and
            "longitude" in data[0]
        )
        return print_test_result(
            "Location Search",
            passed,
            f"Found {len(data) if isinstance(data, list) else 0} locations"
        )
    except Exception as e:
        return print_test_result("Location Search", False, str(e))

def test_weather_analysis_hot():
    """Test: Weather analysis for 'Very Hot' condition"""
    try:
        payload = {
            "location": {
                "latitude": 33.6844,
                "longitude": 73.0479,
                "name": "Islamabad",
                "address": "Islamabad, Pakistan"
            },
            "date": "2024-07-15",
            "dayOfYear": 197,
            "conditions": ["hot"],
            "thresholds": [
                {
                    "condition": "hot",
                    "value": 35,
                    "unit": "°C",
                    "enabled": True
                }
            ],
            "timeRange": {
                "start": 2015,
                "end": 2024
            }
        }
        
        response = requests.post(
            f"{BASE_URL}/api/weather/analyze",
            json=payload,
            timeout=60
        )
        
        if response.status_code == 200:
            data = response.json()
            passed = (
                "probabilities" in data and
                "trends" in data and
                "historicalData" in data and
                "summary" in data and
                "riskLevel" in data and
                "metadata" in data
            )
            return print_test_result(
                "Weather Analysis - Very Hot",
                passed,
                f"Risk: {data.get('riskLevel', 'N/A')}"
            )
        else:
            return print_test_result(
                "Weather Analysis - Very Hot",
                False,
                f"Status: {response.status_code}"
            )
    except Exception as e:
        return print_test_result("Weather Analysis - Very Hot", False, str(e))

def test_weather_analysis_cold():
    """Test: Weather analysis for 'Very Cold' condition"""
    try:
        payload = {
            "location": {
                "latitude": 33.6844,
                "longitude": 73.0479,
                "name": "Islamabad",
                "address": "Islamabad, Pakistan"
            },
            "date": "2024-01-15",
            "dayOfYear": 15,
            "conditions": ["cold"],
            "thresholds": [
                {
                    "condition": "cold",
                    "value": 5,
                    "unit": "°C",
                    "enabled": True
                }
            ],
            "timeRange": {
                "start": 2015,
                "end": 2024
            }
        }
        
        response = requests.post(
            f"{BASE_URL}/api/weather/analyze",
            json=payload,
            timeout=60
        )
        
        passed = response.status_code == 200
        return print_test_result(
            "Weather Analysis - Very Cold",
            passed,
            f"Status: {response.status_code}"
        )
    except Exception as e:
        return print_test_result("Weather Analysis - Very Cold", False, str(e))

def test_weather_analysis_windy():
    """Test: Weather analysis for 'Very Windy' condition"""
    try:
        payload = {
            "location": {
                "latitude": 33.6844,
                "longitude": 73.0479,
                "name": "Islamabad",
                "address": "Islamabad, Pakistan"
            },
            "date": "2024-03-15",
            "dayOfYear": 75,
            "conditions": ["windy"],
            "thresholds": [
                {
                    "condition": "windy",
                    "value": 20,
                    "unit": "km/h",
                    "enabled": True
                }
            ],
            "timeRange": {
                "start": 2015,
                "end": 2024
            }
        }
        
        response = requests.post(
            f"{BASE_URL}/api/weather/analyze",
            json=payload,
            timeout=60
        )
        
        passed = response.status_code == 200
        return print_test_result(
            "Weather Analysis - Very Windy",
            passed,
            f"Status: {response.status_code}"
        )
    except Exception as e:
        return print_test_result("Weather Analysis - Very Windy", False, str(e))

def test_weather_analysis_wet():
    """Test: Weather analysis for 'Very Wet' condition"""
    try:
        payload = {
            "location": {
                "latitude": 31.5204,
                "longitude": 74.3587,
                "name": "Lahore",
                "address": "Lahore, Pakistan"
            },
            "date": "2024-08-15",
            "dayOfYear": 228,
            "conditions": ["wet"],
            "thresholds": [
                {
                    "condition": "wet",
                    "value": 10,
                    "unit": "mm",
                    "enabled": True
                }
            ],
            "timeRange": {
                "start": 2015,
                "end": 2024
            }
        }
        
        response = requests.post(
            f"{BASE_URL}/api/weather/analyze",
            json=payload,
            timeout=60
        )
        
        passed = response.status_code == 200
        return print_test_result(
            "Weather Analysis - Very Wet",
            passed,
            f"Status: {response.status_code}"
        )
    except Exception as e:
        return print_test_result("Weather Analysis - Very Wet", False, str(e))

def test_weather_analysis_uncomfortable():
    """Test: Weather analysis for 'Very Uncomfortable' condition"""
    try:
        payload = {
            "location": {
                "latitude": 24.8607,
                "longitude": 67.0011,
                "name": "Karachi",
                "address": "Karachi, Pakistan"
            },
            "date": "2024-06-15",
            "dayOfYear": 167,
            "conditions": ["uncomfortable"],
            "thresholds": [
                {
                    "condition": "uncomfortable",
                    "value": 70,
                    "unit": "%",
                    "enabled": True
                }
            ],
            "timeRange": {
                "start": 2015,
                "end": 2024
            }
        }
        
        response = requests.post(
            f"{BASE_URL}/api/weather/analyze",
            json=payload,
            timeout=60
        )
        
        passed = response.status_code == 200
        return print_test_result(
            "Weather Analysis - Very Uncomfortable",
            passed,
            f"Status: {response.status_code}"
        )
    except Exception as e:
        return print_test_result("Weather Analysis - Very Uncomfortable", False, str(e))

def test_multiple_conditions():
    """Test: Analysis with multiple weather conditions"""
    try:
        payload = {
            "location": {
                "latitude": 33.6844,
                "longitude": 73.0479,
                "name": "Islamabad",
                "address": "Islamabad, Pakistan"
            },
            "date": "2024-07-15",
            "dayOfYear": 197,
            "conditions": ["hot", "windy"],
            "thresholds": [
                {
                    "condition": "hot",
                    "value": 35,
                    "unit": "°C",
                    "enabled": True
                },
                {
                    "condition": "windy",
                    "value": 20,
                    "unit": "km/h",
                    "enabled": True
                }
            ],
            "timeRange": {
                "start": 2015,
                "end": 2024
            }
        }
        
        response = requests.post(
            f"{BASE_URL}/api/weather/analyze",
            json=payload,
            timeout=60
        )
        
        if response.status_code == 200:
            data = response.json()
            passed = len(data.get("probabilities", [])) >= 2
            return print_test_result(
                "Multiple Conditions Analysis",
                passed,
                f"Analyzed {len(data.get('probabilities', []))} conditions"
            )
        else:
            return print_test_result(
                "Multiple Conditions Analysis",
                False,
                f"Status: {response.status_code}"
            )
    except Exception as e:
        return print_test_result("Multiple Conditions Analysis", False, str(e))

def test_historical_data_range():
    """Test: Historical data covers required time range (1980-present)"""
    try:
        payload = {
            "location": {
                "latitude": 33.6844,
                "longitude": 73.0479,
                "name": "Islamabad",
                "address": "Islamabad, Pakistan"
            },
            "date": "2024-07-15",
            "dayOfYear": 197,
            "conditions": ["hot"],
            "thresholds": [
                {
                    "condition": "hot",
                    "value": 35,
                    "unit": "°C",
                    "enabled": True
                }
            ],
            "timeRange": {
                "start": 1980,
                "end": 2024
            }
        }
        
        response = requests.post(
            f"{BASE_URL}/api/weather/analyze",
            json=payload,
            timeout=60
        )
        
        if response.status_code == 200:
            data = response.json()
            years_analyzed = data.get("metadata", {}).get("yearsAnalyzed", 0)
            passed = years_analyzed >= 40
            return print_test_result(
                "Historical Data Range (1980-present)",
                passed,
                f"Years analyzed: {years_analyzed}"
            )
        else:
            return print_test_result(
                "Historical Data Range",
                False,
                f"Status: {response.status_code}"
            )
    except Exception as e:
        return print_test_result("Historical Data Range", False, str(e))

def test_probability_calculation():
    """Test: Probability calculations are present and valid"""
    try:
        payload = {
            "location": {
                "latitude": 33.6844,
                "longitude": 73.0479,
                "name": "Islamabad",
                "address": "Islamabad, Pakistan"
            },
            "date": "2024-07-15",
            "dayOfYear": 197,
            "conditions": ["hot"],
            "thresholds": [
                {
                    "condition": "hot",
                    "value": 35,
                    "unit": "°C",
                    "enabled": True
                }
            ],
            "timeRange": {
                "start": 2015,
                "end": 2024
            }
        }
        
        response = requests.post(
            f"{BASE_URL}/api/weather/analyze",
            json=payload,
            timeout=60
        )
        
        if response.status_code == 200:
            data = response.json()
            probabilities = data.get("probabilities", [])
            if probabilities:
                prob = probabilities[0]
                passed = (
                    "probability" in prob and
                    0 <= prob["probability"] <= 100
                )
                return print_test_result(
                    "Probability Calculation",
                    passed,
                    f"Probability: {prob.get('probability', 'N/A')}%"
                )
            else:
                return print_test_result(
                    "Probability Calculation",
                    False,
                    "No probabilities returned"
                )
        else:
            return print_test_result(
                "Probability Calculation",
                False,
                f"Status: {response.status_code}"
            )
    except Exception as e:
        return print_test_result("Probability Calculation", False, str(e))

def test_trend_analysis():
    """Test: Trend analysis (historical data over time)"""
    try:
        payload = {
            "location": {
                "latitude": 33.6844,
                "longitude": 73.0479,
                "name": "Islamabad",
                "address": "Islamabad, Pakistan"
            },
            "date": "2024-07-15",
            "dayOfYear": 197,
            "conditions": ["hot"],
            "thresholds": [
                {
                    "condition": "hot",
                    "value": 35,
                    "unit": "°C",
                    "enabled": True
                }
            ],
            "timeRange": {
                "start": 2000,
                "end": 2024
            }
        }
        
        response = requests.post(
            f"{BASE_URL}/api/weather/analyze",
            json=payload,
            timeout=60
        )
        
        if response.status_code == 200:
            data = response.json()
            trends = data.get("trends", [])
            # Check if trends contains historical yearly data
            passed = (
                len(trends) > 0 and 
                "year" in trends[0] and 
                "value" in trends[0] and
                "condition" in trends[0]
            )
            # Calculate basic trend direction
            if len(trends) >= 2:
                first_val = trends[0]["value"]
                last_val = trends[-1]["value"]
                trend_dir = "increasing" if last_val > first_val else "decreasing" if last_val < first_val else "stable"
            else:
                trend_dir = "insufficient data"
            
            return print_test_result(
                "Trend Analysis (Historical Data)",
                passed,
                f"{len(trends)} years | Trend: {trend_dir}"
            )
        else:
            return print_test_result(
                "Trend Analysis",
                False,
                f"Status: {response.status_code}"
            )
    except Exception as e:
        return print_test_result("Trend Analysis", False, str(e))

def test_cors_headers():
    """Test: CORS headers for frontend integration"""
    try:
        response = requests.options(
            f"{BASE_URL}/api/weather/analyze",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "POST"
            },
            timeout=5
        )
        
        cors_headers = response.headers.get("Access-Control-Allow-Origin")
        passed = cors_headers is not None
        return print_test_result(
            "CORS Configuration",
            passed,
            f"CORS: {cors_headers if cors_headers else 'Not configured'}"
        )
    except Exception as e:
        return print_test_result("CORS Configuration", False, str(e))

def print_summary():
    """Print test summary"""
    print("\n" + "="*70)
    print("TEST SUMMARY - NASA SPACE APPS CHALLENGE REQUIREMENTS")
    print("="*70)
    
    passed_tests = sum(1 for r in TEST_RESULTS if r["passed"])
    total_tests = len(TEST_RESULTS)
    percentage = (passed_tests / total_tests * 100) if total_tests > 0 else 0
    
    print(f"\nTotal Tests: {total_tests}")
    print(f"Passed: {passed_tests}")
    print(f"Failed: {total_tests - passed_tests}")
    print(f"Success Rate: {percentage:.1f}%")
    
    if passed_tests == total_tests:
        print("\n🎉 ALL TESTS PASSED! Application meets NASA challenge requirements!")
    else:
        print("\n⚠️  Some tests failed. Review the results above.")
        print("\nFailed Tests:")
        for result in TEST_RESULTS:
            if not result["passed"]:
                print(f"  - {result['test']}: {result['message']}")
    
    print("="*70 + "\n")
    
    return percentage

def main():
    """Run all tests"""
    print("\n" + "="*70)
    print("NASA SPACE APPS CHALLENGE 2025 - API TEST SUITE")
    print("Challenge: Will It Rain On My Parade?")
    print("="*70 + "\n")
    
    print("Testing Backend API Functionality...\n")
    
    # Core functionality tests
    test_health_check()
    test_location_search()
    
    print("\nTesting 5 Weather Conditions (Challenge Requirement)...\n")
    test_weather_analysis_hot()
    test_weather_analysis_cold()
    test_weather_analysis_windy()
    test_weather_analysis_wet()
    test_weather_analysis_uncomfortable()
    
    print("\nTesting Additional Requirements...\n")
    test_multiple_conditions()
    test_historical_data_range()
    test_probability_calculation()
    test_trend_analysis()
    test_cors_headers()
    
    # Print summary
    percentage = print_summary()
    
    # Save results to file
    with open("/home/zeroday/Rain-Parade/test_results.json", "w") as f:
        json.dump({
            "timestamp": datetime.now().isoformat(),
            "summary": {
                "total": len(TEST_RESULTS),
                "passed": sum(1 for r in TEST_RESULTS if r["passed"]),
                "failed": sum(1 for r in TEST_RESULTS if not r["passed"]),
                "success_rate": percentage
            },
            "tests": TEST_RESULTS
        }, f, indent=2)
    
    print("Results saved to: test_results.json\n")

if __name__ == "__main__":
    main()

