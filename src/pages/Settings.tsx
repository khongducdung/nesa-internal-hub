
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search,
  Plus,
  MoreHorizontal,
  UserX
} from 'lucide-react';
import { useSystemUsers, useDeleteSystemUser } from '@/hooks/useSystemUsers';
import { UserManagementDialog } from '@/components/settings/UserManagementDialog';
import { SystemStatsCard } from '@/components/settings/SystemStatsCard';
import { SystemSettingsCard } from '@/components/settings/SystemSettingsCard';
import { SystemInfoCard } from '@/components/settings/SystemInfoCard';

export default function Settings() {
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: systemUsers = [], isLoading } = useSystemUsers();
  const deleteUser = useDeleteSystemUser();

  const filteredUsers = systemUsers.filter(user =>
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = (userId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      deleteUser.mutate(userId);
    }
  };

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
        <SystemStatsCard />

        {/* System Settings */}
        <SystemSettingsCard />

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
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={deleteUser.isPending}
                        >
                          <UserX className="h-4 w-4" />
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
        <SystemInfoCard />
      </div>

      <UserManagementDialog 
        open={userDialogOpen}
        onOpenChange={setUserDialogOpen}
      />
    </DashboardLayout>
  );
}
