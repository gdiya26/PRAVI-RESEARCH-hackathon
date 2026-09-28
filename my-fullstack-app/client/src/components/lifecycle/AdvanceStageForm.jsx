import React, { useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { LIFECYCLE_STAGES, STAGE_LABELS } from '../../utils/constants';

export default function AdvanceStageForm({ currentStage = 'PLAN_DESIGN', onAdvance, isSubmitting = false }) {
  const currentIndex = LIFECYCLE_STAGES.indexOf(currentStage);
  const defaultTarget =
    currentIndex < LIFECYCLE_STAGES.length - 1
      ? LIFECYCLE_STAGES[currentIndex + 1]
      : LIFECYCLE_STAGES[currentIndex];

  const [targetStage, setTargetStage] = useState(defaultTarget);
  const [description, setDescription] = useState('');
  const [by, setBy] = useState('Chief Executive Engineer, PWD');
  const [cost, setCost] = useState('');
  const [docRef, setDocRef] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetStage) return;

    onAdvance({
      targetStage,
      description: description.trim() || `Asset transitioned from ${currentStage} to ${targetStage}`,
      by: by.trim() || 'Superintending Engineer',
      cost: Number(cost) || 0,
      docRef: docRef.trim() || 'REG-TXN-' + Date.now().toString().slice(-4),
      date: new Date()
    });
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '16px 20px',
        marginTop: '16px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <ArrowRight size={18} color="var(--navy-700)" />
        <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--navy-900)' }}>
          Advance Asset Lifecycle Stage
        </h4>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label className="form-label">Current Stage</label>
            <div
              style={{
                padding: '7px 10px',
                backgroundColor: 'var(--navy-100)',
                color: 'var(--navy-900)',
                fontWeight: 600,
                fontSize: '13px',
                borderRadius: 'var(--radius)'
              }}
            >
              {STAGE_LABELS[currentStage] || currentStage}
            </div>
          </div>

          <div>
            <label className="form-label">Target Stage *</label>
            <select
              className="form-control"
              value={targetStage}
              onChange={(e) => setTargetStage(e.target.value)}
              required
            >
              {LIFECYCLE_STAGES.map((s) => (
                <option key={s} value={s}>
                  {STAGE_LABELS[s] || s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="form-label">Stage Transition Description / Justification *</label>
          <textarea
            className="form-control"
            rows={2}
            required
            placeholder="e.g. Construction completed and structural safety tests verified. Transitioning to full operational status."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
          <div>
            <label className="form-label">Authorizing Official</label>
            <input
              type="text"
              className="form-control"
              value={by}
              onChange={(e) => setBy(e.target.value)}
              placeholder="e.g. Chief Engineer, PWD"
            />
          </div>

          <div>
            <label className="form-label">Phase Cost / Budget Incurred (₹)</label>
            <input
              type="number"
              className="form-control"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              placeholder="0"
            />
          </div>

          <div>
            <label className="form-label">Approval Document / Order Ref</label>
            <input
              type="text"
              className="form-control"
              value={docRef}
              onChange={(e) => setDocRef(e.target.value)}
              placeholder="e.g. PWD/ENG/2026/044"
            />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '6px' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            <CheckCircle2 size={15} />
            {isSubmitting ? 'Recording Transition...' : 'Execute Stage Advance'}
          </button>
        </div>
      </form>
    </div>
  );
}
