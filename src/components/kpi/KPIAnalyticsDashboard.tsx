import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, TrendingDown, Target, Users, Award, AlertTriangle, Download, Filter } from 'lucide-react';
import { useKPIs, useAllKPIs, useKPICategories, useKPIFrameworks } from '@/hooks/useKPI';
import { calculateKPIProgress, getKPIProgressStatus, getPerformanceRatingColor, PERFORMANCE_RATINGS } from '@/types/kpi';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { vi } from 'date-fns/locale';

export function KPIAnalyticsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>('last-3-months');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFramework, setSelectedFramework] = useState<string>('all');

  const { data: allKPIs = [] } = useAllKPIs();
  const { data: categories = [] } = useKPICategories();
  const { data: frameworks = [] } = useKPIFrameworks();

  // Filter KPIs based on selections
  const filteredKPIs = allKPIs.filter(kpi => {
    if (selectedCategory !== 'all' && kpi.kpi_category_id !== selectedCategory) return false;
    if (selectedFramework !== 'all' && kpi.kpi_framework_id !== selectedFramework) return false;
    return true;
  });

  // Calculate analytics
  const totalKPIs = filteredKPIs.length;
  const activeKPIs = filteredKPIs.filter(kpi => kpi.status === 'active').length;
  const kpisWithTargets = filteredKPIs.filter(kpi => kpi.target_value).length;
  
  // Performance distribution
  const performanceDistribution = PERFORMANCE_RATINGS.map(rating => ({
    name: rating.label,
    value: filteredKPIs.filter(kpi => {
      if (!kpi.current_value || !kpi.target_value) return false;
      const progress = calculateKPIProgress(kpi.current_value, kpi.target_value);
      return getKPIProgressStatus(progress) === rating.value;
    }).length,
    color: rating.color
  }));

  // Category performance
  const categoryPerformance = categories.map(category => {
    const categoryKPIs = filteredKPIs.filter(kpi => kpi.kpi_category_id === category.id);
    const avgProgress = categoryKPIs.length > 0 
      ? categoryKPIs.reduce((sum, kpi) => {
          if (!kpi.current_value || !kpi.target_value) return sum;
          return sum + calculateKPIProgress(kpi.current_value, kpi.target_value);
        }, 0) / categoryKPIs.length
      : 0;
    
    return {
      name: category.name,
      progress: avgProgress,
      count: categoryKPIs.length,
      color: category.color
    };
  }).filter(item => item.count > 0);

  // Trend data (mock data for demo)
  const trendData = [
    { month: 'T1', achievement: 75, target: 80 },
    { month: 'T2', achievement: 82, target: 80 },
    { month: 'T3', achievement: 78, target: 85 },
    { month: 'T4', achievement: 89, target: 85 },
    { month: 'T5', achievement: 91, target: 90 },
    { month: 'T6', achievement: 94, target: 90 },
  ];

  const averageAchievement = filteredKPIs.length > 0 
    ? filteredKPIs.reduce((sum, kpi) => {
        if (!kpi.current_value || !kpi.target_value) return sum;
        return sum + calculateKPIProgress(kpi.current_value, kpi.target_value);
      }, 0) / filteredKPIs.length
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Phân tích KPI</h2>
          <p className="text-muted-foreground">Báo cáo chi tiết và phân tích hiệu suất KPI</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Bộ lọc
          </Button>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Khoảng thời gian</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-month">Tháng trước</SelectItem>
                  <SelectItem value="last-3-months">3 tháng trước</SelectItem>
                  <SelectItem value="last-6-months">6 tháng trước</SelectItem>
                  <SelectItem value="this-year">Năm nay</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Danh mục KPI</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả danh mục</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Khung KPI</label>
              <Select value={selectedFramework} onValueChange={setSelectedFramework}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả khung</SelectItem>
                  {frameworks.map(framework => (
                    <SelectItem key={framework.id} value={framework.id}>
                      {framework.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover-lift">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng KPI</p>
                <p className="text-2xl font-bold">{totalKPIs}</p>
                <p className="text-xs text-muted-foreground">{activeKPIs} đang hoạt động</p>
              </div>
              <Target className="h-8 w-8 text-primary opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tỷ lệ đạt trung bình</p>
                <p className="text-2xl font-bold">{averageAchievement.toFixed(1)}%</p>
                <div className="flex items-center gap-1 text-xs">
                  {averageAchievement >= 80 ? (
                    <TrendingUp className="h-3 w-3 text-success" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-destructive" />
                  )}
                  <span className={averageAchievement >= 80 ? 'text-success' : 'text-destructive'}>
                    {averageAchievement >= 80 ? 'Tăng' : 'Giảm'} so với kỳ trước
                  </span>
                </div>
              </div>
              <Award className="h-8 w-8 text-success opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">KPI có mục tiêu</p>
                <p className="text-2xl font-bold">{kpisWithTargets}</p>
                <p className="text-xs text-muted-foreground">
                  {totalKPIs > 0 ? ((kpisWithTargets / totalKPIs) * 100).toFixed(1) : 0}% tổng số
                </p>
              </div>
              <Users className="h-8 w-8 text-warning opacity-75" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover-lift">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Cần chú ý</p>
                <p className="text-2xl font-bold">
                  {filteredKPIs.filter(kpi => {
                    if (!kpi.current_value || !kpi.target_value) return false;
                    const progress = calculateKPIProgress(kpi.current_value, kpi.target_value);
                    return progress < 70;
                  }).length}
                </p>
                <p className="text-xs text-muted-foreground">Dưới 70% mục tiêu</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-destructive opacity-75" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Phân bổ hiệu suất</CardTitle>
            <CardDescription>Phân loại KPI theo mức độ đạt mục tiêu</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={performanceDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {performanceDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Trend Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Xu hướng hiệu suất</CardTitle>
            <CardDescription>Theo dõi xu hướng đạt mục tiêu theo thời gian</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="achievement" 
                  stroke="#2563EB" 
                  strokeWidth={2}
                  name="Thực đạt"
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#DC2626" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Mục tiêu"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Hiệu suất theo danh mục</CardTitle>
            <CardDescription>So sánh hiệu suất giữa các danh mục KPI</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="progress" name="Tiến độ (%)">
                  {categoryPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle>KPI xuất sắc</CardTitle>
          <CardDescription>Top 10 KPI có hiệu suất cao nhất</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredKPIs
              .filter(kpi => kpi.current_value && kpi.target_value)
              .sort((a, b) => {
                const progressA = calculateKPIProgress(a.current_value!, a.target_value!);
                const progressB = calculateKPIProgress(b.current_value!, b.target_value!);
                return progressB - progressA;
              })
              .slice(0, 10)
              .map((kpi, index) => {
                const progress = calculateKPIProgress(kpi.current_value!, kpi.target_value!);
                const status = getKPIProgressStatus(progress);
                
                return (
                  <div key={kpi.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-bold text-primary">#{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium">{kpi.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {kpi.employees?.full_name} • {kpi.employees?.departments?.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="font-medium">{kpi.current_value} {kpi.unit}</p>
                        <p className="text-sm text-muted-foreground">Target: {kpi.target_value} {kpi.unit}</p>
                      </div>
                      <Badge 
                        style={{ backgroundColor: getPerformanceRatingColor(status) }}
                        className="text-white"
                      >
                        {progress.toFixed(1)}%
                      </Badge>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}