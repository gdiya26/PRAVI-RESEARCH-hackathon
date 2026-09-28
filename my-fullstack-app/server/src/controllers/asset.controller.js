const mongoose = require('mongoose');
const Asset = require('../models/Asset');
const Inspection = require('../models/Inspection');
const MaintenanceRecord = require('../models/MaintenanceRecord');
const WorkOrder = require('../models/WorkOrder');
const lifecycleService = require('../services/lifecycle.service');
const { calculateHealthScore } = require('../utils/healthScore');
const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/response');
const ApiError = require('../utils/ApiError');

/**
 * Helper to find asset by Mongo _id OR assetId string
 */
async function findAssetByIdOrAssetId(identifier) {
  if (!identifier) return null;
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    const doc = await Asset.findById(identifier);
    if (doc) return doc;
  }
  return await Asset.findOne({ assetId: identifier });
}

// GET /api/assets (filters: category, type, condition, stage, search)
const getAssets = asyncHandler(async (req, res) => {
  const { category, type, condition, stage, search } = req.query;
  const filter = {};

  if (category) filter.category = category.toUpperCase();
  if (type) filter.type = type;
  if (condition) filter.condition = condition.toUpperCase();
  if (stage) filter.lifecycleStage = stage;

  if (search) {
    const searchRegex = new RegExp(search, 'i');
    filter.$or = [{ name: searchRegex }, { assetId: searchRegex }, { 'location.address': searchRegex }];
  }

  const assets = await Asset.find(filter).sort({ createdAt: -1 });
  sendResponse(res, 200, 'Assets retrieved successfully', assets);
});

// GET /api/assets/:id
const getAssetById = asyncHandler(async (req, res) => {
  const asset = await findAssetByIdOrAssetId(req.params.id);
  if (!asset) {
    throw new ApiError(404, `Asset not found with identifier '${req.params.id}'`);
  }
  sendResponse(res, 200, 'Asset retrieved successfully', asset);
});

// POST /api/assets
const createAsset = asyncHandler(async (req, res) => {
  const data = req.body;

  // Calculate initial health score
  const { healthScore, healthBand } = calculateHealthScore({
    condition: data.condition || 'GOOD',
    constructionYear: data.constructionYear,
    designLife: data.designLife
  });

  data.healthScore = healthScore;
  data.healthBand = healthBand;

  // Initial lifecycle history entry if not supplied
  if (!data.lifecycleHistory || data.lifecycleHistory.length === 0) {
    data.lifecycleHistory = [
      {
        stage: data.lifecycleStage || 'PLAN_DESIGN',
        date: new Date(),
        description: 'Asset record created in registry',
        by: 'Registry Admin',
        cost: data.estimatedCost || 0
      }
    ];
  }

  const asset = await Asset.create(data);
  sendResponse(res, 201, 'Asset created successfully', asset);
});

// PUT /api/assets/:id
const updateAsset = asyncHandler(async (req, res) => {
  const asset = await findAssetByIdOrAssetId(req.params.id);
  if (!asset) {
    throw new ApiError(404, `Asset not found with identifier '${req.params.id}'`);
  }

  // Preserve existing lifecycleHistory unless specifically appended
  const { lifecycleHistory, ...updateFields } = req.body;

  Object.assign(asset, updateFields);

  // Recalculate health score if condition, year, or life changed
  const { healthScore, healthBand } = calculateHealthScore({
    condition: asset.condition,
    lastInspection: asset.lastInspection,
    nextInspection: asset.nextInspection,
    constructionYear: asset.constructionYear,
    designLife: asset.designLife
  });
  asset.healthScore = healthScore;
  asset.healthBand = healthBand;

  await asset.save();
  sendResponse(res, 200, 'Asset updated successfully', asset);
});

// DELETE /api/assets/:id
const deleteAsset = asyncHandler(async (req, res) => {
  const asset = await findAssetByIdOrAssetId(req.params.id);
  if (!asset) {
    throw new ApiError(404, `Asset not found with identifier '${req.params.id}'`);
  }

  await Asset.deleteOne({ _id: asset._id });
  sendResponse(res, 200, `Asset ${asset.assetId} deleted successfully`, null);
});

// GET /api/assets/:id/lifecycle
const getAssetLifecycle = asyncHandler(async (req, res) => {
  const asset = await findAssetByIdOrAssetId(req.params.id);
  if (!asset) {
    throw new ApiError(404, `Asset not found with identifier '${req.params.id}'`);
  }

  sendResponse(res, 200, 'Lifecycle data retrieved', {
    assetId: asset.assetId,
    currentStage: asset.lifecycleStage,
    lifecycleHistory: asset.lifecycleHistory
  });
});

