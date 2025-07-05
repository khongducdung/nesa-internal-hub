// OKR Analytics - Analytics and reporting view
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, TrendingDown, Target, Users, Building2, Calendar, Download, FileText } from 'lucide-react';
import { useOKRDashboardStats, useCompanyOKRs, useDepartmentOKRs, useIndividualOKRs } from '@/hooks/useOKRSystem';

// Define proper types for the statistics
type DepartmentStat = {
  total: number;
  avgProgress: number;
  progressSum: number;
};

type DepartmentStats = Record<string, DepartmentStat>;

export function OKRAnalytics() {
  const { data: dashboardStats } = useOKRDashboardStats();
  const { data: companyOKRs = [] } = useCompanyOKRs();
  const { data: departmentOKRs = [] } = useDepartmentOKRs();
  const { data: individualOKRs = [] } = useIndividualOKRs();

  const allOKRs = [...companyOKRs, ...departmentOKRs, ...individualOKRs];
  
  const getStatusStats = () => {
    const total = allOKRs.length;
    const completed = allOKRs.filter((okr: any) => okr.status === 'completed').length;
    const onTrack = allOKRs.filter((okr: any) => okr.progress >= 70 && okr.status !== 'completed').length;
    const atRisk = allOKRs.filter((okr: any) => okr.progress < 70 && okr.progress >= 30).length;
    const overdue = allOKRs.filter((okr: any) => okr.progress < 30).length;
    
    return { total, completed, onTrack, atRisk, overdue };
  };

  const statusStats = getStatusStats();
  const avgProgress = allOKRs.length > 0 ? Math.round(allOKRs.reduce((sum: number, okr: any) => sum + (okr.progress || 0), 0) / allOKRs.length) : 0;

  // Fix the departmentStats typing
  const departmentStats: DepartmentStats = departmentOKRs.reduce((acc: DepartmentStats, okr: any) => {
    const deptName = okr.department?.name || 'Không xác định';
    if (!acc[deptName]) {
      acc[deptName] = { total: 0, avgProgress: 0, progressSum: 0 };
    }
    acc[deptName].total++;
    acc[deptName].progressSum += okr.progress || 0;
    acc[deptName].avgProgress = Math.round(acc[deptName].progressSum / acc[deptName].total);
    return acc;
  }, {} as DepartmentStats);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6" />
            Phân tích & Báo cáo
          </h2>
          <p className="text-muted-foreground mt-1">
            Phân tích hiệu suất và tạo báo cáo OKR
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="quarter">
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="quarter">Quý này</SelectItem>
              <SelectItem value="month">Tháng này</SelectItem>
              <SelectItem value="year">Năm này</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tổng OKR</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusStats.total}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Target className="h-3 w-3 mr-1" />
              Tất cả cấp độ
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Hoàn thành</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusStats.completed}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              {statusStats.total > 0 ? Math.round((statusStats.completed / statusStats.total) * 100) : 0}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Tiến độ trung bình</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgProgress}%</div>
            <Progress value={avgProgress} className="h-1 mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Cần chú ý</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{statusStats.atRisk + statusStats.overdue}</div>
            <div className="flex items-center text-xs text-yellow-600">
              <TrendingDown className="h-3 w-3 mr-1" />
              Rủi ro & trễ hạn
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Phân bố trạng thái OKR
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-lg font-semibold text-green-600">{statusStats.completed}</div>
              <div className="text-sm text-muted-foreground">Hoàn thành</div>
              <Progress value={statusStats.total > 0 ? (statusStats.completed / statusStats.total) * 100 : 0} className="mt-2 h-2" />
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-blue-600">{statusStats.onTrack}</div>
              <div className="text-sm text-muted-foreground">Đúng hướng</div>
              <Progress value={statusStats.total > 0 ? (statusStats.onTrack / statusStats.total) * 100 : 0} className="mt-2 h-2" />
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-yellow-600">{statusStats.atRisk}</div>
              <div className="text-sm text-muted-foreground">Có rủi ro</div>
              <Progress value={statusStats.total > 0 ? (statusStats.atRisk / statusStats.total) * 100 : 0} className="mt-2 h-2" />
            </div>
            <div className="text-center">
              <div className="text-lg font-semibold text-red-600">{statusStats.overdue}</div>
              <div className="text-sm text-muted-foreground">Trễ hạn</div>
              <Progress value={statusStats.total > 0 ? (statusStats.overdue / statusStats.total) * 100 : 0} className="mt-2 h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Department Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Hiệu suất theo phòng ban
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(departmentStats).map(([deptName, stats]) => (
              <div key={deptName} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <div className="font-medium">{deptName}</div>
                  <div className="text-sm text-muted-foreground">{stats.total} OKR</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-semibold">{stats.avgProgress}%</div>
                    <div className="text-xs text-muted-foreground">Tiến độ TB</div>
                  </div>
                  <Progress value={stats.avgProgress} className="w-20 h-2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* OKR Level Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              OKR Công ty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyOKRs.length}</div>
            <div className="text-sm text-muted-foreground mt-1">
              TB: {companyOKRs.length > 0 ? Math.round(companyOKRs.reduce((sum: number, okr: any) => sum + (okr.progress || 0), 0) / companyOKRs.length) : 0}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              OKR Phòng ban
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{departmentOKRs.length}</div>
            <div className="text-sm text-muted-foreground mt-1">
              TB: {departmentOKRs.length > 0 ? Math.round(departmentOKRs.reduce((sum: number, okr: any) => sum + (okr.progress || 0), 0) / departmentOKRs.length) : 0}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              OKR Cá nhân
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{individualOKRs.length}</div>
            <div className="text-sm text-muted-foreground mt-1">
              TB: {individualOKRs.length > 0 ? Math.round(individualOKRs.reduce((sum: number, okr: any) => sum + (okr.progress || 0), 0) / individualOKRs.length) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Tạo báo cáo
          </CardTitle>
          <CardDescription>
            Xuất báo cáo chi tiết theo từng loại phân tích
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col">
              <BarChart3 className="h-6 w-6 mb-2" />
              <span>Báo cáo tổng quan</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Users className="h-6 w-6 mb-2" />
              <span>Báo cáo phòng ban</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col">
              <Target className="h-6 w-6 mb-2" />
              <span>Báo cáo cá nhân</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
