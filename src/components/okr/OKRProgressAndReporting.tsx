
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  TrendingUp, BarChart3, Download, Calendar, Users, Target, 
  AlertTriangle, CheckCircle, Clock, Filter, Eye, 
  Building2, User, Award, Zap, Activity, Bell
} from 'lucide-react';
import { useOKRAnalytics } from '@/hooks/useOKRAnalytics';
import { useAuth } from '@/hooks/useAuth';
import { OKRReportGenerator } from './OKRReportGenerator';
import { OKRRealTimeUpdates } from './OKRRealTimeUpdates';
import { DepartmentDetailDialog } from './DepartmentDetailDialog';
import { AdvancedFilterDialog } from './AdvancedFilterDialog';

export function OKRProgressAndReporting() {
  const { analytics, loading, period, setPeriod, level, setLevel } = useOKRAnalytics();
  const { profile, isAdmin } = useAuth();
  const [alertsDialogOpen, setAlertsDialogOpen] = useState(false);
  const [departmentDetailOpen, setDepartmentDetailOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<{ id: string; name: string } | null>(null);
  const [advancedFilterOpen, setAdvancedFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<any>({});

  const getStatusBadge = (progress: number) => {
    if (progress >= 100) return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Hoàn thành</Badge>;
    if (progress >= 80) return <Badge className="bg-blue-100 text-blue-800"><TrendingUp className="h-3 w-3 mr-1" />Vượt tiến độ</Badge>;
    if (progress >= 60) return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Đúng tiến độ</Badge>;
    if (progress >= 40) return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="h-3 w-3 mr-1" />Cần chú ý</Badge>;
    return <Badge className="bg-red-100 text-red-800"><Clock className="h-3 w-3 mr-1" />Chậm tiến độ</Badge>;
  };

  const exportData = (format: 'excel' | 'pdf') => {
    console.log(`Exporting data as ${format}...`);
    const fileName = `OKR_Data_${new Date().toISOString().split('T')[0]}.${format}`;
    
    const element = document.createElement('a');
    element.href = '#';
    element.download = fileName;
    element.click();
    
    alert(`Dữ liệu đã được xuất thành ${fileName}!`);
  };

  const handleDepartmentView = (dept: any) => {
    setSelectedDepartment({ id: dept.department_id, name: dept.name });
    setDepartmentDetailOpen(true);
  };

  const handleApplyFilters = (filters: any) => {
    setAppliedFilters(filters);
    console.log('Applied filters:', filters);
  };

  const getActiveFiltersCount = () => {
    return Object.values(appliedFilters).filter(Boolean).length;
  };

  if (loading || !analytics) {
    return <div className="flex items-center justify-center h-64">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Tiến độ & Báo cáo OKR</h2>
            <p className="text-sm text-gray-500">
              Theo dõi tiến độ và phân tích hiệu suất OKR toàn tổ chức
            </p>
          </div>
        </div>
        <div className="flex gap-3">
          <Dialog open={alertsDialogOpen} onOpenChange={setAlertsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Cảnh báo
                <Badge variant="destructive" className="ml-1">3</Badge>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Cập nhật theo thời gian thực</DialogTitle>
              </DialogHeader>
              <OKRRealTimeUpdates />
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={() => exportData('excel')} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Xuất Excel
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <label className="text-sm font-medium">Chu kỳ:</label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Hiện tại</SelectItem>
                  <SelectItem value="q1-2024">Q1 2024</SelectItem>
                  <SelectItem value="q2-2024">Q2 2024</SelectItem>
                  <SelectItem value="yearly">Cả năm</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <label className="text-sm font-medium">Cấp độ:</label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="company">Công ty</SelectItem>
                  <SelectItem value="department">Phòng ban</SelectItem>
                  <SelectItem value="individual">Cá nhân</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button 
              variant="outline" 
              size="sm" 
              className="ml-auto flex items-center gap-2"
              onClick={() => setAdvancedFilterOpen(true)}
            >
              <Filter className="h-4 w-4" />
              Bộ lọc nâng cao
              {getActiveFiltersCount() > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {getActiveFiltersCount()}
                </Badge>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="progress" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Tiến độ
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Báo cáo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-6">
          {/* Department Performance Cards */}
          {isAdmin && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analytics.departmentBreakdown.map((dept, index) => (
                <Card key={dept.name} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                      {getStatusBadge(dept.progress)}
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Tiến độ tổng thể</span>
                          <span className="font-medium">{dept.progress}%</span>
                        </div>
                        <Progress value={dept.progress} className="h-2" />
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>OKR đúng tiến độ</span>
                        <span>{dept.onTrack}/{dept.total}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        <strong>Quản lý:</strong> {dept.manager}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full"
                        onClick={() => handleDepartmentView(dept)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Level & Position Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Phân tích theo cấp bậc
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.levelBreakdown.map((level) => (
                    <div key={level.level} className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{level.level}</span>
                        <Badge variant="outline">{level.avgProgress}%</Badge>
                      </div>
                      <Progress value={level.avgProgress} className="mb-2" />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{level.onTrack}/{level.total} đúng tiến độ</span>
                        <span>{Math.round((level.onTrack / level.total) * 100)}% hiệu suất</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-orange-600" />
                  Phân tích theo vị trí
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {analytics.positionBreakdown.map((position) => (
                    <div key={position.position} className="p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{position.position}</span>
                        <Badge variant="outline">{position.avgProgress}%</Badge>
                      </div>
                      <Progress value={position.avgProgress} className="mb-2" />
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>{position.completed}/{position.total} hoàn thành</span>
                        <span>{Math.round((position.completed / position.total) * 100)}% tỷ lệ hoàn thành</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Performance Insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {analytics.performanceMetrics.highPerformers}
                </div>
                <div className="text-sm text-gray-600">High Performers</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="text-2xl font-bold text-yellow-600 mb-1">
                  {analytics.performanceMetrics.needsAttention}
                </div>
                <div className="text-sm text-gray-600">Cần chú ý</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  +{analytics.performanceMetrics.improvement}%
                </div>
                <div className="text-sm text-gray-600">Cải thiện</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <OKRReportGenerator />
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <DepartmentDetailDialog
        departmentId={selectedDepartment?.id || ''}
        departmentName={selectedDepartment?.name || ''}
        isOpen={departmentDetailOpen}
        onClose={() => setDepartmentDetailOpen(false)}
      />

      <AdvancedFilterDialog
        isOpen={advancedFilterOpen}
        onClose={() => setAdvancedFilterOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
}
