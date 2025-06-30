
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Users, Calendar, Settings } from 'lucide-react';
import { CheckInOutInterface } from './CheckInOutInterface';
import { ShiftManagement } from './ShiftManagement';
import { AttendanceList } from './AttendanceList';
import { AttendanceReports } from './AttendanceReports';

export function AttendanceManagement() {
  // Tạm thời hardcode employee ID - trong thực tế sẽ lấy từ auth
  const currentEmployeeId = '00000000-0000-0000-0000-000000000000';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Clock className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Quản lý chấm công</h2>
      </div>

      <Tabs defaultValue="checkin" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="checkin" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Chấm công
          </TabsTrigger>
          <TabsTrigger value="shifts" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Quản lý ca
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Danh sách
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Báo cáo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checkin" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CheckInOutInterface 
              employeeId={currentEmployeeId} 
              checkType="daily" 
            />
            <CheckInOutInterface 
              employeeId={currentEmployeeId} 
              checkType="shift" 
            />
          </div>
        </TabsContent>

        <TabsContent value="shifts" className="mt-6">
          <ShiftManagement />
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <AttendanceList />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <AttendanceReports />
        </TabsContent>
      </Tabs>
    </div>
  );
}
