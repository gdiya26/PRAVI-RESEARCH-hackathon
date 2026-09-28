import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { LIFECYCLE_STAGES, STAGE_LABELS } from '../../utils/constants';

const STAGE_COLORS = ['#12305A', '#1B4079', '#2A5599', '#B7791F', '#B3261E'];

export default function LifecycleChart({ perStage = {} }) {
  const chartData = LIFECYCLE_STAGES.map((st, idx) => ({
    key: st,
    name: STAGE_LABELS[st] || st,
    shortName: st === 'RECONSTRUCTION_REPLACEMENT_RETIREMENT' ? 'Recon / Retire' : STAGE_LABELS[st],
    count: perStage[st] || 0,
    color: STAGE_COLORS[idx % STAGE_COLORS.length]
  }));

  return (
    <div className="card" style={{ height: '300px', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <h3 className="card-title">Lifecycle Stage Distribution</h3>
        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Portfolio status</span>
      </div>

      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <XAxis
              dataKey="shortName"
              tick={{ fontSize: 11, fill: 'var(--text-muted)' }}
              interval={0}
              angle={-15}
              textAnchor="end"
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
              formatter={(value, name, item) => [`${value} Assets`, item.payload.name]}
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
