import React from 'react';
import { useNavigate } from 'react-router-dom';
import ConditionBadge from '../common/ConditionBadge';
import HealthScore from '../common/HealthScore';
import { AlertTriangle, ChevronRight } from 'lucide-react';

export default function CriticalAssetList({ assets = [] }) {
  const navigate = useNavigate();

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <AlertTriangle size={16} color="var(--critical)" />
          <h3 className="card-title" style={{ color: 'var(--critical)' }}>
            Critical Infrastructure Watchlist
          </h3>
        </div>
        <span
          style={{
            fontSize: '11px',
            fontWeight: 700,
            backgroundColor: '#FEE2E2',
            color: 'var(--critical)',
            padding: '2px 6px',
            borderRadius: 'var(--radius)'
          }}
        >
          {assets.length} Requiring Immediate Action
        </span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {(!assets || assets.length === 0) ? (
          <div style={{ padding: '24px', textAlign: 'center', color: 'var(--good)', fontSize: '13px', fontWeight: 600 }}>
            ✓ No infrastructure assets currently in Critical health status.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {assets.map((asset) => (
              <div
                key={asset.assetId}
                onClick={() => navigate(`/assets/${asset.assetId}`)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 12px',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid #FECACA',
                  borderLeft: '4px solid var(--critical)',
                  borderRadius: 'var(--radius)',
                  cursor: 'pointer',
                  transition: 'background-color 150ms ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface)')}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--navy-900)', fontFamily: 'monospace' }}>
                      {asset.assetId}
                    </span>
                    <ConditionBadge condition={asset.condition} size="sm" />
                  </div>
                  <div
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--navy-900)',
                      marginTop: '2px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                  >
                    {asset.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                    {asset.type} &bull; {asset.location?.address || 'Ahmedabad District'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: '12px' }}>
                  <HealthScore score={asset.healthScore} compact />
                  <ChevronRight size={16} color="var(--navy-700)" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
