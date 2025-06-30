
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  Plus, 
  Search, 
  Filter,
  Calendar,
  Star,
  Target,
  Award,
  Users,
  Clock,
  FileText,
  MoreHorizontal
} from 'lucide-react';

export default function Performance() {
  const performanceData = [
    {
      id: 1,
      employee: 'Nguyễn Văn A',
      reviewer: 'Trần Thị Manager',
      period: 'Q4 2023',
      overallScore: 4.2,
      status: 'completed',
      reviewDate: '2024-01-15',
      department: 'Phòng Kỹ Thuật',
      avatar: 'A'
    },
    {
      id: 2,
      employee: 'Trần Thị B',
      reviewer: 'Lê Văn Director',
      period: 'Q4 2023',
      overallScore: 4.5,
      status: 'completed',
      reviewDate: '2024-01-10',
      department: 'Phòng Nhân Sự',
      avatar: 'B'
    },
    {
      id: 3,
      employee: 'Lê Văn C',
      reviewer: 'Nguyễn Thị Lead',
      period: 'Q4 2023',
      overallScore: 3.8,
      status: 'in_progress',
      reviewDate: '2024-01-20',
      department: 'Phòng Kinh Doanh',
      avatar: 'C'
    }
  ];

  const performanceStats = [
    {
      title: 'Tổng đánh giá',
      value: '156',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      change: '+12%',
      changeType: 'increase'
    },
    {
      title: 'Điểm trung bình',
      value: '4.1',
      icon: Star,
      color: 'from-yellow-500 to-yellow-600',
      change: '+0.3',
      changeType: 'increase'
    },
    {
      title: 'Hoàn thành',
      value: '124',
      icon: Award,
      color: 'from-green-500 to-green-600',
      change: '+8%',
      changeType: 'increase'
    },
    {
      title: 'Đang thực hiện',
      value: '32',
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      change: '+15%',
      changeType: 'increase'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>;
      case 'in_progress':
        return <Badge className="bg-orange-100 text-orange-800">Đang thực hiện</Badge>;
      case 'draft':
        return <Badge className="bg-gray-100 text-gray-800">Bản nháp</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return 'text-green-600';
    if (score >= 4.0) return 'text-blue-600';
    if (score >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Đánh giá hiệu suất</h1>
            <p className="text-gray-600 mt-1">Quản lý và theo dõi đánh giá hiệu suất nhân viên</p>
          </div>
          <Button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Tạo đánh giá mới
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {performanceStats.map((stat, index) => {
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
                      <p className="text-sm text-green-600 font-medium flex items-center">
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

        {/* Performance Overview Chart */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Xu hướng điểm số</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                <div className="text-center">
                  <TrendingUp className="h-12 w-12 text-blue-500 mx-auto mb-3" />
                  <p className="text-gray-600">Biểu đồ xu hướng điểm số theo thời gian</p>
                  <p className="text-sm text-gray-500 mt-1">Sẽ được triển khai với Recharts</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Phân bố điểm số</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { range: '4.5 - 5.0', count: 45, percentage: 29, color: 'bg-green-500' },
                  { range: '4.0 - 4.4', count: 62, percentage: 40, color: 'bg-blue-500' },
                  { range: '3.5 - 3.9', count: 38, percentage: 24, color: 'bg-yellow-500' },
                  { range: '< 3.5', count: 11, percentage: 7, color: 'bg-red-500' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-16 text-sm font-medium text-gray-700">{item.range}</div>
                    <div className="flex-1 bg-gray-200 rounded-full h-3">
                      <div 
                        className={`${item.color} h-3 rounded-full transition-all duration-300`}
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                    <div className="w-12 text-sm text-gray-600">{item.count}</div>
                    <div className="w-12 text-sm text-gray-500">{item.percentage}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance Reviews List */}
        <Card className="shadow-md border-0">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900">Danh sách đánh giá</CardTitle>
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input placeholder="Tìm kiếm đánh giá..." className="pl-10 w-64" />
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
              {performanceData.map((review) => (
                <div key={review.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{review.avatar}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{review.employee}</h3>
                        <Badge variant="outline" className="text-xs">
                          {review.period}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">Được đánh giá bởi: {review.reviewer}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3" />
                          <span>{review.department}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(review.reviewDate).toLocaleDateString('vi-VN')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="flex items-center space-x-1 mb-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className={`font-bold text-lg ${getScoreColor(review.overallScore)}`}>
                          {review.overallScore}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500">Điểm tổng</p>
                    </div>
                    {getStatusBadge(review.status)}
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
