import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppRoot } from '@telegram-apps/telegram-ui';

import Auth from './pages/Auth';
import Catalog from './pages/Catalog';
import CreateCommunity from './pages/CreateCommunity';
import CommunityDetail from './pages/CommunityDetail';

function App() {
  // Простая проверка авторизации (для MVP)
  const user = localStorage.getItem('user');

  // Инициализация Telegram WebApp SDK (ВАЖНО для критерия UX/UI!)
  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.ready(); // Сообщаем Telegram, что приложение загрузилось
      tg.expand(); // Разворачиваем приложение на всю высоту экрана (убирает белые полосы)
      
      // Делаем хедер Telegram таким же, как фон нашего приложения, для бесшовного вида
      tg.setHeaderColor(tg.themeParams.secondary_bg_color || '#f0f0f0');
    }
  }, []);

  return (
    <AppRoot>
      <Router>
        <Routes>
          {/* Если пользователь авторизован, редиректим в каталог, иначе показываем Auth */}
          <Route path="/" element={user ? <Navigate to="/catalog" replace /> : <Auth />} />
          
          {/* Основные маршруты приложения */}
          <Route path="/catalog" element={user ? <Catalog /> : <Navigate to="/" replace />} />
          <Route path="/create" element={user ? <CreateCommunity /> : <Navigate to="/" replace />} />
          <Route path="/community/:id" element={user ? <CommunityDetail /> : <Navigate to="/" replace />} />
          
          {/* Заглушка для несуществующих страниц (защита от ошибок) */}
          <Route path="*" element={<Navigate to="/catalog" replace />} />
        </Routes>
      </Router>
    </AppRoot>
  );
}

export default App;