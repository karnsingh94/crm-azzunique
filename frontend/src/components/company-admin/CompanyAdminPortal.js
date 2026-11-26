'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import styles from './CompanyAdminPortal.module.css';
import { CompanyAuthProvider, useCompanyAuthContext } from '@/context/CompanyAuthContext';
import { restoreSuperAdminSession } from '@/lib/auth';
import { useCompanyAuth } from '@/hooks/useCompanyAuth';
import { useCompanyAccess } from '@/hooks/useCompanyAccess';

// Layout & UI components
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import CompanyAdminBreadcrumbs from '@/components/navigation/Breadcrumbs';
import ToastContainer from '@/components/ui/Toast';
import EmptyState from '@/components/ui/EmptyState';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

import { resolveCanonicalUrl } from '@/config/routes.config';

const lazyFeature = (loader) => dynamic(loader, {
  loading: () => <LoadingSkeleton rows={5} height="48px" />,
});

// Keep the shared shell lightweight. Feature bundles are downloaded only when
// their route is opened instead of delaying the Employee dashboard first paint.
const CompanyDashboard = lazyFeature(() => import('@/components/dashboard/CompanyDashboard'));
const CrmModule = lazyFeature(() => import('@/components/modules/CrmModule'));
const ProductsModule = lazyFeature(() => import('@/components/modules/ProductsModule'));
const SalesModule = lazyFeature(() => import('@/components/modules/SalesModule'));
const TeamModule = lazyFeature(() => import('@/components/modules/TeamModule'));
const ReportsModule = lazyFeature(() => import('@/components/modules/ReportsModule'));
const SettingsModule = lazyFeature(() => import('@/components/modules/SettingsModule'));
const ServiceDepartments = lazyFeature(() => import('@/components/departments/ServiceDepartments'));

export function resolveTabFromPathname(pathname) {
  if (!pathname || pathname === '/' || pathname === '/dashboard') return 'dashboard';
  if (pathname === '/settings') return 'settings';
  if (pathname.startsWith('/reports')) return 'reports';

  const serviceDeptMatch = pathname.match(/^\/services\/([^\/]+)(\/(?:department-head|service-team|departments|teams(?:\/[^\/]+)?))?$/);
  if (serviceDeptMatch) {
    return `services:${serviceDeptMatch[1].replace(/-/g, '_')}:departments`;
  }

  if (pathname.startsWith('/crm')) return 'crm_sales:crm';
  if (pathname.startsWith('/products')) return 'crm_sales:product';
  if (pathname.startsWith('/sales')) return 'crm_sales:sales';
  if (pathname.startsWith('/vendors')) return 'purchase_vendor:vendor';
  if (pathname.startsWith('/procurement')) return 'purchase_vendor:procurement';
  if (pathname.startsWith('/grn')) return 'purchase_vendor:grn';
  if (pathname.startsWith('/gate-pass')) return 'inventory_warehouse:gate_pass';
  if (pathname.startsWith('/inventory')) return 'inventory_warehouse:inventory_mgmt';
  if (pathname.startsWith('/bom')) return 'manufacturing_production:bom';
  if (pathname.startsWith('/contract-manufacturing') || pathname.startsWith('/job-work')) return 'manufacturing_production:contract_manufacturing';
  if (pathname.startsWith('/production')) return 'manufacturing_production:production';
  if (pathname.startsWith('/returns')) return 'dispatch_returns:returns';
  if (pathname.startsWith('/dispatch')) return 'dispatch_returns:dispatch';
  if (pathname.startsWith('/accounts')) return 'accounts_banking:accounts_banking';
  if (pathname.startsWith('/team')) return 'permission_controls:permission_controls';
  if (pathname.startsWith('/hr')) {
    if (pathname.startsWith('/hr/attendance') || pathname.startsWith('/hr/shifts') || pathname.startsWith('/hr/leaves') || pathname.startsWith('/hr/biometric')) {
      return 'hrms_payroll:hr_attendance';
    }
    return 'hrms_payroll:hr_employee';
  }
  if (pathname.startsWith('/payroll')) return 'hrms_payroll:payroll';
  if (pathname.startsWith('/solar')) {
    if (pathname.startsWith('/solar/generation') || pathname.startsWith('/solar/yield') || pathname.startsWith('/solar/alarms')) {
      return 'solar_monitoring:solar_generation';
    }
    if (pathname.startsWith('/solar/cleaning') || pathname.startsWith('/solar/maintenance') || pathname.startsWith('/solar/spares')) {
      return 'solar_monitoring:solar_maintenance';
    }
    return 'solar_monitoring:solar_master';
  }
  return 'dashboard';
}

