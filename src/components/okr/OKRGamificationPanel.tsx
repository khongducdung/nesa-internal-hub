import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Trophy, Target, Award, Star, Crown, Zap, Gift, Medal, Coins, Heart, CheckCircle, TrendingUp } from 'lucide-react';

interface OKRGamificationPanelProps {
  compact?: boolean;
}

export function OKRGamificationPanel({ compact = false }: OKRGamificationPanelProps) {
  // Mock data - trong thực tế sẽ lấy từ API
  const mockRewards = {
    okr_coins: 1250,
    trust_points: 85,
    dedication_points: 120,
    total_rewards: 1455,
    current_rank: 3,
    next_rank_threshold: 1500,
    achievements: [
      { id: '1', name: 'Người khởi đầu', icon: <Target className="h-4 w-4" />, unlocked: true, rarity: 'common' },
      { id: '2', name: 'Chiến binh', icon: <Trophy className="h-4 w-4" />, unlocked: true, rarity: 'rare' },
      { id: '3', name: 'Huyền thoại', icon: <Crown className="h-4 w-4" />, unlocked: false, rarity: 'legendary' },
      { id: '4', name: 'Hoàn thành xuất sắc', icon: <CheckCircle className="h-4 w-4" />, unlocked: true, rarity: 'epic' },
      { id: '5', name: 'Tiến bộ vượt trội', icon: <TrendingUp className="h-4 w-4" />, unlocked: false, rarity: 'rare' }
    ]
  };

  const rewards = mockRewards;

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
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

  // Compact view for sidebar/summary
  if (compact) {
    return (
      <Card className="border-l-4 border-l-orange-500">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">Điểm thưởng</CardTitle>
            <Gift className="h-4 w-4 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-yellow-600 font-semibold">
                <Coins className="h-3 w-3" />
                {rewards.okr_coins}
              </div>
              <p className="text-xs text-muted-foreground">OKR Coins</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-blue-600 font-semibold">
                <Heart className="h-3 w-3" />
                {rewards.trust_points}
              </div>
              <p className="text-xs text-muted-foreground">Trust</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-green-600 font-semibold">
                <Zap className="h-3 w-3" />
                {rewards.dedication_points}
              </div>
              <p className="text-xs text-muted-foreground">Dedication</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <Trophy className="h-3 w-3 text-orange-600" />
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
        </CardContent>
      </Card>
    );
  }

  // Full view for main gamification panel
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Reward Summary */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-orange-600" />
              Điểm thưởng hiện tại
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-yellow-600 mb-2">
                  <Coins className="h-6 w-6" />
                  <span className="text-3xl font-bold">{rewards.okr_coins}</span>
                </div>
                <p className="text-sm font-medium text-muted-foreground">OKR Coins</p>
                <p className="text-xs text-muted-foreground">Từ hoàn thành mục tiêu</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-blue-600 mb-2">
                  <Heart className="h-6 w-6" />
                  <span className="text-3xl font-bold">{rewards.trust_points}</span>
                </div>
                <p className="text-sm font-medium text-muted-foreground">Trust Points</p>
                <p className="text-xs text-muted-foreground">Từ sự tin cậy</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
                  <Zap className="h-6 w-6" />
                  <span className="text-3xl font-bold">{rewards.dedication_points}</span>
                </div>
                <p className="text-sm font-medium text-muted-foreground">Dedication Points</p>
                <p className="text-xs text-muted-foreground">Từ sự cống hiến</p>
              </div>
              
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-orange-600 mb-2">
                  <Trophy className="h-6 w-6" />
                  <span className="text-3xl font-bold">#{rewards.current_rank}</span>
                </div>
                <p className="text-sm font-medium text-muted-foreground">Xếp hạng</p>
                <p className="text-xs text-muted-foreground">Trong công ty</p>
              </div>
            </div>
            
            {/* Progress to next rank */}
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tiến độ lên hạng tiếp theo</span>
                <span className="font-medium">{rewards.total_rewards}/{rewards.next_rank_threshold}</span>
              </div>
              <Progress 
                value={(rewards.total_rewards / rewards.next_rank_threshold) * 100} 
                className="h-2"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Thành tựu
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
                          {achievement.unlocked && <CheckCircle className="h-4 w-4 text-green-600" />}
                        </div>
                      </div>
                      {!achievement.unlocked && (
                        <p className="text-xs text-muted-foreground">
                          Chưa mở khóa
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <Button variant="outline" size="sm">
              <Award className="h-4 w-4 mr-2" />
              Xem tất cả thành tựu
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}