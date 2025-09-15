
const mongoose = require('mongoose');

const sponsorshipSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Child',
    required: true
  },
  sponsor: {
    name: {
      type: String,
      required: true
    },
    email: String,
    phone: String,
    address: String
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: Date,
  amount: {
    type: Number,
    required: true
  },
  frequency: {
    type: String,
    enum: ['one-time', 'monthly', 'quarterly', 'annually'],
    default: 'monthly'
  },
  currency: {
    type: String,
    default: 'USD'
  },
  paymentMethod: String,
  status: {
    type: String,
    enum: ['active', 'suspended', 'completed', 'cancelled'],
    default: 'active'
  },
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Sponsorship = mongoose.model('Sponsorship', sponsorshipSchema);

module.exports = Sponsorship;
