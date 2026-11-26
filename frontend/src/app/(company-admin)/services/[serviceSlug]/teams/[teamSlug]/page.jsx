import { Suspense } from 'react';
import CompanyAdminPortal from '@/components/company-admin/CompanyAdminPortal';

export function generateStaticParams() {
  return [
    { serviceSlug: 'crm-sales', teamSlug: 'leads-team' },
    { serviceSlug: 'crm-sales', teamSlug: 'opportunities-team' },
    { serviceSlug: 'crm_sales', teamSlug: 'leads-team' },
    { serviceSlug: 'crm_sales', teamSlug: 'opportunities-team' },
  ];
}

export async function generateMetadata({ params }) {
  const { serviceSlug = 'service', teamSlug = 'team' } = await params;
  const formattedService = serviceSlug.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  const formattedTeam = teamSlug.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${formattedTeam} — ${formattedService} — AZZUNIQUE Company Admin`,
    description: `Inspect team members, assignments, and tasks for ${formattedTeam}`,
  };
}

async function TeamPageContent({ params }) {
  const { serviceSlug = 'crm_sales', teamSlug = '' } = await params;
  const slug = serviceSlug.replace(/-/g, '_');
  return <CompanyAdminPortal initialTab={`services:${slug}:departments`} initialTeamSlug={teamSlug} />;
}

export default function TeamPage({ params }) {
  return (
    <Suspense fallback={<div style={{ padding: '2rem' }}>Loading Team...</div>}>
      <TeamPageContent params={params} />
    </Suspense>
  );
}
