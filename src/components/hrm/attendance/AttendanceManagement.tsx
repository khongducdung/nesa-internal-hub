
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Calendar, BarChart3, Settings, Users } from 'lucide-react';
import { AttendanceStats } from './AttendanceStats';
import { AttendanceCalendar } from './AttendanceCalendar';
import { AttendanceList } from './AttendanceList';
import { AttendanceReports } from './AttendanceReports';
import { AttendanceSettingsList } from './AttendanceSettingsList';

export function AttendanceManagement() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Clock className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Quản lý chấm công</h2>
      </div>

      {/* Thống kê tổng quan */}
      <AttendanceStats />

      {/* Các tab chức năng */}
      <Tabs defaultValue="calendar" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="calendar" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Lịch chấm công
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Danh sách
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Báo cáo
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Cài đặt
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="mt-6">
          <AttendanceCalendar />
        </TabsContent>

        <TabsContent value="list" className="mt-6">
          <AttendanceList />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <AttendanceReports />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <AttendanceSettingsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
