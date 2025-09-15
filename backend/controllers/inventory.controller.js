const FoodItem = require("../models/foodItem.model");
const ClothingItem = require("../models/clothingItem.model");

// Food inventory controllers
exports.getAllFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find();
    res.status(200).json(foodItems);
  } catch (error) {
    console.error("Get food items error:", error);
    res.status(500).json({ message: "Server error fetching food items" });
  }
};

exports.getFoodItemById = async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }
    res.status(200).json(foodItem);
  } catch (error) {
    console.error("Get food item error:", error);
    res.status(500).json({ message: "Server error fetching food item" });
  }
};

exports.createFoodItem = async (req, res) => {
  try {
    const newFoodItem = new FoodItem(req.body);
    await newFoodItem.save();
    res.status(201).json(newFoodItem);
  } catch (error) {
    console.error("Create food item error:", error);
    res.status(500).json({ message: "Server error creating food item" });
  }
};

exports.updateFoodItem = async (req, res) => {
  try {
    const updatedFoodItem = await FoodItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedFoodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.status(200).json(updatedFoodItem);
  } catch (error) {
    console.error("Update food item error:", error);
    res.status(500).json({ message: "Server error updating food item" });
  }
};

exports.deleteFoodItem = async (req, res) => {
  try {
    const deletedFoodItem = await FoodItem.findByIdAndDelete(req.params.id);

    if (!deletedFoodItem) {
      return res.status(404).json({ message: "Food item not found" });
    }

    res.status(200).json({ message: "Food item deleted successfully" });
  } catch (error) {
    console.error("Delete food item error:", error);
    res.status(500).json({ message: "Server error deleting food item" });
  }
};

// Clothing inventory controllers
exports.getAllClothingItems = async (req, res) => {
  try {
    const clothingItems = await ClothingItem.find().populate("assignedTo");
    res.status(200).json(clothingItems);
  } catch (error) {
    console.error("Get clothing items error:", error);
    res.status(500).json({ message: "Server error fetching clothing items" });
  }
};

exports.getClothingItemById = async (req, res) => {
  try {
    const clothingItem = await ClothingItem.findById(req.params.id).populate(
      "assignedTo"
    );
    if (!clothingItem) {
      return res.status(404).json({ message: "Clothing item not found" });
    }
    res.status(200).json(clothingItem);
  } catch (error) {
    console.error("Get clothing item error:", error);
    res.status(500).json({ message: "Server error fetching clothing item" });
  }
};

exports.createClothingItem = async (req, res) => {
  try {
    console.log("Incoming request body for creating clothing item:", req.body);
    const newClothingItem = new ClothingItem(req.body);
    await newClothingItem.save();
    res.status(201).json(newClothingItem);
  } catch (error) {
    console.error("Create clothing item error:", error);
    res.status(500).json({ message: "Server error creating clothing item" });
  }
};

exports.updateClothingItem = async (req, res) => {
  try {
    console.log("Incoming request body for updating clothing item:", req.body);
    const updatedClothingItem = await ClothingItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("assignedTo");

    if (!updatedClothingItem) {
      return res.status(404).json({ message: "Clothing item not found" });
    }

    res.status(200).json(updatedClothingItem);
  } catch (error) {
    console.error("Update clothing item error:", error);
    res.status(500).json({ message: "Server error updating clothing item" });
  }
};

exports.deleteClothingItem = async (req, res) => {
  try {
    const deletedClothingItem = await ClothingItem.findByIdAndDelete(
      req.params.id
    );

    if (!deletedClothingItem) {
      return res.status(404).json({ message: "Clothing item not found" });
    }

    res.status(200).json({ message: "Clothing item deleted successfully" });
  } catch (error) {
    console.error("Delete clothing item error:", error);
    res.status(500).json({ message: "Server error deleting clothing item" });
  }
};
