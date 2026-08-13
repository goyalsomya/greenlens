import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { cities } from '../data/cityData';
import { MapContainer, TileLayer, useMap, Polygon, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import {
  calculateTempChange,
  calculateAQIChange,
} from '../utils/calculations';
import { fetchRealWorldMetrics, fetchSimulationImpact, fetchAreaMetrics } from '../api/earthEngine';
import { getGeminiAnalysis } from '../api/gemini';
import { MAP_LAYERS } from '../constants/mapLayers';

// ── Map re-centerer ────────────────────────────────────────────────────────────
const MapCenterer = ({ center }) => {
  const map = useMap();
  useEffect(() => { map.setView(center, 13); }, [center, map]);
  return null;
};

const MapZoomControls = () => {
  const map = useMap();
  return (
    <div className="absolute bottom-8 right-8 z-[1000] flex flex-col gap-3">
      <button onClick={() => map.zoomIn()} className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-900 font-bold text-xl hover:bg-gray-50 transition-all border border-gray-100">+</button>
      <button onClick={() => map.zoomOut()} className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-900 font-bold text-xl hover:bg-gray-50 transition-all border border-gray-100">−</button>
    </div>
  );
};

const estimateAreaHectares = (layer) => {
  if (Array.isArray(layer) && layer.length > 2) {
    const points = layer.map(([lat, lng]) => {
      const x = (lng * 111320) * Math.cos((lat * Math.PI) / 180);
      const y = lat * 110540;
      return [x, y];
    });
    let area = 0;
    for (let i = 0; i < points.length; i += 1) {
      const [x1, y1] = points[i];
      const [x2, y2] = points[(i + 1) % points.length];
      area += x1 * y2 - x2 * y1;
    }
    return Math.max(1, Math.round(Math.abs(area / 2) / 10000));
  }
  return 50;
};

const DrawCapture = ({ drawEnabled, onPoint }) => {
  useMapEvents({
    click(event) {
      if (drawEnabled) {
        onPoint([event.latlng.lat, event.latlng.lng]);
      }
    },
  });
  return null;
};

const getPolygonCentroid = (points) => {
  if (!points?.length) return null;
  const { lat, lng } = points.reduce(
    (acc, point) => ({
      lat: acc.lat + point[0],
      lng: acc.lng + point[1],
    }),
    { lat: 0, lng: 0 }
  );
  return [lat / points.length, lng / points.length];
};

// ── Breadcrumb ─────────────────────────────────────────────────────────────────
const Breadcrumb = ({ cityName }) => (
  <nav className="flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-6">
    <Link to="/" className="hover:text-primary-700 transition-colors">HOME</Link>
    <span className="text-gray-300">›</span>
    <Link to="/explore" className="hover:text-primary-700 transition-colors">{cityName.toUpperCase()}</Link>
    <span className="text-gray-300">›</span>
    <span className="text-gray-700">SIMULATE</span>
  </nav>
);

// ── Zone list item ─────────────────────────────────────────────────────────────
const ZoneItem = ({ zone, isActive, onClick, realTemp, realCover }) => (
  <button
    onClick={onClick}
    className={`w-full text-left rounded-3xl p-6 transition-all border ${isActive
      ? 'border-transparent bg-white shadow-premium'
      : 'border-transparent hover:bg-gray-100/50'
      }`}
  >
    {isActive && (
      <div className="text-[9px] font-bold tracking-[0.2em] uppercase text-primary-500 mb-2">
        ACTIVE SELECTION
      </div>
    )}
    <div className={`font-bold ${isActive ? 'text-xl text-gray-900 leading-tight' : 'text-base text-gray-500'}`}>
      {zone.name}
    </div>
    <div className="flex items-center gap-4 mt-2">
      <span className="flex items-center gap-1.5 text-xs text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" /></svg>
        {realTemp || zone.temp}°C
      </span>
      <span className="flex items-center gap-1.5 text-xs text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a10 10 0 0 1 10 10c0 5.52-4.48 10-10 10S2 17.52 2 12c0-2.76 1.12-5.26 2.93-7.07" /><path d="M12 6v6l4 2" /></svg>
        {realCover || zone.greenCover}% green
      </span>
    </div>
  </button>
);

// ── Action toggle card ─────────────────────────────────────────────────────────
const ActionCard = ({ action, label, isActive, status, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between p-6 rounded-3xl border-2 transition-all ${isActive
      ? action === 'remove'
        ? 'border-[#ffcfcf] bg-[#fff5f5]'
        : 'border-primary-200 bg-primary-50'
      : 'border-gray-100 bg-white hover:border-gray-200'
      }`}
  >
    <div className="flex items-center gap-4">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action === 'remove' ? 'bg-[#ff4d4d] text-white' : 'bg-primary-500 text-white'
        }`}>
        {action === 'remove' ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" /></svg>
        )}
      </div>
      <div className="text-left">
        <div className={`text-[9px] font-bold tracking-[0.2em] uppercase mb-1 ${isActive
          ? action === 'remove' ? 'text-[#ff4d4d]' : 'text-primary-600'
          : 'text-gray-400'
          }`}>
          {status.toUpperCase()}
        </div>
        <div className="font-bold text-gray-900 text-base">{label}</div>
      </div>
    </div>
    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isActive
      ? action === 'remove'
        ? 'border-[#ff4d4d] bg-[#ff4d4d]'
        : 'border-primary-500 bg-primary-500'
      : 'border-gray-200'
      }`}>
      {isActive && (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
      )}
      {!isActive && (
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
      )}
    </div>
  </button>
);

// ── Impact metric card ─────────────────────────────────────────────────────────
const ImpactMetricCard = ({ icon, deltaLabel, title, subtitle, isNegative }) => (
  <div className="bg-white rounded-3xl p-6 shadow-soft border border-gray-50 flex flex-col justify-between h-40">
    <div className="flex items-center justify-between">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isNegative ? 'bg-[#fff5f5] text-[#ff4d4d]' : 'bg-primary-50 text-primary-600'
        }`}>
        {icon}
      </div>
      <span className={`text-sm font-bold ${isNegative ? 'text-[#ff4d4d]' : 'text-primary-600'}`}>
        {deltaLabel}
      </span>
    </div>
    <div>
      <div className="font-bold text-gray-900 text-lg mb-1 leading-tight">{title}</div>
      <div className="text-[11px] text-gray-400 font-medium leading-relaxed">{subtitle}</div>
    </div>
  </div>
);

