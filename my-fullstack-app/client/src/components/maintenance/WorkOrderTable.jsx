import React from 'react';
import { useNavigate } from 'react-router-dom';
import StatusBadge from '../common/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { WORK_ORDER_STATUSES } from '../../utils/constants';
import { Play, CheckCircle2, Lock } from 'lucide-react';

export default function WorkOrderTable({
  workOrders = [],
  showAssetColumn = true,
  onStatusChange
}) {
  const navigate = useNavigate();

  if (!workOrders || workOrders.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
        No work orders logged for this asset.
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="dense-table">
        <thead>
          <tr>
            <th>WO #</th>
            {showAssetColumn && <th>Asset</th>}
            <th>Issue / Work Description</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Department</th>
            <th>Estimated Cost</th>
            <th>Workflow Action</th>
          </tr>
        </thead>
        <tbody>
          {workOrders.map((wo) => {
            const assetObj = wo.asset;
            const assetId = typeof assetObj === 'object' ? assetObj?.assetId : wo.assetId;
            const assetName = typeof assetObj === 'object' ? assetObj?.name : wo.assetName;

            return (
              <tr key={wo._id || wo.id}>
                <td style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--navy-700)' }}>
                  {wo.woNumber || `WO-${wo._id?.slice(-6)}`}
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
                <td style={{ maxWidth: '240px', fontSize: '13px' }}>
                  <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{wo.issue}</div>
                  {wo.maintenanceId && (
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Linked Maintenance: {typeof wo.maintenanceId === 'object' ? wo.maintenanceId.type : 'Scheduled'}
                    </div>
                  )}
                </td>
                <td>
                  <StatusBadge status={wo.priority} size="sm" />
                </td>
                <td>
                  <StatusBadge status={wo.status} size="sm" />
                </td>
                <td style={{ fontSize: '12px' }}>
                  {wo.assignedDepartment || 'Highway Maintenance Division'}
                </td>
                <td style={{ fontWeight: 600 }}>
                  {formatCurrency(wo.estimatedCost)}
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                    {/* Status Dropdown */}
                    {onStatusChange && (
                      <select
                        className="form-control"
                        style={{ fontSize: '11px', padding: '3px 6px', width: 'auto' }}
                        value={wo.status}
                        onChange={(e) => onStatusChange(wo._id || wo.woNumber, e.target.value)}
                      >
                        {WORK_ORDER_STATUSES.map((st) => (
                          <option key={st} value={st}>
                            {st}
                          </option>
                        ))}
                      </select>
                    )}

                    {/* Quick Step Buttons */}
                    {onStatusChange && wo.status === 'OPEN' && (
                      <button
                        type="button"
                        className="btn btn-secondary btn-sm"
                        style={{ fontSize: '11px', padding: '3px 8px' }}
                        onClick={() => onStatusChange(wo._id || wo.woNumber, 'IN_PROGRESS')}
                        title="Start Work Order"
                      >
                        <Play size={11} /> Start
                      </button>
                    )}

                    {onStatusChange && wo.status === 'IN_PROGRESS' && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{ fontSize: '11px', padding: '3px 8px' }}
                        onClick={() => onStatusChange(wo._id || wo.woNumber, 'COMPLETED')}
                        title="Mark Completed"
                      >
                        <CheckCircle2 size={11} /> Complete
                      </button>
                    )}

                    {onStatusChange && wo.status === 'COMPLETED' && (
                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        style={{
                          fontSize: '11px',
                          padding: '3px 8px',
                          backgroundColor: 'var(--good)',
                          borderColor: 'var(--good)'
                        }}
                        onClick={() => onStatusChange(wo._id || wo.woNumber, 'CLOSED')}
                        title="Close and Verify (Improves asset condition & returns to OPERATE)"
                      >
                        <Lock size={11} /> Close & Verify
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
