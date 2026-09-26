import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function CreateCommunity() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({ 
    name: '', 
    description: '', 
    tags: '', 
    accessType: 'public',
    budgetRequested: 0,
    roomBooked: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    if (step === 1 && (!formData.name || !formData.description)) {
      setError('Заполните название и описание');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user'));
      await api.post('/communities', { ...formData, adminId: user._id });
      navigate('/catalog');
    } catch (err) {
      setError('Ошибка при создании. Попробуйте позже.');
    }
  };

  return (
    <div className="tg-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', fontSize: '14px', color: 'var(--tg-theme-hint-color)' }}>
        <span style={{ color: step >= 1 ? 'var(--tg-theme-button-color)' : 'inherit', fontWeight: 'bold' }}>1. Основное</span>
        <span style={{ color: step >= 2 ? 'var(--tg-theme-button-color)' : 'inherit', fontWeight: 'bold' }}>2. Детали</span>
        <span style={{ color: step >= 3 ? 'var(--tg-theme-button-color)' : 'inherit', fontWeight: 'bold' }}>3. Финал</span>
      </div>

      {error && <div className="tg-error">{error}</div>}

      {step === 1 && (
        <div>
          <h3>О чем ваше сообщество?</h3>
          <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Название</label>
          <input className="tg-input" placeholder="Например: Клуб настольных игр" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
          
          <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Описание</label>
          <textarea className="tg-input" placeholder="Собираемся каждую пятницу..." value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} style={{ minHeight: '80px' }} />
          
          <button className="tg-button" style={{ marginTop: '16px' }} onClick={handleNext}>Далее</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h3>Настройки и ресурсы</h3>
          <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Теги (через запятую)</label>
          <input className="tg-input" placeholder="хобби, игры, общение" value={formData.tags} onChange={(e) => setFormData({...formData, tags: e.target.value})} />
          
          <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Тип доступа</label>
          <div className="tg-card" style={{ padding: '12px' }}>
            <label style={{ display: 'flex', alignItems: 'center', marginBottom: '12px', cursor: 'pointer' }}>
              <input type="radio" name="access" checked={formData.accessType === 'public'} onChange={() => setFormData({...formData, accessType: 'public'})} style={{ marginRight: '10px' }} />
              <div>
                <div style={{ fontWeight: '600' }}>Открытое</div>
                <div className="tg-hint" style={{ margin: 0 }}>Видно всем, вступить может каждый</div>
              </div>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
              <input type="radio" name="access" checked={formData.accessType === 'private'} onChange={() => setFormData({...formData, accessType: 'private'})} style={{ marginRight: '10px' }} />
              <div>
                <div style={{ fontWeight: '600' }}>Закрытое</div>
                <div className="tg-hint" style={{ margin: 0 }}>Вступление только по заявке</div>
              </div>
            </label>
          </div>

          <div className="tg-card" style={{ marginTop: '20px' }}>
            <h4 style={{ margin: '0 0 12px 0', fontSize: '15px' }}>🛠 Ресурсная поддержка</h4>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px', cursor: 'pointer' }}>
              <input type="checkbox" style={{ marginTop: '3px', accentColor: 'var(--tg-theme-button-color)' }} onChange={(e) => setFormData({...formData, budgetRequested: e.target.checked ? 15000 : 0})} />
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>Запросить микро-бюджет</div>
                <div className="tg-hint" style={{ margin: 0 }}>До 15 000 ₽ на первую встречу</div>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
              <input type="checkbox" style={{ marginTop: '3px', accentColor: 'var(--tg-theme-button-color)' }} onChange={(e) => setFormData({...formData, roomBooked: e.target.checked ? 'Нужна переговорная' : ''})} />
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px' }}>Забронировать помещение</div>
                <div className="tg-hint" style={{ margin: 0 }}>Подберем свободную аудиторию</div>
              </div>
            </label>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button className="tg-button outline" onClick={() => setStep(1)}>Назад</button>
            <button className="tg-button" onClick={handleNext}>Далее</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3>Всё готово к запуску! 🚀</h3>
          <div className="tg-card">
            <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{formData.name}</div>
            <div style={{ marginTop: '8px', color: 'var(--tg-theme-hint-color)' }}>{formData.description}</div>
            <div style={{ marginTop: '12px' }}>
              {formData.tags.split(',').map((tag, i) => (
                <span key={i} className="tg-tag">#{tag.trim()}</span>
              ))}
            </div>
            <div style={{ marginTop: '12px', fontSize: '14px' }}>Тип: <b>{formData.accessType === 'public' ? 'Открытое' : 'Закрытое'}</b></div>
            {formData.budgetRequested > 0 && <div style={{ marginTop: '8px', fontSize: '14px' }}>💰 Запрошен бюджет: {formData.budgetRequested} ₽</div>}
            {formData.roomBooked && <div style={{ marginTop: '8px', fontSize: '14px' }}>📍 Запрошено помещение</div>}
          </div>
          
          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <button className="tg-button outline" onClick={() => setStep(2)}>Назад</button>
            <button className="tg-button" onClick={handleSubmit}>Создать</button>
          </div>
        </div>
      )}
    </div>
  );
}