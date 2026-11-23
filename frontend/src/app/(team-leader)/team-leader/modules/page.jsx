import DepartmentHeadDashboardFeature from '@/features/department-head/dashboard';

export const metadata = {
  title: 'Assigned Team Modules — AZZUNIQUE CRM & Sales',
  description: 'Modules and screens assigned to the Team Leader',
};

export default function TeamLeaderModulesPage() {
  return <DepartmentHeadDashboardFeature view="modules" portalRole="team-leader" />;
}
