const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const deliveryAddressSchema = new mongoose.Schema({
  name:{
    type: String,
    required: true
  },
  address_line_1:{
    type: String,
    required: true
  },
  address_line_2:{
    type: String,
    required: true
  },
  postal_code:{
    type: String,
    required: true
  },
  land_mark:{
    type: String,
    required: true
  },
  phone:{
    type: String,
    required: true
  },
})

const orderDetailSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Product',
    required: true
  },
  payment_id: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status:{
    type:String,
    default:'pending'
  }
})

const cartSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
})

const wishListSchema = new mongoose.Schema({
  product_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true
  }
})

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: false
  },
  last_name: {
    type: String,
    required: false
  },
  mobileNumber: {
    type: String,
    required: false,
    unique: true  
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
  verified: {
    type: Boolean,
    required: true,
    default: false
  },
  delivery_addresses: [deliveryAddressSchema],
  cart_products:[cartSchema],
  wish_list_products: [wishListSchema],
  order_details: [orderDetailSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre('save', async function(next) {
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

userSchema.methods.isValidPassword = async function (password) {
  console.log('password=>',password, this.password)
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    console.log(err)
    // throw new Error(err);
  }
};


const User = mongoose.model('User', userSchema);

module.exports = User;
