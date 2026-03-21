import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background:'var(--surface)', borderTop:'1px solid var(--border)', padding:'clamp(32px,5vw,48px) 24px 24px', marginTop:'60px' }}>
      <div className="container">
        <div className="footer-grid" style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:'40px', marginBottom:'36px' }}>
          {/* About */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'14px' }}>
              <svg width="34" height="38" viewBox="0 0 220 250" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="fshHL" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#d44808"/><stop offset="49%" stopColor="#c03a00"/>
                    <stop offset="51%" stopColor="#f08030"/><stop offset="100%" stopColor="#e06010"/>
                  </linearGradient>
                  <linearGradient id="fgRing" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#f5d060"/><stop offset="40%" stopColor="#d4a020"/>
                    <stop offset="70%" stopColor="#f0c030"/><stop offset="100%" stopColor="#b87e10"/>
                  </linearGradient>
                  <linearGradient id="fcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#8b3a0a"/><stop offset="100%" stopColor="#5c2006"/>
                  </linearGradient>
                  <linearGradient id="fribGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f0c030"/><stop offset="50%" stopColor="#d4a020"/>
                    <stop offset="100%" stopColor="#8b5e08"/>
                  </linearGradient>
                </defs>
                <path d="M110 8 L205 45 L205 130 Q205 195 110 235 Q15 195 15 130 L15 45 Z" fill="url(#fshHL)" stroke="url(#fgRing)" strokeWidth="5"/>
                <circle cx="110" cy="115" r="73" fill="none" stroke="url(#fgRing)" strokeWidth="9"/>
                <circle cx="110" cy="115" r="64" fill="url(#fcGrad)"/>
                <text x="108" y="132" textAnchor="middle" fontFamily="Georgia,serif" fontSize="48" fontWeight="700" fill="url(#fgRing)" letterSpacing="-2">RCC</text>
                <path d="M25 208 Q52 196 78 207 L78 232 Q52 224 25 234 Z" fill="url(#fribGrad)"/>
                <path d="M142 207 Q168 196 195 208 L195 234 Q168 224 142 232 Z" fill="url(#fribGrad)"/>
                <rect x="70" y="199" width="80" height="38" rx="5" fill="url(#fribGrad)"/>
                <text x="110" y="223" textAnchor="middle" fontFamily="Georgia,serif" fontSize="10.5" fontWeight="700" fill="#3a1e00">RCC</text>
              </svg>
              <div>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:'15px', fontWeight:700, color:'var(--gold)' }}>Ram Coaching Classes</div>
                <div style={{ fontSize:'11px', color:'var(--text3)' }}>Pimpri, Pune</div>
              </div>
            </div>
            <p style={{ fontSize:'14px', color:'var(--text2)', lineHeight:1.7 }}>
              Pimpri, Pune's trusted coaching for 9th–12th, JEE &amp; NEET. Expert faculty, personalised attention, proven results since 2012.
            </p>
          </div>

          {/* Classes */}
          <div>
            <h4 style={{ fontSize:'12px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:'14px' }}>Classes</h4>
            {[['9th Standard','/classes'],['10th Standard','/classes'],['11th Science','/classes'],['12th Science','/classes']].map(([l,p]) => (
              <Link key={l} to={p} style={{ display:'block', fontSize:'14px', color:'var(--text2)', marginBottom:'8px', transition:'color .2s' }}
                onMouseEnter={e => e.target.style.color='var(--accent)'}
                onMouseLeave={e => e.target.style.color='var(--text2)'}
              >{l}</Link>
            ))}
          </div>

          {/* Exams */}
          <div>
            <h4 style={{ fontSize:'12px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:'14px' }}>Exams</h4>
            {[['JEE Guidance','/jee'],['NEET Guidance','/neet'],['Daily DPP','/dpp'],['Free Resources','/resources']].map(([l,p]) => (
              <Link key={l} to={p} style={{ display:'block', fontSize:'14px', color:'var(--text2)', marginBottom:'8px', transition:'color .2s' }}
                onMouseEnter={e => e.target.style.color='var(--accent)'}
                onMouseLeave={e => e.target.style.color='var(--text2)'}
              >{l}</Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize:'12px', fontWeight:600, color:'var(--text3)', textTransform:'uppercase', letterSpacing:'.5px', marginBottom:'14px' }}>Contact</h4>
            <p style={{ fontSize:'14px', color:'var(--text2)', marginBottom:'8px' }}>📍 Pimpri, Pune – 411018</p>
            <p style={{ fontSize:'14px', color:'var(--text2)', marginBottom:'8px' }}>📞 +91 98765 43210</p>
            <p style={{ fontSize:'14px', color:'var(--text2)', marginBottom:'8px' }}>✉ info@ramcoaching.in</p>
            <p style={{ fontSize:'14px', color:'var(--text2)' }}>🕐 Mon–Sat, 9 AM – 8 PM</p>
          </div>
        </div>

        <div style={{ borderTop:'1px solid var(--border)', paddingTop:'20px', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'8px', fontSize:'13px', color:'var(--text3)' }}>
          <span>© 2025 Ram Coaching Classes, Pimpri, Pune. All rights reserved.</span>
          <span>Made with ♥ for Students</span>
        </div>
      </div>
    </footer>
  )
}
