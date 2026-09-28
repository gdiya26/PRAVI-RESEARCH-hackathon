import React from 'react';
import { useNavigate } from 'react-router-dom';
import ConditionBadge from '../common/ConditionBadge';
import { formatDate } from '../../utils/formatters';

export default function InspectionTable({ inspections = [], showAssetColumn = true }) {
  const navigate = useNavigate();

  if (!inspections || inspections.length === 0) {
    return (
      <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
        No inspection records found.
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="dense-table">
        <thead>
          <tr>
            <th>Ref #</th>
            <th>Date</th>
            {showAssetColumn && <th>Asset</th>}
            <th>Inspector</th>
            <th>Evaluated Condition</th>
            <th>Observed Defects</th>
            <th>Field Remarks</th>
          </tr>
        </thead>
        <tbody>
          {inspections.map((insp) => {
            const assetObj = insp.asset;
            const assetId = typeof assetObj === 'object' ? assetObj?.assetId : insp.assetId;
            const assetName = typeof assetObj === 'object' ? assetObj?.name : insp.assetName;

            return (
              <tr key={insp._id || insp.id}>
                <td style={{ fontFamily: 'monospace', fontWeight: 600, color: 'var(--navy-700)' }}>
                  INSP-{insp._id?.slice(-6) || 'REC'}
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  {formatDate(insp.date)}
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
                <td style={{ fontWeight: 500 }}>
                  {insp.inspector || 'Senior Field Engineer'}
                </td>
                <td>
                  <ConditionBadge condition={insp.condition} size="sm" />
                </td>
                <td>
                  {insp.defects && insp.defects.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                      {insp.defects.map((d, dIdx) => {
                        const isHigh = d.severity === 'HIGH';
                        return (
                          <span
                            key={dIdx}
                            style={{
                              fontSize: '11px',
                              padding: '2px 6px',
                              borderRadius: 'var(--radius)',
                              backgroundColor: isHigh ? '#FEE2E2' : '#FEF3C7',
                              color: isHigh ? 'var(--critical)' : 'var(--fair)',
                              border: `1px solid ${isHigh ? '#FECACA' : '#FDE68A'}`,
                              fontWeight: 600
                            }}
                            title={d.notes || ''}
                          >
                            {d.defectType} ({d.severity})
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <span style={{ color: 'var(--good)', fontSize: '12px' }}>None reported</span>
                  )}
                </td>
                <td style={{ maxWidth: '240px', fontSize: '12px', color: 'var(--text-muted)' }}>
                  {insp.remarks || '-'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
