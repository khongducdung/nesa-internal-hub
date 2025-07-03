// OKR Gamification Panel - Hệ thống điểm và thành tích
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Star, Coins, TrendingUp, Award, Target, Zap } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  points: number;
  unlocked: boolean;
  progress?: number;
}

interface UserReward {
  okr_coins: number;
  trust_points: number;
  dedication_points: number;
  current_rank: number;
  achievements: Achievement[];
}

interface OKRGamificationPanelProps {
  userRewards?: UserReward;
  compact?: boolean;
}

export function OKRGamificationPanel({ userRewards, compact = false }: OKRGamificationPanelProps) {
  // Mock data nếu không có userRewards
  const rewards = userRewards || {
    okr_coins: 850,
    trust_points: 240,
    dedication_points: 180,
    current_rank: 12,
    achievements: [
      {
        id: '1',
        name: 'Starter',
        description: 'Tạo OKR đầu tiên',
        icon: '🚀',
        rarity: 'common',
        points: 10,
        unlocked: true
      },
      {
        id: '2',
        name: 'Consistent Tracker',
        description: 'Cập nhật tiến độ 5 tuần liên tiếp',
        icon: '📈',
        rarity: 'rare',
        points: 50,
        unlocked: true
      },
      {
        id: '3',
        name: 'Goal Crusher',
        description: 'Hoàn thành 100% OKR',
        icon: '🎯',
        rarity: 'epic',
        points: 100,
        unlocked: false,
        progress: 85
      },
      {
        id: '4',
        name: 'Excellence Award',
        description: 'Đạt trên 90% trong 3 chu kỳ liên tiếp',
        icon: '👑',
        rarity: 'legendary',
        points: 200,
        unlocked: false,
        progress: 33
      }
    ]
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'rare': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'epic': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'legendary': return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRarityName = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'Thường';
      case 'rare': return 'Hiếm';
      case 'epic': return 'Sử thi';
      case 'legendary': return 'Huyền thoại';
      default: return 'Thường';
    }
  };

  if (compact) {
    return (
      <Card className="w-full">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-yellow-600" />
                <span className="font-semibold">{rewards.okr_coins}</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="h-4 w-4 text-blue-600" />
                <span className="font-semibold">#{rewards.current_rank}</span>
              </div>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                {rewards.achievements.filter(a => a.unlocked).length} thành tích
              </Badge>
            </div>
            <div className="flex items-center gap-1">
              {rewards.achievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className={`text-lg ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="h-5 w-5" />
            Điểm thưởng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Coins className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-yellow-600">{rewards.okr_coins}</div>
              <div className="text-sm text-muted-foreground">OKR Coins</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-8 w-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">{rewards.trust_points}</div>
              <div className="text-sm text-muted-foreground">Trust Points</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Zap className="h-8 w-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">{rewards.dedication_points}</div>
              <div className="text-sm text-muted-foreground">Dedication Points</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Trophy className="h-8 w-8 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-orange-600">#{rewards.current_rank}</div>
              <div className="text-sm text-muted-foreground">Xếp hạng</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Thành tích ({rewards.achievements.filter(a => a.unlocked).length}/{rewards.achievements.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rewards.achievements.map((achievement) => (
              <Card key={achievement.id} className={`border-2 ${achievement.unlocked ? 'border-primary/20' : 'border-dashed border-gray-200'}`}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`text-2xl ${achievement.unlocked ? '' : 'grayscale opacity-50'}`}>
                      {achievement.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className={`font-semibold ${achievement.unlocked ? '' : 'text-muted-foreground'}`}>
                          {achievement.name}
                        </h4>
                        <div className="flex items-center gap-2">
                          <Badge className={getRarityColor(achievement.rarity)}>
                            {getRarityName(achievement.rarity)}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            +{achievement.points} pts
                          </Badge>
                        </div>
                      </div>
                      <p className={`text-sm mb-2 ${achievement.unlocked ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
                        {achievement.description}
                      </p>
                      
                      {!achievement.unlocked && achievement.progress !== undefined && (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span>Tiến độ</span>
                            <span>{achievement.progress}%</span>
                          </div>
                          <Progress value={achievement.progress} className="h-2" />
                        </div>
                      )}
                      
                      {achievement.unlocked && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <Trophy className="h-3 w-3 mr-1" />
                          Đã mở khóa
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Tiến độ lên hạng
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">Bạn</div>
                  <div className="text-sm text-muted-foreground">Hạng #{rewards.current_rank}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{rewards.okr_coins + rewards.trust_points + rewards.dedication_points} điểm</div>
                <div className="text-sm text-muted-foreground">Tổng điểm</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Đến hạng #{Math.max(1, rewards.current_rank - 1)}</span>
                <span>85%</span>
              </div>
              <Progress value={85} className="h-2" />
              <div className="text-xs text-muted-foreground text-center">
                Cần thêm 150 điểm để lên hạng
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}