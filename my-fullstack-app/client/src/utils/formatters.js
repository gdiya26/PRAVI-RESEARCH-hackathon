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

export function formatCurrencyFull(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatCurrencyCompact(amount) {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  const val = Number(amount);
  const abs = Math.abs(val);
  const sign = val < 0 ? '-' : '';

  if (abs >= 10000000) {
    // 1 Crore = 10,000,000
    const cr = abs / 10000000;
    return `${sign}₹${cr >= 100 ? cr.toFixed(0) : cr.toFixed(1).replace(/\.0$/, '')} Cr`;
  }
  if (abs >= 100000) {
    // 1 Lakh = 100,000
    const lk = abs / 100000;
    return `${sign}₹${lk >= 100 ? lk.toFixed(0) : lk.toFixed(1).replace(/\.0$/, '')} L`;
  }
  return formatCurrencyFull(amount);
}

export function formatCurrency(amount, compact = false) {
  if (compact) {
    return formatCurrencyCompact(amount);
  }
  return formatCurrencyFull(amount);
}

export function getHealthBand(score) {
  if (score >= 70) return { label: 'Healthy', band: 'HEALTHY', color: '#2E7D32' };
  if (score >= 40) return { label: 'Attention Required', band: 'ATTENTION_REQUIRED', color: '#B7791F' };
  return { label: 'Critical', band: 'CRITICAL', color: '#B3261E' };
}
