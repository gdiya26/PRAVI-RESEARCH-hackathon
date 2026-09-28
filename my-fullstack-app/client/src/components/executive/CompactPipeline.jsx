import React from 'react';
import { STAGE_LABELS, LIFECYCLE_STAGES } from '../../utils/constants';
import { formatCurrencyCompact } from '../../utils/formatters';
import { Layers } from 'lucide-react';

export default function CompactPipeline({ budgetByStage = [] }) {
  // Convert budgetByStage to a stage lookup map
  const stageMap = {};
  for (const item of budgetByStage) {
    stageMap[item.stage] = item;
  }

  return (
    <div className="card" style={{ margin: 0 }}>
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Layers size={18} color="var(--navy-700)" />
          <h3 className="card-title">Portfolio Capital Allocation Pipeline</h3>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Five-Stage Infrastructure Lifecycle Distribution
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px'
        }}
      >
        {LIFECYCLE_STAGES.map((stageKey, idx) => {
          const stageData = stageMap[stageKey] || { count: 0, approved: 0, spent: 0 };
          const label = STAGE_LABELS[stageKey] || stageKey;

          return (
            <div
              key={stageKey}
              style={{
                backgroundColor: 'var(--surface)',
                border: '1px solid var(--border)',
                borderTop: '3px solid var(--navy-700)',
                borderRadius: 'var(--radius)',
                padding: '12px 14px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--navy-700)' }}>
                    STAGE 0{idx + 1}
                  </span>
                  <span
                    style={{
                      backgroundColor: 'var(--navy-100)',
                      color: 'var(--navy-900)',
                      fontSize: '11px',
                      fontWeight: 700,
                      padding: '1px 6px',
                      borderRadius: '10px'
                    }}
                  >
                    {stageData.count} {stageData.count === 1 ? 'Project' : 'Projects'}
                  </span>
                </div>

                <div
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: 'var(--navy-900)',
                    lineHeight: 1.2,
                    minHeight: '32px',
                    marginBottom: '8px'
                  }}
                >
                  {label}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '8px', fontSize: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Approved:</span>
                  <strong style={{ color: 'var(--navy-900)' }}>{formatCurrencyCompact(stageData.approved)}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Disbursed:</span>
                  <strong style={{ color: 'var(--navy-700)' }}>{formatCurrencyCompact(stageData.spent)}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
