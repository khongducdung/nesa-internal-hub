
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { AttendanceManagement } from '@/components/hrm/attendance/AttendanceManagement';
import { PayrollManagement } from '@/components/payroll/PayrollManagement';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  Calendar,
  DollarSign,
  Users,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useAttendance } from '@/hooks/useAttendance';
import { useEmployees } from '@/hooks/useEmployees';

export default function Attendance() {
  const { data: attendance } = useAttendance();
  const { data: employees } = useEmployees();

  // Tính toán thống kê
  const today = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance?.filter(att => att.date === today).length || 0;
  const presentToday = attendance?.filter(att => att.date === today && att.status === 'present').length || 0;
  const lateToday = attendance?.filter(att => att.date === today && att.status === 'late').length || 0;
  const totalEmployees = employees?.filter(emp => emp.work_status === 'active').length || 0;

  const attendanceStats = [
    {
      title: 'Có mặt hôm nay',
      value: presentToday.toString(),
      icon: Users,
      color: 'from-green-500 to-green-600',
      change: `${todayAttendance}/${totalEmployees} đã chấm công`,
      changeType: 'neutral'
    },
    {
      title: 'Đi muộn hôm nay',
      value: lateToday.toString(),
      icon: Clock,
      color: 'from-orange-500 to-orange-600',
      change: 'Cần theo dõi',
      changeType: 'warning'
    },
    {
      title: 'Tổng số công',
      value: '22',
      icon: Calendar,
      color: 'from-blue-500 to-blue-600',
      change: 'Trong tháng này',
      changeType: 'increase'
    },
    {
      title: 'Lương tháng',
      value: '0',
      icon: DollarSign,
      color: 'from-purple-500 to-purple-600',
      change: 'Đang tính toán',
      changeType: 'neutral'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chấm công & Tính lương</h1>
            <p className="text-gray-600 mt-1">Quản lý chấm công và tính toán lương cho nhân viên</p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {attendanceStats.map((stat, index) => {
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
                        stat.changeType === 'warning' ? 'text-orange-600' : 
                        stat.changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {stat.changeType === 'warning' && <AlertTriangle className="h-4 w-4 mr-1" />}
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

        {/* Main Tabs */}
        <Tabs defaultValue="attendance" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="attendance">Quản lý chấm công</TabsTrigger>
            <TabsTrigger value="payroll">Tính lương</TabsTrigger>
          </TabsList>
          
          <TabsContent value="attendance" className="mt-6">
            <AttendanceManagement />
          </TabsContent>
          
          <TabsContent value="payroll" className="mt-6">
            <PayrollManagement />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
