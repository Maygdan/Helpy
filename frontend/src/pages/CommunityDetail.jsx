import { useNavigate, useParams } from 'react-router-dom';
import { Button, Cell, List, Alert } from '@telegram-apps/telegram-ui';

export default function CommunityDetail() {
  const navigate = useNavigate();
  // В реальном приложении мы бы делали запрос к API по useParams().id
  
  const handleInvite = () => {
    // ИСПОЛЬЗУЕМ НАТИВНЫЙ ШЕРИНГ TELEGRAM (Требование №7: Виральность)
    const tg = window.Telegram?.WebApp;
    if (tg) {
      tg.openTelegramLink('https://t.me/share/url?url=https://t.me/HelpyBot&text=Вступай в наше сообщество в Helpy!');
    } else {
      alert('Шеринг доступен только внутри Telegram');
    }
  };

  return (
    <div style={{ padding: '16px' }}>
      <h2>Клуб настольных игр </h2>
      <p style={{ color: 'var(--tg-theme-hint-color)' }}>
        Собираемся каждую пятницу в 19:00. Играем в Catan, D&D и Мафию.
      </p>

      <List style={{ marginTop: '24px' }}>
        <Cell multiline>
          <b>Участники:</b> 142 человека
        </Cell>
        <Cell multiline>
          <b>Следующая встреча:</b> 28 сентября, Аудитория 305
        </Cell>
      </List>

      <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Кнопка виральности */}
        <Button size="l" mode="filled" onClick={handleInvite}>
           Пригласить друга (Дает +10 баллов кармы)
        </Button>
        
        {/* Кнопка бронирования (Требование №6) */}
        <Button size="l" mode="outlined" onClick={() => alert('Открывается календарь бронирования')}>
          📅 Забронировать помещение
        </Button>
      </div>
    </div>
  );
}