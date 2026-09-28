import React from 'react';
import { HEALTH_DISCLAIMER } from '../../utils/constants';
import { getHealthBand } from '../../utils/formatters';

export default function HealthScore({ score = 100, showDisclaimer = false, compact = false }) {
  const safeScore = Math.max(0, Math.min(100, Math.round(Number(score) || 0)));
  const { label, color } = getHealthBand(safeScore);

  if (compact) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
        <div
          style={{
            width: '42px',
            height: '20px',
            backgroundColor: 'var(--navy-100)',
            borderRadius: '2px',
            overflow: 'hidden',
            position: 'relative'
          }}
          title={HEALTH_DISCLAIMER}
        >
          <div
            style={{
              width: `${safeScore}%`,
              height: '100%',
              backgroundColor: color,
              transition: 'width 250ms ease-in-out'
            }}
          />
        </div>
        <span style={{ fontWeight: 700, fontSize: '13px', color: color }}>
          {safeScore}
        </span>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
          ({label})
        </span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
          <span style={{ fontSize: '24px', fontWeight: 800, color: color, lineHeight: 1 }}>
            {safeScore}
          </span>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/ 100</span>
        </div>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            textTransform: 'uppercase',
            color: color,
            backgroundColor: safeScore >= 70 ? '#E8F5E9' : safeScore >= 40 ? '#FEF3C7' : '#FEE2E2',
            padding: '2px 8px',
            borderRadius: 'var(--radius)',
            border: `1px solid ${color}40`
          }}
        >
          {label}
        </span>
      </div>

      <div
        style={{
          width: '100%',
          height: '8px',
          backgroundColor: 'var(--navy-100)',
          borderRadius: '2px',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            width: `${safeScore}%`,
            height: '100%',
            backgroundColor: color,
            borderRadius: '2px',
            transition: 'width 300ms ease'
          }}
        />
      </div>

      {showDisclaimer && (
        <div
          style={{
            fontSize: '11px',
            color: 'var(--text-muted)',
            fontStyle: 'italic',
            marginTop: '2px',
            lineHeight: 1.3
          }}
        >
          * {HEALTH_DISCLAIMER}
        </div>
      )}
    </div>
  );
}
