import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { MAINTENANCE_STATUSES } from '../../utils/constants';

export default function MaintenanceTable({
  records = [],
  showAssetColumn = true,
  onStatusChange,
  onCreateWorkOrder
}) {
  const navigate = useNavigate();

  if (!records || records.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
        No maintenance records found.
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="dense-table">
        <thead>
          <tr>
            <th>Ref #</th>
            {showAssetColumn && <th>Asset</th>}
            <th>Type</th>
            <th>Description</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Estimated Cost</th>
            <th>Contractor</th>
            <th>Status Action</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec) => {
            const assetObj = rec.asset;
            const assetId = typeof assetObj === 'object' ? assetObj?.assetId : rec.assetId;
            const assetName = typeof assetObj === 'object' ? assetObj?.name : rec.assetName;

            return (
              <tr key={rec._id || rec.id}>
                <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--navy-700)' }}>
                  MNT-{rec._id?.slice(-6) || 'REC'}
                </td>
                {showAssetColumn && (
                  <td>
                    {assetId ? (
                      <span
                        onClick={() => navigate(`/assets/${assetId}`)}
                        style={{
                          color: 'var(--navy-700)',
                          cursor: 'pointer',
                          fontWeight: 600,
                          textDecoration: 'underline'
                        }}
                      >
                        {assetId} {assetName ? `(${assetName})` : ''}
                      </span>
                    ) : (
                      <span style={{ color: 'var(--text-muted)' }}>-</span>
                    )}
                  </td>
                )}
                <td style={{ fontWeight: 600, color: 'var(--navy-900)' }}>
                  {rec.type}
                </td>
                <td style={{ maxWidth: '240px', fontSize: '12px', color: 'var(--text-muted)' }} title={rec.description}>
                  {rec.description || '-'}
                </td>
                <td>
                  <StatusBadge status={rec.priority} size="sm" />
                </td>
                <td>
                  <StatusBadge status={rec.status} size="sm" />
                </td>
                <td style={{ fontWeight: 600 }}>
                  {formatCurrency(rec.cost)}
                </td>
                <td style={{ fontSize: '12px' }}>
                  {rec.contractor || 'PWD Maintenance Division'}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    {onStatusChange && (
                      <select
                        className="form-control"
                        style={{ fontSize: '11px', padding: '3px 6px', width: 'auto' }}
                        value={rec.status}
                        onChange={(e) => onStatusChange(rec._id, e.target.value)}
                      >
                        {MAINTENANCE_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    )}
                    {onCreateWorkOrder && rec.status === 'RECOMMENDED' && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '10px', padding: '2px 6px' }}
                        onClick={() => onCreateWorkOrder(rec)}
                      >
                        Create WO
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
