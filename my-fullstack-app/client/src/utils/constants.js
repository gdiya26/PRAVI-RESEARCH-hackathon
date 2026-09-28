export const SITE_NAME = 'Government Portal for Roads and Infrastructure - Made by Pravi';
export const SITE_NAME_SHORT = 'Roads & Infrastructure Portal';
export const TAGLINE = 'One platform. One asset identity. Complete lifecycle visibility.';
export const FOOTER_TEXT = 'Government Portal for Roads and Infrastructure | Made by Pravi | Demo application using fictional data. Not an official government record.';
export const HEALTH_DISCLAIMER = 'Decision-support indicator only, not a certified engineering safety assessment.';

export const LIFECYCLE_STAGES = [
  'PLAN_DESIGN',
  'BUILD',
  'OPERATE',
  'MAINTAIN',
  'RECONSTRUCTION_REPLACEMENT_RETIREMENT'
];

export const STAGE_LABELS = {
  PLAN_DESIGN: 'Plan & Design',
  BUILD: 'Build',
  OPERATE: 'Operate',
  MAINTAIN: 'Maintain',
  RECONSTRUCTION_REPLACEMENT_RETIREMENT: 'Reconstruction / Replacement / Retirement'
};

export const CONDITIONS = ['GOOD', 'FAIR', 'POOR', 'CRITICAL'];

export const CATEGORIES = ['ROAD', 'STRUCTURE', 'TRAFFIC'];

export const ROAD_TYPES = ['Highway', 'Arterial Road', 'Local Road', 'Road Segment', 'Shoulder', 'Median'];
export const STRUCTURE_TYPES = ['Bridge', 'Flyover', 'Underpass', 'Culvert', 'Retaining Wall'];
export const TRAFFIC_TYPES = ['Traffic Signal', 'Road Sign', 'CCTV Camera', 'Traffic Sensor', 'Variable Message Sign'];

export const ROAD_DEFECTS = ['Potholes', 'Cracking', 'Rutting', 'Surface deterioration'];
export const STRUCTURE_DEFECTS = ['Concrete cracking', 'Corrosion', 'Expansion joint damage', 'Structural deterioration'];

export const DEFECT_SEVERITIES = ['LOW', 'MEDIUM', 'HIGH'];

export const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'];

export const MAINTENANCE_STATUSES = ['RECOMMENDED', 'SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'VERIFIED'];

export const WORK_ORDER_STATUSES = ['OPEN', 'IN_PROGRESS', 'COMPLETED', 'CLOSED'];

export const HEALTH_BANDS = {
  HEALTHY: { label: 'Healthy', min: 70, max: 100, colorVar: '--good' },
  ATTENTION_REQUIRED: { label: 'Attention Required', min: 40, max: 69, colorVar: '--fair' },
  CRITICAL: { label: 'Critical', min: 0, max: 39, colorVar: '--critical' }
};

export const AHMEDABAD_CENTER = [23.0225, 72.5714];
