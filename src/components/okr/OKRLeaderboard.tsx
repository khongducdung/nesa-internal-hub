// OKR Leaderboard - Gamification and ranking view
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, Medal, Crown, Star, TrendingUp, Users, Building2, Coins } from 'lucide-react';
import { OKRGamificationPanel } from './OKRGamificationPanel';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  department: string;
  position: string;
  rank: number;
  completion_rate: number;
  okr_coins: number;
  trust_points: number;
  achievements_count: number;
  trend: 'up' | 'down' | 'stable';
}

interface LeaderboardDepartment {
  id: string;
  name: string;
  avg_completion_rate: number;
  total_okrs: number;
  completed_okrs: number;
  rank: number;
  employee_count: number;
}

export function OKRLeaderboard() {
  const [selectedTab, setSelectedTab] = useState('individual');

  // Mock data
  const individualLeaderboard: LeaderboardUser[] = [
    {
      id: '1',
      name: 'Nguyễn Văn An',
      avatar: '',
      department: 'Kinh doanh',
      position: 'Senior Sales Manager',
      rank: 1,
      completion_rate: 95,
      okr_coins: 1250,
      trust_points: 380,
      achievements_count: 8,
      trend: 'up'
    },
    {
      id: '2',
      name: 'Trần Thị Bình',
      avatar: '',
      department: 'Kỹ thuật',
      position: 'Tech Lead',
      rank: 2,
      completion_rate: 92,
      okr_coins: 1180,
      trust_points: 350,
      achievements_count: 7,
      trend: 'up'
    },
    {
      id: '3',
      name: 'Lê Minh Cường',
      avatar: '',
      department: 'Marketing',
      position: 'Marketing Manager',
      rank: 3,
      completion_rate: 88,
      okr_coins: 1050,
      trust_points: 320,
      achievements_count: 6,
      trend: 'stable'
    },
    {
      id: '4',
      name: 'Phạm Thị Dung',
      avatar: '',
      department: 'Nhân sự',
      position: 'HR Business Partner',
      rank: 4,
      completion_rate: 85,
      okr_coins: 950,
      trust_points: 290,
      achievements_count: 5,
      trend: 'down'
    },
    {
      id: '5',
      name: 'Hoàng Văn Em',
      avatar: '',
      department: 'Tài chính',
      position: 'Financial Analyst',
      rank: 5,
      completion_rate: 82,
      okr_coins: 850,
      trust_points: 260,
      achievements_count: 4,
      trend: 'up'
    }
  ];

  const departmentLeaderboard: LeaderboardDepartment[] = [
    {
      id: '1',
      name: 'Phòng Kỹ thuật',
      avg_completion_rate: 91,
      total_okrs: 24,
      completed_okrs: 22,
      rank: 1,
      employee_count: 15
    },
    {
      id: '2',
      name: 'Phòng Kinh doanh',
      avg_completion_rate: 87,
      total_okrs: 18,
      completed_okrs: 16,
      rank: 2,
      employee_count: 12
    },
    {
      id: '3',
      name: 'Phòng Marketing',
      avg_completion_rate: 84,
      total_okrs: 15,
      completed_okrs: 13,
      rank: 3,
      employee_count: 8
    },
    {
      id: '4',
      name: 'Phòng Nhân sự',
      avg_completion_rate: 80,
      total_okrs: 12,
      completed_okrs: 10,
      rank: 4,
      employee_count: 6
    }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2: return <Medal className="h-5 w-5 text-gray-400" />;
      case 3: return <Medal className="h-5 w-5 text-orange-600" />;
      default: return <span className="text-lg font-bold text-muted-foreground">{rank}</span>;
    }
  };

  const getRankBadge = (rank: number) => {
    switch (rank) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3: return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'down': return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
      default: return <div className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Trophy className="h-6 w-6" />
          Bảng xếp hạng & Thành tích
        </h2>
        <p className="text-muted-foreground mt-1">
          Xếp hạng hiệu suất và hệ thống thưởng gamification
        </p>
      </div>

      {/* My Achievements */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Thành tích của tôi</h3>
        <OKRGamificationPanel compact />
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="individual" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Cá nhân
          </TabsTrigger>
          <TabsTrigger value="department" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Phòng ban
          </TabsTrigger>
        </TabsList>

        <TabsContent value="individual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Top cá nhân
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {individualLeaderboard.map((user, index) => (
                  <div key={user.id} className={`flex items-center gap-4 p-4 rounded-lg border ${index < 3 ? 'bg-gradient-to-r from-primary/5 to-primary/10' : 'bg-muted/30'}`}>
                    {/* Rank */}
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getRankBadge(user.rank)}`}>
                      {getRankIcon(user.rank)}
                    </div>

                    {/* Avatar and Info */}
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="font-semibold">{user.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.position} • {user.department}
                        </div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-lg">{user.completion_rate}%</div>
                        <div className="text-muted-foreground">Hoàn thành</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-lg flex items-center gap-1">
                          <Coins className="h-4 w-4 text-yellow-600" />
                          {user.okr_coins}
                        </div>
                        <div className="text-muted-foreground">OKR Coins</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-lg flex items-center gap-1">
                          <Star className="h-4 w-4 text-blue-600" />
                          {user.achievements_count}
                        </div>
                        <div className="text-muted-foreground">Thành tích</div>
                      </div>
                      <div className="flex items-center">
                        {getTrendIcon(user.trend)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="department" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Xếp hạng phòng ban
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {departmentLeaderboard.map((dept, index) => (
                  <div key={dept.id} className={`flex items-center gap-4 p-4 rounded-lg border ${index < 3 ? 'bg-gradient-to-r from-primary/5 to-primary/10' : 'bg-muted/30'}`}>
                    {/* Rank */}
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${getRankBadge(dept.rank)}`}>
                      {getRankIcon(dept.rank)}
                    </div>

                    {/* Department Info */}
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{dept.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {dept.employee_count} nhân viên
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm">
                      <div className="text-center">
                        <div className="font-semibold text-lg">{dept.avg_completion_rate}%</div>
                        <div className="text-muted-foreground">TB hoàn thành</div>
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-lg">{dept.completed_okrs}/{dept.total_okrs}</div>
                        <div className="text-muted-foreground">OKRs</div>
                      </div>
                      <div className="text-center">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {Math.round((dept.completed_okrs / dept.total_okrs) * 100)}% hoàn thành
                        </Badge>
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
  );
}