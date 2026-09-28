import React from 'react';
import { Link } from 'react-router-dom';
import { Building2, LogOut, UserCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

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

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        {/* User Status / Account Indicator */}
        {user ? (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '3px 10px',
              borderRadius: 'var(--radius)',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}
          >
            <UserCheck size={14} color="var(--accent-gold)" />
            <div style={{ fontSize: '11px', lineHeight: 1.2, textAlign: 'left' }}>
              <div style={{ fontWeight: 700, color: '#FFFFFF' }}>{user.name}</div>
              <div style={{ color: 'var(--navy-100)', fontSize: '10px' }}>{user.title}</div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="btn btn-secondary btn-sm"
              style={{
                padding: '2px 6px',
                fontSize: '11px',
                marginLeft: '4px',
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                borderColor: 'transparent'
              }}
              title="Sign out of portal"
            >
              <LogOut size={12} />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="btn btn-secondary btn-sm"
            style={{
              backgroundColor: 'var(--accent-gold)',
              color: 'var(--navy-900)',
              borderColor: 'var(--accent-gold)',
              fontWeight: 700
            }}
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
