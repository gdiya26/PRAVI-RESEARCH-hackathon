import React, { useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  ArrowUpDown,
  AlertTriangle,
  CheckCircle,
  Clock,
  Layers,
  IndianRupee,
  RefreshCw
} from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import executiveService from '../services/executiveService';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import EmptyState from '../components/common/EmptyState';
import {
  CATEGORIES,
  LIFECYCLE_STAGES,
  STAGE_LABELS
} from '../utils/constants';
import {
  formatCurrencyCompact,
  formatCurrencyFull,
  formatDate
} from '../utils/formatters';

export default function ProjectsBudget() {
  const navigate = useNavigate();

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stageFilter, setStageFilter] = useState('');
  const [attentionOnly, setAttentionOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Sorting: field ('budget', 'variance', 'name', 'stage'), direction ('asc', 'desc')
  const [sortField, setSortField] = useState('variance');
  const [sortDirection, setSortDirection] = useState('desc');

  const fetchProjects = useCallback(() => {
    const params = {};
    if (categoryFilter) params.category = categoryFilter;
    if (stageFilter) params.stage = stageFilter;
    if (attentionOnly) params.attention = 'true';
    if (searchTerm) params.search = searchTerm;
    return executiveService.getProjects(params);
  }, [categoryFilter, stageFilter, attentionOnly, searchTerm]);

  const { data: projects, loading, error, refetch } = useFetch(
    fetchProjects,
    [categoryFilter, stageFilter, attentionOnly, searchTerm]
  );

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Sort projects locally
  const sortedProjects = useMemo(() => {
    if (!projects) return [];
    return [...projects].sort((a, b) => {
      let valA, valB;
      if (sortField === 'budget') {
        valA = a.approvedBudget || 0;
        valB = b.approvedBudget || 0;
      } else if (sortField === 'variance') {
        valA = a.budgetVariancePct || 0;
        valB = b.budgetVariancePct || 0;
      } else if (sortField === 'spent') {
        valA = a.amountSpent || 0;
        valB = b.amountSpent || 0;
      } else if (sortField === 'name') {
        valA = (a.projectName || a.name || '').toLowerCase();
        valB = (b.projectName || b.name || '').toLowerCase();
      } else {
        valA = a.assetId;
        valB = b.assetId;
      }

      if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [projects, sortField, sortDirection]);

  // Calculate totals
  const totals = useMemo(() => {
    if (!sortedProjects || sortedProjects.length === 0) {
      return { approved: 0, spent: 0, count: 0, variance: 0 };
    }
    const approved = sortedProjects.reduce((sum, p) => sum + (p.approvedBudget || 0), 0);
    const spent = sortedProjects.reduce((sum, p) => sum + (p.amountSpent || 0), 0);
    const variance = approved > 0 ? ((spent - approved) / approved) * 100 : 0;
    return {
      approved,
      spent,
      count: sortedProjects.length,
      variance: Number(variance.toFixed(1))
    };
  }, [sortedProjects]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title & Actions Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <span style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--navy-700)', fontWeight: 700, letterSpacing: '0.5px' }}>
            Financial Portfolio Directory
          </span>
          <h2 style={{ margin: '2px 0 0', fontSize: '22px', color: 'var(--navy-900)', fontWeight: 700 }}>
            Projects & Budget Allocation Registry
          </h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-muted)' }}>
            High-level fiscal tracking, contract disbursements, and milestone delivery status for all state infrastructure.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={refetch}
            title="Refresh registry"
          >
            <RefreshCw size={13} /> Refresh
          </button>
        </div>
      </div>

      {/* Filter Strip */}
      <div
        className="card"
        style={{
          margin: 0,
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', flex: 1 }}>
          {/* Search Box */}
          <div style={{ position: 'relative', minWidth: '220px', flex: '1 1 220px' }}>
            <Search
              size={15}
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
            />
            <input
              type="text"
              className="form-control"
              placeholder="Search by project name, ID, contractor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '32px' }}
            />
          </div>

          {/* Category Filter */}
          <select
            className="form-control"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '130px' }}
          >
            <option value="">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Stage Filter */}
          <select
            className="form-control"
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="">All Lifecycle Stages</option>
            {LIFECYCLE_STAGES.map((st) => (
              <option key={st} value={st}>
                {STAGE_LABELS[st] || st}
              </option>
            ))}
          </select>

          {/* Attention Only Filter */}
          <label
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              color: attentionOnly ? 'var(--critical)' : 'var(--text)'
            }}
          >
            <input
              type="checkbox"
              checked={attentionOnly}
              onChange={(e) => setAttentionOnly(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            <span>Attention Required Only</span>
          </label>
        </div>

        {/* Clear filters if active */}
        {(categoryFilter || stageFilter || attentionOnly || searchTerm) && (
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setCategoryFilter('');
              setStageFilter('');
              setAttentionOnly(false);
              setSearchTerm('');
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Main Table Container */}
      {loading ? (
        <LoadingState message="Fetching project portfolio records..." />
      ) : error ? (
        <ErrorState message={error} onRetry={refetch} />
      ) : sortedProjects.length === 0 ? (
        <EmptyState
          title="No Matching Projects Found"
          message="Adjust filter criteria or search keyword to view portfolio assets."
          actionText="Clear Filters"
          onAction={() => {
            setCategoryFilter('');
            setStageFilter('');
            setAttentionOnly(false);
            setSearchTerm('');
          }}
        />
      ) : (
        <div className="table-container">
          <table className="dense-table">
            <thead>
              <tr>
                <th onClick={() => toggleSort('name')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    Project Name & Identifier
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th>Category</th>
                <th>Stage</th>
                <th style={{ width: '110px' }}>Progress</th>
                <th
                  onClick={() => toggleSort('budget')}
                  style={{ cursor: 'pointer', textAlign: 'right' }}
                >
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', width: '100%' }}>
                    Approved Budget
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('spent')}
                  style={{ cursor: 'pointer', textAlign: 'right' }}
                >
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', width: '100%' }}>
                    Amount Spent
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('variance')}
                  style={{ cursor: 'pointer', textAlign: 'right' }}
                >
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end', width: '100%' }}>
                    Variance %
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th>Schedule</th>
                <th>Expected End</th>
                <th>Executive Status</th>
              </tr>
            </thead>
            <tbody>
              {sortedProjects.map((project) => {
                const isOverBudget = project.budgetVariancePct > 0;
                const isImmediate = project.priorityLevel === 'IMMEDIATE';
                const isWatch = project.priorityLevel === 'WATCH';

                let attentionBadge = (
                  <span className="badge badge-good">OK</span>
                );
                if (isImmediate) {
                  attentionBadge = (
                    <span className="badge badge-critical" title={project.attentionReasons?.join('; ')}>
                      IMMEDIATE
                    </span>
                  );
                } else if (isWatch) {
                  attentionBadge = (
                    <span className="badge badge-fair" title={project.attentionReasons?.join('; ')}>
                      WATCH
                    </span>
                  );
                }

                let scheduleBadgeColor = 'var(--good)';
                let scheduleBadgeBg = '#E8F5E9';
                if (project.scheduleStatus === 'DELAYED') {
                  scheduleBadgeColor = 'var(--critical)';
                  scheduleBadgeBg = '#FEE2E2';
                } else if (project.scheduleStatus === 'AT_RISK') {
                  scheduleBadgeColor = 'var(--fair)';
                  scheduleBadgeBg = '#FEF3C7';
                }

                return (
                  <tr
                    key={project._id || project.assetId}
                    className="clickable-row"
                    onClick={() => navigate(`/assets/${project.assetId}`)}
                    title="Click to open Digital Asset Passport"
                  >
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--navy-900)' }}>
                        {project.projectName || project.name}
                      </div>
                      <div style={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--navy-700)', fontWeight: 700 }}>
                        {project.assetId} &bull; <span style={{ fontFamily: 'inherit', fontWeight: 'normal', color: 'var(--text-muted)' }}>{project.contractor || project.department}</span>
                      </div>
                    </td>

                    <td>
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--navy-700)' }}>
                        {project.category}
                      </span>
                    </td>

                    <td>
                      <span style={{ fontSize: '12px' }}>
                        {STAGE_LABELS[project.lifecycleStage] || project.lifecycleStage}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div
                          style={{
                            flex: 1,
                            backgroundColor: 'var(--navy-100)',
                            height: '6px',
                            borderRadius: '3px',
                            overflow: 'hidden'
                          }}
                        >
                          <div
                            style={{
                              width: `${project.progressPct || 50}%`,
                              backgroundColor: project.progressPct === 100 ? 'var(--good)' : 'var(--navy-700)',
                              height: '100%'
                            }}
                          />
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 600, width: '28px', textAlign: 'right' }}>
                          {project.progressPct}%
                        </span>
                      </div>
                    </td>

                    <td style={{ textAlign: 'right', fontWeight: 600 }} title={formatCurrencyFull(project.approvedBudget)}>
                      {formatCurrencyCompact(project.approvedBudget)}
                    </td>

                    <td style={{ textAlign: 'right', fontWeight: 600, color: 'var(--navy-900)' }} title={formatCurrencyFull(project.amountSpent)}>
                      {formatCurrencyCompact(project.amountSpent)}
                    </td>

                    <td
                      style={{
                        textAlign: 'right',
                        fontWeight: 700,
                        color: isOverBudget ? 'var(--critical)' : (project.budgetVariancePct < 0 ? 'var(--good)' : 'var(--text-muted)')
                      }}
                    >
                      {project.budgetVariancePct > 0 ? `+${project.budgetVariancePct}%` : `${project.budgetVariancePct}%`}
                    </td>

                    <td>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: 700,
                          padding: '2px 6px',
                          borderRadius: 'var(--radius)',
                          color: scheduleBadgeColor,
                          backgroundColor: scheduleBadgeBg,
                          textTransform: 'uppercase'
                        }}
                      >
                        {(project.scheduleStatus || 'ON_TRACK').replace('_', ' ')}
                      </span>
                    </td>

                    <td style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                      {formatDate(project.expectedEndDate || project.plannedEndDate)}
                    </td>

                    <td>
                      {attentionBadge}
                    </td>
                  </tr>
                );
              })}
            </tbody>

            {/* Totals Row */}
            <tfoot>
              <tr style={{ backgroundColor: 'var(--navy-100)', fontWeight: 700, borderTop: '2px solid var(--navy-700)' }}>
                <td>
                  TOTAL PORTFOLIO SUMMARY ({totals.count} Projects)
                </td>
                <td colSpan={3}></td>
                <td style={{ textAlign: 'right', color: 'var(--navy-900)', fontSize: '13px' }} title={formatCurrencyFull(totals.approved)}>
                  {formatCurrencyCompact(totals.approved)}
                </td>
                <td style={{ textAlign: 'right', color: 'var(--navy-900)', fontSize: '13px' }} title={formatCurrencyFull(totals.spent)}>
                  {formatCurrencyCompact(totals.spent)}
                </td>
                <td
                  style={{
                    textAlign: 'right',
                    fontSize: '13px',
                    color: totals.variance > 0 ? 'var(--critical)' : 'var(--good)'
                  }}
                >
                  {totals.variance > 0 ? `+${totals.variance}%` : `${totals.variance}%`}
                </td>
                <td colSpan={3}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </div>
  );
}
