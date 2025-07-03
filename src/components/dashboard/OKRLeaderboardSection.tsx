import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Crown, Star, TrendingUp, Coins } from 'lucide-react';

interface LeaderboardUser {
  id: string;
  name: string;
  avatar?: string;
  department: string;
  position: string;
  rank: number;
  completion_rate: number;
  okr_coins: number;
  achievements_count: number;
  trend: 'up' | 'down' | 'stable';
}

export function OKRLeaderboardSection() {
  // Mock data - would be fetched from API
  const topPerformers: LeaderboardUser[] = [
    {
      id: '1',
      name: 'Nguyễn Văn An',
      avatar: '',
      department: 'Kinh doanh',
      position: 'Senior Sales Manager',
      rank: 1,
      completion_rate: 95,
      okr_coins: 1250,
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
      achievements_count: 5,
      trend: 'down'
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
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Bảng xếp hạng OKR công ty
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topPerformers.map((user, index) => (
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
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{user.name}</div>
                  <div className="text-sm text-muted-foreground truncate">
                    {user.position} • {user.department}
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm">
                <div className="text-center">
                  <div className="font-semibold text-lg">{user.completion_rate}%</div>
                  <div className="text-muted-foreground text-xs">Hoàn thành</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg flex items-center gap-1">
                    <Coins className="h-4 w-4 text-yellow-600" />
                    {user.okr_coins}
                  </div>
                  <div className="text-muted-foreground text-xs">OKR Coins</div>
                </div>
                <div className="text-center">
                  <div className="font-semibold text-lg flex items-center gap-1">
                    <Star className="h-4 w-4 text-blue-600" />
                    {user.achievements_count}
                  </div>
                  <div className="text-muted-foreground text-xs">Thành tích</div>
                </div>
                <div className="flex items-center">
                  {getTrendIcon(user.trend)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-blue-700 text-sm font-medium">
            🎯 Bạn đang ở vị trí #{Math.floor(Math.random() * 10) + 5} trong bảng xếp hạng!
          </p>
          <p className="text-blue-600 text-xs mt-1">
            Hãy tiếp tục nỗ lực để cải thiện thứ hạng của mình
          </p>
        </div>
      </CardContent>
    </Card>
  );
}