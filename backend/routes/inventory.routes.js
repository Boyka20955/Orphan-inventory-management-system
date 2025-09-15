
const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventory.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Food inventory routes
router.get('/food', authMiddleware.verifyToken, inventoryController.getAllFoodItems);
router.get('/food/:id', authMiddleware.verifyToken, inventoryController.getFoodItemById);
router.post('/food', authMiddleware.verifyToken, inventoryController.createFoodItem);
router.put('/food/:id', authMiddleware.verifyToken, inventoryController.updateFoodItem);
router.delete('/food/:id', authMiddleware.verifyToken, inventoryController.deleteFoodItem);

// Clothing inventory routes
router.get('/clothing', authMiddleware.verifyToken, inventoryController.getAllClothingItems);
router.get('/clothing/:id', authMiddleware.verifyToken, inventoryController.getClothingItemById);
router.post('/clothing', authMiddleware.verifyToken, inventoryController.createClothingItem);
router.put('/clothing/:id', authMiddleware.verifyToken, inventoryController.updateClothingItem);
router.delete('/clothing/:id', authMiddleware.verifyToken, inventoryController.deleteClothingItem);

module.exports = router;
