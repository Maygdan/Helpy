const express = require('express');
const router = express.Router();
const Community = require('../models/Community');
const User = require('../models/User');
const Event = require('../models/Event');

// Получить статистику для дашборда
router.get('/stats', async (req, res) => {
  try {
    const totalCommunities = await Community.countDocuments({ status: 'active' });
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    
    const inactiveCommunities = await Community.find({
      status: 'active',
      lastActiveAt: { $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    }).populate('adminId', 'fullName');
    
    res.json({
      totalCommunities,
      totalUsers,
      totalEvents,
      inactiveCommunities
    });
  } catch (error) {
    res.status(500).json({ error: 'Ошибка при получении статистики' });
  }
});

module.exports = router;