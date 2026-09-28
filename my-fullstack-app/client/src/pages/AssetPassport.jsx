import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  Calendar,
  MapPin,
  Tag,
  Clock,
  FileText,
  Wrench,
  ClipboardCheck,
  History,
  Info,
  GitBranch,
  ArrowLeft,
  Plus,
  RefreshCw,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import assetService from '../services/assetService';
import inspectionService from '../services/inspectionService';
import maintenanceService from '../services/maintenanceService';
import workOrderService from '../services/workOrderService';

import ConditionBadge from '../components/common/ConditionBadge';
import StatusBadge from '../components/common/StatusBadge';
import HealthScore from '../components/common/HealthScore';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';

import LifecycleTimeline from '../components/lifecycle/LifecycleTimeline';
import LifecycleHistory from '../components/lifecycle/LifecycleHistory';
import AdvanceStageForm from '../components/lifecycle/AdvanceStageForm';

import InspectionTable from '../components/maintenance/InspectionTable';
import InspectionForm from '../components/maintenance/InspectionForm';
import MaintenanceTable from '../components/maintenance/MaintenanceTable';
import WorkOrderTable from '../components/maintenance/WorkOrderTable';
import WorkOrderModal from '../components/maintenance/WorkOrderModal';

import AssetMap from '../components/map/AssetMap';
import { formatDate, formatCurrency } from '../utils/formatters';
import { STAGE_LABELS, HEALTH_DISCLAIMER } from '../utils/constants';

