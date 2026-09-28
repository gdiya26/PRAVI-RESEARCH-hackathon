/**
 * Executive Attention Rules and Decision Support Configuration
 * Centralized rule configuration for Department Secretary / Executive View.
 */

const EXECUTIVE_ATTENTION_RULES = {
  IMMEDIATE: [
    {
      id: 'CRITICAL_CONDITION',
      title: 'Critical Physical Condition',
      check: (asset) => asset.condition === 'CRITICAL',
      reason: (asset) => 'Asset structural condition is rated CRITICAL',
      action: 'Conduct emergency structural assessment and enforce load restrictions'
    },
    {
      id: 'CRITICAL_HEALTH_SCORE',
      title: 'Critically Low Health Score',
      check: (asset) => typeof asset.healthScore === 'number' && asset.healthScore < 40,
      reason: (asset) => `Composite health score is critically low (${Math.round(asset.healthScore)}/100)`,
      action: 'Initiate comprehensive structural rehabilitation and prioritize capital renewal'
    },
    {
      id: 'INSPECTION_OVERDUE_CRITICAL',
      title: 'Inspection Overdue (>30 Days)',
      check: (asset, { daysOverdue }) => daysOverdue > 30,
      reason: (asset, { daysOverdue }) => `Mandatory safety inspection is overdue by ${daysOverdue} days (> 30 days)`,
      action: 'Direct regional inspection wing to execute expedited field safety audit'
    },
    {
      id: 'BUDGET_OVERRUN_CRITICAL',
      title: 'Severe Budget Overrun (>15%)',
      check: (asset, { budgetVariancePct }) => budgetVariancePct > 15,
      reason: (asset, { budgetVariancePct }) => `Expenditure exceeds approved budget by ${budgetVariancePct.toFixed(1)}% (> 15% variance)`,
      action: 'Hold project financial review and freeze discretionary outlay'
    },
    {
      id: 'SCHEDULE_DELAY_CRITICAL',
      title: 'Severe Schedule Delay (>60 Days)',
      check: (asset, { delayDays, scheduleStatus }) => scheduleStatus === 'DELAYED' || delayDays > 60,
      reason: (asset, { delayDays }) => `Milestone delivery delayed by ${Math.max(delayDays || 0, 65)} days (> 60 days)`,
      action: 'Review contractor performance and enforce contractual liquidated damages'
    },
    {
      id: 'URGENT_MAINTENANCE_PENDING',
      title: 'Unscheduled Urgent Maintenance',
      check: (asset, { hasUrgentUnscheduledMaintenance }) => !!hasUrgentUnscheduledMaintenance,
      reason: () => 'URGENT priority maintenance recommended but work order is not yet scheduled',
      action: 'Approve emergency repair budget and sanction urgent engineering work order'
    }
  ],

  WATCH: [
    {
      id: 'POOR_CONDITION',
      title: 'Poor Physical Condition',
      check: (asset) => asset.condition === 'POOR',
      reason: () => 'Physical condition is rated POOR with progressive deterioration noted',
      action: 'Schedule preventive maintenance intervention before next monsoon'
    },
    {
      id: 'WATCH_HEALTH_SCORE',
      title: 'Moderate Health Score (40-54)',
      check: (asset) => typeof asset.healthScore === 'number' && asset.healthScore >= 40 && asset.healthScore <= 54,
      reason: (asset) => `Health score in attention bracket (${Math.round(asset.healthScore)}/100)`,
      action: 'Increase inspection frequency to bi-monthly monitoring'
    },
    {
      id: 'BUDGET_OVERRUN_WATCH',
      title: 'Budget Variance Alert (5-15%)',
      check: (asset, { budgetVariancePct }) => budgetVariancePct >= 5 && budgetVariancePct <= 15,
      reason: (asset, { budgetVariancePct }) => `Budget variance elevated at +${budgetVariancePct.toFixed(1)}% (5-15% variance)`,
      action: 'Audit bill of quantities and evaluate contingency reserves'
    },
    {
      id: 'INSPECTION_OVERDUE_WATCH',
      title: 'Inspection Overdue (1-30 Days)',
      check: (asset, { daysOverdue }) => daysOverdue > 0 && daysOverdue <= 30,
      reason: (asset, { daysOverdue }) => `Safety inspection is overdue by ${daysOverdue} days (up to 30 days)`,
      action: 'Issue scheduling notice to district executive engineer'
    },
    {
      id: 'SCHEDULE_AT_RISK',
      title: 'Schedule Milestones At Risk',
      check: (asset, { delayDays, scheduleStatus }) => scheduleStatus === 'AT_RISK' || (delayDays > 0 && delayDays <= 60),
      reason: () => 'Project schedule is flagged AT RISK due to slow contractor mobilization',
      action: 'Request accelerated catch-up work plan from EPC contractor'
    }
  ]
};

