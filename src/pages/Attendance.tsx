
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { AttendanceManagement } from '@/components/hrm/attendance/AttendanceManagement';

export default function Attendance() {
  return (
    <DashboardLayout>
      <AttendanceManagement />
    </DashboardLayout>
  );
}
