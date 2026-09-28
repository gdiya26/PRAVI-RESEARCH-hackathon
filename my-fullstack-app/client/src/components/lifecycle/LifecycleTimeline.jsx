import React from 'react';
import { Check, Circle } from 'lucide-react';
import { LIFECYCLE_STAGES, STAGE_LABELS } from '../../utils/constants';

export default function LifecycleTimeline({ currentStage = 'PLAN_DESIGN' }) {
  const currentIndex = LIFECYCLE_STAGES.indexOf(currentStage);

  return (
    <div style={{ padding: '20px 10px', position: 'relative' }}>
      {/* Background connecting bar */}
      <div
        style={{
          position: 'absolute',
          top: '38px',
          left: '5%',
          right: '5%',
          height: '4px',
          backgroundColor: 'var(--border)',
          zIndex: 1
        }}
      >
        <div
          style={{
            height: '100%',
            backgroundColor: 'var(--navy-700)',
            width: `${Math.max(0, (currentIndex / (LIFECYCLE_STAGES.length - 1)) * 100)}%`,
            transition: 'width 300ms ease'
          }}
        />
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          position: 'relative',
          zIndex: 2
        }}
      >
        {LIFECYCLE_STAGES.map((stageKey, idx) => {
          const isCompleted = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const isFuture = idx > currentIndex;

          let circleBg = 'var(--surface)';
          let circleBorder = 'var(--border)';
          let circleColor = 'var(--text-muted)';

          if (isCompleted) {
            circleBg = 'var(--good)';
            circleBorder = 'var(--good)';
            circleColor = '#FFFFFF';
          } else if (isCurrent) {
            circleBg = 'var(--navy-700)';
            circleBorder = 'var(--accent-gold)';
            circleColor = '#FFFFFF';
          }

          return (
            <div
              key={stageKey}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                width: '18%'
              }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: circleBg,
                  border: `3px solid ${circleBorder}`,
                  color: circleColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '13px',
                  boxShadow: isCurrent ? '0 0 0 4px rgba(201, 162, 39, 0.25)' : 'none',
                  marginBottom: '8px',
                  transition: 'all 200ms ease'
                }}
              >
                {isCompleted ? <Check size={18} strokeWidth={3} /> : idx + 1}
              </div>

              <span
                style={{
                  fontSize: '12px',
                  fontWeight: isCurrent ? 700 : isCompleted ? 600 : 400,
                  color: isCurrent ? 'var(--navy-900)' : isCompleted ? 'var(--text)' : 'var(--text-muted)',
                  lineHeight: 1.3
                }}
              >
                {STAGE_LABELS[stageKey]}
              </span>

              {isCurrent && (
                <span
                  style={{
                    marginTop: '4px',
                    fontSize: '10px',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    backgroundColor: 'rgba(201, 162, 39, 0.2)',
                    color: '#8C6F10',
                    border: '1px solid var(--accent-gold)',
                    padding: '1px 6px',
                    borderRadius: 'var(--radius)'
                  }}
                >
                  Current
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
