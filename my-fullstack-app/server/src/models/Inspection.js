const mongoose = require('mongoose');
const { CONDITIONS, DEFECT_SEVERITIES } = require('../utils/constants');

const DefectSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true
    },
    severity: {
      type: String,
      enum: DEFECT_SEVERITIES,
      default: 'LOW'
    }
  },
  { _id: true }
);

const InspectionSchema = new mongoose.Schema(
  {
    asset: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Asset',
      required: [true, 'Asset reference is required'],
      index: true
    },
    date: {
      type: Date,
      default: Date.now,
      required: true
    },
    inspector: {
      type: String,
      required: [true, 'Inspector name is required'],
      trim: true
    },
    condition: {
      type: String,
      enum: CONDITIONS,
      required: [true, 'Inspection condition is required']
    },
    defects: {
      type: [DefectSchema],
      default: []
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

InspectionSchema.index({ date: -1 });

module.exports = mongoose.model('Inspection', InspectionSchema);
