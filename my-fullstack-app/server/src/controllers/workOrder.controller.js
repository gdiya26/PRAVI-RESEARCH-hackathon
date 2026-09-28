const mongoose = require('mongoose');
const WorkOrder = require('../models/WorkOrder');
const Asset = require('../models/Asset');
const workflowService = require('../services/workflow.service');
const asyncHandler = require('../utils/asyncHandler');
const { sendResponse } = require('../utils/response');
const ApiError = require('../utils/ApiError');
const { WORK_ORDER_STATUSES } = require('../utils/constants');

// GET /api/work-orders (global list populated with asset name/ID/category)
const getWorkOrders = asyncHandler(async (req, res) => {
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
        return sendResponse(res, 200, 'Work orders retrieved', []);
      }
    }
  }

  const workOrders = await WorkOrder.find(filter)
    .populate('asset', 'name assetId category condition healthScore lifecycleStage')
    .populate('maintenanceId', 'type description status priority cost')
    .sort({ createdAt: -1 });

  sendResponse(res, 200, 'Work orders retrieved successfully', workOrders);
});

// POST /api/work-orders
const createWorkOrder = asyncHandler(async (req, res) => {
  const {
    asset: assetIdentifier,
    issue,
    priority,
    assignedDepartment,
    estimatedCost,
    maintenanceId,
    status
  } = req.body;

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

  const workOrder = new WorkOrder({
    asset: asset._id,
    issue: issue || 'General maintenance and repair',
    priority: priority || 'MEDIUM',
    assignedDepartment: assignedDepartment || 'Highway Maintenance Division',
    estimatedCost: estimatedCost || 0,
    maintenanceId: maintenanceId || null,
    status: status || 'OPEN'
  });

  // Execute workflow rules (links maintenance record, sets to SCHEDULED)
  const { workOrder: savedWorkOrder, maintenanceRecord } =
    await workflowService.processWorkOrderCreated(workOrder, asset);

  await savedWorkOrder.populate('asset', 'name assetId category condition healthScore lifecycleStage');
  if (savedWorkOrder.maintenanceId) {
    await savedWorkOrder.populate('maintenanceId', 'type description status priority cost');
  }

  sendResponse(res, 201, 'Work order created and linked to maintenance successfully', {
    workOrder: savedWorkOrder,
    linkedMaintenance: maintenanceRecord
  });
});

// PATCH /api/work-orders/:id/status
const updateWorkOrderStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !WORK_ORDER_STATUSES.includes(status)) {
    throw new ApiError(
      400,
      `Invalid or missing status. Allowed: ${WORK_ORDER_STATUSES.join(', ')}`
    );
  }

  let workOrder = null;
  if (mongoose.Types.ObjectId.isValid(id)) {
    workOrder = await WorkOrder.findById(id);
  }
  if (!workOrder) {
    workOrder = await WorkOrder.findOne({ woNumber: id });
  }

  if (!workOrder) {
    throw new ApiError(404, `Work order not found with identifier '${id}'`);
  }

  // Execute workflow side-effects
  const {
    workOrder: updatedWorkOrder,
    maintenanceRecord,
    asset
  } = await workflowService.processWorkOrderStatusUpdate(workOrder, status);

  await updatedWorkOrder.populate('asset', 'name assetId category condition healthScore lifecycleStage');
  if (updatedWorkOrder.maintenanceId) {
    await updatedWorkOrder.populate('maintenanceId', 'type description status priority cost');
  }

  sendResponse(
    res,
    200,
    `Work order status updated to '${status}' with side-effects processed`,
    {
      workOrder: updatedWorkOrder,
      updatedMaintenance: maintenanceRecord,
      updatedAsset: asset
    }
  );
});

module.exports = {
  getWorkOrders,
  createWorkOrder,
  updateWorkOrderStatus
};
