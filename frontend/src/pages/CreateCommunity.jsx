import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Textarea, List, Cell, Alert } from '@telegram-apps/telegram-ui';
import api from '../api/client';

export default function CreateCommunity() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: '',
    accessType: 'public'
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

  const handleBack = () => {
    setError('');
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    try {
      // Получаем ID текущего пользователя из localStorage (заглушка)
      const user = JSON.parse(localStorage.getItem('user'));
      
      await api.post('/communities', {
        ...formData,
        adminId: user._id
      });
      
      navigate('/catalog'); // Возврат в каталог после создания
    } catch (err) {
      setError('Ошибка при создании. Попробуйте позже.');
    }
  };

  return (
    <div style={{ padding: '16px' }}>
      {/* Индикатор шагов */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px', color: 'var(--tg-theme-hint-color)' }}>
        <span style={{ color: step >= 1 ? 'var(--tg-theme-button-color)' : 'inherit', fontWeight: 'bold' }}>1. Основное</span>
        <span style={{ color: step >= 2 ? 'var(--tg-theme-button-color)' : 'inherit', fontWeight: 'bold' }}>2. Детали</span>
        <span style={{ color: step >= 3 ? 'var(--tg-theme-button-color)' : 'inherit', fontWeight: 'bold' }}>3. Финал</span>
      </div>

      {error && <Alert type="error" style={{ marginBottom: '16px' }}>{error}</Alert>}

      {/* ШАГ 1: Название и Описание */}
      {step === 1 && (
        <div>
          <h3>О чем ваше сообщество?</h3>
          <Textarea 
            top="Название" 
            placeholder="Например: Клуб любителей настольных игр"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
          />
          <div style={{ marginTop: '16px' }}>
            <Textarea 
              top="Краткое описание (для чего вступать?)" 
              placeholder="Собираемся каждую пятницу..."
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{ minHeight: '100px' }}
            />
          </div>
          <Button size="l" stretched mode="filled" onClick={handleNext} style={{ marginTop: '24px' }}>
            Далее
          </Button>
        </div>
      )}

      {/* ШАГ 2: Теги и Доступ */}
      {step === 2 && (
        <div>
          <h3>Настройки видимости</h3>
          <Input 
            top="Теги (через запятую)" 
            placeholder="хобби, игры, общение"
            value={formData.tags}
            onChange={(e) => setFormData({...formData, tags: e.target.value})}
          />
          
          <div style={{ marginTop: '24px' }}>
            <div style={{ marginBottom: '8px', fontWeight: '500' }}>Тип доступа:</div>
            <List>
              <Cell 
                before={<input type="radio" name="access" checked={formData.accessType === 'public'} onChange={() => setFormData({...formData, accessType: 'public'})} />}
                description="Видно всем в каталоге, вступить может каждый"
                onClick={() => setFormData({...formData, accessType: 'public'})}
              >
                Открытое
              </Cell>
              <Cell 
                before={<input type="radio" name="access" checked={formData.accessType === 'private'} onChange={() => setFormData({...formData, accessType: 'private'})} />}
                description="Видно всем, но вступление только по заявке"
                onClick={() => setFormData({...formData, accessType: 'private'})}
              >
                Закрытое
              </Cell>
            </List>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
            <Button size="l" mode="outlined" onClick={handleBack} style={{ flex: 1 }}>Назад</Button>
            <Button size="l" mode="filled" onClick={handleNext} style={{ flex: 1 }}>Далее</Button>
          </div>
        </div>
      )}

      {/* ШАГ 3: Подтверждение */}
      {step === 3 && (
        <div>
          <h3>Всё готово к запуску! 🚀</h3>
          <div style={{ background: 'var(--tg-theme-secondary-bg-color)', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
            <div style={{ fontWeight: 'bold', fontSize: '18px' }}>{formData.name}</div>
            <div style={{ marginTop: '8px', color: 'var(--tg-theme-hint-color)' }}>{formData.description}</div>
            <div style={{ marginTop: '12px', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {formData.tags.split(',').map((tag, i) => (
                <span key={i} style={{ background: 'var(--tg-theme-button-color)', color: '#fff', padding: '4px 10px', borderRadius: '12px', fontSize: '12px' }}>#{tag.trim()}</span>
              ))}
            </div>
            <div style={{ marginTop: '12px', fontSize: '14px' }}>
              Тип: <b>{formData.accessType === 'public' ? 'Открытое' : 'Закрытое'}</b>
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <Button size="l" mode="outlined" onClick={handleBack} style={{ flex: 1 }}>Назад</Button>
            <Button size="l" mode="filled" onClick={handleSubmit} style={{ flex: 1 }}>Создать</Button>
          </div>
        </div>
      )}
    </div>
  );
}