const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const tokenSchema = new mongoose.Schema({
  token: {
    type: String,
    required: false
  },
  from: {
    type: String,
    required: false
  },
  userId: {
    type: String,
    required: false
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});



const Token = mongoose.model('Token', tokenSchema);

module.exports = Token;