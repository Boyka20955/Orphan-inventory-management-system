
const express = require('express');
const router = express.Router();
const childController = require('../controllers/child.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Child routes
router.get('/', authMiddleware.verifyToken, childController.getAllChildren);
router.get('/:id', authMiddleware.verifyToken, childController.getChildById);
router.post('/', authMiddleware.verifyToken, childController.createChild);
router.put('/:id', authMiddleware.verifyToken, childController.updateChild);
router.delete('/:id', authMiddleware.verifyToken, childController.deleteChild);

module.exports = router;
