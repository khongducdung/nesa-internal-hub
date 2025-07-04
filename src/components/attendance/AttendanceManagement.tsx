
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkScheduleManagement } from './WorkScheduleManagement';
import { LeaveTypeManagement } from './LeaveTypeManagement';
import { AttendanceSettingsManagement } from './AttendanceSettingsManagement';
import { AttendanceReports } from './AttendanceReports';
import { CheckInOutInterface } from './CheckInOutInterface';
import { useAuth } from '@/hooks/useAuth';
import { useEmployees } from '@/hooks/useEmployees';

export function AttendanceManagement() {
  const { user, hasRole } = useAuth();
  const { data: employees } = useEmployees();
  
  // Check if user is admin or HR manager
  const isAdmin = hasRole('admin') || hasRole('super_admin');
  
  // Find current employee info
  const currentEmployee = employees?.find(emp => emp.auth_user_id === user?.id);
  const isHRManager = currentEmployee?.departments?.name?.toLowerCase().includes('nhân sự') || 
                     currentEmployee?.departments?.name?.toLowerCase().includes('hr') ||
                     currentEmployee?.positions?.name?.toLowerCase().includes('nhân sự') ||
                     currentEmployee?.positions?.name?.toLowerCase().includes('hr');

  // Check if user has management access (admin or HR manager)
  const hasManagementAccess = isAdmin || isHRManager;

  if (!hasManagementAccess) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chấm công</h1>
          <p className="text-gray-600 mt-1">Check-in/out và theo dõi thời gian làm việc của bạn</p>
        </div>
        <CheckInOutInterface />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý chấm công</h1>
        <p className="text-gray-600 mt-1">Thiết lập và quản lý hệ thống chấm công</p>
      </div>

      <Tabs defaultValue="schedules" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="schedules">Lịch làm việc</TabsTrigger>
          <TabsTrigger value="leave-types">Lịch nghỉ</TabsTrigger>
          <TabsTrigger value="settings">Cài đặt máy chấm công</TabsTrigger>
          <TabsTrigger value="reports">Báo cáo</TabsTrigger>
          <TabsTrigger value="checkin">Check-in/out</TabsTrigger>
        </TabsList>

        <TabsContent value="schedules" className="mt-6">
          <WorkScheduleManagement />
        </TabsContent>

        <TabsContent value="leave-types" className="mt-6">
          <LeaveTypeManagement />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <AttendanceSettingsManagement />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <AttendanceReports />
        </TabsContent>

        <TabsContent value="checkin" className="mt-6">
          <CheckInOutInterface />
        </TabsContent>
      </Tabs>
    </div>
  );
}
