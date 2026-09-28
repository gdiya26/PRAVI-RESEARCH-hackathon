const mongoose = require('mongoose');
const {
  CATEGORIES,
  LIFECYCLE_STAGES,
  CONDITIONS,
  HEALTH_BANDS
} = require('../utils/constants');

const DocumentSchema = new mongoose.Schema(
  {
    type: { type: String, required: true }, // e.g. DPR, Design Drawing, Work Order, Quality Certificate, Completion Certificate, Inspection Report
    name: { type: String, required: true },
    ref: { type: String, required: true },
    date: { type: Date, default: Date.now }
  },
  { _id: true }
);

const LifecycleEventSchema = new mongoose.Schema(
  {
    stage: { type: String, enum: LIFECYCLE_STAGES, required: true },
    date: { type: Date, default: Date.now, required: true },
    description: { type: String, required: true },
    by: { type: String, default: 'System' },
    cost: { type: Number, default: 0 },
    docRef: { type: String, default: '' }
  },
  { _id: true }
);

const AssetSchema = new mongoose.Schema(
  {
    assetId: {
      type: String,
      required: [true, 'Asset ID is required'],
      unique: true,
      trim: true,
      index: true
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: [true, 'Category is required (ROAD, STRUCTURE, TRAFFIC)'],
      index: true
    },
    type: {
      type: String,
      required: [true, 'Asset type is required'],
      trim: true
    },
    name: {
      type: String,
      required: [true, 'Asset name is required'],
      trim: true
    },
    location: {
      address: { type: String, default: '' },
      lat: { type: Number, default: null },
      lng: { type: Number, default: null },
      path: {
        type: [[Number]], // Array of [lat, lng] pairs for road polylines
        default: []
      }
    },
    lifecycleStage: {
      type: String,
      enum: LIFECYCLE_STAGES,
      default: 'PLAN_DESIGN'
    },
    condition: {
      type: String,
      enum: CONDITIONS,
      default: 'GOOD'
    },
    status: {
      type: String,
      default: 'ACTIVE'
    },
    healthScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 100
    },
    healthBand: {
      type: String,
      enum: [
        HEALTH_BANDS.HEALTHY,
        HEALTH_BANDS.ATTENTION_REQUIRED,
        HEALTH_BANDS.CRITICAL
      ],
      default: HEALTH_BANDS.HEALTHY
    },
    constructionYear: {
      type: Number,
      default: null
    },
    designLife: {
      type: Number,
      default: 30
    },
    estimatedCost: {
      type: Number,
      default: 0
    },
    actualCost: {
      type: Number,
      default: 0
    },
    department: {
      type: String,
      default: 'Public Works Department (PWD)'
    },
    contractor: {
      type: String,
      default: ''
    },
    lastInspection: {
      type: Date,
      default: null
    },
    nextInspection: {
      type: Date,
      default: null
    },
    specs: {
      type: mongoose.Schema.Types.Mixed,
      default: {}
    },
    documents: {
      type: [DocumentSchema],
      default: []
    },
    lifecycleHistory: {
      type: [LifecycleEventSchema],
      default: []
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Helpful compound indexes
AssetSchema.index({ category: 1, condition: 1 });
AssetSchema.index({ lifecycleStage: 1 });
AssetSchema.index({ healthScore: 1 });

module.exports = mongoose.model('Asset', AssetSchema);
