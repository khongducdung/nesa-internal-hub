
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GPSLocationManager } from './GPSLocationManager';
import { ShiftAssignmentManager } from './ShiftAssignmentManager';
import { AttendanceConfigurationManager } from './AttendanceConfigurationManager';

export function AttendanceSettingsManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Cài đặt máy chấm công</h2>
        <p className="text-gray-600 mt-1">Thiết lập cấu hình hệ thống chấm công và phân công ca</p>
      </div>

      <Tabs defaultValue="gps" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="gps">Địa điểm GPS</TabsTrigger>
          <TabsTrigger value="assignments">Phân công ca</TabsTrigger>
          <TabsTrigger value="config">Cấu hình chung</TabsTrigger>
        </TabsList>

        <TabsContent value="gps" className="mt-6">
          <GPSLocationManager />
        </TabsContent>

        <TabsContent value="assignments" className="mt-6">
          <ShiftAssignmentManager />
        </TabsContent>

        <TabsContent value="config" className="mt-6">
          <AttendanceConfigurationManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}
