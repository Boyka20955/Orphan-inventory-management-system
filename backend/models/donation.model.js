const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ["monetary", "food", "clothing", "supplies", "other"],
  },
  amount: {
    type: Number,
    required: function () {
      return this.type === "monetary";
    },
  },
  currency: {
    type: String,
    default: "USD",
  },
  items: [
    {
      name: String,
      quantity: Number,
      value: Number,
    },
  ],
  donor: {
    donorType: {
      type: String,
      enum: ["person", "organization"],
      default: "person",
    },
    firstName: String,
    lastName: String,
    organizationName: String,
    name: {
      type: String,
      required: true,
    },
    email: String,
    phone: String,
    address: String,
    isAnonymous: {
      type: Boolean,
      default: false,
    },
  },

  donationDate: {
    type: Date,
    default: Date.now,
  },
  paymentMethod: String,
  transactionId: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Donation = mongoose.model("Donation", donationSchema);

module.exports = Donation;
