
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Users, MapPin } from 'lucide-react';
import { AttendanceSettingsList } from './AttendanceSettingsList';
import { WorkShiftsList } from './WorkShiftsList';

export function AttendanceSettingsManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-blue-600" />
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Cài đặt chấm công</h2>
          <p className="text-gray-600">Quản lý cấu hình chấm công và ca làm việc</p>
        </div>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-gray-100/50 p-1 rounded-lg">
          <TabsTrigger 
            value="settings" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Settings className="h-4 w-4" />
            Cài đặt chấm công
          </TabsTrigger>
          <TabsTrigger 
            value="shifts" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
          >
            <Users className="h-4 w-4" />
            Ca làm việc
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="mt-6">
          <AttendanceSettingsList />
        </TabsContent>

        <TabsContent value="shifts" className="mt-6">
          <WorkShiftsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
