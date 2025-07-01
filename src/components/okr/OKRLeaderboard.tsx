
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Trophy, 
  Medal, 
  Award, 
  Star, 
  Crown, 
  Target,
  TrendingUp,
  Users,
  Calendar,
  Filter
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
      avatar: '',
      okrs_completed: 12,
      success_rate: 95,
      total_score: 1250,
      badges: ['Vượt mục tiêu', 'Người tiên phong', 'Làm việc nhóm xuất sắc'],
      current_streak: 8,
      level: 'Chuyên gia'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      department: 'Kỹ Thuật',
      position: 'Tech Lead',
      avatar: '',
      okrs_completed: 10,
      success_rate: 92,
      total_score: 1180,
      badges: ['Chuyên gia OKR', 'Đổi mới sáng tạo'],
      current_streak: 6,
      level: 'Chuyên gia'
    },
    {
      id: 3,
      name: 'Lê Văn C',
      department: 'Marketing',
      position: 'Marketing Manager',
      avatar: '',
      okrs_completed: 8,
      success_rate: 88,
      total_score: 1050,
      badges: ['Người hoàn thành mục tiêu', 'Làm việc nhóm xuất sắc'],
      current_streak: 5,
      level: 'Thành thạo'
    },
    {
      id: 4,
      name: 'Phạm Thị D',
      department: 'Nhân Sự',
      position: 'HR Manager',
      avatar: '',
      okrs_completed: 7,
      success_rate: 85,
      total_score: 980,
      badges: ['Người đóng góp tích cực'],
      current_streak: 4,
      level: 'Thành thạo'
    },
    {
      id: 5,
      name: 'Hoàng Văn E',
      department: 'Kỹ Thuật',
      position: 'Developer',
      avatar: '',
      okrs_completed: 6,
      success_rate: 82,
      total_score: 890,
      badges: ['Người hoàn thành mục tiêu'],
      current_streak: 3,
      level: 'Cơ bản'
    }
  ];

  const departmentStats = [
    { name: 'Kinh Doanh', avg_score: 1125, members: 12, top_performer: 'Nguyễn Văn A' },
    { name: 'Kỹ Thuật', avg_score: 1035, members: 18, top_performer: 'Trần Thị B' },
    { name: 'Marketing', avg_score: 950, members: 8, top_performer: 'Lê Văn C' },
    { name: 'Nhân Sự', avg_score: 880, members: 6, top_performer: 'Phạm Thị D' }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-orange-500" />;
      default:
        return <Target className="h-6 w-6 text-blue-500" />;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default:
        return 'bg-gradient-to-r from-blue-400 to-blue-600 text-white';
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Chuyên gia':
        return 'bg-purple-100 text-purple-800';
      case 'Thành thạo':
        return 'bg-blue-100 text-blue-800';
      case 'Cơ bản':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Trophy className="h-8 w-8 text-yellow-300" />
                Bảng Xếp Hạng OKR
              </h2>
              <p className="text-purple-100">
                Thành tích và xếp hạng của toàn bộ thành viên trong công ty
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold mb-1">{leaderboardData.length}</div>
              <p className="text-purple-100">Thành viên tham gia</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="current">Chu kỳ hiện tại</TabsTrigger>
          <TabsTrigger value="individual">Cá nhân</TabsTrigger>
          <TabsTrigger value="department">Phòng ban</TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="mt-6">
          <div className="space-y-4">
            {leaderboardData.map((person, index) => {
              const rank = index + 1;
              return (
                <Card key={person.id} className={`hover:shadow-lg transition-all duration-200 ${
                  rank <= 3 ? 'border-2 border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50' : ''
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {/* Rank */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getRankBadgeColor(rank)}`}>
                          {rank <= 3 ? getRankIcon(rank) : <span className="font-bold text-lg">#{rank}</span>}
                        </div>

                        {/* Avatar & Info */}
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-lg">
                              {person.name.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-gray-900">{person.name}</h3>
                            <p className="text-sm text-gray-600">{person.position} - {person.department}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getLevelColor(person.level)}>
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
                      <div className="text-right space-y-2">
                        <div className="flex items-center justify-end space-x-6">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600">{person.total_score}</div>
                            <div className="text-xs text-gray-500">Điểm tổng</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-green-600">{person.success_rate}%</div>
                            <div className="text-xs text-gray-500">Tỷ lệ thành công</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">{person.okrs_completed}</div>
                            <div className="text-xs text-gray-500">OKR hoàn thành</div>
                          </div>
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-40">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Tiến độ chu kỳ</span>
                            <span>{person.success_rate}%</span>
                          </div>
                          <Progress value={person.success_rate} className="h-2" />
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1 justify-end">
                          {person.badges.slice(0, 2).map((badge, i) => (
                            <Badge key={i} variant="secondary" className="text-xs">
                              {badge}
                            </Badge>
                          ))}
                          {person.badges.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{person.badges.length - 2}
                            </Badge>
                          )}
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
          {/* Top Performers */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {leaderboardData.slice(0, 3).map((person, index) => {
              const rank = index + 1;
              return (
                <Card key={person.id} className={`text-center hover:shadow-lg transition-all duration-200 ${
                  rank === 1 ? 'border-2 border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50' : ''
                }`}>
                  <CardContent className="p-6">
                    <div className="relative mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-2">
                        <span className="text-white font-bold text-2xl">
                          {person.name.charAt(0)}
                        </span>
                      </div>
                      <div className="absolute -top-2 -right-2">
                        {getRankIcon(rank)}
                      </div>
                    </div>
                    <h3 className="font-bold text-lg mb-1">{person.name}</h3>
                    <p className="text-sm text-gray-600 mb-3">{person.department}</p>
                    <div className="space-y-2">
                      <div className="text-2xl font-bold text-purple-600">{person.total_score}</div>
                      <Badge className={getLevelColor(person.level)}>
                        {person.level}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="department" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {departmentStats.map((dept, index) => (
              <Card key={dept.name} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    {dept.name}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Điểm trung bình</span>
                      <span className="text-lg font-bold text-purple-600">{dept.avg_score}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Số thành viên</span>
                      <span className="text-lg font-bold text-blue-600">{dept.members}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Thành viên xuất sắc</span>
                      <Badge className="bg-yellow-100 text-yellow-800">
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
