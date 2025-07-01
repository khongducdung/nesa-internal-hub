
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AttendanceManagement } from '@/components/attendance/AttendanceManagement';

export default function Attendance() {
  return (
    <DashboardLayout>
      <AttendanceManagement />
    </DashboardLayout>
  );
}
