import React from 'react';
import { Inbox } from 'lucide-react';

export default function EmptyState({
  title = 'No records found',
  description = 'There are no items to display matching the current criteria.',
  icon: Icon = Inbox,
  actionLabel,
  onAction
}) {
  return (
    <div
      style={{
        padding: '36px 20px',
        textAlign: 'center',
        backgroundColor: 'var(--surface)',
        border: '1px dashed var(--border)',
        borderRadius: 'var(--radius)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '12px 0'
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: 'var(--navy-100)',
          color: 'var(--navy-700)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '12px'
        }}
      >
        <Icon size={22} />
      </div>
      <h3 style={{ fontSize: '15px', color: 'var(--navy-900)', marginBottom: '4px' }}>
        {title}
      </h3>
      <p style={{ fontSize: '12px', color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto 16px' }}>
        {description}
      </p>
      {actionLabel && onAction && (
        <button type="button" className="btn btn-primary btn-sm" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
