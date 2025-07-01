
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, Users, Settings, Plus, Edit, Trash2, MapPin } from 'lucide-react';
import { AttendanceSettingsManagement } from './AttendanceSettingsManagement';

export function ShiftManagement() {
  const [activeTab, setActiveTab] = useState('overview');

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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Quản lý ca làm việc</h2>
          <p className="text-gray-600">Thiết lập và quản lý ca làm việc, phân công nhân viên</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Tạo ca mới
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList variant="secondary" className="grid w-full grid-cols-4">
          <TabsTrigger variant="secondary" value="overview">
            <Clock className="h-4 w-4 mr-2" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger variant="secondary" value="shifts">
            <Calendar className="h-4 w-4 mr-2" />
            Ca làm việc
          </TabsTrigger>
          <TabsTrigger variant="secondary" value="assignments">
            <Users className="h-4 w-4 mr-2" />
            Phân công
          </TabsTrigger>
          <TabsTrigger variant="secondary" value="settings">
            <Settings className="h-4 w-4 mr-2" />
            Cài đặt
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Statistics Cards */}
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
          <Card className="mt-6">
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
        </TabsContent>

        <TabsContent value="shifts" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Danh sách ca làm việc</CardTitle>
                <Button size="sm">
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
        </TabsContent>

        <TabsContent value="assignments" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Phân công ca làm việc</CardTitle>
                <Button size="sm">
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
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <AttendanceSettingsManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
