import React, { useState, useCallback } from 'react';
import { Radio, RefreshCw, Layers, Map as MapIcon } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import assetService from '../services/assetService';
import AssetTable from '../components/assets/AssetTable';
import AssetMap from '../components/map/AssetMap';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { TRAFFIC_TYPES, CONDITIONS } from '../utils/constants';

export default function TrafficControl() {
  const [typeFilter, setTypeFilter] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState('split'); // 'split', 'table', 'map'

  const fetchTrafficAssets = useCallback(() => assetService.getTrafficAssets(), []);
  const { data: assets, loading, error, refetch } = useFetch(fetchTrafficAssets, []);

  const filtered = (assets || []).filter((item) => {
    if (typeFilter && item.type !== typeFilter) return false;
    if (conditionFilter && item.condition !== conditionFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        item.name?.toLowerCase().includes(q) ||
        item.assetId?.toLowerCase().includes(q) ||
        item.location?.address?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--navy-900)', fontWeight: 700 }}>
            Traffic Control & ITS Telemetry Inventory
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Sensors, adaptive signals, VMS display units, and CCTV surveillance devices.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <div style={{ display: 'flex', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'split' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 0, border: 'none' }}
              onClick={() => setViewMode('split')}
            >
              Split View
            </button>
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'table' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 0, border: 'none' }}
              onClick={() => setViewMode('table')}
            >
              Table Only
            </button>
            <button
              type="button"
              className={`btn btn-sm ${viewMode === 'map' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: 0, border: 'none' }}
              onClick={() => setViewMode('map')}
            >
              Map Only
            </button>
          </div>

          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={refetch}
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {/* Filter strip */}
      <div
        className="card"
        style={{
          padding: '10px 14px',
          margin: 0,
          backgroundColor: 'var(--surface)',
          border: '1px solid var(--border)'
        }}
      >
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search traffic assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: '200px' }}
          />

          <select
            className="form-control"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            style={{ width: '180px' }}
          >
            <option value="">All Traffic Types</option>
            {TRAFFIC_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            className="form-control"
            value={conditionFilter}
            onChange={(e) => setConditionFilter(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="">All Conditions</option>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          {(typeFilter || conditionFilter || search) && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setTypeFilter('');
                setConditionFilter('');
                setSearch('');
              }}
            >
              Reset
            </button>
          )}

          <div style={{ marginLeft: 'auto', fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
            {filtered.length} Traffic Device{filtered.length === 1 ? '' : 's'}
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <LoadingState message="Connecting to Traffic Control inventory..." />
      ) : error ? (
        <ErrorState title="Traffic Telemetry Error" message={error} onRetry={refetch} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No traffic assets match filters"
          description="Adjust your search or category filter criteria."
          actionLabel="Clear Filters"
          onAction={() => {
            setTypeFilter('');
            setConditionFilter('');
            setSearch('');
          }}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Map Section */}
          {(viewMode === 'split' || viewMode === 'map') && (
            <div className="card" style={{ padding: '0', margin: 0, overflow: 'hidden' }}>
              <AssetMap
                assets={filtered}
                height={viewMode === 'map' ? '650px' : '360px'}
                zoom={12}
              />
            </div>
          )}

          {/* Table Section */}
          {(viewMode === 'split' || viewMode === 'table') && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--navy-900)' }}>
                  Traffic Device Inventory Table
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Click row to open Digital Asset Passport
                </span>
              </div>
              <AssetTable assets={filtered} />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
