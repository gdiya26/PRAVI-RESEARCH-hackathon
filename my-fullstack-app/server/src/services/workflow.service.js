const MaintenanceRecord = require('../models/MaintenanceRecord');
const WorkOrder = require('../models/WorkOrder');
const Asset = require('../models/Asset');
const { calculateHealthScore } = require('../utils/healthScore');
const { CONDITION_ORDER } = require('../utils/constants');
const ApiError = require('../utils/ApiError');

class WorkflowService {
  /**
   * Side-effects after saving a new inspection:
   * 1. Update asset condition, lastInspection, nextInspection.
   * 2. Recompute health score.
   * 3. If any defect is HIGH severity or condition is POOR/CRITICAL:
   *    Auto-create RECOMMENDED MaintenanceRecord.
   *    If asset in OPERATE -> transition to MAINTAIN + append lifecycle event.
   */
  async processInspectionCreated(inspection, asset) {
    const inspDate = inspection.date ? new Date(inspection.date) : new Date();
    asset.condition = inspection.condition;
    asset.lastInspection = inspDate;

    // Calculate next inspection: +6 months if POOR/CRITICAL, else +12 months
    const nextDate = new Date(inspDate);
    if (['POOR', 'CRITICAL'].includes(inspection.condition)) {
      nextDate.setMonth(nextDate.getMonth() + 6);
    } else {
      nextDate.setMonth(nextDate.getMonth() + 12);
    }
    asset.nextInspection = nextDate;

    // Retrieve active maintenance records for health calculation
    const maintenanceRecords = await MaintenanceRecord.find({ asset: asset._id });
    const { healthScore, healthBand } = calculateHealthScore({
      condition: asset.condition,
      lastInspection: asset.lastInspection,
      nextInspection: asset.nextInspection,
      constructionYear: asset.constructionYear,
      designLife: asset.designLife,
      defects: inspection.defects,
      maintenanceRecords
    });
    asset.healthScore = healthScore;
    asset.healthBand = healthBand;

    const hasHighSeverityDefect = (inspection.defects || []).some(
      (d) => d.severity === 'HIGH'
    );
    const isConditionCriticalOrPoor = ['POOR', 'CRITICAL'].includes(
      inspection.condition
    );

    let createdMaintenance = null;

    if (hasHighSeverityDefect || isConditionCriticalOrPoor) {
      // 1. Auto-create a RECOMMENDED MaintenanceRecord
      createdMaintenance = await MaintenanceRecord.create({
        asset: asset._id,
        type: isConditionCriticalOrPoor ? 'Emergency Defect Remediation' : 'Corrective Defect Repair',
        description: `Automated maintenance recommendation generated from inspection. Trigger: ${
          hasHighSeverityDefect ? 'HIGH severity defect(s) detected' : 'Condition evaluated as ' + inspection.condition
        }. Inspector: ${inspection.inspector}.`,
        priority: inspection.condition === 'CRITICAL' ? 'URGENT' : 'HIGH',
        status: 'RECOMMENDED',
        remarks: inspection.remarks || 'Automated trigger via WorkflowService'
      });

      // 2. If the asset is currently in OPERATE, move it to MAINTAIN with a lifecycle event
      if (asset.lifecycleStage === 'OPERATE') {
        asset.lifecycleStage = 'MAINTAIN';
        asset.lifecycleHistory.push({
          stage: 'MAINTAIN',
          date: new Date(),
          description: `Auto-transitioned to MAINTAIN due to ${
            hasHighSeverityDefect ? 'HIGH severity defect' : 'degraded condition (' + inspection.condition + ')'
          } identified in inspection.`,
          by: 'Workflow Engine',
          cost: 0,
          docRef: `INSP-${inspection._id.toString().slice(-6)}`
        });
      }
    }

    await asset.save();
    return { asset, createdMaintenance };
  }

