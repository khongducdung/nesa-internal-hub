
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  MoreHorizontal
} from 'lucide-react';

export default function OKR() {
  const okrData = [
    {
      id: 1,
      title: 'Tăng trưởng doanh thu',
      employee: 'Nguyễn Văn A',
      quarter: 'Q1 2024',
      year: 2024,
      progress: 75,
      status: 'on_track',
      keyResults: [
        { title: 'Tăng 20% doanh thu so với Q4', progress: 80, target: '20%', current: '16%' },
        { title: 'Thu hút 50 khách hàng mới', progress: 70, target: '50', current: '35' },
        { title: 'Tăng tỷ lệ chuyển đổi lên 15%', progress: 75, target: '15%', current: '11.25%' }
      ],
      avatar: 'A',
      department: 'Phòng Kinh Doanh'
    },
    {
      id: 2,
      title: 'Cải thiện hiệu suất hệ thống',
      employee: 'Trần Thị B',
      quarter: 'Q1 2024',
      year: 2024,
      progress: 60,
      status: 'at_risk',
      keyResults: [
        { title: 'Giảm thời gian phản hồi xuống 200ms', progress: 50, target: '200ms', current: '350ms' },
        { title: 'Đạt 99.9% uptime', progress: 95, target: '99.9%', current: '99.8%' },
        { title: 'Triển khai 5 tính năng mới', progress: 40, target: '5', current: '2' }
      ],
      avatar: 'B',
      department: 'Phòng Kỹ Thuật'
    }
  ];

  const okrStats = [
    {
      title: 'Tổng OKR',
      value: '48',
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      change: '+6',
      changeType: 'increase'
    },
    {
      title: 'Đang theo dõi',
      value: '35',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      change: '+5',
      changeType: 'increase'
    },
    {
      title: 'Hoàn thành',
      value: '28',
      icon: CheckCircle,
      color: 'from-purple-500 to-purple-600',
      change: '+12',
      changeType: 'increase'
    },
    {
      title: 'Cần chú ý',
      value: '7',
      icon: AlertCircle,
      color: 'from-orange-500 to-orange-600',
      change: '-2',
      changeType: 'decrease'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on_track':
        return <Badge className="bg-green-100 text-green-800">Đúng tiến độ</Badge>;
      case 'at_risk':
        return <Badge className="bg-orange-100 text-orange-800">Có rủi ro</Badge>;
      case 'off_track':
        return <Badge className="bg-red-100 text-red-800">Chậm tiến độ</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Hoàn thành</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">OKR (Objectives & Key Results)</h1>
            <p className="text-gray-600 mt-1">Quản lý mục tiêu và kết quả chính của tổ chức</p>
          </div>
          <Button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Tạo OKR mới
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {okrStats.map((stat, index) => {
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
                        {stat.change} so với quý trước
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

        {/* OKR Progress Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 shadow-md border-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Tiến độ OKR theo phòng ban</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { department: 'Phòng Kinh Doanh', progress: 78, okrCount: 12, color: 'from-blue-500 to-blue-600' },
                  { department: 'Phòng Kỹ Thuật', progress: 65, okrCount: 18, color: 'from-green-500 to-green-600' },
                  { department: 'Phòng Nhân Sự', progress: 82, okrCount: 8, color: 'from-purple-500 to-purple-600' },
                  { department: 'Phòng Kế Toán', progress: 71, okrCount: 6, color: 'from-orange-500 to-orange-600' }
                ].map((dept, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className={`w-12 h-12 bg-gradient-to-br ${dept.color} rounded-lg flex items-center justify-center`}>
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{dept.department}</h3>
                        <span className="text-sm text-gray-600">{dept.okrCount} OKR</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Progress value={dept.progress} className="flex-1 h-2" />
                        <span className="text-sm font-medium text-gray-700 min-w-[3rem]">{dept.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Quý hiện tại</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-white text-2xl font-bold">Q1</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Quý 1 - 2024</h3>
                <p className="text-gray-600">01/01 - 31/03/2024</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Tổng tiến độ</span>
                  <span className="font-semibold text-blue-600">68%</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Thời gian còn lại</span>
                  <span className="font-semibold text-orange-600">45 ngày</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Cần hoàn thành</span>
                  <span className="font-semibold text-red-600">15 OKR</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* OKR List */}
        <Card className="shadow-md border-0">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900">Danh sách OKR</CardTitle>
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input placeholder="Tìm kiếm OKR..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Lọc
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {okrData.map((okr) => (
                <div key={okr.id} className="border rounded-lg p-6 hover:shadow-md transition-all duration-200">
                  {/* OKR Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">{okr.avatar}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">{okr.title}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{okr.employee}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{okr.quarter} {okr.year}</span>
                          </div>
                          <span>{okr.department}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600 mb-1">{okr.progress}%</div>
                        <Progress value={okr.progress} className="w-20 h-2" />
                      </div>
                      {getStatusBadge(okr.status)}
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Key Results */}
                  <div className="space-y-3 ml-16">
                    <h4 className="font-medium text-gray-900 mb-3">Kết quả chính:</h4>
                    {okr.keyResults.map((kr, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 mb-1">{kr.title}</p>
                          <div className="flex items-center space-x-3">
                            <Progress value={kr.progress} className="flex-1 h-2" />
                            <span className="text-sm text-gray-600 min-w-[3rem]">{kr.progress}%</span>
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          <p className="text-sm font-medium text-gray-900">{kr.current} / {kr.target}</p>
                          <div className={`w-3 h-3 rounded-full ${getProgressColor(kr.progress)} mt-1 ml-auto`} />
                        </div>
                      </div>
                    ))}
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
