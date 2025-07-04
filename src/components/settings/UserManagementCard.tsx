
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Search,
  Plus,
  MoreHorizontal,
  UserX,
  Eye,
  Download,
  RefreshCw
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useSystemUsers, useDeleteSystemUser } from '@/hooks/useSystemUsers';
import { UserManagementDialog } from './UserManagementDialog';
import { toast } from '@/hooks/use-toast';

export function UserManagementCard() {
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  
  const { data: systemUsers = [], isLoading, refetch } = useSystemUsers();
  const deleteUser = useDeleteSystemUser();

  const filteredUsers = systemUsers.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.roles.includes(roleFilter);
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleDeleteUser = (userId: string, userName: string) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser.mutate(userToDelete, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setUserToDelete(null);
        }
      });
    }
  };

  const getRoleBadge = (roles: string[]) => {
    const primaryRole = roles[0] || 'user';
    const variants = {
      super_admin: 'bg-gradient-to-r from-red-500 to-red-600 text-white border-0',
      admin: 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0',
      user: 'bg-gradient-to-r from-gray-400 to-gray-500 text-white border-0'
    };
    
    return (
      <Badge className={`${variants[primaryRole as keyof typeof variants] || variants.user} px-3 py-1 text-xs font-medium`}>
        {primaryRole === 'super_admin' ? 'Super Admin' : 
         primaryRole === 'admin' ? 'Admin' : 'User'}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0 px-3 py-1 text-xs font-medium">
        Hoạt động
      </Badge>
    ) : (
      <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 px-3 py-1 text-xs font-medium">
        Không hoạt động
      </Badge>
    );
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const exportUsers = () => {
    const csvContent = [
      ['Họ tên', 'Email', 'Vai trò', 'Trạng thái', 'Ngày tạo'],
      ...filteredUsers.map(user => [
        user.full_name,
        user.email,
        user.roles.join(', '),
        user.status,
        new Date(user.created_at).toLocaleDateString('vi-VN')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast({
      title: 'Xuất dữ liệu thành công',
      description: `Đã xuất ${filteredUsers.length} người dùng ra file CSV`
    });
  };

  return (
    <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
              Quản lý người dùng hệ thống
              <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200 font-semibold">
                {filteredUsers.length}
              </Badge>
            </CardTitle>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isLoading}
                className="border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Làm mới
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={exportUsers}
                disabled={filteredUsers.length === 0}
                className="border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              >
                <Download className="h-4 w-4 mr-2" />
                Xuất CSV
              </Button>
              
              <Button 
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-md hover:shadow-lg transition-all"
                onClick={() => setUserDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Thêm user
              </Button>
            </div>
          </div>

          {/* Modern Filter Bar */}
          <div className="bg-gray-50/80 backdrop-blur-sm rounded-2xl p-4 border border-gray-200/50">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-80">
                <Search className="h-4 w-4 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Tìm kiếm theo tên hoặc email..." 
                  className="pl-12 h-11 border-0 bg-white/80 backdrop-blur-sm shadow-sm focus:shadow-md transition-all rounded-xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-44 h-11 border-0 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all rounded-xl">
                  <SelectValue placeholder="Vai trò" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vai trò</SelectItem>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-44 h-11 border-0 bg-white/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all rounded-xl">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-5 bg-gray-200 rounded-lg w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                  </div>
                  <div className="space-x-2 flex">
                    <div className="h-7 w-20 bg-gray-200 rounded-full"></div>
                    <div className="h-7 w-24 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Không tìm thấy người dùng</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' 
                ? 'Thử điều chỉnh bộ lọc của bạn để tìm kiếm người dùng khác'
                : 'Hãy tạo người dùng đầu tiên để bắt đầu quản lý hệ thống'
              }
            </p>
            {!searchTerm && roleFilter === 'all' && statusFilter === 'all' && (
              <Button 
                onClick={() => setUserDialogOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="h-4 w-4 mr-2" />
                Tạo người dùng đầu tiên
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div key={user.id} className="group bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:border-gray-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-lg">{getInitials(user.full_name)}</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-bold text-gray-900 text-lg">{user.full_name}</h3>
                      <p className="text-gray-600 font-medium">{user.email}</p>
                      <p className="text-xs text-gray-500">
                        Tạo lúc: {new Date(user.created_at).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="space-x-2">
                      {getRoleBadge(user.roles)}
                      {getStatusBadge(user.status)}
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-10 w-10 rounded-full hover:bg-gray-100"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 bg-white/95 backdrop-blur-sm border-gray-200">
                        <DropdownMenuItem className="hover:bg-gray-50">
                          <Eye className="h-4 w-4 mr-3" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          onClick={() => handleDeleteUser(user.id, user.full_name)}
                        >
                          <UserX className="h-4 w-4 mr-3" />
                          Xóa người dùng
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <UserManagementDialog 
        open={userDialogOpen}
        onOpenChange={setUserDialogOpen}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-white/95 backdrop-blur-sm">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900">Xác nhận xóa người dùng</AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác và sẽ xóa toàn bộ dữ liệu liên quan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-gray-200 hover:bg-gray-50">Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0"
              disabled={deleteUser.isPending}
            >
              {deleteUser.isPending ? 'Đang xóa...' : 'Xóa người dùng'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
