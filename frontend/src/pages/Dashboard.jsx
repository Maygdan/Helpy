import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await api.get('/dashboard/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    }
  };

  const handleArchive = async (id) => {
    try {
      await api.post(`/communities/${id}/archive`);
      alert('Сообщество архивировано');
      fetchStats();
    } catch (error) {
      alert('Ошибка при архивации');
    }
  };

  if (!stats) return <div className="tg-container">Загрузка...</div>;

  return (
    <div className="tg-container">
      <h2 style={{ marginBottom: '20px' }}>Панель организатора 📊</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '24px' }}>
        <div className="tg-card" style={{ textAlign: 'center', margin: 0 }}>
          <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)' }}>Сообществ</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--tg-theme-button-color)' }}>{stats.totalCommunities}</div>
        </div>
        <div className="tg-card" style={{ textAlign: 'center', margin: 0 }}>
          <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)' }}>Пользователей</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.totalUsers}</div>
        </div>
        <div className="tg-card" style={{ textAlign: 'center', margin: 0 }}>
          <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)' }}>Мероприятий</div>
          <div style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.totalEvents}</div>
        </div>
      </div>

      <h3 style={{ fontSize: '16px', marginBottom: '12px' }}>⚠️ Требуют внимания (Lifecycle)</h3>
      
      {stats.inactiveCommunities.length === 0 ? (
        <div className="tg-card" style={{ textAlign: 'center', color: 'var(--tg-theme-hint-color)' }}>
          Все сообщества активны! 🎉
        </div>
      ) : (
        stats.inactiveCommunities.map((comm) => (
          <div key={comm._id} className="tg-card" style={{ borderLeft: '4px solid #FF9500' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 'bold' }}>{comm.name}</div>
                <div className="tg-hint" style={{ margin: '4px 0 0 0' }}>
                  Нет активности. Админ: {comm.adminId?.fullName}
                </div>
              </div>
              <button 
                className="tg-button outline" 
                style={{ width: 'auto', padding: '8px 12px', fontSize: '13px' }} 
                onClick={() => handleArchive(comm._id)}
              >
                Архивировать
              </button>
            </div>
          </div>
        ))
      )}

      <button className="tg-button" style={{ marginTop: '24px' }} onClick={() => navigate('/catalog')}>
        ← Вернуться в каталог
      </button>
    </div>
  );
}