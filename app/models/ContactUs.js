const mongoose = require('mongoose');
const contactUsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false
  },
  subject: {
    type: String,
    required: false
  },
  message: {
    type: String,
    required: false
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});



const ContactUs = mongoose.model('ContactUs', contactUsSchema);

module.exports = ContactUs;