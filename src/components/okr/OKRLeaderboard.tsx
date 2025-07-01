
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Medal, 
  Award, 
  Star, 
  Crown, 
  Users,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Zap,
  Target,
  Flame
} from 'lucide-react';

export function OKRLeaderboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  // Mock data - sẽ thay thế bằng API call
  const leaderboardData = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      department: 'Kinh Doanh',
      position: 'Senior Manager',
      okrs_completed: 12,
      success_rate: 95,
      total_score: 1250,
      badges: ['Vượt mục tiêu', 'Người tiên phong'],
      current_streak: 8,
      level: 'Chuyên gia',
      trend: 'up'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      department: 'Kỹ Thuật',
      position: 'Tech Lead',
      okrs_completed: 10,
      success_rate: 92,
      total_score: 1180,
      badges: ['Chuyên gia OKR'],
      current_streak: 6,
      level: 'Chuyên gia',
      trend: 'up'
    },
    {
      id: 3,
      name: 'Lê Văn C',
      department: 'Marketing',
      position: 'Marketing Manager',
      okrs_completed: 8,
      success_rate: 88,
      total_score: 1050,
      badges: ['Hoàn thành mục tiêu'],
      current_streak: 5,
      level: 'Thành thạo',
      trend: 'down'
    },
    {
      id: 4,
      name: 'Phạm Thị D',
      department: 'Nhân Sự',
      position: 'HR Manager',
      okrs_completed: 7,
      success_rate: 85,
      total_score: 980,
      badges: ['Đóng góp tích cực'],
      current_streak: 4,
      level: 'Thành thạo',
      trend: 'up'
    },
    {
      id: 5,
      name: 'Hoàng Văn E',
      department: 'Kỹ Thuật',
      position: 'Developer',
      okrs_completed: 6,
      success_rate: 82,
      total_score: 890,
      badges: ['Hoàn thành mục tiêu'],
      current_streak: 3,
      level: 'Cơ bản',
      trend: 'up'
    }
  ];

  const departmentStats = [
    { name: 'Kinh Doanh', avg_score: 1125, members: 12, top_performer: 'Nguyễn Văn A', color: 'from-blue-500 to-cyan-500' },
    { name: 'Kỹ Thuật', avg_score: 1035, members: 18, top_performer: 'Trần Thị B', color: 'from-emerald-500 to-teal-500' },
    { name: 'Marketing', avg_score: 950, members: 8, top_performer: 'Lê Văn C', color: 'from-purple-500 to-pink-500' },
    { name: 'Nhân Sự', avg_score: 880, members: 6, top_performer: 'Phạm Thị D', color: 'from-orange-500 to-red-500' }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-6 w-6 text-yellow-400 drop-shadow-lg" />;
      case 2: return <Medal className="h-6 w-6 text-slate-400 drop-shadow-lg" />;
      case 3: return <Award className="h-6 w-6 text-amber-600 drop-shadow-lg" />;
      default: return (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white text-sm font-bold shadow-lg">
          #{rank}
        </div>
      );
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Chuyên gia': 
        return (
          <Badge className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0 shadow-lg">
            <Sparkles className="h-3 w-3 mr-1" />
            {level}
          </Badge>
        );
      case 'Thành thạo': 
        return (
          <Badge className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white border-0 shadow-lg">
            <Target className="h-3 w-3 mr-1" />
            {level}
          </Badge>
        );
      case 'Cơ bản': 
        return (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 shadow-lg">
            <Zap className="h-3 w-3 mr-1" />
            {level}
          </Badge>
        );
      default: 
        return (
          <Badge className="bg-gradient-to-r from-gray-500 to-slate-600 text-white border-0 shadow-lg">
            {level}
          </Badge>
        );
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <ChevronUp className="h-5 w-5 text-emerald-500 drop-shadow-sm" />
    ) : (
      <ChevronDown className="h-5 w-5 text-red-500 drop-shadow-sm" />
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Hero Header */}
        <div className="relative overflow-hidden">
          <Card className="border-0 shadow-2xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
            <CardContent className="p-0">
              {/* Animated background elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-20 -right-20 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-bounce"></div>
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-bounce delay-500"></div>
              </div>
              
              <div className="relative p-12 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-xl">
                        <Trophy className="h-8 w-8 text-yellow-300" />
                      </div>
                      <div>
                        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent">
                          Bảng Xếp Hạng OKR
                        </h1>
                        <p className="text-white/80 text-lg">
                          Vinh danh những người xuất sắc nhất
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 text-white/90">
                      <div className="flex items-center gap-2">
                        <Users className="h-5 w-5" />
                        <span className="font-medium">{leaderboardData.length} Thành viên tham gia</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Flame className="h-5 w-5 text-orange-300" />
                        <span className="font-medium">Cạnh tranh khốc liệt</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl mb-4 animate-pulse">
                      <span className="text-white text-2xl font-bold">#1</span>
                    </div>
                    <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm">
                      Q1 2024
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="w-full">
          <TabsList className="grid w-full grid-cols-3 p-1 bg-white/60 backdrop-blur-sm border-0 shadow-lg">
            <TabsTrigger 
              value="current" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-indigo-600 font-medium"
            >
              Chu kỳ hiện tại
            </TabsTrigger>
            <TabsTrigger 
              value="individual" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-indigo-600 font-medium"
            >
              Cá nhân
            </TabsTrigger>
            <TabsTrigger 
              value="department" 
              className="data-[state=active]:bg-white data-[state=active]:shadow-lg data-[state=active]:text-indigo-600 font-medium"
            >
              Phòng ban
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="mt-8">
            <div className="space-y-6">
              {leaderboardData.map((person, index) => {
                const rank = index + 1;
                return (
                  <Card 
                    key={person.id} 
                    className={`group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 border-0 ${
                      rank <= 3 
                        ? 'bg-gradient-to-r from-amber-50 via-yellow-50 to-orange-50 shadow-xl border-2 border-yellow-200/50' 
                        : 'bg-white/80 backdrop-blur-sm shadow-lg hover:bg-white'
                    }`}
                  >
                    <CardContent className="p-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          {/* Rank Badge */}
                          <div className="flex items-center justify-center">
                            {getRankIcon(rank)}
                          </div>

                          {/* Avatar & Info */}
                          <div className="flex items-center gap-6">
                            <div className="relative">
                              <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                                <span className="text-white font-bold text-xl">
                                  {person.name.charAt(0)}
                                </span>
                              </div>
                              {rank <= 3 && (
                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                                  <Sparkles className="h-3 w-3 text-white" />
                                </div>
                              )}
                            </div>
                            
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-bold text-xl text-gray-900">{person.name}</h3>
                                {getTrendIcon(person.trend)}
                              </div>
                              <p className="text-gray-600 mb-3">{person.position} • {person.department}</p>
                              <div className="flex items-center gap-3">
                                {getLevelBadge(person.level)}
                                <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
                                  <Flame className="h-3 w-3 mr-1" />
                                  Streak: {person.current_streak}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-8">
                          <div className="text-center">
                            <div className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-1">
                              {person.total_score.toLocaleString()}
                            </div>
                            <div className="text-sm text-gray-500 font-medium">Điểm số</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1">
                              {person.success_rate}%
                            </div>
                            <div className="text-sm text-gray-500 font-medium">Thành công</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-1">
                              {person.okrs_completed}
                            </div>
                            <div className="text-sm text-gray-500 font-medium">OKR</div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="individual" className="mt-8">
            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {leaderboardData.slice(0, 3).map((person, index) => {
                const rank = index + 1;
                return (
                  <Card 
                    key={person.id} 
                    className={`text-center border-0 shadow-2xl transition-all duration-300 hover:scale-105 ${
                      rank === 1 
                        ? 'bg-gradient-to-br from-yellow-100 via-amber-50 to-orange-100' 
                        : 'bg-white/90 backdrop-blur-sm'
                    }`}
                  >
                    <CardContent className="p-8">
                      <div className="relative mb-6">
                        <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto shadow-2xl">
                          <span className="text-white font-bold text-2xl">
                            {person.name.charAt(0)}
                          </span>
                        </div>
                        <div className="absolute -top-3 -right-3">
                          {getRankIcon(rank)}
                        </div>
                        {rank === 1 && (
                          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                            <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center animate-pulse">
                              <Crown className="h-4 w-4 text-white" />
                            </div>
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-xl mb-2">{person.name}</h3>
                      <p className="text-gray-600 mb-4">{person.department}</p>
                      <div className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
                        {person.total_score.toLocaleString()}
                      </div>
                      {getLevelBadge(person.level)}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="department" className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {departmentStats.map((dept, index) => (
                <Card key={dept.name} className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className={`w-16 h-16 bg-gradient-to-r ${dept.color} rounded-2xl flex items-center justify-center shadow-xl`}>
                        <Users className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-2xl text-gray-900">{dept.name}</h3>
                        <p className="text-gray-600">{dept.members} thành viên</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Điểm trung bình</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          {dept.avg_score.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 font-medium">Người xuất sắc nhất</span>
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
                          <Star className="h-3 w-3 mr-1" />
                          {dept.top_performer}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
