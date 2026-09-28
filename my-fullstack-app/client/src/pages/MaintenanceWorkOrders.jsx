import React, { useState, useEffect, useCallback } from 'react';
import { Wrench, ClipboardList, RefreshCw, CheckCircle } from 'lucide-react';
import workOrderService from '../services/workOrderService';
import maintenanceService from '../services/maintenanceService';
import WorkOrderTable from '../components/maintenance/WorkOrderTable';
import MaintenanceTable from '../components/maintenance/MaintenanceTable';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import { WORK_ORDER_STATUSES, MAINTENANCE_STATUSES, PRIORITIES } from '../utils/constants';

export default function MaintenanceWorkOrders() {
  const [activeTab, setActiveTab] = useState('workorders');
  const [workOrders, setWorkOrders] = useState([]);
  const [maintenanceRecords, setMaintenanceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [wos, mnts] = await Promise.all([
        workOrderService.getWorkOrders(),
        maintenanceService.getMaintenanceRecords()
      ]);
      setWorkOrders(wos || []);
      setMaintenanceRecords(mnts || []);
    } catch (err) {
      setError(err.message || 'Failed to load maintenance and work orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const showNotification = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleWorkOrderStatusChange = async (woId, newStatus) => {
    try {
      await workOrderService.updateWorkOrderStatus(woId, newStatus);
      showNotification(`Work Order status updated to '${newStatus}'.`);
      loadData();
    } catch (err) {
      alert(`Error updating work order: ${err.message}`);
    }
  };

  const handleMaintenanceStatusChange = async (mntId, newStatus) => {
    try {
      await maintenanceService.updateMaintenanceStatus(mntId, newStatus);
      showNotification(`Maintenance status updated to '${newStatus}'.`);
      loadData();
    } catch (err) {
      alert(`Error updating maintenance record: ${err.message}`);
    }
  };

  // Filtered lists
  const filteredWorkOrders = workOrders.filter((wo) => {
    if (statusFilter && wo.status !== statusFilter) return false;
    if (priorityFilter && wo.priority !== priorityFilter) return false;
    return true;
  });

  const filteredMaintenance = maintenanceRecords.filter((m) => {
    if (statusFilter && m.status !== statusFilter) return false;
    if (priorityFilter && m.priority !== priorityFilter) return false;
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '20px', color: 'var(--navy-900)', fontWeight: 700 }}>
            Maintenance & Work Order Operations
          </h2>
          <p style={{ margin: '2px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            Orchestrate remediation workflows, contractor work packages, priority dispatches, and status verifications.
          </p>
        </div>

        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={loadData}
        >
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      {successMsg && (
        <div style={{ padding: '8px 14px', backgroundColor: '#E8F5E9', border: '1px solid #C8E6C9', color: 'var(--good)', borderRadius: 'var(--radius)', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle size={16} />
          {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="tabs-nav" style={{ margin: 0, backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '0 8px' }}>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'workorders' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('workorders');
            setStatusFilter('');
          }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <Wrench size={14} />
          <span>Active Work Orders</span>
          <span style={{ backgroundColor: activeTab === 'workorders' ? 'var(--navy-700)' : 'var(--navy-100)', color: activeTab === 'workorders' ? '#FFFFFF' : 'var(--navy-800)', fontSize: '11px', padding: '1px 6px', borderRadius: '10px', fontWeight: 700 }}>
            {workOrders.length}
          </span>
        </button>

        <button
          type="button"
          className={`tab-btn ${activeTab === 'maintenance' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('maintenance');
            setStatusFilter('');
          }}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <ClipboardList size={14} />
          <span>Maintenance Records & Recommendations</span>
          <span style={{ backgroundColor: activeTab === 'maintenance' ? 'var(--navy-700)' : 'var(--navy-100)', color: activeTab === 'maintenance' ? '#FFFFFF' : 'var(--navy-800)', fontSize: '11px', padding: '1px 6px', borderRadius: '10px', fontWeight: 700 }}>
            {maintenanceRecords.length}
          </span>
        </button>
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
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--navy-900)' }}>
            Filter by:
          </div>

          <div>
            <select
              className="form-control"
              style={{ fontSize: '12px', padding: '4px 8px', width: 'auto' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Statuses</option>
              {(activeTab === 'workorders' ? WORK_ORDER_STATUSES : MAINTENANCE_STATUSES).map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          <div>
            <select
              className="form-control"
              style={{ fontSize: '12px', padding: '4px 8px', width: 'auto' }}
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="">All Priorities</option>
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p} Priority</option>
              ))}
            </select>
          </div>

          {(statusFilter || priorityFilter) && (
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => {
                setStatusFilter('');
                setPriorityFilter('');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Content Table */}
      {loading ? (
        <LoadingState message="Loading work orders and maintenance records..." />
      ) : error ? (
        <ErrorState title="Data Fetch Error" message={error} onRetry={loadData} />
      ) : activeTab === 'workorders' ? (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Showing {filteredWorkOrders.length} work order{filteredWorkOrders.length === 1 ? '' : 's'}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Click any asset name to open its Digital Asset Passport
            </span>
          </div>
          <WorkOrderTable
            workOrders={filteredWorkOrders}
            showAssetColumn={true}
            onStatusChange={handleWorkOrderStatusChange}
          />
        </div>
      ) : (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)' }}>
              Showing {filteredMaintenance.length} maintenance record{filteredMaintenance.length === 1 ? '' : 's'}
            </span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
              Click any asset name to open its Digital Asset Passport
            </span>
          </div>
          <MaintenanceTable
            records={filteredMaintenance}
            showAssetColumn={true}
            onStatusChange={handleMaintenanceStatusChange}
          />
        </div>
      )}
    </div>
  );
}