  /**
   * Side-effects when creating a WorkOrder:
   * Link to a given maintenance record (or latest RECOMMENDED one) and set it to SCHEDULED.
   */
  async processWorkOrderCreated(workOrder, asset) {
    let maintenanceRecord = null;

    if (workOrder.maintenanceId) {
      maintenanceRecord = await MaintenanceRecord.findById(workOrder.maintenanceId);
    } else {
      // Find latest RECOMMENDED maintenance record for this asset
      maintenanceRecord = await MaintenanceRecord.findOne({
        asset: asset._id,
        status: 'RECOMMENDED'
      }).sort({ createdAt: -1 });
    }

    if (maintenanceRecord) {
      workOrder.maintenanceId = maintenanceRecord._id;
      maintenanceRecord.status = 'SCHEDULED';
      maintenanceRecord.startDate = maintenanceRecord.startDate || new Date();
      await maintenanceRecord.save();
    }

    await workOrder.save();
    return { workOrder, maintenanceRecord };
  }

  /**
   * Side-effects when updating WorkOrder status:
   * - IN_PROGRESS -> maintenance IN_PROGRESS
   * - COMPLETED -> maintenance COMPLETED
   * - CLOSED -> maintenance VERIFIED, asset condition improves one level,
   *   health recomputed, lifecycle event logged, asset returns to OPERATE.
   */
  async processWorkOrderStatusUpdate(workOrder, newStatus) {
    workOrder.status = newStatus;

    let maintenanceRecord = null;
    if (workOrder.maintenanceId) {
      maintenanceRecord = await MaintenanceRecord.findById(workOrder.maintenanceId);
    }

    if (maintenanceRecord) {
      if (newStatus === 'IN_PROGRESS') {
        maintenanceRecord.status = 'IN_PROGRESS';
        maintenanceRecord.startDate = maintenanceRecord.startDate || new Date();
        await maintenanceRecord.save();
      } else if (newStatus === 'COMPLETED') {
        maintenanceRecord.status = 'COMPLETED';
        maintenanceRecord.completionDate = maintenanceRecord.completionDate || new Date();
        await maintenanceRecord.save();
      } else if (newStatus === 'CLOSED') {
        maintenanceRecord.status = 'VERIFIED';
        maintenanceRecord.completionDate = maintenanceRecord.completionDate || new Date();
        await maintenanceRecord.save();
      }
    }

    let asset = null;
    if (newStatus === 'CLOSED') {
      asset = await Asset.findById(workOrder.asset);
      if (asset) {
        // Condition improves one level: CRITICAL -> POOR -> FAIR -> GOOD
        const currentIdx = CONDITION_ORDER.indexOf(asset.condition);
        if (currentIdx !== -1 && currentIdx < CONDITION_ORDER.length - 1) {
          asset.condition = CONDITION_ORDER[currentIdx + 1];
        }

        // Return asset to OPERATE if in MAINTAIN
        const prevStage = asset.lifecycleStage;
        if (asset.lifecycleStage === 'MAINTAIN') {
          asset.lifecycleStage = 'OPERATE';
        }

        // Append lifecycle event
        asset.lifecycleHistory.push({
          stage: asset.lifecycleStage,
          date: new Date(),
          description: `Work Order ${workOrder.woNumber} CLOSED & VERIFIED. Asset condition upgraded to ${asset.condition} and transitioned from ${prevStage} to ${asset.lifecycleStage}.`,
          by: 'Workflow Engine',
          cost: workOrder.estimatedCost || 0,
          docRef: workOrder.woNumber
        });

        // Recompute health score
        const allRecords = await MaintenanceRecord.find({ asset: asset._id });
        const { healthScore, healthBand } = calculateHealthScore({
          condition: asset.condition,
          lastInspection: asset.lastInspection,
          nextInspection: asset.nextInspection,
          constructionYear: asset.constructionYear,
          designLife: asset.designLife,
          defects: [],
          maintenanceRecords: allRecords
        });

        asset.healthScore = healthScore;
        asset.healthBand = healthBand;

        await asset.save();
      }
    }

    await workOrder.save();
    return { workOrder, maintenanceRecord, asset };
  }
}

module.exports = new WorkflowService();
