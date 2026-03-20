import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)', padding: '48px 24px 24px', marginTop: '80px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'linear-gradient(135deg,var(--accent),var(--cyan))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-head)', fontSize: '16px', fontWeight: 800, color: '#fff' }}>R</div>
              <span style={{ fontFamily: 'var(--font-head)', fontSize: '16px', fontWeight: 700 }}>Ram Coaching Classes</span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.7 }}>
              Pimpri, Pune's trusted coaching for 9th–12th, JEE & NEET. Expert faculty, personalised attention, proven results since 2012.
            </p>
          </div>

          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '14px' }}>Classes</h4>
            {['9th Standard', '10th Standard', '11th Science', '12th Science'].map(c => (
              <Link key={c} to="/classes" style={{ display: 'block', fontSize: '14px', color: 'var(--text2)', marginBottom: '8px', transition: 'color .2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                onMouseLeave={e => e.target.style.color = 'var(--text2)'}
              >{c}</Link>
            ))}
          </div>

          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '14px' }}>Exams</h4>
            {[['JEE Guidance', '/jee'], ['NEET Guidance', '/neet'], ['Daily DPP', '/dpp'], ['Free Resources', '/resources']].map(([label, path]) => (
              <Link key={label} to={path} style={{ display: 'block', fontSize: '14px', color: 'var(--text2)', marginBottom: '8px', transition: 'color .2s' }}
                onMouseEnter={e => e.target.style.color = 'var(--accent)'}
                onMouseLeave={e => e.target.style.color = 'var(--text2)'}
              >{label}</Link>
            ))}
          </div>

          <div>
            <h4 style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text3)', textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: '14px' }}>Contact</h4>
            <p style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '8px' }}>📍 Pimpri, Pune – 411018</p>
            <p style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '8px' }}>📞 +91 98765 43210</p>
            <p style={{ fontSize: '14px', color: 'var(--text2)', marginBottom: '8px' }}>✉ info@ramcoaching.in</p>
            <p style={{ fontSize: '14px', color: 'var(--text2)' }}>🕐 Mon–Sat, 9 AM – 8 PM</p>
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', fontSize: '13px', color: 'var(--text3)' }}>
          <span>© 2025 Ram Coaching Classes, Pimpri, Pune. All rights reserved.</span>
          <span>Made with ♥ for Students</span>
        </div>
      </div>
    </footer>
  )
}
