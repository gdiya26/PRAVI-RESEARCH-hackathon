import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell
} from 'recharts';
import { STAGE_LABELS } from '../../utils/constants';

const STAGE_COLORS = ['#1B4079', '#2A5599', '#12305A', '#B7791F', '#B3261E'];

export default function ProjectStageChart({ projectsByStage = [] }) {
  const chartData = (projectsByStage || []).map((item, idx) => {
    const rawLabel = STAGE_LABELS[item.stage] || item.stage;
    let shortLabel = rawLabel;
    if (item.stage === 'PLAN_DESIGN') shortLabel = 'Plan & Design';
    else if (item.stage === 'BUILD') shortLabel = 'Build';
    else if (item.stage === 'OPERATE') shortLabel = 'Operate';
    else if (item.stage === 'MAINTAIN') shortLabel = 'Maintain';
    else if (item.stage === 'RECONSTRUCTION_REPLACEMENT_RETIREMENT') shortLabel = 'Recon / Retire';

    return {
      stage: item.stage,
      name: shortLabel,
      fullName: rawLabel,
      count: item.count || 0,
      fill: STAGE_COLORS[idx % STAGE_COLORS.length]
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
          <div style={{ fontWeight: 700, color: 'var(--navy-900)' }}>{data.fullName}</div>
          <div style={{ color: 'var(--navy-700)', marginTop: '2px' }}>
            Projects in Stage: <strong>{data.count}</strong>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card" style={{ margin: 0, height: '340px', display: 'flex', flexDirection: 'column' }}>
      <div className="card-header">
        <h3 className="card-title">Project Count by Lifecycle Stage</h3>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical" margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--border)" />
            <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
            <YAxis
              type="category"
              dataKey="name"
              width={100}
              tick={{ fontSize: 11, fill: 'var(--navy-900)', fontWeight: 600 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" name="Projects" radius={[0, 3, 3, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
