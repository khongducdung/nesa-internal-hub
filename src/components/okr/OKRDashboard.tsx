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
  Activity
} from 'lucide-react';

import { useCurrentOKRCycle, useOKRDashboardStats } from '@/hooks/useOKRSystem';
import { CompanyOKRView } from './CompanyOKRView';
import { DepartmentOKRView } from './DepartmentOKRView';
import { IndividualOKRView } from './IndividualOKRView';
import { OKRAnalytics } from './OKRAnalytics';
import { OKRLeaderboard } from './OKRLeaderboard';
import { CreateOKRDialog } from './CreateOKRDialog';
import { CreateOKRCycleDialog } from './CreateOKRCycleDialog';

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
        <TabsList className="grid w-full grid-cols-6">
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
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Dashboard tổng quan
            </h3>
            <p className="text-gray-600">
              Xem tổng quan về tất cả OKR trong hệ thống
            </p>
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