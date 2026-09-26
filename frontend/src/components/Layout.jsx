import React, { useEffect, useState } from 'react';
import { Outlet, NavLink, useLocation } from 'react-router-dom';

export default function Layout() {
  const [currentUser, setCurrentUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Проверяем Telegram WebApp API
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready();
      tg.expand();
      try {
        if (tg.headerColor) tg.setHeaderColor('secondary');
        if (tg.backgroundColor) tg.setBackgroundColor('secondary');
      } catch (e) {
        // Игнорируем в обычном браузере
      }
    }

    const checkUser = () => {
      try {
        const stored = localStorage.getItem('helpy_user');
        if (stored) {
          setCurrentUser(JSON.parse(stored));
        } else {
          setCurrentUser(null);
        }
      } catch (e) {
        setCurrentUser(null);
      }
    };

    checkUser();
    window.addEventListener('storage', checkUser);
    return () => window.removeEventListener('storage', checkUser);
  }, [location]);

  return (
    <div className="tma-container">
      {/* Шапка с безопасными отступами под Telegram */}
      <header className="tma-header">
        <NavLink to="/catalog" className="tma-brand">
          <div className="tma-logo-icon">🤝</div>
          <div className="tma-title-group">
            <h1>Helpy</h1>
            <p>Горизонтальные сообщества</p>
          </div>
        </NavLink>

        {currentUser ? (
          <NavLink to="/auth" className="tma-user-chip" title="Профиль">
            <span className="tma-user-avatar">
              {(currentUser.fullName || currentUser.username || 'U')[0].toUpperCase()}
            </span>
            <span>{currentUser.fullName?.split(' ')[0] || currentUser.username || 'Профиль'}</span>
            {currentUser.isVerified && (
              <span title="Верифицирован" style={{ color: '#34c759', fontSize: 13 }}>✓</span>
            )}
          </NavLink>
        ) : (
          <NavLink to="/auth" className="tma-user-chip">
            <span>Вход / Регистрация</span>
          </NavLink>
        )}
      </header>

      {/* Основной контент */}
      <main className="tma-main">
        <Outlet />
      </main>

      {/* Нижняя навигация Telegram Mini App */}
      <nav className="tma-bottom-bar">
        <NavLink
          to="/catalog"
          className={({ isActive }) => `tma-nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="tma-nav-icon">🔍</span>
          <span>Каталог</span>
        </NavLink>

        <NavLink
          to="/create"
          className={({ isActive }) => `tma-nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="tma-nav-icon">➕</span>
          <span>Создать</span>
        </NavLink>

        <NavLink
          to="/auth"
          className={({ isActive }) => `tma-nav-item ${isActive ? 'active' : ''}`}
        >
          <span className="tma-nav-icon">👤</span>
          <span>{currentUser ? 'Профиль' : 'Вход'}</span>
        </NavLink>
      </nav>
    </div>
  );
}
