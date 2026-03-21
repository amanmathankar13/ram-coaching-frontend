import { useState } from 'react'
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

const NAV_LINKS = [
  ['/', 'Home'],
  ['/classes', 'Classes'],
  ['/jee', 'JEE'],
  ['/neet', 'NEET'],
  ['/dpp', 'DPP'],
  ['/resources', 'Resources'],
  ['/results', 'Results'],
  ['/contact', 'Contact'],
]

const RCCLogo = ({ size = 44 }) => (
  <svg width={size} height={Math.round(size * 50 / 44)} viewBox="0 0 220 250" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shHL" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#d44808"/>
        <stop offset="49%" stopColor="#c03a00"/>
        <stop offset="51%" stopColor="#f08030"/>
        <stop offset="100%" stopColor="#e06010"/>
      </linearGradient>
      <linearGradient id="gRing" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#f5d060"/>
        <stop offset="40%" stopColor="#d4a020"/>
        <stop offset="70%" stopColor="#f0c030"/>
        <stop offset="100%" stopColor="#b87e10"/>
      </linearGradient>
      <linearGradient id="cGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#8b3a0a"/>
        <stop offset="100%" stopColor="#5c2006"/>
      </linearGradient>
      <linearGradient id="ribGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#f0c030"/>
        <stop offset="50%" stopColor="#d4a020"/>
        <stop offset="100%" stopColor="#8b5e08"/>
      </linearGradient>
    </defs>
    <path d="M110 8 L205 45 L205 130 Q205 195 110 235 Q15 195 15 130 L15 45 Z" fill="url(#shHL)" stroke="url(#gRing)" strokeWidth="5"/>
    <line x1="110" y1="8" x2="110" y2="225" stroke="#d4a020" strokeWidth="2" opacity="0.4"/>
    <line x1="15" y1="88" x2="205" y2="88" stroke="#d4a020" strokeWidth="2" opacity="0.4"/>
    <circle cx="110" cy="115" r="73" fill="none" stroke="url(#gRing)" strokeWidth="9"/>
    <circle cx="110" cy="115" r="64" fill="url(#cGrad)"/>
    <circle cx="110" cy="115" r="62" fill="none" stroke="#f0c030" strokeWidth="1.5" opacity="0.5"/>
    <text x="110" y="68" textAnchor="middle" fill="#d4a843" fontSize="11" letterSpacing="7">★ ★ ★ ★</text>
    <text x="108" y="132" textAnchor="middle" fontFamily="Georgia,serif" fontSize="48" fontWeight="700" fill="url(#gRing)" letterSpacing="-2">RCC</text>
    <text x="110" y="160" textAnchor="middle" fill="#c49020" fontSize="13" opacity="0.9">✦ ❧ ✦</text>
    <path d="M25 208 Q52 196 78 207 L78 232 Q52 224 25 234 Z" fill="url(#ribGrad)"/>
    <path d="M142 207 Q168 196 195 208 L195 234 Q168 224 142 232 Z" fill="url(#ribGrad)"/>
    <rect x="70" y="199" width="80" height="38" rx="5" fill="url(#ribGrad)"/>
    <text x="110" y="223" textAnchor="middle" fontFamily="Georgia,serif" fontSize="10.5" fontWeight="700" fill="#3a1e00" letterSpacing="0.5">RAM COACHING</text>
  </svg>
)

export default function Navbar() {
  const { user, logout }   = useAuth()
  const { theme, toggle }  = useTheme()
  const navigate           = useNavigate()
  const location           = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false) }
  const closeMenu    = ()    => setMenuOpen(false)
  const isActive     = (path) => location.pathname === path

  return (
    <>
      {/* News Ticker */}
      <div className="ticker">
        <div className="ticker-track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="ticker-item">{item}</span>
          ))}
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">

          {/* Logo */}
          <Link to="/" className="navbar-logo" onClick={closeMenu}>
            <RCCLogo size={40} />
           <div className="navbar-brand navbar-brand-desktop-only">
            <span className="navbar-brand-main">Ram Coaching Classes</span>
            <span className="navbar-brand-sub">📍 Tawanagar</span>
          </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="navbar-links">
            {NAV_LINKS.map(([path, label]) => (
              <Link key={path} to={path} style={{
                padding: '6px 10px', borderRadius: '6px', fontSize: '13px',
                fontWeight: 500, transition: 'all .2s', textDecoration: 'none',
                color: isActive(path) ? 'var(--text)' : 'var(--text2)',
                background: isActive(path) ? 'var(--surface)' : 'transparent',
                border: isActive(path) ? '1px solid var(--border2)' : '1px solid transparent',
              }}>{label}</Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="navbar-actions navbar-desktop-actions">
            {user ? (
              <>
                <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="btn btn-sm btn-outline">
                  {user.role === 'admin' ? '🛡 Admin' : '👤 Dashboard'}
                </Link>
                <button className="btn btn-sm btn-ghost" onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-sm btn-outline">Login</Link>
                <Link to="/inquiry" className="btn btn-sm btn-primary">Admit Now</Link>
              </>
            )}
          </div>

          {/* Mobile: theme + hamburger */}
          <div className="navbar-actions" style={{ marginLeft: 'auto' }}>
            <button className="theme-btn" onClick={toggle} style={{ display: 'flex' }}>
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
            <button
              className={`hamburger ${menuOpen ? 'open' : ''}`}
              onClick={() => setMenuOpen(o => !o)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {NAV_LINKS.map(([path, label]) => (
          <Link
            key={path} to={path}
            className={`mobile-nav-link ${isActive(path) ? 'active' : ''}`}
            onClick={closeMenu}
          >{label}</Link>
        ))}
        <div className="mobile-menu-actions">
          {user ? (
            <>
              <Link
                to={user.role === 'admin' ? '/admin' : '/dashboard'}
                className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }}
                onClick={closeMenu}
              >{user.role === 'admin' ? '🛡 Admin' : '👤 Dashboard'}</Link>
              <button className="btn btn-ghost" onClick={handleLogout} style={{ flex: 1, justifyContent: 'center' }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"   className="btn btn-outline" style={{ flex: 1, justifyContent: 'center' }} onClick={closeMenu}>Login</Link>
              <Link to="/inquiry" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }} onClick={closeMenu}>Admit Now</Link>
            </>
          )}
        </div>
      </div>
    </>
  )
}
