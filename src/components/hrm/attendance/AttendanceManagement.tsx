import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Clock, Users, Calendar, FileText, Settings, Building2 } from 'lucide-react';
import { CheckInOutInterface } from './CheckInOutInterface';
import { ShiftManagement } from './ShiftManagement';
import { AttendanceReports } from './AttendanceReports';

export function AttendanceManagement() {
  // Tạm thời hardcode employee ID - trong thực tế sẽ lấy từ auth
  const currentEmployeeId = '00000000-0000-0000-0000-000000000000';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-purple-50">
      {/* Header Section - Only background styling updated */}
      <div className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 p-8 rounded-2xl mx-6 mt-6 shadow-lg">
        <div className="relative">
          {/* Keep existing greeting and content */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-blue-200" />
              <span className="text-blue-100 text-sm font-medium">Chào buổi chiều</span>
            </div>
            
            <h1 className="text-3xl font-bold text-white mb-2">
              Chào mừng trở lại, Admin!
            </h1>
            
            <div className="flex items-center gap-2 text-blue-100">
              <span className="text-lg">🚀</span>
              <p className="text-lg">Cùng nhau xây dựng một tương lai tốt đẹp!</p>
            </div>
            
            <div className="flex items-center gap-2 mt-4 text-blue-200">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Thứ Ba, 1 tháng 7, 2025</span>
            </div>
          </div>

          {/* Keep existing action buttons */}
          <div className="flex items-center gap-3 mb-8">
            <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/30 transition-all duration-200">
              <span>✓</span>
              <span className="font-medium">Tạo Task</span>
            </button>
            <button className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/30 transition-all duration-200">
              <Calendar className="h-4 w-4" />
              <span className="font-medium">Lên lịch Meeting</span>
            </button>
            <button className="bg-white text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg font-medium transition-all duration-200">
              Xem báo cáo →
            </button>
          </div>

          {/* Keep existing quick stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Hôm nay</p>
                  <p className="text-white text-xl font-bold">Đã check-in</p>
                </div>
                <Clock className="h-8 w-8 text-white/60" />
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Tuần này</p>
                  <p className="text-white text-xl font-bold">32.5 giờ</p>
                </div>
                <Calendar className="h-8 w-8 text-white/60" />
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Nhân viên online</p>
                  <p className="text-white text-xl font-bold">24/35</p>
                </div>
                <Users className="h-8 w-8 text-white/60" />
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-sm rounded-xl p-4 border border-white/20 hover:bg-white/20 transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm font-medium">Tỷ lệ đúng giờ</p>
                  <p className="text-white text-xl font-bold">96.8%</p>
                </div>
                <FileText className="h-8 w-8 text-white/60" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with white background */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <Tabs defaultValue="checkin" className="w-full">
            {/* Keep existing 3 tab navigation */}
            <div className="mb-8">
              <TabsList className="grid grid-cols-3 w-full h-14 bg-gray-50 border border-gray-200 p-1 rounded-xl shadow-sm">
                <TabsTrigger 
                  value="checkin" 
                  className="h-12 rounded-lg text-sm font-medium data-[state=active]:bg-[#2563EB] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Chấm công
                </TabsTrigger>
                
                <TabsTrigger 
                  value="shifts"
                  className="h-12 rounded-lg text-sm font-medium data-[state=active]:bg-[#2563EB] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Quản lý ca
                </TabsTrigger>
                
                <TabsTrigger 
                  value="reports"
                  className="h-12 rounded-lg text-sm font-medium data-[state=active]:bg-[#2563EB] data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Báo cáo
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Keep existing tab contents */}
            <div className="space-y-6">
              <TabsContent value="checkin" className="m-0">
                <CheckInOutInterface employeeId={currentEmployeeId} />
              </TabsContent>

              <TabsContent value="shifts" className="m-0">
                <ShiftManagement />
              </TabsContent>

              <TabsContent value="reports" className="m-0">
                <AttendanceReports />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
