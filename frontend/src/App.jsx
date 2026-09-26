import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Auth from './pages/Auth';
import Catalog from './pages/Catalog';
import CreateCommunity from './pages/CreateCommunity';
import CommunityDetail from './pages/CommunityDetail';
import Dashboard from './pages/Dashboard';

function App() {
  const user = localStorage.getItem('user');

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      tg.setHeaderColor(tg.themeParams.secondary_bg_color || '#f0f0f0');
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={user ? <Navigate to="/catalog" replace /> : <Auth />} />
        <Route path="/catalog" element={user ? <Catalog /> : <Navigate to="/" replace />} />
        <Route path="/create" element={user ? <CreateCommunity /> : <Navigate to="/" replace />} />
        <Route path="/community/:id" element={user ? <CommunityDetail /> : <Navigate to="/" replace />} />
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/catalog" replace />} />
      </Routes>
    </Router>
  );
}

export default App;