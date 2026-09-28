import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Lock,
  User,
  ShieldCheck,
  ArrowRight,
  AlertCircle,
  Eye,
  EyeOff,
  Landmark,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useView } from '../context/ViewContext';
import { SITE_NAME, TAGLINE, FOOTER_TEXT } from '../utils/constants';

export default function Login() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const { setView } = useView();

  const [username, setUsername] = useState('executive');
  const [password, setPassword] = useState('executive123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already logged in, allow quick continuation
  const handleContinue = () => {
    if (user) {
      setView(user.view);
      navigate(user.defaultRoute || '/');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const res = login(username, password);
      setIsLoading(false);
      if (!res.success) {
        setErrorMsg(res.error);
      } else {
        setView(res.user.view);
      }
    }, 250);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--bg)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'var(--font-family)'
      }}
    >
      {/* Top Banner Bar */}
      <div
        style={{
          backgroundColor: 'var(--navy-900)',
          color: '#FFFFFF',
          padding: '12px 24px',
          borderBottom: '3px solid var(--accent-gold)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Building2 size={22} color="#FFFFFF" />
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#FFFFFF' }}>
            Government Portal for Roads and Infrastructure
          </span>
          <span
            style={{
              backgroundColor: 'rgba(201, 162, 39, 0.25)',
              color: '#F4D068',
              border: '1px solid rgba(201, 162, 39, 0.6)',
              padding: '2px 8px',
              borderRadius: 'var(--radius)',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}
          >
            Made by Pravi
          </span>
        </div>

        <div style={{ fontSize: '12px', color: 'var(--navy-100)', opacity: 0.9 }}>
          Government of Gujarat &bull; Roads & Buildings Department
        </div>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '30px 16px'
        }}
      >
        <div
          style={{
            maxWidth: '540px',
            width: '100%',
            backgroundColor: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            boxShadow: '0 4px 20px rgba(11, 31, 58, 0.1)',
            overflow: 'hidden'
          }}
        >
          {/* Card Header */}
          <div
            style={{
              backgroundColor: 'var(--navy-900)',
              color: '#FFFFFF',
              padding: '24px 28px',
              textAlign: 'center',
              borderBottom: '3px solid var(--accent-gold)'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '50%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '10px'
              }}
            >
              <Landmark size={26} color="var(--accent-gold)" />
            </div>

            <h2 style={{ margin: 0, fontSize: '20px', color: '#FFFFFF', fontWeight: 700 }}>
              Authorized Portal Access
            </h2>
            <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--navy-100)', opacity: 0.85 }}>
              "{TAGLINE}"
            </p>
          </div>

          {/* Card Body */}
          <div style={{ padding: '28px' }}>
            {/* If user already authenticated */}
            {user && (
              <div
                style={{
                  backgroundColor: '#E8F5E9',
                  border: '1px solid #A5D6A7',
                  borderRadius: 'var(--radius)',
                  padding: '12px 16px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--good)', fontWeight: 700, textTransform: 'uppercase' }}>
                    Currently Signed In
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy-900)' }}>
                    {user.name} ({user.roleLabel})
                  </div>
                </div>
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleContinue}
                >
                  Continue to Dashboard &rarr;
                </button>
              </div>
            )}

            {/* Error Message */}
            {errorMsg && (
              <div
                style={{
                  backgroundColor: '#FEE2E2',
                  border: '1px solid #FECACA',
                  borderRadius: 'var(--radius)',
                  padding: '10px 14px',
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--critical)',
                  fontSize: '13px',
                  fontWeight: 600
                }}
              >
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="username-input">
                  Username / Portal ID *
                </label>
                <div style={{ position: 'relative' }}>
                  <User
                    size={16}
                    style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  />
                  <input
                    id="username-input"
                    type="text"
                    className="form-control"
                    placeholder="Enter username (e.g. executive or engineer)"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={{ paddingLeft: '34px' }}
                    required
                  />
                </div>
              </div>

              <div className="form-group" style={{ margin: 0 }}>
                <label className="form-label" htmlFor="password-input">
                  Access Password *
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock
                    size={16}
                    style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  />
                  <input
                    id="password-input"
                    type={showPassword ? 'text' : 'password'}
                    className="form-control"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{ paddingLeft: '34px', paddingRight: '36px' }}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%', padding: '10px', fontSize: '14px', fontWeight: 600, marginTop: '6px' }}
                disabled={isLoading}
              >
                {isLoading ? 'Authenticating...' : 'Sign In to Portal'}
              </button>
            </form>


            {/* Credential Reference Table */}
            <div
              style={{
                marginTop: '20px',
                backgroundColor: 'var(--navy-100)',
                padding: '12px 14px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)'
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '12px', color: 'var(--navy-900)', marginBottom: '6px' }}>
                Verified Credentials Reference:
              </div>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ color: 'var(--text-muted)', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                    <th style={{ paddingBottom: '4px' }}>Dashboard / Role</th>
                    <th style={{ paddingBottom: '4px' }}>Username</th>
                    <th style={{ paddingBottom: '4px' }}>Password</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                    <td style={{ padding: '6px 0', fontWeight: 600, color: 'var(--navy-900)' }}>Executive View</td>
                    <td style={{ padding: '6px 0', fontFamily: 'monospace', fontWeight: 700, color: 'var(--navy-700)' }}>executive</td>
                    <td style={{ padding: '6px 0', fontFamily: 'monospace' }}>executive123</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px 0', fontWeight: 600, color: 'var(--navy-900)' }}>Engineering View</td>
                    <td style={{ padding: '6px 0', fontFamily: 'monospace', fontWeight: 700, color: 'var(--navy-700)' }}>engineer</td>
                    <td style={{ padding: '6px 0', fontFamily: 'monospace' }}>engineer123</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Official Footer Strip */}
      <footer
        style={{
          backgroundColor: 'var(--navy-900)',
          color: 'var(--navy-100)',
          padding: '12px 24px',
          fontSize: '11px',
          textAlign: 'center',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          lineHeight: 1.4
        }}
      >
        <div>{FOOTER_TEXT}</div>
      </footer>
    </div>
  );
}