function CompanyAdminPortalInner({ initialTab, initialSubTab, initialTeamSlug, children }) {
  const pathname = usePathname();
  const router = useRouter();

  const {
    activeCompany,
    allCompanies,
    authorizedCompanies,
    hasMultipleCompanies,
    currentUser,
    isLoading,
    error,
    selectCompany,
    updateCompanyAdminState,
    logout,
  } = useCompanyAuth();

  const [adminPreferences, setAdminPreferences] = useState(() => ({
    themeMode: 'system',
    accentColor: currentUser?.themeColor || currentUser?.theme_color || '#7f22fe',
    notifications: { success: true, info: true },
  }));
  const [preferencesLoadedKey, setPreferencesLoadedKey] = useState('');
  const [systemIsDark, setSystemIsDark] = useState(false);

  // Instant fallback to currentUser company data so dashboard and sidebar render immediately
  const effectiveCompany = activeCompany || (currentUser?.organizationName ? {
    id: String(currentUser.companyId || currentUser.id || 'default'),
    name: currentUser.organizationName || currentUser.name,
    organizationName: currentUser.organizationName || currentUser.name,
    email: currentUser.email,
    themeColor: currentUser.themeColor || currentUser.theme_color || '#7f22fe',
    theme_color: currentUser.theme_color || currentUser.themeColor || '#7f22fe',
    access: currentUser.access || { services: [] },
    status: 'ACTIVE',
  } : null);

  const {
    permittedServices,
    hasServiceAccess,
    hasModuleAccess,
    hasSubModuleAccess,
  } = useCompanyAccess(effectiveCompany);

  const [isMounted, setIsMounted] = useState(false);
  const [activeTab, setActiveTab] = useState(() => initialTab || resolveTabFromPathname(pathname));
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toasts, setToasts] = useState([]);
  const [isSuperAdminSwitched, setIsSuperAdminSwitched] = useState(false);
  const preferencesScope = currentUser?.role === 'EMPLOYEE'
    ? 'employee'
    : currentUser?.role === 'TEAM_LEADER'
      ? 'team_leader'
      : ['DEPARTMENT_HEAD', 'SERVICE_HEAD'].includes(currentUser?.role)
        ? 'department'
        : 'company';
  const preferencesKey = `azzunique_${preferencesScope}_preferences_${currentUser?.id || effectiveCompany?.id || 'default'}`;
  const resolvedTheme = adminPreferences.themeMode === 'system'
    ? (systemIsDark ? 'dark' : 'light')
    : adminPreferences.themeMode;

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setSystemIsDark(mediaQuery.matches);
    const handleChange = (event) => setSystemIsDark(event.matches);
    mediaQuery.addEventListener?.('change', handleChange);
    return () => mediaQuery.removeEventListener?.('change', handleChange);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    document.documentElement.setAttribute('data-theme', resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    try {
      const savedPreferences = localStorage.getItem(preferencesKey);
      const parsed = savedPreferences ? JSON.parse(savedPreferences) : {};
      setAdminPreferences({
        themeMode: ['light', 'dark', 'system'].includes(parsed.themeMode) ? parsed.themeMode : 'system',
        accentColor: /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(parsed.accentColor || '')
          ? parsed.accentColor
          : (effectiveCompany?.themeColor || effectiveCompany?.theme_color || '#7f22fe'),
        notifications: {
          success: parsed.notifications?.success !== false,
          info: parsed.notifications?.info !== false,
        },
      });
      setPreferencesLoadedKey(preferencesKey);
    } catch (preferenceError) {
      console.error('Failed to load company admin preferences:', preferenceError);
      setPreferencesLoadedKey(preferencesKey);
    }
  }, [preferencesKey, effectiveCompany?.themeColor, effectiveCompany?.theme_color]);

  useEffect(() => {
    if (!preferencesLoadedKey || preferencesLoadedKey !== preferencesKey) return;
    localStorage.setItem(preferencesKey, JSON.stringify(adminPreferences));
  }, [adminPreferences, preferencesKey, preferencesLoadedKey]);

  useEffect(() => {
    const syncDepartmentPreferences = (event) => {
      if (event.detail?.key !== preferencesKey || !event.detail?.preferences) return;
      setAdminPreferences(event.detail.preferences);
    };
    window.addEventListener('azzunique-preferences-changed', syncDepartmentPreferences);
    return () => window.removeEventListener('azzunique-preferences-changed', syncDepartmentPreferences);
  }, [preferencesKey]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isSwitched =
        localStorage.getItem('is_super_admin_impersonating') === 'true' ||
        Boolean(currentUser?.isImpersonated) ||
        Boolean(currentUser?.switchedBySuperAdmin);
      setIsSuperAdminSwitched(isSwitched);
    }
  }, [currentUser]);

  const handleReturnToSuperAdmin = () => {
    if (typeof window !== 'undefined') {
      restoreSuperAdminSession();
      window.location.replace('/super-admin');
    }
  };

  // Keep activeTab synchronized when pathname changes (browser back/forward, direct link)
  useEffect(() => {
    setIsMobileSidebarOpen(false);
    if (initialTab) {
      setActiveTab(initialTab);
    } else if (pathname) {
      setActiveTab(resolveTabFromPathname(pathname));
    }
  }, [pathname, initialTab]);

  const handleToggleSidebar = () => {
    if (typeof window !== 'undefined' && window.innerWidth <= 960) {
      setIsMobileSidebarOpen(prev => !prev);
      return;
    }
    setIsSidebarCollapsed(prev => !prev);
  };

  // Team Leaders manage only their own team workspace. Department Head
  // management belongs to the Company Admin / Department Head hierarchy.
  useEffect(() => {
    const requestedTab = initialTab || resolveTabFromPathname(pathname);
    const isDepartmentManagementRoute = requestedTab.startsWith('services:')
      && requestedTab.endsWith(':departments');

    if (!isLoading && currentUser?.role === 'TEAM_LEADER' && isDepartmentManagementRoute) {
      router.replace('/team-leader/workspace');
    }
  }, [currentUser?.role, initialTab, isLoading, pathname, router]);

  // Navigate reliably while keeping URL in lockstep
  const handleNavigate = (target) => {
    const canonical = resolveCanonicalUrl(target);
    if (canonical && canonical !== pathname) {
      router.push(canonical);
    } else {
      setActiveTab(resolveTabFromPathname(canonical || pathname));
    }
  };

  // Toast notification helper
  const showToast = (titleOrToast, message, type = 'success') => {
    let resolvedTitle = titleOrToast;
    let resolvedMessage = message;
    let resolvedType = type;

    if (typeof titleOrToast === 'object' && titleOrToast !== null) {
      resolvedTitle = titleOrToast.title || titleOrToast.name || 'Notification';
      resolvedMessage = titleOrToast.message || titleOrToast.description || '';
      resolvedType = titleOrToast.type || 'success';
    }

    if (resolvedType === 'success' && !adminPreferences.notifications.success) return;
    if (resolvedType === 'info' && !adminPreferences.notifications.info) return;

    const id = Date.now() + Math.random();
    setToasts(prev => [...prev, { id, title: resolvedTitle, message: resolvedMessage, type: resolvedType }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const handleLogout = () => {
    logout();
    showToast('Session Ended', 'Logged out of company workspace.', 'info');
  };

  const renderAdminRestricted = (featureName) => (
    <div role="alert" style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '14px', padding: '2.5rem 1.5rem', textAlign: 'center', color: '#9a3412' }}>
      <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem', fontWeight: 800 }}>Company Admin Access Required</h3>
      <p style={{ margin: 0, fontSize: '0.88rem' }}>{featureName} is available only to the Company Admin.</p>
    </div>
  );

  // Render content area based on activeTab & granted access
  const renderContent = () => {
    // 1. Loading State
    if (isLoading) {
      return (
        <div style={{ padding: '2rem 0' }}>
          <LoadingSkeleton rows={5} height="48px" />
        </div>
      );
    }

    // 2. API Error State (Distinguished from empty data)
    if (error) {
      return (
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center', border: '1px solid #fecaca', margin: '2rem auto', maxWidth: '600px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#991b1b', marginBottom: '0.5rem' }}>
            API Connection Error
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#b91c1c', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            {error}. Ensure the backend service is running and accessible.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            style={{
              padding: '0.65rem 1.35rem',
              borderRadius: '8px',
              background: '#7f22fe',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            Retry Connection
          </button>
        </div>
      );
    }

    // 3. No Company Context State
    if (!effectiveCompany) {
      if (isLoading) {
        return (
          <div style={{ padding: '2rem 0' }}>
            <LoadingSkeleton rows={5} height="48px" />
          </div>
        );
      }

      // 3A. Multiple authorized companies exist, none chosen yet
      if (hasMultipleCompanies && authorizedCompanies.length > 1) {
        return (
          <div style={{ background: '#ffffff', borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center', border: '1px solid #e2e8f0', margin: '2rem auto', maxWidth: '600px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏢</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Select Authorized Company Panel
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Your authenticated account is associated with multiple company panels. Choose which authorized workspace to enter:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxWidth: '380px', margin: '0 auto' }}>
              {authorizedCompanies.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => selectCompany(c.id)}
                  style={{
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    color: '#0f172a',
                    fontWeight: 700,
                    fontSize: '0.88rem',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#7f22fe';
                    e.currentTarget.style.background = '#f5f0ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.background = '#f8fafc';
                  }}
                >
                  <div>
                    <div>{c.organizationName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 500 }}>Admin: {c.name}</div>
                  </div>
                  <span style={{ color: '#7f22fe', fontWeight: 800 }}>→</span>
                </button>
              ))}
            </div>
          </div>
        );
      }

      // 3B. Truly No Company Mapped
      return (
        <div style={{ background: '#ffffff', borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center', border: '1px solid #e2e8f0', margin: '2rem auto', maxWidth: '600px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏢</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
            No Provisioned Company Panel Mapped
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1rem' }}>
            Your authenticated user account does not currently have any company tenant assigned or provisioned in MySQL.
          </p>
          <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5 }}>
            Please contact your Platform Super Admin to provision your company panel and configure your authorized services.
          </p>
        </div>
      );
    }

    // 1. Dashboard View
    if (activeTab === 'dashboard') {
      return (
        <CompanyDashboard
          activeCompany={effectiveCompany}
          permittedServices={permittedServices}
          onNavigate={handleNavigate}
        />
      );
    }

    // Reports & Analytics View
    if (activeTab === 'reports') {
      return (
        <ReportsModule
          key="module-reports"
          activeCompany={effectiveCompany}
          currentUser={currentUser}
          showToast={showToast}
          onNavigate={handleNavigate}
        />
      );
    }

    // 2. Settings View
    if (activeTab === 'settings') {
      if (currentUser?.role !== 'COMPANY_ADMIN' && !isSuperAdminSwitched) {
        return renderAdminRestricted('Company profile and settings');
      }
      return (
        <SettingsModule
          activeCompany={effectiveCompany}
          currentUser={currentUser}
          permittedServices={permittedServices}
          themeMode={adminPreferences.themeMode}
          resolvedTheme={resolvedTheme}
          accentColor={adminPreferences.accentColor}
          notificationPreferences={adminPreferences.notifications}
          onThemeChange={(themeMode) => setAdminPreferences((previous) => ({ ...previous, themeMode }))}
          onAccentChange={(accentColor) => setAdminPreferences((previous) => ({ ...previous, accentColor }))}
          onNotificationsChange={(notifications) => setAdminPreferences((previous) => ({ ...previous, notifications }))}
          onProfileUpdated={(profile) => updateCompanyAdminState?.({ profile })}
          onCompanyUpdated={(company) => updateCompanyAdminState?.({ company })}
          showToast={showToast}
        />
      );
    }

    // 3. Service Head View (initiated from authorized service context)
    if (activeTab.startsWith('services:') && activeTab.endsWith(':departments')) {
      const canManageServiceTeam = currentUser?.role === 'COMPANY_ADMIN' ||
        (currentUser?.role === 'SERVICE_HEAD' && (
          currentUser.permissions?.manageMembers ||
          currentUser.permissions?.assignWork ||
          currentUser.permissions?.updateWork
        ));
      if (!canManageServiceTeam && !isSuperAdminSwitched) {
        return renderAdminRestricted('Service team management');
      }
      const targetServiceCode = activeTab.split(':')[1];
      const isServicePermitted = hasServiceAccess(targetServiceCode);
      if (!isServicePermitted) {
        return (
          <div style={{ background: '#ffffff', borderRadius: '14px', padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid #fed7aa', margin: '1rem 0' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.85rem' }}>🔒</div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#9a3412', marginBottom: '0.5rem' }}>
              Service Access Restricted
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#7c2d12', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
              Service team access is restricted. This service is not assigned to <strong>{activeCompany.organizationName}</strong> by Super Admin.
            </p>
            <button
              type="button"
              onClick={() => handleNavigate('dashboard')}
              style={{
                marginTop: '1.5rem',
                padding: '0.65rem 1.35rem',
                borderRadius: '8px',
                background: '#7f22fe',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.85rem',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Return to Dashboard
            </button>
          </div>
        );
      }
      return (
        <ServiceDepartments
          activeCompany={activeCompany}
          serviceCode={targetServiceCode}
          currentUser={currentUser}
          showToast={showToast}
          onNavigate={handleNavigate}
          initialTeamSlug={initialTeamSlug}
        />
      );
    }

    // 4. Service & Module Views with Permission Enforcement
    const baseServiceCode = activeTab.split(':')[0];
    const subModuleCode = activeTab.split(':')[1];

    // Check if the service is permitted for this company
    const isServicePermitted = hasServiceAccess(baseServiceCode);
    if (!isServicePermitted) {
      return (
        <div style={{ background: '#ffffff', borderRadius: '14px', padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid #fed7aa', margin: '1rem 0' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.85rem' }}>🔒</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#9a3412', marginBottom: '0.5rem' }}>
            Service Access Restricted
          </h3>
          <p style={{ fontSize: '0.88rem', color: '#7c2d12', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
            Access to this service is not permitted for <strong>{activeCompany.organizationName}</strong> under the current subscription plan. Contact Platform Super Admin to request permission activation.
          </p>
          <button
            type="button"
            onClick={() => handleNavigate('dashboard')}
            style={{
              marginTop: '1.5rem',
              padding: '0.65rem 1.35rem',
              borderRadius: '8px',
              background: '#7f22fe',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            Return to Dashboard
          </button>
        </div>
      );
    }

    const renderModuleRestricted = (moduleName) => (
      <div style={{ background: '#ffffff', borderRadius: '14px', padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid #fed7aa', margin: '1rem 0' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.85rem' }}>🔒</div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#9a3412', marginBottom: '0.5rem' }}>
          Module Unavailable
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#7c2d12', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
          The module <strong>{moduleName}</strong> is currently deactivated by Super Admin or not permitted for <strong>{activeCompany.organizationName}</strong>.
        </p>
        <button
          type="button"
          onClick={() => handleNavigate('dashboard')}
          style={{
            marginTop: '1.5rem',
            padding: '0.65rem 1.35rem',
            borderRadius: '8px',
            background: '#7f22fe',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.85rem',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Return to Dashboard
        </button>
      </div>
    );

    const renderFeatureRestricted = (featureName) => (
      <div style={{ background: '#ffffff', borderRadius: '14px', padding: '3.5rem 2rem', textAlign: 'center', border: '1px solid #fed7aa', margin: '1rem 0' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.85rem' }}>🔒</div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#9a3412', marginBottom: '0.5rem' }}>
          Feature Screen Unavailable
        </h3>
        <p style={{ fontSize: '0.88rem', color: '#7c2d12', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
          The feature screen <strong>{featureName}</strong> is currently deactivated by Super Admin or not permitted for <strong>{activeCompany.organizationName}</strong>.
        </p>
        <button
          type="button"
          onClick={() => handleNavigate('dashboard')}
          style={{
            marginTop: '1.5rem',
            padding: '0.65rem 1.35rem',
            borderRadius: '8px',
            background: '#7f22fe',
            color: '#ffffff',
            fontWeight: 700,
            fontSize: '0.85rem',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Return to Dashboard
        </button>
      </div>
    );

    // Route to permitted module component
    switch (baseServiceCode) {
      case 'crm_sales':
        if (subModuleCode === 'product') {
          if (!hasModuleAccess('product')) return renderModuleRestricted('Products & Catalogue');
          return <ProductsModule key="module-product" activeCompany={activeCompany} showToast={showToast} initialSubTab={initialSubTab} />;
        }
        if (subModuleCode === 'sales') {
          if (!hasModuleAccess('sales')) return renderModuleRestricted('Sales Operations');
          return <SalesModule key="module-sales" activeCompany={activeCompany} showToast={showToast} initialSubTab={initialSubTab} />;
        }
        if (!hasModuleAccess('crm')) return renderModuleRestricted('CRM Management');

        // Employees may open only the exact CRM screen delegated by their Team Leader.
        // Higher roles continue through the existing authorization flow unchanged.
        if (currentUser?.role === 'EMPLOYEE') {
          const requestedCrmFeature = initialSubTab || (
            pathname === '/crm/customers' ? 'customers' :
              pathname === '/crm/contacts' ? 'contacts' :
                pathname === '/crm/opportunities' ? 'opportunities' :
                  pathname === '/crm/leads' ? 'leads' : null
          );
          const employeeCrmAliases = {
            leads: ['leads', '/crm/leads', 'crm_leads'],
            customers: ['customers', '/crm/customers', 'crm_customers'],
            contacts: ['contacts', '/crm/contacts', 'crm_contacts'],
            opportunities: ['opportunities', '/crm/opportunities', 'crm_followups'],
          };
          const requestedAliases = employeeCrmAliases[requestedCrmFeature] || [];
          if (requestedAliases.length && !requestedAliases.some((alias) => hasSubModuleAccess(alias))) {
            const featureLabels = {
              leads: 'Leads Pipeline',
              customers: 'Customers',
              contacts: 'Contact Persons',
              opportunities: 'Opportunities',
            };
            return renderFeatureRestricted(featureLabels[requestedCrmFeature] || 'CRM feature');
          }
        }

        // Check if the specific requested screen/submodule is permitted
        if (
          (pathname === '/crm/leads' || initialSubTab === 'leads') &&
          !hasSubModuleAccess('leads') &&
          !hasSubModuleAccess('/crm/leads')
        ) {
          return renderFeatureRestricted('Leads Pipeline');
        }

        return <CrmModule key="module-crm" activeCompany={activeCompany} showToast={showToast} initialSubTab={initialSubTab} hasSubModuleAccess={hasSubModuleAccess} hasModuleAccess={hasModuleAccess} />;

      case 'permission_controls':
        if (currentUser?.role !== 'COMPANY_ADMIN' && !isSuperAdminSwitched) {
          return renderAdminRestricted('Team and permission administration');
        }
        if (!hasModuleAccess('team') && !hasModuleAccess('permission_controls')) return renderModuleRestricted('Team & Permissions');
        return <TeamModule key="module-team" activeCompany={activeCompany} currentUser={currentUser} showToast={showToast} initialSubTab={initialSubTab} />;

      default:
        return (
          <CompanyDashboard
            activeCompany={effectiveCompany}
            permittedServices={permittedServices}
            onNavigate={handleNavigate}
          />
        );
    }
  };

  if (!currentUser) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', color: '#64748b' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.95rem' }}>
          <div style={{ width: '22px', height: '22px', border: '2.5px solid #7f22fe', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          <span>Verifying workspace session...</span>
        </div>
      </div>
    );
  }

  const companyAccent =
    effectiveCompany?.theme_color ||
    effectiveCompany?.themeColor ||
    currentUser?.theme_color ||
    currentUser?.themeColor ||
    '#7f22fe';
  const workspaceAccent = adminPreferences.accentColor || companyAccent;
  const workspaceCompany = {
    ...effectiveCompany,
    themeColor: workspaceAccent,
    theme_color: workspaceAccent,
  };

  return (
    <div
      className={styles.portalShell}
      data-theme={resolvedTheme}
      style={{
        '--primary': workspaceAccent,
        '--primary-hover': workspaceAccent,
        '--primary-glow': `${workspaceAccent}33`,
        '--primary-light': `${workspaceAccent}14`,
        '--sidebar-active-bg': workspaceAccent,
        '--sidebar-active-border': workspaceAccent,
        '--sidebar-active-parent': `${workspaceAccent}20`,
      }}
    >
      {/* Super Admin Switch Mode Notice Bar */}
      {isSuperAdminSwitched && (
        <div
          className={styles.superAdminBanner}
          style={{
            borderBottom: `2px solid ${companyAccent}`,
          }}
        >
          <div className={styles.superAdminBannerLeft}>
            <span style={{ fontSize: '1.05rem', flexShrink: 0 }}>🛡️</span>
            <span className={styles.superAdminBannerText}>
              <strong>Super Admin Mode:</strong> Managing live workspace for{' '}
              <strong style={{ color: companyAccent }}>
                {activeCompany?.organizationName || currentUser?.organizationName || 'Client'}
              </strong>
            </span>
            <span
              className={styles.superAdminBannerBadge}
              style={{
                background: `${companyAccent}29`,
                color: companyAccent,
                border: `1px solid ${companyAccent}`,
              }}
            >
              Real Live Panel
            </span>
          </div>

          <button
            type="button"
            onClick={handleReturnToSuperAdmin}
            className={styles.superAdminReturnBtn}
            style={{
              background: companyAccent,
              boxShadow: `0 2px 8px ${companyAccent}55`,
            }}
          >
            ← Return to Super Admin
          </button>
        </div>
      )}

      <div
        className={`${styles.appContainer} ${isSuperAdminSwitched ? styles.appContainerWithBanner : ''}`}
        data-theme={resolvedTheme}
      >
        {/* Toast Notification Container */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />

        {/* Mobile Drawer Backdrop */}
        {isMobileSidebarOpen && (
          <button
            type="button"
            aria-label="Close navigation menu"
            className={styles.mobileSidebarBackdrop}
            onClick={() => setIsMobileSidebarOpen(false)}
          />
        )}

        {/* Collapsible Left Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          activeCompany={workspaceCompany}
          currentUser={currentUser}
          permittedServices={permittedServices}
          hasSubModuleAccess={hasSubModuleAccess}
          hasModuleAccess={hasModuleAccess}
          isCompanyAdmin={currentUser?.role === 'COMPANY_ADMIN' || isSuperAdminSwitched}
          canManageServiceTeams={
            currentUser?.role === 'COMPANY_ADMIN' ||
            isSuperAdminSwitched
          }
          isCollapsed={isSidebarCollapsed}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          onToggleCollapse={handleToggleSidebar}
        />

        {/* Main Workspace Area */}
        <div className={styles.mainContent}>
          {/* Top Header Navbar */}
          <Topbar
            activeTab={activeTab}
            activeCompany={workspaceCompany}
            allCompanies={allCompanies}
            hasMultipleCompanies={hasMultipleCompanies}
            currentUser={currentUser}
            onSelectCompany={selectCompany}
            accentColor={workspaceAccent}
            onSelectTab={handleNavigate}
            onToggleSidebar={handleToggleSidebar}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onLogout={handleLogout}
          />

          {/* Content Body */}
          <main className={styles.contentArea}>
            {effectiveCompany && (
              <div style={{ marginBottom: '1.35rem' }}>
                <CompanyAdminBreadcrumbs activeCompany={effectiveCompany} />
              </div>
            )}
            {children || renderContent()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default function CompanyAdminPortal(props) {
  const existingContext = useCompanyAuthContext();
  if (existingContext) {
    return <CompanyAdminPortalInner {...props} />;
  }
  return (
    <CompanyAuthProvider>
      <CompanyAdminPortalInner {...props} />
    </CompanyAuthProvider>
  );
}
