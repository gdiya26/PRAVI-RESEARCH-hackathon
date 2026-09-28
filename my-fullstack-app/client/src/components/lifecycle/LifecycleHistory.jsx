import React from 'react';
import { Calendar, User, DollarSign, FileText } from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/formatters';
import { STAGE_LABELS } from '../../utils/constants';

export default function LifecycleHistory({ history = [] }) {
  if (!history || history.length === 0) {
    return (
      <div style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '12px 0' }}>
        No lifecycle events recorded for this asset yet.
      </div>
    );
  }

  // Sort descending (latest first)
  const sorted = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {sorted.map((item, idx) => {
        const stageLabel = STAGE_LABELS[item.stage] || item.stage;
        return (
          <div
            key={item._id || idx}
            style={{
              display: 'flex',
              gap: '14px',
              padding: '12px 14px',
              backgroundColor: 'var(--surface)',
              border: '1px solid var(--border)',
              borderLeft: '4px solid var(--navy-700)',
              borderRadius: 'var(--radius)'
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--navy-900)'
                  }}
                >
                  Stage: {stageLabel}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={13} />
                  {formatDate(item.date)}
                </span>
              </div>

              <p style={{ fontSize: '13px', color: 'var(--text)', margin: '4px 0 8px' }}>
                {item.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '11px', color: 'var(--text-muted)' }}>
                {item.by && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <User size={12} color="var(--navy-700)" />
                    Authorized by: <strong style={{ color: 'var(--navy-900)' }}>{item.by}</strong>
                  </span>
                )}
                {item.cost > 0 && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <DollarSign size={12} color="var(--good)" />
                    Cost: <strong style={{ color: 'var(--navy-900)' }}>{formatCurrency(item.cost)}</strong>
                  </span>
                )}
                {item.docRef && (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <FileText size={12} color="var(--navy-700)" />
                    Doc Ref: <strong style={{ color: 'var(--navy-900)' }}>{item.docRef}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
