
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Target, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Users,
  Calendar,
  BarChart3,
  Award,
  Star,
  Trophy,
  MessageSquare,
  Gift,
  Heart,
  ArrowRight,
  Eye,
  Coins,
  Crown,
  Medal
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { OKRAchievements } from './OKRAchievements';
import { OKRLeaderboard } from './OKRLeaderboard';
import { EmotionalRewards } from './EmotionalRewards';

export function OKRDashboard() {
  const { profile, isAdmin } = useAuth();
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [emotionalRewardsOpen, setEmotionalRewardsOpen] = useState(false);
  
  const isManager = true;
  
  // Simplified welcome quotes
  const motivationalQuotes = [
    "🔥 Bạn đang trên đường chinh phục những đỉnh cao mới!",
    "⭐ Thành công không phải là điểm đến, mà là hành trình!",
    "🚀 Hôm nay bạn đã làm gì để gần hơn với mục tiêu?",
    "💪 Kiên trì và nỗ lực sẽ mang lại kết quả tuyệt vời!"
  ];
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  // Mock data for stats and rewards
  const rewardData = { okrCoins: 2850, trustPoints: 89, dedicationPoints: 92, myRank: 3 };
  const okrStats = [
    { title: 'Tổng Objectives', value: '45', icon: Target, color: 'bg-blue-500', change: '+8' },
    { title: 'Đang thực hiện', value: '32', icon: TrendingUp, color: 'bg-green-500', change: '+5' },
    { title: 'Hoàn thành', value: '28', icon: CheckCircle, color: 'bg-purple-500', change: '+7' },
    { title: 'Cần chú ý', value: '3', icon: AlertCircle, color: 'bg-orange-500', change: '-2' }
  ];

  const myBadges = [
    { name: 'Hoàn thành mục tiêu', icon: Trophy, color: 'text-yellow-600' },
    { name: 'Làm việc nhóm', icon: Users, color: 'text-green-600' },
    { name: 'Đạt mục tiêu sớm', icon: Star, color: 'text-blue-600' }
  ];

  const topPerformers = [
    { name: 'Nguyễn Văn A', score: 1250, department: 'Kinh Doanh', rank: 1 },
    { name: 'Trần Thị B', score: 1180, department: 'Kỹ Thuật', rank: 2 },
    { name: 'Tôi', score: 1050, department: 'Marketing', rank: 3, isMe: true }
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="h-4 w-4 text-yellow-500" />;
      case 2: return <Medal className="h-4 w-4 text-gray-400" />;
      case 3: return <Award className="h-4 w-4 text-orange-500" />;
      default: return <Star className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section - Simplified */}
      <Card className="border-0 shadow-md bg-gradient-to-r from-indigo-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Chào {profile?.full_name || 'Admin'}! 👋
              </h2>
              <p className="text-indigo-700 mb-4">{randomQuote}</p>
              
              <div className="flex gap-3">
                <Button size="sm" variant="outline" className="text-purple-700 border-purple-200 hover:bg-purple-50">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Feedback
                </Button>
                <Dialog open={emotionalRewardsOpen} onOpenChange={setEmotionalRewardsOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="text-green-700 border-green-200 hover:bg-green-50">
                      <Heart className="h-4 w-4 mr-2" />
                      Gửi thưởng
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Thưởng cảm xúc</DialogTitle>
                    </DialogHeader>
                    <EmotionalRewards />
                  </DialogContent>
                </Dialog>
                <Button size="sm" variant="outline" className="text-yellow-700 border-yellow-200 hover:bg-yellow-50">
                  <Gift className="h-4 w-4 mr-2" />
                  Đổi quà
                </Button>
              </div>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg mb-2">
                <span className="text-white text-lg font-bold">#{rewardData.myRank}</span>
              </div>
              <div className="text-sm text-gray-600">Xếp hạng</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats - Simplified Layout */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Rewards */}
        <Card className="text-center">
          <CardContent className="p-4">
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Coins className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-yellow-700">{rewardData.okrCoins}</div>
            <div className="text-xs text-gray-600">OKR Coins</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-blue-700">{rewardData.trustPoints}</div>
            <div className="text-xs text-gray-600">Điểm Trust</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Heart className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-red-700">{rewardData.dedicationPoints}</div>
            <div className="text-xs text-gray-600">Điểm Cống hiến</div>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-4">
            <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-purple-700">#{rewardData.myRank}</div>
            <div className="text-xs text-gray-600">Xếp hạng</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Stats Cards - Cleaner Design */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {okrStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-xs text-green-600 font-medium">{stat.change}</span>
                </div>
                <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.title}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Two Column Layout for Better Organization */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Cycle Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="h-5 w-5 text-green-600" />
              Chu kỳ Q1 2024
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-1">76%</div>
                <div className="text-sm text-gray-600 mb-3">Tiến độ tổng thể</div>
                <Progress value={76} className="h-2" />
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center text-sm">
                <div>
                  <div className="text-lg font-bold text-orange-600">12</div>
                  <div className="text-gray-600">Ngày còn lại</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-600">5/8</div>
                  <div className="text-gray-600">Objectives</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* My Achievements - Simplified */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Award className="h-5 w-5 text-yellow-600" />
                Huy hiệu của tôi
              </CardTitle>
              <Dialog open={achievementsOpen} onOpenChange={setAchievementsOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Eye className="h-4 w-4 mr-1" />
                    Tất cả
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Tất cả huy hiệu</DialogTitle>
                  </DialogHeader>
                  <OKRAchievements />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              {myBadges.map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <div key={index} className="text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-2">
                      <Icon className={`h-6 w-6 ${badge.color}`} />
                    </div>
                    <div className="text-xs text-gray-600">{badge.name}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers - Simplified */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Top Performers
            </CardTitle>
            <Dialog open={leaderboardOpen} onOpenChange={setLeaderboardOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  <Eye className="h-4 w-4 mr-1" />
                  Xem tất cả
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Bảng xếp hạng</DialogTitle>
                </DialogHeader>
                <OKRLeaderboard />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topPerformers.map((person, index) => (
              <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                person.isMe ? 'bg-green-50 border border-green-200' : 'bg-gray-50'
              }`}>
                <div className="flex items-center space-x-3">
                  {getRankIcon(person.rank)}
                  <div>
                    <div className="font-medium text-gray-900">{person.name}</div>
                    <div className="text-sm text-gray-500">{person.department}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-blue-600">{person.score}</div>
                  <div className="text-xs text-gray-500">điểm</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Manager Section - Only if Manager */}
      {isManager && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Tổng quan theo phòng ban
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { dept: 'Kinh Doanh', progress: 85, objectives: 12 },
                { dept: 'Kỹ Thuật', progress: 72, objectives: 15 },
                { dept: 'Marketing', progress: 90, objectives: 8 },
                { dept: 'Nhân Sự', progress: 78, objectives: 6 }
              ].map((dept, index) => (
                <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-2">{dept.dept}</h3>
                  <div className="text-2xl font-bold text-green-600 mb-1">{dept.progress}%</div>
                  <Progress value={dept.progress} className="h-2 mb-2" />
                  <div className="text-xs text-gray-500">{dept.objectives} OKR</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
