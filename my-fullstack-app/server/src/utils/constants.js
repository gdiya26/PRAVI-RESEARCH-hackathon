module.exports = {
  CATEGORIES: ['ROAD', 'STRUCTURE', 'TRAFFIC'],

  ROAD_TYPES: ['Highway', 'Arterial Road', 'Local Road', 'Road Segment', 'Shoulder', 'Median'],
  STRUCTURE_TYPES: ['Bridge', 'Flyover', 'Underpass', 'Culvert', 'Retaining Wall'],
  TRAFFIC_TYPES: ['Traffic Signal', 'Road Sign', 'CCTV Camera', 'Traffic Sensor', 'Variable Message Sign'],

  ROAD_DEFECTS: ['Potholes', 'Cracking', 'Rutting', 'Surface deterioration'],
  STRUCTURE_DEFECTS: ['Concrete cracking', 'Corrosion', 'Expansion joint damage', 'Structural deterioration'],

  DEFECT_SEVERITIES: ['LOW', 'MEDIUM', 'HIGH'],

  LIFECYCLE_STAGES: [
    'PLAN_DESIGN',
    'BUILD',
    'OPERATE',
    'MAINTAIN',
    'RECONSTRUCTION_REPLACEMENT_RETIREMENT'
  ],

  CONDITIONS: ['GOOD', 'FAIR', 'POOR', 'CRITICAL'],

  CONDITION_ORDER: ['CRITICAL', 'POOR', 'FAIR', 'GOOD'], // from worst to best

  PRIORITIES: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],

  MAINTENANCE_STATUSES: ['RECOMMENDED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED'],

  WORK_ORDER_STATUSES: ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CLOSED'],

  HEALTH_BANDS: {
    HEALTHY: 'Healthy',
    ATTENTION_REQUIRED: 'Attention Required',
    CRITICAL: 'Critical'
  },

  HEALTH_SCORE_CONFIG: {
    weights: {
      condition: 0.40,
      inspectionFreshness: 0.20,
      ageVsDesignLife: 0.15,
      openDefects: 0.15,
      maintenanceHistory: 0.10
    }
  },

  HEALTH_SCORE_DISCLAIMER: 'Decision-support indicator only, not a certified engineering safety assessment.'
};
