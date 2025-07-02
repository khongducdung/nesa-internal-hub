
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Settings as SettingsIcon, 
  Users, 
  Shield, 
  Database,
  Bell,
  Mail,
  Globe,
  Lock,
  Key,
  Search,
  Plus,
  MoreHorizontal,
  UserCheck,
  UserX
} from 'lucide-react';
import { useSystemUsers, useUpdateUserStatus } from '@/hooks/useSystemUsers';
import { UserManagementDialog } from '@/components/settings/UserManagementDialog';

export default function Settings() {
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: systemUsers = [], isLoading } = useSystemUsers();
  const updateUserStatus = useUpdateUserStatus();

  const filteredUsers = systemUsers.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleUserStatus = (userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    updateUserStatus.mutate({ userId, status: newStatus as 'active' | 'inactive' });
  };

  const systemSettings = [
    {
      category: 'Bảo mật',
      icon: Shield,
      settings: [
        { name: 'Yêu cầu xác thực 2 bước', enabled: true, description: 'Bắt buộc tất cả người dùng sử dụng 2FA' },
        { name: 'Khóa tài khoản sau thất bại', enabled: true, description: 'Khóa tài khoản sau 5 lần đăng nhập sai' },
        { name: 'Phiên làm việc tự động hết hạn', enabled: false, description: 'Tự động đăng xuất sau 30 phút không hoạt động' }
      ]
    },
    {
      category: 'Thông báo',
      icon: Bell,
      settings: [
        { name: 'Email thông báo hệ thống', enabled: true, description: 'Gửi email khi có cập nhật hệ thống' },
        { name: 'Thông báo đánh giá hiệu suất', enabled: true, description: 'Nhắc nhở thực hiện đánh giá định kỳ' },
        { name: 'Báo cáo tuần', enabled: false, description: 'Gửi báo cáo tổng kết hàng tuần' }
      ]
    },
    {
      category: 'Hệ thống',
      icon: Database,
      settings: [
        { name: 'Sao lưu tự động', enabled: true, description: 'Sao lưu dữ liệu hàng ngày lúc 2:00 AM' },
        { name: 'Ghi log chi tiết', enabled: true, description: 'Ghi lại tất cả hoạt động của người dùng' },
        { name: 'Chế độ bảo trì', enabled: false, description: 'Kích hoạt chế độ bảo trì hệ thống' }
      ]
    }
  ];

  const getRoleBadge = (roles: string[]) => {
    const primaryRole = roles[0] || 'user';
    switch (primaryRole) {
      case 'super_admin':
        return <Badge className="bg-red-100 text-red-800">Super Admin</Badge>;
      case 'admin':
        return <Badge className="bg-blue-100 text-blue-800">Admin</Badge>;
      case 'user':
        return <Badge className="bg-gray-100 text-gray-800">User</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Không hoạt động</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Cài đặt hệ thống</h1>
            <p className="text-gray-600 mt-1">Quản lý cấu hình và người dùng hệ thống</p>
          </div>
        </div>

        {/* System Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Tổng người dùng', value: '156', icon: Users, color: 'from-blue-500 to-blue-600' },
            { title: 'Admin', value: '8', icon: Shield, color: 'from-green-500 to-green-600' },
            { title: 'Phiên hoạt động', value: '42', icon: Globe, color: 'from-purple-500 to-purple-600' },
            { title: 'Cảnh báo bảo mật', value: '3', icon: Lock, color: 'from-orange-500 to-orange-600' }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-2">{stat.title}</p>
                      <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
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

        {/* System Settings */}
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
              <SettingsIcon className="h-5 w-5 mr-2" />
              Cài đặt hệ thống
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {systemSettings.map((category, categoryIndex) => {
                const CategoryIcon = category.icon;
                return (
                  <div key={categoryIndex} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                    <div className="flex items-center space-x-2 mb-4">
                      <CategoryIcon className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">{category.category}</h3>
                    </div>
                    <div className="space-y-4 ml-7">
                      {category.settings.map((setting, settingIndex) => (
                        <div key={settingIndex} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 mb-1">{setting.name}</h4>
                            <p className="text-sm text-gray-600">{setting.description}</p>
                          </div>
                          <Switch checked={setting.enabled} />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* User Management */}
        <Card className="shadow-md border-0">
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Quản lý người dùng hệ thống
              </CardTitle>
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input 
                    placeholder="Tìm kiếm người dùng..." 
                    className="pl-10 w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button 
                  className="bg-blue-600 hover:bg-blue-700"
                  onClick={() => setUserDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm user
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading ? (
                <div className="text-center py-8 text-gray-500">Đang tải...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Không tìm thấy người dùng nào</div>
              ) : (
                filteredUsers.map((user) => (
                  <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">{getInitials(user.full_name)}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{user.full_name}</h3>
                        <p className="text-sm text-gray-600">{user.email}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Tạo lúc: {new Date(user.created_at).toLocaleString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      {getRoleBadge(user.roles)}
                      {getStatusBadge(user.status)}
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-green-600 hover:text-green-800"
                          onClick={() => handleToggleUserStatus(user.id, user.status)}
                          disabled={updateUserStatus.isPending}
                        >
                          {user.status === 'active' ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Information */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                <Database className="h-5 w-5 mr-2" />
                Thông tin hệ thống
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Phiên bản', value: 'NESA v2.1.0' },
                  { label: 'Cơ sở dữ liệu', value: 'PostgreSQL 14.2' },
                  { label: 'Thời gian hoạt động', value: '15 ngày 8 giờ' },
                  { label: 'Dung lượng sử dụng', value: '2.3 GB / 10 GB' },
                  { label: 'Bản sao lưu cuối', value: '15/01/2024 02:00' }
                ].map((info, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <span className="text-sm text-gray-600">{info.label}</span>
                    <span className="font-medium text-gray-900">{info.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-md border-0">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
                <Key className="h-5 w-5 mr-2" />
                Cài đặt API
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">API Endpoint</h4>
                  <p className="text-sm text-gray-600 font-mono">https://api.nesa.com/v1</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Webhook URL</h4>
                  <p className="text-sm text-gray-600 font-mono">https://nesa.com/webhook</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Rate Limiting</span>
                  <Switch checked={true} />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">API Logging</span>
                  <Switch checked={false} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <UserManagementDialog 
        open={userDialogOpen}
        onOpenChange={setUserDialogOpen}
      />
    </DashboardLayout>
  );
}
