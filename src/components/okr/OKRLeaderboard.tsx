
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
  ChevronDown
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
    { name: 'Kinh Doanh', avg_score: 1125, members: 12, top_performer: 'Nguyễn Văn A', color: 'bg-blue-500' },
    { name: 'Kỹ Thuật', avg_score: 1035, members: 18, top_performer: 'Trần Thị B', color: 'bg-green-500' },
    { name: 'Marketing', avg_score: 950, members: 8, top_performer: 'Lê Văn C', color: 'bg-purple-500' },
    { name: 'Nhân Sự', avg_score: 880, members: 6, top_performer: 'Phạm Thị D', color: 'bg-orange-500' }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Award className="h-5 w-5 text-orange-500" />;
      default: return <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">#{rank}</div>;
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Chuyên gia': return 'bg-purple-100 text-purple-700';
      case 'Thành thạo': return 'bg-blue-100 text-blue-700';
      case 'Cơ bản': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getTrendIcon = (trend: string) => {
    return trend === 'up' ? (
      <ChevronUp className="h-4 w-4 text-green-500" />
    ) : (
      <ChevronDown className="h-4 w-4 text-red-500" />
    );
  };

  return (
    <div className="space-y-8">
      {/* Header with blue gradient and decorative circles */}
      <Card className="border-0 shadow-xl overflow-hidden relative bg-gradient-to-r from-[#2563EB] via-blue-600 to-blue-700">
        <CardContent className="p-0">
          {/* Decorative circles */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute top-10 -right-10 w-20 h-20 bg-white/5 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-white/5 rounded-full"></div>
          
          <div className="relative p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <Trophy className="h-6 w-6 text-yellow-300" />
                  Bảng Xếp Hạng OKR
                </h2>
                <p className="text-blue-100">
                  Thành tích và xếp hạng của toàn bộ thành viên trong công ty
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold mb-1">{leaderboardData.length}</div>
                <p className="text-blue-100 text-sm">Thành viên</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="w-full">
        <TabsList variant="secondary" className="grid w-full grid-cols-3">
          <TabsTrigger variant="secondary" value="current">Chu kỳ hiện tại</TabsTrigger>
          <TabsTrigger variant="secondary" value="individual">Cá nhân</TabsTrigger>
          <TabsTrigger variant="secondary" value="department">Phòng ban</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="mt-6">
          <div className="space-y-4">
            {leaderboardData.map((person, index) => {
              const rank = index + 1;
              return (
                <Card key={person.id} className={`transition-all duration-200 hover:shadow-lg border-0 shadow-md ${
                  rank <= 3 ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200' : 'bg-white'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {/* Rank */}
                        <div className="flex items-center justify-center w-8 h-8">
                          {getRankIcon(rank)}
                        </div>

                        {/* Avatar & Info */}
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                            <span className="text-white font-semibold text-lg">
                              {person.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold text-gray-900">{person.name}</h3>
                              {getTrendIcon(person.trend)}
                            </div>
                            <p className="text-sm text-gray-600">{person.position} - {person.department}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Badge className={`${getLevelColor(person.level)} text-xs`}>
                                {person.level}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                Streak: {person.current_streak}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-8">
                        <div className="text-center">
                          <div className="text-xl font-bold text-purple-600">{person.total_score}</div>
                          <div className="text-xs text-gray-500">Điểm</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-green-600">{person.success_rate}%</div>
                          <div className="text-xs text-gray-500">Thành công</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xl font-bold text-blue-600">{person.okrs_completed}</div>
                          <div className="text-xs text-gray-500">OKR</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="individual" className="mt-6">
          {/* Top 3 Podium */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {leaderboardData.slice(0, 3).map((person, index) => {
              const rank = index + 1;
              return (
                <Card key={person.id} className={`text-center border-0 shadow-lg ${
                  rank === 1 ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-300' : 'bg-white'
                }`}>
                  <CardContent className="p-6">
                    <div className="relative mb-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
                        <span className="text-white font-bold text-xl">
                          {person.name.charAt(0)}
                        </span>
                      </div>
                      <div className="absolute -top-2 -right-2">
                        {getRankIcon(rank)}
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-1">{person.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{person.department}</p>
                    <div className="text-2xl font-bold text-purple-600 mb-2">{person.total_score}</div>
                    <Badge className={getLevelColor(person.level)}>
                      {person.level}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="department" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departmentStats.map((dept, index) => (
              <Card key={dept.name} className="bg-white border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`w-12 h-12 ${dept.color} rounded-lg flex items-center justify-center shadow-md`}>
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{dept.name}</h3>
                      <p className="text-sm text-gray-600">{dept.members} thành viên</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Điểm trung bình</span>
                      <span className="text-lg font-bold text-purple-600">{dept.avg_score}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Thành viên xuất sắc</span>
                      <Badge className="bg-yellow-100 text-yellow-700">
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
  );
}
