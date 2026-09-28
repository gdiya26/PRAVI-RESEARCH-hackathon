export const CONDITION_COLORS = {
  GOOD: '#2E7D32',
  FAIR: '#B7791F',
  POOR: '#C2571A',
  CRITICAL: '#B3261E'
};

export const PRIORITY_COLORS = {
  LOW: '#2E7D32',
  MEDIUM: '#B7791F',
  HIGH: '#C2571A',
  URGENT: '#B3261E'
};

export function formatDate(dateString) {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'N/A';
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(d);
  } catch (e) {
    return 'N/A';
  }
}

export function formatDateTime(dateString) {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'N/A';
    return new Intl.DateTimeFormat('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(d);
  } catch (e) {
    return 'N/A';
  }
}

export function formatCurrency(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function getHealthBand(score) {
  if (score >= 70) return { label: 'Healthy', band: 'HEALTHY', color: '#2E7D32' };
  if (score >= 40) return { label: 'Attention Required', band: 'ATTENTION_REQUIRED', color: '#B7791F' };
  return { label: 'Critical', band: 'CRITICAL', color: '#B3261E' };
}
