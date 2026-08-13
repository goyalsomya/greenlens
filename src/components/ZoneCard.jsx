const ZoneCard = ({ zone, isActive, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-2xl transition-all border-2 mb-3 group ${
        isActive
          ? 'bg-primary-50 border-primary-500 shadow-premium'
          : 'bg-white dark:bg-primary-900/50 border-primary-100 dark:border-primary-800 hover:border-primary-300'
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h4 className={`font-bold transition-colors ${isActive ? 'text-primary-700' : 'text-primary-900 dark:text-primary-100'}`}>
          {zone.name}
        </h4>
        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${isActive ? 'border-primary-500 bg-primary-500' : 'border-primary-300'}`}>
          {isActive && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="text-primary-500 dark:text-primary-400">
          Temp: <span className="font-semibold text-primary-900 dark:text-primary-100">{zone.temp}°C</span>
        </div>
        <div className="text-primary-500 dark:text-primary-400">
          Green: <span className="font-semibold text-primary-900 dark:text-primary-100">{zone.greenCover}%</span>
        </div>
      </div>
      
      {zone.popDensity > 400 && zone.greenCover < 15 && (
        <div className="mt-2 text-[10px] font-bold text-accent uppercase tracking-wider flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><path d="M12 9v4"></path><path d="M12 17h.01"></path></svg>
          Equity Priority
        </div>
      )}
    </button>
  );
};

export default ZoneCard;
