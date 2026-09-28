const dashboardService = require('../services/dashboard.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/response');

// GET /api/analytics/conditions
const getConditionAnalytics = asyncHandler(async (req, res) => {
  const analytics = await dashboardService.getConditionAnalytics();
  sendResponse(res, 200, 'Condition analytics retrieved successfully', analytics);
});

// GET /api/analytics/lifecycle
const getLifecycleAnalytics = asyncHandler(async (req, res) => {
  const analytics = await dashboardService.getLifecycleAnalytics();
  sendResponse(res, 200, 'Lifecycle analytics retrieved successfully', analytics);
});

module.exports = {
  getConditionAnalytics,
  getLifecycleAnalytics
};
