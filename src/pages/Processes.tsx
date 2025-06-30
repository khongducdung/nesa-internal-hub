
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  GitBranch, 
  Plus, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  MoreHorizontal,
  Users,
  Calendar,
  Target,
  Activity
} from 'lucide-react';

export default function Processes() {
  const [activeTab, setActiveTab] = useState('templates');

  // Mock data cho process templates
  const processTemplates = [
    {
      id: '1',
      name: 'Quy trình tuyển dụng nhân viên mới',
      description: 'Quy trình tuyển dụng từ đăng tin đến onboarding',
      category: 'Nhân sự',
      steps: 6,
      estimated_duration: 10080, // phút
      priority: 'high',
      is_active: true,
      created_at: '2024-01-10'
    },
    {
      id: '2',
      name: 'Quy trình xử lý nghỉ phép',
      description: 'Quy trình xử lý đơn xin nghỉ phép của nhân viên',
      category: 'Hành chính',
      steps: 4,
      estimated_duration: 1440, // phút
      priority: 'medium',
      is_active: true,
      created_at: '2024-01-08'
    },
    {
      id: '3',
      name: 'Quy trình mua sắm tài sản',
      description: 'Quy trình mua sắm tài sản cho công ty',
      category: 'Tài chính',
      steps: 5,
      estimated_duration: 4320, // phút
      priority: 'medium',
      is_active: true,
      created_at: '2024-01-05'
    }
  ];

  // Mock data cho process instances
  const processInstances = [
    {
      id: '1',
      name: 'Tuyển dụng Frontend Developer',
      process_template: 'Quy trình tuyển dụng nhân viên mới',
      assigned_user: 'Trần Thị Bình',
      department: 'Phòng Nhân Sự',
      current_step: 3,
      total_steps: 6,
      status: 'in_progress',
      priority: 'high',
      due_date: '2024-01-25',
      progress: 50,
      created_at: '2024-01-15'
    },
    {
      id: '2',
      name: 'Xử lý nghỉ phép - Nguyễn Văn An',
      process_template: 'Quy trình xử lý nghỉ phép',
      assigned_user: 'Lê Văn Manager',
      department: 'Phòng Kỹ Thuật',
      current_step: 2,
      total_steps: 4,
      status: 'pending',
      priority: 'medium',
      due_date: '2024-01-20',
      progress: 50,
      created_at: '2024-01-18'
    },
    {
      id: '3',
      name: 'Mua máy tính cho phòng IT',
      process_template: 'Quy trình mua sắm tài sản',
      assigned_user: 'Nguyễn Thị Kế toán',
      department: 'Phòng Kế Toán',
      current_step: 5,
      total_steps: 5,
      status: 'completed',
      priority: 'low',
      due_date: '2024-01-22',
      progress: 100,
      created_at: '2024-01-12'
    }
  ];

  const processStats = [
    {
      title: 'Tổng quy trình',
      value: '24',
      icon: GitBranch,
      color: 'from-blue-500 to-blue-600',
      change: '+3',
      changeType: 'increase'
    },
    {
      title: 'Đang thực hiện',
      value: '12',
      icon: Play,
      color: 'from-yellow-500 to-yellow-600',
      change: '+2',
      changeType: 'increase'
    },
    {
      title: 'Hoàn thành',
      value: '156',
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      change: '+8',
      changeType: 'increase'
    },
    {
      title: 'Quá hạn',
      value: '3',
      icon: AlertCircle,
      color: 'from-red-500 to-red-600',
      change: '-1',
      changeType: 'decrease'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">Đang thực hiện</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ xử lý</Badge>;
      case 'overdue':
        return <Badge className="bg-red-100 text-red-800">Quá hạn</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <Badge className="bg-red-100 text-red-800">Cao</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-100 text-yellow-800">Trung bình</Badge>;
      case 'low':
        return <Badge className="bg-green-100 text-green-800">Thấp</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const formatDuration = (minutes: number) => {
    const days = Math.floor(minutes / 1440);
    const hours = Math.floor((minutes % 1440) / 60);
    if (days > 0) {
      return `${days} ngày${hours > 0 ? ` ${hours}h` : ''}`;
    }
    return `${hours}h`;
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý quy trình</h1>
            <p className="text-gray-600 mt-1">Quản lý và theo dõi các quy trình làm việc</p>
          </div>
          <Button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Tạo quy trình mới
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {processStats.map((stat, index) => {
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

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="templates">Mẫu quy trình</TabsTrigger>
            <TabsTrigger value="instances">Quy trình đang chạy</TabsTrigger>
          </TabsList>

          {/* Process Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <Card className="shadow-md border-0">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-900">Mẫu quy trình</CardTitle>
                  <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input placeholder="Tìm kiếm quy trình..." className="pl-10 w-64" />
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
                  {processTemplates.map((template) => (
                    <div key={template.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{template.name}</h3>
                            <Badge variant="outline" className="text-xs">
                              {template.category}
                            </Badge>
                            {getPriorityBadge(template.priority)}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Target className="h-4 w-4" />
                              <span>{template.steps} bước</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Clock className="h-4 w-4" />
                              <span>Ước tính: {formatDuration(template.estimated_duration)}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>Tạo: {new Date(template.created_at).toLocaleDateString('vi-VN')}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Play className="h-4 w-4 mr-2" />
                            Chạy quy trình
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Process Instances Tab */}
          <TabsContent value="instances" className="space-y-6">
            <Card className="shadow-md border-0">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-900">Quy trình đang chạy</CardTitle>
                  <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input placeholder="Tìm kiếm quy trình..." className="pl-10 w-64" />
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
                  {processInstances.map((instance) => (
                    <div key={instance.id} className="border rounded-lg p-6 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold text-gray-900">{instance.name}</h3>
                            {getPriorityBadge(instance.priority)}
                            {getStatusBadge(instance.status)}
                          </div>
                          <p className="text-sm text-gray-600 mb-3">Mẫu: {instance.process_template}</p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500 mb-4">
                            <div className="flex items-center space-x-1">
                              <Users className="h-4 w-4" />
                              <span>{instance.assigned_user}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Activity className="h-4 w-4" />
                              <span>{instance.department}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>Hạn: {new Date(instance.due_date).toLocaleDateString('vi-VN')}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-600">
                                Tiến độ: Bước {instance.current_step}/{instance.total_steps}
                              </span>
                              <span className="font-medium text-gray-900">{instance.progress}%</span>
                            </div>
                            <Progress value={instance.progress} className="h-2" />
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          {instance.status === 'in_progress' && (
                            <Button variant="outline" size="sm">
                              <Pause className="h-4 w-4 mr-2" />
                              Tạm dừng
                            </Button>
                          )}
                          {instance.status === 'pending' && (
                            <Button variant="outline" size="sm">
                              <Play className="h-4 w-4 mr-2" />
                              Tiếp tục
                            </Button>
                          )}
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
