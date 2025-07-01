
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Target, 
  TrendingUp, 
  Users,
  Calendar,
  Award,
  Trophy,
  MessageSquare,
  Heart,
  Eye,
  Coins,
  Crown,
  Medal,
  Sparkles,
  CheckCircle,
  BarChart3,
  Clock,
  Zap,
  Star
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
  
  // OKR-focused motivational quotes
  const okrMotivationalQuotes = [
    "🎯 Hãy tập trung vào mục tiêu quan trọng nhất hôm nay!",
    "⭐ Mỗi Key Result hoàn thành đều là một chiến thắng!",
    "🚀 OKR giúp bạn biến ước mơ thành hiện thực!",
    "💪 Sự kiên trì trong OKR sẽ mang lại thành công vượt trội!"
  ];
  const randomQuote = okrMotivationalQuotes[Math.floor(Math.random() * okrMotivationalQuotes.length)];

  // Data
  const rewardData = { okrCoins: 2850, trustPoints: 89, dedicationPoints: 92, myRank: 3 };
  const cycleProgress = 76;
  const daysLeft = 12;
  const completedObjectives = 5;
  const totalObjectives = 8;

  // Quarter information
  const currentQuarter = {
    name: "Q1 2024",
    progress: cycleProgress,
    startDate: "01/01/2024",
    endDate: "31/03/2024",
    daysLeft: daysLeft
  };

  const getCurrentDate = () => {
    const now = new Date();
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const months = ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6', 
                   'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];
    
    return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}, ${now.getFullYear()}`;
  };

  return (
    <div className="space-y-8">
      {/* Welcome Hero Section with OKR-focused content */}
      <Card className="border-0 shadow-xl overflow-hidden relative bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700">
        <CardContent className="p-0">
          {/* Decorative circles */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-white/10 rounded-full"></div>
          <div className="absolute top-10 -right-10 w-20 h-20 bg-white/5 rounded-full"></div>
          <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-white/5 rounded-full"></div>
          
          <div className="relative p-8 text-white">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <span className="text-white/80 text-sm font-medium">OKR Dashboard</span>
                </div>
                
                <h1 className="text-3xl font-bold mb-3 text-white">
                  Chào mừng đến với OKR, {profile?.full_name || 'Người dùng'}!
                </h1>
                
                <p className="text-white/90 text-lg mb-6 leading-relaxed">
                  {randomQuote}
                </p>
                
                <div className="flex items-center gap-2 text-white/80 text-sm mb-6">
                  <Clock className="h-4 w-4" />
                  <span>{getCurrentDate()}</span>
                </div>
                
                <div className="flex gap-3">
                  <Button size="sm" variant="secondary" className="bg-white/20 border-white/30 hover:bg-white/30 backdrop-blur-sm text-white hover:text-white">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Góp ý OKR
                  </Button>
                  <Dialog open={emotionalRewardsOpen} onOpenChange={setEmotionalRewardsOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="secondary" className="bg-white/20 border-white/30 hover:bg-white/30 backdrop-blur-sm text-white hover:text-white">
                        <Heart className="h-4 w-4 mr-2" />
                        Thưởng OKR
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Thưởng cảm xúc cho OKR</DialogTitle>
                      </DialogHeader>
                      <EmotionalRewards />
                    </DialogContent>
                  </Dialog>
                  <Button size="sm" className="bg-white text-blue-600 hover:bg-white/90 font-medium">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Báo cáo OKR →
                  </Button>
                </div>
              </div>
              
              {/* Quarter Information Badge */}
              <div className="text-center ml-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex flex-col items-center justify-center shadow-xl mb-3 border-4 border-white/30">
                  <span className="text-white text-xs font-medium">#{rewardData.myRank}</span>
                  <span className="text-white text-lg font-bold">Q1</span>
                </div>
                <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                  {currentQuarter.name}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current OKR Cycle Progress */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Calendar className="h-6 w-6 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-900">Chu kỳ OKR {currentQuarter.name}</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-5xl font-bold text-blue-600 mb-2">{currentQuarter.progress}%</div>
                <div className="text-gray-600 mb-3">Tiến độ OKR tổng thể</div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-blue-600 h-3 rounded-full transition-all duration-500" 
                    style={{ width: `${currentQuarter.progress}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-orange-600 mb-2">{currentQuarter.daysLeft}</div>
                <div className="text-gray-600 mb-3">Ngày còn lại</div>
                <Badge variant="outline" className="border-orange-200 text-orange-700 bg-orange-50">
                  Còn {currentQuarter.daysLeft} ngày
                </Badge>
              </div>
              <div className="text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">{completedObjectives}/{totalObjectives}</div>
                <div className="text-gray-600 mb-3">Objectives hoàn thành</div>
                <div className="flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                  <span className="text-sm text-green-600 font-medium">
                    {Math.round((completedObjectives/totalObjectives)*100)}% hoàn thành
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* OKR Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Coins className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="text-3xl font-bold text-yellow-700 mb-1">{rewardData.okrCoins.toLocaleString('vi-VN')}</div>
            <div className="text-sm text-gray-600">OKR Coins</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Heart className="h-6 w-6 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-blue-700 mb-1">{rewardData.trustPoints}</div>
            <div className="text-sm text-gray-600">Điểm Trust</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="h-6 w-6 text-red-600" />
            </div>
            <div className="text-3xl font-bold text-red-700 mb-1">{rewardData.dedicationPoints}</div>
            <div className="text-sm text-gray-600">Điểm Cống hiến</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Trophy className="h-6 w-6 text-purple-600" />
            </div>
            <div className="text-3xl font-bold text-purple-700 mb-1">#{rewardData.myRank}</div>
            <div className="text-sm text-gray-600">Xếp hạng OKR</div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My OKR Achievements */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <Award className="h-6 w-6 text-yellow-600" />
                <span>Huy hiệu OKR của tôi</span>
              </CardTitle>
              <Dialog open={achievementsOpen} onOpenChange={setAchievementsOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="hover:bg-yellow-50 border-yellow-200">
                    <Eye className="h-4 w-4 mr-2" />
                    Tất cả
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Tất cả huy hiệu OKR</DialogTitle>
                  </DialogHeader>
                  <OKRAchievements />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              {[
                { name: 'OKR Master', icon: Trophy, color: 'text-yellow-600', bg: 'bg-yellow-100' },
                { name: 'Team Alignment', icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
                { name: 'Key Result Hero', icon: Star, color: 'text-blue-600', bg: 'bg-blue-100' }
              ].map((badge, index) => {
                const Icon = badge.icon;
                return (
                  <div key={index} className="text-center">
                    <div className={`w-16 h-16 ${badge.bg} rounded-xl flex items-center justify-center mx-auto mb-3`}>
                      <Icon className={`h-8 w-8 ${badge.color}`} />
                    </div>
                    <div className="text-xs text-gray-600 font-medium">{badge.name}</div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Top OKR Performers */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <TrendingUp className="h-6 w-6 text-blue-600" />
                <span>Top OKR Performers</span>
              </CardTitle>
              <Dialog open={leaderboardOpen} onOpenChange={setLeaderboardOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline" className="hover:bg-blue-50 border-blue-200">
                    <Eye className="h-4 w-4 mr-2" />
                    Bảng xếp hạng
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Bảng xếp hạng OKR</DialogTitle>
                  </DialogHeader>
                  <OKRLeaderboard />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Nguyễn Văn A', score: 1250, department: 'Kinh Doanh', rank: 1, isMe: false, okrCompleted: 8 },
                { name: 'Trần Thị B', score: 1180, department: 'Kỹ Thuật', rank: 2, isMe: false, okrCompleted: 7 },
                { name: 'Tôi', score: 1050, department: 'Marketing', rank: 3, isMe: true, okrCompleted: 5 }
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
                      <div className="text-sm text-gray-500">{person.department} • {person.okrCompleted} OKR hoàn thành</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-blue-600">{person.score.toLocaleString('vi-VN')}</div>
                    <div className="text-xs text-gray-500">OKR điểm</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Manager OKR Overview */}
      {isManager && (
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-blue-600" />
              <span>Tổng quan OKR theo phòng ban</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { dept: 'Kinh Doanh', progress: 85, okrs: 12, keyResults: 48, color: 'bg-blue-500' },
                { dept: 'Kỹ Thuật', progress: 72, okrs: 15, keyResults: 60, color: 'bg-green-500' },
                { dept: 'Marketing', progress: 90, okrs: 8, keyResults: 32, color: 'bg-purple-500' },
                { dept: 'Nhân Sự', progress: 78, okrs: 6, keyResults: 24, color: 'bg-orange-500' }
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
                  <div className="text-sm opacity-90">{dept.okrs} OKR • {dept.keyResults} KR</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
