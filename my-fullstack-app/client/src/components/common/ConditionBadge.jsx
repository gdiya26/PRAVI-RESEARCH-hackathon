import React from 'react';

const BADGE_CONFIG = {
  GOOD: {
    label: 'GOOD',
    bg: '#E8F5E9',
    color: 'var(--good)',
    borderColor: '#C8E6C9'
  },
  FAIR: {
    label: 'FAIR',
    bg: '#FEF3C7',
    color: 'var(--fair)',
    borderColor: '#FDE68A'
  },
  POOR: {
    label: 'POOR',
    bg: '#FFEDD5',
    color: 'var(--poor)',
    borderColor: '#FED7AA'
  },
  CRITICAL: {
    label: 'CRITICAL',
    bg: '#FEE2E2',
    color: 'var(--critical)',
    borderColor: '#FECACA'
  }
};

export default function ConditionBadge({ condition, size = 'md' }) {
  const norm = (condition || '').toUpperCase();
  const config = BADGE_CONFIG[norm] || {
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
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        borderRadius: 'var(--radius)'
      }}
    >
      <span
        style={{
          width: isSmall ? '5px' : '6px',
          height: isSmall ? '5px' : '6px',
          borderRadius: '50%',
          backgroundColor: config.color,
          display: 'inline-block'
        }}
      />
      {config.label}
    </span>
  );
}
