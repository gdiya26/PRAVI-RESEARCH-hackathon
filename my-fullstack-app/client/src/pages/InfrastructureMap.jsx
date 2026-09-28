import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Filter, RotateCcw, ExternalLink } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import assetService from '../services/assetService';
import AssetMap from '../components/map/AssetMap';
import ConditionBadge from '../components/common/ConditionBadge';
import HealthScore from '../components/common/HealthScore';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import {
  CONDITIONS,
  LIFECYCLE_STAGES,
  STAGE_LABELS,
  AHMEDABAD_CENTER
} from '../utils/constants';

export default function InfrastructureMap() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    condition: '',
    stage: ''
  });
  const [selectedAssetId, setSelectedAssetId] = useState(null);

  const fetchAssets = useCallback(() => {
    const params = {};
    if (filters.category) params.category = filters.category;
    if (filters.condition) params.condition = filters.condition;
    if (filters.stage) params.stage = filters.stage;
    if (filters.search) params.search = filters.search;
    return assetService.getAssets(params);
  }, [filters]);

  const { data: assets, loading, error, refetch } = useFetch(fetchAssets, [fetchAssets]);

  const handleReset = () => {
    setFilters({ search: '', category: '', condition: '', stage: '' });
    setSelectedAssetId(null);
  };

  const selectedAsset = assets?.find(
    (a) => a.assetId === selectedAssetId || a._id === selectedAssetId
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--navy-900)', fontWeight: 700 }}>
            Geospatial Infrastructure GIS Map
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Real-time geospatial visibility across state highways, bridges, flyovers, and traffic telemetry.
          </p>
        </div>

        <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Centered on: <strong>Ahmedabad Metropolitan Region</strong>
        </div>
      </div>

      {/* Filter strip */}
      <div
        className="card"
        style={{
          padding: '12px 16px',
          margin: 0,
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px', alignItems: 'end' }}>
          <div>
            <label className="form-label">Search Query</label>
            <div style={{ position: 'relative' }}>
              <Search
                size={14}
                style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                className="form-control"
                placeholder="ID, name, or street..."
                value={filters.search}
                onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                style={{ paddingLeft: '30px' }}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Category</label>
            <select
              className="form-control"
              value={filters.category}
              onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
            >
              <option value="">All Categories</option>
              <option value="ROAD">ROAD</option>
              <option value="STRUCTURE">STRUCTURE</option>
              <option value="TRAFFIC">TRAFFIC</option>
            </select>
          </div>

          <div>
            <label className="form-label">Condition</label>
            <select
              className="form-control"
              value={filters.condition}
              onChange={(e) => setFilters((p) => ({ ...p, condition: e.target.value }))}
            >
              <option value="">All Conditions</option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Lifecycle Stage</label>
            <select
              className="form-control"
              value={filters.stage}
              onChange={(e) => setFilters((p) => ({ ...p, stage: e.target.value }))}
            >
              <option value="">All Stages</option>
              {LIFECYCLE_STAGES.map((s) => (
                <option key={s} value={s}>{STAGE_LABELS[s] || s}</option>
              ))}
            </select>
          </div>

          <div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleReset}
              style={{ width: '100%', height: '34px' }}
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>
        </div>
      </div>

      {/* Map + Sidebar Layout */}
      {loading ? (
        <LoadingState message="Loading geospatial layers and coordinate geometries..." />
      ) : error ? (
        <ErrorState title="GIS Layer Error" message={error} onRetry={refetch} />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '16px', minHeight: '600px' }}>
          {/* Main Map */}
          <div>
            <AssetMap
              assets={assets || []}
              height="600px"
              center={
                selectedAsset?.location?.lat
                  ? [selectedAsset.location.lat, selectedAsset.location.lng]
                  : AHMEDABAD_CENTER
              }
              zoom={selectedAsset ? 14 : 12}
              selectedAssetId={selectedAssetId}
            />
          </div>

          {/* Quick Selection Sidebar */}
          <div
            className="card"
            style={{
              height: '600px',
              display: 'flex',
              flexDirection: 'column',
              margin: 0,
              padding: '14px'
            }}
          >
            <div className="card-header" style={{ paddingBottom: '8px', marginBottom: '8px' }}>
              <h3 className="card-title">Assets On Map ({assets?.length || 0})</h3>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {(!assets || assets.length === 0) ? (
                <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                  No assets found matching the filter criteria.
                </div>
              ) : (
                assets.map((asset) => {
                  const isSelected = asset.assetId === selectedAssetId;
                  return (
                    <div
                      key={asset._id || asset.assetId}
                      onClick={() => setSelectedAssetId(asset.assetId)}
                      style={{
                        padding: '8px 10px',
                        borderRadius: 'var(--radius)',
                        border: isSelected ? '2px solid var(--navy-700)' : '1px solid var(--border)',
                        backgroundColor: isSelected ? 'var(--navy-100)' : 'var(--surface)',
                        cursor: 'pointer',
                        transition: 'all 150ms ease'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 700, fontSize: '12px', color: 'var(--navy-700)', fontFamily: 'monospace' }}>
                          {asset.assetId}
                        </span>
                        <ConditionBadge condition={asset.condition} size="sm" />
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy-900)', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {asset.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        {asset.type} &bull; {asset.category}
                      </div>
                      {isSelected && (
                        <div style={{ marginTop: '8px', paddingTop: '6px', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <HealthScore score={asset.healthScore} compact />
                          <button
                            type="button"
                            className="btn btn-primary btn-sm"
                            style={{ fontSize: '10px', padding: '2px 6px' }}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/assets/${asset.assetId}`);
                            }}
                          >
                            <ExternalLink size={10} /> Open Passport
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
