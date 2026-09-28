const Asset = require('../models/Asset');
const MaintenanceRecord = require('../models/MaintenanceRecord');
const WorkOrder = require('../models/WorkOrder');
const { LIFECYCLE_STAGES, CONDITIONS, PRIORITIES } = require('../utils/constants');

class DashboardService {
  async getStats() {
    const now = new Date();

    const [
      totalAssets,
      roads,
      structures,
      traffic,
      criticalAssetsDocs,
      maintenanceRecords,
      workOrders,
      allAssets
    ] = await Promise.all([
      Asset.countDocuments(),
      Asset.countDocuments({ category: 'ROAD' }),
      Asset.countDocuments({ category: 'STRUCTURE' }),
      Asset.countDocuments({ category: 'TRAFFIC' }),
      Asset.find({
        $or: [{ condition: 'CRITICAL' }, { healthScore: { $lt: 40 } }]
      }).select('assetId name category type condition healthScore location'),
      MaintenanceRecord.find(),
      WorkOrder.find(),
      Asset.find().select('assetId name lifecycleStage condition nextInspection lifecycleHistory')
    ]);

    // Critical count
    const critical = criticalAssetsDocs.length;

    // Maintenance due: status in RECOMMENDED, SCHEDULED, IN_PROGRESS
    const maintenanceDue = maintenanceRecords.filter((m) =>
      ['RECOMMENDED', 'SCHEDULED', 'IN_PROGRESS'].includes(m.status)
    ).length;

    // Overdue inspections: nextInspection < now
    const overdueInspections = allAssets.filter(
      (a) => a.nextInspection && new Date(a.nextInspection) < now
    ).length;

    // Estimated maintenance cost: sum of estimatedCost of active work orders + recommended maintenance
    const workOrderCost = workOrders
      .filter((w) => ['OPEN', 'IN_PROGRESS'].includes(w.status))
      .reduce((sum, w) => sum + (w.estimatedCost || 0), 0);

    const maintenanceRecordCost = maintenanceRecords
      .filter((m) => ['RECOMMENDED', 'SCHEDULED', 'IN_PROGRESS'].includes(m.status))
      .reduce((sum, m) => sum + (m.cost || 0), 0);

    const estimatedMaintenanceCost = workOrderCost + maintenanceRecordCost;

    // Per-stage counts
    const perStage = {};
    LIFECYCLE_STAGES.forEach((st) => {
      perStage[st] = 0;
    });
    allAssets.forEach((a) => {
      if (perStage[a.lifecycleStage] !== undefined) {
        perStage[a.lifecycleStage]++;
      }
    });

    // Per-condition counts
    const perCondition = {};
    CONDITIONS.forEach((c) => {
      perCondition[c] = 0;
    });
    allAssets.forEach((a) => {
      if (perCondition[a.condition] !== undefined) {
        perCondition[a.condition]++;
      }
    });

    // Priority counts (from WorkOrders + MaintenanceRecords)
    const priorityCounts = {};
    PRIORITIES.forEach((p) => {
      priorityCounts[p] = 0;
    });
    workOrders.forEach((wo) => {
      if (priorityCounts[wo.priority] !== undefined) {
        priorityCounts[wo.priority]++;
      }
    });

    // Recent lifecycle events across all assets (sorted descending by date)
    const recentLifecycleEvents = [];
    allAssets.forEach((asset) => {
      (asset.lifecycleHistory || []).forEach((ev) => {
        recentLifecycleEvents.push({
          assetId: asset.assetId,
          assetName: asset.name,
          stage: ev.stage,
          date: ev.date,
          description: ev.description,
          by: ev.by,
          cost: ev.cost,
          docRef: ev.docRef
        });
      });
    });
    recentLifecycleEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Critical assets with coordinates
    const criticalAssets = criticalAssetsDocs.map((doc) => ({
      assetId: doc.assetId,
      name: doc.name,
      category: doc.category,
      type: doc.type,
      condition: doc.condition,
      healthScore: doc.healthScore,
      location: {
        address: doc.location?.address || '',
        lat: doc.location?.lat,
        lng: doc.location?.lng
      }
    }));

    return {
      totals: totalAssets,
      roads,
      structures,
      traffic,
      critical,
      maintenanceDue,
      overdueInspections,
      estimatedMaintenanceCost,
      perStage,
      perCondition,
      priorityCounts,
      recentLifecycleEvents: recentLifecycleEvents.slice(0, 10),
      criticalAssets
    };
  }

  async getConditionAnalytics() {
    const assets = await Asset.find().select('category type condition healthScore healthBand');
    const breakdown = {
      overall: { GOOD: 0, FAIR: 0, POOR: 0, CRITICAL: 0 },
      byCategory: {
        ROAD: { GOOD: 0, FAIR: 0, POOR: 0, CRITICAL: 0 },
        STRUCTURE: { GOOD: 0, FAIR: 0, POOR: 0, CRITICAL: 0 },
        TRAFFIC: { GOOD: 0, FAIR: 0, POOR: 0, CRITICAL: 0 }
      },
      averageHealthByCategory: {
        ROAD: 0,
        STRUCTURE: 0,
        TRAFFIC: 0
      }
    };

    const sums = { ROAD: 0, STRUCTURE: 0, TRAFFIC: 0 };
    const counts = { ROAD: 0, STRUCTURE: 0, TRAFFIC: 0 };

    assets.forEach((a) => {
      if (breakdown.overall[a.condition] !== undefined) {
        breakdown.overall[a.condition]++;
      }
      if (breakdown.byCategory[a.category] && breakdown.byCategory[a.category][a.condition] !== undefined) {
        breakdown.byCategory[a.category][a.condition]++;
      }
      if (sums[a.category] !== undefined) {
        sums[a.category] += a.healthScore || 0;
        counts[a.category]++;
      }
    });

    ['ROAD', 'STRUCTURE', 'TRAFFIC'].forEach((cat) => {
      breakdown.averageHealthByCategory[cat] = counts[cat] > 0 ? Math.round(sums[cat] / counts[cat]) : 0;
    });

    return breakdown;
  }

  async getLifecycleAnalytics() {
    const assets = await Asset.find().select('category lifecycleStage actualCost estimatedCost');
    const stageDistribution = {};
    LIFECYCLE_STAGES.forEach((st) => {
      stageDistribution[st] = {
        count: 0,
        ROAD: 0,
        STRUCTURE: 0,
        TRAFFIC: 0,
        totalCost: 0
      };
    });

    assets.forEach((a) => {
      if (stageDistribution[a.lifecycleStage]) {
        stageDistribution[a.lifecycleStage].count++;
        if (stageDistribution[a.lifecycleStage][a.category] !== undefined) {
          stageDistribution[a.lifecycleStage][a.category]++;
        }
        stageDistribution[a.lifecycleStage].totalCost += a.actualCost || a.estimatedCost || 0;
      }
    });

    return stageDistribution;
  }
}

module.exports = new DashboardService();
