require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Asset = require('../models/Asset');
const Inspection = require('../models/Inspection');
const MaintenanceRecord = require('../models/MaintenanceRecord');
const WorkOrder = require('../models/WorkOrder');
const { calculateHealthScore } = require('../utils/healthScore');
const {
  seedAssets,
  seedInspections,
  seedMaintenance,
  seedWorkOrders
} = require('./data');

async function seedDatabase() {
  console.log('🌱 Starting database seed script...');

  try {
    await connectDB();

    // 1. Wipe existing collections for idempotence
    console.log('🧹 Clearing existing collections...');
    await Promise.all([
      Asset.deleteMany({}),
      Inspection.deleteMany({}),
      MaintenanceRecord.deleteMany({}),
      WorkOrder.deleteMany({})
    ]);

    // 2. Insert Assets with computed health scores
    console.log(`📦 Seeding ${seedAssets.length} assets...`);
    const assetMap = {}; // assetId -> Asset document

    for (const rawAsset of seedAssets) {
      // Find sample defects and maintenance for this asset to seed realistic health scores
      const relatedInspections = seedInspections.filter((i) => i.assetId === rawAsset.assetId);
      const latestInspection = relatedInspections[relatedInspections.length - 1];
      const relatedMaintenance = seedMaintenance.filter((m) => m.assetId === rawAsset.assetId);

      const { healthScore, healthBand } = calculateHealthScore({
        condition: rawAsset.condition,
        lastInspection: rawAsset.lastInspection,
        nextInspection: rawAsset.nextInspection,
        constructionYear: rawAsset.constructionYear,
        designLife: rawAsset.designLife,
        defects: latestInspection?.defects || [],
        maintenanceRecords: relatedMaintenance
      });

      rawAsset.healthScore = healthScore;
      rawAsset.healthBand = healthBand;

      const createdAsset = await Asset.create(rawAsset);
      assetMap[createdAsset.assetId] = createdAsset;
    }

    // 3. Insert Inspections
    console.log(`📋 Seeding ${seedInspections.length} inspections...`);
    for (const rawInspection of seedInspections) {
      const asset = assetMap[rawInspection.assetId];
      if (asset) {
        await Inspection.create({
          asset: asset._id,
          inspector: rawInspection.inspector,
          condition: rawInspection.condition,
          date: rawInspection.date,
          defects: rawInspection.defects,
          remarks: rawInspection.remarks
        });
      }
    }

    // 4. Insert Maintenance Records
    console.log(`🛠️ Seeding ${seedMaintenance.length} maintenance records...`);
    const maintenanceDocs = [];
    for (const rawMaintenance of seedMaintenance) {
      const asset = assetMap[rawMaintenance.assetId];
      if (asset) {
        const mDoc = await MaintenanceRecord.create({
          asset: asset._id,
          type: rawMaintenance.type,
          description: rawMaintenance.description,
          cost: rawMaintenance.cost,
          startDate: rawMaintenance.startDate,
          completionDate: rawMaintenance.completionDate,
          priority: rawMaintenance.priority,
          status: rawMaintenance.status,
          contractor: rawMaintenance.contractor,
          remarks: rawMaintenance.remarks
        });
        maintenanceDocs.push(mDoc);
      }
    }

    // 5. Insert Work Orders
    console.log(`📑 Seeding ${seedWorkOrders.length} work orders...`);
    for (const rawWO of seedWorkOrders) {
      const asset = assetMap[rawWO.assetId];
      if (asset) {
        let linkedMaintenanceId = null;
        if (rawWO.maintenanceIndex !== undefined && maintenanceDocs[rawWO.maintenanceIndex]) {
          linkedMaintenanceId = maintenanceDocs[rawWO.maintenanceIndex]._id;
        }

        await WorkOrder.create({
          asset: asset._id,
          woNumber: rawWO.woNumber,
          issue: rawWO.issue,
          priority: rawWO.priority,
          assignedDepartment: rawWO.assignedDepartment,
          estimatedCost: rawWO.estimatedCost,
          status: rawWO.status,
          maintenanceId: linkedMaintenanceId
        });
      }
    }

    console.log('✅ Seeding completed successfully!');
    console.log(`📊 Summary:
  - Assets: ${Object.keys(assetMap).length}
  - Inspections: ${seedInspections.length}
  - Maintenance Records: ${seedMaintenance.length}
  - Work Orders: ${seedWorkOrders.length}
  - Overdue Inspections: ${
    seedAssets.filter((a) => a.nextInspection && new Date(a.nextInspection) < new Date()).length
  }
    `);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedDatabase();
