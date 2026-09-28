import React from 'react';
import { FOOTER_TEXT } from '../../utils/constants';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: 'var(--navy-900)',
        color: 'var(--navy-100)',
        padding: '14px 24px',
        fontSize: '12px',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        lineHeight: 1.5
      }}
    >
      <div>{FOOTER_TEXT}</div>
      <div style={{ marginTop: '4px', opacity: 0.7, fontSize: '11px' }}>
        Decision-support system for state highway networks, urban arterials, bridges, flyovers & traffic assets.
      </div>
    </footer>
  );
}
