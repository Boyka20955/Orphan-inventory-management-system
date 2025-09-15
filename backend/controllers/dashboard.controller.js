const Child = require("../models/child.model");
const HealthRecord = require("../models/healthRecord.model");
const ClothingItem = require("../models/clothingItem.model");
const FoodItem = require("../models/foodItem.model");
const Donation = require("../models/donation.model");

exports.getDashboardStatistics = async (req, res) => {
  try {
    const totalChildren = await Child.countDocuments();
    const scheduledCheckups = await HealthRecord.countDocuments({
      status: "scheduled",
    });
    const totalClothingItems = await ClothingItem.countDocuments();
    const totalFoodItems = await FoodItem.countDocuments();
    const totalDonations = await Donation.aggregate([
      {
        $match: {
          date: {
            $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
          },
        },
      },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const recentActivities = [
      // This can be populated with actual recent activities from the database
    ];

    res.status(200).json({
      totalChildren,
      scheduledCheckups,
      totalClothingItems,
      totalFoodItems,
      totalDonations: totalDonations[0] ? totalDonations[0].total : 0,
      recentActivities,
    });
  } catch (error) {
    console.error("Error fetching dashboard statistics:", error);
    res
      .status(500)
      .json({ message: "Server error fetching dashboard statistics" });
  }
};
