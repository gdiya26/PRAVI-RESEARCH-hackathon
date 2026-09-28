import React, { useState, useCallback } from 'react';
import { ClipboardCheck, Search, Filter, RotateCcw, RefreshCw } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import inspectionService from '../services/inspectionService';
import InspectionTable from '../components/maintenance/InspectionTable';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import { CONDITIONS } from '../utils/constants';

export default function Inspections() {
  const [search, setSearch] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');

  const fetchInspections = useCallback(() => inspectionService.getInspections(), []);
  const { data: inspections, loading, error, refetch } = useFetch(fetchInspections, []);

  const handleReset = () => {
    setSearch('');
    setConditionFilter('');
  };

  const filtered = (inspections || []).filter((item) => {
    if (conditionFilter && item.condition !== conditionFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      const assetObj = item.asset;
      const assetId = (typeof assetObj === 'object' ? assetObj?.assetId : item.assetId) || '';
      const assetName = (typeof assetObj === 'object' ? assetObj?.name : item.assetName) || '';
      const inspector = item.inspector || '';
      const remarks = item.remarks || '';
      return (
        assetId.toLowerCase().includes(q) ||
        assetName.toLowerCase().includes(q) ||
        inspector.toLowerCase().includes(q) ||
        remarks.toLowerCase().includes(q)
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
            State Infrastructure Inspection Logs
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Consolidated field engineer audits, crack monitoring, defect logs, and condition ratings.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={refetch}
        >
          <RefreshCw size={13} /> Refresh
        </button>
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', alignItems: 'end' }}>
          <div>
            <label className="form-label">Search Inspection / Inspector / Asset</label>
            <div style={{ position: 'relative' }}>
              <Search
                size={14}
                style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
              />
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '30px' }}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Condition Rating</label>
            <select
              className="form-control"
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
            >
              <option value="">All Condition Ratings</option>
              {CONDITIONS.map((c) => (
                <option key={c} value={c}>{c}</option>
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

      {/* Table */}
      {loading ? (
        <LoadingState message="Fetching global inspection records..." />
      ) : error ? (
        <ErrorState title="Inspection Error" message={error} onRetry={refetch} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No inspection records found"
          description="Try relaxing your filters or log a new inspection directly from an asset's passport."
          actionLabel="Reset Filters"
          onAction={handleReset}
        />
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Showing {filtered.length} inspection report{filtered.length === 1 ? '' : 's'}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Click any asset name to open its Digital Asset Passport
            </span>
          </div>
          <InspectionTable inspections={filtered} showAssetColumn={true} />
        </div>
      )}
    </div>
  );
}
