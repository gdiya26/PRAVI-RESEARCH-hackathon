const mongoose = require('mongoose');
const { PRIORITIES, WORK_ORDER_STATUSES } = require('../utils/constants');

const WorkOrderSchema = new mongoose.Schema(
  {
    woNumber: {
      type: String,
      unique: true,
      index: true
    },
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: [true, 'Asset reference is required'],
      index: true
    },
    issue: {
      type: String,
      required: [true, 'Issue description is required'],
      trim: true
    },
    priority: {
      type: String,
      enum: PRIORITIES,
      default: 'MEDIUM'
    },
    assignedDepartment: {
      type: String,
      default: 'Operations & Maintenance Team'
    },
    estimatedCost: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: WORK_ORDER_STATUSES,
      default: 'OPEN',
      index: true
    },
    maintenanceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'MaintenanceRecord',
      default: null
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Pre-save hook to generate sequential / year-based woNumber if not supplied
WorkOrderSchema.pre('save', async function (next) {
  if (!this.woNumber) {
    const year = new Date().getFullYear();
    const count = await mongoose.model('WorkOrder').countDocuments();
    const sequence = String(count + 1).padStart(4, '0');
    this.woNumber = `WO-${year}-${sequence}`;
  }
  next();
});

module.exports = mongoose.model('WorkOrder', WorkOrderSchema);
