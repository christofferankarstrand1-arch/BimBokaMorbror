import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { DataProvider } from './contexts/DataContext'
import { Layout } from './components/Layout'
import { BimLayout } from './components/BimLayout'
import { MorbrorLayout } from './components/MorbrorLayout'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Book } from './pages/Book'
import { Bookings } from './pages/Bookings'
import { Availability } from './pages/Availability'
import { Checklists } from './pages/Checklists'
import { Memories } from './pages/Memories'
import { Admin } from './pages/Admin'
import { BimDashboard } from './pages/BimDashboard'
import { MorbrorDashboard } from './pages/MorbrorDashboard'

function AppRoutes() {
  const { user, isBim, isMorbror } = useAuth()

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  if (isBim) {
    return (
      <BimLayout>
        <Routes>
          <Route path="/" element={<BimDashboard />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BimLayout>
    )
  }

  if (isMorbror) {
    return (
      <MorbrorLayout>
        <Routes>
          <Route path="/" element={<MorbrorDashboard />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/availability" element={<Availability />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MorbrorLayout>
    )
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/book" element={<Book />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/availability" element={<Availability />} />
        <Route path="/checklists" element={<Checklists />} />
        <Route path="/memories" element={<Memories />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <AppRoutes />
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
