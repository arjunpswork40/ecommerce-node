const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const adminSchema = new mongoose.Schema({
  user_name: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false,
    unique: true
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

adminSchema.methods.isValidPassword = async function (password) {
  console.log(password, this.password)
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    console.log(err)
    // throw new Error(err);
  }
};


const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
