import React from 'react';

const STATUS_CONFIG = {
  // Work Orders & Maintenance Statuses
  OPEN: { label: 'OPEN', bg: '#EFF6FF', color: 'var(--navy-700)', borderColor: '#BFDBFE' },
  RECOMMENDED: { label: 'RECOMMENDED', bg: '#FEF3C7', color: 'var(--fair)', borderColor: '#FDE68A' },
  SCHEDULED: { label: 'SCHEDULED', bg: '#E0E7FF', color: 'var(--navy-600)', borderColor: '#C7D2FE' },
  IN_PROGRESS: { label: 'IN PROGRESS', bg: '#FEF3C7', color: 'var(--fair)', borderColor: '#FDE68A' },
  COMPLETED: { label: 'COMPLETED', bg: '#E8F5E9', color: 'var(--good)', borderColor: '#C8E6C9' },
  VERIFIED: { label: 'VERIFIED', bg: '#E8F5E9', color: 'var(--good)', borderColor: '#A5D6A7' },
  CLOSED: { label: 'CLOSED', bg: 'var(--navy-100)', color: 'var(--navy-800)', borderColor: '#CBD5E1' },
  ACTIVE: { label: 'ACTIVE', bg: '#E8F5E9', color: 'var(--good)', borderColor: '#C8E6C9' },

  // Priorities
  LOW: { label: 'LOW', bg: '#E8F5E9', color: 'var(--good)', borderColor: '#C8E6C9' },
  MEDIUM: { label: 'MEDIUM', bg: '#FEF3C7', color: 'var(--fair)', borderColor: '#FDE68A' },
  HIGH: { label: 'HIGH', bg: '#FFEDD5', color: 'var(--poor)', borderColor: '#FED7AA' },
  URGENT: { label: 'URGENT', bg: '#FEE2E2', color: 'var(--critical)', borderColor: '#FECACA' }
};

export default function StatusBadge({ status, size = 'md' }) {
  const norm = (status || '').toUpperCase();
  const config = STATUS_CONFIG[norm] || {
    label: norm || 'UNKNOWN',
    bg: 'var(--navy-100)',
    color: 'var(--navy-800)',
    borderColor: 'var(--border)'
  };

  const isSmall = size === 'sm';

  return (
    <span
      className="badge"
      style={{
        backgroundColor: config.bg,
        color: config.color,
        borderColor: config.borderColor,
        fontSize: isSmall ? '10px' : '11px',
        padding: isSmall ? '1px 5px' : '2px 8px',
        fontWeight: 700,
        letterSpacing: '0.4px',
        borderRadius: 'var(--radius)'
      }}
    >
      {config.label}
    </span>
  );
}
