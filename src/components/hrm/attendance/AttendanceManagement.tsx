
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Users, Calendar, FileText, Settings, Building2, ClipboardList, CalendarDays, Coffee, FileCheck } from 'lucide-react';
import { CheckInOutInterface } from './CheckInOutInterface';
import { ShiftManagement } from './ShiftManagement';
import { AttendanceList } from './AttendanceList';
import { AttendanceReports } from './AttendanceReports';

export function AttendanceManagement() {
  const [activeFeature, setActiveFeature] = useState('checkin');
  
  // Tạm thời hardcode employee ID - trong thực tế sẽ lấy từ auth
  const currentEmployeeId = '00000000-0000-0000-0000-000000000000';

  const menuItems = [
    { id: 'checkin', label: 'Chấm công', icon: Clock },
    { id: 'management', label: 'Quản lý chấm công', icon: Settings },
    { id: 'schedule', label: 'Thiết kế lịch làm việc', icon: Calendar },
    { id: 'leave', label: 'Lịch nghỉ', icon: CalendarDays },
    { id: 'leave-config', label: 'Cấu hình đơn báo', icon: FileCheck },
    { id: 'overtime', label: 'Quản lý làm thêm', icon: Coffee },
    { id: 'overtime-design', label: 'Thiết kế làm thêm', icon: ClipboardList },
    { id: 'overtime-config', label: 'Cấu hình đơn báo', icon: FileText },
  ];

  const renderContent = () => {
    switch (activeFeature) {
      case 'checkin':
        return <CheckInOutInterface employeeId={currentEmployeeId} />;
      case 'management':
        return <ShiftManagement />;
      case 'schedule':
        return <AttendanceList />;
      case 'leave':
      case 'leave-config':
      case 'overtime':
      case 'overtime-design':
      case 'overtime-config':
        return <AttendanceReports />;
      default:
        return <CheckInOutInterface employeeId={currentEmployeeId} />;
    }
  };

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

      {/* Main Content with Sidebar */}
      <div className="flex">
        {/* Sidebar Menu */}
        <div className="w-64 bg-white border-r border-gray-200 min-h-screen">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Tính năng</h3>
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveFeature(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeFeature === item.id
                        ? 'bg-[#2563EB] text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="text-sm font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
