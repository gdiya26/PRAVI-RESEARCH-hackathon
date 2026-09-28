const dashboardService = require('../services/dashboard.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/response');

// GET /api/dashboard/stats
const getStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getStats();
  sendResponse(res, 200, 'Dashboard statistics retrieved successfully', stats);
});

module.exports = {
  getStats
};
