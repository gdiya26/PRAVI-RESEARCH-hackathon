const mongoose = require('mongoose');
const Inspection = require('../models/Inspection');
const Asset = require('../models/Asset');
const workflowService = require('../services/workflow.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/response');
const ApiError = require('../utils/ApiError');

// GET /api/inspections (global list populated with asset name/ID/category)
const getInspections = asyncHandler(async (req, res) => {
  const { assetId } = req.query;
  const filter = {};

  if (assetId) {
    if (mongoose.Types.ObjectId.isValid(assetId)) {
      filter.asset = assetId;
    } else {
      const assetDoc = await Asset.findOne({ assetId });
      if (assetDoc) {
        filter.asset = assetDoc._id;
      } else {
        return sendResponse(res, 200, 'Inspections retrieved', []);
      }
    }
  }

  const inspections = await Inspection.find(filter)
    .populate('asset', 'name assetId category condition healthScore lifecycleStage')
    .sort({ date: -1 });

  sendResponse(res, 200, 'Inspections retrieved successfully', inspections);
});

// POST /api/inspections
const createInspection = asyncHandler(async (req, res) => {
  const { asset: assetIdentifier, inspector, condition, defects, remarks, date } = req.body;

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

  const inspection = await Inspection.create({
    asset: asset._id,
    inspector: inspector || 'Senior Field Engineer',
    condition,
    defects: defects || [],
    remarks: remarks || '',
    date: date || new Date()
  });

  // Execute automated workflow side-effects
  const { asset: updatedAsset, createdMaintenance } =
    await workflowService.processInspectionCreated(inspection, asset);

  await inspection.populate('asset', 'name assetId category condition healthScore lifecycleStage');

  sendResponse(res, 201, 'Inspection logged and workflow side-effects processed successfully', {
    inspection,
    asset: updatedAsset,
    autoCreatedMaintenance: createdMaintenance
  });
});

module.exports = {
  getInspections,
  createInspection
};
