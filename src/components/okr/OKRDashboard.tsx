
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  Legend
} from 'recharts';
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
  Activity,
  Building2,
  PieChart as PieChartIcon,
  Settings
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useOKRAnalytics } from '@/hooks/useOKRAnalytics';
import { OKRAchievements } from './OKRAchievements';
import { OKRLeaderboard } from './OKRLeaderboard';
import { EmotionalRewards } from './EmotionalRewards';
import { CompanyOKRView } from './CompanyOKRView';
import { MyOKRTasks } from './MyOKRTasks';
import { OKRProgressAndReporting } from './OKRProgressAndReporting';
import { OKRSettings } from './OKRSettings';

const chartConfig = {
  company: {
    label: 'Công ty',
    color: '#3b82f6',
  },
  department: {
    label: 'Phòng ban',
    color: '#10b981',
  },
  individual: {
    label: 'Cá nhân',
    color: '#f59e0b',
  },
  progress: {
    label: 'Tiến độ',
    color: '#8b5cf6',
  },
};

export function OKRDashboard() {
  const { profile, isAdmin } = useAuth();
  const { analytics, loading } = useOKRAnalytics();
  const [achievementsOpen, setAchievementsOpen] = useState(false);
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [emotionalRewardsOpen, setEmotionalRewardsOpen] = useState(false);
  
  const isManager = true;
  
  // Motivational quotes
  const motivationalQuotes = [
    "🎯 Hôm nay bạn đã tiến gần hơn đến mục tiêu của mình!",
    "⭐ Mỗi bước nhỏ đều dẫn đến thành công lớn!",
    "🚀 Kiên trì và nỗ lực sẽ mang lại kết quả tuyệt vời!",
    "💪 Bạn có khả năng vượt qua mọi thử thách!"
  ];
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

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

  if (loading || !analytics) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-64 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const statusColors = {
    'Đúng tiến độ': '#22c55e',
    'Cần chú ý': '#f59e0b', 
    'Chậm tiến độ': '#ef4444',
    'Hoàn thành': '#3b82f6'
  };

  const radialData = analytics.departmentBreakdown.map((dept, index) => ({
    name: dept.name,
    progress: dept.progress,
    fill: `hsl(${200 + index * 40}, 70%, 50%)`
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          {/* Navigation Tabs */}
          <div className="mb-8">
            <TabsList className="w-full h-12 items-center justify-start rounded-lg bg-white p-1 shadow-sm border border-gray-200 grid grid-cols-4">
              <TabsTrigger 
                value="dashboard" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Tổng quan
              </TabsTrigger>
              
              <TabsTrigger 
                value="company-okr" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <Building2 className="h-4 w-4 mr-2" />
                OKR Công ty
              </TabsTrigger>
              
              <TabsTrigger 
                value="my-okrs" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <Target className="h-4 w-4 mr-2" />
                OKR của tôi
              </TabsTrigger>
              
              {isManager && (
                <TabsTrigger 
                  value="progress-reporting" 
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Tiến độ & Báo cáo
                </TabsTrigger>
              )}

              {isAdmin && (
                <TabsTrigger 
                  value="settings" 
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Cài đặt OKR
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          {/* Tab Contents */}
          <div className="space-y-6">
            <TabsContent value="dashboard" className="m-0 space-y-8">
              {/* Welcome Hero Section */}
              <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                          <Target className="h-8 w-8 text-white" />
                        </div>
                        <div>
                          <h1 className="text-3xl font-bold mb-2">Chào {profile?.full_name || 'Admin'}! 👋</h1>
                          <p className="text-blue-100 text-lg">{randomQuote}</p>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button size="sm" variant="secondary" className="bg-white/20 border-white/30 hover:bg-white/30 backdrop-blur-sm text-white">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Feedback
                        </Button>
                        <Dialog open={emotionalRewardsOpen} onOpenChange={setEmotionalRewardsOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="secondary" className="bg-white/20 border-white/30 hover:bg-white/30 backdrop-blur-sm text-white">
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
                      </div>
                    </div>
                    
                    {/* Quarter Information Badge */}
                    <div className="text-center">
                      <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex flex-col items-center justify-center shadow-xl mb-3 border-4 border-white/30">
                        <span className="text-white text-xs font-medium">#{rewardData.myRank}</span>
                        <span className="text-white text-lg font-bold">Q1</span>
                      </div>
                      <Badge className="bg-white/20 text-white border-white/30 hover:bg-white/30">
                        {currentQuarter.name}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Key Metrics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-blue-600 font-medium mb-1">Tổng OKRs</p>
                        <p className="text-3xl font-bold text-blue-900">{analytics.totalOKRs}</p>
                        <div className="flex items-center mt-2">
                          <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                          <span className="text-xs text-green-600">+12% tháng này</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Target className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-green-600 font-medium mb-1">Tiến độ TB</p>
                        <p className="text-3xl font-bold text-green-900">{analytics.avgProgress}%</p>
                        <div className="w-full bg-green-200 rounded-full h-1.5 mt-2">
                          <div 
                            className="bg-green-600 h-1.5 rounded-full transition-all duration-500" 
                            style={{ width: `${analytics.avgProgress}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Activity className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-purple-600 font-medium mb-1">Đúng tiến độ</p>
                        <p className="text-3xl font-bold text-purple-900">{analytics.onTrackCount}</p>
                        <div className="flex items-center mt-2">
                          <CheckCircle className="h-3 w-3 text-purple-600 mr-1" />
                          <span className="text-xs text-purple-600">Tốt</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-orange-600 font-medium mb-1">Hoàn thành</p>
                        <p className="text-3xl font-bold text-orange-900">{analytics.completedCount}</p>
                        <div className="flex items-center mt-2">
                          <Trophy className="h-3 w-3 text-orange-600 mr-1" />
                          <span className="text-xs text-orange-600">Xuất sắc</span>
                        </div>
                      </div>
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Trophy className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Progress Trend Chart */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                        <Activity className="h-4 w-4 text-white" />
                      </div>
                      Xu hướng Tiến độ
                      <Badge variant="outline" className="ml-auto">Real-time</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-80">
                      <LineChart data={analytics.progressTrend}>
                        <defs>
                          <linearGradient id="companyGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="departmentGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="individualGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200/50" />
                        <XAxis 
                          dataKey="month" 
                          className="text-gray-600"
                          tick={{ fontSize: 12 }}
                          axisLine={false}
                        />
                        <YAxis 
                          className="text-gray-600"
                          tick={{ fontSize: 12 }}
                          axisLine={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Area 
                          type="monotone" 
                          dataKey="company" 
                          stroke="#3b82f6" 
                          fill="url(#companyGradient)"
                          strokeWidth={3}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="department" 
                          stroke="#10b981" 
                          fill="url(#departmentGradient)"
                          strokeWidth={3}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="individual" 
                          stroke="#f59e0b" 
                          fill="url(#individualGradient)"
                          strokeWidth={3}
                        />
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Status Distribution */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                        <PieChartIcon className="h-4 w-4 text-white" />
                      </div>
                      Phân bố Trạng thái
                      <Badge variant="outline" className="ml-auto">Live</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-80">
                      <PieChart>
                        <defs>
                          {analytics.statusDistribution.map((entry, index) => (
                            <linearGradient key={index} id={`gradient-${index}`} x1="0" y1="0" x2="1" y2="1">
                              <stop offset="0%" stopColor={entry.color} stopOpacity={1}/>
                              <stop offset="100%" stopColor={entry.color} stopOpacity={0.8}/>
                            </linearGradient>
                          ))}
                        </defs>
                        <Pie
                          data={analytics.statusDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          innerRadius={40}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {analytics.statusDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={`url(#gradient-${index})`} />
                          ))}
                        </Pie>
                        <ChartTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white p-3 shadow-lg rounded-lg border border-gray-200 backdrop-blur-sm">
                                  <p className="font-medium">{payload[0].payload.name}</p>
                                  <p className="text-sm text-gray-600">{payload[0].value}%</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend 
                          verticalAlign="bottom" 
                          height={36}
                          formatter={(value, entry) => (
                            <span style={{ color: entry.color }} className="font-medium">{value}</span>
                          )}
                        />
                      </PieChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Departmental Performance */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-white" />
                      </div>
                      Hiệu suất Phòng ban
                      <Badge variant="outline" className="ml-auto">Updated</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-80">
                      <BarChart data={analytics.departmentBreakdown} layout="horizontal">
                        <defs>
                          <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                            <stop offset="0%" stopColor="#10b981" stopOpacity={1}/>
                            <stop offset="100%" stopColor="#34d399" stopOpacity={0.8}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200/50" />
                        <XAxis 
                          type="number" 
                          className="text-gray-600"
                          tick={{ fontSize: 12 }}
                          axisLine={false}
                        />
                        <YAxis 
                          type="category" 
                          dataKey="name" 
                          className="text-gray-600"
                          tick={{ fontSize: 12 }}
                          width={80}
                          axisLine={false}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar 
                          dataKey="progress" 
                          fill="url(#barGradient)"
                          radius={[0, 4, 4, 0]}
                        />
                      </BarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>

                {/* Radial Progress Chart */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                        <Target className="h-4 w-4 text-white" />
                      </div>
                      Tiến độ Tổng quan
                      <Badge variant="outline" className="ml-auto">360°</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-80">
                      <RadialBarChart 
                        cx="50%" 
                        cy="50%" 
                        innerRadius="20%" 
                        outerRadius="80%" 
                        data={radialData}
                      >
                        <RadialBar 
                          dataKey="progress" 
                          cornerRadius={10} 
                          fill="#8884d8"
                        />
                        <ChartTooltip 
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              return (
                                <div className="bg-white/95 backdrop-blur-sm p-3 shadow-lg rounded-lg border border-gray-200">
                                  <p className="font-medium">{payload[0].payload.name}</p>
                                  <p className="text-sm text-gray-600">{payload[0].value}%</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Legend 
                          iconSize={10}
                          layout="vertical"
                          verticalAlign="middle"
                          align="right"
                        />
                      </RadialBarChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Coins className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-yellow-700 mb-1">{rewardData.okrCoins}</div>
                    <div className="text-sm text-gray-600">OKR Coins</div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Heart className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-blue-700 mb-1">{rewardData.trustPoints}</div>
                    <div className="text-sm text-gray-600">Điểm Trust</div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-red-700 mb-1">{rewardData.dedicationPoints}</div>
                    <div className="text-sm text-gray-600">Điểm Cống hiến</div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 group">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Crown className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-3xl font-bold text-purple-700 mb-1">#{rewardData.myRank}</div>
                    <div className="text-sm text-gray-600">Xếp hạng</div>
                  </CardContent>
                </Card>
              </div>

              {/* Two Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* My Achievements */}
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                          <Award className="h-4 w-4 text-white" />
                        </div>
                        <span>Huy hiệu của tôi</span>
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
                        { name: 'Hoàn thành mục tiêu', icon: Trophy, color: 'text-yellow-600', bg: 'bg-gradient-to-br from-yellow-100 to-yellow-200' },
                        { name: 'Làm việc nhóm', icon: Users, color: 'text-green-600', bg: 'bg-gradient-to-br from-green-100 to-green-200' },
                        { name: 'Đạt mục tiêu sớm', icon: Crown, color: 'text-blue-600', bg: 'bg-gradient-to-br from-blue-100 to-blue-200' }
                      ].map((badge, index) => {
                        const Icon = badge.icon;
                        return (
                          <div key={index} className="text-center group hover:scale-105 transition-transform">
                            <div className={`w-16 h-16 ${badge.bg} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md group-hover:shadow-lg transition-all`}>
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
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                          <TrendingUp className="h-4 w-4 text-white" />
                        </div>
                        <span>Top Performers</span>
                      </CardTitle>
                      <Dialog open={leaderboardOpen} onOpenChange={setLeaderboardOpen}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" className="hover:bg-blue-50 border-blue-200">
                            <Eye className="h-4 w-4 mr-2" />
                            Xem tất cả
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
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
                        <div key={index} className={`flex items-center justify-between p-4 rounded-xl transition-all hover:scale-[1.02] ${
                          person.isMe ? 'bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200' : 'bg-gradient-to-r from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200'
                        }`}>
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-md">
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

              {/* Manager Section */}
              {isManager && (
                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Building2 className="h-4 w-4 text-white" />
                      </div>
                      <span>Tổng quan theo phòng ban</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {[
                        { dept: 'Kinh Doanh', progress: 85, objectives: 12, color: 'bg-gradient-to-br from-blue-500 to-blue-600' },
                        { dept: 'Kỹ Thuật', progress: 72, objectives: 15, color: 'bg-gradient-to-br from-green-500 to-green-600' },
                        { dept: 'Marketing', progress: 90, objectives: 8, color: 'bg-gradient-to-br from-purple-500 to-purple-600' },
                        { dept: 'Nhân Sự', progress: 78, objectives: 6, color: 'bg-gradient-to-br from-orange-500 to-orange-600' }
                      ].map((dept, index) => (
                        <div key={index} className={`text-center p-6 ${dept.color} rounded-xl text-white shadow-lg hover:shadow-xl transition-all hover:scale-105`}>
                          <h3 className="font-semibold text-lg mb-3">{dept.dept}</h3>
                          <div className="text-3xl font-bold mb-2">{dept.progress}%</div>
                          <div className="w-full bg-white/20 rounded-full h-2 mb-3">
                            <div 
                              className="bg-white h-2 rounded-full transition-all duration-1000" 
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

              {/* Performance Summary */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <Award className="h-4 w-4 text-white" />
                    </div>
                    <span>Tóm tắt Hiệu suất</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl border border-emerald-200 hover:shadow-md transition-all">
                      <div className="text-3xl font-bold text-emerald-700 mb-2">
                        {analytics.performanceMetrics.highPerformers}
                      </div>
                      <div className="text-sm text-emerald-600 font-medium mb-3">Nhân viên xuất sắc</div>
                      <Progress value={75} className="h-2" />
                    </div>
                    
                    <div className="text-center p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl border border-amber-200 hover:shadow-md transition-all">
                      <div className="text-3xl font-bold text-amber-700 mb-2">
                        {analytics.performanceMetrics.needsAttention}
                      </div>
                      <div className="text-sm text-amber-600 font-medium mb-3">Cần cải thiện</div>
                      <Progress value={45} className="h-2" />
                    </div>
                    
                    <div className="text-center p-6 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border border-indigo-200 hover:shadow-md transition-all">
                      <div className="text-3xl font-bold text-indigo-700 mb-2">
                        +{analytics.performanceMetrics.improvement}%
                      </div>
                      <div className="text-sm text-indigo-600 font-medium mb-3">Cải thiện tháng này</div>
                      <Progress value={analytics.performanceMetrics.improvement * 5} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="company-okr" className="m-0">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <CompanyOKRView />
              </div>
            </TabsContent>

            <TabsContent value="my-okrs" className="m-0">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <MyOKRTasks />
              </div>
            </TabsContent>

            {isManager && (
              <TabsContent value="progress-reporting" className="m-0">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <OKRProgressAndReporting />
                </div>
              </TabsContent>
            )}

            {isAdmin && (
              <TabsContent value="settings" className="m-0">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <OKRSettings />
                </div>
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
