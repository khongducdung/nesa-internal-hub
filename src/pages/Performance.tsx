
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KPIManagement } from '@/components/kpi/KPIManagement';

export default function Performance() {
  return (
    <DashboardLayout>
      <KPIManagement />
    </DashboardLayout>
  );
}
