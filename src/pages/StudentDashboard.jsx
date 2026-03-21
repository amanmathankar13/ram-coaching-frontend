import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import { Spinner, Alert } from '../components/UI'

const CHAPTERS = {
  'Physics 12':   ['Electric Charges & Fields','Electrostatic Potential & Capacitance','Current Electricity','Moving Charges & Magnetism','Magnetism & Matter','Electromagnetic Induction','Alternating Current','EM Waves','Ray Optics','Wave Optics','Dual Nature of Matter','Atoms','Nuclei','Semiconductors'],
  'Chemistry 12': ['Solid State','Solutions','Electrochemistry','Chemical Kinetics','Surface Chemistry','General Principles of Isolation','p-Block Elements','d & f-Block Elements','Coordination Compounds','Haloalkanes & Haloarenes','Alcohols, Phenols, Ethers','Aldehydes, Ketones & Acids','Amines','Biomolecules'],
  'Maths 12':     ['Relations & Functions','Inverse Trigonometric Functions','Matrices','Determinants','Continuity & Differentiability','Application of Derivatives','Integrals','Applications of Integrals','Differential Equations','Vector Algebra','3D Geometry','Linear Programming','Probability'],
}

const NAV_ITEMS = [
  ['overview',  '🏠', 'Home'],
  ['materials', '📚', 'Materials'],
  ['sdpp',      '📝', 'DPP'],
  ['schedule',  '📅', 'Schedule'],
  ['progress',  '📊', 'Progress'],
  ['notices',   '🔔', 'Notices'],
]

const SCHEDULE = [
  ['Monday',    'Physics',        '6:00 – 7:30 AM',    'Prof. Ram Sir'],
  ['Tuesday',   'Chemistry',      '6:00 – 7:30 AM',    "Prof. Sharma Ma'am"],
  ['Wednesday', 'Mathematics',    '6:00 – 7:30 AM',    'Prof. Ram Sir'],
  ['Thursday',  'Physics',        '6:00 – 7:30 AM',    'Prof. Ram Sir'],
  ['Friday',    'Chemistry',      '6:00 – 7:30 AM',    "Prof. Sharma Ma'am"],
  ['Saturday',  'Full Mock Test', '10:00 AM – 1:00 PM','All Faculty'],
]

