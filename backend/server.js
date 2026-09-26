require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Подключение к БД
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB подключен к базе Helpy'))
  .catch(err => console.error('❌ Ошибка MongoDB:', err));

// Роуты
app.use('/api/auth', require('./routes/auth'));
app.use('/api/communities', require('./routes/communities'));

// Тестовый роут
app.get('/', (req, res) => {
  res.json({ message: '🚀 Helpy API is running!', status: 'healthy' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Сервер Helpy запущен на порту ${PORT}`);
});