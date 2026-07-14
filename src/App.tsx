import { useState, useEffect } from 'react'
import Gallery from './components/Gallery'
import AdminLogin from './components/AdminLogin'
import AdminUpload from './components/AdminUpload'
import Navbar from './components/Navbar'

function App() {
  const [page, setPage] = useState('gallery')
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      fetch('/api/admin/verify', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? setIsAdmin(true) : localStorage.removeItem('admin_token'))
        .catch(() => localStorage.removeItem('admin_token'))
    }
  }, [])

  const handleLogin = () => {
    setIsAdmin(true)
    setPage('upload')
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    setIsAdmin(false)
    setPage('gallery')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar 
        page={page} 
        setPage={setPage} 
        isAdmin={isAdmin} 
        onLogout={handleLogout} 
      />
      <main className="pt-16">
        {page === 'gallery' && <Gallery />}
        {page === 'login' && <AdminLogin onLogin={handleLogin} />}
        {page === 'upload' && isAdmin && <AdminUpload />}
      </main>
    </div>
  )
}

export default App
