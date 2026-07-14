import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Login from './pages/Login';
import AdminUpload from './pages/AdminUpload';
import NotFound from './pages/NotFound';

function App() {
  const [page, setPage] = useState(() => {
    const path = window.location.pathname;
    if (path === '/' || path === '') return 'home';
    if (path === '/gallery') return 'gallery';
    if (path === '/contact') return 'contact';
    if (path === '/login') return 'login';
    if (path === '/admin') return 'admin';
    return '404';
  });
  
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path === '/' || path === '') setPage('home');
      else if (path === '/gallery') setPage('gallery');
      else if (path === '/contact') setPage('contact');
      else if (path === '/login') setPage('login');
      else if (path === '/admin') setPage('admin');
      else setPage('404');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      fetch('/api/admin/verify', { headers: { Authorization: `Bearer ${token}` } })
        .then(r => r.ok ? setIsAdmin(true) : localStorage.removeItem('admin_token'))
        .catch(() => localStorage.removeItem('admin_token'));
    }
  }, []);

  const handleLogin = () => {
    setIsAdmin(true);
    window.history.pushState({}, '', '/admin');
    setPage('admin');
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAdmin(false);
    window.history.pushState({}, '', '/');
    setPage('home');
  };

  return (
    <>
      {page === 'home' && <Home />}
      {page === 'gallery' && <Gallery />}
      {page === 'contact' && <Contact />}
      {page === 'login' && <Login onLogin={handleLogin} />}
      {page === 'admin' && isAdmin && <AdminUpload />}
      {page === 'admin' && !isAdmin && <Login onLogin={handleLogin} />}
      {page === '404' && <NotFound />}
    </>
  );
}

export default App;
