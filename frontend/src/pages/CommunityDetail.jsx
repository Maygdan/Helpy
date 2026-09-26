import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/client';

export default function CommunityDetail() {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommunity();
  }, [id]);

  const fetchCommunity = async () => {
    try {
      const response = await api.get(`/communities/${id}`);
      setCommunity(response.data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    }
  };

  const handleJoin = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await api.post(`/communities/${id}/join`, { userId: user._id });
      alert('Вы вступили в сообщество!');
      fetchCommunity();
    } catch (error) {
      alert('Ошибка при вступлении');
    }
  };

  const handleInvite = () => {
    const tg = window.Telegram?.WebApp;
    if (tg) {
      const shareText = "Привет! Вступай в наше сообщество через Helpy 🚀";
      const shareUrl = "https://t.me/HelpyBot/helpy";
      tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`);
    } else {
      alert('Шеринг доступен только внутри Telegram');
    }
  };

  if (!community) return <div className="tg-container">Загрузка...</div>;

  return (
    <div className="tg-container">
      <h2>{community.name}</h2>
      <p style={{ color: 'var(--tg-theme-hint-color)' }}>{community.description}</p>
      
      <div style={{ marginTop: '12px' }}>
        {community.tags.map((tag, idx) => (
          <span key={idx} className="tg-tag">#{tag}</span>
        ))}
      </div>

      <div className="tg-card" style={{ marginTop: '24px' }}>
        <div style={{ marginBottom: '12px' }}><b>Администратор:</b> {community.adminId?.fullName}</div>
        <div style={{ marginBottom: '12px' }}><b>Участники:</b> {community.members?.length || 0}</div>
        <div><b>Тип:</b> {community.accessType === 'public' ? 'Открытое' : 'Закрытое'}</div>
      </div>

      <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button className="tg-button" onClick={handleJoin}>
          Вступить в сообщество
        </button>
        
        <button className="tg-button outline" onClick={handleInvite}>
          📢 Пригласить друга
        </button>
        
        <button className="tg-button outline" onClick={() => alert('Открывается календарь бронирования')}>
          📅 Забронировать помещение
        </button>
      </div>

      <button className="tg-button outline" style={{ marginTop: '24px' }} onClick={() => navigate('/catalog')}>
        ← Назад в каталог
      </button>
    </div>
  );
}