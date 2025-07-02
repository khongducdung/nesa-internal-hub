import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPIManagement } from '@/components/kpi/KPIManagement';

export default function KPI() {
  return (
    <DashboardLayout>
      <KPIManagement />
    </DashboardLayout>
  );
}