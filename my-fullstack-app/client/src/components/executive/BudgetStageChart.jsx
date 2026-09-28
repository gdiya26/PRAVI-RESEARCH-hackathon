import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { STAGE_LABELS } from '../../utils/constants';
import { formatCurrencyCompact, formatCurrencyFull } from '../../utils/formatters';

export default function BudgetStageChart({ budgetByStage = [] }) {
  const chartData = (budgetByStage || []).map((item) => {
    const rawLabel = STAGE_LABELS[item.stage] || item.stage;
    // Shorten stage label for X axis readability
    let shortLabel = rawLabel;
    if (item.stage === 'PLAN_DESIGN') shortLabel = 'Plan';
    else if (item.stage === 'BUILD') shortLabel = 'Build';
    else if (item.stage === 'OPERATE') shortLabel = 'Operate';
    else if (item.stage === 'MAINTAIN') shortLabel = 'Maintain';
    else if (item.stage === 'RECONSTRUCTION_REPLACEMENT_RETIREMENT') shortLabel = 'Recon / Retire';

    return {
      stage: item.stage,
      name: shortLabel,
      fullName: rawLabel,
      approved: Math.round((item.approved || 0) / 10000000 * 10) / 10, // in Cr
      spent: Math.round((item.spent || 0) / 10000000 * 10) / 10, // in Cr
      rawApproved: item.approved || 0,
      rawSpent: item.spent || 0
    };
  });

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid var(--border)',
            padding: '8px 12px',
            fontSize: '12px',
            borderRadius: 'var(--radius)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}
        >
          <div style={{ fontWeight: 700, color: 'var(--navy-900)', marginBottom: '4px' }}>
            {data.fullName}
          </div>
          <div style={{ color: 'var(--navy-700)' }}>
            Approved Budget: <strong>{formatCurrencyFull(data.rawApproved)}</strong> ({data.approved} Cr)
          </div>
          <div style={{ color: 'var(--accent-gold)' }}>
            Amount Spent: <strong>{formatCurrencyFull(data.rawSpent)}</strong> ({data.spent} Cr)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card" style={{ margin: 0, height: '340px', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <h3 className="card-title">Budget Allocation vs Expenditure by Stage (₹ Crores)</h3>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} unit=" Cr" />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '6px' }} />
            <Bar dataKey="approved" name="Approved Budget (Cr)" fill="#1B4079" radius={[3, 3, 0, 0]} />
            <Bar dataKey="spent" name="Amount Spent (Cr)" fill="#C9A227" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
