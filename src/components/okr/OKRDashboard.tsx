
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
  Flame,
  Zap,
  Plus,
  MessageSquare,
  Gift,
  Heart,
  HandHeart,
  Coins,
  ArrowRight,
  Sparkles,
  Medal,
  Crown,
  Eye,
  Send
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { OKRAchievements } from './OKRAchievements';
import { OKRLeaderboard } from './OKRLeaderboard';
import { EmotionalRewards } from './EmotionalRewards';

export function OKRDashboard() {
  const { profile } = useAuth();
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [emotionalRewardsOpen, setEmotionalRewardsOpen] = useState(false);
  
  // Mock data - sẽ thay thế bằng API call
  const isManager = true; // Tạm thời set true
  
  const okrStats = [
    {
      title: 'Tổng Objectives toàn công ty',
      value: '45',
      icon: Target,
      color: 'from-blue-500 to-blue-600',
      change: '+8 so với quý trước',
      changeType: 'increase'
    },
    {
      title: 'Đang thực hiện',
      value: '32',
      icon: TrendingUp,
      color: 'from-green-500 to-green-600',
      change: '+5 so với quý trước',
      changeType: 'increase'
    },
    {
      title: 'Hoàn thành',
      value: '28',
      icon: CheckCircle,
      color: 'from-purple-500 to-purple-600',
      change: '+7 so với quý trước',
      changeType: 'increase'
    },
    {
      title: 'Cần chú ý',
      value: '3',
      icon: AlertCircle,
      color: 'from-orange-500 to-orange-600',
      change: '-2 so với quý trước',
      changeType: 'decrease'
    }
  ];

  // Câu nói khích lệ
  const motivationalQuotes = [
    "🔥 Bạn đang trên đường chinh phục những đỉnh cao mới!",
    "⭐ Thành công không phải là điểm đến, mà là hành trình!",
    "🚀 Hôm nay bạn đã làm gì để gần hơn với mục tiêu?",
    "💪 Kiên trì và nỗ lực sẽ mang lại kết quả tuyệt vời!"
  ];

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  // Mock data for rewards
  const rewardData = {
    okrCoins: 2850,
    trustPoints: 89,
    dedicationPoints: 92,
    myRank: 3,
    totalParticipants: 45
  };

  // Mock data for badges
  const myBadges = [
    { name: 'Người hoàn thành mục tiêu', icon: Trophy, color: 'from-yellow-400 to-yellow-600' },
    { name: 'Làm việc nhóm xuất sắc', icon: Award, color: 'from-green-400 to-green-600' },
    { name: 'Đạt mục tiêu sớm', icon: Star, color: 'from-blue-400 to-blue-600' }
  ];

  // Mock data for top performers
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
    <div className="space-y-8">
      {/* Motivational Welcome Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-10 rounded-3xl"></div>
        <Card className="border-0 shadow-lg bg-gradient-to-r from-white via-blue-50 to-indigo-50 relative">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Sparkles className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Chào {profile?.full_name || 'Admin'}! 👋
                    </h2>
                    <p className="text-gray-600">Sẵn sàng chinh phục mục tiêu hôm nay?</p>
                  </div>
                </div>
                <p className="text-lg text-indigo-700 font-medium mb-6">{randomQuote}</p>
                
                {/* Quick Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-lg">
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo OKR mới
                  </Button>
                  <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Feedback
                  </Button>
                  <Dialog open={emotionalRewardsOpen} onOpenChange={setEmotionalRewardsOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-green-200 text-green-700 hover:bg-green-50">
                        <Heart className="h-4 w-4 mr-2" />
                        Gửi thưởng cảm xúc
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Thưởng cảm xúc</DialogTitle>
                      </DialogHeader>
                      <EmotionalRewards />
                    </DialogContent>
                  </Dialog>
                  <Button variant="outline" className="border-yellow-200 text-yellow-700 hover:bg-yellow-50">
                    <Gift className="h-4 w-4 mr-2" />
                    Đổi quà
                  </Button>
                </div>
              </div>
              
              <div className="hidden lg:block">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl">
                    <Flame className="h-16 w-16 text-white animate-pulse" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">#{rewardData.myRank}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rewards & Points Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200/50 hover:shadow-lg transition-all">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Coins className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-yellow-700 mb-1">{rewardData.okrCoins}</div>
            <div className="text-sm text-yellow-600 font-medium">OKR Coins</div>
            <Button variant="ghost" size="sm" className="mt-2 text-yellow-700 hover:bg-yellow-100">
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200/50 hover:shadow-lg transition-all">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <HandHeart className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-blue-700 mb-1">{rewardData.trustPoints}</div>
            <div className="text-sm text-blue-600 font-medium">Điểm Trust</div>
            <Button variant="ghost" size="sm" className="mt-2 text-blue-700 hover:bg-blue-100">
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200/50 hover:shadow-lg transition-all">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-red-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-red-700 mb-1">{rewardData.dedicationPoints}</div>
            <div className="text-sm text-red-600 font-medium">Điểm Cống hiến</div>
            <Button variant="ghost" size="sm" className="mt-2 text-red-700 hover:bg-red-100">
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-purple-200/50 hover:shadow-lg transition-all">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-purple-700 mb-1">#{rewardData.myRank}</div>
            <div className="text-sm text-purple-600 font-medium">Xếp hạng</div>
            <Dialog open={leaderboardOpen} onOpenChange={setLeaderboardOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="mt-2 text-purple-700 hover:bg-purple-100">
                  <Eye className="h-3 w-3 mr-1" />
                  Chi tiết
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Bảng xếp hạng</DialogTitle>
                </DialogHeader>
                <OKRLeaderboard />
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>

      {/* My Achievements Section */}
      <Card className="shadow-xl border-0 bg-gradient-to-r from-white via-yellow-50 to-orange-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <Award className="h-5 w-5 text-white" />
              </div>
              Huy hiệu của tôi
            </CardTitle>
            <Dialog open={achievementsOpen} onOpenChange={setAchievementsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-yellow-300 text-yellow-700 hover:bg-yellow-50">
                  <Eye className="h-4 w-4 mr-2" />
                  Xem tất cả
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
          <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
            {myBadges.map((badge, index) => {
              const Icon = badge.icon;
              return (
                <div key={index} className="text-center group hover:scale-105 transition-transform">
                  <div className={`w-16 h-16 bg-gradient-to-br ${badge.color} rounded-full flex items-center justify-center mx-auto mb-2 shadow-lg group-hover:shadow-xl transition-shadow`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-xs text-gray-600 font-medium">{badge.name}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Top Performers Mini Leaderboard */}
      <Card className="shadow-xl border-0 bg-gradient-to-r from-white via-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-white" />
              </div>
              Top Performers
            </CardTitle>
            <Dialog open={leaderboardOpen} onOpenChange={setLeaderboardOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
                  <Eye className="h-4 w-4 mr-2" />
                  Xem bảng xếp hạng
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Bảng xếp hạng đầy đủ</DialogTitle>
                </DialogHeader>
                <OKRLeaderboard />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {topPerformers.map((person, index) => (
              <div key={index} className={`flex items-center justify-between p-4 rounded-xl transition-all hover:shadow-md ${
                person.isMe ? 'bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200' : 'bg-white/70 hover:bg-white'
              }`}>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(person.rank)}
                  </div>
                  <div>
                    <div className={`font-medium ${person.isMe ? 'text-green-800' : 'text-gray-900'}`}>
                      {person.name}
                    </div>
                    <div className="text-sm text-gray-500">{person.department}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-blue-600 text-lg">{person.score}</div>
                  <div className="text-xs text-gray-500">điểm</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {okrStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="hover:shadow-xl transition-all duration-300 hover:scale-105 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-2">
                      {stat.title}
                    </p>
                    <p className="text-4xl font-bold text-gray-900 mb-2">
                      {stat.value}
                    </p>
                    <p className={`text-sm font-medium flex items-center ${
                      stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stat.change}
                    </p>
                  </div>
                  <div className={`bg-gradient-to-br ${stat.color} p-4 rounded-2xl shadow-xl`}>
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Current Cycle Progress */}
      <Card className="shadow-xl border-0 bg-gradient-to-r from-white via-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            Chu kỳ hiện tại - Q1 2024
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <span className="text-white text-3xl font-bold">76%</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Tổng tiến độ</h3>
              <Progress value={76} className="w-full h-3 bg-gray-200" />
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <span className="text-white text-3xl font-bold">12</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Ngày còn lại</h3>
              <div className="text-sm text-gray-600">Kết thúc 31/03/2024</div>
            </div>
            
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <span className="text-white text-xl font-bold">5/8</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Objectives</h3>
              <div className="text-sm text-gray-600">Đã hoàn thành</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Manager-specific sections */}
      {isManager && (
        <Card className="shadow-xl border-0 bg-gradient-to-r from-white via-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              Tổng quan OKR theo phòng ban
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { dept: 'Kinh Doanh', progress: 85, objectives: 12, color: 'from-blue-500 to-blue-600' },
                { dept: 'Kỹ Thuật', progress: 72, objectives: 15, color: 'from-green-500 to-green-600' },
                { dept: 'Marketing', progress: 90, objectives: 8, color: 'from-purple-500 to-purple-600' },
                { dept: 'Nhân Sự', progress: 78, objectives: 6, color: 'from-orange-500 to-orange-600' }
              ].map((dept, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:scale-105 border-0 shadow-md bg-gradient-to-br from-white to-gray-50">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 bg-gradient-to-br ${dept.color} rounded-2xl flex items-center justify-center mb-4 shadow-lg`}>
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900 mb-3">{dept.dept}</h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Tiến độ</span>
                        <span className="text-lg font-bold text-green-600">{dept.progress}%</span>
                      </div>
                      <Progress value={dept.progress} className="h-3" />
                      <p className="text-sm text-gray-500">{dept.objectives} OKR đang thực hiện</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
