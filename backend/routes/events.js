const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Получить все мероприятия
router.get('/', async (req, res) => {
  try {
    const { communityId } = req.query;
    let query = {};
    
    if (communityId) query.communityId = communityId;
    
    const events = await Event.find(query)
      .populate('communityId', 'name')
      .sort({ date: 1 });
      
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении мероприятий' });
  }
});

// Создать мероприятие
router.post('/', async (req, res) => {
  try {
    const { communityId, title, description, date, location, budgetRequested, partnerEvent, partnerName } = req.body;
    
    const newEvent = new Event({
      communityId,
      title,
      description,
      date,
      location,
      budgetRequested: budgetRequested || 0,
      partnerEvent: partnerEvent || false,
      partnerName: partnerName || ''
    });
    
    const savedEvent = await newEvent.save();
    res.status(201).json(savedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при создании мероприятия' });
  }
});

module.exports = router;