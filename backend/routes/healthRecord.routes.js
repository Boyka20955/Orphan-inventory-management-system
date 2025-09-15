
const express = require('express');
const router = express.Router();
const healthRecordController = require('../controllers/healthRecord.controller');
const authMiddleware = require('../middleware/auth.middleware');

// Health record routes
router.get('/', authMiddleware.verifyToken, healthRecordController.getAllRecords);
router.get('/child/:childId', authMiddleware.verifyToken, healthRecordController.getRecordsByChild);
router.get('/:id', authMiddleware.verifyToken, healthRecordController.getRecordById);
router.post('/', authMiddleware.verifyToken, healthRecordController.createRecord);
router.put('/:id', authMiddleware.verifyToken, healthRecordController.updateRecord);
router.delete('/:id', authMiddleware.verifyToken, healthRecordController.deleteRecord);

module.exports = router;