// POST /api/assets/:id/lifecycle
const advanceAssetLifecycle = asyncHandler(async (req, res) => {
  const asset = await findAssetByIdOrAssetId(req.params.id);
  if (!asset) {
    throw new ApiError(404, `Asset not found with identifier '${req.params.id}'`);
  }

  const { targetStage, description, by, cost, docRef, date } = req.body;
  if (!targetStage) {
    throw new ApiError(400, 'targetStage is required');
  }

  const updatedAsset = await lifecycleService.transitionStage(asset, {
    targetStage,
    description: description || `Transitioned to ${targetStage}`,
    by,
    cost,
    docRef,
    date
  });

  sendResponse(res, 200, `Asset transitioned to stage '${targetStage}'`, updatedAsset);
});

// GET /api/assets/:id/passport
// Returns asset + lifecycle + inspections + maintenance + workOrders + documents + merged chronological history in one call
const getAssetPassport = asyncHandler(async (req, res) => {
  const asset = await findAssetByIdOrAssetId(req.params.id);
  if (!asset) {
    throw new ApiError(404, `Asset not found with identifier '${req.params.id}'`);
  }

  const [inspections, maintenance, workOrders] = await Promise.all([
    Inspection.find({ asset: asset._id }).sort({ date: -1 }),
    MaintenanceRecord.find({ asset: asset._id }).sort({ createdAt: -1 }),
    WorkOrder.find({ asset: asset._id }).sort({ createdAt: -1 })
  ]);

  // Build merged chronological history
  const mergedHistory = [];

  // 1. Lifecycle Events
  (asset.lifecycleHistory || []).forEach((ev) => {
    mergedHistory.push({
      eventType: 'LIFECYCLE_STAGE_CHANGE',
      date: ev.date,
      title: `Stage: ${ev.stage}`,
      description: ev.description,
      actor: ev.by,
      cost: ev.cost,
      ref: ev.docRef,
      raw: ev
    });
  });

  // 2. Inspections
  inspections.forEach((insp) => {
    mergedHistory.push({
      eventType: 'INSPECTION',
      date: insp.date,
      title: `Inspection (${insp.condition})`,
      description: `Condition: ${insp.condition}, Defects: ${(insp.defects || []).length}. Remarks: ${insp.remarks || 'None'}`,
      actor: insp.inspector,
      cost: 0,
      ref: `INSP-${insp._id.toString().slice(-6)}`,
      raw: insp
    });
  });

  // 3. Maintenance Records
  maintenance.forEach((m) => {
    mergedHistory.push({
      eventType: 'MAINTENANCE',
      date: m.startDate || m.createdAt,
      title: `Maintenance: ${m.type} [${m.status}]`,
      description: m.description || m.remarks || '',
      actor: m.contractor || 'Contractor Team',
      cost: m.cost || 0,
      ref: `MNT-${m._id.toString().slice(-6)}`,
      raw: m
    });
  });

  // 4. Work Orders
  workOrders.forEach((wo) => {
    mergedHistory.push({
      eventType: 'WORK_ORDER',
      date: wo.createdAt,
      title: `Work Order: ${wo.woNumber} [${wo.status}]`,
      description: `Issue: ${wo.issue}. Priority: ${wo.priority}`,
      actor: wo.assignedDepartment,
      cost: wo.estimatedCost || 0,
      ref: wo.woNumber,
      raw: wo
    });
  });

  // Sort merged history chronologically descending (most recent first)
  mergedHistory.sort((a, b) => new Date(b.date) - new Date(a.date));

  const passportData = {
    asset,
    lifecycle: {
      currentStage: asset.lifecycleStage,
      history: asset.lifecycleHistory
    },
    inspections,
    maintenance,
    workOrders,
    documents: asset.documents || [],
    mergedChronologicalHistory: mergedHistory
  };

  sendResponse(res, 200, 'Asset Passport retrieved successfully', passportData, {
    includeDisclaimer: true
  });
});

// GET /api/traffic-assets
const getTrafficAssets = asyncHandler(async (req, res) => {
  const assets = await Asset.find({ category: 'TRAFFIC' }).sort({ createdAt: -1 });
  sendResponse(res, 200, 'Traffic assets retrieved successfully', assets);
});

module.exports = {
  getAssets,
  getAssetById,
  createAsset,
  updateAsset,
  deleteAsset,
  getAssetLifecycle,
  advanceAssetLifecycle,
  getAssetPassport,
  getTrafficAssets
};
