import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorState({
  title = 'Failed to load data',
  message = 'An error occurred while fetching information from the registry.',
  onRetry
}) {
  return (
    <div
      style={{
        padding: '24px',
        backgroundColor: '#FEE2E2',
        border: '1px solid #FECACA',
        borderRadius: 'var(--radius)',
        color: 'var(--critical)',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '14px',
        margin: '16px 0'
      }}
    >
      <AlertCircle size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
      <div style={{ flex: 1 }}>
        <h4 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700, color: 'var(--critical)' }}>
          {title}
        </h4>
        <p style={{ margin: 0, fontSize: '13px', color: '#991B1B' }}>
          {message}
        </p>
        {onRetry && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={onRetry}
            style={{
              marginTop: '12px',
              backgroundColor: '#FFFFFF',
              borderColor: 'var(--critical)',
              color: 'var(--critical)'
            }}
          >
            <RefreshCw size={12} />
            Retry Request
          </button>
        )}
      </div>
    </div>
  );
}
