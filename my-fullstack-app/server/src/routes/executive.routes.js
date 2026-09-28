const express = require('express');
const router = express.Router();
const executiveController = require('../controllers/executive.controller');

// Executive Dashboard Endpoints
router.get('/summary', executiveController.getExecutiveSummary);
router.get('/projects', executiveController.getExecutiveProjects);
router.get('/attention', executiveController.getExecutiveAttentionProjects);

module.exports = router;
