
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Users, Calendar, FileText, Settings, Building2 } from 'lucide-react';
import { CheckInOutInterface } from './CheckInOutInterface';
import { ShiftManagement } from './ShiftManagement';
import { AttendanceList } from './AttendanceList';
import { AttendanceReports } from './AttendanceReports';

export function AttendanceManagement() {
  // Tạm thời hardcode employee ID - trong thực tế sẽ lấy từ auth
  const currentEmployeeId = '00000000-0000-0000-0000-000000000000';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section với gradient */}
      <div className="hero-gradient p-6">
        <div className="hero-content p-6">
          <div className="hero-overlay absolute inset-0 rounded-lg"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Clock className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white">Quản lý chấm công</h1>
                <p className="text-white/90 text-lg">Hệ thống chấm công và quản lý ca làm việc toàn diện</p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Hôm nay</p>
                    <p className="text-white text-xl font-semibold">Đã check-in</p>
                  </div>
                  <Clock className="h-8 w-8 text-white/60" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Tuần này</p>
                    <p className="text-white text-xl font-semibold">32.5 giờ</p>
                  </div>
                  <Calendar className="h-8 w-8 text-white/60" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Nhân viên online</p>
                    <p className="text-white text-xl font-semibold">24/35</p>
                  </div>
                  <Users className="h-8 w-8 text-white/60" />
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm">Tỷ lệ đúng giờ</p>
                    <p className="text-white text-xl font-semibold">96.8%</p>
                  </div>
                  <FileText className="h-8 w-8 text-white/60" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="checkin" className="w-full">
          {/* Navigation Tabs - Menu chính với variant primary */}
          <div className="mb-8">
            <TabsList variant="primary" className="grid grid-cols-4 w-full">
              <TabsTrigger variant="primary" value="checkin">
                <Clock className="h-4 w-4 mr-2" />
                Chấm công
              </TabsTrigger>
              
              <TabsTrigger variant="primary" value="shifts">
                <Calendar className="h-4 w-4 mr-2" />
                Quản lý ca
              </TabsTrigger>
              
              <TabsTrigger variant="primary" value="list">
                <Users className="h-4 w-4 mr-2" />
                Danh sách
              </TabsTrigger>
              
              <TabsTrigger variant="primary" value="reports">
                <FileText className="h-4 w-4 mr-2" />
                Báo cáo
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Contents */}
          <div className="space-y-6">
            <TabsContent value="checkin" className="m-0">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <CheckInOutInterface employeeId={currentEmployeeId} />
              </div>
            </TabsContent>

            <TabsContent value="shifts" className="m-0">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <ShiftManagement />
              </div>
            </TabsContent>

            <TabsContent value="list" className="m-0">
              <AttendanceList />
            </TabsContent>

            <TabsContent value="reports" className="m-0">
              <AttendanceReports />
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
