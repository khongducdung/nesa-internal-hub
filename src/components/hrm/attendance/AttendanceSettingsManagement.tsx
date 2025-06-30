
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, Calendar } from 'lucide-react';
import { AttendanceSettingsList } from './AttendanceSettingsList';
import { WorkShiftsList } from './WorkShiftsList';
import { ShiftAssignmentsList } from './ShiftAssignmentsList';

export function AttendanceSettingsManagement() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Settings className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Cài đặt chấm công</h1>
            <p className="text-sm text-gray-500">Quản lý cấu hình chấm công và ca làm việc</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <Tabs defaultValue="settings" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white border border-gray-200 p-1 rounded-lg mb-6">
            <TabsTrigger 
              value="settings" 
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <Settings className="h-4 w-4" />
              Cài đặt chấm công
            </TabsTrigger>
            <TabsTrigger 
              value="shifts" 
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <Calendar className="h-4 w-4" />
              Ca làm việc
            </TabsTrigger>
            <TabsTrigger 
              value="assignments" 
              className="flex items-center gap-2 text-sm font-medium data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700"
            >
              <Users className="h-4 w-4" />
              Phân công
            </TabsTrigger>
          </TabsList>

          <TabsContent value="settings" className="mt-0">
            <AttendanceSettingsList />
          </TabsContent>

          <TabsContent value="shifts" className="mt-0">
            <WorkShiftsList />
          </TabsContent>

          <TabsContent value="assignments" className="mt-0">
            <ShiftAssignmentsList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
