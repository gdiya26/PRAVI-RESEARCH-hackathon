const express = require('express');
const router = express.Router();
const inspectionController = require('../controllers/inspection.controller');
const { requireFields, validateEnum } = require('../middleware/validate');
const { CONDITIONS } = require('../utils/constants');

router
  .route('/')
  .get(inspectionController.getInspections)
  .post(
    requireFields(['asset', 'condition']),
    validateEnum('condition', CONDITIONS),
    inspectionController.createInspection
  );

module.exports = router;
