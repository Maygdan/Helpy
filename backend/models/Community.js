const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, maxlength: 500 },
  tags: [{ type: String, trim: true }], // Для фильтрации и поиска (п.3)
  
  accessType: { 
    type: String, 
    enum: ['public', 'private'], 
    default: 'public' 
  },
  
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // Жизненный цикл (п.5)
  status: { 
    type: String, 
    enum: ['active', 'archived', 'pending'], 
    default: 'active' 
  },
  lastActiveAt: { type: Date, default: Date.now }, // Для автоматической архивации неактивных
  
  // Статистика для дашборда организатора
  stats: {
    totalEvents: { type: Number, default: 0 },
    totalMembers: { type: Number, default: 0 }
  }
}, { timestamps: true });

// Индекс для быстрого поиска по тегам и названию
communitySchema.index({ name: 'text', tags: 'text' });

module.exports = mongoose.model('Community', communitySchema);