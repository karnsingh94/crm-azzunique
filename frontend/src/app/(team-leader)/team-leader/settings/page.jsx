import DepartmentHeadDashboardFeature from '@/features/department-head/dashboard';

export const metadata = {
  title: 'Team Leader Settings — AZZUNIQUE CRM & Sales',
  description: 'Team Leader workspace preferences and account security',
};

export default function TeamLeaderSettingsPage() {
  return <DepartmentHeadDashboardFeature view="settings" portalRole="team-leader" />;
}
