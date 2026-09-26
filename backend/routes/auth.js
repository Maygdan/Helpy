const express = require('express');
const router = express.Router();
const User = require('../models/User');
const crypto = require('crypto');

// Регистрация / Вход через Telegram Mini App
router.post('/register', async (req, res) => {
  try {
    const { telegramId, username, fullName, email, referralCode } = req.body;

    const isVerified = email.endsWith('@uni.ru') || email.endsWith('@company.com');

    let user = await User.findOne({ telegramId });

    if (user) {
      return res.json({ message: 'Пользователь уже существует', user });
    }

    const newReferralCode = crypto.randomBytes(4).toString('hex');

    user = new User({
      telegramId,
      username,
      fullName,
      email,
      isVerified,
      referralCode: newReferralCode,
      pdConsent: true
    });

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

// Получить профиль пользователя
router.get('/profile/:telegramId', async (req, res) => {
  try {
    const user = await User.findOne({ telegramId: req.params.telegramId })
      .populate('communities');
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении профиля' });
  }
});

module.exports = router;