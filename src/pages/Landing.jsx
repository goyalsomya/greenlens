import { Link } from 'react-router-dom';

const Landing = () => {
  const features = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>
        </svg>
      ),
      title: 'Interactive Mapping',
      desc: 'Explore street-level heat maps and vegetation layers for India\'s major metropolitan areas.',
      grad: 'linear-gradient(135deg, #e0f0e0, #f5faf3)',
      iconGrad: 'linear-gradient(135deg, #2d7d36, #4ea056)',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
          <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/>
        </svg>
      ),
      title: 'Simulation Engine',
      desc: 'Apply virtual greening actions to specific zones and see real-time impact on temperature and AQI.',
      grad: 'linear-gradient(135deg, #f5faf3, #f0f8ee)',
      iconGrad: 'linear-gradient(135deg, #174d1f, #2d7d36)',
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 20v-6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6"/>
          <path d="M6 20V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16"/>
          <path d="M2 20h20"/><path d="M14 7h2"/><path d="M14 11h2"/><path d="M14 15h2"/>
        </svg>
      ),
      title: 'Historical Audit',
      desc: 'Travel back to 2010 to see how urban expansion has changed the local climate baseline.',
      grad: 'linear-gradient(135deg, #f8f5ee, #faf9f5)',
      iconGrad: 'linear-gradient(135deg, #6b9438, #2d7d36)',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden hero-bg">

        {/* Organic blob decorations */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 50% at 50% 0%, rgba(78,160,86,0.13) 0%, transparent 70%)',
          }} />
        <div className="absolute top-16 right-10 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(107,148,56,0.09) 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-10 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(45,125,54,0.07) 0%, transparent 70%)' }} />

        <div className="max-w-7xl mx-auto text-center relative z-10">

          {/* Badge */}
          <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full mb-10"
            style={{
              background: 'linear-gradient(135deg, rgba(224,240,224,0.9), rgba(245,250,243,0.95))',
              border: '1px solid rgba(45,125,54,0.22)',
              boxShadow: '0 2px 12px -4px rgba(45,125,54,0.15)',
            }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                style={{ background: '#4ea056' }} />
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#2d7d36' }} />
            </span>
            <span className="text-xs font-black tracking-widest uppercase" style={{ color: '#174d1f' }}>
              Live Simulation Engine Active
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-6xl md:text-8xl font-display font-black leading-[1.08] tracking-tighter mb-8">
            <span style={{ color: '#091f0c' }}>Build a </span>
            <span className="text-gradient-warm">Greener</span>
            <br />
            <span style={{ color: '#091f0c' }}>Future for India</span>
          </h1>

          <p className="text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium"
            style={{ color: 'rgba(15,53,21,0.62)' }}>
            GreenLens uses high-resolution satellite data to simulate how increasing urban canopy
            can cool our cities and reduce flood risks.
          </p>

          {/* CTAs */}
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link to="/explore"
              className="btn-shimmer text-white px-10 py-5 rounded-2xl text-lg font-bold transition-all shadow-premium hover:-translate-y-1 w-full md:w-auto">
              Explore Cities
            </Link>
            <Link to="/learn"
              className="glass px-10 py-5 rounded-2xl text-lg font-bold w-full md:w-auto transition-all hover:-translate-y-1 hover:shadow-premium"
              style={{ color: '#0f3515', border: '1.5px solid rgba(45,125,54,0.18)' }}>
              Learn Methodology
            </Link>
          </div>
        </div>
      </section>

      {/* ── Trust Indicators ─────────────────────────────────────────────── */}
      <section className="py-14 px-6"
        style={{
          background: 'linear-gradient(135deg, rgba(240,248,236,0.7), rgba(250,253,248,0.9))',
          borderTop: '1px solid rgba(45,125,54,0.08)',
          borderBottom: '1px solid rgba(45,125,54,0.08)',
        }}>
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { label: 'Cities Covered', value: '5+', icon: '🏙️' },
            { label: 'Data Points', value: '50k+', icon: '📡' },
            { label: 'Heat Cooling', value: '2.5°C', icon: '🌡️' },
            { label: 'Risk Accuracy', value: '94%', icon: '🎯' },
          ].map((stat, i) => (
            <div key={i} className="text-center group cursor-default">
              <div className="text-2xl mb-2 group-hover:scale-125 transition-transform inline-block">{stat.icon}</div>
              <div className="text-3xl font-display font-black mb-1 group-hover:scale-110 transition-transform"
                style={{
                  background: 'linear-gradient(135deg, #0f3515 0%, #2d7d36 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                {stat.value}
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.18em]"
                style={{ color: 'rgba(45,125,54,0.5)' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="py-32 px-6" style={{ background: 'var(--color-bg-light)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="badge-nature inline-block mb-5">What you can do</div>
            <h2 className="text-4xl md:text-5xl font-display font-black mb-5" style={{ color: '#091f0c' }}>
              Precision Urban Analytics
            </h2>
            <p className="max-w-xl mx-auto text-lg font-medium" style={{ color: 'rgba(15,53,21,0.5)' }}>
              Modern tools for the modern environmentalist. See the invisible impacts of urban sprawl.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="p-8 rounded-3xl group leaf-glow cursor-default"
                style={{
                  background: f.grad,
                  border: '1.5px solid rgba(45,125,54,0.09)',
                  boxShadow: 'var(--shadow-soft)',
                  animationDelay: `${i * 0.12}s`,
                }}>
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-white transition-transform group-hover:scale-110"
                  style={{ background: f.iconGrad, boxShadow: '0 4px 16px -4px rgba(45,125,54,0.35)' }}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-black mb-3" style={{ color: '#0f3515' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed font-medium" style={{ color: 'rgba(15,53,21,0.55)' }}>
                  {f.desc}
                </p>

                {/* Hover arrow */}
                <div className="mt-6 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0">
                  <span className="text-xs font-black uppercase tracking-widest" style={{ color: '#2d7d36' }}>
                    Explore
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24"
                    fill="none" stroke="#2d7d36" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
                  </svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
      <section className="py-20 px-6 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #091f0c 0%, #0f3515 50%, #1f6128 100%)',
        }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 80% at 50% 50%, rgba(45,125,54,0.25) 0%, transparent 70%)' }} />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-display font-black text-white mb-6 tracking-tight">
            Ready to see your city differently?
          </h2>
          <p className="text-lg mb-10 font-medium" style={{ color: 'rgba(192,224,194,0.75)' }}>
            Explore real-time temperature and vegetation data. Run simulations. Make the invisible visible.
          </p>
          <Link to="/explore"
            className="inline-flex items-center gap-3 text-white px-12 py-5 rounded-2xl text-lg font-black transition-all hover:-translate-y-1 hover:shadow-deep"
            style={{
              background: 'linear-gradient(135deg, #2d7d36, #4ea056)',
              boxShadow: '0 8px 32px -8px rgba(78,160,86,0.55)',
            }}>
            Start Exploring
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Landing;
