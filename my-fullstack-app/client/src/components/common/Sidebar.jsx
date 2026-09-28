import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  MapPin,
  Route,
  Building,
  ClipboardCheck,
  Wrench,
  GitBranch,
  Radio,
  BarChart3,
  Settings,
  Landmark
} from 'lucide-react';
import { SITE_NAME_SHORT } from '../../utils/constants';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/assets', label: 'Asset Registry', icon: Layers },
  { path: '/map', label: 'Infrastructure Map', icon: MapPin },
  { path: '/roads', label: 'Road Network', icon: Route },
  { path: '/structures', label: 'Bridges & Structures', icon: Building },
  { path: '/inspections', label: 'Inspections', icon: ClipboardCheck },
  { path: '/maintenance', label: 'Maintenance & Work Orders', icon: Wrench },
  { path: '/lifecycle', label: 'Lifecycle Stages', icon: GitBranch },
  { path: '/traffic', label: 'Traffic Control', icon: Radio },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/settings', label: 'Settings & About', icon: Settings }
];

export default function Sidebar() {
  return (
    <aside
      style={{
        width: '260px',
        backgroundColor: 'var(--navy-800)',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        borderRight: '1px solid rgba(0, 0, 0, 0.15)'
      }}
    >
      {/* Brand Block */}
      <div
        style={{
          padding: '18px 20px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}
      >
        <Landmark size={20} color="var(--accent-gold)" />
        <span
          style={{
            fontSize: '14px',
            fontWeight: 700,
            letterSpacing: '0.2px',
            color: '#FFFFFF'
          }}
        >
          {SITE_NAME_SHORT}
        </span>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 0', overflowY: 'auto' }}>
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <li key={item.path} style={{ margin: '2px 0' }}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '10px 18px',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 500,
                    color: isActive ? '#FFFFFF' : 'var(--navy-100)',
                    backgroundColor: isActive ? 'var(--navy-700)' : 'transparent',
                    borderLeft: isActive ? '3px solid var(--accent-gold)' : '3px solid transparent',
                    textDecoration: 'none',
                    transition: 'background-color 150ms ease-in-out, color 150ms ease-in-out'
                  })}
                  onMouseEnter={(e) => {
                    if (!e.currentTarget.classList.contains('active')) {
                      e.currentTarget.style.backgroundColor = 'var(--navy-600)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!e.currentTarget.classList.contains('active')) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }
                  }}
                >
                  <Icon size={18} style={{ opacity: 0.9, flexShrink: 0 }} />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.label}
                  </span>
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Sidebar Footer info */}
      <div
        style={{
          padding: '14px 18px',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '11px',
          color: 'var(--navy-100)',
          opacity: 0.8
        }}
      >
        <div style={{ fontWeight: 600 }}>Jurisdiction: Ahmedabad Metro</div>
        <div>State Highway & Urban Corridor</div>
      </div>
    </aside>
  );
}
