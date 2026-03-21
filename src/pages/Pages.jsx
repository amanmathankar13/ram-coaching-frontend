import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SectionHead, FAQItem, TopperCard, Alert } from '../components/UI'

// ── Local fallback DPP (used only if backend + AI both fail) ──
const DPP_FALLBACK = {
  Physics: [
    { q:'A ball is thrown vertically upward with initial velocity 20 m/s. What is the maximum height? (g = 10 m/s²)', opts:['10 m','20 m','25 m','40 m'], ans:1, exp:'Using v²=u²-2gh, at max height v=0, so h=u²/2g = 400/20 = 20 m' },
    { q:'Which law states that every action has equal and opposite reaction?', opts:["Newton's 1st Law","Newton's 2nd Law","Newton's 3rd Law","Law of Gravitation"], ans:2, exp:"Newton's 3rd Law — every action has an equal and opposite reaction." },
    { q:'The SI unit of force is:', opts:['Joule','Newton','Pascal','Watt'], ans:1, exp:'Newton (N) is the SI unit of force. 1 N = 1 kg·m/s²' },
    { q:'An object travels 100m in 5 seconds. What is its average speed?', opts:['10 m/s','20 m/s','500 m/s','0.05 m/s'], ans:1, exp:'Speed = Distance/Time = 100/5 = 20 m/s' },
    { q:'Work done when force is perpendicular to displacement is:', opts:['Maximum','Minimum','Zero','Infinite'], ans:2, exp:'W = F·d·cos(90°) = 0. Perpendicular force does zero work.' },
  ],
  Chemistry: [
    { q:'What is the atomic number of Carbon?', opts:['4','6','8','12'], ans:1, exp:'Carbon has 6 protons, so atomic number = 6.' },
    { q:'pH of pure water at 25°C is:', opts:['0','7','14','1'], ans:1, exp:'Pure water has equal H⁺ and OH⁻ ions, making pH = 7 (neutral).' },
    { q:'The IUPAC name of CH₃-CH₂-OH is:', opts:['Methanol','Ethanol','Propanol','Butanol'], ans:1, exp:'CH₃-CH₂-OH has 2 carbons, so it is Ethanol.' },
    { q:'Which gas is produced when zinc reacts with dilute HCl?', opts:['Oxygen','Chlorine','Hydrogen','Nitrogen'], ans:2, exp:'Zn + 2HCl → ZnCl₂ + H₂↑. Hydrogen gas is released.' },
    { q:"Avogadro's number is approximately:", opts:['6.02 × 10²³','3.14 × 10²³','9.8 × 10²²','1.6 × 10¹⁹'], ans:0, exp:"Avogadro's number = 6.022 × 10²³ mol⁻¹" },
  ],
  Maths: [
    { q:'What is the derivative of sin(x)?', opts:['-cos(x)','cos(x)','tan(x)','-sin(x)'], ans:1, exp:'d/dx(sin x) = cos x. Standard differentiation formula.' },
    { q:'The value of ∫x dx is:', opts:['x² + C','x²/2 + C','2x + C','1/x + C'], ans:1, exp:'∫x dx = x²/2 + C by power rule: ∫xⁿ dx = xⁿ⁺¹/(n+1) + C' },
    { q:'If A is a 3×3 matrix with det(A) = 4, then det(2A) = ?', opts:['8','16','32','64'], ans:2, exp:'det(kA) = kⁿ·det(A) for n×n matrix. det(2A) = 2³ × 4 = 8 × 4 = 32' },
    { q:'The sum of first n natural numbers is:', opts:['n²','n(n+1)/2','n(n-1)/2','n²/2'], ans:1, exp:'Sum = n(n+1)/2. Standard formula for sum of natural numbers.' },
    { q:'What is the slope of line: 2x + 4y = 8?', opts:['2','-2','-1/2','1/2'], ans:2, exp:'4y = -2x + 8 → y = -x/2 + 2. Slope = -1/2' },
  ],
  Biology: [
    { q:'Powerhouse of the cell is:', opts:['Nucleus','Ribosome','Mitochondria','Chloroplast'], ans:2, exp:'Mitochondria produces ATP (energy) via cellular respiration — hence called powerhouse.' },
    { q:'DNA stands for:', opts:['Dioxyribonucleic Acid','Deoxyribonucleic Acid','Diribonucleic Acid','Dinucleotide Acid'], ans:1, exp:'DNA = Deoxyribonucleic Acid. Contains deoxyribose sugar.' },
    { q:'Photosynthesis occurs in which organelle?', opts:['Mitochondria','Nucleus','Chloroplast','Ribosome'], ans:2, exp:'Chloroplasts contain chlorophyll and are the site of photosynthesis.' },
    { q:'Which blood group is called universal donor?', opts:['A','B','AB','O'], ans:3, exp:'Blood group O has no antigens, so it can be donated to any blood group.' },
    { q:'The basic unit of heredity is called:', opts:['Chromosome','Gene','DNA','Nucleotide'], ans:1, exp:'Gene is the basic unit of heredity — a specific sequence of DNA that codes for a trait.' },
  ],
}