export default function StudentDashboard() {
  const { user, logout }  = useAuth()
  const navigate          = useNavigate()
  const [section, setSection]         = useState('overview')
  const [materials, setMaterials]     = useState([])
  const [notices,   setNotices]       = useState([])
  const [loading,   setLoading]       = useState(false)
  const [noticeLoad, setNoticeLoad]   = useState(false)
  const [error,     setError]         = useState('')
  const [checkedChapters, setCheckedChapters] = useState({})
  const [selectedSubject, setSelectedSubject] = useState('Physics 12')
  const [dppReport,   setDppReport]   = useState([])
  const [reportLoad,  setReportLoad]  = useState(false)

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (user.role === 'admin') { navigate('/admin'); return }
    fetchMaterials()
    fetchNotices()
    fetchDppReport()
    const saved = JSON.parse(localStorage.getItem('chapter_progress') || '{}')
    setCheckedChapters(saved)
  }, [user])

  // GET /api/materials/mine — requires JWT (approved student only)
  const fetchMaterials = async () => {
    setLoading(true)
    setError('')
    try {
      const { data } = await api.get('/materials/mine')
      setMaterials(Array.isArray(data) ? data : [])
    } catch (err) {
      const msg = err.response?.data?.message || err.message
      setError(`Could not load materials: ${msg}`)
      setMaterials([])
    } finally {
      setLoading(false)
    }
  }

  // GET /api/notices — requires JWT (approved student only)
  // backend filters by student's class automatically
  const fetchNotices = async () => {
    setNoticeLoad(true)
    try {
      const { data } = await api.get('/notices')
      setNotices(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Notices fetch failed:', err.message)
      setNotices([])
    } finally {
      setNoticeLoad(false)
    }
  }

  // GET /api/dpp/report?days=7 — student's 7-day DPP report
  const fetchDppReport = async () => {
    setReportLoad(true)
    try {
      const { data } = await api.get('/dpp/report?days=7')
      setDppReport(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('DPP report failed:', err.message)
      setDppReport([])
    } finally { setReportLoad(false) }
  }

  const toggleChapter = (subject, chapter) => {
    const key     = `${subject}::${chapter}`
    const updated = { ...checkedChapters, [key]: !checkedChapters[key] }
    setCheckedChapters(updated)
    localStorage.setItem('chapter_progress', JSON.stringify(updated))
  }

  const getProgress = (subject) => {
    const chs  = CHAPTERS[subject] || []
    const done = chs.filter(c => checkedChapters[`${subject}::${c}`]).length
    return { done, total: chs.length, pct: chs.length ? Math.round(done / chs.length * 100) : 0 }
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || 'ST'

  // Empty state component
  const EmptyState = ({ icon, title, sub }) => (
    <div style={{ textAlign:'center', padding:'48px 20px', color:'var(--text3)' }}>
      <div style={{ fontSize:'40px', marginBottom:'12px' }}>{icon}</div>
      <div style={{ fontSize:'16px', fontWeight:600, marginBottom:'8px', color:'var(--text2)' }}>{title}</div>
      {sub && <div style={{ fontSize:'14px' }}>{sub}</div>}
    </div>
  )

  return (
    <div className="dash-layout">
      {/* ── SIDEBAR ──────────────────────────────────────────── */}
      <div className="dash-sidebar">
        <div className="dash-user">
          <div className="dash-avatar">{initials}</div>
          <div className="dash-name">{user?.name}</div>
          <div className="dash-class-label">Class {user?.class}</div>
        </div>
        {NAV_ITEMS.map(([key, icon, label]) => (
          <button key={key} className={`dash-nav-item ${section === key ? 'active' : ''}`}
            onClick={() => setSection(key)}>
            <span className="dash-nav-icon">{icon}</span>{label}
          </button>
        ))}
        <button className="dash-nav-item" style={{ marginTop:'16px', color:'var(--red)' }}
          onClick={() => { logout(); navigate('/') }}>
          <span className="dash-nav-icon">🚪</span>Logout
        </button>
      </div>

      {/* ── CONTENT ──────────────────────────────────────────── */}
      <div className="dash-content">

        {/* OVERVIEW */}
        {section === 'overview' && (
          <div className="fade-in">
            <div className="dash-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</div>
            <div className="stat-grid">
              <div className="stat-card"><div className="stat-val text-accent">{materials.length}</div><div className="stat-lbl">Materials</div></div>
              <div className="stat-card"><div className="stat-val text-green">{dppReport.filter(d=>d.attempted).length}/7</div><div className="stat-lbl">DPPs This Week</div></div>
              <div className="stat-card"><div className="stat-val text-gold">{getProgress('Physics 12').pct}%</div><div className="stat-lbl">Physics Done</div></div>
              <div className="stat-card"><div className="stat-val text-cyan">{notices.length}</div><div className="stat-lbl">Notices</div></div>
            </div>
            {noticeLoad ? <Spinner /> : notices.length === 0
              ? <EmptyState icon="🔔" title="No notices yet" sub="Your teacher hasn't posted any notices yet." />
              : notices.slice(0, 3).map(n => (
                <div key={n._id} className="notice">
                  <div className="notice-title">{n.title}</div>
                  <div className="notice-body">{n.body}</div>
                  <div className="notice-date">{new Date(n.postedAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</div>
                </div>
              ))
            }
          </div>
        )}

        {/* MATERIALS */}
        {section === 'materials' && (
          <div className="fade-in">
            <div className="dash-title">My Study Materials</div>
            {error && <Alert type="danger" style={{ marginBottom:'16px' }}>{error}</Alert>}
            {loading
              ? <Spinner />
              : materials.length === 0
                ? <EmptyState icon="📭" title="No materials assigned yet" sub="Your teacher will assign materials after your class starts. Please check back later." />
                : materials.map(m => (
                  <div key={m._id} className="material-row">
                    <div className="material-icon">
                      {m.type === 'video' ? '📹' : m.type === 'dpp' ? '📝' : '📄'}
                    </div>
                    <div className="material-info">
                      <div className="material-name">{m.title}</div>
                      <div className="material-meta">
                        {m.subject} · Class {m.class} · {m.type?.toUpperCase()}
                      </div>
                    </div>
                    <a href={m.driveLink} target="_blank" rel="noreferrer"
                      className="btn btn-sm btn-primary">
                      {m.type === 'video' ? 'Watch' : 'Download'}
                    </a>
                  </div>
                ))
            }
          </div>
        )}

        {/* DPP */}
        {section === 'sdpp' && (
          <div className="fade-in">
            <div className="dash-title">My DPP — 7 Day Report</div>

            {/* Today's DPP button */}
            <Link to="/dpp" className="btn btn-primary" style={{ marginBottom:'20px', display:'inline-flex' }}>
            📝 Attempt Today's DPP →
          </Link>

            {/* Weekly summary cards */}
            {!reportLoad && dppReport.length > 0 && (() => {
              const total     = dppReport.length
              const attempted = dppReport.filter(d => d.attempted).length
              const totalQ    = dppReport.reduce((s, d) => s + (d.totalQuestions || 0), 0)
              const correct   = dppReport.reduce((s, d) => s + (d.correct || 0), 0)
              const pct       = totalQ > 0 ? Math.round(correct / totalQ * 100) : 0
              return (
                <div className="stat-grid" style={{ marginBottom:'24px' }}>
                  <div className="stat-card"><div className="stat-val text-accent">{attempted}/{total}</div><div className="stat-lbl">Days Attempted</div></div>
                  <div className="stat-card"><div className="stat-val text-green">{correct}/{totalQ}</div><div className="stat-lbl">Correct Answers</div></div>
                  <div className="stat-card"><div className="stat-val text-gold">{pct}%</div><div className="stat-lbl">Accuracy</div></div>
                  <div className="stat-card">
                    <div className="stat-val" style={{ color: attempted >= 5 ? 'var(--green)' : attempted >= 3 ? 'var(--gold)' : 'var(--red)' }}>
                      {attempted >= 6 ? '🔥' : attempted >= 4 ? '👍' : attempted >= 2 ? '📚' : '⚠️'}
                    </div>
                    <div className="stat-lbl">{attempted >= 6 ? 'Excellent!' : attempted >= 4 ? 'Good' : attempted >= 2 ? 'Keep Going' : 'Needs Work'}</div>
                  </div>
                </div>
              )
            })()}

            {/* Weekly calendar view */}
            {reportLoad ? <Spinner /> : dppReport.length === 0 ? (
              <EmptyState icon="📊" title="No DPP data yet" sub="Start attempting daily DPPs. Your 7-day report will appear here." />
            ) : (
              <>
                <div style={{ fontWeight:600, fontSize:'15px', marginBottom:'14px', color:'var(--text2)' }}>
                  Last 7 Days
                </div>

                {/* Day-wise cards */}
                {dppReport.map((day, idx) => {
                  const date     = new Date(day.date)
                  const isToday  = new Date().toDateString() === date.toDateString()
                  const accuracy = day.totalQuestions > 0 ? Math.round(day.correct / day.totalQuestions * 100) : 0

                  return (
                    <div key={idx} style={{
                      background: 'var(--surface)',
                      border: `1px solid ${day.attempted ? 'var(--border2)' : 'var(--border)'}`,
                      borderLeft: `4px solid ${day.attempted ? (accuracy >= 80 ? 'var(--green)' : accuracy >= 50 ? 'var(--gold)' : 'var(--red)') : 'var(--border2)'}`,
                      borderRadius: 'var(--r)',
                      padding: '14px 18px',
                      marginBottom: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '16px',
                      flexWrap: 'wrap',
                    }}>
                      {/* Date */}
                      <div style={{ minWidth:'80px' }}>
                        <div style={{ fontFamily:'var(--font-head)', fontSize:'15px', fontWeight:700, color: isToday ? 'var(--accent)' : 'var(--text)' }}>
                          {isToday ? 'Today' : date.toLocaleDateString('en-IN', { weekday:'short' })}
                        </div>
                        <div style={{ fontSize:'11px', color:'var(--text3)', marginTop:'2px' }}>
                          {date.toLocaleDateString('en-IN', { day:'numeric', month:'short' })}
                        </div>
                      </div>

                      {/* Subject badges */}
                      <div style={{ flex:1, display:'flex', gap:'6px', flexWrap:'wrap' }}>
                        {day.subjects?.map(s => (
                          <span key={s.subject} style={{
                            fontSize:'12px', padding:'3px 10px', borderRadius:'20px', fontWeight:600,
                            background: s.attempted ? 'rgba(108,99,255,.12)' : 'var(--bg3)',
                            color: s.attempted ? 'var(--accent2)' : 'var(--text3)',
                            border: `1px solid ${s.attempted ? 'rgba(108,99,255,.2)' : 'var(--border)'}`,
                          }}>
                            {s.subject}
                            {s.attempted && ` ${s.correct}/${s.totalQuestions}`}
                          </span>
                        ))}
                        {!day.attempted && (
                          <span style={{ fontSize:'12px', color:'var(--text3)', fontStyle:'italic' }}>
                            Not attempted
                          </span>
                        )}
                      </div>

                      {/* Score */}
                      {day.attempted && (
                        <div style={{ textAlign:'right', minWidth:'60px' }}>
                          <div style={{
                            fontFamily:'var(--font-head)', fontSize:'18px', fontWeight:700,
                            color: accuracy >= 80 ? 'var(--green)' : accuracy >= 50 ? 'var(--gold)' : 'var(--red)',
                          }}>
                            {accuracy}%
                          </div>
                          <div style={{ fontSize:'11px', color:'var(--text3)' }}>
                            {day.correct}/{day.totalQuestions}
                          </div>
                        </div>
                      )}

                      {/* Status icon */}
                      <div style={{ fontSize:'20px' }}>
                        {!day.attempted ? '⭕' : accuracy >= 80 ? '✅' : accuracy >= 50 ? '🟡' : '❌'}
                      </div>
                    </div>
                  )
                })}

                {/* Legend */}
                <div style={{ display:'flex', gap:'16px', flexWrap:'wrap', marginTop:'16px', padding:'12px 16px', background:'var(--surface2)', borderRadius:'8px', fontSize:'12px', color:'var(--text3)' }}>
                  <span>✅ ≥ 80% — Excellent</span>
                  <span>🟡 50–79% — Good</span>
                  <span>❌ &lt; 50% — Needs Practice</span>
                  <span>⭕ Not attempted</span>
                </div>
              </>
            )}
          </div>
        )}

        {/* SCHEDULE */}
        {section === 'schedule' && (
          <div className="fade-in">
            <div className="dash-title">My Class Schedule</div>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr><th>Day</th><th>Subject</th><th>Time</th><th>Faculty</th></tr>
                </thead>
                <tbody>
                  {SCHEDULE.map(([d, s, t, f]) => (
                    <tr key={d}>
                      <td><strong>{d}</strong></td>
                      <td>{s}</td>
                      <td style={{ color:'var(--text2)', fontSize:'13px' }}>{t}</td>
                      <td style={{ color:'var(--text3)', fontSize:'13px' }}>{f}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PROGRESS */}
        {section === 'progress' && (
          <div className="fade-in">
            <div className="dash-title">Syllabus Progress</div>
            <div style={{ display:'flex', gap:'8px', marginBottom:'20px', flexWrap:'wrap' }}>
              {Object.keys(CHAPTERS).map(sub => (
                <button key={sub}
                  className={`btn btn-sm ${selectedSubject === sub ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setSelectedSubject(sub)}>
                  {sub}
                </button>
              ))}
            </div>
            {(() => {
              const { done, total, pct } = getProgress(selectedSubject)
              return (
                <>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'8px', fontSize:'14px' }}>
                    <span>{selectedSubject}</span>
                    <span style={{ color:'var(--accent)', fontWeight:600 }}>{pct}% — {done}/{total}</span>
                  </div>
                  <div className="progress-bar" style={{ marginBottom:'20px' }}>
                    <div className="progress-fill" style={{ width:`${pct}%` }} />
                  </div>
                  {CHAPTERS[selectedSubject].map(ch => {
                    const isDone = !!checkedChapters[`${selectedSubject}::${ch}`]
                    return (
                      <div key={ch} className="ch-row">
                        <div className={`ch-check ${isDone ? 'done' : ''}`}
                          onClick={() => toggleChapter(selectedSubject, ch)}>
                          {isDone ? '✓' : ''}
                        </div>
                        <span className={`ch-name ${isDone ? 'done' : ''}`}>{ch}</span>
                      </div>
                    )
                  })}
                </>
              )
            })()}
          </div>
        )}

        {/* NOTICES */}
        {section === 'notices' && (
          <div className="fade-in">
            <div className="dash-title">Notices & Announcements</div>
            {noticeLoad
              ? <Spinner />
              : notices.length === 0
                ? <EmptyState icon="🔔" title="No notices yet" sub="Your teacher hasn't posted any announcements yet." />
                : notices.map(n => (
                  <div key={n._id} className="notice">
                    <div className="notice-title">{n.title}</div>
                    <div className="notice-body">{n.body}</div>
                    <div className="notice-date">
                      {new Date(n.postedAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
                    </div>
                  </div>
                ))
            }
          </div>
        )}
      </div>

      {/* ── MOBILE BOTTOM NAV ────────────────────────────────── */}
      <div className="mobile-dash-nav">
        {NAV_ITEMS.map(([key, icon, label]) => (
          <button key={key} className={`mobile-dash-btn ${section === key ? 'active' : ''}`}
            onClick={() => setSection(key)}>
            <span className="dash-icon">{icon}</span>
            <span>{label}</span>
          </button>
        ))}
        <button className="mobile-dash-btn" onClick={() => { logout(); navigate('/') }}>
          <span className="dash-icon">🚪</span><span>Logout</span>
        </button>
      </div>
    </div>
  )
}
