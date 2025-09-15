const HealthRecord = require("../models/healthRecord.model");
const mongoose = require("mongoose");

// Create new health record
exports.createRecord = async (req, res) => {
  try {
    // Accept both recordType and type for compatibility
    const {
      childId,
      recordType,
      type,
      date,
      description,
      disease,
      treatment,
      debt,
      doctor,
      hospital,
      cost,
      isPaid,
      notes,
    } = req.body;

    // Determine recordType from recordType or type field
    const finalRecordType = recordType || type;

    // Required field check
    if (!childId || !finalRecordType || !date || !description || !doctor) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Validate childId
    if (!mongoose.Types.ObjectId.isValid(childId)) {
      return res.status(400).json({ message: "Invalid childId format" });
    }

    const newRecord = new HealthRecord({
      childId,
      recordType: finalRecordType,
      date,
      description,
      disease,
      treatment,
      debt,
      doctor,
      hospital,
      cost,
      isPaid,
      notes,
    });

    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    console.error("Create health record error:", error);
    res.status(500).json({
      message: "Server error creating health record",
      error: error.message,
    });
  }
};

// Get all health records
exports.getAllRecords = async (req, res) => {
  try {
    const records = await HealthRecord.find().populate("childId");
    res.status(200).json(records);
  } catch (error) {
    console.error("Get health records error:", error);
    res.status(500).json({ message: "Server error fetching health records" });
  }
};

// Get health records by child ID
exports.getRecordsByChild = async (req, res) => {
  try {
    const { childId } = req.params;
    const records = await HealthRecord.find({ childId }).populate("childId");
    res.status(200).json(records);
  } catch (error) {
    console.error("Get health records by child error:", error);
    res.status(500).json({ message: "Server error fetching health records" });
  }
};

// Get health record by ID
exports.getRecordById = async (req, res) => {
  try {
    const record = await HealthRecord.findById(req.params.id).populate(
      "childId"
    );
    if (!record) {
      return res.status(404).json({ message: "Health record not found" });
    }
    res.status(200).json(record);
  } catch (error) {
    console.error("Get health record error:", error);
    res.status(500).json({ message: "Server error fetching health record" });
  }
};

// Update health record
exports.updateRecord = async (req, res) => {
  try {
    const updatedRecord = await HealthRecord.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedRecord) {
      return res.status(404).json({ message: "Health record not found" });
    }

    res.status(200).json(updatedRecord);
  } catch (error) {
    console.error("Update health record error:", error);
    res.status(500).json({ message: "Server error updating health record" });
  }
};

// Delete health record
exports.deleteRecord = async (req, res) => {
  try {
    const deletedRecord = await HealthRecord.findByIdAndDelete(req.params.id);

    if (!deletedRecord) {
      return res.status(404).json({ message: "Health record not found" });
    }

    res.status(200).json({ message: "Health record deleted successfully" });
  } catch (error) {
    console.error("Delete health record error:", error);
    res.status(500).json({ message: "Server error deleting health record" });
  }
};
