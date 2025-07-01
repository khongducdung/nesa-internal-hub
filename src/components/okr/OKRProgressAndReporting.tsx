
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  TrendingUp, BarChart3, Download, FileText, Calendar, Users, Target, 
  AlertTriangle, CheckCircle, Clock, Filter, Eye, PieChart, LineChart,
  Building2, User, Award, Zap, Activity, Bell
} from 'lucide-react';
import { useOKRAnalytics } from '@/hooks/useOKRAnalytics';
import { useAuth } from '@/hooks/useAuth';
import { OKRReportGenerator } from './OKRReportGenerator';
import { OKRRealTimeUpdates } from './OKRRealTimeUpdates';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart as RechartsPieChart, Cell, Area, AreaChart } from 'recharts';

const COLORS = ['#22c55e', '#f59e0b', '#ef4444', '#3b82f6'];

export function OKRProgressAndReporting() {
  const { analytics, loading, period, setPeriod, level, setLevel } = useOKRAnalytics();
  const { profile, isAdmin } = useAuth();
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [alertsDialogOpen, setAlertsDialogOpen] = useState(false);

  const getStatusBadge = (progress: number) => {
    if (progress >= 100) return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Hoàn thành</Badge>;
    if (progress >= 80) return <Badge className="bg-blue-100 text-blue-800"><TrendingUp className="h-3 w-3 mr-1" />Vượt tiến độ</Badge>;
    if (progress >= 60) return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Đúng tiến độ</Badge>;
    if (progress >= 40) return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="h-3 w-3 mr-1" />Cần chú ý</Badge>;
    return <Badge className="bg-red-100 text-red-800"><Clock className="h-3 w-3 mr-1" />Chậm tiến độ</Badge>;
  };

  const exportData = (format: 'excel' | 'pdf') => {
    console.log(`Exporting data as ${format}...`);
    // Mock export functionality
    const fileName = `OKR_Data_${new Date().toISOString().split('T')[0]}.${format}`;
    
    // Create mock download
    const element = document.createElement('a');
    element.href = '#';
    element.download = fileName;
    element.click();
    
    alert(`Dữ liệu đã được xuất thành ${fileName}!`);
  };

  if (loading || !analytics) {
    return <div className="flex items-center justify-center h-64">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
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
          
          <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Tạo báo cáo
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Tạo báo cáo OKR</DialogTitle>
              </DialogHeader>
              <OKRReportGenerator />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng OKRs</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalOKRs}</p>
                <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3 w-3" />
                  +{analytics.performanceMetrics.improvement}% so với tháng trước
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tiến độ trung bình</p>
                <p className="text-2xl font-bold text-green-600">{analytics.avgProgress}%</p>
                <Progress value={analytics.avgProgress} className="mt-2 h-2" />
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đúng tiến độ</p>
                <p className="text-2xl font-bold text-blue-600">{analytics.onTrackCount}</p>
                <p className="text-xs text-blue-600 flex items-center gap-1 mt-1">
                  <CheckCircle className="h-3 w-3" />
                  {Math.round((analytics.onTrackCount / analytics.totalOKRs) * 100)}% tổng OKRs
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
                <p className="text-2xl font-bold text-orange-600">{analytics.completedCount}</p>
                <p className="text-xs text-orange-600 flex items-center gap-1 mt-1">
                  <Award className="h-3 w-3" />
                  {Math.round((analytics.completedCount / analytics.totalOKRs) * 100)}% hoàn thành
                </p>
              </div>
              <Award className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
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

            <Button variant="outline" size="sm" className="ml-auto">
              <Filter className="h-4 w-4 mr-2" />
              Bộ lọc nâng cao
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <PieChart className="h-4 w-4" />
            Tổng quan
          </TabsTrigger>
          <TabsTrigger value="progress" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Tiến độ
          </TabsTrigger>
          <TabsTrigger value="performance" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Hiệu suất
          </TabsTrigger>
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Báo cáo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Status Distribution */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-blue-600" />
                  Phân bố trạng thái OKR
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: { label: "Phần trăm" },
                  }}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <RechartsPieChart data={analytics.statusDistribution} cx="50%" cy="50%" outerRadius={80}>
                        {analytics.statusDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </RechartsPieChart>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {analytics.statusDistribution.map((item, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                      />
                      <span className="text-sm">{item.name}</span>
                      <span className="text-sm font-medium ml-auto">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Real-time Updates Preview */}
            <div className="space-y-4">
              <OKRRealTimeUpdates />
            </div>
          </div>

          {/* Progress Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LineChart className="h-5 w-5 text-green-600" />
                Xu hướng tiến độ theo thời gian
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  company: { label: "Công ty", color: "#0088FE" },
                  department: { label: "Phòng ban", color: "#00C49F" },
                  individual: { label: "Cá nhân", color: "#FFBB28" },
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analytics.progressTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area type="monotone" dataKey="company" stackId="1" stroke="#0088FE" fill="#0088FE" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="department" stackId="1" stroke="#00C49F" fill="#00C49F" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="individual" stackId="1" stroke="#FFBB28" fill="#FFBB28" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          {/* Department Performance Cards */}
          {isAdmin && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analytics.departmentBreakdown.map((dept, index) => (
                <Card key={dept.name} className="hover:shadow-lg transition-shadow">
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
                      <Button variant="ghost" size="sm" className="w-full">
                        <Eye className="h-4 w-4 mr-2" />
                        Xem chi tiết
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                So sánh hiệu suất các cấp độ
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  company: { label: "Công ty", color: "#8884d8" },
                  department: { label: "Phòng ban", color: "#82ca9d" },
                  individual: { label: "Cá nhân", color: "#ffc658" },
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.progressTrend}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="company" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="department" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="individual" fill="#ffc658" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

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
    </div>
  );
}
