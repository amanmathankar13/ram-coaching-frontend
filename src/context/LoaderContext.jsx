import { createContext, useContext, useState } from 'react'

const LoaderContext = createContext(null)

export function LoaderProvider({ children }) {
  const [loading, setLoading] = useState(false)
  const [count, setCount]     = useState(0)  // track multiple requests

  const show = () => setCount(c => { if (c === 0) setLoading(true);  return c + 1 })
  const hide = () => setCount(c => { if (c === 1) setLoading(false); return c - 1 })

  return (
    <LoaderContext.Provider value={{ loading, show, hide }}>
      {children}

      {/* Global Top Bar Loader */}
      {loading && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0,
          height: '3px',
          zIndex: 99999,
          background: 'var(--bg3)',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, var(--accent), var(--cyan), var(--accent))',
            backgroundSize: '200% 100%',
            animation: 'loaderBar 1.2s ease-in-out infinite',
            borderRadius: '0 2px 2px 0',
          }}/>
        </div>
      )}

      {/* Full screen overlay for slow requests (shows after 500ms) */}
      {loading && <LoadingOverlay />}

      <style>{`
        @keyframes loaderBar {
          0%   { background-position: 200% 0; width: 30%; }
          50%  { background-position: -200% 0; width: 75%; }
          100% { background-position: 200% 0; width: 30%; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
      `}</style>
    </LoaderContext.Provider>
  )
}

// Overlay with spinner — only appears after delay
function LoadingOverlay() {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      zIndex: 9998,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      pointerEvents: 'none', // allows clicking through
      animation: 'fadeInOverlay .2s ease',
      animationDelay: '500ms',
      animationFillMode: 'both',
      opacity: 0,
    }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '24px 32px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
        pointerEvents: 'all',
      }}>
        <div style={{
          width: '24px', height: '24px',
          border: '3px solid var(--border2)',
          borderTopColor: 'var(--accent)',
          borderRadius: '50%',
          animation: 'spin .7s linear infinite',
          flexShrink: 0,
        }}/>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text)' }}>Loading...</div>
          <div style={{ fontSize: '12px', color: 'var(--text3)', marginTop: '2px' }}>Please wait</div>
        </div>
      </div>
    </div>
  )
}

export const useLoader = () => useContext(LoaderContext)