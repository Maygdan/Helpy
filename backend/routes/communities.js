const express = require('express');
const router = express.Router();
const Community = require('../models/Community');
const User = require('../models/User');

// Получить все сообщества с фильтрацией
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

// Создать новое сообщество
router.post('/', async (req, res) => {
  try {
    const { name, description, tags, accessType, adminId, budgetRequested, roomBooked } = req.body;

    const newCommunity = new Community({
      name,
      description,
      tags: tags.split(',').map(t => t.trim()),
      accessType,
      adminId,
      budgetRequested: budgetRequested || 0,
      roomBooked: roomBooked || '',
      stats: { totalMembers: 1 }
    });

    const savedCommunity = await newCommunity.save();
    
    await User.findByIdAndUpdate(adminId, { 
      $push: { communities: savedCommunity._id } 
    });

    res.status(201).json(savedCommunity);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании сообщества' });
  }
});

// Получить одно сообщество по ID
router.get('/:id', async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate('adminId', 'fullName username')
      .populate('members', 'fullName username');
    
    if (!community) {
      return res.status(404).json({ error: 'Сообщество не найдено' });
    }
    
    res.json(community);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении сообщества' });
  }
});

// Вступить в сообщество
router.post('/:id/join', async (req, res) => {
  try {
    const { userId } = req.body;
    const community = await Community.findById(req.params.id);
    
    if (!community.members.includes(userId)) {
      community.members.push(userId);
      community.stats.totalMembers += 1;
      community.lastActiveAt = Date.now();
      await community.save();
      
      await User.findByIdAndUpdate(userId, { 
        $push: { communities: community._id } 
      });
    }
    
    res.json({ message: 'Вы вступили в сообщество', community });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при вступлении' });
  }
});

// Архивировать сообщество (для HR/админов)
router.post('/:id/archive', async (req, res) => {
  try {
    const community = await Community.findByIdAndUpdate(
      req.params.id,
      { status: 'archived' },
      { new: true }
    );
    res.json({ message: 'Сообщество архивировано', community });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при архивации' });
  }
});

module.exports = router;