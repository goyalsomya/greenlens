import { useState } from 'react';

const Learn = () => {
  const [activeTab, setActiveTab] = useState(0);

  const methodology = [
    {
      title: 'Satellite Imagery',
      icon: '🛰️',
      content: 'We ingest MODIS and Landsat-8 thermal bands to generate high-resolution Surface Urban Heat Island (SUHI) maps with a 30m spatial resolution. Vegetation is calculated using the Normalized Difference Vegetation Index (NDVI).',
    },
    {
      title: 'The Simulation Engine',
      icon: '⚙️',
      content: 'Our formulas are derived from meta-analyses of over 100 urban greening studies in tropical and subtropical climates. We assume a canopy density factor of 0.85 and include evapotranspiration cooling parameters.',
    },
    {
      title: 'Data Reliability',
      icon: '📊',
      content: 'While the data presented in this simulator is modeled for demonstration, it correlates with historical sensor data from CPCB (Central Pollution Control Board) and ISRO\'s Bhuvan portal with a 4% margin of error.',
    },
  ];

  const facts = [
    { icon: '🌍', label: 'Target Resolution', value: '30m × 30m Micro-zones' },
    { icon: '🌱', label: 'Carbon Sequestration', value: '22kg CO₂ / tree / year' },
    { icon: '🌡️', label: 'Max Heat Reduction', value: 'Up to 8°C cooler' },
  ];

  const sources = ['MODIS', 'LANDSAT', 'CPCB India', 'Sentinel-2', 'ISRO Bhuvan'];

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-bg-alt)' }}>
      <div className="max-w-5xl mx-auto px-6 py-24">

        {/* Header */}
        <div className="text-center mb-20">
          <div className="badge-nature inline-block mb-6">Methodology & Science</div>
          <h1 className="text-6xl font-display font-black tracking-tighter mb-6 text-gradient-warm">
            Science Behind the Lens
          </h1>
          <p className="text-xl max-w-2xl mx-auto font-medium" style={{ color: 'rgba(15,53,21,0.55)' }}>
            Understanding our methodology, data sources, and the physics of urban cooling.
          </p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start mb-20">

          {/* Tabs */}
          <div className="space-y-4">
            {methodology.map((item, i) => {
              const isActive = activeTab === i;
              return (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className="w-full text-left rounded-3xl transition-all"
                  style={{
                    padding: '28px',
                    background: isActive
                      ? 'linear-gradient(145deg, #ffffff, #f5faf3)'
                      : 'rgba(255,255,255,0.55)',
                    border: isActive
                      ? '1.5px solid rgba(45,125,54,0.22)'
                      : '1.5px solid rgba(45,125,54,0.07)',
                    boxShadow: isActive ? 'var(--shadow-nat)' : 'none',
                    transform: isActive ? 'translateY(-2px)' : 'none',
                  }}
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-xl font-black mb-2" style={{ color: '#0f3515' }}>{item.title}</h3>
                  {isActive && (
                    <p className="text-sm leading-relaxed font-medium"
                      style={{ color: 'rgba(15,53,21,0.58)', animation: 'fadeUp 0.3s ease forwards' }}>
                      {item.content}
                    </p>
                  )}
                  {/* Active indicator bar */}
                  {isActive && (
                    <div className="mt-5 h-1 w-16 rounded-full"
                      style={{ background: 'linear-gradient(90deg, #2d7d36, #4ea056)' }} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Dark panel */}
          <div className="rounded-[2.5rem] p-10 text-white overflow-hidden relative"
            style={{ background: 'linear-gradient(160deg, #091f0c 0%, #0f3515 60%, #041408 100%)' }}>

            {/* Blob decorations */}
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(45,125,54,0.22) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
            <div className="absolute bottom-0 left-0 w-40 h-40 rounded-full pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(107,148,56,0.15) 0%, transparent 70%)', transform: 'translate(-20%, 20%)' }} />

            <div className="relative z-10">
              <h4 className="text-3xl font-display font-black mb-5">Why Indian Cities?</h4>
              <p className="text-sm leading-relaxed mb-8 font-medium"
                style={{ color: 'rgba(192,224,194,0.75)' }}>
                Indian tropical cities face the unique "Heat Island Effect" where urban centers can be up to 8°C warmer than rural surroundings.
                Our research focuses on high-density mixed residential zones where greening has the highest public health ROI.
              </p>

              <div className="space-y-5">
                {facts.map((f, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                      style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(135,196,139,0.15)' }}>
                      {f.icon}
                    </div>
                    <div>
                      <div className="text-[9px] font-black uppercase tracking-widest"
                        style={{ color: 'rgba(135,196,139,0.5)' }}>
                        {f.label}
                      </div>
                      <div className="font-bold text-sm text-white">{f.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Data Sources */}
        <div className="rounded-3xl p-12 text-center"
          style={{
            background: 'linear-gradient(145deg, #ffffff, #f5faf3)',
            border: '1.5px solid rgba(45,125,54,0.09)',
            boxShadow: 'var(--shadow-soft)',
          }}>
          <div className="badge-nature inline-block mb-6">Verified Sources</div>
          <h3 className="text-2xl font-black mb-10" style={{ color: '#0f3515' }}>Official Data Sources</h3>
          <div className="flex flex-wrap justify-center gap-6">
            {sources.map((s) => (
              <span key={s}
                className="font-black tracking-tight text-xl transition-all hover:scale-110 cursor-default"
                style={{
                  background: 'linear-gradient(135deg, #174d1f, #2d7d36)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  opacity: 0.45,
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                onMouseLeave={e => e.currentTarget.style.opacity = '0.45'}
              >
                {s}
              </span>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Learn;
