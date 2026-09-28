import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  IndianRupee,
  TrendingUp,
  AlertTriangle,
  Clock,
  Briefcase,
  PieChart,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useFetch } from '../hooks/useFetch';
import executiveService from '../services/executiveService';
import KpiCard from '../components/common/KpiCard';
import LoadingState from '../components/common/LoadingState';
import ErrorState from '../components/common/ErrorState';
import ImmediateAttentionPanel from '../components/executive/ImmediateAttentionPanel';
import CompactPipeline from '../components/executive/CompactPipeline';
import BudgetStageChart from '../components/executive/BudgetStageChart';
import ProjectStageChart from '../components/executive/ProjectStageChart';
import BudgetCategoryChart from '../components/executive/BudgetCategoryChart';
import SpendTrendChart from '../components/executive/SpendTrendChart';
import { formatCurrencyCompact, formatCurrencyFull, formatDate } from '../utils/formatters';

export default function ExecutiveOverview() {
  const navigate = useNavigate();

  const fetchSummary = useCallback(() => executiveService.getSummary(), []);
  const { data: summary, loading: summaryLoading, error: summaryError, refetch: refetchSummary } = useFetch(fetchSummary, []);

  const fetchAttention = useCallback(() => executiveService.getAttentionProjects(), []);
  const { data: attentionProjects, loading: attentionLoading, error: attentionError, refetch: refetchAttention } = useFetch(fetchAttention, []);

  if (summaryLoading || attentionLoading) {
    return <LoadingState message="Loading Executive Portfolio Overview & Financial Telemetry..." />;
  }

  if (summaryError || attentionError) {
    return (
      <ErrorState
        title="Executive Overview Unavailable"
        message={summaryError || attentionError}
        onRetry={() => {
          refetchSummary();
          refetchAttention();
        }}
      />
    );
  }

  if (!summary) return null;

  // Generate dynamic one-line executive summary sentence
  const immediateCount = summary.immediateCount || 0;
  const overBudgetCount = summary.overBudgetCount || 0;
  const delayedCount = summary.delayedCount || 0;

  let summarySentence = '';
  if (immediateCount > 0 && overBudgetCount > 0) {
    summarySentence = `${immediateCount} ${immediateCount === 1 ? 'project needs' : 'projects need'} immediate executive attention. ${overBudgetCount} ${overBudgetCount === 1 ? 'project is' : 'projects are'} over approved budget.`;
  } else if (immediateCount > 0) {
    summarySentence = `${immediateCount} ${immediateCount === 1 ? 'project needs' : 'projects need'} immediate attention across structural and schedule parameters.`;
  } else if (overBudgetCount > 0) {
    summarySentence = `${overBudgetCount} ${overBudgetCount === 1 ? 'project is' : 'projects are'} currently exceeding approved budget allocations.`;
  } else {
    summarySentence = `All ${summary.totalProjects} capital infrastructure projects are currently executing within approved fiscal and timeline thresholds.`;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Executive Header Strip */}
      <div
        style={{
          backgroundColor: 'var(--navy-900)',
          color: '#FFFFFF',
          padding: '18px 24px',
          borderRadius: 'var(--radius)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px',
          boxShadow: '0 2px 6px rgba(11, 31, 58, 0.15)'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span
              style={{
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.6px',
                color: 'var(--accent-gold)',
                fontWeight: 700
              }}
            >
              Department Secretary & Executive View
            </span>
            <span style={{ fontSize: '11px', color: 'var(--navy-100)', opacity: 0.8 }}>
              &bull; As of {formatDate(new Date())}
            </span>
          </div>

          <h2 style={{ margin: 0, fontSize: '22px', color: '#FFFFFF', fontWeight: 700 }}>
            Executive Infrastructure Portfolio Overview
          </h2>

          <p style={{ margin: '6px 0 0', fontSize: '13px', color: 'var(--navy-100)', fontWeight: 500 }}>
            {summarySentence}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => navigate('/executive/projects')}
            style={{ backgroundColor: '#FFFFFF', color: 'var(--navy-900)' }}
          >
            All Projects & Budget &rarr;
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={() => navigate('/executive/attention')}
          >
            Attention Dashboard ({attentionProjects?.length || 0})
          </button>
        </div>
      </div>

      {/* KPI Cards: Total Approved Budget, Amount Spent, Remaining Budget, Projects Needing Immediate Attention, Over-Budget, Delayed */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px' }}>
        <KpiCard
          title="Total Approved Budget"
          value={formatCurrencyCompact(summary.totalApprovedBudget)}
          subtitle={`${summary.totalProjects} capital projects`}
          icon={IndianRupee}
          onClick={() => navigate('/executive/projects')}
        />

        <KpiCard
          title="Amount Disbursed"
          value={formatCurrencyCompact(summary.totalSpent)}
          subtitle={`${summary.budgetUtilizationPct}% utilization rate`}
          icon={TrendingUp}
          onClick={() => navigate('/executive/projects')}
        />

        <KpiCard
          title="Remaining Balance"
          value={formatCurrencyCompact(summary.remainingBudget)}
          subtitle="Unutilized capital headroom"
          icon={Briefcase}
          onClick={() => navigate('/executive/projects')}
        />

        <KpiCard
          title="Immediate Attention"
          value={summary.immediateCount || 0}
          subtitle="Critical risk interventions"
          icon={AlertTriangle}
          alert={(summary.immediateCount || 0) > 0}
          onClick={() => navigate('/executive/attention')}
        />

        <KpiCard
          title="Over-Budget Projects"
          value={summary.overBudgetCount || 0}
          subtitle="Variance exceeding sanctioned limit"
          icon={PieChart}
          alert={(summary.overBudgetCount || 0) > 0}
          onClick={() => navigate('/executive/projects')}
        />

        <KpiCard
          title="Delayed Projects"
          value={summary.delayedCount || 0}
          subtitle="Milestones overdue > 60 days"
          icon={Clock}
          alert={(summary.delayedCount || 0) > 0}
          onClick={() => navigate('/executive/projects')}
        />
      </div>

      {/* Immediate Attention Priority Action Panel */}
      <ImmediateAttentionPanel attentionProjects={attentionProjects || []} />

      {/* Compact Project Pipeline across 5 stages */}
      <CompactPipeline budgetByStage={summary.budgetByStage || []} />

      {/* Charts Grid: 2x2 */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '16px' }}>
        <BudgetStageChart budgetByStage={summary.budgetByStage || []} />
        <ProjectStageChart projectsByStage={summary.projectsByStage || []} />
        <BudgetCategoryChart budgetByCategory={summary.budgetByCategory || []} />
        <SpendTrendChart monthlySpendTrend={summary.monthlySpendTrend || []} />
      </div>
    </div>
  );
}
