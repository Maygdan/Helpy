const express = require('express');
const router = express.Router();
const Community = require('../models/Community');

// Получить все сообщества с фильтрацией по тегам (Требование №3)
router.get('/', async (req, res) => {
  try {
    const { tag, search } = req.query;
    let query = { status: 'active' };

    if (tag) query.tags = tag;
    if (search) query.$text = { $search: search };

    const communities = await Community.find(query)
      .populate('adminId', 'fullName username')
      .sort({ createdAt: -1 });
      
    res.json(communities);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении сообществ' });
  }
});

// Создать новое сообщество (Требование №2: макс 3-4 шага, данные приходят одним объектом)
router.post('/', async (req, res) => {
  try {
    const { name, description, tags, accessType, adminId } = req.body;

    const newCommunity = new Community({
      name,
      description,
      tags: tags.split(',').map(t => t.trim()), // Превращаем строку "спорт, код" в массив
      accessType,
      adminId,
      stats: { totalMembers: 1 } // Админ сразу становится первым участником
    });

    const savedCommunity = await newCommunity.save();
    
    // Добавляем сообщество в список админа
    const User = require('../models/User');
    await User.findByIdAndUpdate(adminId, { $push: { communities: savedCommunity._id } });

    res.status(201).json(savedCommunity);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании сообщества' });
  }
});

module.exports = router;