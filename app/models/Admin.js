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
  phone: {
    type: String,
    required: false
  },
  password: {
    type: String,
    required: false,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


adminSchema.pre('save', async function(next) {
  try {
    if (!this.isModified('password')) {
      return next(); // If password is not modified, move to the next middleware
    }
    
    const hashedPassword = await bcrypt.hash(this.password, 10); // Hash the password
    this.password = hashedPassword; // Store hashed password
    next();
  } catch (error) {
    next(error);
  }
});

adminSchema.methods.isValidPassword = async function (password) {
  console.log('password=>',password, this.password)
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    console.log(err)
    // throw new Error(err);
  }
};


const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;
