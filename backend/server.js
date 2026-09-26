require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('./middleware/cors');

const app = express();

// Middleware
app.use(cors);
app.use(express.json());

// Подключение к БД
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB подключен к базе Helpy'))
  .catch(err => console.error('❌ Ошибка MongoDB:', err));

// Роуты
app.use('/api/auth', require('./routes/auth'));
app.use('/api/communities', require('./routes/communities'));
app.use('/api/events', require('./routes/events'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Health check
app.get('/', (req, res) => {
  res.json({ message: ' Helpy API is running!', status: 'healthy', timestamp: new Date() });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер Helpy запущен на порту ${PORT}`);
});

require('./bot'); // Запуск бота вместе с сервером