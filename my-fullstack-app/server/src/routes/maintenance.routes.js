const express = require('express');
const router = express.Router();
const maintenanceController = require('../controllers/maintenance.controller');
const { requireFields, validateEnum } = require('../middleware/validate');
const { PRIORITIES, MAINTENANCE_STATUSES } = require('../utils/constants');

router
  .route('/')
  .get(maintenanceController.getMaintenanceRecords)
  .post(
    requireFields(['asset', 'type']),
    validateEnum('priority', PRIORITIES),
    validateEnum('status', MAINTENANCE_STATUSES),
    maintenanceController.createMaintenanceRecord
  );

router.patch(
  '/:id/status',
  requireFields(['status']),
  validateEnum('status', MAINTENANCE_STATUSES),
  maintenanceController.updateMaintenanceStatus
);

module.exports = router;
