import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { PRIORITIES } from '../../utils/constants';
import { PRIORITY_COLORS } from '../../utils/formatters';

export default function PriorityChart({ priorityCounts = {} }) {
  const chartData = PRIORITIES.map((p) => ({
    name: `${p} Priority`,
    priority: p,
    value: priorityCounts[p] || 0,
    color: PRIORITY_COLORS[p] || '#1B4079'
  })).filter((item) => item.value > 0);

  const total = chartData.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="card" style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <h3 className="card-title">Maintenance Priority Distribution</h3>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{total} Active Work Items</span>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        {total === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)', fontSize: '12px' }}>
            No priority data recorded
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={3}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--surface)',
                  borderColor: 'var(--border)',
                  borderRadius: 'var(--radius)',
                  fontSize: '12px'
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value) => <span style={{ fontSize: '11px', color: 'var(--text)' }}>{value}</span>}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
