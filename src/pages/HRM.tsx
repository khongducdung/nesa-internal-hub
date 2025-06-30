
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HRMTabs } from '@/components/hrm/HRMTabs';
import { 
  Users, 
  Building2, 
  UserCheck,
  Calendar,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useEmployees } from '@/hooks/useEmployees';
import { useDepartments } from '@/hooks/useDepartments';
import { useLeaveRequests } from '@/hooks/useLeaveRequests';
import { useAttendance } from '@/hooks/useAttendance';

export default function HRM() {
  const { data: employees } = useEmployees();
  const { data: departments } = useDepartments();
  const { data: leaveRequests } = useLeaveRequests();
  const { data: attendance } = useAttendance();

  // Tính toán thống kê
  const totalEmployees = employees?.length || 0;
  const activeEmployees = employees?.filter(emp => emp.work_status === 'active').length || 0;
  const totalDepartments = departments?.length || 0;
  const pendingLeaveRequests = leaveRequests?.filter(req => req.status === 'pending').length || 0;
  
  // Thống kê chấm công hôm nay
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance?.filter(att => att.date === today).length || 0;
  const presentToday = attendance?.filter(att => att.date === today && att.status === 'present').length || 0;

  const hrStats = [
    {
      title: 'Tổng nhân viên',
      value: totalEmployees.toString(),
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: `${activeEmployees}/${totalEmployees} đang làm việc`,
      changeType: 'neutral'
    },
    {
      title: 'Phòng ban',
      value: totalDepartments.toString(),
      icon: Building2,
      color: 'from-green-500 to-green-600',
      change: 'Đang hoạt động',
      changeType: 'increase'
    },
    {
      title: 'Có mặt hôm nay',
      value: presentToday.toString(),
      icon: UserCheck,
      color: 'from-purple-500 to-purple-600',
      change: `${todayAttendance} đã chấm công`,
      changeType: 'neutral'
    },
    {
      title: 'Đơn chờ duyệt',
      value: pendingLeaveRequests.toString(),
      icon: Calendar,
      color: 'from-yellow-500 to-yellow-600',
      change: 'Cần xử lý',
      changeType: pendingLeaveRequests > 0 ? 'decrease' : 'neutral'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý nhân sự</h1>
            <p className="text-gray-600 mt-1">Quản lý toàn bộ hoạt động nhân sự của công ty</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {hrStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mb-1">
                        {stat.value}
                      </p>
                      <p className={`text-sm font-medium flex items-center ${
                        stat.changeType === 'increase' ? 'text-green-600' :
                        stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {stat.changeType === 'decrease' && <AlertTriangle className="h-4 w-4 mr-1" />}
                        {stat.changeType === 'increase' && <TrendingUp className="h-4 w-4 mr-1" />}
                        {stat.change}
                      </p>
                    </div>
                    <div className={`bg-gradient-to-br ${stat.color} p-4 rounded-xl shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main HRM Management Tabs */}
        <HRMTabs />
      </div>
    </DashboardLayout>
  );
}
