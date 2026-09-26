import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Catalog() {
  const [communities, setCommunities] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const response = await api.get(`/communities?search=${search}`);
      setCommunities(response.data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    }
  };

  return (
    <div className="tg-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0 }}>Сообщества</h2>
        <button className="tg-button" style={{ width: 'auto', padding: '8px 16px' }} onClick={() => navigate('/create')}>
          + Создать
        </button>
      </div>

      {/* Партнерское событие (B2B2C Marketplace) */}
      <div className="tg-card" style={{ border: '1px solid var(--tg-theme-button-color)', position: 'relative', marginBottom: '20px' }}>
        <div style={{ 
          position: 'absolute', top: '12px', right: '12px', 
          background: '#FFD700', color: '#000', fontSize: '11px', 
          padding: '4px 8px', borderRadius: '6px', fontWeight: 'bold' 
        }}>
          ПАРТНЕР
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{ width: '40px', height: '40px', background: '#fc3f1d', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>Я</div>
          <div>
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>Яндекс: Хакатон по ML</div>
            <div style={{ fontSize: '13px', color: 'var(--tg-theme-hint-color)' }}>Для сотрудников IT-департамента</div>
          </div>
        </div>
        
        <p style={{ fontSize: '14px', marginBottom: '16px', lineHeight: '1.4' }}>
          Призы: мерч и приоритетное рассмотрение на стажировку.
        </p>
        
        <button 
          className="tg-button" 
          onClick={() => alert('Форма с чекбоксом: "Я согласен передать имя и почту организаторам (152-ФЗ Opt-in)"')}
        >
          Участвовать (Opt-in)
        </button>
      </div>

      <input 
        className="tg-input"
        placeholder="Поиск по названию или тегам..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyUp={(e) => e.key === 'Enter' && fetchCommunities()}
      />

      {communities.length === 0 ? (
        <div className="tg-card" style={{ textAlign: 'center', color: 'var(--tg-theme-hint-color)' }}>
          Сообществ пока нет. Станьте первым создателем!
        </div>
      ) : (
        communities.map((comm) => (
          <div 
            key={comm._id}
            className="tg-card"
            onClick={() => navigate(`/community/${comm._id}`)}
            style={{ cursor: 'pointer' }}
          >
            <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{comm.name}</div>
            <div style={{ fontSize: '14px', color: 'var(--tg-theme-hint-color)', marginTop: '4px' }}>
              {comm.description}
            </div>
            <div style={{ marginTop: '8px' }}>
              {comm.tags.map((tag, idx) => (
                <span key={idx} className="tg-tag">#{tag}</span>
              ))}
            </div>
          </div>
        ))
      )}

      <button className="tg-button outline" style={{ marginTop: '24px' }} onClick={() => navigate('/dashboard')}>
        📊 Панель организатора
      </button>
    </div>
  );
}