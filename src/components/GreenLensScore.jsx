const GreenLensScore = ({ score = 0 }) => {
  const radius       = 36;
  const circumference = 2 * Math.PI * radius;
  const offset       = circumference - (score / 100) * circumference;

  const getGradientId = (s) => {
    if (s > 75) return 'scoreGradientHigh';
    if (s > 50) return 'scoreGradientMid';
    if (s > 25) return 'scoreGradientLow';
    return 'scoreGradientCrit';
  };

  const getTextColor = (s) => {
    if (s > 75) return '#059669';
    if (s > 50) return '#2d7d36';
    if (s > 25) return '#b45309';
    return '#dc2626';
  };

  return (
    <div className="flex flex-col items-center">
      <div className="relative flex items-center justify-center">
        <svg className="w-40 h-40 transform -rotate-90">
          <defs>
            <linearGradient id="scoreGradientHigh" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4ea056" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="scoreGradientMid" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2d7d36" />
              <stop offset="100%" stopColor="#6b9438" />
            </linearGradient>
            <linearGradient id="scoreGradientLow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="scoreGradientCrit" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#b91c1c" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
          </defs>

          {/* Track */}
          <circle
            cx="80" cy="80" r={radius}
            fill="none" stroke="rgba(45,125,54,0.1)" strokeWidth="8"
          />
          {/* Progress arc */}
          <circle
            cx="80" cy="80" r={radius}
            fill="none"
            stroke={`url(#${getGradientId(score)})`}
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>

        {/* Center label */}
        <div className="absolute flex flex-col items-center">
          <span className="text-4xl font-display font-black" style={{ color: getTextColor(score) }}>
            {score}
          </span>
          <span className="text-[9px] font-black uppercase tracking-[0.18em]"
            style={{ color: 'rgba(45,125,54,0.45)' }}>
            Score
          </span>
        </div>
      </div>

      <div className="mt-4 text-center">
        <h4 className="font-bold text-sm" style={{ color: '#0f3515' }}>GreenLens Index</h4>
        <p className="text-xs max-w-[150px] mt-1 leading-snug"
          style={{ color: 'rgba(45,125,54,0.5)' }}>
          Urban livability &amp; environmental health
        </p>
      </div>
    </div>
  );
};

export default GreenLensScore;
