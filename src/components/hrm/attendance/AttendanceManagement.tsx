
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Clock, MapPin, Users } from 'lucide-react';
import { AttendanceSettingsList } from './AttendanceSettingsList';
import { WorkShiftsList } from './WorkShiftsList';
import { AttendanceLocationsList } from './AttendanceLocationsList';
import { AttendanceAssignmentsList } from './AttendanceAssignmentsList';

export function AttendanceManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Settings className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Quản lý chấm công</h2>
      </div>

      <Tabs defaultValue="settings" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Cài đặt
          </TabsTrigger>
          <TabsTrigger value="shifts" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Ca làm việc
          </TabsTrigger>
          <TabsTrigger value="locations" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Địa điểm
          </TabsTrigger>
          <TabsTrigger value="assignments" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Phân công
          </TabsTrigger>
        </TabsList>

        <TabsContent value="settings" className="mt-6">
          <AttendanceSettingsList />
        </TabsContent>

        <TabsContent value="shifts" className="mt-6">
          <WorkShiftsList />
        </TabsContent>

        <TabsContent value="locations" className="mt-6">
          <AttendanceLocationsList />
        </TabsContent>

        <TabsContent value="assignments" className="mt-6">
          <AttendanceAssignmentsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