// ── DPP Component — Hybrid AI + Manual ────────────────────────
export function DPP() {
  const [subject,     setSubject]     = useState('Physics')
  const [questions,   setQuestions]   = useState(DPP_FALLBACK['Physics'])
  const [source,      setSource]      = useState('local')   // 'manual' | 'ai' | 'local'
  const [loading,     setLoading]     = useState(false)
  const [current,     setCurrent]     = useState(0)
  const [score,       setScore]       = useState(0)
  const [selected,    setSelected]    = useState(null)
  const [explanation, setExplanation] = useState('')
  const [done,        setDone]        = useState(false)

  const switchSubject = async (s) => {
    setSubject(s)
    setCurrent(0); setScore(0); setSelected(null); setDone(false); setExplanation('')
    setLoading(true)
    try {
      const { default: api } = await import('../api/api')
      // GET /api/dpp?subject=Physics
      // Backend: checks manual first → AI fallback → returns { questions, source }
      const { data } = await api.get(`/dpp?subject=${s}`)

      if (data.questions && data.questions.length > 0) {
        // Normalise backend format → local format { q, opts, ans, exp }
        setQuestions(data.questions.map(item => ({
          q:   item.question,
          opts: item.options,
          ans:  item.answerIndex,
          exp:  item.explanation || '',
        })))
        setSource(data.source)  // 'manual' or 'ai'
      } else {
        // Backend returned empty — use local fallback
        setQuestions(DPP_FALLBACK[s])
        setSource('local')
      }
    } catch {
      // Backend error — use local fallback silently
      setQuestions(DPP_FALLBACK[s])
      setSource('local')
    } finally {
      setLoading(false)
    }
  }

  // q is always safe — questions initialises from DPP_FALLBACK
  const q = questions[current]

  const answer = (idx) => {
    if (selected !== null || !q) return
    setSelected(idx)
    if (q.exp) setExplanation(q.exp)
    if (idx === q.ans) setScore(s => s + 1)
    setTimeout(() => {
      setExplanation('')
      if (current + 1 >= questions.length) setDone(true)
      else { setCurrent(c => c + 1); setSelected(null) }
    }, 2000)
  }

  const getOptStyle = (idx) => {
    const base = {
      padding:'12px 16px', borderRadius:'8px', fontSize:'14px',
      transition:'all .2s', background:'var(--surface)', color:'var(--text)',
      textAlign:'left', width:'100%', fontFamily:'var(--font-body)', border:'1px solid',
    }
    if (selected === null)                 return { ...base, borderColor:'var(--border)', cursor:'pointer' }
    if (idx === q.ans)                     return { ...base, borderColor:'var(--green)', background:'rgba(16,185,129,.1)', color:'var(--green)', cursor:'default' }
    if (idx === selected && idx !== q.ans) return { ...base, borderColor:'var(--red)',   background:'rgba(239,68,68,.1)',   color:'var(--red)',   cursor:'default' }
    return { ...base, borderColor:'var(--border)', opacity:.5, cursor:'default' }
  }

  // Source badge
  const SourceBadge = () => {
    if (source === 'manual') return (
      <span style={{ fontSize:'11px', padding:'3px 10px', borderRadius:'20px', background:'rgba(16,185,129,.12)', color:'var(--green)', fontWeight:600 }}>
        ✏️ Set by Teacher
      </span>
    )
    if (source === 'ai') return (
      <span style={{ fontSize:'11px', padding:'3px 10px', borderRadius:'20px', background:'rgba(108,99,255,.12)', color:'var(--accent2)', fontWeight:600 }}>
        🤖 AI Generated
      </span>
    )
    return (
      <span style={{ fontSize:'11px', padding:'3px 10px', borderRadius:'20px', background:'rgba(245,158,11,.1)', color:'var(--gold)', fontWeight:600 }}>
        📚 Practice Questions
      </span>
    )
  }

  return (
    <div className="container" style={{ paddingTop:'32px', paddingBottom:'60px', maxWidth:'680px' }}>
      <SectionHead tag="Daily Practice" title="Today's DPP" sub="5 questions · Subject-wise · Auto-graded" />

      {/* Subject tabs */}
      <div style={{ display:'flex', gap:'8px', justifyContent:'center', marginBottom:'16px', flexWrap:'wrap' }}>
        {Object.keys(DPP_FALLBACK).map(s => (
          <button key={s}
            className={`btn btn-sm ${subject === s ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => switchSubject(s)}>
            {s}
          </button>
        ))}
      </div>

      {/* Source indicator */}
      <div style={{ textAlign:'center', marginBottom:'24px' }}>
        <SourceBadge />
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:'48px 20px' }}>
          <div style={{ fontSize:'32px', marginBottom:'12px' }}>
            {source === 'ai' ? '🤖' : '⏳'}
          </div>
          <div style={{ color:'var(--text2)', fontSize:'14px' }}>
            {source === 'ai' ? 'AI is generating fresh questions for you...' : 'Loading questions...'}
          </div>
        </div>
      ) : !done ? (
        q && (
          <div className="card">
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'12px' }}>
              <span style={{ fontSize:'12px', color:'var(--text3)' }}>
                Question {current+1} of {questions.length}
              </span>
              <span style={{ fontSize:'12px', color:'var(--accent)', fontWeight:600 }}>
                Score: {score}
              </span>
            </div>

            {/* Progress bar */}
            <div className="progress-bar" style={{ marginBottom:'20px' }}>
              <div className="progress-fill" style={{ width:`${(current / questions.length) * 100}%` }} />
            </div>

            {/* Question */}
            <p style={{ fontSize:'16px', marginBottom:'20px', lineHeight:1.6, fontWeight:500 }}>
              {q.q}
            </p>

            {/* Options */}
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {q.opts.map((opt, i) => (
                <button key={i} style={getOptStyle(i)} onClick={() => answer(i)}>
                  <span style={{ fontWeight:600, marginRight:'8px', color: selected !== null && i === q.ans ? 'var(--green)' : selected !== null && i === selected && i !== q.ans ? 'var(--red)' : 'var(--text3)' }}>
                    {String.fromCharCode(65+i)}.
                  </span>
                  {opt}
                  {selected !== null && i === q.ans && (
                    <span style={{ marginLeft:'8px', fontSize:'12px' }}>✓</span>
                  )}
                </button>
              ))}
            </div>

            {/* Explanation — shown after answering */}
            {explanation && (
              <div style={{
                marginTop:'14px', padding:'12px 16px',
                background:'rgba(108,99,255,.08)',
                border:'1px solid rgba(108,99,255,.25)',
                borderRadius:'8px', fontSize:'13px',
                color:'var(--accent2)', lineHeight:1.6,
                animation:'fadeUp .3s ease',
              }}>
                💡 {explanation}
              </div>
            )}
          </div>
        )
      ) : (
        <div className="card" style={{ textAlign:'center', padding:'40px' }}>
          <div style={{ fontSize:'52px', marginBottom:'16px' }}>🎉</div>
          <div style={{ fontFamily:'var(--font-head)', fontSize:'32px', fontWeight:700, marginBottom:'8px' }}>
            {score} / {questions.length}
          </div>
          <p style={{ color:'var(--text2)', marginBottom:'8px' }}>
            {score === questions.length ? 'Perfect score! Outstanding!' : score >= Math.ceil(questions.length * 0.6) ? 'Great job! Keep it up!' : 'Keep practicing — you will get there!'}
          </p>
          <p style={{ fontSize:'12px', color:'var(--text3)', marginBottom:'24px' }}>
            {source === 'manual' ? '✏️ Questions set by your teacher' : source === 'ai' ? '🤖 AI generated questions' : '📚 Practice questions'}
          </p>
          <button className="btn btn-primary" onClick={() => switchSubject(subject)}>Try Again</button>
          <div style={{ marginTop:'12px' }}>
            {Object.keys(DPP_FALLBACK).filter(s => s !== subject).map(s => (
              <button key={s} className="btn btn-outline btn-sm" style={{ margin:'4px' }}
                onClick={() => switchSubject(s)}>
                Try {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Classes Page ──────────────────────────────────────────────
const CLASS_DATA = {
  '9': {
    subjects: [
      { name:'Mathematics', color:'var(--accent)', tags:['Algebra','Geometry','Statistics','Coordinate Geometry'] },
      { name:'Science',     color:'var(--cyan)',   tags:['Physics Basics','Chemical Reactions','Life Processes'] },
      { name:'English',     color:'var(--gold)',   tags:['Grammar','Literature','Writing Skills'] },
      { name:'SST',         color:'var(--pink)',   tags:['History','Geography','Civics','Economics'] },
      { name:'Hindi',          color:'var(--pink)',   tags:['Board Focus','Grammar','Literature','Writing'] },
      { name:'Sanskrit',          color:'var(--pink)',   tags:['Board Focus','Grammar','Literature','Writing'] }
    ],
    schedule: [['Monday','Mathematics','4:00–5:30 PM'],['Tuesday','Science','4:00–5:30 PM'],['Wednesday','English','4:00–5:00 PM'],['Thursday','Mathematics','4:00–5:30 PM'],['Friday','Science','4:00–5:30 PM'],['Saturday','Test/Revision','4:00–5:30 PM'], ['Sunday','Test/Revision','10:00 AM–12:00 PM']],
  },
  '10': {
    subjects: [
      { name:'Mathematics',  color:'var(--accent)', tags:['Quadratic Eq.','Trigonometry','Coordinate Geometry','Statistics'] },
      { name:'Science (PCB)',color:'var(--cyan)',   tags:['Electricity','Light','Chemical Reactions','Life Processes'] },
      { name:'English',      color:'var(--gold)',   tags:['Board Focus','Grammar','Literature','Writing'] },
      { name:'SST',          color:'var(--pink)',   tags:['History','Political Science','Economics','Geography'] },
      { name:'Hindi',          color:'var(--pink)',   tags:['Board Focus','Grammar','Literature','Writing'] },
      { name:'Sanskrit',          color:'var(--pink)',   tags:['Board Focus','Grammar','Literature','Writing'] }
    ],
    schedule: [['Monday','Mathematics','5:00–6:30 PM'],['Tuesday','Science','5:00–6:30 PM'],['Wednesday','English / SST','5:00–6:00 PM'],['Thursday','Mathematics','5:00–6:30 PM'],['Friday','Science','5:00–6:30 PM'],['Saturday','Board Mock Test','5:00–6:30 PM'], ['Sunday','Test/Revision','10:00 AM–12:00 PM']],
  },
  '11': {
    subjects: [
      { name:'Physics',   color:'var(--cyan)',   tags:['Kinematics','Laws of Motion','Gravitation','Waves','Thermodynamics'] },
      { name:'Chemistry', color:'var(--green)',  tags:['Structure of Atom','Periodic Table','Bonding','Equilibrium'] },
      { name:'Maths',     color:'var(--accent)', tags:['Sets','Trigonometry','Complex Numbers','Binomial','Limits'] },
      { name:'Biology',   color:'var(--pink)',   tags:['Cell Biology','Biomolecules','Transport in Plants','Photosynthesis'] },
    ],
    schedule: [['Monday','Physics','6:00–7:30 AM'],['Tuesday','Chemistry','6:00–7:30 AM'],['Wednesday','Maths / Bio','6:00–7:30 AM'],['Thursday','Physics','6:00–7:30 AM'],['Friday','Chemistry','6:00–7:30 AM'],['Saturday','Weekly Test','6:00–7:30 PM'], ['Sunday','Test/Revision','10:00 AM–12:00 PM']],
  },
  '12': {
    subjects: [
      { name:'Physics',   color:'var(--cyan)',   tags:['Electrostatics','Magnetism','Optics','Modern Physics','Semiconductors'] },
      { name:'Chemistry', color:'var(--green)',  tags:['Electrochemistry','Organic Chemistry','Polymers','Coordination Compounds'] },
      { name:'Maths',     color:'var(--accent)', tags:['Calculus','Matrices','Vectors','3D Geometry','Linear Programming','Probability'] },
      { name:'Biology',   color:'var(--pink)',   tags:['Genetics','Reproduction','Biotechnology','Ecology','Evolution'] },
    ],
    schedule: [['Monday','Physics','6:00–7:30 AM'],['Tuesday','Chemistry','6:00–7:30 AM'],['Wednesday','Maths / Bio','6:00–7:30 AM'],['Thursday','Physics','6:00–7:30 AM'],['Friday','Chemistry','6:00–7:30 AM'],['Saturday','Board + Entrance Mock','6:00–7:30 PM'], ['Sunday','Test/Revision','10:00 AM–12:00 PM']],
  },
}

export function Classes() {
  const [cls, setCls] = useState('9')
  const data = CLASS_DATA[cls]
  return (
    <div className="container" style={{ paddingTop:'32px', paddingBottom:'60px' }}>
      <SectionHead tag="Academics" title="Class-wise Courses" sub="Select your class to view syllabus, schedule & study material" />
      <div style={{ display:'flex', gap:'8px', marginBottom:'32px', justifyContent:'center', flexWrap:'wrap' }}>
        {['9','10','11','12'].map(c => (
          <button key={c} className={`btn ${cls===c ? 'btn-primary' : 'btn-outline'}`} onClick={() => setCls(c)}>
            Class {c}{c==='9'||c==='10'?' (NCERT)':' (Science)'}
          </button>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'28px' }}>
        <div>
          <h3 style={{ fontSize:'18px', fontWeight:600, marginBottom:'16px' }}>📘 Subjects Covered</h3>
          {data.subjects.map(s => (
            <div key={s.name} className="card" style={{ marginBottom:'12px', borderColor:`${s.color}33` }}>
              <h4 style={{ fontFamily:'var(--font-head)', fontSize:'16px', fontWeight:600, color:s.color, marginBottom:'8px' }}>{s.name}</h4>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'6px' }}>
                {s.tags.map(t => <span key={t} className="badge" style={{ background:`${s.color}18`, color:s.color }}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
        <div>
          <h3 style={{ fontSize:'18px', fontWeight:600, marginBottom:'16px' }}>📅 Weekly Schedule</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Day</th><th>Subject</th><th>Time</th></tr></thead>
              <tbody>
                {data.schedule.map(([d,s,t]) => (
                  <tr key={d}><td><strong>{d}</strong></td><td>{s}</td><td style={{ fontSize:'13px', color:'var(--text2)' }}>{t}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link to="/inquiry" className="btn btn-primary" style={{ marginTop:'20px', display:'inline-flex' }}>
            🎓 Enroll in Class {cls} →
          </Link>
        </div>
      </div>
    </div>
  )
}

export function JEE() {
  return (
    <div className="container" style={{ paddingTop:'32px', paddingBottom:'60px' }}>
      <SectionHead tag="Entrance Exam" title="⚡ JEE Preparation" sub="Complete IIT-JEE Mains & Advanced guidance" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'20px', marginBottom:'32px' }}>
        <div className="card"><h3>📋 Exam Overview</h3><p style={{ color:'var(--text2)', marginTop:'8px', lineHeight:1.7 }}><strong style={{ color:'var(--text)' }}>JEE Mains:</strong> 2 sessions/year. 75 questions — Physics, Chemistry, Maths. 3 hours. Online mode.<br/><br/><strong style={{ color:'var(--text)' }}>JEE Advanced:</strong> Top 2.5L from Mains qualify. 2 papers × 3 hours. For IIT admission only.</p></div>
        <div className="card"><h3>🎯 Our Strategy</h3><p style={{ color:'var(--text2)', marginTop:'8px', lineHeight:1.7 }}>NCERT first, then advanced problems. Weekly mock tests. Chapterwise DPPs. Previous year paper analysis. Special doubt sessions. Last 30-day revision plan.</p></div>
        <div className="card"><h3>📚 Important Chapters</h3>
          <div style={{ marginTop:'12px' }}>
            {[['Physics','var(--cyan)','Mechanics · Electrostatics · Modern Physics · Optics'],['Chemistry','var(--green)','Organic Rxns · Mole Concept · Electrochemistry · p-Block'],['Maths','var(--accent)','Calculus · Vectors · Complex Numbers · Probability · 3D']].map(([sub,color,chapters]) => (
              <div key={sub} style={{ marginBottom:'10px' }}>
                <span style={{ color, fontWeight:600, fontSize:'13px' }}>{sub}:</span>
                <span style={{ fontSize:'13px', color:'var(--text2)', marginLeft:'6px' }}>{chapters}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card"><h3>🗓 Batch Schedule</h3>
          <div className="table-wrap" style={{ marginTop:'8px' }}>
            <table><thead><tr><th>Batch</th><th>Timing</th></tr></thead>
            <tbody>{[['11th JEE','6:00 – 8:00 AM'],['12th JEE','6:00 – 8:30 AM'],['Dropper Batch','8:30 – 11:00 AM']].map(([b,t]) => <tr key={b}><td>{b}</td><td>{t}</td></tr>)}</tbody></table>
          </div>
        </div>
      </div>
      <div style={{ textAlign:'center' }}><Link to="/inquiry" className="btn btn-primary btn-lg">Join JEE Batch →</Link></div>
    </div>
  )
}

export function NEET() {
  return (
    <div className="container" style={{ paddingTop:'32px', paddingBottom:'60px' }}>
      <SectionHead tag="Medical Entrance" title="🧬 NEET Preparation" sub="Complete NEET-UG preparation — Biology, Physics, Chemistry" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'20px', marginBottom:'32px' }}>
        <div className="card"><h3>📋 Exam Overview</h3><p style={{ color:'var(--text2)', marginTop:'8px', lineHeight:1.7 }}><strong style={{ color:'var(--text)' }}>NEET UG:</strong> 720 marks — Biology (360), Physics (180), Chemistry (180). 3 hrs 20 min. Single attempt per year. Offline mode.</p></div>
        <div className="card"><h3>🎯 Our Strategy</h3><p style={{ color:'var(--text2)', marginTop:'8px', lineHeight:1.7 }}>NCERT line-by-line for Biology. Concept mastery in Physics & Chemistry. 100+ Biology questions daily. Full syllabus mock tests every 2 weeks.</p></div>
        <div className="card"><h3>📚 Important Chapters</h3>
          <div style={{ marginTop:'12px' }}>
            {[['Biology','var(--pink)','Genetics · Reproduction · Ecology · Biotechnology · Human Physiology'],['Physics','var(--cyan)','Mechanics · Optics · Modern Physics · Thermodynamics'],['Chemistry','var(--green)','Organic · Biomolecules · Chemical Kinetics · Coordination']].map(([sub,color,chapters]) => (
              <div key={sub} style={{ marginBottom:'10px' }}>
                <span style={{ color, fontWeight:600, fontSize:'13px' }}>{sub}:</span>
                <span style={{ fontSize:'13px', color:'var(--text2)', marginLeft:'6px' }}>{chapters}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card"><h3>🗓 Batch Schedule</h3>
          <div className="table-wrap" style={{ marginTop:'8px' }}>
            <table><thead><tr><th>Batch</th><th>Timing</th></tr></thead>
            <tbody>{[['11th NEET','4:00 – 7:00 PM'],['12th NEET','4:00 – 7:30 PM'],['Crash Course','7:00 – 10:00 AM']].map(([b,t]) => <tr key={b}><td>{b}</td><td>{t}</td></tr>)}</tbody></table>
          </div>
        </div>
      </div>
      <div style={{ textAlign:'center' }}><Link to="/inquiry" className="btn btn-primary btn-lg">Join NEET Batch →</Link></div>
    </div>
  )
}

const FREE_RESOURCES = [
  { icon:'📄', name:'JEE Mains PYQ 2024',                    meta:'Physics · Chemistry · Maths · Free', link:'#' },
  { icon:'📄', name:'NEET PYQ 2023 + Solutions',             meta:'Biology · Physics · Chemistry · Free', link:'#' },
  { icon:'📋', name:'Physics Formula Sheet (11th & 12th)',   meta:'All Chapters · Free PDF', link:'#' },
  { icon:'📋', name:'Chemistry Formula Sheet',               meta:'Organic + Inorganic + Physical · Free', link:'#' },
  { icon:'📋', name:'Maths Formula Sheet (12th)',            meta:'Complete Board + JEE · Free', link:'#' },
  { icon:'📺', name:'Video Lecture Playlist — Physics 11th', meta:'YouTube · 42 Videos', link:'#' },
]

export function Resources() {
  return (
    <div className="container" style={{ paddingTop:'32px', paddingBottom:'60px' }}>
      <SectionHead tag="Free Resources" title="Study Material Library" sub="PYQs, Formula Sheets, Notes — Free for all" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'12px', marginBottom:'32px' }}>
        {FREE_RESOURCES.map(r => (
          <div key={r.name} className="material-row">
            <div className="material-icon">{r.icon}</div>
            <div className="material-info"><div className="material-name">{r.name}</div><div className="material-meta">{r.meta}</div></div>
            <a href={r.link} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline">{r.icon === '📺' ? 'Watch' : 'Download'}</a>
          </div>
        ))}
      </div>
      <div style={{ background:'rgba(108,99,255,.07)', border:'1px solid rgba(108,99,255,.2)', borderRadius:'var(--r)', padding:'28px', textAlign:'center' }}>
        <div style={{ fontFamily:'var(--font-head)', fontSize:'20px', fontWeight:600, marginBottom:'10px' }}>Premium Study Material</div>
        <p style={{ color:'var(--text2)', fontSize:'14px', marginBottom:'20px' }}>Detailed chapter notes, solved examples, full test series — available after student login</p>
        <Link to="/login" className="btn btn-primary btn-lg">Login to Access Premium Notes →</Link>
      </div>
    </div>
  )
}

const TOPPERS = [
  { medal:'🥇', exam:'JEE Advanced 2024', name:'Aarav Sharma',    score:'AIR 847',   college:'IIT Bombay' },
  { medal:'🥇', exam:'NEET 2024',         name:'Priya Kulkarni', score:'720/720',   college:'AIIMS Delhi' },
  { medal:'🥈', exam:'JEE Mains 2024',    name:'Rohit Desai',    score:'99.4 %ile', college:'NIT Pune' },
  { medal:'🥉', exam:'NEET 2024',         name:'Meera Joshi',    score:'698/720',   college:'KEM Mumbai' },
  { medal:'⭐', exam:'SSC Board 2024',    name:'Sneha Pawar',    score:'98.4%',     college:'Distinction' },
  { medal:'⭐', exam:'HSC Board 2024',    name:'Aryan Kulkarni', score:'97.8%',     college:'Science Stream' },
]

export function Results() {
  return (
    <div className="container" style={{ paddingTop:'32px', paddingBottom:'60px' }}>
      <SectionHead tag="Achievements" title="Our Results Speak" />
      <div className="stat-grid" style={{ marginBottom:'40px' }}>
        {[['50+','IIT Selections','var(--gold)'],['120+','NEET Qualifiers','var(--green)'],['300+','Board Distinctions','var(--cyan)'],['95%','Overall Pass Rate','var(--accent2)']].map(([v,l,c]) => (
          <div key={l} className="stat-card"><div className="stat-val" style={{ color:c }}>{v}</div><div className="stat-lbl">{l}</div></div>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'20px', paddingTop:'20px', marginBottom:'48px' }}>
        {TOPPERS.map((t,i) => <TopperCard key={i} {...t} />)}
      </div>
      <SectionHead tag="Student of the Month" title="March 2025" />
      <div style={{ maxWidth:'360px', margin:'0 auto' }}>
        <div className="card" style={{ textAlign:'center', borderColor:'var(--gold)' }}>
          <div style={{ width:'72px', height:'72px', borderRadius:'50%', background:'linear-gradient(135deg,var(--gold),var(--accent))', margin:'0 auto 16px', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'var(--font-head)', fontSize:'28px', fontWeight:700, color:'#fff' }}>AK</div>
          <h3 style={{ fontSize:'20px' }}>Arjun Kale</h3>
          <div style={{ color:'var(--text3)', fontSize:'13px', marginTop:'4px' }}>Class 12 · JEE Batch</div>
          <div style={{ color:'var(--gold)', fontSize:'24px', fontWeight:700, margin:'12px 0', fontFamily:'var(--font-head)' }}>99.1 %ile</div>
          <p style={{ color:'var(--text2)', fontSize:'13px' }}>JEE Mains Mock Test · Top score in batch this month</p>
        </div>
      </div>
    </div>
  )
}

const FAQS = [
  ['What are the batch timings?',       '9th & 10th: 4:00–6:00 PM; 11th & 12th: 6:00–8:30 PM; JEE/NEET Morning batches: 6:00–9:00 AM. Weekend revision batches available.'],
  ['Is demo lecture available?',        'Yes! You can attend 2 free demo lectures before enrolling. Contact us to schedule your demo today.'],
  ['What is the fee structure?',        'Fee varies by class and subject. Please call or visit us for current fee structure. EMI facility available. Scholarships for meritorious students.'],
  ['Do you provide study material?',    'Yes, complete printed notes, DPP sheets, and online materials are provided. After enrollment, students get access to our digital library.'],
  ['How to access student portal?',     'After enrollment, fill the online registration form. Once admin approves, you get full access to materials, DPP and schedule.'],
  ['Do you offer NEET/JEE crash courses?','Yes! Crash courses are available before exam season. Contact us for the current schedule and fees.'],
]

export function Contact() {
  return (
    <div className="container" style={{ paddingTop:'32px', paddingBottom:'60px' }}>
      <SectionHead tag="Find Us" title="Contact Us" />
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'28px' }}>
        <div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'16px', marginBottom:'28px' }}>
            {[
              ['📍','Address',          'A1-Type 10/5 Post Office Colony, Tawanagar, Hoshangabad – 461551, Madhya Pradesh'],
              ['📞','Phone / WhatsApp', '+91 94078 52570\nMon–Sat, 9 AM – 8 PM'],
              ['✉️','Email',           'info@ramcoaching.in\nWe reply within 24 hours'],
              ['🕐','Timings',         'Coaching: 6 AM – 8:30 PM\nOffice: 9 AM – 6 PM'],
            ].map(([icon,title,info]) => (
              <div key={title} className="card">
                <div style={{ fontSize:'22px', marginBottom:'10px' }}>{icon}</div>
                <h4 style={{ fontSize:'14px', fontWeight:600, marginBottom:'6px' }}>{title}</h4>
                <p style={{ fontSize:'13px', color:'var(--text2)', lineHeight:1.6, whiteSpace:'pre-line' }}>{info}</p>
              </div>
            ))}
          </div>
          <h3 style={{ fontSize:'20px', fontWeight:600, marginBottom:'16px' }}>Frequently Asked Questions</h3>
          {FAQS.map(([q,a]) => <FAQItem key={q} q={q} a={a} />)}
        </div>
        <div>
          <div style={{ background:'var(--surface2)', border:'1px solid var(--border)', borderRadius:'12px', height:'260px', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:'10px', color:'var(--text3)', marginBottom:'20px' }}>
            <span style={{ fontSize:'40px' }}>🗺️</span>
            <span style={{ fontWeight:600 }}>Ram Coaching Classes</span>
            <span style={{ fontSize:'12px' }}>Tawanagar – 461551</span>
            <a href="https://maps.google.com/?q=Tawanagar+Hoshangabad+Madhya+Pradesh" target="_blank" rel="noreferrer" className="btn btn-sm btn-outline" style={{ marginTop:'8px' }}>Open in Google Maps</a>
          </div>
          <div className="notice">
            <div className="notice-title">📱 Book a Free Counselling Session</div>
            <div className="notice-body">Schedule a free session with our academic advisor. We'll guide you on the right course, exam strategy and study plan.</div>
            <Link to="/inquiry" className="btn btn-sm btn-primary" style={{ marginTop:'12px', display:'inline-flex' }}>Book Appointment →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Inquiry() {
  const [form, setForm]       = useState({ studentName:'', parentName:'', phone:'', email:'', class:'', targetExam:'', message:'' })
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async () => {
    if (!form.studentName.trim()) return setError('Please enter student name.')
    if (!form.phone.trim())       return setError('Please enter phone number.')
    if (!form.class)              return setError('Please select a class.')
    setError(''); setLoading(true)
    try {
      const { default: api } = await import('../api/api')
      await api.post('/inquiry', form)
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit. Please call us at +91 94078 52570.')
    } finally { setLoading(false) }
  }

  if (success) return (
    <div style={{ minHeight:'70vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px' }}>
      <div style={{ textAlign:'center', maxWidth:'420px' }}>
        <div style={{ fontSize:'60px', marginBottom:'16px' }}>✅</div>
        <h2 style={{ fontFamily:'var(--font-head)', fontSize:'24px', marginBottom:'12px' }}>Inquiry Submitted!</h2>
        <p style={{ color:'var(--text2)', lineHeight:1.7 }}>Thank you! We will contact you within 24 hours. Feel free to call us at +91 94078 52570.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop:'24px' }}>Back to Home</Link>
      </div>
    </div>
  )

  return (
    <div className="container" style={{ paddingTop:'32px', paddingBottom:'60px', maxWidth:'700px' }}>
      <SectionHead tag="Admission" title="Inquiry Form" sub="Fill in your details and we'll contact you within 24 hours" />
      <div className="card">
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:'14px' }}>
          <div className="form-group"><label className="form-label">Student Name *</label><input className="form-input" placeholder="Full Name" value={form.studentName} onChange={set('studentName')} /></div>
          <div className="form-group"><label className="form-label">Parent / Guardian Name</label><input className="form-input" placeholder="Parent Name" value={form.parentName} onChange={set('parentName')} /></div>
          <div className="form-group"><label className="form-label">Mobile Number *</label><input className="form-input" type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={set('phone')} /></div>
          <div className="form-group"><label className="form-label">Email Address</label><input className="form-input" type="email" placeholder="email@example.com" value={form.email} onChange={set('email')} /></div>
          <div className="form-group"><label className="form-label">Class *</label>
            <select className="form-input" value={form.class} onChange={set('class')}>
              <option value="">Select Class</option>
              {['9th','10th','11th (PCM)','11th (PCB)','12th (PCM)','12th (PCB)'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group"><label className="form-label">Target Exam</label>
            <select className="form-input" value={form.targetExam} onChange={set('targetExam')}>
              <option value="">Select (optional)</option>
              {['JEE Mains','JEE Advanced','NEET UG','MP Board'].map(e => <option key={e}>{e}</option>)}
            </select>
          </div>
        </div>
        <div className="form-group"><label className="form-label">Message / Query</label><textarea className="form-input" rows={3} placeholder="Any specific query or requirement..." value={form.message} onChange={set('message')} /></div>
        {error && <Alert type="danger" style={{ marginBottom:'16px' }}>{error}</Alert>}
        <button className="btn btn-primary btn-full" onClick={submit} disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Inquiry →'}
        </button>
      </div>
    </div>
  )
}
