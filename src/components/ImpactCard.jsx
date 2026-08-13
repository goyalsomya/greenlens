const ImpactCard = ({ icon, label, value, delta, unit, description, colorClass = "text-primary-600" }) => {
  const isPositive = delta > 0;
  const isNeutral  = delta === 0;

  const getBgGradient = () => {
    if (colorClass.includes('red'))     return 'linear-gradient(135deg,#fff5f5,#fef2f2)';
    if (colorClass.includes('emerald')) return 'linear-gradient(135deg,#f0fdf4,#f5faf3)';
    if (colorClass.includes('amber'))   return 'linear-gradient(135deg,#fffdf0,#fdf9e8)';
    return 'linear-gradient(135deg,#f5faf3,#f2f8f2)';
  };

  const getIconBorder = () => {
    if (colorClass.includes('red'))     return 'rgba(220,38,38,0.15)';
    if (colorClass.includes('emerald')) return 'rgba(5,150,105,0.18)';
    if (colorClass.includes('amber'))   return 'rgba(217,119,6,0.18)';
    return 'rgba(45,125,54,0.18)';
  };

  return (
    <div className="p-6 rounded-3xl border transition-all hover:shadow-deep hover:-translate-y-0.5"
      style={{
        background: getBgGradient(),
        border: `1px solid rgba(45,125,54,0.08)`,
        boxShadow: 'var(--shadow-soft)',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
      }}>

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2.5 rounded-xl flex items-center justify-center"
          style={{
            background: getBgGradient(),
            border: `1.5px solid ${getIconBorder()}`,
            boxShadow: `0 2px 8px -2px ${getIconBorder()}`,
          }}>
          <span className={colorClass}>{icon}</span>
        </div>
        <span className="text-[10px] font-black uppercase tracking-[0.18em]"
          style={{ color: 'rgba(45,125,54,0.5)' }}>
          {label}
        </span>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-3xl font-display font-black"
          style={{ color: '#0f3515' }}>
          {value}{unit}
        </span>
        {!isNeutral && (
          <span className={`text-sm font-bold flex items-center gap-0.5 ${isPositive ? 'text-red-500' : 'text-emerald-600'}`}>
            {isPositive ? '+' : ''}{delta}{unit}
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
              className={isPositive ? 'rotate-0' : 'rotate-180'}>
              <path d="m18 15-6-6-6 6" />
            </svg>
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-xs leading-relaxed font-medium" style={{ color: 'rgba(15,53,21,0.45)' }}>
        {description}
      </p>
    </div>
  );
};

export default ImpactCard;