// ── Main Simulate page ─────────────────────────────────────────────────────────
const Simulate = () => {
  const [searchParams] = useSearchParams();
  const cityId = searchParams.get('city') || 'bhopal';
  const initialCity = useMemo(() => cities.find(c => c.id === cityId) || cities[0], [cityId]);

  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [citySearch, setCitySearch] = useState('');
  const [mapMode, setMapMode] = useState('satellite');
  const [drawEnabled, setDrawEnabled] = useState(false);
  const [drawPoints, setDrawPoints] = useState([]);
  const [selectedZone, setSelectedZone] = useState(initialCity.zones[0]);
  const [action, setAction] = useState('remove'); // 'remove' | 'plant'
  const [actionArea, setActionArea] = useState(50);

  const [realBaseline, setRealBaseline] = useState(null);
  const [_loadingBaseline, setLoadingBaseline] = useState(true);
  const [geminiForecast, setGeminiForecast] = useState("");
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [impactMetrics, setImpactMetrics] = useState(null);
  const [areaMetrics, setAreaMetrics] = useState(null);
  const [analyzingArea, setAnalyzingArea] = useState(false);
  const mapConfig = MAP_LAYERS[mapMode] || MAP_LAYERS.satellite;

  const filteredCities = useMemo(() => {
    const search = citySearch.trim().toLowerCase();
    if (!search) return cities;
    return cities.filter((city) =>
      `${city.name} ${city.state}`.toLowerCase().includes(search)
    );
  }, [citySearch]);

  useEffect(() => {
    setSelectedZone(selectedCity.zones[0]);
    setDrawPoints([]);
    setActionArea(50);
    setAreaMetrics(null);
  }, [selectedCity]);

  useEffect(() => {
    const fetchBaseline = async () => {
      setLoadingBaseline(true);
      try {
        const metrics = await fetchRealWorldMetrics(selectedZone.name, selectedZone.coords);
        setRealBaseline(metrics);
      } catch (err) {
        console.error("Simulation Baseline Error:", err.message || "Unknown error");
      } finally {
        setLoadingBaseline(false);
      }
    };
    fetchBaseline();
  }, [selectedZone]);

  const tempDelta = impactMetrics?.tempDelta ?? calculateTempChange(action, actionArea);
  const aqiDelta = impactMetrics?.aqiDelta ?? calculateAQIChange(action, actionArea);

  const isRemove = action === 'remove';
  const tempLabel = isRemove ? `+${Math.abs(tempDelta).toFixed(1)}°C` : `-${Math.abs(tempDelta).toFixed(1)}°C`;
  const aqiLabel = isRemove ? `${Math.abs(aqiDelta)}+` : `-${Math.abs(aqiDelta)}`;
  const floodLabel = isRemove ? 'Critical' : 'Reduced';

  useEffect(() => {
    if (drawPoints.length < 3) {
      setAreaMetrics(null);
      return;
    }

    const analyzeMarkedArea = async () => {
      const centroid = getPolygonCentroid(drawPoints);
      if (!centroid) return;
      setAnalyzingArea(true);
      try {
        const metrics = await fetchAreaMetrics(centroid);
        setAreaMetrics(metrics);
      } catch (error) {
        console.error("Area Analysis Error:", error?.message || "Unknown error");
        setAreaMetrics(null);
      } finally {
        setAnalyzingArea(false);
      }
    };

    analyzeMarkedArea();
  }, [drawPoints]);

  useEffect(() => {
    if (!realBaseline) return;
    const fetchImpact = async () => {
      try {
        const baselineForImpact = areaMetrics || realBaseline;
        const impact = await fetchSimulationImpact({
          action,
          hectares: actionArea,
          zoneArea: selectedZone.area,
          baseline: baselineForImpact,
          areaGreenCover: areaMetrics?.greenCover,
        });
        setImpactMetrics(impact);
      } catch (err) {
        console.error("Simulation Impact Error:", err.message || "Unknown error");
        setImpactMetrics(null);
      }
    };
    fetchImpact();
  }, [action, actionArea, selectedZone, realBaseline, areaMetrics]);

  const activeBaseline = areaMetrics || realBaseline;

  // Trigger Gemini Forecast on action/zone change
  useEffect(() => {
    if (!activeBaseline) return;
    const fetchForecast = async () => {
      setLoadingForecast(true);
      const analysis = await getGeminiAnalysis(
        {
          temp: activeBaseline.temp,
          greenCover: activeBaseline.greenCover,
          impactSummary: `Simulating ${action === 'plant' ? 'reforestation' : 'deforestation'} of ${actionArea} hectares. Projected temp change: ${tempLabel}, AQI change: ${aqiLabel}.`
        },
        action
      );
      setGeminiForecast(analysis);
      setLoadingForecast(false);
    };
    const timer = setTimeout(fetchForecast, 500); // Debounce
    return () => clearTimeout(timer);
  }, [action, activeBaseline, selectedZone, actionArea, tempLabel, aqiLabel]);

  return (
    <div className="min-h-screen bg-bg-alt pb-20">
      <div className="max-w-[1400px] mx-auto px-10 pt-10">
        <Breadcrumb cityName={selectedCity.name} />

        <div className="flex flex-col mb-12">
          <h1 className="text-[56px] font-bold text-gray-900 leading-[1.1] mb-4">
            What-If Simulator
          </h1>
          <p className="text-lg text-gray-500 max-w-2xl leading-relaxed font-medium">
            Visualize the environmental consequences of urban planning decisions. Manipulate the
            city's green cover to see real-time shifts in temperature, air quality, and risk factors.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_400px] gap-10 items-start">
          {/* Column 1: Zones */}
          <div className="bg-white rounded-[40px] p-4 shadow-soft">
            <div className="flex items-center gap-3 px-4 py-6">
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
              </div>
              <span className="font-bold text-gray-900 text-lg">{selectedCity.name}, {selectedCity.state.split(',')[0].trim()}</span>
            </div>

            <div className="px-4 pb-4">
              <input
                type="text"
                placeholder="Search city or location"
                value={citySearch}
                onChange={(e) => setCitySearch(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-primary-500"
              />
              <div className="mt-2 max-h-36 space-y-1 overflow-y-auto">
                {filteredCities.map((city) => (
                  <button
                    key={city.id}
                    onClick={() => setSelectedCity(city)}
                    className={`w-full rounded-xl px-3 py-2 text-left text-xs font-bold uppercase tracking-wide transition-all ${city.id === selectedCity.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-primary-50'
                      }`}
                  >
                    {city.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1">
              {selectedCity.zones.map(zone => (
                <ZoneItem
                  key={zone.id}
                  zone={zone}
                  isActive={selectedZone.id === zone.id}
                  onClick={() => setSelectedZone(zone)}
                  realTemp={selectedZone.id === zone.id && realBaseline ? realBaseline.temp : null}
                  realCover={selectedZone.id === zone.id && realBaseline ? realBaseline.greenCover : null}
                />
              ))}
            </div>
          </div>

          {/* Column 2: Map */}
          <div className="relative h-[640px] rounded-[48px] overflow-hidden shadow-premium group">
            <div className="absolute left-6 top-6 z-[1100] flex gap-2 rounded-2xl bg-white/95 p-2 shadow-soft border border-gray-100">
              {Object.entries(MAP_LAYERS).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setMapMode(key)}
                  className={`rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wide transition-all ${mapMode === key ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-100'
                    }`}
                >
                  {value.label}
                </button>
              ))}
            </div>

            <MapContainer
              center={selectedZone.coords}
              zoom={13}
              className="h-full w-full"
              zoomControl={false}
            >
              <TileLayer
                attribution={mapConfig.attribution}
                url={mapConfig.url}
              />
              <MapCenterer center={selectedZone.coords} />
              <DrawCapture
                drawEnabled={drawEnabled}
                onPoint={(point) => {
                  setDrawPoints((prev) => {
                    const next = [...prev, point];
                    if (next.length >= 3) {
                      setActionArea(estimateAreaHectares(next));
                    }
                    return next;
                  });
                }}
              />
              {drawPoints.length >= 3 && (
                <Polygon
                  positions={drawPoints}
                  pathOptions={{ color: '#ff4d4d', fillColor: '#ff4d4d', fillOpacity: 0.15, weight: 2 }}
                />
              )}
              <MapZoomControls />
            </MapContainer>

            {/* Central Blurred Selection Overlay */}

            <div className="absolute bottom-8 left-8 z-[1000] flex items-center gap-3">
              <button
                onClick={() => setDrawEnabled((prev) => !prev)}
                className={`w-12 h-12 rounded-full shadow-lg flex items-center justify-center transition-all border ${drawEnabled
                  ? 'bg-primary-600 text-white border-primary-600'
                  : 'bg-white text-gray-900 border-gray-100 hover:bg-gray-50'
                  }`}
                title="Draw area (pencil)"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
              </button>
              <button
                onClick={() => {
                  setDrawPoints([]);
                  setActionArea(50);
                }}
                className="rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-gray-700 shadow-soft hover:bg-gray-100"
              >
                Clear
              </button>
              <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-gray-700 shadow-soft">
                Selected Area: {actionArea} ha
              </span>
              <span className="rounded-full bg-white/95 px-4 py-2 text-xs font-bold text-gray-700 shadow-soft">
                {analyzingArea
                  ? 'Analyzing green cover...'
                  : areaMetrics
                    ? `Area Green Cover: ${areaMetrics.greenCover}%`
                    : 'Area Green Cover: default zone'}
              </span>
            </div>
          </div>

          {/* Column 3: Actions + Impact */}
          <div className="space-y-8">
            <div className="space-y-3">
              <ActionCard
                action="remove"
                label="Remove Forest"
                isActive={action === 'remove'}
                status={action === 'remove' ? 'Active Action' : 'Available'}
                onClick={() => setAction('remove')}
              />
              <ActionCard
                action="plant"
                label="Add Green Cover"
                isActive={action === 'plant'}
                status={action === 'plant' ? 'Active Action' : 'Available'}
                onClick={() => setAction('plant')}
              />
            </div>

            <div className="pt-4">
              <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-6">
                PROJECTED IMPACT ANALYSIS
              </div>
              <div className="grid grid-cols-2 gap-4">
                <ImpactMetricCard
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z" /></svg>}
                  deltaLabel={tempLabel}
                  title="Temp Change"
                  subtitle={isRemove ? 'Urban heat island effect peaks' : 'Local cooling effect'}
                  isNegative={isRemove}
                />
                <ImpactMetricCard
                  icon={<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>}
                  deltaLabel={floodLabel}
                  title="Flood Risk"
                  subtitle={isRemove ? 'Runoff increased by 85%' : 'Runoff significantly reduced'}
                  isNegative={isRemove}
                />
              </div>
            </div>

            {/* Gemini Forecast Panel */}
            <div className="pt-4">
              <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">
                GEMINI AI FORECAST
              </div>
              <div className={`bg-gray-900 rounded-[32px] p-6 text-white min-h-[160px] flex flex-col justify-center transition-all ${loadingForecast ? 'opacity-50' : 'opacity-100'}`}>
                {loadingForecast ? (
                  <div className="space-y-4">
                    <div className="h-2 bg-gray-800 rounded w-full animate-pulse"></div>
                    <div className="h-2 bg-gray-800 rounded w-5/6 animate-pulse"></div>
                    <div className="h-2 bg-gray-800 rounded w-4/6 animate-pulse"></div>
                  </div>
                ) : (
                  <p className="text-sm font-medium leading-relaxed italic text-primary-100">
                    "{geminiForecast || "Analyzing your choices with Gemini..."}"
                  </p>
                )}
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary-500 animate-ping"></div>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-primary-400">Live Simulation Active</span>
                  </div>
                  <div className="w-16 h-1 bg-primary-900 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500" style={{ width: '100%', transition: 'width 2s' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 space-y-4">
              <button
                onClick={() => setAction(action === 'remove' ? 'plant' : 'remove')}
                className="w-full py-5 rounded-3xl bg-primary-700 hover:bg-primary-800 text-white font-bold text-lg transition-all shadow-premium"
              >
                {action === 'remove' ? 'Try Adding Green Cover' : 'Try Removing Forest'}
              </button>

              <button className="w-full text-sm font-bold text-gray-500 hover:text-primary-700 transition-colors flex items-center justify-center gap-2">
                Share this Impact
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-32 pt-16 border-t border-gray-100 flex flex-col md:flex-row items-start md:items-center justify-between gap-10">
          <div>
            <div className="font-bold text-primary-500 text-2xl mb-4">GreenLens</div>
            <p className="text-sm text-gray-400 max-w-sm leading-relaxed font-medium">
              Built on
              open satellite data. Data from NASA LANDSAT, ISRO Bhuvan, OpenAQ,
              IMD. For educational use only.
            </p>
          </div>
          <nav className="flex gap-x-12 text-sm font-bold text-primary-700">
            {['About', 'Data Sources', 'Methodology', 'GitHub'].map(link => (
              <a key={link} href="#" className="hover:text-primary-900 transition-colors uppercase tracking-widest">{link}</a>
            ))}
          </nav>
        </footer>
      </div>
    </div>
  );
};

export default Simulate;