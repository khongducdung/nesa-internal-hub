
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Award, Star, Trophy, Medal, Crown, Target, Calendar, Gift, CheckCircle2 } from 'lucide-react';

export function OKRAchievements() {
  // Mock data - sẽ thay thế bằng API call
  const achievements = [
    {
      id: 1,
      title: 'Người hoàn thành mục tiêu',
      description: 'Hoàn thành 100% Key Results trong chu kỳ',
      icon: Trophy,
      color: 'from-amber-400 to-orange-500',
      earned: true,
      earned_date: '2024-03-15',
      rarity: 'rare',
      reward: 'Thưởng 2 triệu VNĐ + 1 ngày nghỉ phép'
    },
    {
      id: 2,
      title: 'Vượt mục tiêu',
      description: 'Đạt được hơn 120% mục tiêu đề ra',
      icon: Star,
      color: 'from-purple-400 to-pink-500',
      earned: true,
      earned_date: '2024-02-28',
      rarity: 'epic',
      reward: 'Thưởng 5 triệu VNĐ + Cơ hội thăng tiến'
    },
    {
      id: 3,
      title: 'Người tiên phong',
      description: 'Hoàn thành mục tiêu trước thời hạn 2 tuần',
      icon: Crown,
      color: 'from-blue-400 to-indigo-500',
      earned: false,
      rarity: 'legendary',
      reward: 'Thưởng 10 triệu VNĐ + Tăng lương 20%'
    },
    {
      id: 4,
      title: 'Làm việc nhóm xuất sắc',
      description: 'Đóng góp vào 5 OKR khác nhau trong cùng chu kỳ',
      icon: Medal,
      color: 'from-emerald-400 to-teal-500',
      earned: true,
      earned_date: '2024-01-20',
      rarity: 'common',
      reward: 'Thưởng 1 triệu VNĐ + Giấy khen'
    },
    {
      id: 5,
      title: 'Chuyên gia OKR',
      description: 'Hoàn thành 10 chu kỳ OKR liên tiếp',
      icon: Award,
      color: 'from-rose-400 to-red-500',
      earned: false,
      rarity: 'legendary',
      reward: 'Thưởng 15 triệu VNĐ + Tăng chức vụ'
    },
    {
      id: 6,
      title: 'Người đóng góp tích cực',
      description: 'Cập nhật tiến độ đều đặn hàng tuần',
      icon: Target,
      color: 'from-cyan-400 to-blue-500',
      earned: true,
      earned_date: '2024-03-01',
      rarity: 'common',
      reward: 'Thưởng 500k VNĐ'
    }
  ];

  const getRarityInfo = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return { label: 'Phổ biến', color: 'bg-slate-100 text-slate-700', icon: '🥉' };
      case 'rare':
        return { label: 'Hiếm', color: 'bg-blue-100 text-blue-700', icon: '🥈' };
      case 'epic':
        return { label: 'Sử thi', color: 'bg-purple-100 text-purple-700', icon: '🥇' };
      case 'legendary':
        return { label: 'Huyền thoại', color: 'bg-amber-100 text-amber-700', icon: '💎' };
      default:
        return { label: 'Không xác định', color: 'bg-gray-100 text-gray-700', icon: '?' };
    }
  };

  const earnedCount = achievements.filter(a => a.earned).length;
  const totalCount = achievements.length;
  const completionRate = Math.round((earnedCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Bộ sưu tập huy hiệu</h2>
            <p className="text-blue-100">Thành tích và cột mốc đạt được trong hành trình OKR</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold mb-1">{earnedCount}/{totalCount}</div>
            <div className="text-sm text-blue-100">Huy hiệu đã có</div>
            <div className="w-24 mt-2">
              <Progress value={completionRate} className="h-2 bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          const rarityInfo = getRarityInfo(achievement.rarity);
          
          return (
            <Card 
              key={achievement.id} 
              className={`transition-all duration-200 hover:shadow-lg ${
                achievement.earned 
                  ? 'border-2 border-green-200 bg-white shadow-md' 
                  : 'border border-gray-200 bg-gray-50/50'
              }`}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`w-12 h-12 bg-gradient-to-br ${achievement.color} rounded-xl flex items-center justify-center shadow-sm ${
                    !achievement.earned ? 'grayscale opacity-60' : ''
                  }`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className={`font-semibold text-sm ${achievement.earned ? 'text-gray-900' : 'text-gray-500'}`}>
                        {achievement.title}
                      </h3>
                      {achievement.earned && (
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                    
                    <p className={`text-xs mb-2 ${achievement.earned ? 'text-gray-600' : 'text-gray-400'}`}>
                      {achievement.description}
                    </p>
                    
                    {/* Rarity Badge */}
                    <Badge className={`${rarityInfo.color} text-xs mb-2`}>
                      {rarityInfo.icon} {rarityInfo.label}
                    </Badge>
                    
                    {/* Reward */}
                    <div className={`text-xs p-2 rounded-lg ${
                      achievement.earned 
                        ? 'bg-yellow-50 border border-yellow-200 text-yellow-700' 
                        : 'bg-gray-50 border border-gray-200 text-gray-600'
                    }`}>
                      <div className="flex items-center gap-1 mb-1">
                        <Gift className="h-3 w-3" />
                        <span className="font-medium">Phần thưởng:</span>
                      </div>
                      <p>{achievement.reward}</p>
                    </div>
                    
                    {/* Earned Date */}
                    {achievement.earned && achievement.earned_date && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>Đạt được: {new Date(achievement.earned_date).toLocaleDateString('vi-VN')}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Achievements */}
      <Card className="border-yellow-200 bg-gradient-to-r from-yellow-50 to-orange-50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Trophy className="h-5 w-5 text-yellow-600" />
            Huy hiệu mới nhất
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {achievements
              .filter(a => a.earned)
              .sort((a, b) => new Date(b.earned_date!).getTime() - new Date(a.earned_date!).getTime())
              .slice(0, 3)
              .map((achievement) => {
                const Icon = achievement.icon;
                const rarityInfo = getRarityInfo(achievement.rarity);
                
                return (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-yellow-200">
                    <div className={`w-10 h-10 bg-gradient-to-br ${achievement.color} rounded-lg flex items-center justify-center shadow-sm`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm text-gray-900">{achievement.title}</h4>
                        <Badge className={`${rarityInfo.color} text-xs`}>
                          {rarityInfo.icon} {rarityInfo.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600">{achievement.reward}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(achievement.earned_date!).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
