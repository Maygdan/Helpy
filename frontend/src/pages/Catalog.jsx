import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Cell, Button, Input, SegmentedControl } from '@telegram-apps/telegram-ui';
import api from '../api/client';

export default function Catalog() {
  const [communities, setCommunities] = useState([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Загружаем сообщества при открытии экрана
  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      // Делаем запрос к нашему бэкенду с параметром поиска
      const response = await api.get(`/communities?search=${search}`);
      setCommunities(response.data);
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    }
  };

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0 }}>Сообщества</h2>
        <Button size="s" mode="filled" onClick={() => navigate('/create')}>
          + Создать
        </Button>
      </div>

      <Input 
        placeholder="Поиск по названию или тегам..." 
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onKeyUp={(e) => e.key === 'Enter' && fetchCommunities()}
        style={{ marginBottom: '16px' }}
      />

      <List>
        {communities.length === 0 ? (
          <Cell multiline>
            <div style={{ textAlign: 'center', color: 'var(--tg-theme-hint-color)' }}>
              Сообществ пока нет. Станьте первым создателем!
            </div>
          </Cell>
        ) : (
          communities.map((comm) => (
            <Cell 
              key={comm._id}
              multiline
              onClick={() => navigate(`/community/${comm._id}`)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ fontWeight: 'bold', fontSize: '16px' }}>{comm.name}</div>
              <div style={{ fontSize: '14px', color: 'var(--tg-theme-hint-color)', marginTop: '4px' }}>
                {comm.description}
              </div>
              <div style={{ marginTop: '8px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {comm.tags.map((tag, idx) => (
                  <span key={idx} style={{ 
                    background: 'var(--tg-theme-button-color)', 
                    color: 'white', 
                    padding: '2px 8px', 
                    borderRadius: '12px', 
                    fontSize: '12px' 
                  }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </Cell>
          ))
        )}
      </List>
    </div>
  );
}