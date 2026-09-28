import React, { useState, useEffect } from 'react';
import { X, Wrench } from 'lucide-react';
import { PRIORITIES } from '../../utils/constants';

export default function WorkOrderModal({
  isOpen,
  onClose,
  onSubmit,
  assetId,
  assetName,
  maintenanceRecords = [],
  initialMaintenance = null,
  isSubmitting = false
}) {
  const [issue, setIssue] = useState('');
  const [priority, setPriority] = useState('HIGH');
  const [assignedDepartment, setAssignedDepartment] = useState('Highway Maintenance Division');
  const [estimatedCost, setEstimatedCost] = useState('250000');
  const [maintenanceId, setMaintenanceId] = useState('');

  useEffect(() => {
    if (initialMaintenance) {
      setIssue(initialMaintenance.description || `Address defect: ${initialMaintenance.type}`);
      setPriority(initialMaintenance.priority || 'HIGH');
      setEstimatedCost(initialMaintenance.cost || '250000');
      setMaintenanceId(initialMaintenance._id || '');
    } else {
      setIssue('');
      setPriority('HIGH');
      setEstimatedCost('250000');
      setMaintenanceId('');
    }
  }, [initialMaintenance, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!issue.trim()) return;

    onSubmit({
      asset: assetId,
      issue: issue.trim(),
      priority,
      assignedDepartment: assignedDepartment.trim() || 'Highway Maintenance Division',
      estimatedCost: Number(estimatedCost) || 0,
      maintenanceId: maintenanceId || null,
      status: 'OPEN'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '520px' }}
      >
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Wrench size={18} color="var(--navy-700)" />
            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--navy-900)' }}>
              Create Engineering Work Order
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-muted)'
            }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {assetId && (
              <div
                style={{
                  padding: '8px 12px',
                  backgroundColor: 'var(--navy-100)',
                  borderRadius: 'var(--radius)',
                  fontSize: '12px',
                  color: 'var(--navy-900)',
                  fontWeight: 600
                }}
              >
                Target Asset: {assetId} {assetName ? `(${assetName})` : ''}
              </div>
            )}

            <div>
              <label className="form-label">Issue / Work Scope Description *</label>
              <textarea
                required
                rows={3}
                className="form-control"
                placeholder="Describe required repair or remedial action in detail..."
                value={issue}
                onChange={(e) => setIssue(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="form-label">Priority Level *</label>
                <select
                  className="form-control"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p} Priority
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Estimated Repair Budget (₹)</label>
                <input
                  type="number"
                  className="form-control"
                  value={estimatedCost}
                  onChange={(e) => setEstimatedCost(e.target.value)}
                  placeholder="250000"
                />
              </div>
            </div>

            <div>
              <label className="form-label">Assigned Department / Division</label>
              <input
                type="text"
                className="form-control"
                value={assignedDepartment}
                onChange={(e) => setAssignedDepartment(e.target.value)}
                placeholder="e.g. Highway Maintenance Division"
              />
            </div>

            {maintenanceRecords && maintenanceRecords.length > 0 && (
              <div>
                <label className="form-label">Link to Maintenance Recommendation (Optional)</label>
                <select
                  className="form-control"
                  value={maintenanceId}
                  onChange={(e) => setMaintenanceId(e.target.value)}
                >
                  <option value="">-- None (Auto-link latest RECOMMENDED) --</option>
                  {maintenanceRecords.map((m) => (
                    <option key={m._id} value={m._id}>
                      [{m.status}] {m.type} - {m.description ? m.description.slice(0, 40) + '...' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Issuing Work Order...' : 'Issue Work Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
