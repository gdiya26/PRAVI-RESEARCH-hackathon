const express = require('express');
const router = express.Router();
const workOrderController = require('../controllers/workOrder.controller');
const { requireFields, validateEnum } = require('../middleware/validate');
const { PRIORITIES, WORK_ORDER_STATUSES } = require('../utils/constants');

router
  .route('/')
  .get(workOrderController.getWorkOrders)
  .post(
    requireFields(['asset', 'issue']),
    validateEnum('priority', PRIORITIES),
    validateEnum('status', WORK_ORDER_STATUSES),
    workOrderController.createWorkOrder
  );

router.patch(
  '/:id/status',
  requireFields(['status']),
  validateEnum('status', WORK_ORDER_STATUSES),
  workOrderController.updateWorkOrderStatus
);

module.exports = router;
