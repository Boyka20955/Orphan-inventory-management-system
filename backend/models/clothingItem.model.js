const mongoose = require("mongoose");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  type: {
    type: String,
    required: true,
    enum: [
      "shirt",
      "pants",
      "dress",
      "shoes",
      "underwear",
      "socks",
      "jacket",
      "sweater",
      "other",
    ],
  },
  size: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female", "unisex"],
  },
  ageGroup: {
    type: String,
    required: true,
    enum: [
      "infant",
      "toddler",
      "child",
      "teen",
      "adult",
      "1-4 years",
      "5-8 years",
      "9-12 years",
      "13-16 years",
      "17-20 years",
      "21-24 years",
      "25-30 years",
      "over 30 years",
    ],
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  condition: {
    type: String,
    enum: ["new", "good", "fair", "poor"],
    default: "good",
  },
  assignedTo: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Child",
    },
  ],
  notes: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const ClothingItem = mongoose.model("ClothingItem", clothingItemSchema);

module.exports = ClothingItem;
