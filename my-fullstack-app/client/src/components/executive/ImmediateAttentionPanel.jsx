import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, ShieldAlert, Clock, IndianRupee } from 'lucide-react';
import { formatCurrencyCompact } from '../../utils/formatters';

export default function ImmediateAttentionPanel({ attentionProjects = [] }) {
  // Take top 5 items
  const topItems = (attentionProjects || []).slice(0, 5);

  if (!topItems || topItems.length === 0) {
    return (
      <div className="card" style={{ margin: 0 }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShieldAlert size={18} color="var(--good)" />
            <h3 className="card-title">Projects Requiring Attention</h3>
          </div>
        </div>
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--good)', fontSize: '13px', fontWeight: 600 }}>
          All active projects are progressing within approved budget and milestone parameters.
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ margin: 0, borderTop: '4px solid var(--critical)' }}>
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} color="var(--critical)" />
          <div>
            <h3 className="card-title">Top Priority Projects Requiring Immediate Executive Action</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Identified through automated multi-criteria governance rules
            </span>
          </div>
        </div>
        <Link
          to="/executive/attention"
          style={{
            fontSize: '12px',
            color: 'var(--navy-700)',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          View All ({attentionProjects.length}) &rarr;
        </Link>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {topItems.map((project) => {
          const isImmediate = project.priorityLevel === 'IMMEDIATE';
          const badgeBg = isImmediate ? '#FEE2E2' : '#FEF3C7';
          const badgeColor = isImmediate ? 'var(--critical)' : 'var(--fair)';
          const badgeBorder = isImmediate ? '#FECACA' : '#FDE68A';

          return (
            <div
              key={project._id || project.assetId}
              style={{
                backgroundColor: 'var(--bg)',
                border: '1px solid var(--border)',
                borderLeft: `4px solid ${badgeColor}`,
                borderRadius: 'var(--radius)',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
                gap: '12px'
              }}
            >
              <div style={{ flex: 1, minWidth: '260px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
                  <span
                    style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      backgroundColor: badgeBg,
                      color: badgeColor,
                      border: `1px solid ${badgeBorder}`,
                      padding: '2px 6px',
                      borderRadius: 'var(--radius)',
                      textTransform: 'uppercase'
                    }}
                  >
                    {project.priorityLevel}
                  </span>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '12px', color: 'var(--navy-700)' }}>
                    [{project.assetId}]
                  </span>
                  <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--navy-900)', fontWeight: 600 }}>
                    {project.projectName || project.name}
                  </h4>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    ({project.category})
                  </span>
                </div>

                {/* Key Numbers / Variance Pill */}
                <div style={{ display: 'flex', gap: '14px', fontSize: '12px', marginTop: '6px', flexWrap: 'wrap' }}>
                  <span>
                    Budget: <strong>{formatCurrencyCompact(project.approvedBudget)}</strong>
                  </span>
                  <span>
                    Spent: <strong>{formatCurrencyCompact(project.amountSpent)}</strong>
                  </span>
                  {project.budgetVariancePct !== 0 && (
                    <span style={{ color: project.budgetVariancePct > 0 ? 'var(--critical)' : 'var(--good)', fontWeight: 600 }}>
                      Variance: {project.budgetVariancePct > 0 ? `+${project.budgetVariancePct}%` : `${project.budgetVariancePct}%`}
                    </span>
                  )}
                  {project.scheduleStatus && (
                    <span style={{ color: project.scheduleStatus === 'DELAYED' ? 'var(--critical)' : (project.scheduleStatus === 'AT_RISK' ? 'var(--fair)' : 'var(--good)'), fontWeight: 600 }}>
                      Schedule: {project.scheduleStatus.replace('_', ' ')}
                    </span>
                  )}
                </div>

                {/* Triggered Reasons */}
                {project.attentionReasons && project.attentionReasons.length > 0 && (
                  <ul style={{ margin: '8px 0 0 16px', padding: 0, fontSize: '12px', color: 'var(--text)' }}>
                    {project.attentionReasons.slice(0, 2).map((reason, idx) => (
                      <li key={idx} style={{ marginBottom: '2px' }}>
                        {reason}
                      </li>
                    ))}
                    {project.attentionReasons.length > 2 && (
                      <li style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        +{project.attentionReasons.length - 2} more operational triggers
                      </li>
                    )}
                  </ul>
                )}

                {/* Recommended Action */}
                {project.recommendedAction && (
                  <div
                    style={{
                      marginTop: '8px',
                      fontSize: '11px',
                      backgroundColor: 'rgba(27, 64, 121, 0.06)',
                      padding: '4px 8px',
                      borderRadius: 'var(--radius)',
                      color: 'var(--navy-900)'
                    }}
                  >
                    <strong>Recommended Action:</strong> {project.recommendedAction}
                  </div>
                )}
              </div>

              {/* Action Link to Passport */}
              <div style={{ display: 'flex', alignItems: 'center', alignSelf: 'center' }}>
                <Link
                  to={`/assets/${project.assetId}`}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}
                >
                  View Details &rarr;
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
