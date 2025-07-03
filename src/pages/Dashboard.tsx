import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { EmployeeJobDescription } from '@/components/dashboard/EmployeeJobDescription';
import { EmployeeTrainingDashboard } from '@/components/dashboard/EmployeeTrainingDashboard';
import { AdminDashboardSection } from '@/components/dashboard/AdminDashboardSection';
import { EmployeeDashboardSection } from '@/components/dashboard/EmployeeDashboardSection';
import { OKRLeaderboardSection } from '@/components/dashboard/OKRLeaderboardSection';
import { CompetencyFrameworkSection } from '@/components/dashboard/CompetencyFrameworkSection';
import { RecentNotificationsSection } from '@/components/dashboard/RecentNotificationsSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { Clock, TrendingUp, Crown, Briefcase } from 'lucide-react';

export default function Dashboard() {
  const { user, profile, isSuperAdmin, isAdmin } = useAuth();

  const getCurrentDate = () => {
    const now = new Date();
    const days = ['Chủ Nhật', 'Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
    const months = ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4', 'tháng 5', 'tháng 6', 
                   'tháng 7', 'tháng 8', 'tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'];
    
    return `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]}, ${now.getFullYear()}`;
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  };

  const motivationalQuotes = [
    "🎯 Hôm nay là một ngày tuyệt vời để đạt được mục tiêu!",
    "⭐ Sẵn sáng cho một ngày làm việc hiệu quả",
    "🚀 Cùng nhau xây dựng một tương lai tốt đẹp!",
    "💪 Mỗi ngày là một cơ hội mới để phát triển!",
    "🌟 Thành công đến từ sự kiên trì và nỗ lực không ngừng",
    "🎨 Hãy sáng tạo và làm điều gì đó có ý nghĩa hôm nay"
  ];
  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const getRoleTitle = () => {
    if (isSuperAdmin) return 'Chủ tịch công ty';
    if (isAdmin) return 'Giám đốc điều hành';
    return 'Nhân viên';
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Hero Welcome Section */}
        <Card className="border-0 shadow-xl overflow-hidden relative bg-gradient-to-r from-primary via-primary/90 to-primary/80">
          <CardContent className="p-0">
            {/* Decorative elements */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-white/10 rounded-full"></div>
            <div className="absolute top-10 -right-10 w-20 h-20 bg-white/5 rounded-full"></div>
            <div className="absolute -bottom-10 -left-10 w-20 h-20 bg-white/5 rounded-full"></div>
            
            <div className="relative p-8 text-white">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      {isSuperAdmin ? <Crown className="h-6 w-6 text-white" /> : 
                       isAdmin ? <Briefcase className="h-6 w-6 text-white" /> : 
                       <TrendingUp className="h-6 w-6 text-white" />}
                    </div>
                    <div>
                      <span className="text-white/80 text-sm font-medium block">{getGreeting()}</span>
                      <span className="text-white/60 text-xs">{getRoleTitle()}</span>
                    </div>
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-3 text-white">
                    Chào mừng trở lại, {profile?.full_name || 'Người dùng'}!
                  </h1>
                  
                  <p className="text-white/90 text-lg mb-6 leading-relaxed">
                    {randomQuote}
                  </p>
                  
                  <div className="flex items-center gap-2 text-white/80 text-sm mb-6">
                    <Clock className="h-4 w-4" />
                    <span>{getCurrentDate()}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Role-based Dashboard Content */}
        {(isSuperAdmin || isAdmin) ? (
          <AdminDashboardSection />
        ) : (
          <EmployeeDashboardSection />
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* OKR Leaderboard - Always show */}
          <div className="lg:col-span-1 xl:col-span-2">
            <OKRLeaderboardSection />
          </div>

          {/* Recent Notifications */}
          <div className="lg:col-span-1">
            <RecentNotificationsSection />
          </div>
        </div>

        {/* Secondary Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Employee Information */}
          <EmployeeJobDescription />

          {/* Competency Framework */}
          <CompetencyFrameworkSection />
        </div>

        {/* Training Section */}
        <EmployeeTrainingDashboard />
      </div>
    </DashboardLayout>
  );
}
