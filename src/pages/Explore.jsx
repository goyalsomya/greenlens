import { Fragment, useMemo, useState, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Circle, Popup, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { cities } from '../data/cityData';
import LayerToggle from '../components/LayerToggle';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { fetchRealWorldMetrics, fetchBatchRealWorldMetrics } from '../api/earthEngine';
import { getGeminiAnalysis } from '../api/gemini';
import { MAP_LAYERS } from '../constants/mapLayers';

// Mock trend data for green cover
const trendData = [
  { day: 1, val: 12 },
  { day: 2, val: 15 },
  { day: 3, val: 14 },
  { day: 4, val: 18 },
  { day: 5, val: 16 },
  { day: 6, val: 18 },
];

const MapCenterer = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);
  return null;
};

const AreaSelector = ({ enabled, onSelect }) => {
  useMapEvents({
    click(event) {
      if (enabled) {
        onSelect(event.latlng);
      }
    },
  });
  return null;
};

const ViewportWatcher = ({ onViewportChange }) => {
  const map = useMapEvents({
    moveend() {
      const bounds = map.getBounds();
      onViewportChange({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      });
    },
    zoomend() {
      const bounds = map.getBounds();
      onViewportChange({
        north: bounds.getNorth(),
        south: bounds.getSouth(),
        east: bounds.getEast(),
        west: bounds.getWest(),
      });
    },
  });

  useEffect(() => {
    const bounds = map.getBounds();
    onViewportChange({
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest(),
    });
  }, [map, onViewportChange]);

  return null;
};

const layerStyles = {
  heat: {
    markerColor: '#ef4444',
    markerLabel: 'Heat Priority',
  },
  green: {
    markerColor: '#10b981',
    markerLabel: 'Canopy Priority',
  },
  both: {
    markerColor: '#4f46e5',
    markerLabel: 'Combined Layer',
  },
};

const getHeatColor = (temp) => {
  if (temp >= 34) return '#b91c1c';
  if (temp >= 31) return '#dc2626';
  if (temp >= 28) return '#f97316';
  if (temp >= 25) return '#facc15';
  return '#22c55e';
};

const getGreenColor = (cover) => {
  if (cover >= 60) return '#166534';
  if (cover >= 45) return '#15803d';
  if (cover >= 30) return '#22c55e';
  if (cover >= 18) return '#84cc16';
  return '#a3a3a3';
};

const LiveConditionCard = ({ title, value, children, className = "", loading = false }) => (
  <div className={`bg-white rounded-[32px] p-5 shadow-soft border border-gray-50 flex flex-col justify-between h-[180px] transition-all ${className}`}>
    <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-2">{title}</div>
    {loading ? (
      <div className="h-8 w-24 bg-gray-100 animate-pulse rounded-lg mb-4"></div>
    ) : (
      <div className="text-3xl font-bold text-gray-900 mb-4">{value}</div>
    )}
    <div className="flex-1 min-h-0">
      {children}
    </div>
  </div>
);

