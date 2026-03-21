import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../api/api'
import { Spinner, Alert } from '../components/UI'

const NAV_ITEMS = [
  ['overview',   '🏠', 'Home'],
  ['approvals',  '✅', 'Approvals'],
  ['students',   '👥', 'Students'],
  ['amaterials', '📚', 'Materials'],
  ['anotices',   '📢', 'Notices'],
  ['inquiries',  '📋', 'Inquiries'],
]

export default function AdminDashboard() {
  const { user, logout }  = useAuth()
  const navigate          = useNavigate()
  const [classFilter, setClassFilter] = useState('All')
  const [section, setSection]     = useState('overview')
  const [students, setStudents]   = useState([])
  const [pending,  setPending]    = useState([])
  const [inquiries, setInquiries] = useState([])
  const [materials, setMaterials] = useState([])
  const [notices,   setNotices]   = useState([])
  const [loading,   setLoading]   = useState(false)
  const [feedback,  setFeedback]  = useState('')
  const [noticeForm, setNoticeForm] = useState({ title:'', body:'', targetClass:'all' })
  const [matForm, setMatForm] = useState({ title:'', subject:'Physics', class:'12-PCM', type:'pdf', driveLink:'' })

  useEffect(() => {
    if (!user) { navigate('/login'); return }
    if (user.role !== 'admin') { navigate('/dashboard'); return }
    fetchStudents(); fetchInquiries(); fetchMaterials(); fetchNotices()
  }, [user])

  const flash = (msg) => { setFeedback(msg); setTimeout(() => setFeedback(''), 3000) }

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/students')
      setStudents(data.filter(s => s.isApproved))
      setPending(data.filter(s => !s.isApproved))
    } catch {
      setStudents([
        { _id:'1', name:'Arjun Kale',       class:'12-PCM', email:'arjun@email.com',   isApproved:true },
        { _id:'2', name:'Preethi Patil',    class:'11-PCB', email:'preethi@email.com', isApproved:true },
        { _id:'3', name:'Rishi Deshpande',  class:'10',     email:'rishi@email.com',   isApproved:true },
      ])
      setPending([
        { _id:'4', name:'Varun Kulkarni', class:'11-PCM', email:'varun@email.com',  phone:'9876543210' },
        { _id:'5', name:'Nikita Patil',   class:'12-PCB', email:'nikita@email.com', phone:'9876543211' },
      ])
    } finally { setLoading(false) }
  }

  const fetchInquiries = async () => {
    try {
      const { data } = await api.get('/inquiry')
      setInquiries(data)
    } catch {
      setInquiries([
        { _id:'1', studentName:'Rahul Kadam', class:'11th PCM', phone:'9876500001', submittedAt:new Date(), status:'new' },
        { _id:'2', studentName:'Pooja Desai', class:'NEET',     phone:'9876500002', submittedAt:new Date(), status:'new' },
        { _id:'3', studentName:'Amol Jadhav', class:'10th',     phone:'9876500003', submittedAt:new Date(), status:'contacted' },
      ])
    }
  }

  const fetchMaterials = async () => {
    try {
      const { data } = await api.get('/materials')
      setMaterials(data)
    } catch {
      setMaterials([
        { _id:'1', title:'Physics Notes — Electrostatics', subject:'Physics',   class:'12-PCM', type:'pdf' },
        { _id:'2', title:'Organic Chemistry Notes',        subject:'Chemistry', class:'12-PCM', type:'pdf' },
      ])
    }
  }

  const fetchNotices = async () => {
    try {
      const { data } = await api.get('/notices')
      setNotices(data)
    } catch {
      setNotices([
        { _id:'1', title:'🔴 Mock Test — Saturday', body:'Full syllabus mock test on Saturday 22 March, 10 AM.', postedAt:new Date(), targetClass:'all' },
        { _id:'2', title:'📚 New Material Added',   body:'Physics DPP Week 14 uploaded.', postedAt:new Date(Date.now()-86400000), targetClass:'12-PCM' },
      ])
    }
  }

  const approve = async (id) => {
    try { await api.patch(`/students/${id}/approve`) } catch {}
    const s = pending.find(x => x._id === id)
    setPending(p => p.filter(x => x._id !== id))
    if (s) setStudents(arr => [...arr, { ...s, isApproved:true }])
    flash('✅ Student approved!')
  }

  const reject = async (id) => {
    try { await api.patch(`/students/${id}/reject`) } catch {}
    setPending(p => p.filter(x => x._id !== id))
    setStudents(s => s.filter(x => x._id !== id))
    flash('Student access revoked.')
  }

  const postNotice = async () => {
    if (!noticeForm.title || !noticeForm.body) return flash('Please fill title and message.')
    try { const { data } = await api.post('/notices', noticeForm); setNotices(n => [data, ...n]) }
    catch { setNotices(n => [{ _id:Date.now(), ...noticeForm, postedAt:new Date() }, ...n]) }
    setNoticeForm({ title:'', body:'', targetClass:'all' })
    flash('✅ Notice posted!')
  }

  const uploadMaterial = async () => {
    if (!matForm.title || !matForm.driveLink) return flash('Please fill all required fields.')
    try { const { data } = await api.post('/materials', matForm); setMaterials(m => [...m, data]) }
    catch { setMaterials(m => [...m, { _id:Date.now(), ...matForm }]) }
    setMatForm({ title:'', subject:'Physics', class:'12-PCM', type:'pdf', driveLink:'' })
    flash('✅ Material uploaded!')
  }

  const deleteMaterial = async (id) => {
    try { await api.delete(`/materials/${id}`) } catch {}
    setMaterials(m => m.filter(x => x._id !== id))
  }

  return (
    <div className="dash-layout">
      {/* ── SIDEBAR (desktop) ──────────────────────────────── */}
      <div className="dash-sidebar">
        <div className="dash-user">
          <div className="dash-avatar" style={{ background:'linear-gradient(135deg,var(--gold),var(--red))' }}>RS</div>
          <div className="dash-name">{user?.name || 'Admin'}</div>
          <div className="dash-class-label">Teacher / Admin</div>
        </div>
        {NAV_ITEMS.map(([key, icon, label]) => (
          <button key={key} className={`dash-nav-item ${section===key?'active':''}`} onClick={() => setSection(key)}>
            <span className="dash-nav-icon">{icon}</span>{label}
            {key==='approvals' && pending.length > 0 && (
              <span className="badge badge-red" style={{ marginLeft:'auto', fontSize:'10px' }}>{pending.length}</span>
            )}
          </button>
        ))}
        <button className="dash-nav-item" style={{ marginTop:'16px', color:'var(--red)' }} onClick={() => { logout(); navigate('/') }}>
          <span className="dash-nav-icon">🚪</span>Logout
        </button>
      </div>

      {/* ── CONTENT ────────────────────────────────────────── */}
      <div className="dash-content">
        {feedback && <Alert type="success" style={{ marginBottom:'16px' }}>{feedback}</Alert>}

        {/* OVERVIEW */}
        {section === 'overview' && (
          <div className="fade-in">
            <div className="dash-title">Admin Dashboard</div>
            <div className="stat-grid">
              <div className="stat-card"><div className="stat-val text-accent">{students.length}</div><div className="stat-lbl">Students</div></div>
              <div className="stat-card"><div className="stat-val text-gold">{pending.length}</div><div className="stat-lbl">Pending</div></div>
              <div className="stat-card"><div className="stat-val text-green">{inquiries.filter(i=>i.status==='new').length}</div><div className="stat-lbl">Inquiries</div></div>
              <div className="stat-card"><div className="stat-val text-cyan">{materials.length}</div><div className="stat-lbl">Materials</div></div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:'12px' }}>
              {pending.length > 0 && (
                <div className="notice" style={{ cursor:'pointer' }} onClick={() => setSection('approvals')}>
                  <div className="notice-title">⏳ {pending.length} Pending Approval{pending.length>1?'s':''}</div>
                  <div className="notice-body">New student registrations waiting for review.</div>
                </div>
              )}
              <div className="notice" style={{ cursor:'pointer' }} onClick={() => setSection('inquiries')}>
                <div className="notice-title">📋 {inquiries.filter(i=>i.status==='new').length} New Inquiries</div>
                <div className="notice-body">Admission inquiries submitted via website.</div>
              </div>
            </div>
          </div>
        )}

        {/* APPROVALS */}
        {section === 'approvals' && (
          <div className="fade-in">
            <div className="dash-title">Pending Approvals</div>
            {loading ? <Spinner /> : pending.length === 0
              ? <Alert type="success">✅ All registrations reviewed!</Alert>
              : pending.map(s => (
                <div key={s._id} className="student-row">
                  <div className="student-av">{s.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
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
                <button key={c} className={`btn btn-sm ${classFilter === c ? 'btn-primary' : 'btn-outline'}`} onClick={() => setClassFilter(c)}>
                  {c==='All'?'All':`Class ${c}`}
                </button>
              ))}
            </div>
            {students
            .filter(s => classFilter === 'All' || s.class === classFilter)
            .map(s => (
              <div key={s._id} className="student-row">
                <div className="student-av">{s.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                <div className="student-info">
                  <div className="student-name-row">{s.name}</div>
                  <div className="student-meta-row">Class {s.class} · {s.email} · <span className="badge badge-green">Approved</span></div>
                </div>
                <div className="action-btns">
                  <button className="btn btn-sm btn-outline">Materials</button>
                  <button className="btn btn-sm btn-warn" onClick={() => reject(s._id)}>Revoke</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {students.filter(s => classFilter === 'All' || s.class === classFilter).length === 0 && (
          <div style={{ textAlign:'center', padding:'40px', color:'var(--text3)', fontSize:'14px' }}>
            No students found for Class {classFilter}
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
                  <input className="form-input" placeholder="Material title" value={matForm.title} onChange={e => setMatForm(f=>({...f,title:e.target.value}))} />
                </div>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Subject</label>
                  <select className="form-input" value={matForm.subject} onChange={e => setMatForm(f=>({...f,subject:e.target.value}))}>
                    {['Physics','Chemistry','Maths','Biology','General'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Class</label>
                  <select className="form-input" value={matForm.class} onChange={e => setMatForm(f=>({...f,class:e.target.value}))}>
                    {['9','10','11-PCM','11-PCB','12-PCM','12-PCB','all'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label className="form-label">Type</label>
                  <select className="form-input" value={matForm.type} onChange={e => setMatForm(f=>({...f,type:e.target.value}))}>
                    {['pdf','video','notes','dpp','formula-sheet','pyq'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-group" style={{ marginTop:'12px', marginBottom:0 }}>
                <label className="form-label">Google Drive Link *</label>
                <input className="form-input" placeholder="https://drive.google.com/..." value={matForm.driveLink} onChange={e => setMatForm(f=>({...f,driveLink:e.target.value}))} />
              </div>
              <button className="btn btn-primary" style={{ marginTop:'14px' }} onClick={uploadMaterial}>Upload Material</button>
            </div>
            {materials.map(m => (
              <div key={m._id} className="material-row">
                <div className="material-icon">📄</div>
                <div className="material-info">
                  <div className="material-name">{m.title}</div>
                  <div className="material-meta">{m.subject} · Class {m.class} · {m.type}</div>
                </div>
                <div className="action-btns">
                  <button className="btn btn-sm btn-outline">Edit</button>
                  <button className="btn btn-sm btn-danger" onClick={() => deleteMaterial(m._id)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* NOTICES */}
        {section === 'anotices' && (
          <div className="fade-in">
            <div className="dash-title">Post Notice</div>
            <div className="card" style={{ marginBottom:'24px' }}>
              <div className="form-group">
                <label className="form-label">Notice Title *</label>
                <input className="form-input" placeholder="e.g. 🔴 Mock Test Saturday" value={noticeForm.title} onChange={e => setNoticeForm(f=>({...f,title:e.target.value}))} />
              </div>
              <div className="form-group">
                <label className="form-label">Message *</label>
                <textarea className="form-input" rows={3} placeholder="Notice details..." value={noticeForm.body} onChange={e => setNoticeForm(f=>({...f,body:e.target.value}))} />
              </div>
              <div style={{ display:'flex', gap:'12px', flexWrap:'wrap', alignItems:'flex-end' }}>
                <div className="form-group" style={{ flex:1, minWidth:'160px', marginBottom:0 }}>
                  <label className="form-label">Target</label>
                  <select className="form-input" value={noticeForm.targetClass} onChange={e => setNoticeForm(f=>({...f,targetClass:e.target.value}))}>
                    <option value="all">All Students</option>
                    {['9','10','11-PCM','11-PCB','12-PCM','12-PCB'].map(c => <option key={c} value={c}>Class {c}</option>)}
                  </select>
                </div>
                <button className="btn btn-primary" onClick={postNotice}>Post Notice</button>
              </div>
            </div>
            {notices.map(n => (
              <div key={n._id} className="notice">
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'8px' }}>
                  <div className="notice-title">{n.title}</div>
                  <span className="badge badge-accent">{n.targetClass}</span>
                </div>
                <div className="notice-body">{n.body}</div>
                <div className="notice-date">{new Date(n.postedAt).toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'})}</div>
              </div>
            ))}
          </div>
        )}

        {/* INQUIRIES */}
        {section === 'inquiries' && (
          <div className="fade-in">
            <div className="dash-title">Admission Inquiries</div>
            <div className="table-wrap">
              <table>
                <thead><tr><th>Name</th><th>Class</th><th>Phone</th><th>Date</th><th>Status</th><th>Action</th></tr></thead>
                <tbody>
                  {inquiries.map(inq => (
                    <tr key={inq._id}>
                      <td><strong>{inq.studentName}</strong></td>
                      <td>{inq.class}</td>
                      <td>{inq.phone}</td>
                      <td style={{ fontSize:'12px', color:'var(--text3)' }}>{new Date(inq.submittedAt).toLocaleDateString('en-IN')}</td>
                      <td><span className={`badge ${inq.status==='new'?'badge-gold':inq.status==='enrolled'?'badge-green':'badge-accent'}`}>{inq.status}</span></td>
                      <td><button className="btn btn-sm btn-success">Follow Up</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── MOBILE BOTTOM NAV ──────────────────────────────── */}
      <div className="mobile-dash-nav">
        {NAV_ITEMS.map(([key, icon, label]) => (
          <button key={key} className={`mobile-dash-btn ${section===key?'active':''}`} onClick={() => setSection(key)}>
            <span className="dash-icon">{icon}</span>
            <span>{label}</span>
            {key==='approvals' && pending.length>0 && <span className="badge badge-red" style={{ fontSize:'9px',padding:'1px 5px',position:'absolute',top:'4px' }}>{pending.length}</span>}
          </button>
        ))}
        <button className="mobile-dash-btn" onClick={() => { logout(); navigate('/') }}>
          <span className="dash-icon">🚪</span><span>Logout</span>
        </button>
      </div>
    </div>
  )
}
