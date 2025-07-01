
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Users,
  Calendar,
  BarChart3,
  Award,
  Star,
  Trophy,
  Flame,
  Zap
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { OKRMini } from './OKRMini';
import { OKRQuickActions } from './OKRQuickActions';

export function OKRDashboard() {
  const { profile } = useAuth();
  
  // Mock data - sẽ thay thế bằng API call
  const isManager = true; // Tạm thời set true
  
  const okrStats = [
    {
      title: 'Tổng Objectives',
      value: '8',
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      change: '+2',
      changeType: 'increase'
    },
    {
      title: 'Đang thực hiện',
      value: '6',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      change: '+1',
      changeType: 'increase'
    },
    {
      title: 'Hoàn thành',
      value: '5',
      icon: CheckCircle,
      color: 'from-purple-500 to-purple-600',
      change: '+2',
      changeType: 'increase'
    },
    {
      title: 'Huy hiệu đạt được',
      value: '12',
      icon: Award,
      color: 'from-yellow-500 to-yellow-600',
      change: '+3',
      changeType: 'increase'
    }
  ];

  const managerStats = [
    {
      title: 'Tổng Objectives toàn công ty',
      value: '45',
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      change: '+8',
      changeType: 'increase'
    },
    {
      title: 'Đang thực hiện',
      value: '32',
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
      change: '+7',
      changeType: 'increase'
    },
    {
      title: 'Cần chú ý',
      value: '3',
      icon: AlertCircle,
      color: 'from-orange-500 to-orange-600',
      change: '-2',
      changeType: 'decrease'
    }
  ];

  // Câu nói khích lệ
  const motivationalQuotes = [
    "🎯 Mỗi mục tiêu đạt được là một bước tiến lớn!",
    "⭐ Thành công không phải là điểm đến, mà là hành trình!",
    "🚀 Hôm nay bạn đã làm gì để gần hơn với mục tiêu?",
    "💪 Kiên trì và nỗ lực sẽ mang lại kết quả tuyệt vời!",
    "🔥 Bạn đang trên đường chinh phục những đỉnh cao mới!"
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const stats = isManager ? managerStats : okrStats;

  return (
    <div className="space-y-6">
      {/* Motivational Banner */}
      <Card className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">
                Chào {profile?.full_name || 'bạn'}! 👋
              </h2>
              <p className="text-indigo-100 text-lg">{randomQuote}</p>
            </div>
            <div className="text-right">
              <Flame className="h-16 w-16 text-yellow-300 animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
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

      {/* OKR Mini - Achievement & Leaderboard */}
      <OKRMini />

      {/* Quick Actions & Activities */}
      <OKRQuickActions />

      {/* Current Cycle Info */}
      <Card className="shadow-md border-0">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Chu kỳ hiện tại
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <span className="text-white text-2xl font-bold">Q1</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Quý 1 - 2024</h3>
            <p className="text-gray-600">01/01 - 31/03/2024</p>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 px-4 bg-green-50 rounded-lg border border-green-200">
              <span className="text-sm font-medium text-gray-700">Tổng tiến độ</span>
              <div className="flex items-center space-x-2">
                <Progress value={76} className="w-20 h-2" />
                <span className="font-semibold text-green-600">76%</span>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 px-4 bg-orange-50 rounded-lg border border-orange-200">
              <span className="text-sm font-medium text-gray-700">Thời gian còn lại</span>
              <span className="font-semibold text-orange-600">12 ngày</span>
            </div>
            <div className="flex items-center justify-between py-3 px-4 bg-blue-50 rounded-lg border border-blue-200">
              <span className="text-sm font-medium text-gray-700">Objectives hoàn thành</span>
              <span className="font-semibold text-blue-600">5/8</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manager-specific sections */}
      {isManager && (
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Tổng quan OKR theo phòng ban
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { dept: 'Kinh Doanh', progress: 85, objectives: 12, color: 'from-blue-500 to-blue-600' },
                { dept: 'Kỹ Thuật', progress: 72, objectives: 15, color: 'from-green-500 to-green-600' },
                { dept: 'Marketing', progress: 90, objectives: 8, color: 'from-purple-500 to-purple-600' },
                { dept: 'Nhân Sự', progress: 78, objectives: 6, color: 'from-orange-500 to-orange-600' }
              ].map((dept, index) => (
                <div key={index} className="p-4 bg-gradient-to-br from-gray-50 to-white rounded-lg border hover:shadow-md transition-shadow">
                  <div className={`w-12 h-12 bg-gradient-to-br ${dept.color} rounded-lg flex items-center justify-center mb-3`}>
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{dept.dept}</h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tiến độ</span>
                      <span className="text-sm font-medium text-green-600">{dept.progress}%</span>
                    </div>
                    <Progress value={dept.progress} className="h-2" />
                    <p className="text-xs text-gray-500">{dept.objectives} OKR đang thực hiện</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
