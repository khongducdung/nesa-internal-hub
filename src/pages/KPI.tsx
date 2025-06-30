
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BarChart3, 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  TrendingDown,
  Target,
  Calendar,
  Users,
  Award,
  AlertTriangle,
  MoreHorizontal
} from 'lucide-react';

export default function KPI() {
  const kpiData = [
    {
      id: 1,
      name: 'Doanh thu tháng',
      employee: 'Nguyễn Văn A',
      currentValue: 850000000,
      targetValue: 1000000000,
      unit: 'VND',
      period: 'Tháng 1/2024',
      status: 'on_track',
      trend: 'up',
      percentage: 85,
      department: 'Phòng Kinh Doanh',
      avatar: 'A'
    },
    {
      id: 2,
      name: 'Số lượng bug fix',
      employee: 'Trần Thị B',
      currentValue: 45,
      targetValue: 50,
      unit: 'bugs',
      period: 'Tháng 1/2024',
      status: 'excellent',
      trend: 'up',
      percentage: 90,
      department: 'Phòng Kỹ Thuật',
      avatar: 'B'
    },
    {
      id: 3,
      name: 'Thời gian phản hồi khách hàng',
      employee: 'Lê Văn C',
      currentValue: 4.2,
      targetValue: 2.0,
      unit: 'giờ',
      period: 'Tháng 1/2024',
      status: 'needs_attention',
      trend: 'down',
      percentage: 48,
      department: 'Phòng Dịch Vụ',
      avatar: 'C'
    }
  ];

  const kpiStats = [
    {
      title: 'Tổng KPI',
      value: '89',
      icon: BarChart3,
      color: 'from-blue-500 to-blue-600',
      change: '+7',
      changeType: 'increase'
    },
    {
      title: 'Đạt mục tiêu',
      value: '67',
      icon: Target,
      color: 'from-green-500 to-green-600',
      change: '+12',
      changeType: 'increase'
    },
    {
      title: 'Xuất sắc',
      value: '23',
      icon: Award,
      color: 'from-purple-500 to-purple-600',
      change: '+5',
      changeType: 'increase'
    },
    {
      title: 'Cần cải thiện',
      value: '12',
      icon: AlertTriangle,
      color: 'from-orange-500 to-orange-600',
      change: '-3',
      changeType: 'decrease'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'excellent':
        return <Badge className="bg-green-100 text-green-800">Xuất sắc</Badge>;
      case 'on_track':
        return <Badge className="bg-blue-100 text-blue-800">Đạt mục tiêu</Badge>;
      case 'needs_attention':
        return <Badge className="bg-orange-100 text-orange-800">Cần cải thiện</Badge>;
      case 'critical':
        return <Badge className="bg-red-100 text-red-800">Cần chú ý</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const formatValue = (value: number, unit: string) => {
    if (unit === 'VND') {
      return new Intl.NumberFormat('vi-VN', { 
        style: 'currency', 
        currency: 'VND',
        minimumFractionDigits: 0 
      }).format(value);
    }
    return `${value.toLocaleString('vi-VN')} ${unit}`;
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-500';
    if (percentage >= 70) return 'bg-blue-500';
    if (percentage >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">KPI (Key Performance Indicators)</h1>
            <p className="text-gray-600 mt-1">Theo dõi và quản lý các chỉ số hiệu suất chính</p>
          </div>
          <Button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Tạo KPI mới
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpiStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mb-1">
                        {stat.value}
                      </p>
                      <p className={`text-sm font-medium flex items-center ${
                        stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.change} so với tháng trước
                      </p>
                    </div>
                    <div className={`bg-gradient-to-br ${stat.color} p-4 rounded-xl shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* KPI Performance Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Hiệu suất KPI theo phòng ban</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { department: 'Phòng Kinh Doanh', achievement: 85, kpiCount: 15, color: 'from-blue-500 to-blue-600' },
                  { department: 'Phòng Kỹ Thuật', achievement: 78, kpiCount: 22, color: 'from-green-500 to-green-600' },
                  { department: 'Phòng Nhân Sự', achievement: 92, kpiCount: 12, color: 'from-purple-500 to-purple-600' },
                  { department: 'Phòng Dịch Vụ', achievement: 67, kpiCount: 18, color: 'from-orange-500 to-orange-600' }
                ].map((dept, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`w-12 h-12 bg-gradient-to-br ${dept.color} rounded-lg flex items-center justify-center`}>
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{dept.department}</h3>
                        <span className="text-sm text-gray-600">{dept.kpiCount} KPI</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Progress value={dept.achievement} className="flex-1 h-2" />
                        <span className="text-sm font-medium text-gray-700 min-w-[3rem]">{dept.achievement}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Xu hướng KPI</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                  <p className="text-gray-600">Biểu đồ xu hướng KPI theo thời gian</p>
                  <p className="text-sm text-gray-500 mt-1">Sẽ được triển khai với Recharts</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* KPI List */}
        <Card className="shadow-md border-0">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900">Danh sách KPI</CardTitle>
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input placeholder="Tìm kiếm KPI..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Lọc
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {kpiData.map((kpi) => (
                <div key={kpi.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{kpi.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{kpi.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {kpi.period}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">Phụ trách: {kpi.employee}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{kpi.department}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          {kpi.trend === 'up' ? (
                            <TrendingUp className="h-3 w-3 text-green-500" />
                          ) : (
                            <TrendingDown className="h-3 w-3 text-red-500" />
                          )}
                          <span className={kpi.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                            {kpi.trend === 'up' ? 'Tăng' : 'Giảm'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-sm text-gray-600 mb-1">Hiện tại / Mục tiêu</p>
                      <p className="font-semibold text-gray-900">
                        {formatValue(kpi.currentValue, kpi.unit)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatValue(kpi.targetValue, kpi.unit)}
                      </p>
                    </div>
                    
                    <div className="text-center min-w-[100px]">
                      <div className="flex items-center justify-center space-x-2 mb-2">
                        <span className={`font-bold text-lg ${
                          kpi.percentage >= 90 ? 'text-green-600' :
                          kpi.percentage >= 70 ? 'text-blue-600' :
                          kpi.percentage >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {kpi.percentage}%
                        </span>
                      </div>
                      <Progress value={kpi.percentage} className="w-20 h-2 mb-2" />
                      {getStatusBadge(kpi.status)}
                    </div>
                    
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
