const Footer = () => {
  return (
    <footer className="relative overflow-hidden text-forest-100 py-16 px-6 mt-auto"
      style={{
        background: 'linear-gradient(160deg, #091f0c 0%, #0f3515 55%, #041008 100%)',
      }}>

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(45,125,54,0.18) 0%, transparent 70%)', transform: 'translate(30%, -40%)' }} />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(107,148,56,0.12) 0%, transparent 70%)', transform: 'translate(-30%, 40%)' }} />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">

        {/* Brand */}
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2.5 mb-6">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #2d7d36, #4ea056)' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.47 10-10 10z" />
              </svg>
            </div>
            <span className="text-xl font-display font-black tracking-tight"
              style={{ background: 'linear-gradient(135deg, #87c48b, #c0e0c2)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              GreenLens
            </span>
          </div>
          <p className="max-w-sm mb-8 leading-relaxed text-sm font-medium"
            style={{ color: 'rgba(192, 224, 194, 0.75)' }}>
            Visualizing urban heat and green cover to empower citizens and policymakers in building more resilient Indian cities.
          </p>
          <div className="flex gap-3">
            {[
              /* Twitter/X */
              <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />,
              /* LinkedIn */
              <><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></>,
            ].map((d, i) => (
              <a key={i} href="#"
                className="w-9 h-9 rounded-full flex items-center justify-center transition-all hover:-translate-y-0.5"
                style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(135,196,139,0.15)' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(45,125,54,0.30)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                  fill="none" stroke="rgba(192,224,194,0.8)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {d}
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* Explore */}
        <div>
          <h4 className="font-bold mb-6 text-sm tracking-widest uppercase"
            style={{ color: 'rgba(135,196,139,0.6)' }}>Explore</h4>
          <ul className="space-y-4">
            {[
              { label: 'City Maps', href: '/explore' },
              { label: 'Impact Simulator', href: '/simulate' },
              { label: 'Time Machine', href: '/history' },
              { label: 'Methodology', href: '/learn' },
            ].map(({ label, href }) => (
              <li key={label}>
                <a href={href}
                  className="text-sm font-medium transition-colors"
                  style={{ color: 'rgba(192,224,194,0.55)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(192,224,194,1)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(192,224,194,0.55)'}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold mb-6 text-sm tracking-widest uppercase"
            style={{ color: 'rgba(135,196,139,0.6)' }}>Contact</h4>
          <ul className="space-y-4">
            {[
              { label: 'hello@greenlens.in', href: 'mailto:hello@greenlens.in' },
              { label: 'Support Center', href: '#' },
              { label: 'Privacy Policy', href: '#' },
            ].map(({ label, href }) => (
              <li key={label}>
                <a href={href}
                  className="text-sm font-medium transition-colors"
                  style={{ color: 'rgba(192,224,194,0.55)' }}
                  onMouseEnter={e => e.currentTarget.style.color = 'rgba(192,224,194,1)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'rgba(192,224,194,0.55)'}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative max-w-7xl mx-auto mt-16 pt-8 text-center text-xs font-medium"
        style={{ borderTop: '1px solid rgba(135,196,139,0.12)', color: 'rgba(135,196,139,0.35)' }}>
        <p>© {new Date().getFullYear()} GreenLens. Built for India with 💚</p>
      </div>
    </footer>
  );
};

export default Footer;
