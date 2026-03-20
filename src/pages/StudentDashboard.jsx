import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import { Spinner, Alert } from '../components/UI'

const CHAPTERS = {
  'Physics 12': ['Electric Charges & Fields','Electrostatic Potential & Capacitance','Current Electricity','Moving Charges & Magnetism','Magnetism & Matter','Electromagnetic Induction','Alternating Current','EM Waves','Ray Optics','Wave Optics','Dual Nature of Matter','Atoms','Nuclei','Semiconductors'],
  'Chemistry 12': ['Solid State','Solutions','Electrochemistry','Chemical Kinetics','Surface Chemistry','General Principles of Isolation','p-Block Elements','d & f-Block Elements','Coordination Compounds','Haloalkanes & Haloarenes','Alcohols, Phenols, Ethers','Aldehydes, Ketones & Acids','Amines','Biomolecules'],
  'Maths 12': ['Relations & Functions','Inverse Trigonometric Functions','Matrices','Determinants','Continuity & Differentiability','Application of Derivatives','Integrals','Applications of Integrals','Differential Equations','Vector Algebra','3D Geometry','Linear Programming','Probability'],
}

export default function StudentDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [section, setSection] = useState('overview')
  const [materials, setMaterials] = useState([])
  const [notices, setNotices]     = useState([])
  const [loading, setLoading]     = useState(false)
  const [checkedChapters, setCheckedChapters] = useState({})
  const [selectedSubject, setSelectedSubject] = useState('Physics 12')

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (user.role === 'admin') { navigate('/admin'); return }
    fetchMaterials()
    fetchNotices()
    // Load saved chapter progress
    const saved = JSON.parse(localStorage.getItem('chapter_progress') || '{}')
    setCheckedChapters(saved)
  }, [user])

  const fetchMaterials = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/materials/mine')
      setMaterials(data)
    } catch {
      // demo fallback
      setMaterials([
        { _id:'1', title:'Physics Notes — Electrostatics', subject:'Physics', type:'pdf', driveLink:'#', class:'12-PCM' },
        { _id:'2', title:'Organic Chemistry Short Notes', subject:'Chemistry', type:'pdf', driveLink:'#', class:'12-PCM' },
        { _id:'3', title:'Maths — Calculus DPP Set', subject:'Maths', type:'dpp', driveLink:'#', class:'12-PCM' },
        { _id:'4', title:'Video: Modern Physics', subject:'Physics', type:'video', driveLink:'#', class:'12-PCM' },
      ])
    } finally { setLoading(false) }
  }

  const fetchNotices = async () => {
    try {
      const { data } = await api.get('/notices')
      setNotices(data)
    } catch {
      setNotices([
        { _id:'1', title:'📢 Mock Test — Saturday', body:'Full syllabus mock test on Saturday 22 March, 10 AM. Chapters: Electrostatics, Magnetism, Current Electricity.', postedAt: new Date() },
        { _id:'2', title:'📚 New Material Added', body:'Physics DPP Week 14 and Organic Chemistry Short Notes uploaded.', postedAt: new Date(Date.now() - 86400000) },
        { _id:'3', title:'🏖 Holiday Notice', body:'No classes on 25 March (Holi). Regular batches resume from 26 March.', postedAt: new Date(Date.now() - 86400000 * 4) },
      ])
    }
  }

  const toggleChapter = (subject, chapter) => {
    const key = `${subject}::${chapter}`
    const updated = { ...checkedChapters, [key]: !checkedChapters[key] }
    setCheckedChapters(updated)
    localStorage.setItem('chapter_progress', JSON.stringify(updated))
  }

  const getProgress = (subject) => {
    const chs = CHAPTERS[subject] || []
    const done = chs.filter(c => checkedChapters[`${subject}::${c}`]).length
    return { done, total: chs.length, pct: chs.length ? Math.round(done / chs.length * 100) : 0 }
  }

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2) || 'ST'

  const navItems = [
    ['overview','🏠','Overview'],
    ['materials','📚','My Materials'],
    ['dpp','📝','My DPP'],
    ['schedule','📅','My Schedule'],
    ['progress','📊','Syllabus Progress'],
    ['notices','🔔','Notices'],
  ]

  const SCHEDULE = [
    ['Monday','Physics','6:00 – 7:30 AM','Prof. Ram Sir'],
    ['Tuesday','Chemistry','6:00 – 7:30 AM','Prof. Sharma Ma\'am'],
    ['Wednesday','Mathematics','6:00 – 7:30 AM','Prof. Ram Sir'],
    ['Thursday','Physics','6:00 – 7:30 AM','Prof. Ram Sir'],
    ['Friday','Chemistry','6:00 – 7:30 AM','Prof. Sharma Ma\'am'],
    ['Saturday','Full Mock Test','10:00 AM – 1:00 PM','All Faculty'],
  ]

  return (
    <div className="dash-layout">
      {/* SIDEBAR */}
      <div className="dash-sidebar">
        <div className="dash-user">
          <div className="dash-avatar">{initials}</div>
          <div className="dash-name">{user?.name}</div>
          <div className="dash-class-label">Class {user?.class}</div>
        </div>
        {navItems.map(([key, icon, label]) => (
          <button key={key} className={`dash-nav-item ${section === key ? 'active' : ''}`} onClick={() => setSection(key)}>
            <span className="dash-nav-icon">{icon}</span>{label}
          </button>
        ))}
        <button className="dash-nav-item" style={{ marginTop: '16px', color: 'var(--red)' }} onClick={() => { logout(); navigate('/') }}>
          <span className="dash-nav-icon">🚪</span>Logout
        </button>
      </div>

      {/* CONTENT */}
      <div className="dash-content">
        {/* OVERVIEW */}
        {section === 'overview' && (
          <div className="fade-in">
            <div className="dash-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</div>
            <div className="stat-grid">
              <div className="stat-card"><div className="stat-val text-accent">{materials.length}</div><div className="stat-lbl">Materials Available</div></div>
              <div className="stat-card"><div className="stat-val text-green">14</div><div className="stat-lbl">DPPs Completed</div></div>
              <div className="stat-card"><div className="stat-val text-gold">{getProgress('Physics 12').pct}%</div><div className="stat-lbl">Physics Progress</div></div>
              <div className="stat-card"><div className="stat-val text-cyan">{notices.length}</div><div className="stat-lbl">New Notices</div></div>
            </div>
            {notices.slice(0,3).map(n => (
              <div key={n._id} className="notice">
                <div className="notice-title">{n.title}</div>
                <div className="notice-body">{n.body}</div>
                <div className="notice-date">{new Date(n.postedAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</div>
              </div>
            ))}
          </div>
        )}

        {/* MATERIALS */}
        {section === 'materials' && (
          <div className="fade-in">
            <div className="dash-title">My Study Materials</div>
            {loading ? <Spinner /> : materials.length === 0 ? (
              <Alert type="info">No materials assigned yet. Please contact your teacher.</Alert>
            ) : materials.map(m => (
              <div key={m._id} className="material-row">
                <div className="material-icon">{m.type === 'video' ? '📹' : m.type === 'dpp' ? '📝' : '📄'}</div>
                <div className="material-info">
                  <div className="material-name">{m.title}</div>
                  <div className="material-meta">{m.subject} · {m.class} · {m.type?.toUpperCase()}</div>
                </div>
                <a href={m.driveLink} target="_blank" rel="noreferrer" className="btn btn-sm btn-primary">
                  {m.type === 'video' ? 'Watch' : 'Download'}
                </a>
              </div>
            ))}
          </div>
        )}

        {/* DPP */}
        {section === 'dpp' && (
          <div className="fade-in">
            <div className="dash-title">My DPP History</div>
            <a href="/dpp" className="btn btn-primary" style={{ marginBottom: '20px', display: 'inline-flex' }}>Today's DPP →</a>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Date</th><th>Subject</th><th>Score</th><th>Status</th></tr></thead>
                <tbody>
                  {[['18 Mar','Physics','4/5','done'],['17 Mar','Chemistry','3/5','done'],['16 Mar','Maths','5/5','done'],['15 Mar','Physics','2/5','done'],['19 Mar','Biology','—','pending']].map(([d,s,sc,st]) => (
                    <tr key={d+s}><td>{d}</td><td>{s}</td><td><strong>{sc}</strong></td><td><span className={`badge ${st === 'done' ? 'badge-green' : 'badge-gold'}`}>{st === 'done' ? 'Done' : 'Pending'}</span></td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SCHEDULE */}
        {section === 'schedule' && (
          <div className="fade-in">
            <div className="dash-title">My Class Schedule</div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Day</th><th>Subject</th><th>Time</th><th>Faculty</th></tr></thead>
                <tbody>
                  {SCHEDULE.map(([d,s,t,f]) => (
                    <tr key={d}><td><strong>{d}</strong></td><td>{s}</td><td style={{ color: 'var(--text2)', fontSize: '13px' }}>{t}</td><td style={{ color: 'var(--text3)', fontSize: '13px' }}>{f}</td></tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SYLLABUS PROGRESS */}
        {section === 'progress' && (
          <div className="fade-in">
            <div className="dash-title">Syllabus Progress</div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {Object.keys(CHAPTERS).map(sub => (
                <button key={sub} className={`btn btn-sm ${selectedSubject === sub ? 'btn-primary' : 'btn-outline'}`} onClick={() => setSelectedSubject(sub)}>{sub}</button>
              ))}
            </div>
            {(() => {
              const { done, total, pct } = getProgress(selectedSubject)
              return (
                <>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '14px' }}>
                    <span>{selectedSubject}</span>
                    <span style={{ color: 'var(--accent)', fontWeight: 600 }}>{pct}% — {done}/{total} chapters</span>
                  </div>
                  <div className="progress-bar" style={{ marginBottom: '24px' }}>
                    <div className="progress-fill" style={{ width: `${pct}%` }} />
                  </div>
                  {CHAPTERS[selectedSubject].map(ch => {
                    const key = `${selectedSubject}::${ch}`
                    const done = !!checkedChapters[key]
                    return (
                      <div key={ch} className="ch-row">
                        <div className={`ch-check ${done ? 'done' : ''}`} onClick={() => toggleChapter(selectedSubject, ch)}>
                          {done ? '✓' : ''}
                        </div>
                        <span className={`ch-name ${done ? 'done' : ''}`}>{ch}</span>
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
            {notices.map(n => (
              <div key={n._id} className="notice">
                <div className="notice-title">{n.title}</div>
                <div className="notice-body">{n.body}</div>
                <div className="notice-date">{new Date(n.postedAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
