const mongoose = require("mongoose");

const healthRecordSchema = new mongoose.Schema({
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Child",
    required: true,
  },
  recordType: {
    type: String,
    enum: [
      "checkup",
      "vaccination",
      "illness",
      "treatment",
      "surgery",
      "other",
    ],
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  doctor: String,
  hospital: String,
  cost: Number,
  isPaid: {
    type: Boolean,
    default: false,
  },
  notes: String,
  medications: [String],
  nextAppointment: Date,
  attachments: [String],
  disease: String, // Added disease property
  treatment: String, // Added treatment property
  debt: {
    type: Number,
    default: 0, // Default value for debt
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const HealthRecord = mongoose.model("HealthRecord", healthRecordSchema);

module.exports = HealthRecord;
