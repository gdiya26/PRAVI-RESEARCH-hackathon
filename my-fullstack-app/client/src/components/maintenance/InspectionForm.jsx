import React, { useState } from 'react';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import {
  CONDITIONS,
  ROAD_DEFECTS,
  STRUCTURE_DEFECTS,
  DEFECT_SEVERITIES
} from '../../utils/constants';

export default function InspectionForm({
  assetId,
  category = 'ROAD',
  onSubmit,
  onCancel,
  isSubmitting = false
}) {
  const [condition, setCondition] = useState('POOR');
  const [inspector, setInspector] = useState('Senior Field Engineer (PWD)');
  const [remarks, setRemarks] = useState('');
  const [defects, setDefects] = useState([
    {
      defectType: category === 'STRUCTURE' ? STRUCTURE_DEFECTS[0] : ROAD_DEFECTS[0],
      severity: 'HIGH',
      location: 'Ch. 4+200 Left Carriage Way',
      notes: 'Severe deterioration observed requiring urgent maintenance.'
    }
  ]);

  const availableDefects =
    category === 'STRUCTURE'
      ? STRUCTURE_DEFECTS
      : category === 'ROAD'
      ? ROAD_DEFECTS
      : ['Signal failure', 'Bulb out', 'Sensor failure', 'Physical structural damage'];

  const addDefect = () => {
    setDefects([
      ...defects,
      {
        defectType: availableDefects[0],
        severity: 'MEDIUM',
        location: '',
        notes: ''
      }
    ]);
  };

  const removeDefect = (index) => {
    setDefects(defects.filter((_, idx) => idx !== index));
  };

  const updateDefect = (index, field, value) => {
    const updated = [...defects];
    updated[index][field] = value;
    setDefects(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      asset: assetId,
      condition,
      inspector: inspector.trim() || 'Senior Field Engineer',
      defects,
      remarks: remarks.trim(),
      date: new Date()
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '18px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
        <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--navy-900)', fontWeight: 700 }}>
          Log Field Engineering Inspection
        </h4>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Asset Category: <strong>{category}</strong>
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div>
          <label className="form-label">Evaluated Condition *</label>
          <select
            className="form-control"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
            required
          >
            {CONDITIONS.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="form-label">Inspector Name / Designation *</label>
          <input
            type="text"
            required
            className="form-control"
            value={inspector}
            onChange={(e) => setInspector(e.target.value)}
            placeholder="e.g. Lead Structural Inspector"
          />
        </div>
      </div>

      {/* Observed Defects Picker */}
      <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <label className="form-label" style={{ margin: 0 }}>Observed Defect Items ({defects.length})</label>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={addDefect}
          >
            <Plus size={13} />
            Add Defect
          </button>
        </div>

        {defects.length === 0 ? (
          <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '6px 0' }}>
            No defect items added.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {defects.map((defect, idx) => (
              <div
                key={idx}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '2fr 1.2fr 2fr auto',
                  gap: '8px',
                  alignItems: 'center',
                  backgroundColor: 'var(--navy-100)',
                  padding: '8px 10px',
                  borderRadius: 'var(--radius)'
                }}
              >
                <div>
                  <select
                    className="form-control"
                    style={{ fontSize: '12px', padding: '4px 6px' }}
                    value={defect.defectType}
                    onChange={(e) => updateDefect(idx, 'defectType', e.target.value)}
                  >
                    {availableDefects.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <select
                    className="form-control"
                    style={{ fontSize: '12px', padding: '4px 6px', fontWeight: 600 }}
                    value={defect.severity}
                    onChange={(e) => updateDefect(idx, 'severity', e.target.value)}
                  >
                    {DEFECT_SEVERITIES.map((s) => (
                      <option key={s} value={s}>
                        {s} Severity
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <input
                    type="text"
                    className="form-control"
                    style={{ fontSize: '12px', padding: '4px 6px' }}
                    placeholder="Specific chainage / notes"
                    value={defect.notes}
                    onChange={(e) => updateDefect(idx, 'notes', e.target.value)}
                  />
                </div>

                <button
                  type="button"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--critical)',
                    cursor: 'pointer',
                    padding: '4px'
                  }}
                  onClick={() => removeDefect(idx)}
                  title="Remove defect"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div>
        <label className="form-label">Field Remarks & Recommendations</label>
        <textarea
          rows={2}
          className="form-control"
          placeholder="e.g. Potholes have expanded to 40mm depth. High defect severity warrants immediate resurfacing and work order dispatch."
          value={remarks}
          onChange={(e) => setRemarks(e.target.value)}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
        {onCancel && (
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          <CheckCircle2 size={15} />
          {isSubmitting ? 'Logging Inspection...' : 'Submit Official Inspection'}
        </button>
      </div>
    </form>
  );
}
