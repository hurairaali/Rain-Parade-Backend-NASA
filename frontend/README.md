# Rain Parade - Frontend

![NASA Space Apps Challenge 2025](https://img.shields.io/badge/NASA-Space_Apps_2025-0B3D91?style=for-the-badge&logo=nasa)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=for-the-badge&logo=vite)

**Will It Rain On My Parade?** - A beautiful web application that uses NASA Earth observation data to help users plan outdoor events by analyzing historical weather patterns.

## ✨ Features

- 🗺️ **Interactive Map** - Select locations using Mapbox with pin drop or area drawing
- 🔍 **Smart Search** - Autocomplete location search with geocoding
- 📊 **Beautiful Visualizations** - Probability charts, trend analysis, and distribution curves
- 📱 **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- 🎨 **NASA-Inspired UI** - Modern space-themed design with smooth animations
- 💾 **Data Export** - Download analysis results in CSV or JSON format
- ♿ **Accessible** - WCAG compliant with keyboard navigation support

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Maps**: Mapbox GL JS
- **Charts**: Chart.js with react-chartjs-2
- **HTTP Client**: Axios
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📋 Prerequisites

- Node.js 18+ and npm
- Mapbox API token ([Get one free here](https://www.mapbox.com/))
- Backend API running (see `/backend` folder)

## 🚀 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy the example environment file and add your API keys:

```bash
cp .env.example .env
```

Edit `.env` and add your Mapbox token:

```env
VITE_MAPBOX_TOKEN=your_mapbox_token_here
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### 4. Build for Production

```bash
npm run build
```

Built files will be in the `dist/` directory.

## 📁 Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── Layout/         # Header, Hero, Footer
│   │   ├── LocationSelection/  # Map and search components
│   │   ├── QueryInput/     # Date and condition selectors
│   │   ├── Visualization/  # Charts and graphs
│   │   ├── Dashboard/      # Results display
│   │   └── Export/         # Data export functionality
│   ├── services/           # API service layer
│   │   ├── api.ts          # Backend API client
│   │   └── mapbox.ts       # Mapbox integration
│   ├── utils/              # Utility functions
│   │   ├── dateUtils.ts    # Date formatting
│   │   └── weatherUtils.ts # Weather calculations
│   ├── types/              # TypeScript type definitions
│   │   └── index.ts        # Global types
│   ├── hooks/              # Custom React hooks (future)
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html             # HTML template
├── tailwind.config.js     # Tailwind configuration
├── tsconfig.json          # TypeScript configuration
└── vite.config.ts         # Vite configuration
```

## 🎨 Component Modules

### 1. Layout Module
- `Header.tsx` - Navigation bar with branding
- `Hero.tsx` - Landing page with feature showcase
- `Footer.tsx` - Footer with links and credits

### 2. Location Selection Module
- `LocationSelection.tsx` - Main location picker interface
- `MapComponent.tsx` - Interactive Mapbox map
- `SearchBox.tsx` - Location search with autocomplete

### 3. Query Input Module
- `QueryInput.tsx` - Main query form
- `DateSelector.tsx` - Date and day-of-year picker
- `WeatherConditions.tsx` - Condition checkboxes and thresholds

### 4. Visualization Module
- `ProbabilityChart.tsx` - Bar/line charts for probabilities
- `TrendChart.tsx` - Historical trend visualization
- `DistributionChart.tsx` - Bell curve distributions

### 5. Dashboard Module
- `Dashboard.tsx` - Results display with all visualizations
- Shows risk level, statistics, and summaries

### 6. Export Module
- `ExportPanel.tsx` - CSV/JSON data export

## 🌐 API Integration

The frontend communicates with the backend API using the following endpoints:

- `POST /api/weather/analyze` - Get weather analysis
- `GET /api/location/search` - Search locations
- `GET /api/location/reverse` - Reverse geocode
- `GET /api/weather/variables` - Get available variables
- `GET /api/health` - Health check

## 🎯 Usage Flow

1. **Landing Page**: User sees hero section with feature overview
2. **Location Selection**: User searches or clicks map to select location
3. **Query Configuration**: User selects date and weather conditions
4. **Analysis**: App fetches historical data from backend
5. **Results**: User views interactive charts and statistics
6. **Export**: User downloads data in preferred format

## 🔧 Configuration

### Tailwind CSS

Custom colors and utilities are defined in `tailwind.config.js`:
- NASA Blue (#0B3D91)
- Space Dark theme
- Custom animations (float, pulse-slow)
- Glass-morphism effects

### Environment Variables

- `VITE_MAPBOX_TOKEN` - Required for map functionality
- `VITE_API_BASE_URL` - Backend API endpoint (default: http://localhost:8000)
- `VITE_NASA_API_KEY` - Optional for direct NASA API access

## 🚢 Deployment

### Netlify

```bash
npm run build
# Deploy dist/ folder to Netlify
```

### Vercel

```bash
vercel --prod
```

### Docker

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
EXPOSE 80
```

## 📝 Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (if configured)

## 🤝 Contributing

This project was created for the NASA Space Apps Challenge 2025. Contributions welcome!

## 📄 License

MIT License - see LICENSE file for details

## 🙏 Acknowledgments

- NASA Earth Science Division for providing Earth observation data
- Mapbox for mapping services
- Chart.js for beautiful visualizations
- Tailwind CSS for styling framework

## 📧 Support

For questions or issues, please open an issue on GitHub.

---

Made with ❤️ for NASA Space Apps Challenge 2025