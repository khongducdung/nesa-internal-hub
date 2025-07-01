import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Award, Star, Trophy, Medal, Crown, Target, Flame, Zap, Sparkles, Gift, Calendar } from 'lucide-react';

export function OKRAchievements() {
  // Mock data - sẽ thay thế bằng API call
  const achievements = [
    {
      id: 1,
      title: 'Người hoàn thành mục tiêu 🎯',
      description: 'Hoàn thành 100% Key Results trong chu kỳ',
      icon: Trophy,
      color: 'from-yellow-400 to-yellow-600',
      earned: true,
      earned_date: '2024-03-15',
      rarity: 'rare',
      reward: 'Thưởng 2 triệu VNĐ + 1 ngày nghỉ phép',
      motivational_text: 'Xuất sắc! Bạn đã chứng minh khả năng hoàn thành mục tiêu một cách tuyệt vời!'
    },
    {
      id: 2,
      title: 'Vượt mục tiêu 🚀',
      description: 'Đạt được hơn 120% mục tiêu đề ra',
      icon: Star,
      color: 'from-purple-400 to-purple-600',
      earned: true,
      earned_date: '2024-02-28',
      rarity: 'epic',
      reward: 'Thưởng 5 triệu VNĐ + Cơ hội thăng tiến',
      motivational_text: 'Phi thường! Bạn đã vượt qua mọi kỳ vọng và tạo nên sự khác biệt!'
    },
    {
      id: 3,
      title: 'Người tiên phong 👑',
      description: 'Hoàn thành mục tiêu trước thời hạn 2 tuần',
      icon: Crown,
      color: 'from-blue-400 to-blue-600',
      earned: false,
      rarity: 'legendary',
      reward: 'Thưởng 10 triệu VNĐ + Tăng lương 20%',
      motivational_text: 'Trở thành người dẫn đầu và truyền cảm hứng cho cả đội!'
    },
    {
      id: 4,
      title: 'Làm việc nhóm xuất sắc 🤝',
      description: 'Đóng góp vào 5 OKR khác nhau trong cùng chu kỳ',
      icon: Medal,
      color: 'from-green-400 to-green-600',
      earned: true,
      earned_date: '2024-01-20',
      rarity: 'common',
      reward: 'Thưởng 1 triệu VNĐ + Giấy khen',
      motivational_text: 'Tuyệt vời! Tinh thần hợp tác của bạn thật đáng ngưỡng mộ!'
    },
    {
      id: 5,
      title: 'Chuyên gia OKR 🎓',
      description: 'Hoàn thành 10 chu kỳ OKR liên tiếp',
      icon: Award,
      color: 'from-red-400 to-red-600',
      earned: false,
      rarity: 'legendary',
      reward: 'Thưởng 15 triệu VNĐ + Tăng chức vụ',
      motivational_text: 'Bạn sắp trở thành chuyên gia thực thụ về OKR!'
    },
    {
      id: 6,
      title: 'Người đóng góp tích cực ⭐',
      description: 'Cập nhật tiến độ đều đặn hàng tuần',
      icon: Target,
      color: 'from-teal-400 to-teal-600',
      earned: true,
      earned_date: '2024-03-01',
      rarity: 'common',
      reward: 'Thưởng 500k VNĐ',
      motivational_text: 'Sự kiên trì và đều đặn của bạn là chìa khóa thành công!'
    }
  ];

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return <Badge className="bg-gray-100 text-gray-800 border border-gray-300">🥉 Phổ biến</Badge>;
      case 'rare':
        return <Badge className="bg-blue-100 text-blue-800 border border-blue-300">🥈 Hiếm</Badge>;
      case 'epic':
        return <Badge className="bg-purple-100 text-purple-800 border border-purple-300">🥇 Sử thi</Badge>;
      case 'legendary':
        return <Badge className="bg-orange-100 text-orange-800 border border-orange-300">💎 Huyền thoại</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const earnedCount = achievements.filter(a => a.earned).length;
  const totalCount = achievements.length;
  const completionRate = Math.round((earnedCount / totalCount) * 100);

  // Motivational messages based on completion rate
  const getMotivationalMessage = () => {
    if (completionRate >= 80) return "🔥 Bạn là một nhà vô địch thực sự! Tiếp tục duy trì phong độ!";
    if (completionRate >= 60) return "⭐ Bạn đang làm rất tốt! Chỉ còn một chút nữa thôi!";
    if (completionRate >= 40) return "💪 Bạn đang trên đường chinh phục! Đừng bỏ cuộc!";
    return "🚀 Hành trình của bạn mới bắt đầu! Mỗi bước đi đều có ý nghĩa!";
  };

  return (
    <div className="space-y-6">
      {/* Achievement Stats */}
      <Card className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white border-0 overflow-hidden relative">
        <div className="absolute inset-0 bg-black/10"></div>
        <CardContent className="p-8 relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-3 flex items-center gap-3">
                <Sparkles className="h-8 w-8 text-yellow-300" />
                Huy hiệu của tôi
              </h2>
              <p className="text-indigo-100 text-lg mb-4">
                {getMotivationalMessage()}
              </p>
              <div className="flex items-center space-x-4">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                  <div className="text-sm text-indigo-100">Tỷ lệ hoàn thành</div>
                  <div className="text-2xl font-bold">{completionRate}%</div>
                </div>
                <Progress value={completionRate} className="w-32 h-3 bg-white/20" />
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold mb-2">{earnedCount}/{totalCount}</div>
              <p className="text-indigo-100 text-lg">Huy hiệu đã đạt</p>
              <div className="flex items-center justify-end mt-2 space-x-1">
                <Flame className="h-5 w-5 text-yellow-300" />
                <span className="text-sm">Streak: 8 ngày</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <Card 
              key={achievement.id} 
              className={`transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                achievement.earned 
                  ? 'border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg' 
                  : 'border-2 border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100 opacity-75 hover:opacity-90'
              }`}
            >
              <CardContent className="p-6 text-center relative">
                {achievement.earned && (
                  <div className="absolute top-2 right-2">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <Zap className="h-4 w-4 text-white" />
                    </div>
                  </div>
                )}

                <div className={`w-20 h-20 bg-gradient-to-br ${achievement.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg ${
                  !achievement.earned ? 'grayscale' : 'animate-pulse'
                }`}>
                  <Icon className="h-10 w-10 text-white" />
                </div>
                
                <h3 className={`font-bold text-xl mb-3 ${
                  achievement.earned ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {achievement.title}
                </h3>
                
                <p className={`text-sm mb-4 ${
                  achievement.earned ? 'text-gray-700' : 'text-gray-400'
                }`}>
                  {achievement.description}
                </p>
                
                <div className="flex items-center justify-center space-x-2 mb-4">
                  {getRarityBadge(achievement.rarity)}
                  {achievement.earned && (
                    <Badge className="bg-green-100 text-green-800 border border-green-300">
                      ✅ Đã đạt
                    </Badge>
                  )}
                </div>

                {/* Reward Info */}
                <div className={`p-3 rounded-lg mb-4 ${
                  achievement.earned ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200'
                }`}>
                  <div className="flex items-center justify-center mb-2">
                    <Gift className={`h-4 w-4 mr-1 ${achievement.earned ? 'text-yellow-600' : 'text-gray-400'}`} />
                    <span className="text-xs font-medium text-gray-700">Phần thưởng:</span>
                  </div>
                  <p className="text-xs text-gray-600">{achievement.reward}</p>
                </div>

                {/* Motivational Text */}
                <div className={`p-3 rounded-lg text-xs italic ${
                  achievement.earned 
                    ? 'bg-green-50 border border-green-200 text-green-700' 
                    : 'bg-blue-50 border border-blue-200 text-blue-700'
                }`}>
                  💬 {achievement.motivational_text}
                </div>
                
                {achievement.earned && achievement.earned_date && (
                  <p className="text-xs text-gray-500 mt-3 flex items-center justify-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    Đạt được: {new Date(achievement.earned_date).toLocaleDateString('vi-VN')}
                  </p>
                )}
                
                {!achievement.earned && (
                  <div className="mt-4">
                    <Button variant="outline" size="sm" className="text-xs">
                      <Target className="h-3 w-3 mr-1" />
                      Xem cách đạt được
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Achievements */}
      <Card className="border-2 border-yellow-200">
        <CardHeader className="bg-gradient-to-r from-yellow-50 to-orange-50">
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-6 w-6 text-yellow-600" />
            🎉 Huy hiệu mới đạt được
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {achievements
              .filter(a => a.earned)
              .sort((a, b) => new Date(b.earned_date!).getTime() - new Date(a.earned_date!).getTime())
              .slice(0, 3)
              .map((achievement) => {
                const Icon = achievement.icon;
                return (
                  <div key={achievement.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200 hover:shadow-md transition-shadow">
                    <div className={`w-12 h-12 bg-gradient-to-br ${achievement.color} rounded-full flex items-center justify-center shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-600 mb-1">{achievement.description}</p>
                      <p className="text-xs text-green-600 font-medium">💰 {achievement.reward}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 mb-1">
                        {new Date(achievement.earned_date!).toLocaleDateString('vi-VN')}
                      </p>
                      {getRarityBadge(achievement.rarity)}
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
