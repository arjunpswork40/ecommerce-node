const mongoose = require('mongoose');
const bcrypt = require('bcrypt')
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  mobileNumber: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: false,
    unique: true
  },
  password: {
    type: String,
    required: false
  },
  roles: [{
    type: String,
    enum: ['super-admin', 'admin'],
    default: ['admin']
  }],
  resetPasswordToken: {
    type: String,
    required: false,
    // unique: true,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
    required: false,
    // unique: false
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.methods.isValidPassword = async function (password) {
  console.log(password, this.password)
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    // console.log(err)
    // throw new Error(err);
  }
};


const User = mongoose.model('User', userSchema);

module.exports = User;
