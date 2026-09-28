const mongoose = require('mongoose');
const MaintenanceRecord = require('../models/MaintenanceRecord');
const Asset = require('../models/Asset');
const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/response');
const ApiError = require('../utils/ApiError');
const { MAINTENANCE_STATUSES } = require('../utils/constants');

// GET /api/maintenance (global list populated with asset name/ID/category)
const getMaintenanceRecords = asyncHandler(async (req, res) => {
  const { assetId, status, priority } = req.query;
  const filter = {};

  if (status) filter.status = status.toUpperCase();
  if (priority) filter.priority = priority.toUpperCase();

  if (assetId) {
    if (mongoose.Types.ObjectId.isValid(assetId)) {
      filter.asset = assetId;
    } else {
      const assetDoc = await Asset.findOne({ assetId });
      if (assetDoc) {
        filter.asset = assetDoc._id;
      } else {
        return sendResponse(res, 200, 'Maintenance records retrieved', []);
      }
    }
  }

  const records = await MaintenanceRecord.find(filter)
    .populate('asset', 'name assetId category condition healthScore lifecycleStage')
    .sort({ createdAt: -1 });

  sendResponse(res, 200, 'Maintenance records retrieved successfully', records);
});

// POST /api/maintenance
const createMaintenanceRecord = asyncHandler(async (req, res) => {
  const { asset: assetIdentifier, type, description, cost, priority, status, contractor, remarks } = req.body;

  if (!assetIdentifier) {
    throw new ApiError(400, 'Asset ID or ObjectId is required');
  }

  let asset = null;
  if (mongoose.Types.ObjectId.isValid(assetIdentifier)) {
    asset = await Asset.findById(assetIdentifier);
  }
  if (!asset) {
    asset = await Asset.findOne({ assetId: assetIdentifier });
  }

  if (!asset) {
    throw new ApiError(404, `Target asset not found for identifier '${assetIdentifier}'`);
  }

  const record = await MaintenanceRecord.create({
    asset: asset._id,
    type: type || 'Corrective Maintenance',
    description: description || '',
    cost: cost || 0,
    priority: priority || 'MEDIUM',
    status: status || 'RECOMMENDED',
    contractor: contractor || '',
    remarks: remarks || ''
  });

  await record.populate('asset', 'name assetId category condition healthScore lifecycleStage');

  sendResponse(res, 201, 'Maintenance record created successfully', record);
});

// PATCH /api/maintenance/:id/status
const updateMaintenanceStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !MAINTENANCE_STATUSES.includes(status)) {
    throw new ApiError(
      400,
      `Invalid or missing status. Allowed: ${MAINTENANCE_STATUSES.join(', ')}`
    );
  }

  const record = await MaintenanceRecord.findById(id);
  if (!record) {
    throw new ApiError(404, `Maintenance record not found with id '${id}'`);
  }

  record.status = status;
  if (status === 'IN_PROGRESS' && !record.startDate) {
    record.startDate = new Date();
  }
  if (['COMPLETED', 'VERIFIED'].includes(status) && !record.completionDate) {
    record.completionDate = new Date();
  }

  await record.save();
  await record.populate('asset', 'name assetId category condition healthScore lifecycleStage');

  sendResponse(res, 200, `Maintenance record status updated to '${status}'`, record);
});

module.exports = {
  getMaintenanceRecords,
  createMaintenanceRecord,
  updateMaintenanceStatus
};
