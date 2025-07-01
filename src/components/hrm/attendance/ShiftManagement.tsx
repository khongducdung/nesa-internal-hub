
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Users, Settings, Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { AttendanceSettingsManagement } from './AttendanceSettingsManagement';

export function ShiftManagement() {
  const [activeView, setActiveView] = useState('overview');

  // Mock data cho demo
  const shifts = [
    {
      id: '1',
      name: 'Ca sáng',
      startTime: '08:00',
      endTime: '12:00',
      description: 'Ca làm việc buổi sáng',
      assignedCount: 15,
      isActive: true
    },
    {
      id: '2', 
      name: 'Ca chiều',
      startTime: '13:00',
      endTime: '17:00',
      description: 'Ca làm việc buổi chiều',
      assignedCount: 18,
      isActive: true
    },
    {
      id: '3',
      name: 'Ca tối',
      startTime: '18:00',
      endTime: '22:00', 
      description: 'Ca làm việc buổi tối',
      assignedCount: 8,
      isActive: true
    }
  ];

  const assignments = [
    {
      id: '1',
      employeeName: 'Nguyễn Văn A',
      shiftName: 'Ca sáng',
      department: 'Phát triển',
      effectiveFrom: '2024-01-01',
      effectiveTo: null,
      isActive: true
    },
    {
      id: '2',
      employeeName: 'Trần Thị B', 
      shiftName: 'Ca chiều',
      department: 'Marketing',
      effectiveFrom: '2024-01-01',
      effectiveTo: null,
      isActive: true
    }
  ];

  if (activeView === 'settings') {
    return <AttendanceSettingsManagement />;
  }

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý ca làm việc</h2>
          <p className="text-gray-600">Thiết lập và quản lý ca làm việc, phân công nhân viên</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveView('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'overview' 
                  ? 'bg-white text-[#2563EB] shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Clock className="h-4 w-4 mr-2 inline" />
              Tổng quan
            </button>
            <button
              onClick={() => setActiveView('shifts')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'shifts' 
                  ? 'bg-white text-[#2563EB] shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="h-4 w-4 mr-2 inline" />
              Ca làm việc
            </button>
            <button
              onClick={() => setActiveView('assignments')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'assignments' 
                  ? 'bg-white text-[#2563EB] shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="h-4 w-4 mr-2 inline" />
              Phân công
            </button>
            <button
              onClick={() => setActiveView('settings')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeView === 'settings' 
                  ? 'bg-white text-[#2563EB] shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="h-4 w-4 mr-2 inline" />
              Cài đặt
            </button>
          </div>
          <Button className="bg-[#2563EB] hover:bg-[#1d4ed8] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Tạo ca mới
          </Button>
        </div>
      </div>

      {/* Content based on active view */}
      {activeView === 'overview' && (
        <div className="space-y-6">
          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tổng ca làm việc</p>
                    <p className="text-2xl font-bold text-gray-900">{shifts.length}</p>
                  </div>
                  <Clock className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nhân viên được phân ca</p>
                    <p className="text-2xl font-bold text-gray-900">{assignments.length}</p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Ca đang hoạt động</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {shifts.filter(s => s.isActive).length}
                    </p>
                  </div>
                  <Calendar className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Ca làm việc hôm nay</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {shifts.map((shift) => (
                  <div key={shift.id} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{shift.name}</h4>
                      <Badge variant={shift.isActive ? 'default' : 'secondary'}>
                        {shift.isActive ? 'Hoạt động' : 'Tạm dừng'}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-sm text-gray-600">
                      <p>⏰ {shift.startTime} - {shift.endTime}</p>
                      <p>👥 {shift.assignedCount} nhân viên</p>
                      <p className="text-gray-500">{shift.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeView === 'shifts' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Danh sách ca làm việc</CardTitle>
              <Button size="sm" className="bg-[#2563EB] hover:bg-[#1d4ed8]">
                <Plus className="h-4 w-4 mr-2" />
                Thêm ca mới
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {shifts.map((shift) => (
                <div key={shift.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-lg">{shift.name}</h4>
                        <Badge variant={shift.isActive ? 'default' : 'secondary'}>
                          {shift.isActive ? 'Hoạt động' : 'Tạm dừng'}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          <span>{shift.startTime} - {shift.endTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{shift.assignedCount} nhân viên</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>Tất cả văn phòng</span>
                        </div>
                      </div>
                      <p className="text-gray-500 mt-2">{shift.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeView === 'assignments' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Phân công ca làm việc</CardTitle>
              <Button size="sm" className="bg-[#2563EB] hover:bg-[#1d4ed8]">
                <Plus className="h-4 w-4 mr-2" />
                Phân công mới
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {assignments.map((assignment) => (
                <div key={assignment.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold">{assignment.employeeName}</h4>
                        <Badge>{assignment.shiftName}</Badge>
                        <Badge variant="outline">{assignment.department}</Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <p>Hiệu lực từ: {new Date(assignment.effectiveFrom).toLocaleDateString('vi-VN')}</p>
                        {assignment.effectiveTo && (
                          <p>Đến ngày: {new Date(assignment.effectiveTo).toLocaleDateString('vi-VN')}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
