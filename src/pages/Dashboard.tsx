import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  Calendar, 
  Target, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Activity,
  Star,
  Award,
  Bell,
  ArrowRight,
  ChevronRight,
  MapPin,
  Timer
} from 'lucide-react';
import { useUserRole, useDashboardStats, useAdminStats } from '@/hooks/useDashboard';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const priorityColors = {
  low: 'bg-slate-100 text-slate-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-red-100 text-red-700'
};

const statusColors = {
  active: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  completed: 'bg-blue-100 text-blue-700',
  overdue: 'bg-red-100 text-red-700'
};

export default function Dashboard() {
  const { data: userRole, isLoading: roleLoading } = useUserRole();
  const { data: dashboardStats, isLoading: statsLoading } = useDashboardStats();
  const { data: adminStats, isLoading: adminStatsLoading } = useAdminStats();

  if (roleLoading || statsLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const isAdmin = userRole === 'admin' || userRole === 'super_admin';

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-gray-50 via-white to-blue-50 min-h-screen">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
          Chào mừng trở lại, {dashboardStats?.employee?.full_name || 'User'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isAdmin ? 'Quản lý hệ thống và theo dõi hoạt động tổng quan' : 'Theo dõi công việc và hiệu suất của bạn'}
        </p>
      </div>

      {/* Quick Stats */}
      {isAdmin ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Tổng nhân viên</p>
                  <p className="text-3xl font-bold">{adminStats?.total_employees || 0}</p>
                </div>
                <Users className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">OKR đang hoạt động</p>
                  <p className="text-3xl font-bold">{adminStats?.active_okrs || 0}</p>
                </div>
                <Target className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Chấm công hôm nay</p>
                  <p className="text-3xl font-bold">{adminStats?.today_attendance || 0}</p>
                </div>
                <Clock className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Đơn xin nghỉ chờ duyệt</p>
                  <p className="text-3xl font-bold">{adminStats?.pending_leave_requests || 0}</p>
                </div>
                <Calendar className="h-12 w-12 text-orange-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Chấm công hôm nay</p>
                  <p className="text-2xl font-bold">
                    {dashboardStats?.todayAttendance ? (
                      <Badge variant="outline" className="text-white border-white/30">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Đã chấm
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-white border-white/30">
                        <AlertTriangle className="h-4 w-4 mr-1" />
                        Chưa chấm
                      </Badge>
                    )}
                  </p>
                </div>
                <Clock className="h-12 w-12 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">OKR của tôi</p>
                  <p className="text-3xl font-bold">{dashboardStats?.myOKRs?.length || 0}</p>
                </div>
                <Target className="h-12 w-12 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">KPI của tôi</p>
                  <p className="text-3xl font-bold">{dashboardStats?.myKPIs?.length || 0}</p>
                </div>
                <BarChart3 className="h-12 w-12 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-500 to-orange-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-yellow-100 text-sm font-medium">Ý tưởng của tôi</p>
                  <p className="text-3xl font-bold">{dashboardStats?.myIdeas?.length || 0}</p>
                </div>
                <Lightbulb className="h-12 w-12 text-yellow-200" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Attendance Summary for Employees */}
          {!isAdmin && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Tóm tắt chấm công tháng này
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 rounded-lg bg-green-50">
                    <div className="text-2xl font-bold text-green-600">
                      {dashboardStats?.monthAttendance?.filter(a => a.status === 'present').length || 0}
                    </div>
                    <div className="text-sm text-green-600">Ngày đi làm</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-red-50">
                    <div className="text-2xl font-bold text-red-600">
                      {dashboardStats?.monthAttendance?.filter(a => a.is_late).length || 0}
                    </div>
                    <div className="text-sm text-red-600">Ngày đi muộn</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-yellow-50">
                    <div className="text-2xl font-bold text-yellow-600">
                      {dashboardStats?.monthAttendance?.filter(a => a.is_early_leave).length || 0}
                    </div>
                    <div className="text-sm text-yellow-600">Về sớm</div>
                  </div>
                  <div className="text-center p-4 rounded-lg bg-blue-50">
                    <div className="text-2xl font-bold text-blue-600">
                      {dashboardStats?.monthAttendance?.reduce((sum, a) => sum + (a.total_work_hours || 0), 0).toFixed(1)}h
                    </div>
                    <div className="text-sm text-blue-600">Tổng giờ làm</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* OKR Progress */}
          {!isAdmin && dashboardStats?.myOKRs && dashboardStats.myOKRs.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Tiến độ OKR của tôi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardStats.myOKRs.slice(0, 3).map((okr: any) => (
                    <div key={okr.id} className="p-4 rounded-lg border border-border/50 hover:border-border transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{okr.title}</h4>
                        <Badge variant="outline" className={statusColors[okr.status as keyof typeof statusColors]}>
                          {okr.status === 'active' ? 'Đang hoạt động' : okr.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <Progress value={okr.progress || 0} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Tiến độ: {okr.progress || 0}%</span>
                          <span>Hạn: {new Date(okr.end_date).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {dashboardStats.myOKRs.length > 3 && (
                    <Button variant="ghost" className="w-full justify-between" asChild>
                      <a href="/okr">
                        Xem tất cả OKR
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* KPI Summary */}
          {!isAdmin && dashboardStats?.myKPIs && dashboardStats.myKPIs.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  KPI của tôi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dashboardStats.myKPIs.slice(0, 3).map((kpi: any) => (
                    <div key={kpi.id} className="p-4 rounded-lg border border-border/50 hover:border-border transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{kpi.name}</h4>
                        <Badge variant="outline" className={statusColors[kpi.status as keyof typeof statusColors]}>
                          {kpi.status === 'active' ? 'Đang theo dõi' : kpi.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-2xl font-bold">
                          {kpi.current_value || 0} {kpi.unit}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Mục tiêu: {kpi.target_value} {kpi.unit}
                        </div>
                      </div>
                      {kpi.target_value && (
                        <Progress 
                          value={Math.min((kpi.current_value / kpi.target_value) * 100, 100)} 
                          className="h-2 mt-2" 
                        />
                      )}
                    </div>
                  ))}
                  {dashboardStats.myKPIs.length > 3 && (
                    <Button variant="ghost" className="w-full justify-between" asChild>
                      <a href="/kpi">
                        Xem tất cả KPI
                        <ArrowRight className="h-4 w-4" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          {dashboardStats?.todayAttendance && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-primary" />
                  Chấm công hôm nay
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardStats.todayAttendance.check_in_time && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium">Check-in</span>
                      </div>
                      <span className="text-sm text-green-700">
                        {new Date(dashboardStats.todayAttendance.check_in_time).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}
                  
                  {dashboardStats.todayAttendance.check_out_time && (
                    <div className="flex items-center justify-between p-3 rounded-lg bg-blue-50">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium">Check-out</span>
                      </div>
                      <span className="text-sm text-blue-700">
                        {new Date(dashboardStats.todayAttendance.check_out_time).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                  )}

                  {dashboardStats.todayAttendance.total_work_hours && (
                    <div className="pt-2 border-t border-border/50">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {dashboardStats.todayAttendance.total_work_hours}h
                        </div>
                        <div className="text-sm text-muted-foreground">Tổng giờ làm việc</div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Notifications */}
          {dashboardStats?.notifications && dashboardStats.notifications.length > 0 && (
            <Card className="border-0 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Thông báo gần đây
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dashboardStats.notifications.slice(0, 5).map((notification: any) => (
                    <div key={notification.id} className="p-3 rounded-lg border border-border/50 hover:border-border transition-colors">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 ${notification.is_read ? 'bg-gray-300' : 'bg-primary'}`}></div>
                        <div className="flex-1 min-w-0">
                          <h5 className="font-medium text-sm mb-1">{notification.title}</h5>
                          <p className="text-xs text-muted-foreground line-clamp-2">{notification.message}</p>
                          <div className="text-xs text-muted-foreground mt-1">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true, locale: vi })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="border-0 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                Thao tác nhanh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3">
                <Button variant="outline" className="justify-start" asChild>
                  <a href="/attendance">
                    <Clock className="h-4 w-4 mr-2" />
                    Chấm công
                  </a>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <a href="/okr">
                    <Target className="h-4 w-4 mr-2" />
                    OKR của tôi
                  </a>
                </Button>
                <Button variant="outline" className="justify-start" asChild>
                  <a href="/kpi">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Theo dõi KPI
                  </a>
                </Button>
                {isAdmin && (
                  <Button variant="outline" className="justify-start" asChild>
                    <a href="/settings">
                      <Users className="h-4 w-4 mr-2" />
                      Quản lý hệ thống
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}