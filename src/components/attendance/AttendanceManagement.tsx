
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkScheduleManagement } from './WorkScheduleManagement';
import { LeaveTypeManagement } from './LeaveTypeManagement';
import { AttendanceSettingsManagement } from './AttendanceSettingsManagement';
import { AttendanceReports } from './AttendanceReports';
import { CheckInOutInterface } from './CheckInOutInterface';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/components/ui/settings-context';

export function AttendanceManagement() {
  const { profile } = useAuth();
  const { hideDescriptions } = useSettings();
  
  // Kiểm tra quyền admin/hr (tạm thời set true cho demo)
  const isAdmin = true; // Sau này sẽ check từ profile.system_role

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chấm công</h1>
          {!hideDescriptions && (
            <p className="text-gray-600 mt-1">Check-in/out và theo dõi thời gian làm việc</p>
          )}
        </div>
        <CheckInOutInterface />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý chấm công</h1>
        {!hideDescriptions && (
          <p className="text-gray-600 mt-1">Thiết lập và quản lý hệ thống chấm công</p>
        )}
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
