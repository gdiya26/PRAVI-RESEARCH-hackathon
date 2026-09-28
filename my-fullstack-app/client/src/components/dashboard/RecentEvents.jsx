import React from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/formatters';
import { STAGE_LABELS } from '../../utils/constants';
import { ChevronRight, Clock } from 'lucide-react';

export default function RecentEvents({ events = [] }) {
  const navigate = useNavigate();

  return (
    <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <h3 className="card-title">Recent Lifecycle Events</h3>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Audit stream</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {(!events || events.length === 0) ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
            No recent lifecycle transitions logged.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {events.map((ev, idx) => (
              <div
                key={idx}
                onClick={() => navigate(`/assets/${ev.assetId}`)}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius)',
                  backgroundColor: 'var(--surface)',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'background-color 150ms ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--navy-100)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--surface)')}
              >
                <div style={{ minWidth: 0, flex: 1, paddingRight: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <span style={{ fontWeight: 700, fontSize: '12px', color: 'var(--navy-700)', fontFamily: 'monospace' }}>
                      {ev.assetId}
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        fontWeight: 600,
                        backgroundColor: 'var(--navy-100)',
                        color: 'var(--navy-800)',
                        padding: '1px 5px',
                        borderRadius: '2px'
                      }}
                    >
                      {STAGE_LABELS[ev.stage] || ev.stage}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: 'var(--text)',
                      marginTop: '2px',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}
                    title={ev.description}
                  >
                    {ev.description}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    By: {ev.by || 'Registry Engine'} &bull; Ref: {ev.docRef || 'N/A'}
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={11} />
                    {formatDate(ev.date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
