const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analytics.controller');

router.get('/conditions', analyticsController.getConditionAnalytics);
router.get('/lifecycle', analyticsController.getLifecycleAnalytics);

module.exports = router;
