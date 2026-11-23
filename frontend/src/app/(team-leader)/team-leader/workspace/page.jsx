import DepartmentHeadDashboardFeature from '@/features/department-head/dashboard';

export const metadata = {
  title: 'Team Workspace — AZZUNIQUE CRM & Sales',
  description: 'Team member and assigned work management',
};

export default function TeamLeaderWorkspacePage() {
  return <DepartmentHeadDashboardFeature view="workspace" portalRole="team-leader" />;
}
