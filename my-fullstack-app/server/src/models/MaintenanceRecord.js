const mongoose = require('mongoose');
const { PRIORITIES, MAINTENANCE_STATUSES } = require('../utils/constants');

const MaintenanceRecordSchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: [true, 'Asset reference is required'],
      index: true
    },
    type: {
      type: String,
      required: [true, 'Maintenance type is required'],
      trim: true
    },
    description: {
      type: String,
      default: ''
    },
    cost: {
      type: Number,
      default: 0
    },
    startDate: {
      type: Date,
      default: null
    },
    completionDate: {
      type: Date,
      default: null
    },
    priority: {
      type: String,
      enum: PRIORITIES,
      default: 'MEDIUM'
    },
    status: {
      type: String,
      enum: MAINTENANCE_STATUSES,
      default: 'RECOMMENDED',
      index: true
    },
    contractor: {
      type: String,
      default: ''
    },
    remarks: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

MaintenanceRecordSchema.index({ status: 1, priority: 1 });

module.exports = mongoose.model('MaintenanceRecord', MaintenanceRecordSchema);
