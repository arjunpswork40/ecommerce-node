const mongoose = require('mongoose');

const priceByMLSchema = new mongoose.Schema({
    ml: {
        type: Number,
        required: false
    },
    price: {
        type: Number,
        required: false
    }
})

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: false
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    review: {
        type: String,
        required: false
    }
})

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false
  },
  tag_line: {
    type: String,
    required: false
  },
  description: {
    type: String,
    required: false
  },
  price_by_ml:[priceByMLSchema],
  category_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  }],
  related_item_ids: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product'
  }],
  rating: {
    type: Number,
    required: false,
    default: 0
  },
  tags:[{
    type: String,
    required: false
  }],
  fragrance: {
    type: String,
    required: false
  },
  bottle_color: {
    type: String,
    required: false
  },
  items_in_the_box: [{
    type: String,
    required: false
  }],
  review: [reviewSchema],
  offer_deduction_percentage: {
    type: Number,
    required: false,
    default: 0
  },
  offers: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Offer',
        required: false
    }
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});



const Product = mongoose.model('Product', productSchema);

module.exports = Product;