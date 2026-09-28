import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { CONDITION_COLORS } from '../../utils/formatters';

export default function ConditionChart({ perCondition = {} }) {
  const chartData = [
    { name: 'GOOD', count: perCondition.GOOD || 0, color: CONDITION_COLORS.GOOD },
    { name: 'FAIR', count: perCondition.FAIR || 0, color: CONDITION_COLORS.FAIR },
    { name: 'POOR', count: perCondition.POOR || 0, color: CONDITION_COLORS.POOR },
    { name: 'CRITICAL', count: perCondition.CRITICAL || 0, color: CONDITION_COLORS.CRITICAL }
  ];

  return (
    <div className="card" style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <h3 className="card-title">Condition Breakdown</h3>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Real-time health assessment</span>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
              axisLine={{ stroke: 'var(--border)' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--surface)',
                borderColor: 'var(--border)',
                borderRadius: 'var(--radius)',
                fontSize: '12px',
                color: 'var(--navy-900)'
              }}
              formatter={(value) => [`${value} Assets`, 'Count']}
            />
            <Bar dataKey="count" radius={[2, 2, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
