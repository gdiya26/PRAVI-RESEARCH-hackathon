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
import { formatCurrencyFull } from '../../utils/formatters';

export default function BudgetCategoryChart({ budgetByCategory = [] }) {
  const chartData = (budgetByCategory || []).map((item) => ({
    category: item.category,
    name: item.category === 'ROAD' ? 'Roads & Highways' : (item.category === 'STRUCTURE' ? 'Bridges & Struct.' : 'Traffic Control'),
    approved: Math.round((item.approved || 0) / 10000000 * 10) / 10,
    spent: Math.round((item.spent || 0) / 10000000 * 10) / 10,
    rawApproved: item.approved || 0,
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
          <div style={{ fontWeight: 700, color: 'var(--navy-900)' }}>{data.name}</div>
          <div style={{ color: 'var(--navy-700)', marginTop: '2px' }}>
            Approved: <strong>{formatCurrencyFull(data.rawApproved)}</strong> ({data.approved} Cr)
          </div>
          <div style={{ color: 'var(--accent-gold)' }}>
            Spent: <strong>{formatCurrencyFull(data.rawSpent)}</strong> ({data.spent} Cr)
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card" style={{ margin: 0, height: '340px', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <h3 className="card-title">Capital Allocation by Asset Category (₹ Crores)</h3>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 20, left: -10, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
            <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} unit=" Cr" />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '6px' }} />
            <Bar dataKey="approved" name="Approved (Cr)" fill="#12305A" radius={[3, 3, 0, 0]} />
            <Bar dataKey="spent" name="Spent (Cr)" fill="#2A5599" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
