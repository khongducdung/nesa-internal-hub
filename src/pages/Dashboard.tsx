
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EmployeeTrainingDashboard } from '@/components/dashboard/EmployeeTrainingDashboard';
import { EmployeeJobDescription } from '@/components/dashboard/EmployeeJobDescription';

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <EmployeeTrainingDashboard />
        <EmployeeJobDescription />
      </div>
    </DashboardLayout>
  );
}
