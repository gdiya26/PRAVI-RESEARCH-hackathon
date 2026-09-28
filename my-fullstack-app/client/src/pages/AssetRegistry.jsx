import React, { useState, useCallback } from 'react';
import { Plus, RefreshCw, Layers } from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import assetService from '../services/assetService';

import AssetTable from '../components/assets/AssetTable';
import AssetFilter from '../components/assets/AssetFilter';
import AssetForm from '../components/assets/AssetForm';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';

export default function AssetRegistry({ defaultCategory = null, pageTitle = 'Infrastructure Asset Registry' }) {
  const [filters, setFilters] = useState({
    category: defaultCategory || '',
    type: '',
    condition: '',
    stage: '',
    search: ''
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const fetchAssets = useCallback(() => {
    const params = {};
    if (defaultCategory) {
      params.category = defaultCategory;
    } else if (filters.category) {
      params.category = filters.category;
    }
    if (filters.type) params.type = filters.type;
    if (filters.condition) params.condition = filters.condition;
    if (filters.stage) params.stage = filters.stage;
    if (filters.search) params.search = filters.search;

    return assetService.getAssets(params);
  }, [defaultCategory, filters]);

  const { data: assets, loading, error, refetch } = useFetch(fetchAssets, [fetchAssets]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      category: defaultCategory || '',
      type: '',
      condition: '',
      stage: '',
      search: ''
    });
  };

  const handleCreateAsset = async (assetData) => {
    try {
      await assetService.createAsset(assetData);
      setShowAddModal(false);
      setSuccessMessage(`Asset ${assetData.assetId} successfully registered.`);
      setTimeout(() => setSuccessMessage(''), 4000);
      refetch();
    } catch (err) {
      alert(`Error creating asset: ${err.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Title & Action Strip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--navy-900)', fontWeight: 700 }}>
            {pageTitle}
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Searchable, auditable registry of physical assets with full digital passport linkage.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={refetch}
            title="Refresh assets"
          >
            <RefreshCw size={13} />
            Refresh
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => setShowAddModal(true)}
          >
            <Plus size={14} />
            Register New Asset
          </button>
        </div>
      </div>

      {successMessage && (
        <div style={{ padding: '8px 14px', backgroundColor: '#E8F5E9', border: '1px solid #C8E6C9', color: 'var(--good)', borderRadius: 'var(--radius)', fontSize: '13px', fontWeight: 600 }}>
          ✓ {successMessage}
        </div>
      )}

      {/* Filter Bar */}
      <AssetFilter
        filters={filters}
        onChange={handleFilterChange}
        onReset={handleResetFilters}
        lockCategory={defaultCategory}
      />

      {/* Assets Table */}
      {loading ? (
        <LoadingState message="Querying Infrastructure Asset Registry..." />
      ) : error ? (
        <ErrorState title="Registry Error" message={error} onRetry={refetch} />
      ) : (!assets || assets.length === 0) ? (
        <EmptyState
          title="No assets match the filter criteria"
          description="Try clearing your search query or relaxing filter parameters."
          actionLabel="Reset Filters"
          onAction={handleResetFilters}
        />
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Showing {assets.length} registered asset{assets.length === 1 ? '' : 's'}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Click any row to open Digital Asset Passport
            </span>
          </div>
          <AssetTable assets={assets} />
        </div>
      )}

      {/* Add Asset Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3>Register New Infrastructure Asset</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <AssetForm
                initialData={{ category: defaultCategory || 'ROAD' }}
                onSubmit={handleCreateAsset}
                onCancel={() => setShowAddModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
