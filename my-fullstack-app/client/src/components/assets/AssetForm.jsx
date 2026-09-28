import React, { useState } from 'react';
import {
  CATEGORIES,
  CONDITIONS,
  LIFECYCLE_STAGES,
  STAGE_LABELS,
  ROAD_TYPES,
  STRUCTURE_TYPES,
  TRAFFIC_TYPES
} from '../../utils/constants';

export default function AssetForm({ onSubmit, onCancel, initialData = {} }) {
  const [formData, setFormData] = useState({
    assetId: initialData.assetId || '',
    category: initialData.category || 'ROAD',
    type: initialData.type || 'Highway',
    name: initialData.name || '',
    address: initialData.location?.address || '',
    lat: initialData.location?.lat || 23.0225,
    lng: initialData.location?.lng || 72.5714,
    lifecycleStage: initialData.lifecycleStage || 'PLAN_DESIGN',
    condition: initialData.condition || 'GOOD',
    constructionYear: initialData.constructionYear || new Date().getFullYear(),
    designLife: initialData.designLife || 30,
    estimatedCost: initialData.estimatedCost || 50000000,
    department: initialData.department || 'Public Works Department (PWD)',
    contractor: initialData.contractor || 'L&T Infrastructure Ltd.'
  });

  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'category') {
        if (value === 'ROAD') updated.type = ROAD_TYPES[0];
        else if (value === 'STRUCTURE') updated.type = STRUCTURE_TYPES[0];
        else if (value === 'TRAFFIC') updated.type = TRAFFIC_TYPES[0];
      }
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.assetId.trim()) {
      setError('Asset ID is required (e.g. RD-AHM-010)');
      return;
    }
    if (!formData.name.trim()) {
      setError('Asset Name is required');
      return;
    }

    const payload = {
      assetId: formData.assetId.trim(),
      category: formData.category,
      type: formData.type,
      name: formData.name.trim(),
      location: {
        address: formData.address.trim(),
        lat: Number(formData.lat) || 23.0225,
        lng: Number(formData.lng) || 72.5714,
        path: formData.category === 'ROAD' ? [
          [Number(formData.lat) || 23.0225, Number(formData.lng) || 72.5714],
          [(Number(formData.lat) || 23.0225) + 0.015, (Number(formData.lng) || 72.5714) + 0.015]
        ] : []
      },
      lifecycleStage: formData.lifecycleStage,
      condition: formData.condition,
      constructionYear: Number(formData.constructionYear) || null,
      designLife: Number(formData.designLife) || 30,
      estimatedCost: Number(formData.estimatedCost) || 0,
      department: formData.department,
      contractor: formData.contractor
    };

    onSubmit(payload);
  };

  const typeOptions =
    formData.category === 'ROAD'
      ? ROAD_TYPES
      : formData.category === 'STRUCTURE'
      ? STRUCTURE_TYPES
      : TRAFFIC_TYPES;

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {error && (
        <div style={{ padding: '8px 12px', backgroundColor: '#FEE2E2', color: 'var(--critical)', borderRadius: 'var(--radius)', fontSize: '12px' }}>
          {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label className="form-label">Asset ID *</label>
          <input
            type="text"
            required
            className="form-control"
            placeholder="e.g. RD-AHM-010"
            value={formData.assetId}
            onChange={(e) => handleChange('assetId', e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">Category *</label>
          <select
            className="form-control"
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label className="form-label">Asset Type *</label>
          <select
            className="form-control"
            value={formData.type}
            onChange={(e) => handleChange('type', e.target.value)}
          >
            {typeOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Asset Name *</label>
          <input
            type="text"
            required
            className="form-control"
            placeholder="Official corridor / asset name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="form-label">Location / Address</label>
        <input
          type="text"
          className="form-control"
          placeholder="e.g. SG Highway, Bodakdev Junction, Ahmedabad"
          value={formData.address}
          onChange={(e) => handleChange('address', e.target.value)}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label className="form-label">Latitude</label>
          <input
            type="number"
            step="any"
            className="form-control"
            value={formData.lat}
            onChange={(e) => handleChange('lat', e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">Longitude</label>
          <input
            type="number"
            step="any"
            className="form-control"
            value={formData.lng}
            onChange={(e) => handleChange('lng', e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label className="form-label">Initial Lifecycle Stage</label>
          <select
            className="form-control"
            value={formData.lifecycleStage}
            onChange={(e) => handleChange('lifecycleStage', e.target.value)}
          >
            {LIFECYCLE_STAGES.map((s) => (
              <option key={s} value={s}>
                {STAGE_LABELS[s] || s}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="form-label">Initial Condition</label>
          <select
            className="form-control"
            value={formData.condition}
            onChange={(e) => handleChange('condition', e.target.value)}
          >
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label className="form-label">Estimated Cost (₹)</label>
          <input
            type="number"
            className="form-control"
            value={formData.estimatedCost}
            onChange={(e) => handleChange('estimatedCost', e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">Design Life (Years)</label>
          <input
            type="number"
            className="form-control"
            value={formData.designLife}
            onChange={(e) => handleChange('designLife', e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label className="form-label">Department</label>
          <input
            type="text"
            className="form-control"
            value={formData.department}
            onChange={(e) => handleChange('department', e.target.value)}
          />
        </div>
        <div>
          <label className="form-label">Contractor</label>
          <input
            type="text"
            className="form-control"
            value={formData.contractor}
            onChange={(e) => handleChange('contractor', e.target.value)}
          />
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          Register Asset
        </button>
      </div>
    </form>
  );
}
