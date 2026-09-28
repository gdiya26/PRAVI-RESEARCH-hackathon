const express = require('express');
const router = express.Router();
const assetController = require('../controllers/asset.controller');
const inspectionController = require('../controllers/inspection.controller');
const maintenanceController = require('../controllers/maintenance.controller');
const workOrderController = require('../controllers/workOrder.controller');
const { requireFields, validateEnum } = require('../middleware/validate');
const { CATEGORIES, CONDITIONS, LIFECYCLE_STAGES } = require('../utils/constants');

// Asset Collection
router
  .route('/')
  .get(assetController.getAssets)
  .post(
    requireFields(['assetId', 'category', 'type', 'name']),
    validateEnum('category', CATEGORIES),
    validateEnum('condition', CONDITIONS),
    validateEnum('lifecycleStage', LIFECYCLE_STAGES),
    assetController.createAsset
  );

// Single Asset Operations
router
  .route('/:id')
  .get(assetController.getAssetById)
  .put(assetController.updateAsset)
  .delete(assetController.deleteAsset);

// Digital Asset Passport
router.get('/:id/passport', assetController.getAssetPassport);

// Lifecycle Management
router
  .route('/:id/lifecycle')
  .get(assetController.getAssetLifecycle)
  .post(
    requireFields(['targetStage']),
    validateEnum('targetStage', LIFECYCLE_STAGES),
    assetController.advanceAssetLifecycle
  );

// Sub-resource convenience endpoints
router
  .route('/:id/inspections')
  .get((req, res, next) => {
    req.query.assetId = req.params.id;
    inspectionController.getInspections(req, res, next);
  })
  .post((req, res, next) => {
    req.body.asset = req.params.id;
    inspectionController.createInspection(req, res, next);
  });

router
  .route('/:id/maintenance')
  .get((req, res, next) => {
    req.query.assetId = req.params.id;
    maintenanceController.getMaintenanceRecords(req, res, next);
  })
  .post((req, res, next) => {
    req.body.asset = req.params.id;
    maintenanceController.createMaintenanceRecord(req, res, next);
  });

router
  .route('/:id/work-orders')
  .get((req, res, next) => {
    req.query.assetId = req.params.id;
    workOrderController.getWorkOrders(req, res, next);
  })
  .post((req, res, next) => {
    req.body.asset = req.params.id;
    workOrderController.createWorkOrder(req, res, next);
  });

module.exports = router;
