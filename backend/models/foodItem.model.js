
const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['grains', 'proteins', 'dairy', 'fruits', 'vegetables', 'snacks', 'beverages', 'other']
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true
  },
  expirationDate: {
    type: Date
  },
  supplier: String,
  batchNumber: String,
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const FoodItem = mongoose.model('FoodItem', foodItemSchema);

module.exports = FoodItem;
