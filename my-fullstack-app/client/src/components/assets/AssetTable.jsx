import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Calendar, ChevronRight } from 'lucide-react';
import ConditionBadge from '../common/ConditionBadge';
import HealthScore from '../common/HealthScore';
import { formatDate } from '../../utils/formatters';
import { STAGE_LABELS } from '../../utils/constants';

export default function AssetTable({ assets = [] }) {
  const navigate = useNavigate();
  const now = new Date();

  return (
    <div className="table-container">
      <table className="dense-table">
        <thead>
          <tr>
            <th>Asset ID</th>
            <th>Name</th>
            <th>Type</th>
            <th>Location</th>
            <th>Lifecycle Stage</th>
            <th>Condition</th>
            <th>Health Score</th>
            <th>Next Inspection</th>
            <th style={{ textAlign: 'right' }}>Passport</th>
          </tr>
        </thead>
        <tbody>
          {assets.map((asset) => {
            const isOverdue = asset.nextInspection && new Date(asset.nextInspection) < now;
            const stageLabel = STAGE_LABELS[asset.lifecycleStage] || asset.lifecycleStage;

            return (
              <tr
                key={asset._id || asset.assetId}
                className="clickable-row"
                onClick={() => navigate(`/assets/${asset.assetId}`)}
              >
                <td style={{ fontWeight: 700, color: 'var(--navy-700)', fontFamily: 'monospace' }}>
                  {asset.assetId}
                </td>
                <td style={{ fontWeight: 600, color: 'var(--navy-900)' }}>
                  {asset.name}
                </td>
                <td style={{ color: 'var(--text-muted)' }}>
                  {asset.type}
                </td>
                <td style={{ maxWidth: '180px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={asset.location?.address}>
                  {asset.location?.address || 'Ahmedabad Corridor'}
                </td>
                <td>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      backgroundColor: 'var(--navy-100)',
                      color: 'var(--navy-800)',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius)'
                    }}
                  >
                    {stageLabel}
                  </span>
                </td>
                <td>
                  <ConditionBadge condition={asset.condition} size="sm" />
                </td>
                <td>
                  <HealthScore score={asset.healthScore} compact />
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: isOverdue ? 'var(--critical)' : 'inherit', fontWeight: isOverdue ? 700 : 400 }}>
                      {formatDate(asset.nextInspection)}
                    </span>
                    {isOverdue && (
                      <span
                        className="badge badge-critical"
                        style={{ fontSize: '9px', padding: '1px 4px' }}
                        title="Inspection is overdue!"
                      >
                        OVERDUE
                      </span>
                    )}
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/assets/${asset.assetId}`);
                    }}
                  >
                    View Passport <ChevronRight size={14} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
