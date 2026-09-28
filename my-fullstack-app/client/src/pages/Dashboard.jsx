import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Layers,
  Route,
  Building,
  AlertTriangle,
  Clock,
  Wrench,
  TrendingUp,
  FileCheck
} from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import dashboardService from '../services/dashboardService';

import KpiCard from '../components/common/KpiCard';
import ConditionChart from '../components/dashboard/ConditionChart';
import LifecycleChart from '../components/dashboard/LifecycleChart';
import PriorityChart from '../components/dashboard/PriorityChart';
import RecentEvents from '../components/dashboard/RecentEvents';
import CriticalAssetList from '../components/dashboard/CriticalAssetList';
import AssetMap from '../components/map/AssetMap';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { TAGLINE } from '../utils/constants';

export default function Dashboard() {
  const navigate = useNavigate();

  const fetchStats = useCallback(() => dashboardService.getStats(), []);
  const { data: stats, loading, error, refetch } = useFetch(fetchStats, []);

  if (loading) return <LoadingState message="Loading Infrastructure Dashboard Statistics..." />;
  if (error) return <ErrorState title="Dashboard Unavailable" message={error} onRetry={refetch} />;
  if (!stats) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Dashboard Header Strip with Tagline */}
      <div
        style={{
          backgroundColor: 'var(--navy-900)',
          color: '#FFFFFF',
          padding: '16px 20px',
          borderRadius: 'var(--radius)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.6px', color: 'var(--accent-gold)', fontWeight: 700 }}>
            Executive Asset Command Center
          </span>
          <h2 style={{ margin: '2px 0 0', fontSize: '20px', color: '#FFFFFF', fontWeight: 700 }}>
            Infrastructure Asset Portfolio
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--navy-100)', fontStyle: 'italic' }}>
            "{TAGLINE}"
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/assets')}
            style={{ backgroundColor: '#FFFFFF', color: 'var(--navy-900)' }}
          >
            View All Assets &rarr;
          </button>
        </div>
      </div>

      {/* KPI Cards: Total, Roads, Structures, Critical, Maintenance Due, Overdue Inspections */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        <KpiCard
          title="Total Assets"
          value={stats.totals}
          subtitle="Registered network assets"
          icon={Layers}
          onClick={() => navigate('/assets')}
        />
        <KpiCard
          title="Road Network"
          value={stats.roads}
          subtitle="Highways & arterials"
          icon={Route}
          onClick={() => navigate('/roads')}
        />
        <KpiCard
          title="Structures"
          value={stats.structures}
          subtitle="Bridges, flyovers & culverts"
          icon={Building}
          onClick={() => navigate('/structures')}
        />
        <KpiCard
          title="Critical Watch"
          value={stats.critical}
          subtitle="Condition: Critical or Health < 40"
          icon={AlertTriangle}
          alert={stats.critical > 0}
          onClick={() => navigate('/assets')}
        />
        <KpiCard
          title="Maintenance Due"
          value={stats.maintenanceDue}
          subtitle="Recommended & in-progress"
          icon={Wrench}
          onClick={() => navigate('/maintenance')}
        />
        <KpiCard
          title="Overdue Inspections"
          value={stats.overdueInspections}
          subtitle="Safety inspection overdue"
          icon={Clock}
          alert={stats.overdueInspections > 0}
          onClick={() => navigate('/inspections')}
        />
      </div>

      {/* Charts Grid: Condition, Lifecycle, Priority */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
        <ConditionChart perCondition={stats.perCondition} />
        <LifecycleChart perStage={stats.perStage} />
        <PriorityChart priorityCounts={stats.priorityCounts} />
      </div>

      {/* Critical Assets and Mini Map */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '16px' }}>
        <div style={{ height: '380px' }}>
          <CriticalAssetList assets={stats.criticalAssets} />
        </div>

        <div className="card" style={{ height: '380px', display: 'flex', flexDirection: 'column', margin: 0 }}>
          <div className="card-header">
            <h3 className="card-title">Critical Assets Geospatial Distribution</h3>
            <span style={{ fontSize: '11px', color: 'var(--critical)', fontWeight: 600 }}>
              {stats.criticalAssets?.length || 0} Incident Pins
            </span>
          </div>
          <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
            <AssetMap
              assets={stats.criticalAssets || []}
              height="100%"
              zoom={11}
            />
          </div>
        </div>
      </div>

      {/* Recent Lifecycle Events */}
      <div style={{ minHeight: '260px' }}>
        <RecentEvents events={stats.recentLifecycleEvents} />
      </div>
    </div>
  );
}
