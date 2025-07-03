// OKR Dashboard - Main dashboard component for the new OKR system
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Target, 
  TrendingUp, 
  Users, 
  Building2, 
  User, 
  Calendar,
  Trophy,
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  BarChart3,
  Activity,
  Settings
} from 'lucide-react';

import { useCurrentOKRCycle, useOKRDashboardStats } from '@/hooks/useOKRSystem';
import { CompanyOKRView } from './CompanyOKRView';
import { DepartmentOKRView } from './DepartmentOKRView';
import { IndividualOKRView } from './IndividualOKRView';
import { OKRAnalytics } from './OKRAnalytics';
import { OKRLeaderboard } from './OKRLeaderboard';
import { CreateOKRDialog } from './CreateOKRDialog';
import { CreateOKRCycleDialog } from './CreateOKRCycleDialog';
import { OKRSystemSettings } from './OKRSystemSettings';

export function OKRDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCreateCycleDialog, setShowCreateCycleDialog] = useState(false);
  
  const { data: currentCycle, isLoading: cycleLoading } = useCurrentOKRCycle();
  const { data: dashboardStats, isLoading: statsLoading } = useOKRDashboardStats();

  if (cycleLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!currentCycle) {
    return (
      <div className="text-center py-12">
        <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Chưa có chu kỳ OKR nào đang hoạt động
        </h3>
        <p className="text-gray-600 mb-4">
          Hãy tạo chu kỳ OKR mới để bắt đầu thiết lập mục tiêu
        </p>
        <Button onClick={() => setShowCreateCycleDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo chu kỳ OKR mới
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'on_track': return 'bg-blue-500';
      case 'at_risk': return 'bg-yellow-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'on_track': return <TrendingUp className="h-4 w-4" />;
      case 'at_risk': return <AlertCircle className="h-4 w-4" />;
      case 'overdue': return <Clock className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý OKR</h1>
          <p className="text-gray-600 mt-1">
            Chu kỳ hiện tại: <span className="font-semibold">{currentCycle.name}</span>
            {' • '}
            <span className="text-sm">
              {new Date(currentCycle.start_date).toLocaleDateString('vi-VN')} 
              {' - '}
              {new Date(currentCycle.end_date).toLocaleDateString('vi-VN')}
            </span>
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <BarChart3 className="h-4 w-4 mr-2" />
            Báo cáo
          </Button>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tạo OKR mới
          </Button>
        </div>
      </div>

      {/* Cycle Progress */}
      {dashboardStats && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Tiến độ chu kỳ
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {dashboardStats.cycle_progress.progress_percentage}%
                </div>
                <div className="text-sm text-gray-600">Hoàn thành</div>
                <Progress 
                  value={dashboardStats.cycle_progress.progress_percentage} 
                  className="mt-2" 
                />
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardStats.cycle_progress.completed_days}
                </div>
                <div className="text-sm text-gray-600">Ngày đã qua</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {dashboardStats.cycle_progress.remaining_days}
                </div>
                <div className="text-sm text-gray-600">Ngày còn lại</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {dashboardStats.cycle_progress.total_days}
                </div>
                <div className="text-sm text-gray-600">Tổng số ngày</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Cards */}
      {dashboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng số OKR</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.okr_summary.total}</div>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {dashboardStats.okr_summary.completed} hoàn thành
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đúng tiến độ</CardTitle>
              <TrendingUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {dashboardStats.okr_summary.on_track}
              </div>
              <Progress 
                value={(dashboardStats.okr_summary.on_track / dashboardStats.okr_summary.total) * 100} 
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Có rủi ro</CardTitle>
              <AlertCircle className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {dashboardStats.okr_summary.at_risk}
              </div>
              <Progress 
                value={(dashboardStats.okr_summary.at_risk / dashboardStats.okr_summary.total) * 100} 
                className="mt-2"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quá hạn</CardTitle>
              <Clock className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {dashboardStats.okr_summary.overdue}
              </div>
              <Progress 
                value={(dashboardStats.okr_summary.overdue / dashboardStats.okr_summary.total) * 100} 
                className="mt-2"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Công ty
          </TabsTrigger>
          <TabsTrigger value="department" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Phòng ban
          </TabsTrigger>
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Cá nhân
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Phân tích
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Bảng xếp hạng
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Cài đặt
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Cycle Progress - Enhanced like the image */}
          {dashboardStats && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Tiến độ chu kỳ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {dashboardStats.cycle_progress.progress_percentage}%
                    </div>
                    <div className="text-sm font-medium text-muted-foreground mb-3">Hoàn thành</div>
                    <Progress 
                      value={dashboardStats.cycle_progress.progress_percentage} 
                      className="h-3 rounded-full" 
                    />
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-blue-600 mb-2">
                      {dashboardStats.cycle_progress.completed_days}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">Ngày đã qua</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-orange-600 mb-2">
                      {dashboardStats.cycle_progress.remaining_days}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">Ngày còn lại</div>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-700 mb-2">
                      {dashboardStats.cycle_progress.total_days}
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">Tổng số ngày</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Stats - Like the image layout */}
          {dashboardStats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Tổng số OKR</CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{dashboardStats.okr_summary.total}</div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {dashboardStats.okr_summary.completed} hoàn thành
                  </div>
                  <Progress 
                    value={dashboardStats.okr_summary.total > 0 ? (dashboardStats.okr_summary.completed / dashboardStats.okr_summary.total) * 100 : 0} 
                    className="mt-2 h-1"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Đúng tiến độ</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {dashboardStats.okr_summary.on_track}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {dashboardStats.okr_summary.total > 0 ? Math.round((dashboardStats.okr_summary.on_track / dashboardStats.okr_summary.total) * 100) : 0}%
                  </div>
                  <Progress 
                    value={dashboardStats.okr_summary.total > 0 ? (dashboardStats.okr_summary.on_track / dashboardStats.okr_summary.total) * 100 : 0} 
                    className="mt-2 h-1"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Có rủi ro</CardTitle>
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600">
                    {dashboardStats.okr_summary.at_risk}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {dashboardStats.okr_summary.total > 0 ? Math.round((dashboardStats.okr_summary.at_risk / dashboardStats.okr_summary.total) * 100) : 0}%
                  </div>
                  <Progress 
                    value={dashboardStats.okr_summary.total > 0 ? (dashboardStats.okr_summary.at_risk / dashboardStats.okr_summary.total) * 100 : 0} 
                    className="mt-2 h-1"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Quá hạn</CardTitle>
                  <Clock className="h-4 w-4 text-red-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">
                    {dashboardStats.okr_summary.overdue}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {dashboardStats.okr_summary.total > 0 ? Math.round((dashboardStats.okr_summary.overdue / dashboardStats.okr_summary.total) * 100) : 0}%
                  </div>
                  <Progress 
                    value={dashboardStats.okr_summary.total > 0 ? (dashboardStats.okr_summary.overdue / dashboardStats.okr_summary.total) * 100 : 0} 
                    className="mt-2 h-1"
                  />
                </CardContent>
              </Card>
            </div>
          )}

          {/* Level-specific OKRs */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">OKR Công ty</CardTitle>
                <Building2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {dashboardStats?.company_okrs || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Mục tiêu cấp công ty
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">OKR Phòng ban</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {dashboardStats?.department_okrs || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Mục tiêu cấp phòng ban
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">OKR Cá nhân</CardTitle>
                <User className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-600">
                  {dashboardStats?.individual_okrs || 0}
                </div>
                <p className="text-xs text-muted-foreground">
                  Mục tiêu cá nhân
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Điểm liên kết</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {dashboardStats?.alignment_score || 0}%
                </div>
                <p className="text-xs text-muted-foreground">
                  Mức độ liên kết OKR
                </p>
              </CardContent>
            </Card>
          </div>

          {/* OKR Alignment Flow */}
          <Card>
            <CardHeader>
              <CardTitle>Luồng liên kết OKR</CardTitle>
              <CardDescription>
                Mức độ liên kết từ cấp Công ty → Phòng ban → Cá nhân
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between py-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Building2 className="h-8 w-8 text-blue-600" />
                  </div>
                  <p className="text-sm font-medium">Công ty</p>
                  <p className="text-xs text-muted-foreground">Tầm nhìn chiến lược</p>
                </div>
                
                <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-green-200 mx-4"></div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-sm font-medium">Phòng ban</p>
                  <p className="text-xs text-muted-foreground">Kế hoạch thực thi</p>
                </div>
                
                <div className="flex-1 h-px bg-gradient-to-r from-green-200 to-purple-200 mx-4"></div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <User className="h-8 w-8 text-purple-600" />
                  </div>
                  <p className="text-sm font-medium">Cá nhân</p>
                  <p className="text-xs text-muted-foreground">Hành động cụ thể</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('company')}>
              <CardContent className="flex items-center p-6">
                <Building2 className="h-8 w-8 text-blue-600 mr-4" />
                <div>
                  <h3 className="font-semibold">Quản lý OKR Công ty</h3>
                  <p className="text-sm text-muted-foreground">Xem và quản lý mục tiêu cấp công ty</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('department')}>
              <CardContent className="flex items-center p-6">
                <Users className="h-8 w-8 text-green-600 mr-4" />
                <div>
                  <h3 className="font-semibold">Quản lý OKR Phòng ban</h3>
                  <p className="text-sm text-muted-foreground">Xem và quản lý mục tiêu phòng ban</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('individual')}>
              <CardContent className="flex items-center p-6">
                <User className="h-8 w-8 text-purple-600 mr-4" />
                <div>
                  <h3 className="font-semibold">Quản lý OKR Cá nhân</h3>
                  <p className="text-sm text-muted-foreground">Xem và quản lý mục tiêu cá nhân</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="company">
          <CompanyOKRView />
        </TabsContent>

        <TabsContent value="department">
          <DepartmentOKRView />
        </TabsContent>

        <TabsContent value="individual">
          <IndividualOKRView />
        </TabsContent>

        <TabsContent value="analytics">
          <OKRAnalytics />
        </TabsContent>

        <TabsContent value="leaderboard">
          <OKRLeaderboard />
        </TabsContent>

        <TabsContent value="settings">
          <OKRSystemSettings />
        </TabsContent>
      </Tabs>

      {/* Create OKR Dialog */}
      <CreateOKRDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog}
      />
      
      <CreateOKRCycleDialog 
        open={showCreateCycleDialog} 
        onOpenChange={setShowCreateCycleDialog}
      />
    </div>
  );
}