
const mongoose = require('mongoose');

const childSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  entryDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  medicalConditions: [String],
  educationLevel: String,
  guardianName: String,
  guardianContact: String,
  background: String,
  photo: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Child = mongoose.model('Child', childSchema);

module.exports = Child;
