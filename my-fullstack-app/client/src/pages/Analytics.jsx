import React, { useState, useEffect, useCallback } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend
} from 'recharts';
import { BarChart3, TrendingUp, AlertTriangle, CheckCircle, RefreshCw } from 'lucide-react';
import dashboardService from '../services/dashboardService';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { CONDITION_COLORS, formatCurrency } from '../utils/formatters';
import { LIFECYCLE_STAGES, STAGE_LABELS, HEALTH_DISCLAIMER } from '../utils/constants';

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [conditionAnalytics, lifecycleAnalytics, stats] = await Promise.all([
        dashboardService.getConditionAnalytics(),
        dashboardService.getLifecycleAnalytics(),
        dashboardService.getStats()
      ]);
      setData({ conditionAnalytics, lifecycleAnalytics, stats });
    } catch (err) {
      setError(err.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  if (loading) return <LoadingState message="Computing portfolio analytics and risk metrics..." />;
  if (error) return <ErrorState title="Analytics Unavailable" message={error} onRetry={loadAnalytics} />;
  if (!data) return null;

  const { conditionAnalytics, lifecycleAnalytics, stats } = data;

  // 1. Condition Breakdown by Category
  const categoryConditionData = ['ROAD', 'STRUCTURE', 'TRAFFIC'].map((cat) => ({
    category: cat,
    GOOD: conditionAnalytics.byCategory?.[cat]?.GOOD || 0,
    FAIR: conditionAnalytics.byCategory?.[cat]?.FAIR || 0,
    POOR: conditionAnalytics.byCategory?.[cat]?.POOR || 0,
    CRITICAL: conditionAnalytics.byCategory?.[cat]?.CRITICAL || 0,
    avgHealth: conditionAnalytics.averageHealthByCategory?.[cat] || 0
  }));

  // 2. Lifecycle Capital Cost & Count
  const lifecycleData = LIFECYCLE_STAGES.map((st) => ({
    key: st,
    name: STAGE_LABELS[st] || st,
    shortName: st === 'RECONSTRUCTION_REPLACEMENT_RETIREMENT' ? 'Recon/Retire' : STAGE_LABELS[st],
    count: lifecycleAnalytics[st]?.count || 0,
    totalCost: lifecycleAnalytics[st]?.totalCost || 0
  }));

  // 3. Cost by Category
  const totalCostByCategory = [
    {
      name: 'Road Network',
      category: 'ROAD',
      value: LIFECYCLE_STAGES.reduce((sum, st) => sum + (lifecycleAnalytics[st]?.ROAD || 0) * 150000000, 0),
      color: '#1B4079'
    },
    {
      name: 'Structures & Bridges',
      category: 'STRUCTURE',
      value: LIFECYCLE_STAGES.reduce((sum, st) => sum + (lifecycleAnalytics[st]?.STRUCTURE || 0) * 350000000, 0),
      color: '#2A5599'
    },
    {
      name: 'Traffic Control',
      category: 'TRAFFIC',
      value: LIFECYCLE_STAGES.reduce((sum, st) => sum + (lifecycleAnalytics[st]?.TRAFFIC || 0) * 12000000, 0),
      color: '#B7791F'
    }
  ];

  // 4. Overdue vs On-time Inspections
  const totalAssets = stats.totals || 1;
  const overdueCount = stats.overdueInspections || 0;
  const onTimeCount = Math.max(0, totalAssets - overdueCount);

  const inspectionComplianceData = [
    { name: 'Compliant / On-Time', value: onTimeCount, color: '#2E7D32' },
    { name: 'Overdue Inspection', value: overdueCount, color: '#B3261E' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--navy-900)', fontWeight: 700 }}>
            Executive Engineering Analytics & Capital Planning
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Strategic asset condition breakdown, lifecycle capital distribution, and inspection compliance.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={loadAnalytics}
        >
          <RefreshCw size={13} /> Refresh Analytics
        </button>
      </div>

      {/* Average Health Index Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        {['ROAD', 'STRUCTURE', 'TRAFFIC'].map((cat) => {
          const score = conditionAnalytics.averageHealthByCategory?.[cat] || 0;
          return (
            <div key={cat} className="card" style={{ margin: 0, borderTop: '3px solid var(--navy-700)' }}>
              <div style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700 }}>
                {cat} Average Health Score
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
                <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--navy-900)' }}>
                  {score}
                </span>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>/ 100 Index</span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', fontStyle: 'italic' }}>
                {HEALTH_DISCLAIMER}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Charts: Condition Breakdown by Category & Lifecycle Capital Cost */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '16px' }}>
        {/* Condition by Category Stacked */}
        <div className="card" style={{ height: '360px', display: 'flex', flexDirection: 'column', margin: 0 }}>
          <div className="card-header">
            <h3 className="card-title">Condition Breakdown by Asset Category</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Good / Fair / Poor / Critical</span>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryConditionData} margin={{ top: 20, right: 20, left: -10, bottom: 10 }}>
                <XAxis dataKey="category" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius)',
                    fontSize: '12px'
                  }}
                />
                <Legend />
                <Bar dataKey="GOOD" stackId="a" fill={CONDITION_COLORS.GOOD} name="Good" />
                <Bar dataKey="FAIR" stackId="a" fill={CONDITION_COLORS.FAIR} name="Fair" />
                <Bar dataKey="POOR" stackId="a" fill={CONDITION_COLORS.POOR} name="Poor" />
                <Bar dataKey="CRITICAL" stackId="a" fill={CONDITION_COLORS.CRITICAL} name="Critical" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lifecycle Asset Volume & Capital Cost */}
        <div className="card" style={{ height: '360px', display: 'flex', flexDirection: 'column', margin: 0 }}>
          <div className="card-header">
            <h3 className="card-title">Assets by Lifecycle Stage</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Asset volumes per phase</span>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lifecycleData} margin={{ top: 20, right: 20, left: -10, bottom: 25 }}>
                <XAxis dataKey="shortName" angle={-15} textAnchor="end" interval={0} tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius)',
                    fontSize: '12px'
                  }}
                  formatter={(val, name, item) => [`${val} Assets`, item.payload.name]}
                />
                <Bar dataKey="count" fill="var(--navy-700)" radius={[2, 2, 0, 0]} name="Asset Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Capital Valuation by Category & Inspection Compliance */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '16px' }}>
        {/* Estimated Asset Portfolio Valuation by Category */}
        <div className="card" style={{ height: '340px', display: 'flex', flexDirection: 'column', margin: 0 }}>
          <div className="card-header">
            <h3 className="card-title">Capital Investment Share by Category</h3>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Estimated book value</span>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={totalCostByCategory}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={45}
                  paddingAngle={3}
                >
                  {totalCostByCategory.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius)',
                    fontSize: '12px'
                  }}
                  formatter={(val) => [formatCurrency(val), 'Capital Value']}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(val) => <span style={{ fontSize: '11px', color: 'var(--text)' }}>{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Overdue vs On-Time Inspections */}
        <div className="card" style={{ height: '340px', display: 'flex', flexDirection: 'column', margin: 0 }}>
          <div className="card-header">
            <h3 className="card-title">Inspection Compliance & Overdue Ratio</h3>
            <span style={{ fontSize: '11px', color: overdueCount > 0 ? 'var(--critical)' : 'var(--good)', fontWeight: 600 }}>
              {overdueCount} Overdue
            </span>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inspectionComplianceData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={45}
                  paddingAngle={3}
                >
                  {inspectionComplianceData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--surface)',
                    borderColor: 'var(--border)',
                    borderRadius: 'var(--radius)',
                    fontSize: '12px'
                  }}
                  formatter={(val) => [`${val} Assets`, 'Status']}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(val) => <span style={{ fontSize: '11px', color: 'var(--text)' }}>{val}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
