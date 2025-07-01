
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Users,
  Calendar,
  BarChart3
} from 'lucide-react';

export function OKRDashboard() {
  const okrStats = [
    {
      title: 'Tổng Objectives',
      value: '24',
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      change: '+3',
      changeType: 'increase'
    },
    {
      title: 'Đang thực hiện',
      value: '18',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      change: '+2',
      changeType: 'increase'
    },
    {
      title: 'Hoàn thành',
      value: '12',
      icon: CheckCircle,
      color: 'from-purple-500 to-purple-600',
      change: '+5',
      changeType: 'increase'
    },
    {
      title: 'Cần chú ý',
      value: '3',
      icon: AlertCircle,
      color: 'from-orange-500 to-orange-600',
      change: '-1',
      changeType: 'decrease'
    }
  ];

  const departmentProgress = [
    { department: 'Phòng Kinh Doanh', progress: 75, objectives: 8 },
    { department: 'Phòng Kỹ Thuật', progress: 82, objectives: 12 },
    { department: 'Phòng Nhân Sự', progress: 68, objectives: 4 },
    { department: 'Phòng Marketing', progress: 90, objectives: 6 }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
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

      {/* Progress Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Tiến độ OKR theo phòng ban
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentProgress.map((dept, index) => (
                <div key={index} className="flex items-center space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900">{dept.department}</h3>
                      <span className="text-sm text-gray-600">{dept.objectives} OKR</span>
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
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Chu kỳ hiện tại
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-2xl font-bold">Q1</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Quý 1 - 2024</h3>
              <p className="text-gray-600">01/01 - 31/03/2024</p>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Tổng tiến độ</span>
                <span className="font-semibold text-green-600">76%</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-sm text-gray-600">Thời gian còn lại</span>
                <span className="font-semibold text-orange-600">32 ngày</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-600">Objectives hoàn thành</span>
                <span className="font-semibold text-blue-600">12/24</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