export default function AssetPassport() {
  const { id } = useParams();
  const [passportData, setPassportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Modals & sub-form states
  const [showInspectionForm, setShowInspectionForm] = useState(false);
  const [showWorkOrderModal, setShowWorkOrderModal] = useState(false);
  const [selectedMaintenanceForWo, setSelectedMaintenanceForWo] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPassport = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await assetService.getAssetPassport(id);
      setPassportData(data);
    } catch (err) {
      setError(err.message || 'Failed to load Digital Asset Passport');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPassport();
  }, [fetchPassport]);

  const showNotification = (msg) => {
    setActionSuccessMsg(msg);
    setTimeout(() => setActionSuccessMsg(''), 5000);
  };

  // Actions
  const handleAdvanceStage = async (payload) => {
    try {
      setIsSubmitting(true);
      await assetService.advanceAssetLifecycle(id, payload);
      showNotification(`Lifecycle successfully advanced to ${STAGE_LABELS[payload.targetStage] || payload.targetStage}`);
      await fetchPassport();
    } catch (err) {
      alert(`Error advancing stage: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateInspection = async (payload) => {
    try {
      setIsSubmitting(true);
      const res = await inspectionService.createInspection(payload);
      setShowInspectionForm(false);
      const autoMnt = res?.autoCreatedMaintenance;
      const stageMoved = res?.asset?.lifecycleStage === 'MAINTAIN';
      let msg = 'Inspection successfully logged and recorded in passport.';
      if (autoMnt) {
        msg += ' [Auto-Workflow: Maintenance recommendation generated!';
        if (stageMoved) msg += ' Asset transitioned to MAINTAIN stage.]';
        else msg += ']';
      }
      showNotification(msg);
      await fetchPassport();
    } catch (err) {
      alert(`Error logging inspection: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMaintenanceStatusChange = async (maintenanceId, newStatus) => {
    try {
      await maintenanceService.updateMaintenanceStatus(maintenanceId, newStatus);
      showNotification(`Maintenance status updated to ${newStatus}`);
      await fetchPassport();
    } catch (err) {
      alert(`Error updating maintenance status: ${err.message}`);
    }
  };

  const handleCreateWorkOrder = async (payload) => {
    try {
      setIsSubmitting(true);
      await workOrderService.createWorkOrder(payload);
      setShowWorkOrderModal(false);
      setSelectedMaintenanceForWo(null);
      showNotification('Work Order created and scheduled successfully.');
      await fetchPassport();
    } catch (err) {
      alert(`Error creating work order: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWorkOrderStatusChange = async (woId, newStatus) => {
    try {
      const res = await workOrderService.updateWorkOrderStatus(woId, newStatus);
      let msg = `Work Order status updated to ${newStatus}.`;
      if (newStatus === 'CLOSED') {
        msg = `Work order CLOSED & VERIFIED! Asset condition upgraded to ${res?.updatedAsset?.condition || 'improved state'} and returned to OPERATE.`;
      }
      showNotification(msg);
      await fetchPassport();
    } catch (err) {
      alert(`Error updating work order status: ${err.message}`);
    }
  };

  if (loading) return <LoadingState message={`Fetching Digital Asset Passport for ${id}...`} />;
  if (error) return <ErrorState title="Passport Not Available" message={error} onRetry={fetchPassport} />;
  if (!passportData || !passportData.asset) return <ErrorState message="Asset passport details not found." />;

  const { asset, inspections, maintenance, workOrders, documents, mergedChronologicalHistory } = passportData;

  const tabs = [
    { id: 'overview', label: 'Overview & GIS', icon: Info, count: null },
    { id: 'lifecycle', label: 'Lifecycle Management', icon: GitBranch, count: asset.lifecycleHistory?.length || 0 },
    { id: 'inspections', label: 'Inspections', icon: ClipboardCheck, count: inspections?.length || 0 },
    { id: 'maintenance', label: 'Maintenance Records', icon: Wrench, count: maintenance?.length || 0 },
    { id: 'workorders', label: 'Work Orders', icon: Wrench, count: workOrders?.length || 0 },
    { id: 'documents', label: 'Official Documents', icon: FileText, count: documents?.length || 0 },
    { id: 'history', label: 'Full Audit History', icon: History, count: mergedChronologicalHistory?.length || 0 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Back button and title strip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Link
          to="/assets"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: 'var(--navy-700)',
            fontWeight: 600
          }}
        >
          <ArrowLeft size={16} /> Back to Asset Registry
        </Link>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={fetchPassport}
          title="Refresh passport data"
        >
          <RefreshCw size={13} /> Refresh Passport
        </button>
      </div>

      {/* Success Notification Bar */}
      {actionSuccessMsg && (
        <div
          style={{
            padding: '10px 16px',
            backgroundColor: '#E8F5E9',
            border: '1px solid #A5D6A7',
            borderRadius: 'var(--radius)',
            color: 'var(--good)',
            fontWeight: 600,
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckCircle size={18} />
          {actionSuccessMsg}
        </div>
      )}

      {/* PASSPORT HEADER CARD */}
      <div
        className="card"
        style={{
          borderTop: '4px solid var(--navy-700)',
          padding: '20px 24px',
          marginBottom: 0
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase',
                  color: 'var(--navy-700)',
                  backgroundColor: 'var(--navy-100)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius)'
                }}
              >
                DIGITAL ASSET PASSPORT
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Government Verification Certified
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', flexWrap: 'wrap' }}>
              <h1 style={{ margin: 0, fontSize: '24px', color: 'var(--navy-900)', fontWeight: 700 }}>
                {asset.name}
              </h1>
              <span style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: 700, color: 'var(--navy-700)' }}>
                [{asset.assetId}]
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', marginTop: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Tag size={13} color="var(--navy-700)" />
                {asset.category} &bull; {asset.type}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <MapPin size={13} color="var(--navy-700)" />
                {asset.location?.address || 'Ahmedabad Corridor'}
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <Building2 size={13} color="var(--navy-700)" />
                {asset.department}
              </span>
            </div>
          </div>

          {/* Badges & Health */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <StatusBadge status={asset.status || 'ACTIVE'} />
              <ConditionBadge condition={asset.condition} />
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  backgroundColor: 'var(--navy-100)',
                  color: 'var(--navy-900)',
                  padding: '2px 8px',
                  borderRadius: 'var(--radius)',
                  border: '1px solid var(--border)'
                }}
              >
                {STAGE_LABELS[asset.lifecycleStage] || asset.lifecycleStage}
              </span>
            </div>

            <div style={{ width: '220px', marginTop: '4px' }}>
              <HealthScore score={asset.healthScore} showDisclaimer={true} />
            </div>
          </div>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="tabs-nav" style={{ margin: 0, backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0 8px' }}>
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              className={`tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  style={{
                    backgroundColor: isActive ? 'var(--navy-700)' : 'var(--navy-100)',
                    color: isActive ? '#FFFFFF' : 'var(--navy-800)',
                    fontSize: '11px',
                    padding: '1px 6px',
                    borderRadius: '10px',
                    fontWeight: 700
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT PANELS */}
      <div>
        {/* TAB 1: OVERVIEW & GIS */}
        {activeTab === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Quick Specs Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
              <div className="card" style={{ margin: 0 }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Financial Specs</div>
                <div style={{ marginTop: '8px' }}>
                  <div style={{ fontSize: '13px', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Estimated Cost:</span>
                    <strong>{formatCurrency(asset.estimatedCost)}</strong>
                  </div>
                  <div style={{ fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Actual Incurred:</span>
                    <strong>{formatCurrency(asset.actualCost || asset.estimatedCost)}</strong>
                  </div>
                </div>
              </div>

              <div className="card" style={{ margin: 0 }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Engineering Specs</div>
                <div style={{ marginTop: '8px' }}>
                  <div style={{ fontSize: '13px', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Construction Year:</span>
                    <strong>{asset.constructionYear || 'N/A'}</strong>
                  </div>
                  <div style={{ fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Design Life:</span>
                    <strong>{asset.designLife ? `${asset.designLife} Years` : '30 Years'}</strong>
                  </div>
                </div>
              </div>

              <div className="card" style={{ margin: 0 }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Administrative Custody</div>
                <div style={{ marginTop: '8px' }}>
                  <div style={{ fontSize: '13px', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Department:</span>
                    <strong style={{ maxWidth: '140px', textAlign: 'right' }}>{asset.department}</strong>
                  </div>
                  <div style={{ fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Contractor:</span>
                    <strong>{asset.contractor || 'L&T Infra'}</strong>
                  </div>
                </div>
              </div>

              <div className="card" style={{ margin: 0 }}>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Inspection Schedule</div>
                <div style={{ marginTop: '8px' }}>
                  <div style={{ fontSize: '13px', display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <span>Last Inspection:</span>
                    <strong>{formatDate(asset.lastInspection)}</strong>
                  </div>
                  <div style={{ fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                    <span>Next Due:</span>
                    <strong style={{ color: asset.nextInspection && new Date(asset.nextInspection) < new Date() ? 'var(--critical)' : 'inherit' }}>
                      {formatDate(asset.nextInspection)}
                    </strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Asset Specific Technical Specs */}
            {asset.specs && Object.keys(asset.specs).length > 0 && (
              <div className="card" style={{ margin: 0 }}>
                <h4 className="card-title" style={{ marginBottom: '12px' }}>Technical Parameters & Design Standards</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  {Object.entries(asset.specs).map(([key, val]) => (
                    <div key={key} style={{ backgroundColor: 'var(--navy-100)', padding: '8px 12px', borderRadius: 'var(--radius)' }}>
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                        {key.replace(/([A-Z])/g, ' $1')}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy-900)' }}>
                        {String(val)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Small Map View for this Asset */}
            <div className="card" style={{ margin: 0 }}>
              <div className="card-header">
                <h4 className="card-title">Geospatial Alignment & GIS Map</h4>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Coordinates: {asset.location?.lat?.toFixed(4)}, {asset.location?.lng?.toFixed(4)}
                </span>
              </div>
              <AssetMap
                assets={[asset]}
                height="320px"
                center={[asset.location?.lat || 23.0225, asset.location?.lng || 72.5714]}
                zoom={14}
                selectedAssetId={asset.assetId}
              />
            </div>
          </div>
        )}

        {/* TAB 2: LIFECYCLE MANAGEMENT */}
        {activeTab === 'lifecycle' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="card" style={{ margin: 0 }}>
              <div className="card-header">
                <h4 className="card-title">Asset Lifecycle Progress Timeline</h4>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Current: <strong>{STAGE_LABELS[asset.lifecycleStage] || asset.lifecycleStage}</strong>
                </span>
              </div>
              <LifecycleTimeline currentStage={asset.lifecycleStage} />
            </div>

            {/* Advance Stage Form */}
            <AdvanceStageForm
              currentStage={asset.lifecycleStage}
              onAdvance={handleAdvanceStage}
              isSubmitting={isSubmitting}
            />

            {/* Lifecycle History */}
            <div className="card" style={{ margin: 0 }}>
              <div className="card-header">
                <h4 className="card-title">Lifecycle Transition History</h4>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Official audit chain</span>
              </div>
              <LifecycleHistory history={asset.lifecycleHistory} />
            </div>
          </div>
        )}

        {/* TAB 3: INSPECTIONS */}
        {activeTab === 'inspections' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--navy-900)' }}>
                  Condition Inspections & Structural Audits
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                  Logging a POOR/CRITICAL condition or HIGH defect automatically creates a maintenance recommendation.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => setShowInspectionForm(!showInspectionForm)}
              >
                <Plus size={14} />
                {showInspectionForm ? 'Close Form' : 'Log New Inspection'}
              </button>
            </div>

            {showInspectionForm && (
              <InspectionForm
                assetId={asset._id || asset.assetId}
                category={asset.category}
                onSubmit={handleCreateInspection}
                onCancel={() => setShowInspectionForm(false)}
                isSubmitting={isSubmitting}
              />
            )}

            <InspectionTable inspections={inspections} showAssetColumn={false} />
          </div>
        )}

        {/* TAB 4: MAINTENANCE */}
        {activeTab === 'maintenance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--navy-900)' }}>
                  Maintenance Recommendations & Remediation
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                  Advance status or convert a recommendation into an active engineering work order.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setSelectedMaintenanceForWo(null);
                  setShowWorkOrderModal(true);
                }}
              >
                <Plus size={14} /> Create Work Order
              </button>
            </div>

            <MaintenanceTable
              records={maintenance}
              showAssetColumn={false}
              onStatusChange={handleMaintenanceStatusChange}
              onCreateWorkOrder={(record) => {
                setSelectedMaintenanceForWo(record);
                setShowWorkOrderModal(true);
              }}
            />
          </div>
        )}

        {/* TAB 5: WORK ORDERS */}
        {activeTab === 'workorders' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--navy-900)' }}>
                  Engineering Work Orders
                </h3>
                <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>
                  Workflow progression: OPEN &rarr; IN_PROGRESS &rarr; COMPLETED &rarr; CLOSED. Closing upgrades asset condition and resets stage to OPERATE.
                </p>
              </div>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={() => {
                  setSelectedMaintenanceForWo(null);
                  setShowWorkOrderModal(true);
                }}
              >
                <Plus size={14} /> Create Work Order
              </button>
            </div>

            <WorkOrderTable
              workOrders={workOrders}
              showAssetColumn={false}
              onStatusChange={handleWorkOrderStatusChange}
            />
          </div>
        )}

        {/* TAB 6: DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="card" style={{ margin: 0 }}>
            <div className="card-header">
              <h4 className="card-title">Official Engineering Documents & Certificates</h4>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{documents?.length || 0} Records</span>
            </div>

            {(!documents || documents.length === 0) ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                No engineering documents uploaded to this asset passport.
              </div>
            ) : (
              <div className="table-container">
                <table className="dense-table">
                  <thead>
                    <tr>
                      <th>Document Type</th>
                      <th>Document Title</th>
                      <th>Official Reference</th>
                      <th>Issuance Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc, idx) => (
                      <tr key={doc._id || idx}>
                        <td style={{ fontWeight: 600, color: 'var(--navy-700)' }}>
                          {doc.type}
                        </td>
                        <td>{doc.name}</td>
                        <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>{doc.ref}</td>
                        <td>{formatDate(doc.date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 7: FULL CHRONOLOGICAL AUDIT HISTORY */}
        {activeTab === 'history' && (
          <div className="card" style={{ margin: 0 }}>
            <div className="card-header">
              <h4 className="card-title">Unified Chronological Audit History</h4>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                Merged timeline across Lifecycle, Inspections, Maintenance & Work Orders
              </span>
            </div>

            {(!mergedChronologicalHistory || mergedChronologicalHistory.length === 0) ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                No unified event history recorded.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {mergedChronologicalHistory.map((item, idx) => {
                  let eventColor = 'var(--navy-700)';
                  let eventBg = 'var(--navy-100)';
                  if (item.eventType === 'INSPECTION') {
                    eventColor = '#B7791F';
                    eventBg = '#FEF3C7';
                  } else if (item.eventType === 'MAINTENANCE') {
                    eventColor = '#C2571A';
                    eventBg = '#FFEDD5';
                  } else if (item.eventType === 'WORK_ORDER') {
                    eventColor = '#2E7D32';
                    eventBg = '#E8F5E9';
                  }

                  return (
                    <div
                      key={idx}
                      style={{
                        padding: '12px 14px',
                        borderRadius: 'var(--radius)',
                        backgroundColor: 'var(--surface)',
                        border: '1px solid var(--border)',
                        borderLeft: `4px solid ${eventColor}`
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span
                            style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              backgroundColor: eventBg,
                              color: eventColor,
                              padding: '2px 6px',
                              borderRadius: 'var(--radius)'
                            }}
                          >
                            {item.eventType.replace('_', ' ')}
                          </span>
                          <span style={{ fontWeight: 700, fontSize: '13px', color: 'var(--navy-900)' }}>
                            {item.title}
                          </span>
                        </div>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Clock size={12} />
                          {formatDate(item.date)}
                        </span>
                      </div>

                      <p style={{ margin: '4px 0', fontSize: '12px', color: 'var(--text)' }}>
                        {item.description}
                      </p>

                      <div style={{ display: 'flex', gap: '14px', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                        {item.actor && <span>By: <strong>{item.actor}</strong></span>}
                        {item.cost > 0 && <span>Cost: <strong>{formatCurrency(item.cost)}</strong></span>}
                        {item.ref && <span>Ref: <strong>{item.ref}</strong></span>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* CREATE WORK ORDER MODAL */}
      <WorkOrderModal
        isOpen={showWorkOrderModal}
        onClose={() => {
          setShowWorkOrderModal(false);
          setSelectedMaintenanceForWo(null);
        }}
        onSubmit={handleCreateWorkOrder}
        assetId={asset._id || asset.assetId}
        assetName={asset.name}
        maintenanceRecords={maintenance}
        initialMaintenance={selectedMaintenanceForWo}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
