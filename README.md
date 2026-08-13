<div align="center">

# 🌿 GreenLens

### Environmental Simulation & Visualization Platform for Indian Cities

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Gemini AI](https://img.shields.io/badge/Gemini_AI-2.0%2F1.5-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

GreenLens is an interactive, AI-powered web application that lets you **simulate, visualize, and understand** the ecological impact of urban forestry decisions across Indian cities — from Delhi to Gangtok.

</div>

---

## 📋 Table of Contents

1. [Overview](#-overview)
2. [Features](#-features)
3. [Tech Stack](#-tech-stack)
4. [Project Architecture](#-project-architecture)
5. [Getting Started](#-getting-started)
   - [Prerequisites](#prerequisites)
   - [Installation](#installation)
   - [Environment Variables](#environment-variables)
   - [Running the App](#running-the-app)
6. [Application Pages](#-application-pages)
7. [API Reference](#-api-reference)
   - [Gemini AI Analysis](#-gemini-ai-analysis)
   - [Environment Metrics](#-environment-metrics)
   - [Simulation Impact](#-simulation-impact)
8. [Simulation Engine](#-simulation-engine)
9. [City Data Model](#-city-data-model)
10. [Security](#-security)
11. [Available Scripts](#-available-scripts)
12. [Contributing](#-contributing)

---

## 🌍 Overview

GreenLens is built for a singular purpose: **making environmental data accessible and actionable**. By combining real-time weather feeds, deterministic urban canopy models, and Google Gemini's scientific reasoning, it creates an educational sandbox where planners, students, and advocates can explore the real-world consequences of urban green cover decisions.

The platform covers **35+ Indian cities** across every state and union territory, with detailed zone-level data for 5 major metros.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🗺️ **Interactive Map** | Visualize heat, AQI, and green cover layers for any Indian city on a live Leaflet.js map |
| 🧪 **What-If Simulator** | Adjust hectares of forest planted or removed and instantly see projected environmental impact |
| 🤖 **AI Analysis** | Gemini AI provides 3-sentence scientist-level recommendations based on your simulation data |
| 📊 **Historical Trends** | Track green cover decline/growth from 2010–2024 with annotated key urban events |
| 🏆 **GreenLens Score** | A composite 0–100 ecological health score derived from temperature, AQI, flood risk, and green cover |
| 🌐 **35+ Cities** | Covers all Indian states and Union Territories with auto-generated zone data |
| ⚖️ **Equity Alerts** | Flags zones with high population density and critically low green cover |
| 🎓 **Learn Hub** | Curated educational content on urban ecology and sustainable city planning |

---

## 🛠️ Tech Stack

### Core

| Layer | Technology | Version |
|---|---|---|
| UI Framework | [React](https://react.dev/) | ^19.2.4 |
| Build Tool | [Vite](https://vitejs.dev/) | ^8.0.4 |
| Styling | [Tailwind CSS](https://tailwindcss.com/) | ^4.2.2 |
| Routing | [React Router DOM](https://reactrouter.com/) | ^7.14.0 |

### Mapping & Visualization

| Library | Purpose |
|---|---|
| [Leaflet.js](https://leafletjs.com/) | Base map rendering |
| [React-Leaflet](https://react-leaflet.js.org/) | React bindings for Leaflet |
| [Leaflet-Draw](https://leaflet.github.io/Leaflet.draw/) | Zone drawing tool on map |
| [Recharts](https://recharts.org/) | Historical data charts |

### AI & External APIs

| Service | Purpose | Auth |
|---|---|---|
| [Google Gemini API](https://ai.google.dev/) | AI-powered scientific analysis | API Key (server-side) |
| [Open-Meteo](https://open-meteo.com/) | Real-time temperature & wind data | None (free) |
| [Google Earth Engine](https://earthengine.google.com/) | Satellite green cover data | Service Account (optional) |

---

## 🏗️ Project Architecture

```
greenlens/
│
├── 📄 index.html                 # HTML entry point
├── 📄 vite.config.js             # Vite config, Babel, and server-side API proxies
├── 📄 .env                       # Environment secrets (not committed)
├── 📄 package.json
│
└── src/
    ├── 📄 main.jsx               # React root mount
    ├── 📄 App.jsx                # Router setup and layout shell
    ├── 📄 index.css              # Tailwind 4 config + global design tokens
    │
    ├── api/
    │   └── 📄 gemini.js          # Client → Vite proxy fetch for Gemini analysis
    │
    ├── components/
    │   ├── 📄 Navbar.jsx         # Top navigation bar with route links
    │   ├── 📄 Footer.jsx         # Site footer
    │   ├── 📄 ImpactCard.jsx     # Metric card for temperature / AQI / flood data
    │   ├── 📄 GreenLensScore.jsx # Composite ecological score display
    │   ├── 📄 LayerToggle.jsx    # Map layer toggle control (heat/green/AQI)
    │   └── 📄 ZoneCard.jsx       # Per-zone summary card in the Explore view
    │
    ├── data/
    │   └── 📄 cityData.js        # 35+ city definitions + zone data + history
    │
    ├── pages/
    │   ├── 📄 Landing.jsx        # Home / hero page
    │   ├── 📄 Explore.jsx        # City explorer with map + zone selector
    │   ├── 📄 Simulate.jsx       # What-if simulator with AI analysis panel
    │   ├── 📄 History.jsx        # Historical green cover trend viewer
    │   └── 📄 Learn.jsx          # Educational resources hub
    │
    └── utils/
        └── 📄 calculations.js    # Core simulation math (temp, AQI, flood, score)
```

### Data Flow

```
User Interaction (Simulate Page)
        │
        ▼
calculations.js          ← Local simulation formulas
        │
        ├──► /api/simulation-impact  (Vite proxy, precise server calc)
        │
        └──► /api/gemini-analysis    (Vite proxy → Gemini API, key hidden)
                                            │
                                            ▼
                                    AI Analysis Text returned to UI
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher ([download](https://nodejs.org/))
- **npm** (included with Node) or **yarn**
- A **Gemini API Key** — get one free at [Google AI Studio](https://aistudio.google.com/app/apikey)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/your-username/greenlens.git
cd greenlens
```

**2. Install dependencies**

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root. The required variables are:

```env
# ── Required ───────────────────────────────────────────────────
# Gemini API key — used server-side only, never sent to browser
GEMINI_API_KEY=your_gemini_api_key_here

# ── Optional: Google Earth Engine (for real satellite data) ────
GEE_PROJECT=your_gee_project_id
GEE_API_KEY=your_gee_api_key

# ── Optional: GEE Service Account (higher quota) ───────────────
GEE_SERVICE_ACCOUNT_EMAIL=your-sa@your-project.iam.gserviceaccount.com
GEE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n..."
```

> **Note**: Without a Gemini API key, the AI analysis panel will show a graceful "unavailable" message. All other features work without any API keys, using Open-Meteo (weather) and deterministic fallback models (green cover).

### Running the App

**Development server** (with hot-reload):

```bash
npm run dev
```

The app starts at **http://localhost:5173**.

**Production build:**

```bash
npm run build
npm run preview
```

---

## 📄 Application Pages

| Route | Page | Description |
|---|---|---|
| `/` | **Landing** | Hero page with platform overview and call-to-action |
| `/explore` | **Explore** | Interactive city map, zone cards, and live environmental metrics |
| `/simulate` | **Simulate** | "What-if" slider tool + Gemini AI analysis panel |
| `/history` | **History** | Line charts of green cover trend (2010–2024) per city |
| `/learn` | **Learn** | Educational resource hub on urban ecology |

---

## 🔌 API Reference

All API calls are handled through **Vite dev-server middleware** defined in `vite.config.js`. In production, these would be replaced by a separate backend (e.g., a Node.js server or serverless functions).

### 🤖 Gemini AI Analysis

**`POST /api/gemini-analysis`**

Generates a 3-sentence scientific analysis of a simulation result.

**Request Body:**
```json
{
  "data": {
    "temp": 27.5,
    "greenCover": 21,
    "impactSummary": "Planting 500ha reduces AQI by 600 points"
  },
  "action": "plant"
}
```

**Response:**
```json
{
  "analysis": "Increasing urban canopy cover in Delhi by 500 hectares..."
}
```

**Fallback behaviour:** The proxy tries models in this order until one responds:
1. `gemini-2.5-flash`
2. `gemini-2.0-flash`
3. `gemini-1.5-flash`
4. `gemini-1.5-pro`

---

### 🌡️ Environment Metrics

**`POST /api/environment-metrics`**

Fetches live temperature and wind from Open-Meteo, and optionally green cover from Google Earth Engine.

**Request Body:**
```json
{
  "cityName": "Delhi",
  "coords": [28.6139, 77.2090]
}
```

**Response:**
```json
{
  "metrics": {
    "city": "Delhi",
    "temp": 27.5,
    "windSpeed": 12,
    "greenCover": 21,
    "aqi": 130,
    "timestamp": "3:45:20 PM",
    "source": "Open-Meteo + deterministic canopy model"
  }
}
```

---

**`POST /api/environment-metrics-batch`**

Fetches metrics for multiple cities simultaneously.

**Request Body:**
```json
{
  "cities": [
    { "id": "delhi", "name": "Delhi", "coords": [28.6139, 77.2090] },
    { "id": "mumbai", "name": "Mumbai", "coords": [19.0760, 72.8777] }
  ]
}
```

---

### 🧪 Simulation Impact

**`POST /api/simulation-impact`**

Calculates precise projected changes from a planting/clearing action.

**Request Body:**
```json
{
  "action": "plant",
  "hectares": 500,
  "zoneArea": 1200,
  "baseline": { "temp": 28.5, "greenCover": 15, "aqi": 240 },
  "areaGreenCover": 15
}
```

**Response:**
```json
{
  "impact": {
    "tempDelta": -1.3,
    "aqiDelta": -85,
    "floodDelta": -55,
    "greenCoverDelta": 42,
    "projected": {
      "temp": 27.2,
      "greenCover": 57,
      "aqi": 155
    }
  }
}
```

---

## 🔢 Simulation Engine

The simulation math lives in `src/utils/calculations.js` and is replicated server-side in `vite.config.js` for accurate API responses.

| Formula | Constant | Description |
|---|---|---|
| **Temperature** | `0.05°C / hectare` | Cooling effect of dense urban canopy |
| **AQI** | `1.2 points / hectare` | Air quality improvement per planted hectare |
| **Flood Risk** | `0.8% / hectare` | Runoff absorption, reducing flood probability |
| **Sensitivity** | Dynamic (`0.65–2.1×`) | Amplifies impact based on current green cover deficit |

**GreenLens Score** — a composite 0–100 health metric:

```
Score = tempScore (0–25)
      + floodScore (0–25)
      + aqiScore (0–25)
      + greenScore (0–25)
```

---

## 🗺️ City Data Model

Each city in `src/data/cityData.js` follows this schema:

```js
{
  id: 'delhi',
  name: 'Delhi',
  state: 'NCR',
  coords: [28.6139, 77.2090],   // [lat, lng]
  avgTemp: 27.5,                // °C
  greenCover: 21,               // % of city area
  floodRisk: 'High',            // 'Low' | 'Moderate' | 'High' | 'Extreme'
  aqi: 240,                     // Air Quality Index
  riskLevel: 'Extreme',
  zones: [
    {
      id: 'z1',
      name: 'Connaught Place',
      coords: [28.63, 77.22],
      temp: 29.5,
      greenCover: 10,
      area: 500,               // hectares
      popDensity: 500          // people/km²
    }
    // ...
  ],
  history: [
    { year: 2010, greenCover: 18, event: 'Commonwealth Games' },
    // ...
    { year: 2024, greenCover: 21, event: 'Current baseline' }
  ]
}
```

**5 core cities** (Bhopal, Indore, Delhi, Bengaluru, Mumbai) have hand-curated zone data and historical events. **30+ regional cities** are seeded deterministically from geographic coordinates.

---

## 🔒 Security

| Concern | Mitigation |
|---|---|
| **API Key Exposure** | Gemini key is read only in the Vite server process (`vite.config.js`) and never included in the browser bundle |
| **Client-Side Proxy** | All sensitive API calls go through `POST /api/*` routes served by the Vite middleware, not directly from the browser |
| **`.env` in .gitignore** | The `.env` file is listed in `.gitignore` and must never be committed to version control |
| **GEE Service Account** | Private key is read server-side only; `\n` escape sequences are normalized before use |

> ⚠️ **Important**: Before pushing this project to a public repository, ensure your `.env` file is listed in `.gitignore` and rotate any API keys that may have been exposed.

---

## 📦 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server on `http://localhost:5173` |
| `npm run build` | Build production bundle to `./dist` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint across the project |

---

## 🤝 Contributing

Contributions are welcome! To get started:

1. Fork this repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to your branch: `git push origin feature/your-feature-name`
5. Open a Pull Request

Please follow the existing code style and add JSDoc comments to any new utility functions.

---

<div align="center">

Built with 🌱 for a greener, more data-driven future.

</div>
