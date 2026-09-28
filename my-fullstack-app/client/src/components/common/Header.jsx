import React from 'react';
import { ShieldCheck, Database, Building2 } from 'lucide-react';
import { SITE_NAME, TAGLINE } from '../../utils/constants';

export default function Header() {
  return (
    <header
      style={{
        backgroundColor: 'var(--navy-900)',
        color: '#FFFFFF',
        borderBottom: '3px solid var(--accent-gold)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        zIndex: 50,
        boxShadow: '0 2px 4px rgba(11, 31, 58, 0.15)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            padding: '8px',
            borderRadius: 'var(--radius)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Building2 size={24} color="#FFFFFF" />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <h1
              style={{
                margin: 0,
                fontSize: '18px',
                color: '#FFFFFF',
                fontWeight: 700,
                letterSpacing: '-0.3px',
                lineHeight: 1.2
              }}
            >
              Government Portal for Roads and Infrastructure
            </h1>
            <span
              style={{
                backgroundColor: 'rgba(201, 162, 39, 0.25)',
                color: '#F4D068',
                border: '1px solid rgba(201, 162, 39, 0.6)',
                padding: '2px 8px',
                borderRadius: 'var(--radius)',
                fontSize: '11px',
                fontWeight: 600,
                letterSpacing: '0.4px',
                textTransform: 'uppercase'
              }}
            >
              Made by Pravi
            </span>
          </div>
          <div
            style={{
              fontSize: '11px',
              color: 'var(--navy-100)',
              opacity: 0.85,
              marginTop: '2px'
            }}
          >
            Digital Asset Passport & Lifecycle Management Platform
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            padding: '4px 10px',
            borderRadius: 'var(--radius)',
            fontSize: '12px',
            fontWeight: 600,
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#10B981',
              display: 'inline-block'
            }}
          />
          <span style={{ color: '#FFFFFF' }}>Demo</span>
        </div>

        <div
          style={{
            fontSize: '11px',
            color: 'var(--navy-100)',
            textAlign: 'right',
            lineHeight: 1.3
          }}
        >
          <div style={{ fontWeight: 600, color: '#FFFFFF' }}>Government of Gujarat</div>
          <div>Roads & Buildings Department</div>
        </div>
      </div>
    </header>
  );
}
