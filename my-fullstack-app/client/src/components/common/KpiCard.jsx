import React from 'react';

export default function KpiCard({ title, value, subtitle, icon: Icon, alert = false, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderTop: alert ? '3px solid var(--critical)' : '3px solid var(--navy-700)',
        borderRadius: 'var(--radius)',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'border-color 150ms ease-in-out, box-shadow 150ms ease-in-out'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
        <span
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}
        >
          {title}
        </span>
        {Icon && (
          <div
            style={{
              color: alert ? 'var(--critical)' : 'var(--navy-700)',
              backgroundColor: alert ? '#FEE2E2' : 'var(--navy-100)',
              padding: '6px',
              borderRadius: 'var(--radius)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon size={18} />
          </div>
        )}
      </div>

      <div style={{ marginTop: '8px' }}>
        <div
          style={{
            fontSize: '26px',
            fontWeight: 700,
            color: alert ? 'var(--critical)' : 'var(--navy-900)',
            lineHeight: 1.1
          }}
        >
          {value !== undefined && value !== null ? value : '-'}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: '11px',
              color: 'var(--text-muted)',
              marginTop: '4px'
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
    </div>
  );
}
