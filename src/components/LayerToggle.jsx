const LayerToggle = ({ activeLayer, onToggle }) => {
  const layers = [
    {
      id: 'heat',
      name: 'Heat Map',
      desc: 'Surface temperature overlay',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/>
        </svg>
      ),
      activeGrad: 'linear-gradient(135deg, #b45309, #ea580c)',
      activeBorder: 'rgba(180,83,9,0.3)',
    },
    {
      id: 'green',
      name: 'Green Cover',
      desc: 'Canopy & vegetation index',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m12 19 7-7 3 3-7 7-3-3Z"/>
          <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5Z"/>
          <path d="m2 2 5 2.25L13 18l-7-1.5L2 2Z"/>
        </svg>
      ),
      activeGrad: 'linear-gradient(135deg, #2d7d36, #4ea056)',
      activeBorder: 'rgba(45,125,54,0.3)',
    },
    {
      id: 'both',
      name: 'Combined Analysis',
      desc: 'Heat + canopy overlay',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/>
        </svg>
      ),
      activeGrad: 'linear-gradient(135deg, #174d1f, #2d7d36)',
      activeBorder: 'rgba(23,77,31,0.3)',
    },
  ];

  return (
    <div className="space-y-3">
      {layers.map((layer) => {
        const isActive = activeLayer === layer.id;
        return (
          <button
            key={layer.id}
            onClick={() => onToggle(layer.id)}
            className="w-full flex items-center justify-between rounded-2xl transition-all"
            style={{
              padding: '14px 16px',
              background: isActive
                ? 'linear-gradient(135deg, #f2f8f2, #ffffff)'
                : 'rgba(255,255,255,0.55)',
              border: isActive
                ? `1.5px solid ${layer.activeBorder}`
                : '1.5px solid rgba(45,125,54,0.07)',
              boxShadow: isActive
                ? `0 4px 16px -4px ${layer.activeBorder}, var(--shadow-soft)`
                : 'none',
              transform: isActive ? 'translateY(-1px)' : 'none',
            }}
          >
            <div className="flex items-center gap-3">
              {/* Icon bubble */}
              <div className="w-9 h-9 rounded-xl flex items-center justify-center transition-all"
                style={{
                  background: isActive ? layer.activeGrad : 'rgba(45,125,54,0.07)',
                  color: isActive ? '#fff' : 'rgba(45,125,54,0.6)',
                }}>
                {layer.icon}
              </div>
              <div className="text-left">
                <div className="font-bold text-sm" style={{ color: isActive ? '#0f3515' : 'rgba(15,53,21,0.5)' }}>
                  {layer.name}
                </div>
                <div className="text-[10px] font-medium" style={{ color: 'rgba(45,125,54,0.4)' }}>
                  {layer.desc}
                </div>
              </div>
            </div>

            {/* Radio indicator */}
            <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
              style={{
                borderColor: isActive ? layer.activeBorder.replace('0.3', '0.8') : 'rgba(45,125,54,0.18)',
                background: isActive ? layer.activeGrad : 'transparent',
              }}>
              {isActive && (
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"
                  fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default LayerToggle;
