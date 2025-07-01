
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Award, Medal, Star, TrendingUp } from 'lucide-react';

export function OKRMini() {
  // Mock data - sẽ thay thế bằng API call
  const myRank = 3;
  const totalParticipants = 45;
  const myScore = 1050;
  
  const myBadges = [
    { name: 'Người hoàn thành mục tiêu', icon: Trophy, color: 'from-yellow-400 to-yellow-600' },
    { name: 'Làm việc nhóm xuất sắc', icon: Award, color: 'from-green-400 to-green-600' }
  ];

  const topPerformers = [
    { name: 'Nguyễn Văn A', score: 1250, department: 'Kinh Doanh' },
    { name: 'Trần Thị B', score: 1180, department: 'Kỹ Thuật' },
    { name: 'Tôi', score: 1050, department: 'Marketing', isMe: true }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* My Achievement Summary */}
      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-purple-800">
            <Award className="h-5 w-5" />
            Thành tích của tôi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Xếp hạng hiện tại</span>
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-to-r from-orange-400 to-orange-600 text-white">
                  #{myRank}
                </Badge>
                <span className="text-xs text-gray-500">/ {totalParticipants} người</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Điểm tổng</span>
              <span className="text-lg font-bold text-purple-600">{myScore}</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>Tiến độ đến hạng 2</span>
                <span>{Math.round((myScore / 1180) * 100)}%</span>
              </div>
              <Progress value={(myScore / 1180) * 100} className="h-2" />
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-700">Huy hiệu gần đây:</span>
              <div className="flex gap-2">
                {myBadges.map((badge, index) => {
                  const Icon = badge.icon;
                  return (
                    <div key={index} className={`w-8 h-8 bg-gradient-to-br ${badge.color} rounded-full flex items-center justify-center`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mini Leaderboard */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-800">
            <TrendingUp className="h-5 w-5" />
            Top Performers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topPerformers.map((person, index) => {
              const rank = index + 1;
              const getRankIcon = () => {
                switch (rank) {
                  case 1: return <Trophy className="h-4 w-4 text-yellow-500" />;
                  case 2: return <Medal className="h-4 w-4 text-gray-400" />;
                  case 3: return <Award className="h-4 w-4 text-orange-500" />;
                  default: return <Star className="h-4 w-4 text-blue-500" />;
                }
              };

              return (
                <div key={index} className={`flex items-center justify-between p-2 rounded-lg ${
                  person.isMe ? 'bg-green-100 border border-green-300' : 'bg-white/50'
                }`}>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-6 h-6">
                      {getRankIcon()}
                    </div>
                    <div>
                      <div className={`font-medium text-sm ${person.isMe ? 'text-green-800' : 'text-gray-900'}`}>
                        {person.name}
                      </div>
                      <div className="text-xs text-gray-500">{person.department}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-blue-600">{person.score}</div>
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
