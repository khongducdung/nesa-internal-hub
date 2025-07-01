
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Award, Star, Trophy, Medal, Crown, Target } from 'lucide-react';

export function OKRAchievements() {
  // Mock data - sẽ thay thế bằng API call
  const achievements = [
    {
      id: 1,
      title: 'Người hoàn thành mục tiêu',
      description: 'Hoàn thành 100% Key Results trong chu kỳ',
      icon: Trophy,
      color: 'from-yellow-400 to-yellow-600',
      earned: true,
      earned_date: '2024-03-15',
      rarity: 'rare'
    },
    {
      id: 2,
      title: 'Vượt mục tiêu',
      description: 'Đạt được hơn 120% mục tiêu đề ra',
      icon: Star,
      color: 'from-purple-400 to-purple-600',
      earned: true,
      earned_date: '2024-02-28',
      rarity: 'epic'
    },
    {
      id: 3,
      title: 'Người tiên phong',
      description: 'Hoàn thành mục tiêu trước thời hạn 2 tuần',
      icon: Crown,
      color: 'from-blue-400 to-blue-600',
      earned: false,
      rarity: 'legendary'
    },
    {
      id: 4,
      title: 'Làm việc nhóm xuất sắc',
      description: 'Đóng góp vào 5 OKR khác nhau trong cùng chu kỳ',
      icon: Medal,
      color: 'from-green-400 to-green-600',
      earned: true,
      earned_date: '2024-01-20',
      rarity: 'common'
    },
    {
      id: 5,
      title: 'Chuyên gia OKR',
      description: 'Hoàn thành 10 chu kỳ OKR liên tiếp',
      icon: Award,
      color: 'from-red-400 to-red-600',
      earned: false,
      rarity: 'legendary'
    },
    {
      id: 6,
      title: 'Người đóng góp tích cực',
      description: 'Cập nhật tiến độ đều đặn hàng tuần',
      icon: Target,
      color: 'from-teal-400 to-teal-600',
      earned: true,
      earned_date: '2024-03-01',
      rarity: 'common'
    }
  ];

  const getRarityBadge = (rarity: string) => {
    switch (rarity) {
      case 'common':
        return <Badge className="bg-gray-100 text-gray-800">Phổ biến</Badge>;
      case 'rare':
        return <Badge className="bg-blue-100 text-blue-800">Hiếm</Badge>;
      case 'epic':
        return <Badge className="bg-purple-100 text-purple-800">Sử thi</Badge>;
      case 'legendary':
        return <Badge className="bg-orange-100 text-orange-800">Huyền thoại</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const earnedCount = achievements.filter(a => a.earned).length;
  const totalCount = achievements.length;

  return (
    <div className="space-y-6">
      {/* Achievement Stats */}
      <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Huy hiệu của tôi</h2>
              <p className="text-blue-100">Thể hiện thành tích trong việc thực hiện OKR</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold mb-1">{earnedCount}/{totalCount}</div>
              <p className="text-blue-100">Huy hiệu đã đạt</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {achievements.map((achievement) => {
          const Icon = achievement.icon;
          return (
            <Card 
              key={achievement.id} 
              className={`transition-all duration-200 hover:shadow-lg ${
                achievement.earned 
                  ? 'border-2 border-green-200 bg-green-50' 
                  : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <CardContent className="p-6 text-center">
                <div className={`w-16 h-16 bg-gradient-to-br ${achievement.color} rounded-full flex items-center justify-center mx-auto mb-4 ${
                  !achievement.earned ? 'grayscale' : ''
                }`}>
                  <Icon className="h-8 w-8 text-white" />
                </div>
                
                <h3 className={`font-bold text-lg mb-2 ${
                  achievement.earned ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  {achievement.title}
                </h3>
                
                <p className={`text-sm mb-3 ${
                  achievement.earned ? 'text-gray-700' : 'text-gray-400'
                }`}>
                  {achievement.description}
                </p>
                
                <div className="flex items-center justify-center space-x-2 mb-3">
                  {getRarityBadge(achievement.rarity)}
                  {achievement.earned && (
                    <Badge className="bg-green-100 text-green-800">Đã đạt</Badge>
                  )}
                </div>
                
                {achievement.earned && achievement.earned_date && (
                  <p className="text-xs text-gray-500">
                    Đạt được: {new Date(achievement.earned_date).toLocaleDateString('vi-VN')}
                  </p>
                )}
                
                {!achievement.earned && (
                  <p className="text-xs text-gray-400">Chưa đạt được</p>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5 text-yellow-600" />
            Huy hiệu gần đây
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
                return (
                  <div key={achievement.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-10 h-10 bg-gradient-to-br ${achievement.color} rounded-full flex items-center justify-center`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">
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
