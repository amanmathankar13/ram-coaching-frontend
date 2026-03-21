import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import { Spinner, Alert } from '../components/UI'

const NAV_ITEMS = [
  ['overview',   '🏠', 'Home'],
  ['approvals',  '✅', 'Approve'],
  ['students',   '👥', 'Students'],
  ['amaterials', '📚', 'Materials'],
  ['adpp',       '📝', 'DPP'],
  ['anotices',   '📢', 'Notices'],
  ['inquiries',  '📋', 'Inquiries'],
]

export default function AdminDashboard() {
  const { user, logout }  = useAuth()
  const navigate          = useNavigate()
  const [section, setSection]     = useState('overview')
  const [students, setStudents]   = useState([])
  const [pending,  setPending]    = useState([])
  const [inquiries, setInquiries] = useState([])
  const [materials, setMaterials] = useState([])
  const [notices,   setNotices]   = useState([])
  const [loading,   setLoading]   = useState(false)
  const [feedback,  setFeedback]  = useState({ msg:'', type:'success' })
  const [classFilter, setClassFilter] = useState('All')
  const [noticeForm, setNoticeForm] = useState({ title:'', body:'', targetClass:'all' })
  const [matForm, setMatForm] = useState({ title:'', subject:'Physics', class:'12-PCM', type:'pdf', driveLink:'' })
  const [dppQuestions, setDppQuestions] = useState([])
  const [dppLoading,   setDppLoading]   = useState(false)
  const [dppFilter, setDppFilter] = useState({ subject:'Physics', class:'12-PCM' })
  const [dppForm, setDppForm] = useState({
    subject:'Physics', class:'12-PCM',
    question:'', options:['','','',''],
    answerIndex:0, explanation:'',
  })

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (user.role !== 'admin') { navigate('/dashboard'); return }
    fetchAll()
  }, [user])

  useEffect(() => {
    if (section === 'adpp') fetchDPP()
  }, [section, dppFilter.subject, dppFilter.class])

  const fetchAll = () => {
    fetchStudents()
    fetchInquiries()
    fetchMaterials()
    fetchNotices()
  }

  const flash = (msg, type = 'success') => {
    setFeedback({ msg, type })
    setTimeout(() => setFeedback({ msg:'', type:'success' }), 3000)
  }

  // GET /api/dpp/all — admin sees all manual questions
  const fetchDPP = async () => {
    setDppLoading(true)
    try {
      const { data } = await api.get(`/dpp/all?subject=${dppFilter.subject}&class=${dppFilter.class}`)
      setDppQuestions(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('DPP fetch failed:', err.message)
      setDppQuestions([])
    } finally { setDppLoading(false) }
  }

  // POST /api/dpp — admin adds manual question
  const addDPPQuestion = async () => {
    if (!dppForm.question.trim())              return flash('Please enter the question.', 'danger')
    if (dppForm.options.some(o => !o.trim())) return flash('Please fill all 4 options.', 'danger')
    try {
      const { data } = await api.post('/dpp', {
        subject:     dppForm.subject,
        class:       dppForm.class,
        question:    dppForm.question,
        options:     dppForm.options,
        answerIndex: Number(dppForm.answerIndex),
        explanation: dppForm.explanation,
        source:      'manual',
        date:        new Date(),
      })
      setDppQuestions(q => [data, ...q])
      setDppForm(f => ({ ...f, question:'', options:['','','',''], answerIndex:0, explanation:'' }))
      flash('✅ Question added! Students will see this today.')
    } catch (err) {
      flash(`❌ Failed: ${err.response?.data?.message || err.message}`, 'danger')
    }
  }

  // DELETE /api/dpp/:id
  const deleteDPPQuestion = async (id) => {
    try {
      await api.delete(`/dpp/${id}`)
      setDppQuestions(q => q.filter(x => x._id !== id))
      flash('Question deleted.')
    } catch (err) {
      flash(`❌ Failed: ${err.message}`, 'danger')
    }
  }

  const updateOption = (index, value) => {
    setDppForm(f => { const opts = [...f.options]; opts[index] = value; return { ...f, options: opts } })
  }

  // GET /api/students — all students, admin only
  const fetchStudents = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/students')
      // backend returns ALL students (approved + pending)
      setStudents(data.filter(s => s.isApproved))
      setPending(data.filter(s => !s.isApproved))
    } catch (err) {
      console.error('Students fetch failed:', err.message)
      setStudents([])
      setPending([])
    } finally {
      setLoading(false)
    }
  }

  // GET /api/inquiry — all inquiries, admin only
  const fetchInquiries = async () => {
    try {
      const { data } = await api.get('/inquiry')
      setInquiries(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Inquiries fetch failed:', err.message)
      setInquiries([])
    }
  }

  // GET /api/materials — all materials, admin only
  const fetchMaterials = async () => {
    try {
      const { data } = await api.get('/materials')
      setMaterials(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Materials fetch failed:', err.message)
      setMaterials([])
    }
  }

  // GET /api/notices — admin sees all notices
  const fetchNotices = async () => {
    try {
      const { data } = await api.get('/notices')
      setNotices(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Notices fetch failed:', err.message)
      setNotices([])
    }
  }

  // PATCH /api/students/:id/approve
  const approve = async (id) => {
    try {
      await api.patch(`/students/${id}/approve`)
      const s = pending.find(x => x._id === id)
      setPending(p => p.filter(x => x._id !== id))
      if (s) setStudents(arr => [...arr, { ...s, isApproved: true }])
      flash('✅ Student approved! Welcome email sent.')
    } catch (err) {
      flash(`❌ Approve failed: ${err.response?.data?.message || err.message}`, 'danger')
    }
  }

  // PATCH /api/students/:id/reject
  const reject = async (id) => {
    try {
      await api.patch(`/students/${id}/reject`)
      setPending(p => p.filter(x => x._id !== id))
      setStudents(s => s.filter(x => x._id !== id))
      flash('Access revoked.')
    } catch (err) {
      flash(`❌ Failed: ${err.response?.data?.message || err.message}`, 'danger')
    }
  }

  // POST /api/notices
  const postNotice = async () => {
    if (!noticeForm.title || !noticeForm.body) {
      flash('Please fill title and message.', 'danger')
      return
    }
    try {
      const { data } = await api.post('/notices', noticeForm)
      setNotices(n => [data, ...n])
      setNoticeForm({ title:'', body:'', targetClass:'all' })
      flash('✅ Notice posted!')
    } catch (err) {
      flash(`❌ Failed to post notice: ${err.response?.data?.message || err.message}`, 'danger')
    }
  }

  // DELETE /api/notices/:id
  const deleteNotice = async (id) => {
    try {
      await api.delete(`/notices/${id}`)
      setNotices(n => n.filter(x => x._id !== id))
      flash('Notice removed.')
    } catch (err) {
      flash(`❌ Failed: ${err.message}`, 'danger')
    }
  }

  // POST /api/materials
  const uploadMaterial = async () => {
    if (!matForm.title || !matForm.driveLink) {
      flash('Please fill title and Google Drive link.', 'danger')
      return
    }
    try {
      const { data } = await api.post('/materials', matForm)
      setMaterials(m => [...m, data])
      setMatForm({ title:'', subject:'Physics', class:'12-PCM', type:'pdf', driveLink:'' })
      flash('✅ Material uploaded!')
    } catch (err) {
      flash(`❌ Upload failed: ${err.response?.data?.message || err.message}`, 'danger')
    }
  }

  // DELETE /api/materials/:id
  const deleteMaterial = async (id) => {
    try {
      await api.delete(`/materials/${id}`)
      setMaterials(m => m.filter(x => x._id !== id))
      flash('Material deleted.')
    } catch (err) {
      flash(`❌ Delete failed: ${err.message}`, 'danger')
    }
  }

  // PATCH /api/inquiry/:id — update status
  const updateInquiryStatus = async (id, status) => {
    try {
      const { data } = await api.patch(`/inquiry/${id}`, { status })
      setInquiries(arr => arr.map(i => i._id === id ? data : i))
      flash(`✅ Status updated to "${status}"`)
    } catch (err) {
      flash(`❌ Failed: ${err.message}`, 'danger')
    }
  }

  // Empty state
  const EmptyState = ({ icon, title, sub }) => (
    <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)', fontSize:'14px' }}>
      <div style={{ fontSize:'36px', marginBottom:'10px' }}>{icon}</div>
      <div style={{ fontWeight:600, color:'var(--text2)', marginBottom:'6px' }}>{title}</div>
      {sub && <div>{sub}</div>}
    </div>
  )

  return (
    <div className="dash-layout">
      {/* ── SIDEBAR ──────────────────────────────────────────── */}
      <div className="dash-sidebar">
        <div className="dash-user">
          <div className="dash-avatar" style={{ background:'linear-gradient(135deg,var(--gold),var(--red))' }}>
            {user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'AD'}
          </div>
          <div className="dash-name">{user?.name || 'Admin'}</div>
          <div className="dash-class-label">Teacher / Admin</div>
        </div>
        {NAV_ITEMS.map(([key, icon, label]) => (
          <button key={key} className={`dash-nav-item ${section === key ? 'active' : ''}`}
            onClick={() => setSection(key)}>
            <span className="dash-nav-icon">{icon}</span>{label}
            {key === 'approvals' && pending.length > 0 && (
              <span className="badge badge-red" style={{ marginLeft:'auto', fontSize:'10px' }}>
                {pending.length}
              </span>
            )}
          </button>
        ))}
        <button className="dash-nav-item" style={{ marginTop:'16px', color:'var(--red)' }}
          onClick={() => { logout(); navigate('/') }}>
          <span className="dash-nav-icon">🚪</span>Logout
        </button>
      </div>

      {/* ── CONTENT ──────────────────────────────────────────── */}
      <div className="dash-content">
        {feedback.msg && (
          <Alert type={feedback.type} style={{ marginBottom:'16px' }}>{feedback.msg}</Alert>
        )}

        {/* OVERVIEW */}
        {section === 'overview' && (
          <div className="fade-in">
            <div className="dash-title">Admin Dashboard</div>
            <div className="stat-grid">
              <div className="stat-card"><div className="stat-val text-accent">{students.length}</div><div className="stat-lbl">Students</div></div>
              <div className="stat-card"><div className="stat-val text-gold">{pending.length}</div><div className="stat-lbl">Pending</div></div>
              <div className="stat-card"><div className="stat-val text-green">{inquiries.filter(i => i.status === 'new').length}</div><div className="stat-lbl">New Inquiries</div></div>
              <div className="stat-card"><div className="stat-val text-cyan">{materials.length}</div><div className="stat-lbl">Materials</div></div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'12px' }}>
              {pending.length > 0 && (
                <div className="notice" style={{ cursor:'pointer' }} onClick={() => setSection('approvals')}>
                  <div className="notice-title">⏳ {pending.length} Pending Approval{pending.length > 1 ? 's' : ''}</div>
                  <div className="notice-body">New student registrations waiting for your review.</div>
                </div>
              )}
              <div className="notice" style={{ cursor:'pointer' }} onClick={() => setSection('inquiries')}>
                <div className="notice-title">📋 {inquiries.filter(i => i.status === 'new').length} New Inquiries</div>
                <div className="notice-body">Admission inquiries submitted via website.</div>
              </div>
            </div>
          </div>
        )}

        {/* APPROVALS */}
        {section === 'approvals' && (
          <div className="fade-in">
            <div className="dash-title">Pending Approvals</div>
            {loading
              ? <Spinner />
              : pending.length === 0
                ? <Alert type="success">✅ All registrations reviewed! No pending approvals.</Alert>
                : pending.map(s => (
                  <div key={s._id} className="student-row">
                    <div className="student-av">{s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                    <div className="student-info">
                      <div className="student-name-row">{s.name}</div>
                      <div className="student-meta-row">Class {s.class} · {s.email} · {s.phone}</div>
                    </div>
                    <div className="action-btns">
                      <button className="btn btn-sm btn-success" onClick={() => approve(s._id)}>✅ Approve</button>
                      <button className="btn btn-sm btn-danger"  onClick={() => reject(s._id)}>❌ Reject</button>
                    </div>
                  </div>
                ))
            }
          </div>
        )}

        {/* STUDENTS */}
        {section === 'students' && (
          <div className="fade-in">
            <div className="dash-title">All Students ({students.length})</div>
            <div style={{ display:'flex', gap:'8px', marginBottom:'16px', flexWrap:'wrap' }}>
              {['All','9','10','11-PCM','11-PCB','12-PCM','12-PCB'].map(c => (
                <button key={c}
                  className={`btn btn-sm ${classFilter === c ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setClassFilter(c)}>
                  {c === 'All' ? 'All' : `Class ${c}`}
                </button>
              ))}
            </div>
            {loading
              ? <Spinner />
              : (() => {
                const filtered = students.filter(s => classFilter === 'All' || s.class === classFilter)
                return filtered.length === 0
                  ? <EmptyState icon="👥" title={classFilter === 'All' ? 'No approved students yet' : `No students in Class ${classFilter}`} />
                  : filtered.map(s => (
                    <div key={s._id} className="student-row">
                      <div className="student-av">{s.name.split(' ').map(n => n[0]).join('').slice(0, 2)}</div>
                      <div className="student-info">
                        <div className="student-name-row">{s.name}</div>
                        <div className="student-meta-row">
                          Class {s.class} · {s.email} · <span className="badge badge-green">Approved</span>
                        </div>
                      </div>
                      <div className="action-btns">
                        <button className="btn btn-sm btn-warn" onClick={() => reject(s._id)}>Revoke</button>
                      </div>
                    </div>
                  ))
              })()
            }
          </div>
        )}

        {/* MATERIALS */}
        {section === 'amaterials' && (
          <div className="fade-in">
            <div className="dash-title">Manage Materials</div>
            {/* Upload form */}
            <div style={{ background:'var(--surface2)', borderRadius:'var(--r)', border:'1px solid var(--border)', padding:'18px', marginBottom:'24px' }}>
              <div style={{ fontWeight:600, marginBottom:'12px' }}>Upload New Material</div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'12px' }}>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Title *</label>
                  <input className="form-input" placeholder="e.g. Physics Notes Ch.1"
                    value={matForm.title}
                    onChange={e => setMatForm(f => ({ ...f, title: e.target.value }))} />
                </div>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Subject</label>
                  <select className="form-input" value={matForm.subject}
                    onChange={e => setMatForm(f => ({ ...f, subject: e.target.value }))}>
                    {['Physics','Chemistry','Maths','Biology','General'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Class</label>
                  <select className="form-input" value={matForm.class}
                    onChange={e => setMatForm(f => ({ ...f, class: e.target.value }))}>
                    {['9','10','11-PCM','11-PCB','12-PCM','12-PCB','all'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Type</label>
                  <select className="form-input" value={matForm.type}
                    onChange={e => setMatForm(f => ({ ...f, type: e.target.value }))}>
                    {['pdf','video','notes','dpp','formula-sheet','pyq'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ marginTop:'12px', marginBottom:0 }}>
                <label className="form-label">Google Drive / YouTube Link *</label>
                <input className="form-input"
                  placeholder="https://drive.google.com/... or https://youtube.com/..."
                  value={matForm.driveLink}
                  onChange={e => setMatForm(f => ({ ...f, driveLink: e.target.value }))} />
              </div>
              <button className="btn btn-primary" style={{ marginTop:'14px' }} onClick={uploadMaterial}>
                Upload Material
              </button>
            </div>

            {/* Materials list */}
            {materials.length === 0
              ? <EmptyState icon="📚" title="No materials uploaded yet" sub="Upload your first material using the form above." />
              : materials.map(m => (
                <div key={m._id} className="material-row">
                  <div className="material-icon">
                    {m.type === 'video' ? '📹' : m.type === 'dpp' ? '📝' : '📄'}
                  </div>
                  <div className="material-info">
                    <div className="material-name">{m.title}</div>
                    <div className="material-meta">{m.subject} · Class {m.class} · {m.type}</div>
                  </div>
                  <div className="action-btns">
                    <button className="btn btn-sm btn-danger" onClick={() => deleteMaterial(m._id)}>Delete</button>
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* NOTICES */}
        {section === 'anotices' && (
          <div className="fade-in">
            <div className="dash-title">Post Notice</div>
            <div className="card" style={{ marginBottom:'24px' }}>
              <div className="form-group">
                <label className="form-label">Notice Title *</label>
                <input className="form-input" placeholder="e.g. 🔴 Mock Test Saturday"
                  value={noticeForm.title}
                  onChange={e => setNoticeForm(f => ({ ...f, title: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea className="form-input" rows={3} placeholder="Notice details..."
                  value={noticeForm.body}
                  onChange={e => setNoticeForm(f => ({ ...f, body: e.target.value }))} />
              </div>
              <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', alignItems:'flex-end' }}>
                <div className="form-group" style={{ flex:1, minWidth:'160px', marginBottom:0 }}>
                  <label className="form-label">Target Class</label>
                  <select className="form-input" value={noticeForm.targetClass}
                    onChange={e => setNoticeForm(f => ({ ...f, targetClass: e.target.value }))}>
                    <option value="all">All Students</option>
                    {['9','10','11-PCM','11-PCB','12-PCM','12-PCB'].map(c => (
                      <option key={c} value={c}>Class {c}</option>
                    ))}
                  </select>
                </div>
                <button className="btn btn-primary" onClick={postNotice}>Post Notice</button>
              </div>
            </div>

            {/* Notices list */}
            {notices.length === 0
              ? <EmptyState icon="📢" title="No notices posted yet" />
              : notices.map(n => (
                <div key={n._id} className="notice">
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'8px' }}>
                    <div className="notice-title">{n.title}</div>
                    <div style={{ display:'flex', gap:'6px', alignItems:'center', flexShrink:0 }}>
                      <span className="badge badge-accent">{n.targetClass}</span>
                      <button className="btn btn-sm btn-danger" onClick={() => deleteNotice(n._id)}>Delete</button>
                    </div>
                  </div>
                  <div className="notice-body">{n.body}</div>
                  <div className="notice-date">
                    {new Date(n.postedAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
                  </div>
                </div>
              ))
            }
          </div>
        )}

        {/* DPP MANAGEMENT */}
        {section === 'adpp' && (
          <div className="fade-in">
            <div className="dash-title">Manage DPP Questions</div>

            {/* Info banner */}
            <div style={{ background:'rgba(108,99,255,.07)', border:'1px solid rgba(108,99,255,.2)', borderRadius:'var(--r)', padding:'14px 18px', marginBottom:'20px', fontSize:'13px', color:'var(--accent2)', lineHeight:1.7 }}>
              🤖 <strong>Hybrid Mode:</strong> If you add questions today, students will see <strong>your questions</strong>. If you don't add any, AI will <strong>auto-generate</strong> fresh questions. Questions added today show only today.
            </div>

            {/* Add Question Form */}
            <div style={{ background:'var(--surface2)', borderRadius:'var(--r)', border:'1px solid var(--border)', padding:'20px', marginBottom:'28px' }}>
              <div style={{ fontWeight:600, marginBottom:'16px', fontSize:'15px' }}>➕ Add Question for Today</div>

              {/* Subject + Class */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px', marginBottom:'14px' }}>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Subject *</label>
                  <select className="form-input" value={dppForm.subject}
                    onChange={e => setDppForm(f => ({ ...f, subject: e.target.value }))}>
                    {['Physics','Chemistry','Maths','Biology'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Class *</label>
                  <select className="form-input" value={dppForm.class}
                    onChange={e => setDppForm(f => ({ ...f, class: e.target.value }))}>
                    {['9','10','11-PCM','11-PCB','12-PCM','12-PCB'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Question */}
              <div className="form-group">
                <label className="form-label">Question *</label>
                <textarea className="form-input" rows={2}
                  placeholder="Enter the question here..."
                  value={dppForm.question}
                  onChange={e => setDppForm(f => ({ ...f, question: e.target.value }))} />
              </div>

              {/* Options with correct answer selector */}
              <div className="form-group">
                <label className="form-label">Options * — click circle to mark correct answer</label>
                <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
                  {dppForm.options.map((opt, i) => (
                    <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                      <div onClick={() => setDppForm(f => ({ ...f, answerIndex: i }))}
                        style={{
                          width:'22px', height:'22px', borderRadius:'50%', flexShrink:0,
                          border: `2px solid ${dppForm.answerIndex === i ? 'var(--green)' : 'var(--border2)'}`,
                          background: dppForm.answerIndex === i ? 'var(--green)' : 'transparent',
                          cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center',
                          fontSize:'11px', color:'#fff', fontWeight:700, transition:'all .2s',
                        }}>
                        {dppForm.answerIndex === i ? '✓' : ''}
                      </div>
                      <span style={{ fontSize:'13px', color:'var(--text3)', width:'18px', flexShrink:0 }}>
                        {String.fromCharCode(65 + i)}.
                      </span>
                      <input className="form-input" placeholder={`Option ${String.fromCharCode(65 + i)}`}
                        value={opt} onChange={e => updateOption(i, e.target.value)}
                        style={{ flex:1 }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Explanation */}
              <div className="form-group" style={{ marginBottom:'16px' }}>
                <label className="form-label">Explanation (optional — shown after student answers)</label>
                <input className="form-input" placeholder="Brief explanation of correct answer..."
                  value={dppForm.explanation}
                  onChange={e => setDppForm(f => ({ ...f, explanation: e.target.value }))} />
              </div>

              <button className="btn btn-primary" onClick={addDPPQuestion}>
                Add Question
              </button>
            </div>

            {/* Filter */}
            <div style={{ display:'flex', gap:'8px', marginBottom:'16px', flexWrap:'wrap', alignItems:'center' }}>
              <span style={{ fontSize:'13px', color:'var(--text2)', fontWeight:500 }}>Filter:</span>
              {['Physics','Chemistry','Maths','Biology'].map(s => (
                <button key={s}
                  className={`btn btn-sm ${dppFilter.subject === s ? 'btn-primary' : 'btn-outline'}`}
                  onClick={() => setDppFilter(f => ({ ...f, subject: s }))}>
                  {s}
                </button>
              ))}
              <select className="form-input" style={{ width:'auto', padding:'6px 12px', fontSize:'13px' }}
                value={dppFilter.class}
                onChange={e => setDppFilter(f => ({ ...f, class: e.target.value }))}>
                {['9','10','11-PCM','11-PCB','12-PCM','12-PCB'].map(c => (
                  <option key={c} value={c}>Class {c}</option>
                ))}
              </select>
            </div>

            {/* Question list */}
            {dppLoading ? (
              <div style={{ textAlign:'center', padding:'32px', color:'var(--text3)' }}>Loading...</div>
            ) : dppQuestions.length === 0 ? (
              <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)' }}>
                <div style={{ fontSize:'36px', marginBottom:'10px' }}>📝</div>
                <div style={{ fontWeight:600, color:'var(--text2)', marginBottom:'6px' }}>No manual questions added yet</div>
                <div style={{ fontSize:'13px' }}>AI will auto-generate questions for students today. Add questions above to override.</div>
              </div>
            ) : dppQuestions.map((q, idx) => (
              <div key={q._id} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--r)', padding:'16px 20px', marginBottom:'12px' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'12px' }}>
                  <div style={{ flex:1 }}>
                    <div style={{ display:'flex', gap:'8px', marginBottom:'8px', flexWrap:'wrap' }}>
                      <span className="badge badge-accent">{q.subject}</span>
                      <span className="badge badge-cyan">Class {q.class}</span>
                      <span style={{ fontSize:'11px', padding:'3px 10px', borderRadius:'20px', background:'rgba(16,185,129,.12)', color:'var(--green)', fontWeight:600 }}>
                        ✏️ Manual
                      </span>
                      <span style={{ fontSize:'12px', color:'var(--text3)' }}>
                        {new Date(q.date).toLocaleDateString('en-IN')}
                      </span>
                    </div>
                    <div style={{ fontSize:'14px', fontWeight:500, marginBottom:'10px', lineHeight:1.5 }}>
                      Q{idx+1}. {q.question}
                    </div>
                    <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
                      {q.options.map((opt, i) => (
                        <div key={i} style={{
                          fontSize:'13px', padding:'4px 10px', borderRadius:'6px',
                          background: i === q.answerIndex ? 'rgba(16,185,129,.1)' : 'var(--bg3)',
                          color: i === q.answerIndex ? 'var(--green)' : 'var(--text2)',
                          border: `1px solid ${i === q.answerIndex ? 'rgba(16,185,129,.3)' : 'var(--border)'}`,
                        }}>
                          {String.fromCharCode(65+i)}. {opt}
                          {i === q.answerIndex && <span style={{ marginLeft:'8px', fontSize:'11px', fontWeight:600 }}>✓ Correct</span>}
                        </div>
                      ))}
                    </div>
                    {q.explanation && (
                      <div style={{ marginTop:'8px', fontSize:'12px', color:'var(--accent2)', padding:'6px 10px', background:'rgba(108,99,255,.06)', borderRadius:'6px' }}>
                        💡 {q.explanation}
                      </div>
                    )}
                  </div>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteDPPQuestion(q._id)} style={{ flexShrink:0 }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* INQUIRIES */}
        {section === 'inquiries' && (
          <div className="fade-in">
            <div className="dash-title">Admission Inquiries ({inquiries.length})</div>
            {inquiries.length === 0
              ? <EmptyState icon="📋" title="No inquiries yet" sub="Inquiries submitted via the website will appear here." />
              : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr><th>Name</th><th>Class</th><th>Phone</th><th>Date</th><th>Status</th><th>Action</th></tr>
                    </thead>
                    <tbody>
                      {inquiries.map(inq => (
                        <tr key={inq._id}>
                          <td><strong>{inq.studentName}</strong></td>
                          <td>{inq.class}</td>
                          <td>{inq.phone}</td>
                          <td style={{ fontSize:'12px', color:'var(--text3)' }}>
                            {new Date(inq.submittedAt).toLocaleDateString('en-IN')}
                          </td>
                          <td>
                            <span className={`badge ${
                              inq.status === 'new'      ? 'badge-gold'   :
                              inq.status === 'enrolled' ? 'badge-green'  :
                              inq.status === 'closed'   ? 'badge-red'    : 'badge-accent'
                            }`}>{inq.status}</span>
                          </td>
                          <td>
                            <select
                              className="form-input"
                              style={{ padding:'4px 8px', fontSize:'12px', width:'auto' }}
                              value={inq.status}
                              onChange={e => updateInquiryStatus(inq._id, e.target.value)}>
                              <option value="new">New</option>
                              <option value="contacted">Contacted</option>
                              <option value="enrolled">Enrolled</option>
                              <option value="closed">Closed</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )
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
            {key === 'approvals' && pending.length > 0 && (
              <span style={{ position:'absolute', top:'4px', right:'8px', background:'var(--red)', color:'#fff', borderRadius:'10px', fontSize:'9px', padding:'1px 5px' }}>
                {pending.length}
              </span>
            )}
          </button>
        ))}
        <button className="mobile-dash-btn" onClick={() => { logout(); navigate('/') }}>
          <span className="dash-icon">🚪</span><span>Logout</span>
        </button>
      </div>
    </div>
  )
}
