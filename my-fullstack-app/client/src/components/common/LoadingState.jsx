import React from 'react';
import { Loader2 } from 'lucide-react';

export default function LoadingState({ message = 'Loading infrastructure data...' }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        color: 'var(--navy-700)',
        gap: '12px'
      }}
    >
      <Loader2
        size={32}
        className="spin"
        style={{
          animation: 'spin 1s linear infinite'
        }}
      />
      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy-900)' }}>
        {message}
      </span>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
