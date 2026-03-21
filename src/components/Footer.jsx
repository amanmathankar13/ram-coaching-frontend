import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background:'var(--surface)', borderTop:'1px solid var(--border)', padding:'clamp(32px,5vw,48px) 24px 24px', marginTop:'60px' }}>
      <div className="container">
        <div className="footer-grid" style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr', gap:'40px', marginBottom:'36px' }}>
          {/* About */}
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'14px' }}>
               <img
                src="/logo.png"
                alt="Ram Coaching Classes"
                style={{
                  height: '48px',
                  width: 'auto',
                  objectFit: 'contain',
                }}
              />
              <div>
                <div style={{ fontFamily:"'Cinzel',serif", fontSize:'15px', fontWeight:700, color:'var(--gold)' }}>Ram Coaching Classes</div>
                <div style={{ fontSize:'11px', color:'var(--text3)' }}>Tawanagar, M.P</div>
              </div>
            </div>
            <p style={{ fontSize:'14px', color:'var(--text2)', lineHeight:1.7 }}>
              Tawanagar's trusted coaching for 9th–12th, JEE &amp; NEET. Expert faculty, personalised attention, proven results since 2012.
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
            <p style={{ fontSize:'14px', color:'var(--text2)', marginBottom:'8px' }}>📍 Tawanagar – 461551</p>
            <p style={{ fontSize:'14px', color:'var(--text2)', marginBottom:'8px' }}>📞 +91 94078 52570</p>
            <p style={{ fontSize:'13px', color:'var(--text2)', marginBottom:'8px' }}>✉ ayushmathankar24@gmail.com</p>
            <p style={{ fontSize:'14px', color:'var(--text2)' }}>🕐 Mon–Sat, 9 AM – 8 PM</p>
          </div>
        </div>

        <div style={{ borderTop:'1px solid var(--border)', paddingTop:'20px', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'8px', fontSize:'13px', color:'var(--text3)' }}>
          <span>© 2026 Ayush Mathankar, Tawanagar. All rights reserved.</span>
          <span>Made with ♥ for Students</span>
        </div>
      </div>
    </footer>
  )
}
