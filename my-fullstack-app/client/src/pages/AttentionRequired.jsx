import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Clock,
  Activity,
  Calendar,
  CheckCircle,
  RefreshCw
} from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import executiveService from '../services/executiveService';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import HealthScore from '../components/common/HealthScore';
import { formatCurrencyCompact, formatCurrencyFull, formatDate } from '../utils/formatters';
import { HEALTH_DISCLAIMER, STAGE_LABELS } from '../utils/constants';

export default function AttentionRequired() {
  const fetchAttention = useCallback(() => executiveService.getAttentionProjects(), []);
  const { data: projects, loading, error, refetch } = useFetch(fetchAttention, []);

  if (loading) return <LoadingState message="Loading Executive Attention & Escalation Projects..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;

  const immediateProjects = (projects || []).filter((p) => p.priorityLevel === 'IMMEDIATE');
  const watchProjects = (projects || []).filter((p) => p.priorityLevel === 'WATCH');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title Strip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--critical)', fontWeight: 700, letterSpacing: '0.6px' }}>
            Executive Escalation & Risk Control
          </span>
          <h2 style={{ margin: '2px 0 0', fontSize: '22px', color: 'var(--navy-900)', fontWeight: 700 }}>
            Projects Requiring Strategic Intervention
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            High-priority projects surfaced by automated governance rules across physical condition, safety inspection deadlines, and budget variance.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={refetch}
        >
          <RefreshCw size={13} /> Refresh List
        </button>
      </div>

      {(!projects || projects.length === 0) ? (
        <EmptyState
          title="No Projects Require Attention"
          message="All monitored infrastructure assets are currently meeting design criteria, inspection schedules, and budget allocations."
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* SECTION 1: IMMEDIATE ATTENTION */}
          {immediateProjects.length > 0 && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: '2px solid var(--critical)'
                }}
              >
                <AlertTriangle size={20} color="var(--critical)" />
                <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--critical)', fontWeight: 700 }}>
                  IMMEDIATE ACTION REQUIRED ({immediateProjects.length} Projects)
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
                {immediateProjects.map((project) => (
                  <AttentionProjectCard key={project._id || project.assetId} project={project} isImmediate={true} />
                ))}
              </div>
            </div>
          )}

          {/* SECTION 2: WATCH LIST */}
          {watchProjects.length > 0 && (
            <div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px',
                  paddingBottom: '8px',
                  borderBottom: '2px solid var(--fair)'
                }}
              >
                <ShieldAlert size={20} color="var(--fair)" />
                <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--fair)', fontWeight: 700 }}>
                  EXECUTIVE WATCH LIST ({watchProjects.length} Projects)
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '14px' }}>
                {watchProjects.map((project) => (
                  <AttentionProjectCard key={project._id || project.assetId} project={project} isImmediate={false} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AttentionProjectCard({ project, isImmediate }) {
  const badgeBg = isImmediate ? '#FEE2E2' : '#FEF3C7';
  const badgeColor = isImmediate ? 'var(--critical)' : 'var(--fair)';
  const badgeBorder = isImmediate ? '#FECACA' : '#FDE68A';

  return (
    <div
      className="card"
      style={{
        margin: 0,
        borderLeft: `5px solid ${badgeColor}`,
        padding: '16px 20px',
        backgroundColor: 'var(--surface)'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ flex: 1, minWidth: '280px' }}>
          {/* Header Row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                backgroundColor: badgeBg,
                color: badgeColor,
                border: `1px solid ${badgeBorder}`,
                padding: '2px 8px',
                borderRadius: 'var(--radius)',
                textTransform: 'uppercase'
              }}
            >
              {project.priorityLevel}
            </span>
            <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '13px', color: 'var(--navy-700)' }}>
              [{project.assetId}]
            </span>
            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--navy-900)', fontWeight: 700 }}>
              {project.projectName || project.name}
            </h3>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              ({project.category} &bull; {project.type})
            </span>
          </div>

          <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Agency: <strong>{project.department}</strong> &bull; Contractor: <strong>{project.contractor || 'N/A'}</strong> &bull; Stage: <strong>{STAGE_LABELS[project.lifecycleStage] || project.lifecycleStage}</strong>
          </div>

          {/* Key Numbers Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: '10px',
              backgroundColor: 'var(--bg)',
              padding: '10px 14px',
              borderRadius: 'var(--radius)',
              border: '1px solid var(--border)',
              marginBottom: '12px'
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Approved Budget</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy-900)' }} title={formatCurrencyFull(project.approvedBudget)}>
                {formatCurrencyCompact(project.approvedBudget)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Amount Spent</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--navy-900)' }} title={formatCurrencyFull(project.amountSpent)}>
                {formatCurrencyCompact(project.amountSpent)}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Budget Variance</div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 700,
                  color: project.budgetVariancePct > 0 ? 'var(--critical)' : (project.budgetVariancePct < 0 ? 'var(--good)' : 'var(--text)')
                }}
              >
                {project.budgetVariancePct > 0 ? `+${project.budgetVariancePct}%` : `${project.budgetVariancePct}%`}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Inspection Overdue</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: project.daysOverdue > 30 ? 'var(--critical)' : (project.daysOverdue > 0 ? 'var(--fair)' : 'var(--good)') }}>
                {project.daysOverdue > 0 ? `${project.daysOverdue} Days` : 'On Schedule'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Schedule Status</div>
              <div style={{ fontSize: '13px', fontWeight: 700, color: project.scheduleStatus === 'DELAYED' ? 'var(--critical)' : (project.scheduleStatus === 'AT_RISK' ? 'var(--fair)' : 'var(--good)') }}>
                {(project.scheduleStatus || 'ON_TRACK').replace('_', ' ')}
              </div>
            </div>
          </div>

          {/* Triggered Reasons List */}
          <div style={{ marginBottom: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--navy-900)', marginBottom: '4px' }}>
              Governance Rule Triggers & Deficiencies:
            </div>
            <ul style={{ margin: '0 0 0 18px', padding: 0, fontSize: '12px', color: 'var(--text)' }}>
              {project.attentionReasons?.map((reason, idx) => (
                <li key={idx} style={{ marginBottom: '3px' }}>
                  {reason}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommended Executive Action */}
          {project.recommendedAction && (
            <div
              style={{
                backgroundColor: 'rgba(27, 64, 121, 0.08)',
                borderLeft: '3px solid var(--navy-700)',
                padding: '8px 12px',
                borderRadius: 'var(--radius)',
                fontSize: '12px',
                color: 'var(--navy-900)'
              }}
            >
              <strong>Recommended Department Action:</strong> {project.recommendedAction}
            </div>
          )}
        </div>

        {/* Health Score and Passport Link */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '14px', minWidth: '180px' }}>
          <div style={{ width: '100%', maxWidth: '200px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '2px', textAlign: 'right' }}>
              Structural Health Index
            </div>
            <HealthScore score={project.healthScore} showDisclaimer={false} />
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '4px', textAlign: 'right' }}>
              * {HEALTH_DISCLAIMER}
            </div>
          </div>

          <Link
            to={`/assets/${project.assetId}`}
            className="btn btn-primary btn-sm"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            Open Asset Passport <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
