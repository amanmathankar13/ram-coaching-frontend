// ── Countdown Timer ───────────────────────────────────────────
import { useState, useEffect } from 'react'

export function Countdown({ targetDate, name, color }) {
  const [time, setTime] = useState({})

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate) - new Date()
      if (diff <= 0) return setTime({ d: 0, h: 0, m: 0, s: 0 })
      setTime({
        d: Math.floor(diff / 864e5),
        h: Math.floor((diff % 864e5) / 36e5),
        m: Math.floor((diff % 36e5) / 6e4),
        s: Math.floor((diff % 6e4) / 1e3),
      })
    }
    calc()
    const t = setInterval(calc, 1000)
    return () => clearInterval(t)
  }, [targetDate])

  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'var(--font-head)', fontSize: '20px', fontWeight: 700, color, marginBottom: '4px' }}>{name}</div>
      <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '20px' }}>{targetDate}</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', alignItems: 'flex-start' }}>
        {[['d', 'Days'], ['h', 'Hrs'], ['m', 'Min'], ['s', 'Sec']].map(([key, label]) => (
          <div key={key}>
            <div style={{ fontFamily: 'var(--font-head)', fontSize: '32px', fontWeight: 700, lineHeight: 1, color }}>{String(time[key] ?? '--').padStart(2,'0')}</div>
            <div style={{ fontSize: '10px', color: 'var(--text3)', marginTop: '4px', textTransform: 'uppercase' }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Loading Spinner ───────────────────────────────────────────
export function Spinner({ size = 32 }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
      <div style={{
        width: size, height: size, borderRadius: '50%',
        border: '3px solid var(--border2)', borderTopColor: 'var(--accent)',
        animation: 'spin .8s linear infinite'
      }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}

// ── Alert ─────────────────────────────────────────────────────
export function Alert({ type = 'info', children, style = {} }) {
  const colors = {
    info:    { bg: 'rgba(108,99,255,.08)',  border: 'rgba(108,99,255,.2)', color: 'var(--accent2)' },
    success: { bg: 'rgba(16,185,129,.08)', border: 'rgba(16,185,129,.25)', color: 'var(--green)' },
    warn:    { bg: 'rgba(245,158,11,.08)', border: 'rgba(245,158,11,.25)', color: 'var(--gold)' },
    danger:  { bg: 'rgba(239,68,68,.08)',  border: 'rgba(239,68,68,.2)',   color: 'var(--red)' },
  }
  const c = colors[type]
  return (
    <div style={{ background: c.bg, border: `1px solid ${c.border}`, borderRadius: 'var(--r)', padding: '14px 18px', color: c.color, fontSize: '14px', lineHeight: 1.6, ...style }}>
      {children}
    </div>
  )
}

// ── FAQ Item ──────────────────────────────────────────────────
export function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`faq-item ${open ? 'open' : ''}`}>
      <div className="faq-q" onClick={() => setOpen(o => !o)}>
        {q} <span className="faq-icon">+</span>
      </div>
      <div className="faq-a">{a}</div>
    </div>
  )
}

// ── Section Header ────────────────────────────────────────────
export function SectionHead({ tag, title, sub }) {
  return (
    <div className="sec-head">
      <div className="sec-tag">{tag}</div>
      <div className="sec-title">{title}</div>
      {sub && <div className="sec-sub">{sub}</div>}
    </div>
  )
}

// ── Topper Card ───────────────────────────────────────────────
export function TopperCard({ medal, exam, name, score, college }) {
  return (
    <div className="card" style={{ textAlign: 'center', position: 'relative', paddingTop: '32px' }}>
      <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', fontSize: '22px' }}>{medal}</div>
      <div style={{ fontSize: '12px', color: 'var(--text3)', marginBottom: '6px' }}>{exam}</div>
      <div style={{ fontFamily: 'var(--font-head)', fontSize: '16px', fontWeight: 700 }}>{name}</div>
      <div style={{ fontFamily: 'var(--font-head)', fontSize: '22px', fontWeight: 700, color: 'var(--accent)', margin: '6px 0' }}>{score}</div>
      {college && <div style={{ fontSize: '12px', color: 'var(--text3)' }}>{college}</div>}
    </div>
  )
}
