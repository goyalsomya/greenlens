import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import logo from '../assets/logo.png';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Simulate', path: '/simulate' },
    { name: 'History', path: '/history' },
    { name: 'Learn', path: '/learn' },
  ];

  return (
    <nav className="sticky top-0 z-[5000] backdrop-blur-xl border-b border-forest-200/60 dark:border-forest-800/50 px-8 py-4"
      style={{ background: 'rgba(245, 253, 242, 0.88)' }}>
      <div className="max-w-[1400px] mx-auto flex justify-between items-center">

        {/* Logo */}
        <NavLink to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
            style={{ background: 'linear-gradient(135deg, #d9f5d9ff, #d9f5d9ff)' }}>
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.47 10-10 10z" />
            </svg> */}
            <img src={logo} alt="logo" />
          </div>
          <span className="text-[1.35rem] font-display font-black tracking-tight text-gradient">
            GreenLens
          </span>
        </NavLink>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-9">
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-sm font-semibold transition-all relative py-1 group ${isActive
                  ? 'text-forest-700'
                  : 'text-forest-600/70 hover:text-forest-700'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.name}
                  <span className={`absolute bottom-0 left-0 h-0.5 rounded-full transition-all duration-300 ${isActive
                    ? 'w-full bg-gradient-to-r from-forest-600 to-sage-500'
                    : 'w-0 group-hover:w-full bg-gradient-to-r from-forest-500 to-sage-500'
                    }`} />
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* CTA Button */}
        <NavLink
          to="/explore"
          className="hidden md:flex items-center gap-2 text-white px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-premium group btn-shimmer"
        >
          Try GreenLens
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
            className="group-hover:translate-x-1 transition-transform">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
          </svg>
        </NavLink>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 text-forest-700 rounded-xl hover:bg-forest-100 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            {isOpen
              ? <><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></>
              : <><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 pb-5 px-2 flex flex-col gap-3 border-t border-forest-100 pt-4"
          style={{ animation: 'fadeUp 0.25s ease forwards' }}>
          {links.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `text-base font-semibold px-3 py-2 rounded-xl transition-all ${isActive
                  ? 'text-forest-700 bg-forest-100'
                  : 'text-forest-700/70 hover:bg-forest-50'
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              {link.name}
            </NavLink>
          ))}
          <NavLink
            to="/explore"
            className="btn-shimmer text-white w-full py-3 rounded-2xl font-bold text-center mt-2 shadow-premium"
            onClick={() => setIsOpen(false)}
          >
            Try GreenLens
          </NavLink>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
