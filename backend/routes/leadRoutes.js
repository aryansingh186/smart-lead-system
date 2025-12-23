const express = require('express');
const router = express.Router();
const leadController = require('../controllers/leadController');

router.post('/process', leadController.processBatch);
router.get('/leads', leadController.getAllLeads);
router.get('/stats', leadController.getStats);

module.exports = router;