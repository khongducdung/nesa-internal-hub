
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { HRMTabs } from '@/components/hrm/HRMTabs';
import { 
  Users, 
  Building2, 
  UserCheck,
  FileText,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { useEmployees } from '@/hooks/useEmployees';
import { useDepartments } from '@/hooks/useDepartments';
import { useCompanyPolicies } from '@/hooks/useCompanyPolicies';
import { formatNumber } from '@/utils/formatters';

export default function HRM() {
  const { data: employees } = useEmployees();
  const { data: departments } = useDepartments();
  const { data: policies } = useCompanyPolicies();

  // Tính toán thống kê
  const totalEmployees = employees?.length || 0;
  const activeEmployees = employees?.filter(emp => emp.work_status === 'active').length || 0;
  const totalDepartments = departments?.length || 0;
  const activePolicies = policies?.filter(policy => policy.status === 'active').length || 0;

  const hrStats = [
    {
      title: 'Tổng nhân viên',
      value: formatNumber(totalEmployees),
      icon: Users,
      color: 'from-blue-500 to-blue-600',
      change: `${formatNumber(activeEmployees)}/${formatNumber(totalEmployees)} đang làm việc`,
      changeType: 'neutral'
    },
    {
      title: 'Phòng ban',
      value: formatNumber(totalDepartments),
      icon: Building2,
      color: 'from-green-500 to-green-600',
      change: 'Đang hoạt động',
      changeType: 'increase'
    },
    {
      title: 'Nhân viên hoạt động',
      value: formatNumber(activeEmployees),
      icon: UserCheck,
      color: 'from-purple-500 to-purple-600',
      change: 'Đang làm việc',
      changeType: 'neutral'
    },
    {
      title: 'Quy định hiệu lực',
      value: formatNumber(activePolicies),
      icon: FileText,
      color: 'from-orange-500 to-orange-600',
      change: 'Đang áp dụng',
      changeType: 'increase'
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý nhân sự</h1>
            <p className="text-gray-600 mt-1">Quản lý thông tin nhân viên, phòng ban và các chính sách công ty</p>
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
