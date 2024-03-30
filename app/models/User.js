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
  verified: {
    type: Boolean,
    required: true,
    default: false
  },
  delivery_addresses: [deliveryAddressSchema],
  cart_products: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: false
  },
  wish_list_products: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: false
  },
  order_details: [orderDetailSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.methods.isValidPassword = async function (password) {
  console.log(password, this.password)
  try {
    return await bcrypt.compare(password, this.password);
  } catch (err) {
    console.log(err)
    // throw new Error(err);
  }
};


const User = mongoose.model('User', userSchema);

module.exports = User;
