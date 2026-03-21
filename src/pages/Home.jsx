import { Link } from 'react-router-dom'
import { Countdown, SectionHead, TopperCard } from '../components/UI'

const TOPPERS = [
  { medal:'🥇', exam:'JEE Advanced 2024', name:'Aarav Sharma',    score:'AIR 847',   college:'IIT Bombay — CS' },
  { medal:'🥇', exam:'NEET UG 2024',      name:'Priya Kulkarni', score:'720 / 720', college:'AIIMS Delhi' },
  { medal:'🥈', exam:'JEE Mains 2024',    name:'Rohit Desai',    score:'99.4 %ile', college:'NIT Pune' },
  { medal:'⭐', exam:'SSC Board 2024',    name:'Sneha Pawar',    score:'98.4%',     college:'Distinction' },
]

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section style={{ padding: '80px 0 60px' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
          <div className="fade-up">

            <h1 style={{ fontSize: 'clamp(36px,5vw,64px)', fontWeight: 800, lineHeight: 1.1, marginBottom: '20px' }}>
              Shape Your<br />
              <span className="gradient-text">Future</span><br />
              With Us
            </h1>

            <p style={{ fontSize: '16px', color: 'var(--text2)', lineHeight: 1.7, marginBottom: '32px', maxWidth: '480px' }}>
              Expert guidance for 9th to 12th standard, JEE & NEET preparation. Proven results, personalised attention, complete study support.
            </p>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link to="/inquiry" className="btn btn-primary btn-lg">🎓 Admission Open</Link>
              <Link to="/jee" className="btn btn-outline btn-lg">JEE / NEET Guidance →</Link>
            </div>

            <div style={{ display: 'flex', gap: '40px', marginTop: '44px' }}>
              {[['500+','Students Enrolled'], ['12+','Years Experience'], ['95%','Success Rate']].map(([val, label]) => (
                <div key={label}>
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: '28px', fontWeight: 700 }}>{val}</div>
                  <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '3px' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Hero Card */}
          <div className="card" style={{ position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '150px', height: '150px', background: 'radial-gradient(circle,rgba(108,99,255,.18),transparent)', borderRadius: '50%' }} />
            <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '18px', fontWeight: 700, marginBottom: '16px' }}>Select Your Class</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '14px' }}>
              {[['9th','Foundation'],['10th','Board Prep'],['11th','Science Stream'],['12th','Board + Entrance']].map(([num, sub]) => (
                <Link key={num} to="/classes" style={{
                  background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '10px',
                  padding: '14px', textAlign: 'center', cursor: 'pointer', textDecoration: 'none',
                  transition: 'all .2s', display: 'block'
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'rgba(108,99,255,.08)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg3)' }}
                >
                  <div style={{ fontFamily: 'var(--font-head)', fontSize: '24px', fontWeight: 700, color: 'var(--accent)' }}>{num}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>{sub}</div>
                </Link>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              {[['⚡ JEE','Mains & Advanced','var(--gold)','/jee'],['🧬 NEET','UG Preparation','var(--green)','/neet']].map(([title, sub, color, path]) => (
                <Link key={title} to={path} style={{ flex: 1, background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: '8px', padding: '10px', textAlign: 'center', textDecoration: 'none', transition: 'border-color .2s', display: 'block' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = color}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{ fontSize: '13px', fontWeight: 700, color }}>{title}</div>
                  <div style={{ fontSize: '11px', color: 'var(--text3)', marginTop: '2px' }}>{sub}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHAT WE OFFER */}
      <section style={{ padding: '40px 0 60px' }}>
        <div className="container">
          <SectionHead tag="What We Offer" title="Everything You Need to Excel" sub="Complete academic support from expert faculty" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '20px' }}>
            {[
              { icon:'📖', title:'Class-wise Coaching', desc:'Structured curriculum for 9th, 10th, 11th & 12th. Subject experts for each board subject.', link:'/classes', color:'rgba(108,99,255,.12)' },
              { icon:'🔬', title:'PCM / PCB Subjects',  desc:'Physics, Chemistry, Maths & Biology — deep concept clearing with problem-solving focus.', link:'/classes', color:'rgba(6,182,212,.12)' },
              { icon:'⚡', title:'JEE Preparation',     desc:'IIT-JEE Mains & Advanced strategy, important chapters, mock tests & full guidance.', link:'/jee', color:'rgba(245,158,11,.12)' },
              { icon:'🧬', title:'NEET Guidance',       desc:'Comprehensive NEET-UG preparation with Biology focus, past papers & crash courses.', link:'/neet', color:'rgba(16,185,129,.12)' },
              { icon:'📝', title:'Daily DPP',           desc:'5 questions daily per subject — auto-graded with instant feedback & solutions.', link:'/dpp', color:'rgba(236,72,153,.12)' },
              { icon:'📹', title:'Video Lectures',      desc:'Recorded lectures, concept videos and revision sessions inside the student dashboard.', link:'/login', color:'rgba(239,68,68,.12)' },
            ].map(item => (
              <div key={item.title} className="card card-hover">
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: item.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', marginBottom: '16px' }}>{item.icon}</div>
                <h3 style={{ fontSize: '17px', fontWeight: 600, marginBottom: '8px' }}>{item.title}</h3>
                <p style={{ fontSize: '14px', color: 'var(--text2)', lineHeight: 1.6 }}>{item.desc}</p>
                <Link to={item.link} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '14px', fontSize: '13px', color: 'var(--accent)', fontWeight: 500, textDecoration: 'none' }}>Explore →</Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EXAM COUNTDOWN */}
      <section style={{ padding: '0 0 60px' }}>
        <div className="container">
          <SectionHead tag="Exam Countdown" title="Days Remaining" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px,1fr))', gap: '20px' }}>
            <Countdown targetDate="2025-04-06" name="⚡ JEE Mains" color="var(--gold)" />
            <Countdown targetDate="2025-05-04" name="🧬 NEET UG" color="var(--green)" />
            <Countdown targetDate="2025-02-28" name="📋 Board Exam" color="var(--cyan)" />
          </div>
        </div>
      </section>

      {/* WALL OF FAME */}
      <section style={{ padding: '0 0 60px' }}>
        <div className="container">
          <SectionHead tag="Wall of Fame" title="Our Star Achievers" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: '20px', paddingTop: '20px' }}>
            {TOPPERS.map((t, i) => <TopperCard key={i} {...t} />)}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '0 0 60px' }}>
        <div className="container">
          <SectionHead tag="Testimonials" title="What Students Say" />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px,1fr))', gap: '20px' }}>
            {[
              { quote: '"Ram Coaching ke teachers ne mera JEE dream possible kiya. Concept clarity bahut achi ho gayi."', name: 'Aarav Sharma', role: 'IIT Bombay' },
              { quote: '"NEET 720/720 score possible hua sirf unke Biology & Chemistry notes ki wajah se. Best coaching in Pimpri!"', name: 'Priya Kulkarni', role: 'AIIMS Delhi' },
              { quote: '"10th board mein 98% aaya. DPP aur weekly tests ne bahut help kiya. Highly recommend!"', name: 'Sneha Pawar', role: '10th Topper' },
            ].map((t, i) => (
              <div key={i} className="card">
                <p style={{ fontStyle: 'italic', color: 'var(--text2)', lineHeight: 1.7, fontSize: '14px' }}>{t.quote}</p>
                <div style={{ marginTop: '14px', fontWeight: 600, fontSize: '14px' }}>— {t.name}, {t.role}</div>
                <div style={{ color: 'var(--gold)', fontSize: '13px', marginTop: '4px' }}>★★★★★</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '20px', color: 'var(--text3)', fontSize: '13px' }}>
            ⭐ 4.9 / 5 · 200+ Google Reviews
          </div>
        </div>
      </section>
    </div>
  )
}
