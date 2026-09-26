const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
  username: { type: String },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  
  role: { 
    type: String, 
    enum: ['newbie', 'experienced', 'organizer', 'admin'], 
    default: 'newbie' 
  },
  
  referralCode: { type: String, unique: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  referralCount: { type: Number, default: 0 },

  communities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }],
  
  pdConsent: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);