const Explore = () => {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [citySearch, setCitySearch] = useState('');
  const [activeLayer, setActiveLayer] = useState('heat');
  const [mapMode, setMapMode] = useState('satellite');
  const [realMetrics, setRealMetrics] = useState(null);
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [loadingAI, setLoadingAI] = useState(false);
  const [cityLayerMetrics, setCityLayerMetrics] = useState({});
  const [viewport, setViewport] = useState(null);
  const mapConfig = MAP_LAYERS[mapMode] || MAP_LAYERS.satellite;
  const layerStyle = layerStyles[activeLayer] || layerStyles.both;

  const filteredCities = useMemo(() => {
    const search = citySearch.trim().toLowerCase();
    if (!search) return cities;
    return cities.filter((city) =>
      `${city.name} ${city.state}`.toLowerCase().includes(search)
    );
  }, [citySearch]);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingMetrics(true);
      try {
        const metrics = await fetchRealWorldMetrics(selectedCity.name, selectedCity.coords);
        setRealMetrics(metrics);

        // Fetch AI Analysis
        setLoadingAI(true);
        const analysis = await getGeminiAnalysis(
          { temp: metrics.temp, greenCover: metrics.greenCover, impactSummary: "Baseline conditions observed via satellite data." },
          'baseline'
        );
        setAiAnalysis(analysis);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingMetrics(false);
        setLoadingAI(false);
      }
    };
    fetchData();
  }, [selectedCity]);

  useEffect(() => {
    if (!viewport) return;

    const visibleCities = cities.filter((city) => {
      const [lat, lng] = city.coords;
      return lat >= viewport.south && lat <= viewport.north && lng >= viewport.west && lng <= viewport.east;
    });

    const candidates = visibleCities.length ? visibleCities : [selectedCity];
    const timeout = setTimeout(async () => {
      try {
        const metrics = await fetchBatchRealWorldMetrics(candidates.slice(0, 40));
        setCityLayerMetrics((prev) => {
          const next = { ...prev };
          metrics.forEach((item) => {
            if (item?.id) {
              next[item.id] = {
                temp: item.temp,
                greenCover: item.greenCover,
              };
            }
          });
          return next;
        });
      } catch (error) {
        console.error("Layer Metrics Error:", error?.message || "Unknown error");
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [viewport, selectedCity]);

  useEffect(() => {
    if (!realMetrics) return;
    setCityLayerMetrics((prev) => ({
      ...prev,
      [selectedCity.id]: {
        temp: realMetrics.temp,
        greenCover: realMetrics.greenCover,
      },
    }));
  }, [selectedCity.id, realMetrics]);

  const selectNearestCity = (clicked) => {
    const nearest = cities.reduce((best, city) => {
      const [lat, lng] = city.coords;
      const distance = Math.sqrt((lat - clicked.lat) ** 2 + (lng - clicked.lng) ** 2);
      if (!best || distance < best.distance) {
        return { city, distance };
      }
      return best;
    }, null);

    if (nearest?.city) {
      setSelectedCity(nearest.city);
    }
  };

  return (
    <div className="flex h-[calc(100vh-80px)] bg-bg-alt overflow-hidden">
      {/* Sidebar */}
      <div className="w-[440px] h-full bg-[#f4f7f4] border-r border-gray-200 p-10 overflow-y-auto z-20">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
          </div>
          <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">CURRENT REGION</span>
        </div>

        <h2 className="text-[44px] font-bold text-gray-900 leading-tight mb-2">{selectedCity.name}, {selectedCity.state.split(',')[0].trim()}</h2>
        <p className="text-sm font-medium text-gray-400 leading-relaxed mb-10">Scientific observation of the central plateau biodiversity</p>

        <div className="mb-12">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 block">SEARCH CITY</label>
          <input
            type="text"
            placeholder="Search city or state"
            value={citySearch}
            onChange={(e) => setCitySearch(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 outline-none focus:border-primary-500"
          />
          <div className="mt-3 max-h-36 overflow-y-auto space-y-2">
            {filteredCities.map((city) => (
              <button
                key={city.id}
                onClick={() => setSelectedCity(city)}
                className={`w-full rounded-xl px-4 py-2 text-left text-sm font-semibold transition-all ${selectedCity.id === city.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-primary-50'
                  }`}
              >
                {city.name}, {city.state}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-12">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 block">GEOSPATIAL LAYERS</label>
          <LayerToggle activeLayer={activeLayer} onToggle={setActiveLayer} />
        </div>

        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] block">LIVE CONDITIONS</label>
            {realMetrics && (
              <span className="text-[8px] font-bold text-primary-500 bg-primary-50 px-2 py-0.5 rounded-full uppercase tracking-tighter">
                Live: {realMetrics.timestamp}
              </span>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <LiveConditionCard
              title="Ambient Temp"
              value={realMetrics ? `${realMetrics.temp}°C` : "---"}
              className="bg-[#053d18] !text-white"
              loading={loadingMetrics}
            >
              <div className="absolute right-4 bottom-4 opacity-20">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2" /><path d="M12 20v2" /><path d="m4.93 4.93 1.41 1.41" /><path d="m17.66 17.66 1.41 1.41" /><path d="M2 12h2" /><path d="M20 12h2" /><path d="m6.34 17.66-1.41 1.41" /><path d="m19.07 4.93-1.41 1.41" /></svg>
              </div>
              <div className="text-white">
                <div className="w-full h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
                  <div className="h-full bg-white/40" style={{ width: realMetrics ? `${(realMetrics.temp / 50) * 100}%` : '0%' }}></div>
                </div>
              </div>
            </LiveConditionCard>

            <LiveConditionCard title="Green Cover" value={realMetrics ? `${realMetrics.greenCover}%` : "---"} loading={loadingMetrics}>
              <div className="h-full -mx-5 -mb-5 mt-2">
                <ResponsiveContainer width="100%" height={60}>
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="val" stroke="#10b981" fillOpacity={1} fill="url(#colorVal)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
                <div className="px-5 pb-3">
                  <span className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    Satellite Feed
                  </span>
                </div>
              </div>
            </LiveConditionCard>

            <LiveConditionCard title="Flood Risk" value={selectedCity.floodRisk} loading={loadingMetrics}>
              <div className="mt-4">
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-primary-500" style={{ width: '45%' }}></div>
                </div>
              </div>
            </LiveConditionCard>

            <LiveConditionCard title="AQI Rating" value={realMetrics ? realMetrics.aqi : "---"} className="bg-gray-900 !text-white" loading={loadingMetrics}>
              <div className="flex flex-col gap-1">
                <div className="text-[9px] font-bold text-gray-500 uppercase tracking-widest leading-snug">SCIENTIFIC INDEX:</div>
                <div className="text-[10px] font-bold text-gray-400 leading-tight">LIVE MONITORING</div>
              </div>
            </LiveConditionCard>
          </div>
        </div>

        {/* Gemini AI Panel */}
        <div className="mb-12">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 block">GEMINI SCIENTIFIC ANALYSIS</label>
          <div className={`bg-white rounded-3xl p-6 shadow-soft border-2 transition-all ${loadingAI ? 'border-gray-100' : 'border-primary-100 bg-primary-50/30'}`}>
            {loadingAI ? (
              <div className="space-y-3">
                <div className="h-2 bg-gray-100 rounded w-full animate-pulse"></div>
                <div className="h-2 bg-gray-100 rounded w-5/6 animate-pulse"></div>
                <div className="h-2 bg-gray-100 rounded w-4/6 animate-pulse"></div>
              </div>
            ) : (
              <p className="text-xs font-medium text-gray-700 leading-relaxed italic">
                "{aiAnalysis || "Select a city to generate AI-powered environmental insights."}"
              </p>
            )}
            <div className="mt-4 flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-primary-500 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20" /></svg>
              </div>
              <span className="text-[9px] font-bold text-primary-600 uppercase tracking-widest">Gemini 1.5 Flash Active</span>
            </div>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-6 block">URBAN ZONES</label>
          <div className="bg-white rounded-3xl p-4 shadow-soft border border-gray-50 flex items-center justify-between">
            <span className="font-bold text-gray-900">Van Vihar</span>
            <span className="px-3 py-1 bg-primary-500 text-white text-[9px] font-bold rounded-full uppercase tracking-widest">Optimal Green</span>
          </div>
        </div>

        <Link
          to={`/simulate?city=${selectedCity.id}`}
          className="mt-8 flex items-center justify-center gap-3 w-full bg-primary-700 hover:bg-primary-800 text-white py-4 rounded-3xl font-bold transition-all shadow-premium"
        >
          Start Simulation
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
        </Link>
      </div>

      {/* Map Section */}
      <div className="flex-1 relative">
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
          center={selectedCity.coords}
          zoom={12}
          className="h-full w-full"
          zoomControl={false}
        >
          <TileLayer
            attribution={mapConfig.attribution}
            url={mapConfig.url}
          />
          <MapCenterer center={selectedCity.coords} />
          <AreaSelector enabled onSelect={selectNearestCity} />
          <ViewportWatcher onViewportChange={setViewport} />

          {cities.map((city) => (
            <Fragment key={city.id}>
              {(activeLayer === 'heat' || activeLayer === 'both') && (
                <Circle
                  center={city.coords}
                  radius={city.id === selectedCity.id ? 26000 : 18000}
                  pathOptions={{
                    color: getHeatColor(cityLayerMetrics[city.id]?.temp ?? city.avgTemp),
                    fillColor: getHeatColor(cityLayerMetrics[city.id]?.temp ?? city.avgTemp),
                    fillOpacity: activeLayer === 'both' ? 0.25 : 0.35,
                    opacity: 0,
                  }}
                />
              )}
              {(activeLayer === 'green' || activeLayer === 'both') && (
                <Circle
                  center={city.coords}
                  radius={city.id === selectedCity.id ? 22000 : 15000}
                  pathOptions={{
                    color: getGreenColor(cityLayerMetrics[city.id]?.greenCover ?? city.greenCover),
                    fillColor: getGreenColor(cityLayerMetrics[city.id]?.greenCover ?? city.greenCover),
                    fillOpacity: activeLayer === 'both' ? 0.22 : 0.32,
                    opacity: 0,
                  }}
                />
              )}
              <CircleMarker
                center={city.coords}
                radius={city.id === selectedCity.id ? 24 : 14}
                pathOptions={{
                  fillColor: city.id === selectedCity.id ? layerStyle.markerColor : '#fff',
                  color: layerStyle.markerColor,
                  weight: 3,
                  fillOpacity: city.id === selectedCity.id ? 0.9 : 0.4
                }}
                eventHandlers={{
                  click: () => setSelectedCity(city)
                }}
              >
                <Popup>
                  <div className="p-2 font-display">
                    <h3 className="font-bold text-lg mb-1">{city.name}</h3>
                    <div className="text-xs text-gray-500">{layerStyle.markerLabel}</div>
                    <div className="text-xs text-gray-500 mt-1">Temp: {cityLayerMetrics[city.id]?.temp ?? city.avgTemp} C</div>
                    <div className="text-xs text-gray-500">Green: {cityLayerMetrics[city.id]?.greenCover ?? city.greenCover}%</div>
                  </div>
                </Popup>
              </CircleMarker>
            </Fragment>
          ))}
        </MapContainer>

        {/* Resilience Card */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-[1000] w-[320px]">
          <div className="bg-white rounded-3xl p-6 shadow-premium border border-gray-100 backdrop-blur-md bg-white/90">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-primary-500"></div>
              <span className="text-xs font-bold text-gray-900 uppercase tracking-widest">Ecological Resilience Index</span>
            </div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1.5">
                  <span>Urban Heat</span>
                  <span className="text-gray-900">{realMetrics && realMetrics.temp > 30 ? 'High' : 'Optimal'}</span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-linear-to-r from-emerald-400 to-red-400" style={{ width: realMetrics ? `${(realMetrics.temp / 45) * 100}%` : '50%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1.5">
                  <span>Canopy Density</span>
                  <span className="text-gray-900">{realMetrics && realMetrics.greenCover > 20 ? 'Rich' : 'Critical'}</span>
                </div>
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-linear-to-r from-emerald-400 to-primary-600" style={{ width: realMetrics ? `${realMetrics.greenCover}%` : '50%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Nav Controls */}
        <div className="absolute top-8 right-8 z-[1000] flex flex-col gap-3">
          {[1, 2, 3].map(i => (
            <button key={i} className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-900 hover:bg-gray-50 transition-all border border-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                {i === 1 ? (
                  <>
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="11" y1="8" x2="11" y2="14" /><line x1="8" y1="11" x2="14" y2="11" />
                  </>
                ) : null}
                {i === 2 ? (
                  <>
                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /><line x1="8" y1="11" x2="14" y2="11" />
                  </>
                ) : null}
                {i === 3 ? <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /> : null}
              </svg>
            </button>
          ))}
          <div className="absolute -top-1 right-2 w-3 h-3 bg-primary-500 rounded-full border-2 border-white pointer-events-none"></div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
