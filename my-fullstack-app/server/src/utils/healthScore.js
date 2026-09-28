const { HEALTH_SCORE_DISCLAIMER, HEALTH_BANDS } = require('./constants');

const HEALTH_CONFIG = {
  weights: {
    condition: 0.40,
    inspectionFreshness: 0.20,
    ageVsDesignLife: 0.15,
    openDefects: 0.15,
    maintenanceHistory: 0.10
  },
  disclaimer: HEALTH_SCORE_DISCLAIMER
};

/**
 * Calculates health score (0-100) and health band for an asset.
 * @param {Object} params
 * @param {string} params.condition - GOOD | FAIR | POOR | CRITICAL
 * @param {Date|string} [params.lastInspection]
 * @param {Date|string} [params.nextInspection]
 * @param {number} [params.constructionYear]
 * @param {number} [params.designLife]
 * @param {Array} [params.defects] - Array of { type, severity: 'LOW'|'MEDIUM'|'HIGH' }
 * @param {Array} [params.maintenanceRecords] - Array of MaintenanceRecord docs
 * @returns {{ healthScore: number, healthBand: string, subScores: object, disclaimer: string }}
 */
function calculateHealthScore({
  condition = 'GOOD',
  lastInspection = null,
  nextInspection = null,
  constructionYear = null,
  designLife = 30,
  defects = [],
  maintenanceRecords = []
} = {}) {
  const currentYear = new Date().getFullYear();
  const now = new Date();

  // 1. Condition score (40%)
  let conditionScore = 80;
  switch (condition?.toUpperCase()) {
    case 'GOOD':
      conditionScore = 100;
      break;
    case 'FAIR':
      conditionScore = 70;
      break;
    case 'POOR':
      conditionScore = 40;
      break;
    case 'CRITICAL':
      conditionScore = 10;
      break;
    default:
      conditionScore = 75;
  }

  // 2. Inspection Freshness (20%)
  let freshnessScore = 60;
  if (lastInspection) {
    const lastDate = new Date(lastInspection);
    const diffDays = Math.max(0, Math.floor((now - lastDate) / (1000 * 60 * 60 * 24)));
    const isOverdue = nextInspection && new Date(nextInspection) < now;

    if (isOverdue) {
      freshnessScore = 25;
    } else if (diffDays <= 90) {
      freshnessScore = 100;
    } else if (diffDays <= 180) {
      freshnessScore = 85;
    } else if (diffDays <= 365) {
      freshnessScore = 65;
    } else {
      freshnessScore = 35;
    }
  }

  // 3. Age vs Design Life (15%)
  let ageScore = 85;
  if (constructionYear) {
    const age = Math.max(0, currentYear - constructionYear);
    const life = designLife && designLife > 0 ? designLife : 30;
    const ratio = age / life;

    if (ratio <= 0.25) {
      ageScore = 100;
    } else if (ratio <= 0.50) {
      ageScore = 85;
    } else if (ratio <= 0.75) {
      ageScore = 70;
    } else if (ratio <= 1.0) {
      ageScore = 45;
    } else {
      ageScore = 20;
    }
  }

  // 4. Open Defects (15%)
  let defectScore = 100;
  if (Array.isArray(defects) && defects.length > 0) {
    const hasHigh = defects.some((d) => d.severity === 'HIGH');
    const hasMedium = defects.some((d) => d.severity === 'MEDIUM');
    const hasLow = defects.some((d) => d.severity === 'LOW');

    if (hasHigh) {
      defectScore = 20;
    } else if (hasMedium) {
      defectScore = 60;
    } else if (hasLow) {
      defectScore = 85;
    }
  }

  // 5. Maintenance History (10%)
  let maintenanceScore = 90;
  if (Array.isArray(maintenanceRecords) && maintenanceRecords.length > 0) {
    const hasUnresolvedUrgent = maintenanceRecords.some(
      (m) =>
        ['RECOMMENDED', 'SCHEDULED'].includes(m.status) &&
        ['HIGH', 'URGENT'].includes(m.priority)
    );
    const hasCompleted = maintenanceRecords.some((m) =>
      ['COMPLETED', 'VERIFIED'].includes(m.status)
    );

    if (hasUnresolvedUrgent) {
      maintenanceScore = 30;
    } else if (hasCompleted) {
      maintenanceScore = 100;
    } else {
      maintenanceScore = 75;
    }
  }

  const { weights } = HEALTH_CONFIG;
  const weightedTotal =
    conditionScore * weights.condition +
    freshnessScore * weights.inspectionFreshness +
    ageScore * weights.ageVsDesignLife +
    defectScore * weights.openDefects +
    maintenanceScore * weights.maintenanceHistory;

  const score = Math.max(0, Math.min(100, Math.round(weightedTotal)));

  let band = HEALTH_BANDS.HEALTHY;
  if (score < 40) {
    band = HEALTH_BANDS.CRITICAL;
  } else if (score < 70) {
    band = HEALTH_BANDS.ATTENTION_REQUIRED;
  }

  return {
    healthScore: score,
    healthBand: band,
    subScores: {
      condition: conditionScore,
      freshness: freshnessScore,
      ageVsDesignLife: ageScore,
      defects: defectScore,
      maintenanceHistory: maintenanceScore
    },
    disclaimer: HEALTH_CONFIG.disclaimer
  };
}

module.exports = {
  HEALTH_CONFIG,
  calculateHealthScore
};
