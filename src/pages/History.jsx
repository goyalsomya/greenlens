import { useEffect, useMemo, useState } from 'react';
import { cities } from '../data/cityData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP_LAYERS } from '../constants/mapLayers';

const MapCenterer = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 12);
  }, [center, map]);
  return null;
};

const MapSync = ({ center, zoom, onMove }) => {
  const map = useMap();

  useEffect(() => {
    const currentCenter = map.getCenter();
    if (
      Math.abs(currentCenter.lat - center[0]) > 0.0001 ||
      Math.abs(currentCenter.lng - center[1]) > 0.0001 ||
      map.getZoom() !== zoom
    ) {
      map.setView(center, zoom, { animate: false });
    }
  }, [center, zoom, map]);

  useEffect(() => {
    const handleMove = () => {
      const nextCenter = map.getCenter();
      onMove([nextCenter.lat, nextCenter.lng], map.getZoom());
    };
    map.on('moveend', handleMove);
    map.on('zoomend', handleMove);
    return () => {
      map.off('moveend', handleMove);
      map.off('zoomend', handleMove);
    };
  }, [map, onMove]);

  return null;
};

const History = () => {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [search, setSearch] = useState('');
  const [fromYear, setFromYear] = useState(cities[0].history[0].year);
  const [toYear, setToYear] = useState(cities[0].history[cities[0].history.length - 1].year);
  const [sharedCenter, setSharedCenter] = useState(cities[0].coords);
  const [sharedZoom, setSharedZoom] = useState(12);

  const chartData = selectedCity.history.map(h => ({
    year: h.year,
    cover: h.greenCover,
    event: h.event,
  }));

  const filteredCities = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return cities;
    return cities.filter(c => `${c.name} ${c.state}`.toLowerCase().includes(query));
  }, [search]);

  const yearOptions = selectedCity.history.map(item => item.year);
  const fromRecord = selectedCity.history.find(item => item.year === Number(fromYear)) || selectedCity.history[0];
  const toRecord   = selectedCity.history.find(item => item.year === Number(toYear))   || selectedCity.history[selectedCity.history.length - 1];
  const fromConfig = MAP_LAYERS.satellite;
  const toConfig   = MAP_LAYERS.satellite;

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setFromYear(city.history[0].year);
    setToYear(city.history[city.history.length - 1].year);
    setSharedCenter(city.coords);
    setSharedZoom(12);
  };

  const handleMapMove = (nextCenter, nextZoom) => {
    setSharedCenter(nextCenter);
    setSharedZoom(nextZoom);
  };

  const changePct = toRecord.greenCover - fromRecord.greenCover;
  const isPositiveChange = changePct >= 0;

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-alt)' }}>
      <div className="max-w-7xl mx-auto px-6 py-20">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-14 gap-6">
          <div>
            <div className="badge-nature inline-block mb-4">Historical Analysis</div>
            <h1 className="text-5xl font-display font-black tracking-tighter mb-3 text-gradient-warm">
              Urban Time Machine
            </h1>
            <p className="font-medium max-w-xl" style={{ color: 'rgba(15,53,21,0.55)' }}>
              Witness the transformation of Indian urban landscapes from 2010 to present day.
            </p>
          </div>

          {/* City search */}
          <div className="w-full md:w-[360px] space-y-2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search location to compare"
              className="w-full rounded-2xl px-4 py-3 font-semibold text-sm outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.9)',
                border: '1.5px solid rgba(45,125,54,0.14)',
                color: '#0f3515',
              }}
              onFocus={e => e.currentTarget.style.borderColor = 'rgba(45,125,54,0.45)'}
              onBlur={e => e.currentTarget.style.borderColor = 'rgba(45,125,54,0.14)'}
            />
            <div className="max-h-28 overflow-y-auto rounded-2xl p-2"
              style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(45,125,54,0.10)' }}>
              {filteredCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => handleCitySelect(city)}
                  className="block w-full rounded-xl px-3 py-2 text-left text-sm font-bold transition-all"
                  style={{
                    background: city.id === selectedCity.id ? 'linear-gradient(135deg, #2d7d36, #1f6128)' : 'transparent',
                    color: city.id === selectedCity.id ? '#fff' : 'rgba(15,53,21,0.7)',
                  }}
                  onMouseEnter={e => { if (city.id !== selectedCity.id) e.currentTarget.style.background = 'rgba(45,125,54,0.07)'; }}
                  onMouseLeave={e => { if (city.id !== selectedCity.id) e.currentTarget.style.background = 'transparent'; }}
                >
                  {city.name}, {city.state}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Year selectors */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: 'From Year', value: fromYear, onChange: (v) => setFromYear(Number(v)) },
            { label: 'To Year',   value: toYear,   onChange: (v) => setToYear(Number(v)) },
          ].map(({ label, value, onChange }) => (
            <div key={label} className="rounded-2xl p-4"
              style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(45,125,54,0.10)' }}>
              <label className="block text-[10px] font-black uppercase tracking-[0.2em] mb-2"
                style={{ color: 'rgba(45,125,54,0.45)' }}>
                {label}
              </label>
              <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-xl px-4 py-3 font-bold text-sm outline-none"
                style={{
                  background: 'rgba(245,250,243,0.8)',
                  border: '1.5px solid rgba(45,125,54,0.14)',
                  color: '#0f3515',
                }}>
                {yearOptions.map(y => <option key={`${label}-${y}`} value={y}>{y}</option>)}
              </select>
            </div>
          ))}
        </div>

        {/* Side-by-side maps */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          {/* From map */}
          <div className="relative h-[420px] rounded-[2rem] overflow-hidden"
            style={{
              border: '6px solid rgba(255,255,255,0.9)',
              boxShadow: 'var(--shadow-deep)',
            }}>
            <MapContainer center={sharedCenter} zoom={sharedZoom} className="h-full w-full">
              <TileLayer attribution={fromConfig.attribution} url={fromConfig.url} />
              <MapCenterer center={selectedCity.coords} />
              <MapSync center={sharedCenter} zoom={sharedZoom} onMove={handleMapMove} />
            </MapContainer>
            <div className="pointer-events-none absolute left-4 top-4 z-[1000] rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em]"
              style={{ background: 'rgba(252,244,220,0.95)', color: '#7c4f0a', border: '1px solid rgba(180,83,9,0.18)' }}>
              {fromRecord.year} View
            </div>
            <div className="pointer-events-none absolute left-4 bottom-4 z-[1000] rounded-xl px-4 py-2 text-xs font-bold"
              style={{ background: 'rgba(255,255,255,0.92)', color: '#0f3515', boxShadow: 'var(--shadow-soft)' }}>
              🌿 Green Cover: {fromRecord.greenCover}%
            </div>
          </div>

          {/* To map */}
          <div className="relative h-[420px] rounded-[2rem] overflow-hidden"
            style={{
              border: '6px solid rgba(255,255,255,0.9)',
              boxShadow: 'var(--shadow-deep)',
            }}>
            <MapContainer center={sharedCenter} zoom={sharedZoom} className="h-full w-full">
              <TileLayer attribution={toConfig.attribution} url={toConfig.url} />
              <MapCenterer center={selectedCity.coords} />
              <MapSync center={sharedCenter} zoom={sharedZoom} onMove={handleMapMove} />
            </MapContainer>
            <div className="pointer-events-none absolute right-4 top-4 z-[1000] rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em]"
              style={{ background: 'rgba(9,31,12,0.88)', color: 'rgba(192,224,194,0.9)' }}>
              {toRecord.year} View
            </div>
            <div className="pointer-events-none absolute right-4 bottom-4 z-[1000] rounded-xl px-4 py-2 text-xs font-bold"
              style={{ background: 'rgba(255,255,255,0.92)', color: '#0f3515', boxShadow: 'var(--shadow-soft)' }}>
              🌿 Green Cover: {toRecord.greenCover}%
            </div>
          </div>
        </div>

        {/* Chart + Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">

          {/* Chart */}
          <div className="lg:col-span-2 p-8 rounded-[2rem]"
            style={{
              background: 'linear-gradient(145deg, #ffffff, #f5faf3)',
              border: '1.5px solid rgba(45,125,54,0.09)',
              boxShadow: 'var(--shadow-nat)',
            }}>
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
              <h3 className="text-xl font-black" style={{ color: '#0f3515' }}>Green Cover Trend (%)</h3>
              <div className="flex items-center gap-2 text-xs font-black rounded-full px-3 py-1.5"
                style={{
                  background: isPositiveChange ? 'rgba(220,252,231,0.8)' : 'rgba(254,226,226,0.8)',
                  color: isPositiveChange ? '#059669' : '#dc2626',
                  border: `1px solid ${isPositiveChange ? 'rgba(5,150,105,0.2)' : 'rgba(220,38,38,0.2)'}`,
                }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                  fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                  className={isPositiveChange ? 'rotate-180' : ''}>
                  <path d="m19 12-7 7-7-7"/><path d="M12 19V5"/>
                </svg>
                {isPositiveChange ? '+' : ''}{changePct}% ({fromRecord.year}→{toRecord.year})
              </div>
            </div>

            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="coverGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#2d7d36" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#2d7d36" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(45,125,54,0.07)" />
                  <XAxis dataKey="year" axisLine={false} tickLine={false}
                    tick={{ fontSize: 11, fontWeight: 700, fill: 'rgba(15,53,21,0.45)', fontFamily: 'DM Sans, sans-serif' }} />
                  <YAxis hide domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: '16px',
                      border: '1px solid rgba(45,125,54,0.15)',
                      background: 'rgba(255,255,255,0.96)',
                      boxShadow: 'var(--shadow-nat)',
                      color: '#0f3515',
                      fontSize: '12px',
                    }}
                    labelStyle={{ fontWeight: 900, color: '#091f0c' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="cover"
                    stroke="#2d7d36"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#coverGrad)"
                    animationDuration={1800}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-1">
            <h4 className="text-[10px] font-black uppercase tracking-[0.22em] mb-6"
              style={{ color: 'rgba(45,125,54,0.5)' }}>
              Key Milestones
            </h4>
            {selectedCity.history.map((h, i) => (
              <div key={i} className="flex gap-4 group">
                <div className="flex flex-col items-center">
                  <div className="w-4 h-4 rounded-full z-10 mt-0.5 shrink-0"
                    style={{
                      background: 'linear-gradient(135deg, #2d7d36, #4ea056)',
                      border: '2.5px solid white',
                      boxShadow: '0 0 0 2px rgba(45,125,54,0.2)',
                    }} />
                  {i !== selectedCity.history.length - 1 && (
                    <div className="flex-1 w-0.5 my-1 rounded-full transition-colors"
                      style={{ background: 'rgba(45,125,54,0.12)', minHeight: '24px' }} />
                  )}
                </div>
                <div className="pb-5">
                  <div className="text-sm font-black" style={{ color: '#0f3515' }}>{h.year}</div>
                  <div className="text-xs font-medium leading-snug mt-0.5" style={{ color: 'rgba(15,53,21,0.5)' }}>
                    {h.event}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default History;
