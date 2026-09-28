const executiveService = require('../services/executive.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/response');

// GET /api/executive/summary
const getExecutiveSummary = asyncHandler(async (req, res) => {
  const summary = await executiveService.getExecutiveSummary();
  sendResponse(res, 200, 'Executive dashboard portfolio summary retrieved successfully', summary);
});

// GET /api/executive/projects
const getExecutiveProjects = asyncHandler(async (req, res) => {
  const projects = await executiveService.getExecutiveProjects(req.query);
  sendResponse(res, 200, 'Executive project inventory retrieved successfully', projects);
});

// GET /api/executive/attention
const getExecutiveAttentionProjects = asyncHandler(async (req, res) => {
  const attentionProjects = await executiveService.getExecutiveAttentionProjects();
  sendResponse(res, 200, 'Executive attention projects retrieved successfully', attentionProjects);
});

module.exports = {
  getExecutiveSummary,
  getExecutiveProjects,
  getExecutiveAttentionProjects
};
