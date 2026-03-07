# 🌧️ Rain Parade

<div align="center">

![NASA Space Apps Challenge 2025](https://img.shields.io/badge/NASA-Space_Apps_Challenge_2025-0B3D91?style=for-the-badge&logo=nasa&logoColor=white)
![Challenge](https://img.shields.io/badge/Challenge-Will_It_Rain_On_My_Parade%3F-FC3D21?style=for-the-badge)

**Plan your outdoor events with confidence using NASA's historical weather data**

[Features](#-features) • [Demo](#-demo) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Architecture](#-architecture)

</div>

---

## 📖 About

**Rain Parade** is a web application developed for the [NASA Space Apps Challenge 2025](https://www.spaceappschallenge.org/2025/challenges/will-it-rain-on-my-parade/) that helps users plan outdoor events by analyzing the likelihood of adverse weather conditions based on historical NASA Earth observation data.

Unlike weather forecasts, Rain Parade provides **probability analysis** based on decades of historical data, helping you understand what the weather has been like historically for any location and date.

## 🏆 Achievements

<div align="center">

![Global Nominee](https://img.shields.io/badge/🌟_Global_Nominee-NASA_Space_Apps_2025-0B3D91?style=for-the-badge)
![Galactic Problem Solver](https://img.shields.io/badge/🎖️_Galactic_Problem_Solver-Outstanding_Participation-FFD700?style=for-the-badge)

**2025 NASA Space Apps Challenge**
- 🌟 **Global Nominee** - Universal Event (October 4-5, 2025)
- 🎖️ **Galactic Problem Solver** - Outstanding Participation Certificate (October 4-5, 2025)
- 🚀 **Challenge**: "Will It Rain On My Parade?"

### 🌟 Global Nominees Badge

![Global Nominees 2025](./assets/[Local%20Lead%20Use]%202025%20NASA%20Space%20Apps%20Global%20Nominees%20Graphic.png)

### 🎖️ Galactic Problem Solver Certificate

![Galactic Problem Solver Certificate](./assets/certificate_huraira_114_2025__n_a_s_a__space__apps__challenge.jpeg)

</div>

---

## ✨ Features

### 🎯 Core Functionality
- **Interactive Location Selection** - Search, pin drop, or draw boundaries on an interactive map
- **Weather Condition Analysis** - Analyze 5 types of conditions:
  - 🌡️ Very Hot
  - ❄️ Very Cold
  - 💨 Very Windy
  - 🌧️ Very Wet
  - 😰 Very Uncomfortable
- **Flexible Date Selection** - Choose any date or day-of-year
- **Custom Thresholds** - Set your own definitions for "extreme" conditions

### 📊 Visualizations
- Probability bar charts with detailed statistics
- Bell curve probability distributions
- Historical trend analysis over decades
- Interactive and responsive charts

### 💾 Data Export
- Download results in **CSV** or **JSON** format
- Complete metadata and source information included
- Spreadsheet-ready formatting

### 🎨 User Experience
- Beautiful NASA-inspired space theme
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions
- Accessibility compliant (WCAG)
- Fast and performant

## 🛠️ Tech Stack

### Frontend
- **React 18** with **TypeScript**
- **Vite** for blazing-fast builds
- **Tailwind CSS** for styling
- **Mapbox GL JS** for interactive maps
- **Chart.js** for data visualization
- **Axios** for API communication

### Backend *(Coming Soon)*
- **FastAPI** (Python) for high-performance API
- **Pandas**, **NumPy**, **SciPy** for data processing
- **NASA Earthdata API** integration
- **Redis** for caching
- **PostgreSQL** for query logging (optional)

### Deployment
- **Frontend**: Netlify / Vercel
- **Backend**: AWS / Google Cloud
- **CI/CD**: GitHub Actions

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- [Mapbox API token](https://www.mapbox.com/) (free tier available)
- Python 3.9+ (for backend)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/rain-parade.git
cd rain-parade

# Setup Frontend
cd frontend
npm install
cp .env.example .env
# Add your Mapbox token to .env
npm run dev

# Setup Backend (in another terminal)
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Visit `http://localhost:5173` to see the app!

## 📁 Project Structure

```
Rain-Parade/
├── frontend/                # React TypeScript frontend
│   ├── src/
│   │   ├── components/     # React components (10 modules)
│   │   ├── services/       # API & Mapbox services
│   │   ├── types/          # TypeScript definitions
│   │   ├── utils/          # Utility functions
│   │   └── hooks/          # Custom React hooks
│   ├── public/             # Static assets
│   └── README.md           # Frontend documentation
│
├── backend/                # FastAPI Python backend
│   ├── api/                # API routes
│   ├── services/           # Business logic
│   ├── models/             # Data models
│   ├── utils/              # Utilities
│   └── README.md           # Backend documentation
│
└── README.md               # This file
```

## 🏗️ Architecture

### System Overview

```
┌─────────────┐         ┌──────────────┐         ┌─────────────────┐
│   Frontend  │  HTTP   │   Backend    │  API    │  NASA Earthdata │
│  (React TS) │ ◄─────► │  (FastAPI)   │ ◄─────► │      APIs       │
└─────────────┘         └──────────────┘         └─────────────────┘
       │                       │
       │                       ▼
       │                  ┌──────────┐
       │                  │  Redis   │
       │                  │  Cache   │
       ▼                  └──────────┘
┌─────────────┐
│   Mapbox    │
│     API     │
└─────────────┘
```

### Frontend Modules

1. **Layout** - Header, Hero, Footer components
2. **Location Selection** - Map, search, geocoding
3. **Query Input** - Date picker, condition selector
4. **Visualization** - Charts (probability, trend, distribution)
5. **Dashboard** - Results display and summary
6. **Export** - CSV/JSON data export
7. **Services** - API client, Mapbox integration
8. **Utils** - Helper functions
9. **Types** - TypeScript definitions
10. **Hooks** - Custom React hooks (future)

### Data Flow

1. User selects location via map or search
2. User specifies date and weather conditions
3. Frontend sends query to backend API
4. Backend fetches NASA historical data
5. Backend calculates probabilities and statistics
6. Backend returns processed results
7. Frontend visualizes data in charts
8. User exports data if desired

## 🌍 NASA Data Sources

This project utilizes NASA Earth Science Division data:

- **NASA POWER** - Prediction Of Worldwide Energy Resources
- **GPM** - Global Precipitation Measurement
- **MERRA-2** - Modern-Era Retrospective analysis
- **MODIS** - Moderate Resolution Imaging Spectroradiometer

## 📊 Statistics Calculated

For each weather condition:
- **Probability** of exceeding threshold (%)
- **Mean** and **Median** values
- **Standard Deviation**
- **Percentiles** (25th, 75th, 90th)
- **Historical trends** over time

## 🎯 Use Cases

- 🎉 **Event Planning** - Weddings, festivals, parades
- 🏃 **Outdoor Activities** - Hiking, camping, sports
- 🌾 **Agriculture** - Planting schedules, harvest planning
- 🏗️ **Construction** - Project timeline planning
- ✈️ **Travel** - Vacation destination selection

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **NASA Earth Science Division** for providing incredible Earth observation data
- **NASA Space Apps Challenge** organizers and volunteers
- **Mapbox** for mapping technology
- **Chart.js** for visualization library
- **Open source community** for amazing tools

## 👥 Team

*Add your team members here*

## 📧 Contact

- Project Link: [https://github.com/yourusername/rain-parade](https://github.com/yourusername/rain-parade)
- Challenge: [Will It Rain On My Parade?](https://www.spaceappschallenge.org/2025/challenges/will-it-rain-on-my-parade/)

---

<div align="center">

**Built with ❤️ for NASA Space Apps Challenge 2025**

[⬆ back to top](#-rain-parade)

</div>

