import CompanyAdminPortal from '@/components/company-admin/CompanyAdminPortal';

export const metadata = {
  title: 'Reports & Analytics — AZZUNIQUE CRM & Sales',
  description: 'Enterprise operational reporting, sales trends, and CRM business intelligence',
};

export default function ReportsPage() {
  return <CompanyAdminPortal initialTab="reports" />;
}
