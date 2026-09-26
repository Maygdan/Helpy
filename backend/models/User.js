const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true }, // Для авторизации через Telegram Mini App
  username: { type: String },
  fullName: { type: String, required: true },
  email: { type: String, required: true }, // Для верификации по корпоративному домену
  isVerified: { type: Boolean, default: false }, // Статус верификации (152-ФЗ: собираем только с согласия)
  
  role: { 
    type: String, 
    enum: ['newbie', 'experienced', 'organizer', 'admin'], 
    default: 'newbie' 
  },
  
  // Механика виральности (п.7)
  referralCode: { type: String, unique: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  referralCount: { type: Number, default: 0 },

  // Связи
  communities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }],
  
  // Согласие на обработку ПД (152-ФЗ)
  pdConsent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);