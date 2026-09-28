import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { GitBranch, ChevronRight, Search, ExternalLink } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import assetService from '../services/assetService';
import ConditionBadge from '../components/common/ConditionBadge';
import HealthScore from '../components/common/HealthScore';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { LIFECYCLE_STAGES, STAGE_LABELS } from '../utils/constants';

const STAGE_DESCRIPTIONS = {
  PLAN_DESIGN: 'Detailed Project Report (DPR), feasibility studies, structural geometry and environmental clearances.',
  BUILD: 'Tendering, procurement, earthwork, structural fabrication, foundation laying, and quality verification.',
  OPERATE: 'Active public corridor commissioning, routine tolling, traffic management, and operational surveillance.',
  MAINTAIN: 'Remedial patching, resurfacing, structural crack repair, expansion joint servicing, and work order dispatch.',
  RECONSTRUCTION_REPLACEMENT_RETIREMENT: 'End-of-life assessment, full bridge deck reconstruction, or decommissioning.'
};

export default function LifecyclePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchAssets = useCallback(() => assetService.getAssets(), []);
  const { data: assets, loading, error, refetch } = useFetch(fetchAssets, []);

  if (loading) return <LoadingState message="Organizing assets by lifecycle stage..." />;
  if (error) return <ErrorState title="Lifecycle View Error" message={error} onRetry={refetch} />;

  const filteredAssets = (assets || []).filter((a) => {
    if (selectedCategory && a.category !== selectedCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        a.name?.toLowerCase().includes(q) ||
        a.assetId?.toLowerCase().includes(q) ||
        a.type?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Group by stage
  const grouped = {};
  LIFECYCLE_STAGES.forEach((stage) => {
    grouped[stage] = filteredAssets.filter((a) => a.lifecycleStage === stage);
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--navy-900)', fontWeight: 700 }}>
            Lifecycle Stage Governance & Grouping
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Portfolio visibility partitioned across the 5 canonical government asset management stages.
          </p>
        </div>

        {/* Filter inputs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '180px' }}
          />
          <select
            className="form-control"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            style={{ width: '140px' }}
          >
            <option value="">All Categories</option>
            <option value="ROAD">ROAD</option>
            <option value="STRUCTURE">STRUCTURE</option>
            <option value="TRAFFIC">TRAFFIC</option>
          </select>
        </div>
      </div>

      {/* 5 Stages Grouped Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {LIFECYCLE_STAGES.map((stageKey, idx) => {
          const stageAssets = grouped[stageKey] || [];
          const stageLabel = STAGE_LABELS[stageKey] || stageKey;
          const stageDesc = STAGE_DESCRIPTIONS[stageKey];

          return (
            <div
              key={stageKey}
              className="card"
              style={{
                margin: 0,
                borderTop: `4px solid ${idx === 2 ? 'var(--good)' : idx === 3 ? 'var(--fair)' : 'var(--navy-700)'}`
              }}
            >
              <div className="card-header" style={{ alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: 'var(--navy-100)',
                        color: 'var(--navy-900)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: 700
                      }}
                    >
                      {idx + 1}
                    </span>
                    <h3 className="card-title" style={{ fontSize: '16px' }}>
                      {stageLabel}
                    </h3>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 700,
                        backgroundColor: 'var(--navy-100)',
                        color: 'var(--navy-800)',
                        padding: '2px 8px',
                        borderRadius: '10px'
                      }}
                    >
                      {stageAssets.length} Asset{stageAssets.length === 1 ? '' : 's'}
                    </span>
                  </div>
                  <p style={{ margin: '4px 0 0 32px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    {stageDesc}
                  </p>
                </div>
              </div>

              {stageAssets.length === 0 ? (
                <div style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '13px', fontStyle: 'italic' }}>
                  No assets currently in {stageLabel}.
                </div>
              ) : (
                <div className="table-container" style={{ border: 'none' }}>
                  <table className="dense-table">
                    <thead>
                      <tr>
                        <th>Asset ID</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>Condition</th>
                        <th>Health Score</th>
                        <th>Last Action / Phase</th>
                        <th style={{ textAlign: 'right' }}>Digital Passport</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stageAssets.map((asset) => (
                        <tr
                          key={asset._id || asset.assetId}
                          className="clickable-row"
                          onClick={() => navigate(`/assets/${asset.assetId}`)}
                        >
                          <td style={{ fontWeight: 700, color: 'var(--navy-700)', fontFamily: 'monospace' }}>
                            {asset.assetId}
                          </td>
                          <td style={{ fontWeight: 600, color: 'var(--navy-900)' }}>
                            {asset.name}
                          </td>
                          <td style={{ color: 'var(--text-muted)' }}>
                            {asset.type}
                          </td>
                          <td>
                            <ConditionBadge condition={asset.condition} size="sm" />
                          </td>
                          <td>
                            <HealthScore score={asset.healthScore} compact />
                          </td>
                          <td style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                            {asset.lifecycleHistory && asset.lifecycleHistory.length > 0
                              ? asset.lifecycleHistory[asset.lifecycleHistory.length - 1].description
                              : 'Standard phase monitoring'}
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button
                              type="button"
                              className="btn btn-secondary btn-sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/assets/${asset.assetId}`);
                              }}
                            >
                              Open Passport <ChevronRight size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
