import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';
import {
  CATEGORIES,
  CONDITIONS,
  LIFECYCLE_STAGES,
  STAGE_LABELS,
  ROAD_TYPES,
  STRUCTURE_TYPES,
  TRAFFIC_TYPES
} from '../../utils/constants';

export default function AssetFilter({
  filters,
  onChange,
  onReset,
  lockCategory = null
}) {
  const currentCategory = lockCategory || filters.category || '';

  let availableTypes = [];
  if (currentCategory === 'ROAD') availableTypes = ROAD_TYPES;
  else if (currentCategory === 'STRUCTURE') availableTypes = STRUCTURE_TYPES;
  else if (currentCategory === 'TRAFFIC') availableTypes = TRAFFIC_TYPES;
  else availableTypes = [...ROAD_TYPES, ...STRUCTURE_TYPES, ...TRAFFIC_TYPES];

  return (
    <div
      className="card"
      style={{
        padding: '14px',
        marginBottom: '16px',
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <Filter size={16} color="var(--navy-700)" />
        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--navy-900)' }}>
          Filter Infrastructure Assets
        </span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '10px',
          alignItems: 'end'
        }}
      >
        {/* Search */}
        <div>
          <label className="form-label">Search Query</label>
          <div style={{ position: 'relative' }}>
            <Search
              size={14}
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-muted)'
              }}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Search ID, Name, Address..."
              value={filters.search || ''}
              onChange={(e) => onChange('search', e.target.value)}
              style={{ paddingLeft: '30px' }}
            />
          </div>
        </div>

        {/* Category */}
        {!lockCategory && (
          <div>
            <label className="form-label">Category</label>
            <select
              className="form-control"
              value={filters.category || ''}
              onChange={(e) => {
                onChange('category', e.target.value);
                onChange('type', '');
              }}
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Type */}
        <div>
          <label className="form-label">Asset Type</label>
          <select
            className="form-control"
            value={filters.type || ''}
            onChange={(e) => onChange('type', e.target.value)}
          >
            <option value="">All Types</option>
            {availableTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div>
          <label className="form-label">Condition</label>
          <select
            className="form-control"
            value={filters.condition || ''}
            onChange={(e) => onChange('condition', e.target.value)}
          >
            <option value="">All Conditions</option>
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        {/* Stage */}
        <div>
          <label className="form-label">Lifecycle Stage</label>
          <select
            className="form-control"
            value={filters.stage || ''}
            onChange={(e) => onChange('stage', e.target.value)}
          >
            <option value="">All Stages</option>
            {LIFECYCLE_STAGES.map((s) => (
              <option key={s} value={s}>
                {STAGE_LABELS[s] || s}
              </option>
            ))}
          </select>
        </div>

        {/* Reset */}
        <div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onReset}
            style={{ width: '100%', height: '34px' }}
          >
            <RotateCcw size={14} />
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
