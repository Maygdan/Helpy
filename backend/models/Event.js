const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
  title: { type: String, required: true },
  description: { type: String },
  
  date: { type: Date, required: true },
  location: { type: String, required: true }, // Название переговорки/аудитории
  
  // Бюджетирование (п.6)
  budgetRequested: { type: Number, default: 0 },
  budgetApproved: { type: Number, default: 0 },
  budgetStatus: { 
    type: String, 
    enum: ['none', 'pending', 'approved', 'rejected'], 
    default: 'none' 
  },
  
  status: { 
    type: String, 
    enum: ['planned', 'completed', 'cancelled'], 
    default: 'planned' 
  }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);