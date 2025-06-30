
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Users, Calendar, FileText, Settings } from 'lucide-react';
import { CheckInOutInterface } from './CheckInOutInterface';
import { ShiftManagement } from './ShiftManagement';
import { AttendanceList } from './AttendanceList';
import { AttendanceReports } from './AttendanceReports';

export function AttendanceManagement() {
  // Tạm thời hardcode employee ID - trong thực tế sẽ lấy từ auth
  const currentEmployeeId = '00000000-0000-0000-0000-000000000000';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Quản lý chấm công</h1>
            <p className="text-sm text-gray-500">Hệ thống chấm công và quản lý ca làm việc toàn diện</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <Tabs defaultValue="checkin" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 p-1 rounded-lg mb-6">
            <TabsTrigger 
              value="checkin" 
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
            >
              <Clock className="h-4 w-4" />
              Chấm công
            </TabsTrigger>
            <TabsTrigger 
              value="shifts" 
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
            >
              <Calendar className="h-4 w-4" />
              Quản lý ca
            </TabsTrigger>
            <TabsTrigger 
              value="list" 
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
            >
              <Users className="h-4 w-4" />
              Danh sách
            </TabsTrigger>
            <TabsTrigger 
              value="reports" 
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-blue-200"
            >
              <FileText className="h-4 w-4" />
              Báo cáo
            </TabsTrigger>
          </TabsList>

          <TabsContent value="checkin" className="mt-0">
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

          <TabsContent value="shifts" className="mt-0">
            <ShiftManagement />
          </TabsContent>

          <TabsContent value="list" className="mt-0">
            <AttendanceList />
          </TabsContent>

          <TabsContent value="reports" className="mt-0">
            <AttendanceReports />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
