// ── Login Page ────────────────────────────────────────────────
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Alert } from '../components/UI'

export function Login() {
  const [tab, setTab]         = useState('student')
  const [email, setEmail]     = useState('')
  const [pass, setPass]       = useState('')
  const [error, setError]     = useState('')
  const [pending, setPending] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login }             = useAuth()
  const navigate              = useNavigate()

  const handleLogin = async () => {
    // Clear previous errors
    setError('')
    setPending(false)

    // Basic validation
    if (!email.trim()) return setError('Please enter your email address.')
    if (!pass.trim())  return setError('Please enter your password.')

    setLoading(true)
    try {
      const user = await login(email.trim(), pass)
      navigate(user.role === 'admin' ? '/admin' : '/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message
      if (err.response?.data?.pending) {
        setPending(true)
      } else if (err.response?.status === 401) {
        setError(msg || 'Invalid email or password. Please try again.')
      } else if (err.response?.status === 403) {
        setPending(true)
      } else if (!err.response) {
        setError('Cannot connect to server. Please check your internet connection.')
      } else {
        setError(msg || 'Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight:'80vh', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 24px' }}>
      <div style={{ width:'100%', maxWidth:'420px' }}>

        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div className="sec-tag">Portal</div>
          <h1 style={{ fontSize:'32px', fontWeight:700, marginTop:'8px' }}>Login</h1>
        </div>

        <div className="card">
          {/* Tabs */}
          <div style={{ display:'flex', background:'var(--bg3)', borderRadius:'8px', padding:'3px', marginBottom:'28px' }}>
            {[['student','👨‍🎓 Student'],['teacher','👨‍🏫 Teacher / Admin']].map(([key, label]) => (
              <button key={key} onClick={() => { setTab(key); setError(''); setPending(false) }} style={{
                flex:1, padding:'8px', textAlign:'center', borderRadius:'6px',
                fontSize:'13px', fontWeight:500, cursor:'pointer', border:'none',
                background: tab===key ? 'var(--surface)' : 'transparent',
                color: tab===key ? 'var(--text)' : 'var(--text2)',
                transition:'all .2s'
              }}>{label}</button>
            ))}
          </div>

          {/* Email */}
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              placeholder={tab==='teacher' ? 'teacher@ramcoaching.in' : 'student@email.com'}
              value={email}
              onChange={e => { setEmail(e.target.value); setError('') }}
              style={{ borderColor: error && !email ? 'var(--red)' : '' }}
            />
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={pass}
              onChange={e => { setPass(e.target.value); setError('') }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              style={{ borderColor: error && !pass ? 'var(--red)' : '' }}
            />
          </div>

          {/* ERROR BOX — shown when credentials are wrong */}
          {error && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              background: 'rgba(239,68,68,0.10)',
              border: '1px solid rgba(239,68,68,0.35)',
              borderRadius: '8px',
              padding: '12px 14px',
              marginBottom: '16px',
              animation: 'fadeUp .3s ease',
            }}>
              <span style={{ fontSize:'18px', flexShrink:0 }}>❌</span>
              <div>
                <div style={{ fontWeight:600, fontSize:'13px', color:'var(--red)', marginBottom:'2px' }}>Login Failed</div>
                <div style={{ fontSize:'13px', color:'var(--red)', opacity:.9, lineHeight:1.5 }}>{error}</div>
              </div>
            </div>
          )}

          {/* PENDING BOX — shown when account not yet approved */}
          {pending && (
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
              background: 'rgba(245,158,11,0.10)',
              border: '1px solid rgba(245,158,11,0.35)',
              borderRadius: '8px',
              padding: '12px 14px',
              marginBottom: '16px',
              animation: 'fadeUp .3s ease',
            }}>
              <span style={{ fontSize:'18px', flexShrink:0 }}>⏳</span>
              <div>
                <div style={{ fontWeight:600, fontSize:'13px', color:'var(--gold)', marginBottom:'2px' }}>Account Pending Approval</div>
                <div style={{ fontSize:'13px', color:'var(--gold)', opacity:.9, lineHeight:1.5 }}>
                  Your registration is waiting for teacher approval. You will receive an email once approved.
                </div>
              </div>
            </div>
          )}

          {/* Login Button */}
          <button
            className="btn btn-primary btn-full"
            onClick={handleLogin}
            disabled={loading}
            style={{ opacity: loading ? .7 : 1 }}
          >
            {loading ? (
              <span style={{ display:'flex', alignItems:'center', gap:'8px', justifyContent:'center' }}>
                <span style={{ width:'16px', height:'16px', border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin .7s linear infinite', display:'inline-block' }}/>
                Logging in...
              </span>
            ) : (
              `Login as ${tab === 'teacher' ? 'Admin' : 'Student'} →`
            )}
          </button>

          {tab === 'student' && (
            <div style={{ textAlign:'center', marginTop:'16px', fontSize:'13px', color:'var(--text3)' }}>
              New student? <Link to="/register" style={{ color:'var(--accent)', textDecoration:'none', fontWeight:500 }}>Register here</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Register Page ─────────────────────────────────────────────
export function Register() {
  const [form, setForm] = useState({ name:'', class:'', phone:'', email:'', password:'', confirm:'' })
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleRegister = async () => {
    if (form.password !== form.confirm) return setError('Passwords do not match')
    setError(''); setLoading(true)
    try {
      await register({ name: form.name, class: form.class, phone: form.phone, email: form.email, password: form.password })
      setSuccess(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally { setLoading(false) }
  }

  if (success) return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
      <div style={{ textAlign: 'center', maxWidth: '420px' }}>
        <div style={{ fontSize: '60px', marginBottom: '16px' }}>✅</div>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '24px', marginBottom: '12px' }}>Registration Successful!</h2>
        <p style={{ color: 'var(--text2)', lineHeight: 1.7 }}>Your account is pending teacher approval. You will receive a notification once approved. Please check back later or contact us.</p>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '24px' }}>Back to Home</Link>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <div style={{ width: '100%', maxWidth: '500px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div className="sec-tag">New Student</div>
          <h1 style={{ fontSize: '32px', fontWeight: 700, marginTop: '8px' }}>Register</h1>
          <p style={{ color: 'var(--text2)', marginTop: '8px', fontSize: '14px' }}>Registration is pending teacher approval</p>
        </div>

        <div className="card">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[['name','Full Name','text','Your full name'],['phone','Phone','tel','+91 XXXXX XXXXX']].map(([key, label, type, ph]) => (
              <div key={key} className="form-group">
                <label className="form-label">{label} *</label>
                <input className="form-input" type={type} placeholder={ph} value={form[key]} onChange={set(key)} />
              </div>
            ))}
          </div>

          <div className="form-group">
            <label className="form-label">Class *</label>
            <select className="form-input" value={form.class} onChange={set('class')}>
              <option value="">Select Class</option>
              {['9','10','11-PCM','11-PCB','12-PCM','12-PCB'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Email *</label>
            <input className="form-input" type="email" placeholder="student@email.com" value={form.email} onChange={set('email')} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[['password','Password','Create password'],['confirm','Confirm Password','Repeat password']].map(([key, label, ph]) => (
              <div key={key} className="form-group">
                <label className="form-label">{label} *</label>
                <input className="form-input" type="password" placeholder={ph} value={form[key]} onChange={set(key)} />
              </div>
            ))}
          </div>

          {error && <Alert type="danger" style={{ marginBottom: '16px' }}>{error}</Alert>}

          <button className="btn btn-primary btn-full" onClick={handleRegister} disabled={loading}>
            {loading ? 'Registering...' : 'Register →'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: 'var(--text3)' }}>
            Already registered? <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>Login here</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
