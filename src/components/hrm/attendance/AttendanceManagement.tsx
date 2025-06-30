
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Users, Calendar, FileText } from 'lucide-react';
import { CheckInOutInterface } from './CheckInOutInterface';
import { ShiftManagement } from './ShiftManagement';
import { AttendanceList } from './AttendanceList';
import { AttendanceReports } from './AttendanceReports';

export function AttendanceManagement() {
  // Tạm thời hardcode employee ID - trong thực tế sẽ lấy từ auth
  const currentEmployeeId = '00000000-0000-0000-0000-000000000000';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Clock className="h-8 w-8 text-blue-600" />
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Quản lý chấm công</h2>
          <p className="text-gray-600">Hệ thống chấm công và quản lý ca làm việc toàn diện</p>
        </div>
      </div>

      <Tabs defaultValue="checkin" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-gray-100/50 p-1 rounded-lg">
          <TabsTrigger value="checkin" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Clock className="h-4 w-4" />
            Chấm công
          </TabsTrigger>
          <TabsTrigger value="shifts" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Calendar className="h-4 w-4" />
            Quản lý ca
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <Users className="h-4 w-4" />
            Danh sách
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">
            <FileText className="h-4 w-4" />
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
