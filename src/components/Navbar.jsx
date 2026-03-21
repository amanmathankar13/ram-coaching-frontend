import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const TICKER_ITEMS = [
  '📢 Admission Open 2025-26 — All Classes',
  '🏆 Our students scored 99.2%ile in JEE Mains 2024',
  '📚 New Batch Starting: 11th Science — 1 April 2025',
  '🎯 NEET Crash Course Registration Open',
  '✅ Weekly DPP for Physics uploaded — Check Dashboard',
]

export default function Navbar() {
  const { user, logout } = useAuth()
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const active = (path) => location.pathname === path ? 'nav-link active' : 'nav-link'

  const handleLogout = () => { logout(); navigate('/') }

  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS]

  return (
    <>
      {/* News Ticker */}
      <div className="ticker">
        <div className="ticker-track">
          {doubled.map((item, i) => (
            <span key={i} className="ticker-item">{item}</span>
          ))}
        </div>
      </div>

      {/* Main Nav */}
      <nav style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: 'var(--nav-bg)',          // ← was hardcoded rgba(10,10,15)
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--nav-border)',  // ← was hardcoded
          transition: 'background 0.3s, border-color 0.3s',
        }}>
        <div className="container" style={{ height: '64px', display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Logo */}
          <Link to="/" style={{ display:'flex', alignItems:'center', gap:'12px', textDecoration:'none', flexShrink:0 }}>
          {/* SVG Logo — no black background, scales perfectly */}
          <svg width="44" height="50" viewBox="0 0 220 250" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="shieldHL" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{stopColor:'#d44808'}}/>
                <stop offset="49%" style={{stopColor:'#c03a00'}}/>
                <stop offset="51%" style={{stopColor:'#f08030'}}/>
                <stop offset="100%" style={{stopColor:'#e06010'}}/>
              </linearGradient>
              <linearGradient id="goldRing" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#f5d060'}}/>
                <stop offset="40%" style={{stopColor:'#d4a020'}}/>
                <stop offset="70%" style={{stopColor:'#f0c030'}}/>
                <stop offset="100%" style={{stopColor:'#b87e10'}}/>
              </linearGradient>
              <linearGradient id="circleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{stopColor:'#8b3a0a'}}/>
                <stop offset="100%" style={{stopColor:'#5c2006'}}/>
              </linearGradient>
              <linearGradient id="ribbonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" style={{stopColor:'#f0c030'}}/>
                <stop offset="50%" style={{stopColor:'#d4a020'}}/>
                <stop offset="100%" style={{stopColor:'#8b5e08'}}/>
              </linearGradient>
            </defs>
            <path d="M110 8 L205 45 L205 130 Q205 195 110 235 Q15 195 15 130 L15 45 Z" fill="url(#shieldHL)" stroke="url(#goldRing)" strokeWidth="5"/>
            <line x1="110" y1="8" x2="110" y2="225" stroke="#d4a020" strokeWidth="2" opacity="0.4"/>
            <line x1="15" y1="88" x2="205" y2="88" stroke="#d4a020" strokeWidth="2" opacity="0.4"/>
            <circle cx="110" cy="115" r="73" fill="none" stroke="url(#goldRing)" strokeWidth="9"/>
            <circle cx="110" cy="115" r="64" fill="url(#circleGrad)"/>
            <circle cx="110" cy="115" r="62" fill="none" stroke="#f0c030" strokeWidth="1.5" opacity="0.5"/>
            <text x="110" y="68" textAnchor="middle" fill="#d4a843" fontSize="11" letterSpacing="7">★ ★ ★ ★</text>
            <text x="108" y="132" textAnchor="middle" fontFamily="Georgia, serif" fontSize="48" fontWeight="700" fill="url(#goldRing)" letterSpacing="-2">RCC</text>
            <text x="110" y="160" textAnchor="middle" fill="#c49020" fontSize="13" opacity="0.9">✦ ❧ ✦</text>
            <path d="M25 208 Q52 196 78 207 L78 232 Q52 224 25 234 Z" fill="url(#ribbonGrad)"/>
            <path d="M142 207 Q168 196 195 208 L195 234 Q168 224 142 232 Z" fill="url(#ribbonGrad)"/>
            <rect x="70" y="199" width="80" height="38" rx="5" fill="url(#ribbonGrad)"/>
            <text x="110" y="223" textAnchor="middle" fontFamily="Georgia, serif" fontSize="10.5" fontWeight="700" fill="#3a1e00" letterSpacing="0.5">RAM COACHING</text>
          </svg>

          {/* Brand name with Cinzel font */}
          <div style={{ display:'flex', flexDirection:'column', lineHeight:1 }}>
            <span style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '17px',
            fontWeight: 700,
            color: 'var(--gold)',      // ← was hardcoded #d4a843
            letterSpacing: '1px',
          }}>
            Ram Coaching
          </span>
          <span style={{
            fontFamily: "'Cinzel', serif",
            fontSize: '9px',
            fontWeight: 700,
            color: 'var(--text3)',     // ← was hardcoded #a07830
            letterSpacing: '3px',
            textTransform: 'uppercase',
            marginTop: '3px',
          }}>
            Classes · Tawanagar
          </span>
          </div>
        </Link>

          {/* Nav Links */}
          <div style={{ display: 'flex', gap: '2px', marginLeft: 'auto', flexWrap: 'wrap' }}>
            {[
            ['/', 'Home'],
            ['/classes', 'Classes'],
            ['/jee', 'JEE'],
            ['/neet', 'NEET'],
            ['/dpp', 'DPP'],
            ['/resources', 'Resources'],
            ['/results', 'Results'],
            ['/contact', 'Contact'],
          ].map(([path, label]) => (
            <Link key={path} to={path} style={{
              padding: '6px 12px',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              color: location.pathname === path ? 'var(--text)' : 'var(--text2)',
              background: location.pathname === path ? 'var(--surface)' : 'transparent',
              border: location.pathname === path ? '1px solid var(--border2)' : '1px solid transparent',
              transition: 'all .2s',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => {
                if (location.pathname !== path) {
                  e.currentTarget.style.color = 'var(--text)'
                  e.currentTarget.style.background = 'var(--surface2)'
                }
              }}
              onMouseLeave={e => {
                if (location.pathname !== path) {
                  e.currentTarget.style.color = 'var(--text2)'
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >{label}</Link>
          ))}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexShrink: 0 }}>
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="btn btn-sm btn-outline">
                  {user.role === 'admin' ? '🛡 Admin' : '👤 Dashboard'}
                </Link>
                <button className="btn btn-sm btn-ghost" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
              <Link to="/login" className="btn btn-sm btn-outline" style={{
                color: 'var(--text2)',
                borderColor: 'var(--border2)',
              }}>Login</Link>
                <Link to="/inquiry" className="btn btn-sm btn-primary">Admit Now</Link>
              </>
            )}
            <button onClick={toggle} style={{
              width: '36px',
              height: '36px',
              borderRadius: '8px',
              border: '1px solid var(--border2)',
              background: 'var(--surface)',        // ← uses CSS var, auto switches
              color: 'var(--text2)',               // ← uses CSS var, auto switches
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '16px',
              transition: 'all .2s',
            }}>
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
          </div>
        </div>
      </nav>
    </>
  )
}
