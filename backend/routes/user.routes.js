
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');

// User routes
router.get('/', authMiddleware.verifyToken, authMiddleware.adminOnly, userController.getAllUsers);
router.get('/:id', authMiddleware.verifyToken, userController.getUserById);
router.put('/:id', authMiddleware.verifyToken, userController.updateUser);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.adminOnly, userController.deleteUser);

module.exports = router;
