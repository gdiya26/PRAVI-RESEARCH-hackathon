import React from 'react';
import {
  SITE_NAME,
  TAGLINE,
  FOOTER_TEXT,
  HEALTH_DISCLAIMER
} from '../utils/constants';
import { Shield, Info, Activity, Database, Server, Cpu, CheckCircle } from 'lucide-react';

export default function Settings() {
  const weights = [
    { factor: 'Physical Condition Rating (Good/Fair/Poor/Critical)', weight: '40%', desc: 'Based on most recent engineering field visual and destructive testing inspection.' },
    { factor: 'Inspection Freshness & Recency', weight: '20%', desc: 'Penalizes overdue safety audits; full score when audited within prescribed 6-12 month window.' },
    { factor: 'Asset Age vs Design Service Life', weight: '15%', desc: 'Calculates elapsed chronological years against rated structural design life (e.g. 30-100 years).' },
    { factor: 'Active Unresolved Defect Burden', weight: '15%', desc: 'Penalties applied for HIGH and MEDIUM severity defects until remediated and verified.' },
    { factor: 'Preventive Maintenance Compliance History', weight: '10%', desc: 'Rewards timely completion and closure of recommended scheduled work orders.' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1000px' }}>
      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span
            style={{
              backgroundColor: 'rgba(201, 162, 39, 0.25)',
              color: '#8C6F10',
              border: '1px solid var(--accent-gold)',
              padding: '2px 8px',
              borderRadius: 'var(--radius)',
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}
          >
            Made by Pravi
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Demo System v1.0.0</span>
        </div>
        <h2 style={{ margin: 0, fontSize: '22px', color: 'var(--navy-900)', fontWeight: 700 }}>
          {SITE_NAME}
        </h2>
        <p style={{ margin: '4px 0 0', fontSize: '14px', color: 'var(--navy-700)', fontWeight: 600 }}>
          "{TAGLINE}"
        </p>
      </div>

      {/* Official Fictional Data Notice */}
      <div
        style={{
          padding: '14px 18px',
          backgroundColor: 'var(--navy-100)',
          borderLeft: '4px solid var(--accent-gold)',
          borderRadius: 'var(--radius)',
          color: 'var(--navy-900)',
          fontSize: '13px'
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: '2px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Info size={16} color="var(--navy-700)" />
          Notice of Governance & Demonstration Environment:
        </div>
        <p style={{ margin: 0, color: 'var(--navy-800)' }}>
          {FOOTER_TEXT}
        </p>
      </div>

      {/* Platform Description */}
      <div className="card" style={{ margin: 0 }}>
        <div className="card-header">
          <h3 className="card-title">Platform Architecture & Mission</h3>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.6, marginBottom: '12px' }}>
          The <strong>{SITE_NAME}</strong> provides a single authoritative source of truth for public roads, highways, bridges, flyovers, culverts, and traffic control telemetry. By assigning an immutable <strong>Digital Asset Passport</strong> to every piece of physical infrastructure, state transportation departments can eliminate data silos, track cradle-to-grave lifecycle milestones, log defect inspections, auto-generate maintenance recommendations, and track engineering work orders to completion.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px', marginTop: '12px' }}>
          <div style={{ backgroundColor: 'var(--bg)', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 700, color: 'var(--navy-900)', fontSize: '13px', marginBottom: '4px' }}>
              1. Unified Digital Identity
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Standardized hierarchical asset IDs (e.g. <code>RD-AHM-001</code>, <code>BR-AHM-001</code>) linked to GIS coordinates, spatial polylines, and contract documents.
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg)', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 700, color: 'var(--navy-900)', fontSize: '13px', marginBottom: '4px' }}>
              2. Automated Lifecycle Transitions
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Engineered workflow rules: severe inspection defects automatically flag assets from OPERATE to MAINTAIN, while work order closure returns assets to healthy operational states.
            </div>
          </div>

          <div style={{ backgroundColor: 'var(--bg)', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <div style={{ fontWeight: 700, color: 'var(--navy-900)', fontSize: '13px', marginBottom: '4px' }}>
              3. Objective Decision Support
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              A 100-point composite Health Index calculated systematically across multiple structural, temporal, and defect factors.
            </div>
          </div>
        </div>
      </div>

      {/* Dual Perspective: Engineer View vs Executive View */}
      <div className="card" style={{ margin: 0 }}>
        <div className="card-header">
          <h3 className="card-title">Dual-Perspective Governance: Engineer View vs. Executive View</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
          <div style={{ backgroundColor: 'var(--bg)', padding: '14px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', borderTop: '3px solid var(--navy-700)' }}>
            <h4 style={{ margin: '0 0 6px', fontSize: '14px', color: 'var(--navy-900)' }}>
              1. Engineer View (Technical & Operational)
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.5, margin: 0 }}>
              Tailored for field inspection engineers, district project managers, and maintenance contractors. Focuses on technical condition assessments, IRC defect catalogs (potholes, cracking, corrosion, structural spalling), work order scheduling, and lifecycle state advancements.
            </p>
          </div>

          <div style={{ backgroundColor: 'var(--bg)', padding: '14px', borderRadius: 'var(--radius)', border: '1px solid var(--border)', borderTop: '3px solid var(--accent-gold)' }}>
            <h4 style={{ margin: '0 0 6px', fontSize: '14px', color: 'var(--navy-900)' }}>
              2. Executive View (Decision Support & Capital Oversight)
            </h4>
            <p style={{ fontSize: '12px', color: 'var(--text)', lineHeight: 1.5, margin: 0 }}>
              Designed for Department Secretaries, Principal Secretaries, and Cabinet stakeholders. Summarizes portfolio capital allocation (₹150-250 Cr), contract expenditure, budget variances, schedule milestone risks, and surfaces immediate intervention flags without technical clutter.
            </p>
          </div>
        </div>
      </div>

      {/* Executive Attention & Escalation Governance Rules */}
      <div className="card" style={{ margin: 0 }}>
        <div className="card-header">
          <h3 className="card-title">Executive Attention & Escalation Governance Rules</h3>
          <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Configured in server/src/utils/executiveRules.js</span>
        </div>
        <div className="table-container" style={{ border: 'none' }}>
          <table className="dense-table">
            <thead>
              <tr>
                <th style={{ width: '130px' }}>Priority Level</th>
                <th>Trigger Criteria & Thresholds</th>
                <th>Standard Executive Action Protocol</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <span className="badge badge-critical">IMMEDIATE</span>
                </td>
                <td style={{ fontSize: '12px', lineHeight: 1.5 }}>
                  &bull; Structural condition is <strong>CRITICAL</strong><br />
                  &bull; Health score below <strong>40/100</strong><br />
                  &bull; Mandatory safety inspection overdue by <strong>&gt; 30 days</strong><br />
                  &bull; Budget variance exceeds <strong>&gt; 15% overrun</strong><br />
                  &bull; Delivery schedule delayed by <strong>&gt; 60 days</strong><br />
                  &bull; <strong>URGENT</strong> priority maintenance pending without scheduled work order
                </td>
                <td style={{ fontSize: '12px', color: 'var(--text)' }}>
                  Immediate ministerial intervention, discretionary outlay freeze, contractor performance review, emergency repair fund sanction.
                </td>
              </tr>
              <tr>
                <td>
                  <span className="badge badge-fair">WATCH</span>
                </td>
                <td style={{ fontSize: '12px', lineHeight: 1.5 }}>
                  &bull; Structural condition is <strong>POOR</strong><br />
                  &bull; Health score in attention bracket (<strong>40-54</strong>)<br />
                  &bull; Budget variance elevated at <strong>5-15%</strong><br />
                  &bull; Inspection overdue by <strong>1-30 days</strong><br />
                  &bull; Project milestone schedule flagged <strong>AT RISK</strong>
                </td>
                <td style={{ fontSize: '12px', color: 'var(--text)' }}>
                  Bi-weekly progress monitoring in executive review, bill of quantities audit, catch-up work plan request from site engineers.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Health Score Methodology & Weight Distribution */}
      <div className="card" style={{ margin: 0 }}>
        <div className="card-header">
          <div>
            <h3 className="card-title">Composite Health Score Algorithm & Weight Configuration</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              * {HEALTH_DISCLAIMER}
            </span>
          </div>
        </div>

        <div className="table-container" style={{ border: 'none' }}>
          <table className="dense-table">
            <thead>
              <tr>
                <th>Evaluation Parameter</th>
                <th style={{ width: '90px' }}>Weight</th>
                <th>Engineering Rationale & Formula Contribution</th>
              </tr>
            </thead>
            <tbody>
              {weights.map((w, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600, color: 'var(--navy-900)' }}>{w.factor}</td>
                  <td style={{ fontWeight: 700, color: 'var(--navy-700)', fontSize: '13px' }}>{w.weight}</td>
                  <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{w.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Scalability and Government Technical Readiness */}
      <div className="card" style={{ margin: 0 }}>
        <div className="card-header">
          <h3 className="card-title">Scalability, GIS Alignment & Security Note</h3>
        </div>
        <p style={{ fontSize: '13px', color: 'var(--text)', lineHeight: 1.6 }}>
          Designed according to Ministry of Road Transport and Highways (MoRTH) standards and Indian Road Congress (IRC) structural asset guidelines. The system architecture leverages indexed MongoDB collections with geospatial 2dsphere indexing, decoupled Express micro-service endpoints, and a responsive Leaflet tile visualization engine capable of rendering 100,000+ distributed state corridor nodes with sub-100ms API response latency.
        </p>
      </div>
    </div>
  );
}
