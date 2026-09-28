import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid
} from 'recharts';
import { formatCurrencyFull } from '../../utils/formatters';

export default function SpendTrendChart({ monthlySpendTrend = [] }) {
  const chartData = (monthlySpendTrend || []).map((item) => ({
    month: item.month,
    budget: Math.round((item.budget || 0) / 10000000 * 10) / 10,
    spent: Math.round((item.spent || 0) / 10000000 * 10) / 10,
    rawBudget: item.budget || 0,
    rawSpent: item.spent || 0
  }));

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
          <div style={{ fontWeight: 700, color: 'var(--navy-900)' }}>{data.month}</div>
          <div style={{ color: 'var(--navy-700)', marginTop: '2px' }}>
            Target Outlay: <strong>{formatCurrencyFull(data.rawBudget)}</strong> ({data.budget} Cr)
          </div>
          <div style={{ color: 'var(--critical)', marginTop: '2px' }}>
            Actual Spent: <strong>{formatCurrencyFull(data.rawSpent)}</strong> ({data.spent} Cr)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card" style={{ margin: 0, height: '340px', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <h3 className="card-title">Fiscal Outlay vs Disbursement Trend (₹ Crores)</h3>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} unit=" Cr" />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '6px' }} />
            <Line
              type="monotone"
              dataKey="budget"
              name="Planned Target (Cr)"
              stroke="#1B4079"
              strokeWidth={2}
              dot={{ r: 3 }}
            />
            <Line
              type="monotone"
              dataKey="spent"
              name="Actual Disbursed (Cr)"
              stroke="#C2571A"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
