const mongoose = require('mongoose');
const offerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  deduction_percentage: {
    type: String,
    required: false
  },
  
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});



const Offer = mongoose.model('Offer', offerSchema);

module.exports = Offer;