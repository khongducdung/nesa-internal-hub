
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  TrendingUp, BarChart3, Download, FileText, Calendar, Users, Target, 
  AlertTriangle, CheckCircle, Clock, Filter, Eye, PieChart, LineChart,
  Building2, User, Award, Zap, Activity
} from 'lucide-react';
import { useOKRData } from '@/hooks/useOKRData';
import { useAuth } from '@/hooks/useAuth';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart as RechartsPieChart, Cell, LineChart as RechartsLineChart, Line, Area, AreaChart } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

interface ProgressData {
  month: string;
  company: number;
  department: number;
  individual: number;
}

interface StatusData {
  name: string;
  value: number;
  color: string;
}

export function OKRProgressAndReporting() {
  const { companyOKRs, departmentOKRs, myOKRs, currentCycle, loading } = useOKRData();
  const { profile, isAdmin } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [reportType, setReportType] = useState('summary');

  // Mock progress data for charts
  const progressData: ProgressData[] = [
    { month: 'Tháng 1', company: 65, department: 70, individual: 75 },
    { month: 'Tháng 2', company: 72, department: 78, individual: 80 },
    { month: 'Tháng 3', company: 68, department: 75, individual: 82 },
    { month: 'Tháng 4', company: 78, department: 82, individual: 85 },
  ];

  // Status distribution data
  const statusData: StatusData[] = [
    { name: 'Đúng tiến độ', value: 65, color: '#22c55e' },
    { name: 'Cần chú ý', value: 25, color: '#f59e0b' },
    { name: 'Chậm tiến độ', value: 10, color: '#ef4444' },
  ];

  // Calculate metrics
  const totalOKRs = companyOKRs.length + departmentOKRs.length + myOKRs.length;
  const avgProgress = totalOKRs > 0 
    ? Math.round([...companyOKRs, ...departmentOKRs, ...myOKRs].reduce((sum, okr) => sum + okr.progress, 0) / totalOKRs) 
    : 0;
  const onTrackOKRs = [...companyOKRs, ...departmentOKRs, ...myOKRs].filter(okr => okr.progress >= 60).length;
  const completedOKRs = [...companyOKRs, ...departmentOKRs, ...myOKRs].filter(okr => okr.status === 'completed').length;

  const getStatusBadge = (progress: number) => {
    if (progress >= 80) return <Badge className="bg-blue-100 text-blue-800"><TrendingUp className="h-3 w-3 mr-1" />Vượt tiến độ</Badge>;
    if (progress >= 60) return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Đúng tiến độ</Badge>;
    if (progress >= 40) return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="h-3 w-3 mr-1" />Cần chú ý</Badge>;
    return <Badge className="bg-red-100 text-red-800"><Clock className="h-3 w-3 mr-1" />Chậm tiến độ</Badge>;
  };

  const exportReport = () => {
    console.log('Exporting report...');
    // Mock export functionality
    alert('Báo cáo đã được xuất thành công!');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Đang tải...</div>;
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
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Bộ lọc
          </Button>
          <Button onClick={exportReport} className="bg-blue-600 hover:bg-blue-700 flex items-center gap-2">
            <Download className="h-4 w-4" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng OKRs</p>
                <p className="text-2xl font-bold text-gray-900">{totalOKRs}</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12% so với tháng trước
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tiến độ trung bình</p>
                <p className="text-2xl font-bold text-green-600">{avgProgress}%</p>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +5% so với tuần trước
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đúng tiến độ</p>
                <p className="text-2xl font-bold text-blue-600">{onTrackOKRs}</p>
                <p className="text-xs text-blue-600 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  {Math.round((onTrackOKRs / totalOKRs) * 100)}% tổng OKRs
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hoàn thành</p>
                <p className="text-2xl font-bold text-orange-600">{completedOKRs}</p>
                <p className="text-xs text-orange-600 flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  {Math.round((completedOKRs / totalOKRs) * 100)}% hoàn thành
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
              <Label>Chu kỳ:</Label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-32">
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
              <Label>Cấp độ:</Label>
              <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                <SelectTrigger className="w-32">
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

            <div className="flex items-center gap-2">
              <Label>Loại báo cáo:</Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="summary">Tổng quan</SelectItem>
                  <SelectItem value="detailed">Chi tiết</SelectItem>
                  <SelectItem value="performance">Hiệu suất</SelectItem>
                  <SelectItem value="alignment">Liên kết</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5 text-blue-600" />
                  Phân bố trạng thái OKR
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: "Số lượng",
                    },
                  }}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <RechartsPieChart data={statusData} cx="50%" cy="50%" outerRadius={80}>
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </RechartsPieChart>
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </ChartContainer>
                <div className="mt-4 space-y-2">
                  {statusData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Progress Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LineChart className="h-5 w-5 text-green-600" />
                  Xu hướng tiến độ
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    company: {
                      label: "Công ty",
                      color: "#0088FE",
                    },
                    department: {
                      label: "Phòng ban", 
                      color: "#00C49F",
                    },
                    individual: {
                      label: "Cá nhân",
                      color: "#FFBB28",
                    },
                  }}
                  className="h-64"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area type="monotone" dataKey="company" stackId="1" stroke="#0088FE" fill="#0088FE" />
                      <Area type="monotone" dataKey="department" stackId="1" stroke="#00C49F" fill="#00C49F" />
                      <Area type="monotone" dataKey="individual" stackId="1" stroke="#FFBB28" fill="#FFBB28" />
                    </AreaChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          {/* Progress by Level */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-600" />
                  OKR Công ty
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {companyOKRs.map((okr) => (
                  <div key={okr.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium truncate">{okr.title}</span>
                      <span className="text-sm text-gray-600">{okr.progress}%</span>
                    </div>
                    <Progress value={okr.progress} className="h-2" />
                    <div className="flex justify-between items-center">
                      {getStatusBadge(okr.progress)}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>{okr.title}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <p className="text-sm text-gray-600">{okr.description}</p>
                            <div className="space-y-2">
                              <h4 className="font-medium">Key Results:</h4>
                              {okr.key_results.map((kr) => (
                                <div key={kr.id} className="p-3 bg-gray-50 rounded-lg">
                                  <p className="text-sm font-medium">{kr.title}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Progress value={kr.progress} className="flex-1 h-2" />
                                    <span className="text-xs text-gray-600">{kr.progress}%</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-green-600" />
                  OKR Phòng ban
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {departmentOKRs.map((okr) => (
                  <div key={okr.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium truncate">{okr.title}</span>
                      <span className="text-sm text-gray-600">{okr.progress}%</span>
                    </div>
                    <Progress value={okr.progress} className="h-2" />
                    <div className="flex justify-between items-center">
                      {getStatusBadge(okr.progress)}
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-orange-600" />
                  OKR Cá nhân
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {myOKRs.slice(0, 5).map((okr) => (
                  <div key={okr.id} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium truncate">{okr.title}</span>
                      <span className="text-sm text-gray-600">{okr.progress}%</span>
                    </div>
                    <Progress value={okr.progress} className="h-2" />
                    <div className="flex justify-between items-center">
                      {getStatusBadge(okr.progress)}
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
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
                  company: {
                    label: "Công ty",
                    color: "#8884d8",
                  },
                  department: {
                    label: "Phòng ban",
                    color: "#82ca9d",
                  },
                  individual: {
                    label: "Cá nhân", 
                    color: "#ffc658",
                  },
                }}
                className="h-80"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="company" fill="#8884d8" />
                    <Bar dataKey="department" fill="#82ca9d" />
                    <Bar dataKey="individual" fill="#ffc658" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-blue-600" />
                  Báo cáo nhanh
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Báo cáo tiến độ tuần
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Báo cáo hiệu suất tháng
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Báo cáo liên kết OKR
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Download className="h-4 w-4 mr-2" />
                  Báo cáo tổng quan quý
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-green-600" />
                  Lịch sử báo cáo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">Báo cáo Q1 2024</span>
                  <span className="text-xs text-gray-500">2 ngày trước</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">Báo cáo tuần 15</span>
                  <span className="text-xs text-gray-500">1 tuần trước</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">Báo cáo tháng 3</span>
                  <span className="text-xs text-gray-500">2 tuần trước</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
