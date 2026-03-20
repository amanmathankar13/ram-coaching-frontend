import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import { Login, Register } from './pages/Auth'
import StudentDashboard from './pages/StudentDashboard'
import AdminDashboard from './pages/AdminDashboard'
import {
  DPP, Classes, JEE, NEET, Resources, Results, Contact, Inquiry
} from './pages/Pages'

// Protected route wrapper
function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth()
  if (loading) return <div style={{ display:'flex', justifyContent:'center', alignItems:'center', height:'80vh', color:'var(--text2)' }}>Loading...</div>
  if (!user) return <Navigate to="/login" replace />
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

// Layout wrapper (nav + footer)
function Layout({ children, noFooter = false }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      {!noFooter && <Footer />}
      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919876543210?text=Hi! I want to inquire about Ram Coaching Classes."
        target="_blank" rel="noreferrer"
        className="wa-float"
        title="Chat on WhatsApp"
      >💬</a>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            {/* Public pages */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/classes" element={<Layout><Classes /></Layout>} />
            <Route path="/jee" element={<Layout><JEE /></Layout>} />
            <Route path="/neet" element={<Layout><NEET /></Layout>} />
            <Route path="/dpp" element={<Layout><DPP /></Layout>} />
            <Route path="/resources" element={<Layout><Resources /></Layout>} />
            <Route path="/results" element={<Layout><Results /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/inquiry" element={<Layout><Inquiry /></Layout>} />

            {/* Auth pages */}
            <Route path="/login" element={<Layout noFooter><Login /></Layout>} />
            <Route path="/register" element={<Layout noFooter><Register /></Layout>} />

            {/* Protected dashboards (no footer) */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Layout noFooter><StudentDashboard /></Layout>
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <Layout noFooter><AdminDashboard /></Layout>
              </ProtectedRoute>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  )
}
