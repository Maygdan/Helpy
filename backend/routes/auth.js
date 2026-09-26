const express = require('express');
const router = express.Router();
const User = require('../models/User');
const crypto = require('crypto');

// Регистрация / Вход через Telegram Mini App
router.post('/register', async (req, res) => {
  try {
    const { telegramId, username, fullName, email, referralCode } = req.body;

    // Простая проверка корпоративного домена для верификации (пример для кейса)
    const isVerified = email.endsWith('@company.com') || email.endsWith('@uni.ru');

    let user = await User.findOne({ telegramId });

    if (user) {
      return res.json({ message: 'Пользователь уже существует', user });
    }

    // Генерация уникального реферального кода для нового пользователя
    const newReferralCode = crypto.randomBytes(4).toString('hex');

    user = new User({
      telegramId,
      username,
      fullName,
      email,
      isVerified,
      referralCode: newReferralCode,
      pdConsent: true // В реальном приложении это приходит с галочки в UI
    });

    // Если был реферальный код, находим того, кто пригласил, и увеличиваем счётчик
    if (referralCode) {
      const referrer = await User.findOne({ referralCode });
      if (referrer) {
        user.referredBy = referrer._id;
        referrer.referralCount += 1;
        await referrer.save();
      }
    }

    await user.save();
    res.status(201).json({ message: 'Успешная регистрация', user });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка сервера при регистрации' });
  }
});

module.exports = router;