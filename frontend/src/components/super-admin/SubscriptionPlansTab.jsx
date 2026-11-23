'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export default function SubscriptionPlansTab({ showToast, onCompanyUpdated }) {
  const [plans, setPlans] = useState([]);
  const [companySubs, setCompanySubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCycleFilter, setActiveCycleFilter] = useState('ALL'); // 'ALL' | 'MONTHLY' | 'HALF_YEARLY' | 'ANNUAL'
  const [activeView, setActiveView] = useState('plans'); // 'plans' | 'companies'

  // Plan Modal State
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [isSavingPlan, setIsSavingPlan] = useState(false);

  // Assign Modal State
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [assigningCompany, setAssigningCompany] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);

  const [planForm, setPlanForm] = useState({
    name: '',
    description: '',
    billingCycle: 'MONTHLY',
    price: '',
    currency: 'INR',
    maxLeads: '',
    maxEmployees: '',
    maxLeadSources: '',
    maxCustomers: '',
    maxSalesOrders: '',
    maxProducts: '',
    canUseWebhook: true,
    canUseIndiamart: false,
    canUseMeta: false,
    canUseEmail: true,
    canUseJustdial: false,
    canUseSalesFlow: true,
    canUseInventory: true,
    canUseReports: true,
    canUseAuditLog: true,
    isActive: true,
    isPopular: false,
  });

  const [assignForm, setAssignForm] = useState({
    companyId: '',
    planId: '',
    subscriptionStatus: 'ACTIVE',
    startDate: new Date().toISOString().slice(0, 10),
    endDate: '',
  });

  // Load plans & company subscriptions
  const loadData = async () => {
    setIsLoading(true);
    try {
      const [plansData, compsData] = await Promise.all([
        api.get('/subscriptions/plans', { noCache: true }),
        api.get('/subscriptions/companies', { noCache: true }),
      ]);
      if (plansData?.success) setPlans(plansData.data || []);
      if (compsData?.success) setCompanySubs(compsData.data || []);
    } catch (err) {
      if (showToast) showToast('Error', err.message || 'Could not load subscriptions', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Open Create Plan modal
  const handleOpenCreatePlan = (defaultCycle = 'MONTHLY') => {
    setEditingPlan(null);
    setPlanForm({
      name: '',
      description: '',
      billingCycle: defaultCycle,
      price: '',
      currency: 'INR',
      maxLeads: '',
      maxEmployees: '',
      maxLeadSources: '',
      maxCustomers: '',
      maxSalesOrders: '',
      maxProducts: '',
      canUseWebhook: true,
      canUseIndiamart: false,
      canUseMeta: false,
      canUseEmail: true,
      canUseJustdial: false,
      canUseSalesFlow: true,
      canUseInventory: true,
      canUseReports: true,
      canUseAuditLog: true,
      isActive: true,
      isPopular: false,
    });
    setShowPlanModal(true);
  };

  // Open Edit Plan modal
  const handleOpenEditPlan = (plan) => {
    setEditingPlan(plan);
    setPlanForm({
      name: plan.name || '',
      description: plan.description || '',
      billingCycle: plan.billingCycle || 'MONTHLY',
      price: plan.price || '',
      currency: plan.currency || 'INR',
      maxLeads: plan.maxLeads != null ? plan.maxLeads : '',
      maxEmployees: plan.maxEmployees != null ? plan.maxEmployees : '',
      maxLeadSources: plan.maxLeadSources != null ? plan.maxLeadSources : '',
      maxCustomers: plan.maxCustomers != null ? plan.maxCustomers : '',
      maxSalesOrders: plan.maxSalesOrders != null ? plan.maxSalesOrders : '',
      maxProducts: plan.maxProducts != null ? plan.maxProducts : '',
      canUseWebhook: plan.canUseWebhook ?? true,
      canUseIndiamart: plan.canUseIndiamart ?? false,
      canUseMeta: plan.canUseMeta ?? false,
      canUseEmail: plan.canUseEmail ?? true,
      canUseJustdial: plan.canUseJustdial ?? false,
      canUseSalesFlow: plan.canUseSalesFlow ?? true,
      canUseInventory: plan.canUseInventory ?? true,
      canUseReports: plan.canUseReports ?? true,
      canUseAuditLog: plan.canUseAuditLog ?? true,
      isActive: plan.isActive ?? true,
      isPopular: plan.isPopular ?? false,
    });
    setShowPlanModal(true);
  };

  // Save Plan (Create or Update)
  const handleSavePlan = async (e) => {
    e.preventDefault();
    if (!planForm.name.trim()) {
      if (showToast) showToast('Validation Error', 'Plan name is required.', 'danger');
      return;
    }
    setIsSavingPlan(true);
    try {
      const data = editingPlan
        ? await api.put(`/subscriptions/plans/${editingPlan.id}`, planForm)
        : await api.post('/subscriptions/plans', planForm);

      if (showToast) {
        showToast(
          editingPlan ? 'Plan Updated! ⚡' : 'Plan Created! 🚀',
          `"${planForm.name}" (${planForm.billingCycle}) saved.`,
          'success'
        );
      }
      setShowPlanModal(false);
      loadData();
    } catch (err) {
      if (showToast) showToast('Error', err.message, 'danger');
    } finally {
      setIsSavingPlan(false);
    }
  };

  // Delete Plan
  const handleDeletePlan = async (plan) => {
    if (!window.confirm(`Delete plan "${plan.name}" (${plan.billingCycle})? This cannot be undone.`)) return;
    try {
      await api.delete(`/subscriptions/plans/${plan.id}`);
      if (showToast) showToast('Plan Deleted', `Plan "${plan.name}" was removed.`, 'info');
      loadData();
    } catch (err) {
      if (showToast) showToast('Error', err.message, 'danger');
    }
  };

  // Open Assign Modal for a specific company or open generic
  const handleOpenAssignModal = (company = null) => {
    setAssigningCompany(company);
    const today = new Date();
    let defaultEnd = new Date(today);
    defaultEnd.setMonth(defaultEnd.getMonth() + 1);

    setAssignForm({
      companyId: company ? company.companyId : (companySubs[0]?.companyId || ''),
      planId: company?.subscriptionPlanId || (plans[0]?.id || ''),
      subscriptionStatus: company?.subscriptionStatus || 'ACTIVE',
      startDate: today.toISOString().slice(0, 10),
      endDate: defaultEnd.toISOString().slice(0, 10),
    });
    setShowAssignModal(true);
  };

  // When selected plan changes in assign modal, auto-calc expiry date
  const handleAssignPlanChange = (planId) => {
    const selected = plans.find((p) => p.id === planId);
    let endDate = new Date(assignForm.startDate || new Date());
    if (selected?.billingCycle === 'MONTHLY') {
      endDate.setMonth(endDate.getMonth() + 1);
    } else if (selected?.billingCycle === 'HALF_YEARLY') {
      endDate.setMonth(endDate.getMonth() + 6);
    } else if (selected?.billingCycle === 'ANNUAL') {
      endDate.setFullYear(endDate.getFullYear() + 1);
    }
    setAssignForm((prev) => ({
      ...prev,
      planId,
      endDate: endDate.toISOString().slice(0, 10),
    }));
  };

  // Submit Assign
  const handleSaveAssignment = async (e) => {
    e.preventDefault();
    if (!assignForm.companyId) {
      if (showToast) showToast('Error', 'Please select a company.', 'danger');
      return;
    }
    setIsAssigning(true);
    try {
      await api.patch(`/subscriptions/companies/${assignForm.companyId}/assign`, assignForm);
      if (showToast) showToast('Subscription Updated! 🏆', 'Plan successfully assigned to tenant company.', 'success');
      setShowAssignModal(false);
      loadData();
      if (onCompanyUpdated) onCompanyUpdated();
    } catch (err) {
      if (showToast) showToast('Error', err.message || 'Failed to assign plan', 'danger');
    } finally {
      setIsAssigning(false);
    }
  };

  // Filter plans by billing cycle
  const filteredPlans = plans.filter((p) => {
    if (activeCycleFilter === 'ALL') return true;
    return p.billingCycle === activeCycleFilter;
  });

  // Metrics
  const activeCompaniesCount = companySubs.filter((c) => Boolean(c.plan && c.subscriptionStatus === 'ACTIVE' && !c.isExpired)).length;
  const trialCompaniesCount = companySubs.filter((c) => Boolean(!c.plan || c.subscriptionStatus === 'TRIAL')).length;
  const expiredCompaniesCount = companySubs.filter((c) => Boolean(c.isExpired || c.subscriptionStatus === 'EXPIRED')).length;

  const cycleBadgeStyle = (cycle) => {
    switch (cycle) {
      case 'MONTHLY':
        return { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', label: '📅 Monthly' };
      case 'HALF_YEARLY':
        return { bg: '#fdf4ff', color: '#a21caf', border: '#f5d0fe', label: '🌓 Half-Yearly (6 Mo)' };
      case 'ANNUAL':
        return { bg: '#fefce8', color: '#854d0e', border: '#fef08a', label: '👑 Annual (12 Mo)' };
      default:
        return { bg: '#f1f5f9', color: '#475569', border: '#cbd5e1', label: cycle };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* ── Top Header Banner ── */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '1.25rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '2px 9px',
            borderRadius: '999px',
            background: '#faf5ff',
            color: '#7f22fe',
            fontSize: '0.73rem',
            fontWeight: 800,
            marginBottom: '0.35rem',
          }}>
            <span>●</span> Multi-Tenant Billing &amp; Subscription Engine
          </div>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
            Subscription Plans &amp; Tenant Quota Manager
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0.25rem 0 0' }}>
            Control lead caps, employee seats, lead ingestion sources, and billing cycles (Monthly, Half-Yearly, Annual) for all company admin panels.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={() => handleOpenAssignModal()}
            style={{
              padding: '0.62rem 1.15rem',
              borderRadius: '8px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>🏢</span> Assign Plan to Tenant
          </button>
          <button
            type="button"
            onClick={() => handleOpenCreatePlan(activeCycleFilter === 'ALL' ? 'MONTHLY' : activeCycleFilter)}
            style={{
              padding: '0.62rem 1.25rem',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #7f22fe 0%, #6d28d9 100%)',
              color: '#ffffff',
              fontSize: '0.84rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(127, 34, 254, 0.28)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <span>+</span> Create New Plan
          </button>
        </div>
      </div>

      {/* ── KPI Summary Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.9rem' }}>
        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem 1.2rem' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Configured Plans</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginTop: '0.25rem' }}>{plans.length}</div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>
            {plans.filter(p => p.billingCycle === 'MONTHLY').length} Monthly • {plans.filter(p => p.billingCycle === 'HALF_YEARLY').length} 6-Mo • {plans.filter(p => p.billingCycle === 'ANNUAL').length} Annual
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem 1.2rem' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#059669', textTransform: 'uppercase' }}>Active Paid Tenants</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669', marginTop: '0.25rem' }}>{activeCompaniesCount}</div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>
            Subscribed companies with active validity
          </div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem 1.2rem' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase' }}>Trial Companies</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d97706', marginTop: '0.25rem' }}>{trialCompaniesCount}</div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>Evaluating features on trial period</div>
        </div>

        <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1rem 1.2rem' }}>
          <div style={{ fontSize: '0.74rem', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase' }}>Expired / Suspended</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#dc2626', marginTop: '0.25rem' }}>{expiredCompaniesCount}</div>
          <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '0.2rem' }}>Requires renewal or plan upgrade</div>
        </div>
      </div>

      {/* ── Sub Navigation Strip ── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
        borderBottom: '1px solid #e2e8f0',
        paddingBottom: '0.5rem',
      }}>
        {/* Toggle Plans Grid vs Company Subscriptions List */}
        <div style={{ display: 'flex', gap: '0.4rem', background: '#f1f5f9', padding: '3px', borderRadius: '9px' }}>
          <button
            type="button"
            onClick={() => setActiveView('plans')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '7px',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: activeView === 'plans' ? '#ffffff' : 'transparent',
              color: activeView === 'plans' ? '#7f22fe' : '#64748b',
              boxShadow: activeView === 'plans' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            📋 Subscription Tiers ({plans.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveView('companies')}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '7px',
              border: 'none',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              background: activeView === 'companies' ? '#ffffff' : 'transparent',
              color: activeView === 'companies' ? '#7f22fe' : '#64748b',
              boxShadow: activeView === 'companies' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
            }}
          >
            🏢 Tenant Company Subscriptions ({companySubs.length})
          </button>
        </div>

        {/* Billing Cycle Filter (shown when viewing plans) */}
        {activeView === 'plans' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Billing Cycle:</span>
            {['ALL', 'MONTHLY', 'HALF_YEARLY', 'ANNUAL'].map((cycle) => (
              <button
                key={cycle}
                type="button"
                onClick={() => setActiveCycleFilter(cycle)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  border: activeCycleFilter === cycle ? '1px solid #7f22fe' : '1px solid #cbd5e1',
                  background: activeCycleFilter === cycle ? '#faf5ff' : '#ffffff',
                  color: activeCycleFilter === cycle ? '#7f22fe' : '#475569',
                  fontSize: '0.76rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                {cycle === 'ALL' && 'All Cycles'}
                {cycle === 'MONTHLY' && '📅 Monthly'}
                {cycle === 'HALF_YEARLY' && '🌓 Half-Yearly (6 Mo)'}
                {cycle === 'ANNUAL' && '👑 Annual (12 Mo)'}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── 1. PLANS GRID VIEW ── */}
      {activeView === 'plans' && (
        <>
          {isLoading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#64748b' }}>Loading plans...</div>
          ) : filteredPlans.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '2rem' }}>📦</div>
              <h3 style={{ margin: '0.5rem 0 0.25rem', fontSize: '1rem', fontWeight: 700 }}>No Plans for this Cycle</h3>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>Click &quot;Create New Plan&quot; to define a subscription tier.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.25rem' }}>
              {filteredPlans.map((plan) => {
                const badge = cycleBadgeStyle(plan.billingCycle);
                const priceFormatted = parseFloat(plan.price || 0).toLocaleString('en-IN');
                return (
                  <div
                    key={plan.id}
                    style={{
                      background: '#ffffff',
                      border: plan.isPopular ? '2px solid #7f22fe' : '1px solid #e2e8f0',
                      borderRadius: '14px',
                      padding: '1.4rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      boxShadow: plan.isPopular ? '0 6px 20px rgba(127, 34, 254, 0.12)' : '0 1px 3px rgba(0,0,0,0.03)',
                      position: 'relative',
                    }}
                  >
                    {plan.isPopular && (
                      <div style={{
                        position: 'absolute',
                        top: '-11px',
                        right: '18px',
                        background: 'linear-gradient(135deg, #7f22fe 0%, #6d28d9 100%)',
                        color: '#ffffff',
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        padding: '2px 10px',
                        borderRadius: '999px',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        boxShadow: '0 2px 6px rgba(127, 34, 254, 0.3)',
                      }}>
                        ★ Most Popular
                      </div>
                    )}

                    <div>
                      {/* Top tags */}
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '999px',
                          background: badge.bg,
                          color: badge.color,
                          border: `1px solid ${badge.border}`,
                        }}>
                          {badge.label}
                        </span>

                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: plan.companiesCount > 0 ? '#059669' : '#94a3b8',
                          background: plan.companiesCount > 0 ? '#ecfdf5' : '#f8fafc',
                          padding: '2px 7px',
                          borderRadius: '6px',
                          border: `1px solid ${plan.companiesCount > 0 ? '#a7f3d0' : '#e2e8f0'}`,
                        }}>
                          🏢 {plan.companiesCount} {plan.companiesCount === 1 ? 'Client' : 'Clients'}
                        </span>
                      </div>

                      {/* Title & Description */}
                      <h3 style={{ margin: '0.85rem 0 0.25rem', fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                        {plan.name}
                      </h3>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: 1.4, minHeight: '34px' }}>
                        {plan.description || 'Enterprise CRM subscription plan with quota limits.'}
                      </p>

                      {/* Price */}
                      <div style={{ margin: '0.9rem 0 1rem', display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
                        <span style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a' }}>₹{priceFormatted}</span>
                        <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                          {plan.billingCycle === 'MONTHLY' && '/ month'}
                          {plan.billingCycle === 'HALF_YEARLY' && '/ 6 months'}
                          {plan.billingCycle === 'ANNUAL' && '/ year'}
                        </span>
                      </div>

                      {/* Quotas & Limits */}
                      <div style={{
                        background: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '10px',
                        padding: '0.75rem 0.9rem',
                        fontSize: '0.78rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.45rem',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#475569' }}>🎯 Max Leads:</span>
                          <strong style={{ color: plan.maxLeads ? '#0f172a' : '#059669' }}>
                            {plan.maxLeads ? `${plan.maxLeads.toLocaleString('en-IN')} Leads` : 'Unlimited ∞'}
                          </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#475569' }}>👥 Max Employees / Seats:</span>
                          <strong style={{ color: plan.maxEmployees ? '#0f172a' : '#059669' }}>
                            {plan.maxEmployees ? `${plan.maxEmployees} Seats` : 'Unlimited ∞'}
                          </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#475569' }}>🔗 Lead Channel Sources:</span>
                          <strong>
                            {plan.maxLeadSources ? `${plan.maxLeadSources} Active Sources` : 'All Sources Unlimited'}
                          </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#475569' }}>🏢 Customer Accounts:</span>
                          <strong>
                            {plan.maxCustomers ? `${plan.maxCustomers} Accounts` : 'Unlimited'}
                          </strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#475569' }}>📑 Sales Orders:</span>
                          <strong>
                            {plan.maxSalesOrders ? `${plan.maxSalesOrders} Orders` : 'Unlimited'}
                          </strong>
                        </div>
                      </div>

                      {/* Channel Ingestion Access Matrix */}
                      <div style={{ marginTop: '0.9rem' }}>
                        <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.4rem' }}>
                          Supported Ingestion Sources:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                          <span style={{
                            fontSize: '0.72rem',
                            padding: '2px 7px',
                            borderRadius: '5px',
                            background: plan.canUseWebhook ? '#ecfdf5' : '#f1f5f9',
                            color: plan.canUseWebhook ? '#059669' : '#94a3b8',
                            border: `1px solid ${plan.canUseWebhook ? '#a7f3d0' : '#e2e8f0'}`,
                            fontWeight: 600,
                          }}>
                            {plan.canUseWebhook ? '✓' : '✕'} Webhook (Forms)
                          </span>
                          <span style={{
                            fontSize: '0.72rem',
                            padding: '2px 7px',
                            borderRadius: '5px',
                            background: plan.canUseIndiamart ? '#eff6ff' : '#f1f5f9',
                            color: plan.canUseIndiamart ? '#1d4ed8' : '#94a3b8',
                            border: `1px solid ${plan.canUseIndiamart ? '#bfdbfe' : '#e2e8f0'}`,
                            fontWeight: 600,
                          }}>
                            {plan.canUseIndiamart ? '✓' : '✕'} 🇮🇳 IndiaMART
                          </span>
                          <span style={{
                            fontSize: '0.72rem',
                            padding: '2px 7px',
                            borderRadius: '5px',
                            background: plan.canUseMeta ? '#faf5ff' : '#f1f5f9',
                            color: plan.canUseMeta ? '#7f22fe' : '#94a3b8',
                            border: `1px solid ${plan.canUseMeta ? '#e9d5ff' : '#e2e8f0'}`,
                            fontWeight: 600,
                          }}>
                            {plan.canUseMeta ? '✓' : '✕'} 📘 Meta (FB/Insta)
                          </span>
                          <span style={{
                            fontSize: '0.72rem',
                            padding: '2px 7px',
                            borderRadius: '5px',
                            background: plan.canUseEmail ? '#ecfdf5' : '#f1f5f9',
                            color: plan.canUseEmail ? '#059669' : '#94a3b8',
                            border: `1px solid ${plan.canUseEmail ? '#a7f3d0' : '#e2e8f0'}`,
                            fontWeight: 600,
                          }}>
                            {plan.canUseEmail ? '✓' : '✕'} ✉️ Email Forward
                          </span>
                          <span style={{
                            fontSize: '0.72rem',
                            padding: '2px 7px',
                            borderRadius: '5px',
                            background: plan.canUseJustdial ? '#fffbeb' : '#f1f5f9',
                            color: plan.canUseJustdial ? '#b45309' : '#94a3b8',
                            border: `1px solid ${plan.canUseJustdial ? '#fde68a' : '#e2e8f0'}`,
                            fontWeight: 600,
                          }}>
                            {plan.canUseJustdial ? '✓' : '✕'} 📞 JustDial
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEditPlan(plan)}
                        style={{
                          flex: 1,
                          padding: '0.45rem',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          background: '#ffffff',
                          color: '#334155',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        ✏️ Edit Plan
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeletePlan(plan)}
                        disabled={plan.companiesCount > 0}
                        title={plan.companiesCount > 0 ? 'Cannot delete plan while clients are assigned to it' : 'Delete plan'}
                        style={{
                          padding: '0.45rem 0.75rem',
                          borderRadius: '6px',
                          border: '1px solid #fecaca',
                          background: plan.companiesCount > 0 ? '#f8fafc' : '#fef2f2',
                          color: plan.companiesCount > 0 ? '#cbd5e1' : '#dc2626',
                          fontSize: '0.76rem',
                          fontWeight: 700,
                          cursor: plan.companiesCount > 0 ? 'not-allowed' : 'pointer',
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* ── 2. TENANT COMPANIES ASSIGNMENT TABLE VIEW ── */}
      {activeView === 'companies' && (
        <div style={{ background: '#ffffff', borderRadius: '14px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <div style={{ padding: '0.9rem 1.25rem', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.86rem', fontWeight: 800, color: '#0f172a' }}>
              Tenant Client Panels &amp; Assigned Subscriptions ({companySubs.length})
            </span>
            <button
              type="button"
              onClick={() => handleOpenAssignModal()}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: '6px',
                border: 'none',
                background: '#7f22fe',
                color: '#ffffff',
                fontSize: '0.76rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              + Assign / Upgrade Plan
            </button>
          </div>

          <div style={{ overflowX: 'auto', width: '100%' }}>
            <table style={{ width: '100%', minWidth: '950px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.84rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '0.73rem', textTransform: 'uppercase', letterSpacing: '0.04em', fontWeight: 700 }}>
                  <th style={{ padding: '0.85rem 1.25rem' }}>Tenant Organization</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Active Plan</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Billing Cycle</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Lead Quota</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Employee Seats</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                  <th style={{ padding: '0.85rem 1rem' }}>Expiry Date</th>
                  <th style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {companySubs.map((c) => {
                  const statusColor = c.subscriptionStatus === 'ACTIVE'
                    ? { bg: '#ecfdf5', color: '#059669', border: '#a7f3d0' }
                    : c.subscriptionStatus === 'TRIAL'
                    ? { bg: '#fffbeb', color: '#b45309', border: '#fde68a' }
                    : { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' };

                  return (
                    <tr key={c.companyId} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.85rem 1.25rem' }}>
                        <div style={{ fontWeight: 800, color: '#0f172a' }}>{c.companyName}</div>
                        <div style={{ fontSize: '0.74rem', color: '#64748b' }}>{c.email}</div>
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {c.plan ? (
                          <span style={{ fontWeight: 700, color: '#7f22fe' }}>{c.plan.name}</span>
                        ) : (
                          <span style={{ color: '#d97706', fontWeight: 600, fontSize: '0.76rem', background: '#fffbeb', padding: '2px 8px', borderRadius: '4px', border: '1px solid #fde68a' }}>
                            🟡 Free Trial (No Plan)
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {c.plan?.billingCycle ? (
                          <span style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '999px',
                            background: cycleBadgeStyle(c.plan.billingCycle).bg,
                            color: cycleBadgeStyle(c.plan.billingCycle).color,
                          }}>
                            {cycleBadgeStyle(c.plan.billingCycle).label}
                          </span>
                        ) : '—'}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                        {c.plan?.maxLeads ? `${c.plan.maxLeads.toLocaleString('en-IN')} max` : (c.plan ? 'Unlimited ∞' : '—')}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 600 }}>
                        {c.plan?.maxEmployees ? `${c.plan.maxEmployees} Seats` : (c.plan ? 'Unlimited ∞' : '—')}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '999px',
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          background: statusColor.bg,
                          color: statusColor.color,
                          border: `1px solid ${statusColor.border}`,
                        }}>
                          {c.subscriptionStatus}
                        </span>
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontSize: '0.78rem', color: c.isExpired ? '#dc2626' : '#64748b', fontWeight: c.isExpired ? 700 : 400 }}>
                        {c.subscriptionEndDate ? new Date(c.subscriptionEndDate).toLocaleDateString('en-IN') : 'Ongoing'}
                        {c.isExpired && ' (Expired)'}
                      </td>
                      <td style={{ padding: '0.85rem 1.25rem', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenAssignModal(c)}
                          style={{
                            padding: '0.35rem 0.75rem',
                            borderRadius: '6px',
                            border: '1px solid #7f22fe',
                            background: '#faf5ff',
                            color: '#7f22fe',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                          }}
                        >
                          Change Plan
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── CREATE / EDIT PLAN MODAL ── */}
      {showPlanModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            padding: '1rem',
          }}
          onClick={() => setShowPlanModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              background: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 20px 45px rgba(0,0,0,0.2)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{
              padding: '1.1rem 1.5rem',
              background: 'linear-gradient(135deg, #f8fafc 0%, #faf5ff 100%)',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  {editingPlan ? 'Edit Subscription Tier' : 'Create New Subscription Tier'}
                </h3>
                <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                  Define pricing, quota limits (leads, employees), and lead ingestion channel access.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPlanModal(false)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '7px',
                  padding: '0.35rem 0.6rem',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSavePlan} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflowY: 'auto' }}>
              <div style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Name & Billing Cycle */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                      Plan Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Starter CRM, Growth Pro, Enterprise"
                      value={planForm.name}
                      onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '7px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                      Billing Cycle *
                    </label>
                    <select
                      value={planForm.billingCycle}
                      onChange={(e) => setPlanForm({ ...planForm, billingCycle: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '7px', border: '1px solid #cbd5e1', fontSize: '0.84rem', background: '#ffffff' }}
                    >
                      <option value="MONTHLY">📅 Monthly (1 Month)</option>
                      <option value="HALF_YEARLY">🌓 Half-Yearly (6 Months)</option>
                      <option value="ANNUAL">👑 Annual (12 Months)</option>
                    </select>
                  </div>
                </div>

                {/* Price & Currency */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                      Price (₹ INR) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      placeholder="e.g. 1999"
                      value={planForm.price}
                      onChange={(e) => setPlanForm({ ...planForm, price: e.target.value })}
                      style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '7px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                      Popular Badge
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.82rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={planForm.isPopular}
                        onChange={(e) => setPlanForm({ ...planForm, isPopular: e.target.checked })}
                      />
                      Highlight as &quot;Most Popular&quot; tier
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Description / Pitch
                  </label>
                  <input
                    type="text"
                    placeholder="Short 1-line description of whom this plan is tailored for"
                    value={planForm.description}
                    onChange={(e) => setPlanForm({ ...planForm, description: e.target.value })}
                    style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '7px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                  />
                </div>

                {/* Quota / Caps */}
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.65rem' }}>
                    Tenant Resource Limits (Leave empty for Unlimited)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.85rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>
                        Max Leads Cap
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 500 (blank = unlimited)"
                        value={planForm.maxLeads}
                        onChange={(e) => setPlanForm({ ...planForm, maxLeads: e.target.value })}
                        style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>
                        Max Employee Seats
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 5 (blank = unlimited)"
                        value={planForm.maxEmployees}
                        onChange={(e) => setPlanForm({ ...planForm, maxEmployees: e.target.value })}
                        style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#475569', marginBottom: '0.2rem' }}>
                        Max Active Ingestion Channels
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 2 (blank = unlimited)"
                        value={planForm.maxLeadSources}
                        onChange={(e) => setPlanForm({ ...planForm, maxLeadSources: e.target.value })}
                        style={{ width: '100%', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                      />
                    </div>
                  </div>
                </div>

                {/* Lead Channels Allowed */}
                <div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                    Supported Ingestion Channels for this Plan:
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={planForm.canUseWebhook}
                        onChange={(e) => setPlanForm({ ...planForm, canUseWebhook: e.target.checked })}
                      />
                      🌐 Website Webhook
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={planForm.canUseIndiamart}
                        onChange={(e) => setPlanForm({ ...planForm, canUseIndiamart: e.target.checked })}
                      />
                      🇮🇳 IndiaMART API
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={planForm.canUseMeta}
                        onChange={(e) => setPlanForm({ ...planForm, canUseMeta: e.target.checked })}
                      />
                      📘 Meta (FB/Insta Ads)
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={planForm.canUseEmail}
                        onChange={(e) => setPlanForm({ ...planForm, canUseEmail: e.target.checked })}
                      />
                      ✉️ Gmail / Email Ingestion
                    </label>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.8rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={planForm.canUseJustdial}
                        onChange={(e) => setPlanForm({ ...planForm, canUseJustdial: e.target.checked })}
                      />
                      📞 JustDial / TradeIndia
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div style={{
                padding: '0.85rem 1.5rem',
                background: '#f8fafc',
                borderTop: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '0.65rem',
              }}>
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  style={{
                    padding: '0.55rem 1.1rem',
                    borderRadius: '7px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPlan}
                  style={{
                    padding: '0.55rem 1.25rem',
                    borderRadius: '7px',
                    border: 'none',
                    background: '#7f22fe',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: isSavingPlan ? 'wait' : 'pointer',
                  }}
                >
                  {isSavingPlan ? 'Saving...' : editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── ASSIGN PLAN MODAL ── */}
      {showAssignModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            padding: '1rem',
          }}
          onClick={() => setShowAssignModal(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '540px',
              background: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 20px 45px rgba(0,0,0,0.2)',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{
              padding: '1.1rem 1.5rem',
              background: 'linear-gradient(135deg, #f8fafc 0%, #faf5ff 100%)',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                  Assign Plan to Tenant
                </h3>
                <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: '#64748b' }}>
                  Select the subscription plan and set validity for the company panel.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAssignModal(false)}
                style={{
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '7px',
                  padding: '0.35rem 0.6rem',
                  cursor: 'pointer',
                  fontWeight: 700,
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveAssignment} style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  Tenant Organization *
                </label>
                <select
                  required
                  value={assignForm.companyId}
                  onChange={(e) => setAssignForm({ ...assignForm, companyId: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '7px', border: '1px solid #cbd5e1', fontSize: '0.84rem', background: '#ffffff' }}
                >
                  <option value="">Select Tenant Company...</option>
                  {companySubs.map((c) => (
                    <option key={c.companyId} value={c.companyId}>
                      {c.companyName} ({c.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  Subscription Plan *
                </label>
                <select
                  required
                  value={assignForm.planId}
                  onChange={(e) => handleAssignPlanChange(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '7px', border: '1px solid #cbd5e1', fontSize: '0.84rem', background: '#ffffff' }}
                >
                  <option value="">Select Plan Tier...</option>
                  {plans.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} — {p.billingCycle} (₹{parseFloat(p.price).toLocaleString('en-IN')}) — {p.maxLeads ? `${p.maxLeads} Leads` : 'Unlimited Leads'}, {p.maxEmployees ? `${p.maxEmployees} Seats` : 'Unlimited Seats'}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Start Date
                  </label>
                  <input
                    type="date"
                    value={assignForm.startDate}
                    onChange={(e) => setAssignForm({ ...assignForm, startDate: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '7px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                    Expiry / Next Renewal
                  </label>
                  <input
                    type="date"
                    value={assignForm.endDate}
                    onChange={(e) => setAssignForm({ ...assignForm, endDate: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: '7px', border: '1px solid #cbd5e1', fontSize: '0.84rem' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.3rem' }}>
                  Subscription Status
                </label>
                <select
                  value={assignForm.subscriptionStatus}
                  onChange={(e) => setAssignForm({ ...assignForm, subscriptionStatus: e.target.value })}
                  style={{ width: '100%', padding: '0.55rem 0.8rem', borderRadius: '7px', border: '1px solid #cbd5e1', fontSize: '0.84rem', background: '#ffffff' }}
                >
                  <option value="ACTIVE">🟢 ACTIVE (Full Access)</option>
                  <option value="TRIAL">🟡 TRIAL (Evaluation)</option>
                  <option value="EXPIRED">🔴 EXPIRED (Renew Required)</option>
                  <option value="SUSPENDED">🔒 SUSPENDED</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  style={{
                    padding: '0.55rem 1.1rem',
                    borderRadius: '7px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#475569',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAssigning}
                  style={{
                    padding: '0.55rem 1.25rem',
                    borderRadius: '7px',
                    border: 'none',
                    background: '#7f22fe',
                    color: '#ffffff',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: isAssigning ? 'wait' : 'pointer',
                  }}
                >
                  {isAssigning ? 'Assigning...' : 'Confirm Assignment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

