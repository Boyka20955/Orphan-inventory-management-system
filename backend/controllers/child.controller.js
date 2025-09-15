
const Child = require('../models/child.model');

// Get all children
exports.getAllChildren = async (req, res) => {
  try {
    const children = await Child.find();
    res.status(200).json(children);
  } catch (error) {
    console.error('Get children error:', error);
    res.status(500).json({ message: 'Server error fetching children' });
  }
};

// Get child by ID
exports.getChildById = async (req, res) => {
  try {
    const child = await Child.findById(req.params.id);
    if (!child) {
      return res.status(404).json({ message: 'Child not found' });
    }
    res.status(200).json(child);
  } catch (error) {
    console.error('Get child error:', error);
    res.status(500).json({ message: 'Server error fetching child' });
  }
};

// Create new child
exports.createChild = async (req, res) => {
  try {
    const newChild = new Child(req.body);
    await newChild.save();
    res.status(201).json(newChild);
  } catch (error) {
    console.error('Create child error:', error);
    res.status(500).json({ message: 'Server error creating child' });
  }
};

// Update child
exports.updateChild = async (req, res) => {
  try {
    const updatedChild = await Child.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!updatedChild) {
      return res.status(404).json({ message: 'Child not found' });
    }
    
    res.status(200).json(updatedChild);
  } catch (error) {
    console.error('Update child error:', error);
    res.status(500).json({ message: 'Server error updating child' });
  }
};

// Delete child
exports.deleteChild = async (req, res) => {
  try {
    const deletedChild = await Child.findByIdAndDelete(req.params.id);
    
    if (!deletedChild) {
      return res.status(404).json({ message: 'Child not found' });
    }
    
    res.status(200).json({ message: 'Child deleted successfully' });
  } catch (error) {
    console.error('Delete child error:', error);
    res.status(500).json({ message: 'Server error deleting child' });
  }
};
