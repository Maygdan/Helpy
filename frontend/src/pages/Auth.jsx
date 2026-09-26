import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, FormItem, Form, Alert } from '@telegram-apps/telegram-ui';
import api from '../api/client';

export default function Auth() {
  const [formData, setFormData] = useState({ fullName: '', email: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Простая проверка корпоративного домена (имитация верификации для кейса)
    if (!formData.email.endsWith('@uni.ru') && !formData.email.endsWith('@company.com')) {
      setError('Используйте корпоративную или учебную почту для верификации.');
      return;
    }

    try {
      // Отправляем данные на наш бэкенд (telegramId пока заглушка)
      const response = await api.post('/auth/register', {
        telegramId: '123456789', // В реальном TMA берется из window.Telegram.WebApp.initDataUnsafe.user.id
        fullName: formData.fullName,
        email: formData.email,
      });
      
      // Сохраняем пользователя и идем в каталог
      localStorage.setItem('user', JSON.stringify(response.data.user));
      navigate('/catalog');
    } catch (err) {
      setError('Ошибка регистрации. Попробуйте позже.');
    }
  };

  return (
    <div style={{ padding: '16px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '24px' }}>Добро пожаловать в Helpy! 👋</h2>
      
      {error && <Alert type="error" style={{ marginBottom: '16px' }}>{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <FormItem top="Имя и Фамилия">
          <Input 
            placeholder="Иван Иванов" 
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            required
          />
        </FormItem>
        
        <FormItem top="Корпоративная / Учебная почта">
          <Input 
            type="email" 
            placeholder="ivan@uni.ru" 
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </FormItem>

        <div style={{ fontSize: '12px', color: 'var(--tg-theme-hint-color)', marginBottom: '16px' }}>
          Нажимая кнопку, вы даете согласие на обработку персональных данных в соответствии с 152-ФЗ.
        </div>

        <Button size="l" stretched type="submit">
          Войти в систему
        </Button>
      </Form>
    </div>
  );
}