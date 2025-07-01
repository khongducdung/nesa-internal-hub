
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
  Medal,
  Sparkles,
  Zap
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
  
  // Motivational quotes
  const motivationalQuotes = [
    "🔥 Bạn đang trên đường chinh phục những đỉnh cao mới!",
    "⭐ Thành công không phải là điểm đến, mà là hành trình!",
    "🚀 Hôm nay bạn đã làm gì để gần hơn với mục tiêu?",
    "💪 Kiên trì và nỗ lực sẽ mang lại kết quả tuyệt vời!"
  ];
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  // Data
  const rewardData = { okrCoins: 2850, trustPoints: 89, dedicationPoints: 92, myRank: 3 };
  const cycleProgress = 76;
  const daysLeft = 12;
  const completedObjectives = 5;
  const totalObjectives = 8;

  return (
    <div className="space-y-8">
      {/* Welcome Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-8 text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-purple-600/90"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold mb-1">Chào {profile?.full_name || 'Admin'}! 👋</h1>
                  <p className="text-blue-100 text-lg">{randomQuote}</p>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <Button size="sm" className="bg-white/20 border-white/30 hover:bg-white/30 backdrop-blur-sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Feedback
                </Button>
                <Dialog open={emotionalRewardsOpen} onOpenChange={setEmotionalRewardsOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="bg-white/20 border-white/30 hover:bg-white/30 backdrop-blur-sm">
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
                <Button size="sm" className="bg-white/20 border-white/30 hover:bg-white/30 backdrop-blur-sm">
                  <Gift className="h-4 w-4 mr-2" />
                  Đổi quà
                </Button>
              </div>
            </div>
            
            {/* Rank Badge */}
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl mb-3 border-4 border-white/30">
                <span className="text-white text-xl font-bold">#{rewardData.myRank}</span>
              </div>
              <Badge className="bg-white/20 text-white border-white/30">Xếp hạng</Badge>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 opacity-20">
          <Sparkles className="h-8 w-8 text-white" />
        </div>
        <div className="absolute bottom-4 left-4 opacity-20">
          <Zap className="h-6 w-6 text-white" />
        </div>
      </div>

      {/* Current Cycle Progress - Featured */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Calendar className="h-6 w-6 text-green-600" />
              <h2 className="text-2xl font-bold text-gray-900">Chu kỳ Q1 2024</h2>
            </div>
            
            <div className="flex items-center justify-center gap-8 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600 mb-1">{cycleProgress}%</div>
                <div className="text-sm text-gray-600">Tiến độ tổng thể</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-4xl font-bold text-orange-600 mb-1">{daysLeft}</div>
                <div className="text-sm text-gray-600">Ngày còn lại</div>
              </div>
              <div className="w-px h-12 bg-gray-300"></div>
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-1">{completedObjectives}/{totalObjectives}</div>
                <div className="text-sm text-gray-600">Objectives</div>
              </div>
            </div>
            
            <div className="max-w-md mx-auto">
              <Progress value={cycleProgress} className="h-4 mb-2" />
              <p className="text-sm text-gray-500">Bạn đang làm rất tốt! Tiếp tục phấn đấu!</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid - Clean & Simple */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Coins className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-yellow-700 mb-1">{rewardData.okrCoins}</div>
            <div className="text-sm text-gray-600">OKR Coins</div>
          </CardContent>
        </Card>

        <Card className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-700 mb-1">{rewardData.trustPoints}</div>
            <div className="text-sm text-gray-600">Điểm Trust</div>
          </CardContent>
        </Card>

        <Card className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-red-700 mb-1">{rewardData.dedicationPoints}</div>
            <div className="text-sm text-gray-600">Điểm Cống hiến</div>
          </CardContent>
        </Card>

        <Card className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-700 mb-1">#{rewardData.myRank}</div>
            <div className="text-sm text-gray-600">Xếp hạng</div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Achievements */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <Award className="h-6 w-6 text-yellow-600" />
                <span>Huy hiệu của tôi</span>
              </CardTitle>
              <Dialog open={achievementsOpen} onOpenChange={setAchievementsOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="hover:bg-yellow-50">
                    <Eye className="h-4 w-4 mr-2" />
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
            <div className="grid grid-cols-3 gap-6">
              {[
                { name: 'Hoàn thành mục tiêu', icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-100' },
                { name: 'Làm việc nhóm', icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
                { name: 'Đạt mục tiêu sớm', icon: Star, color: 'text-blue-600', bg: 'bg-blue-100' }
              ].map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <div key={index} className="text-center">
                    <div className={`w-16 h-16 ${badge.bg} rounded-full flex items-center justify-center mx-auto mb-3`}>
                      <Icon className={`h-8 w-8 ${badge.color}`} />
                    </div>
                    <div className="text-xs text-gray-600 font-medium">{badge.name}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card className="border-0 shadow-md">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                <span>Top Performers</span>
              </CardTitle>
              <Dialog open={leaderboardOpen} onOpenChange={setLeaderboardOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="hover:bg-blue-50">
                    <Eye className="h-4 w-4 mr-2" />
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
            <div className="space-y-4">
              {[
                { name: 'Nguyễn Văn A', score: 1250, department: 'Kinh Doanh', rank: 1, isMe: false },
                { name: 'Trần Thị B', score: 1180, department: 'Kỹ Thuật', rank: 2, isMe: false },
                { name: 'Tôi', score: 1050, department: 'Marketing', rank: 3, isMe: true }
              ].map((person, index) => (
                <div key={index} className={`flex items-center justify-between p-4 rounded-xl ${
                  person.isMe ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'
                }`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                      {person.rank === 1 && <Crown className="h-5 w-5 text-white" />}
                      {person.rank === 2 && <Medal className="h-5 w-5 text-white" />}
                      {person.rank === 3 && <Award className="h-5 w-5 text-white" />}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{person.name}</div>
                      <div className="text-sm text-gray-500">{person.department}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600">{person.score}</div>
                    <div className="text-xs text-gray-500">điểm</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manager Section - Clean */}
      {isManager && (
        <Card className="border-0 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <span>Tổng quan theo phòng ban</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { dept: 'Kinh Doanh', progress: 85, objectives: 12, color: 'bg-blue-500' },
                { dept: 'Kỹ Thuật', progress: 72, objectives: 15, color: 'bg-green-500' },
                { dept: 'Marketing', progress: 90, objectives: 8, color: 'bg-purple-500' },
                { dept: 'Nhân Sự', progress: 78, objectives: 6, color: 'bg-orange-500' }
              ].map((dept, index) => (
                <div key={index} className={`text-center p-6 ${dept.color} rounded-xl text-white`}>
                  <h3 className="font-semibold text-lg mb-3">{dept.dept}</h3>
                  <div className="text-3xl font-bold mb-2">{dept.progress}%</div>
                  <div className="w-full bg-white/20 rounded-full h-2 mb-3">
                    <div 
                      className="bg-white h-2 rounded-full transition-all" 
                      style={{ width: `${dept.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-sm opacity-90">{dept.objectives} OKR</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
