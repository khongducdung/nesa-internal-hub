import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Clock, 
  Target, 
  Calendar, 
  FileText, 
  TrendingUp,
  CheckCircle,
  AlertCircle,
  User,
  Briefcase
} from 'lucide-react';
import { useUserAttendanceSummary, useUserOKRProgress } from '@/hooks/useDashboard';
import { useNavigate } from 'react-router-dom';
import { AttendanceQuickActions } from './AttendanceQuickActions';

export function EmployeeDashboardSection() {
  const { data: attendanceSummary } = useUserAttendanceSummary();
  const { data: okrProgress } = useUserOKRProgress();
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Chấm công',
      description: 'Check-in/Check-out hôm nay',
      href: '/attendance',
      icon: Clock,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-200'
    },
    {
      title: 'Xin nghỉ phép',
      description: 'Tạo yêu cầu nghỉ phép',
      href: '/hrm',
      icon: Calendar,
      color: 'bg-green-50 hover:bg-green-100 border-green-200'
    },
    {
      title: 'Xem OKR',
      description: 'Theo dõi mục tiêu cá nhân',
      href: '/okr',
      icon: Target,
      color: 'bg-purple-50 hover:bg-purple-100 border-purple-200'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Personal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Attendance Summary */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Clock className="h-5 w-5" />
              Chấm công tháng này
            </CardTitle>
          </CardHeader>
          <CardContent>
            {attendanceSummary ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tổng ngày làm</span>
                  <span className="font-semibold">{attendanceSummary.totalDays}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Có mặt</span>
                  <span className="font-semibold text-green-600">{attendanceSummary.presentDays}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Đi muộn</span>
                  <span className="font-semibold text-orange-600">{attendanceSummary.lateDays}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tỷ lệ đúng giờ</span>
                  <Badge variant={attendanceSummary.onTimePercentage >= 90 ? 'default' : 'secondary'}>
                    {attendanceSummary.onTimePercentage}%
                  </Badge>
                </div>
                <Progress value={attendanceSummary.onTimePercentage} className="h-2" />
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Chưa có dữ liệu chấm công</p>
            )}
          </CardContent>
        </Card>

        {/* OKR Progress */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Target className="h-5 w-5" />
              OKR của tôi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {okrProgress ? (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tổng OKRs</span>
                  <span className="font-semibold">{okrProgress.totalOKRs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Hoàn thành</span>
                  <span className="font-semibold text-green-600">{okrProgress.completedOKRs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Đang thực hiện</span>
                  <span className="font-semibold text-blue-600">{okrProgress.inProgressOKRs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tiến độ trung bình</span>
                  <Badge variant="outline">
                    {okrProgress.averageProgress}%
                  </Badge>
                </div>
                <Progress value={okrProgress.averageProgress} className="h-2" />
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Chưa có OKR nào được giao</p>
            )}
          </CardContent>
        </Card>

        {/* Quick Check-in */}
        <AttendanceQuickActions />
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Thao tác nhanh</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickActions.map((action, index) => (
            <Card 
              key={index} 
              className={`hover:shadow-lg transition-all duration-200 cursor-pointer ${action.color}`}
              onClick={() => navigate(action.href)}
            >
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <action.icon className="h-5 w-5" />
                  {action.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-muted-foreground">{action.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Today's Tasks Reminder */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Briefcase className="h-5 w-5" />
            Nhắc nhở hôm nay
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-green-700 text-sm">Chấm công vào đầu giờ</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-green-700 text-sm">Cập nhật tiến độ OKR</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <span className="text-green-700 text-sm">Kiểm tra thông báo mới</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}