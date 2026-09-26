import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';

export default function Auth() {
  const [formData, setFormData] = useState({ fullName: '', email: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email.endsWith('@uni.ru') && !formData.email.endsWith('@company.com')) {
      setError('Используйте корпоративную или учебную почту (@uni.ru или @company.com)');
      return;
    }

    try {
      const response = await api.post('/auth/register', {
        telegramId: '123456789',
        fullName: formData.fullName,
        email: formData.email,
      });
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/catalog');
    } catch (err) {
      setError('Ошибка регистрации. Попробуйте позже.');
    }
  };

  return (
    <div className="tg-container">
      <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Добро пожаловать в Helpy! </h2>
      
      {error && <div className="tg-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Имя и Фамилия</label>
        <input 
          className="tg-input"
          placeholder="Иван Иванов" 
          value={formData.fullName}
          onChange={(e) => setFormData({...formData, fullName: e.target.value})}
          required
        />
        
        <label style={{ fontSize: '14px', fontWeight: '500', display: 'block', marginBottom: '6px' }}>Корпоративная / Учебная почта</label>
        <input 
          className="tg-input"
          type="email" 
          placeholder="ivan@uni.ru" 
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />

        <div className="tg-hint">
          Нажимая кнопку, вы даете согласие на обработку персональных данных в соответствии с 152-ФЗ.
        </div>

        <button type="submit" className="tg-button">
          Войти в систему
        </button>
      </form>
    </div>
  );
}