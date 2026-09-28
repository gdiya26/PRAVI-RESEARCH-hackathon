const express = require('express');
const router = express.Router();

const assetRoutes = require('./asset.routes');
const inspectionRoutes = require('./inspection.routes');
const maintenanceRoutes = require('./maintenance.routes');
const workOrderRoutes = require('./workOrder.routes');
const dashboardRoutes = require('./dashboard.routes');
const analyticsRoutes = require('./analytics.routes');
const assetController = require('../controllers/asset.controller');

router.use('/assets', assetRoutes);
router.use('/inspections', inspectionRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/work-orders', workOrderRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/analytics', analyticsRoutes);

// Direct traffic-assets endpoint
router.get('/traffic-assets', assetController.getTrafficAssets);

// Root API discovery endpoint
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Government Road & Infrastructure Asset Lifecycle Management API is online',
    data: {
      version: '1.0.0',
      description: 'Digital Asset Passport & Lifecycle Management MVP',
      endpoints: {
        dashboardStats: '/api/dashboard/stats',
        assets: '/api/assets',
        samplePassport: '/api/assets/RD-AHM-001/passport',
        inspections: '/api/inspections',
        maintenance: '/api/maintenance',
        workOrders: '/api/work-orders',
        analyticsConditions: '/api/analytics/conditions',
        analyticsLifecycle: '/api/analytics/lifecycle',
        trafficAssets: '/api/traffic-assets',
        health: '/health'
      }
    }
  });
});

module.exports = router;