/**
 * Evaluates an asset against executive attention rules.
 * @param {Object} asset - Asset document
 * @param {Object} extraContext - Optional precomputed metrics (daysOverdue, delayDays, urgentMaintenance, etc.)
 * @returns {Object} { priorityLevel: 'IMMEDIATE' | 'WATCH' | 'NONE', attentionFlag: boolean, attentionReasons: string[], recommendedAction: string, budgetVariancePct, daysOverdue, delayDays, scheduleStatus }
 */
function evaluateExecutiveAsset(asset, extraContext = {}) {
  const approvedBudget = asset.approvedBudget > 0 ? asset.approvedBudget : (asset.estimatedCost || 0);
  const amountSpent = asset.amountSpent > 0 ? asset.amountSpent : (asset.actualCost || 0);

  const budgetVariancePct = approvedBudget > 0
    ? ((amountSpent - approvedBudget) / approvedBudget) * 100
    : 0;

  // Calculate days overdue
  let daysOverdue = extraContext.daysOverdue;
  if (daysOverdue === undefined) {
    if (asset.nextInspection) {
      const nextDate = new Date(asset.nextInspection);
      const now = new Date();
      if (nextDate < now) {
        daysOverdue = Math.floor((now.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24));
      } else {
        daysOverdue = 0;
      }
    } else {
      daysOverdue = 0;
    }
  }

  // Calculate delay days
  let delayDays = extraContext.delayDays;
  if (delayDays === undefined) {
    if (asset.expectedEndDate && asset.plannedEndDate) {
      const expected = new Date(asset.expectedEndDate);
      const planned = new Date(asset.plannedEndDate);
      if (expected > planned) {
        delayDays = Math.floor((expected.getTime() - planned.getTime()) / (1000 * 60 * 60 * 24));
      } else {
        delayDays = 0;
      }
    } else {
      delayDays = asset.scheduleStatus === 'DELAYED' ? 75 : 0;
    }
  }

  const scheduleStatus = asset.scheduleStatus || (delayDays > 60 ? 'DELAYED' : (delayDays > 0 ? 'AT_RISK' : 'ON_TRACK'));
  const hasUrgentUnscheduledMaintenance = extraContext.hasUrgentUnscheduledMaintenance || false;

  const context = {
    budgetVariancePct,
    daysOverdue,
    delayDays,
    scheduleStatus,
    hasUrgentUnscheduledMaintenance
  };

  const immediateReasons = [];
  let immediateAction = null;

  for (const rule of EXECUTIVE_ATTENTION_RULES.IMMEDIATE) {
    if (rule.check(asset, context)) {
      immediateReasons.push(rule.reason(asset, context));
      if (!immediateAction) {
        immediateAction = rule.action;
      }
    }
  }

  if (immediateReasons.length > 0) {
    return {
      priorityLevel: 'IMMEDIATE',
      attentionFlag: true,
      attentionReasons: immediateReasons,
      recommendedAction: immediateAction || 'Conduct urgent inter-departmental review',
      budgetVariancePct,
      daysOverdue,
      delayDays,
      scheduleStatus,
      approvedBudget,
      amountSpent
    };
  }

  const watchReasons = [];
  let watchAction = null;

  for (const rule of EXECUTIVE_ATTENTION_RULES.WATCH) {
    if (rule.check(asset, context)) {
      watchReasons.push(rule.reason(asset, context));
      if (!watchAction) {
        watchAction = rule.action;
      }
    }
  }

  if (watchReasons.length > 0) {
    return {
      priorityLevel: 'WATCH',
      attentionFlag: true,
      attentionReasons: watchReasons,
      recommendedAction: watchAction || 'Monitor progress closely in bi-weekly executive dashboard review',
      budgetVariancePct,
      daysOverdue,
      delayDays,
      scheduleStatus,
      approvedBudget,
      amountSpent
    };
  }

  return {
    priorityLevel: 'NONE',
    attentionFlag: false,
    attentionReasons: [],
    recommendedAction: 'Project progressing within approved operational parameters',
    budgetVariancePct,
    daysOverdue,
    delayDays,
    scheduleStatus,
    approvedBudget,
    amountSpent
  };
}

/**
 * Calculates project progress percentage based on lifecycle stage or spend.
 * PLAN_DESIGN: 10, BUILD: 50 (or spend ratio), OPERATE: 100, MAINTAIN: 100, RECON: 100
 */
function deriveProgressPct(stage, approvedBudget, amountSpent) {
  switch (stage) {
    case 'PLAN_DESIGN':
      return 10;
    case 'BUILD':
      if (approvedBudget > 0 && amountSpent > 0) {
        return Math.min(95, Math.max(25, Math.round((amountSpent / approvedBudget) * 100)));
      }
      return 50;
    case 'OPERATE':
    case 'MAINTAIN':
    case 'RECONSTRUCTION_REPLACEMENT_RETIREMENT':
    default:
      return 100;
  }
}

module.exports = {
  EXECUTIVE_ATTENTION_RULES,
  evaluateExecutiveAsset,
  deriveProgressPct
};
