
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
import { UserViewDialog } from './UserViewDialog';
import { toast } from '@/hooks/use-toast';
import type { SystemUser } from '@/hooks/useSystemUsers';

export function UserManagementCard() {
  const [userDialogOpen, setUserDialogOpen] = useState(false);
  const [userViewDialogOpen, setUserViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<SystemUser | null>(null);
  
  const { data: systemUsers = [], isLoading, refetch } = useSystemUsers();
  const deleteUser = useDeleteSystemUser();

  const filteredUsers = systemUsers.filter(user => {
    const matchesSearch = user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.roles.includes(roleFilter);
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  const handleViewUser = (user: SystemUser) => {
    setSelectedUser(user);
    setUserViewDialogOpen(true);
  };

  const handleDeleteUser = (user: SystemUser) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (userToDelete) {
      deleteUser.mutate(userToDelete.id, {
        onSuccess: () => {
          setDeleteDialogOpen(false);
          setUserToDelete(null);
          toast({
            title: 'Thành công',
            description: `Đã xóa người dùng "${userToDelete.full_name}"`
          });
        },
        onError: (error) => {
          toast({
            title: 'Lỗi',
            description: `Không thể xóa người dùng: ${error.message}`,
            variant: 'destructive'
          });
        }
      });
    }
  };

  const getRoleBadge = (roles: string[]) => {
    const primaryRole = roles[0] || 'user';
    const variants = {
      super_admin: 'bg-red-100 text-red-800 border-red-200',
      admin: 'bg-blue-100 text-blue-800 border-blue-200',
      user: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return (
      <Badge variant="outline" className={variants[primaryRole as keyof typeof variants] || variants.user}>
        {primaryRole === 'super_admin' ? 'Super Admin' : 
         primaryRole === 'admin' ? 'Admin' : 'User'}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' ? (
      <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">
        Hoạt động
      </Badge>
    ) : (
      <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">
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
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            Quản lý người dùng hệ thống
            <Badge variant="outline" className="ml-2 bg-blue-50 text-blue-700 border-blue-200">
              {filteredUsers.length}
            </Badge>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
              className="h-9"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={exportUsers}
              disabled={filteredUsers.length === 0}
              className="h-9"
            >
              <Download className="h-4 w-4 mr-2" />
              Xuất CSV
            </Button>
            
            <Button 
              className="h-9"
              onClick={() => setUserDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm user
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="relative flex-1 min-w-80">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Tìm kiếm theo tên hoặc email..." 
              className="pl-10 h-10 border-gray-200 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-44 h-10">
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
            <SelectTrigger className="w-44 h-10">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Không hoạt động</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Users List */}
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg p-4 border border-gray-100 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="space-x-2 flex">
                    <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                    <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy người dùng</h3>
            <p className="text-gray-600 mb-4 max-w-md mx-auto">
              {searchTerm || roleFilter !== 'all' || statusFilter !== 'all' 
                ? 'Thử điều chỉnh bộ lọc của bạn để tìm kiếm người dùng khác'
                : 'Hãy tạo người dùng đầu tiên để bắt đầu quản lý hệ thống'
              }
            </p>
            {!searchTerm && roleFilter === 'all' && statusFilter === 'all' && (
              <Button onClick={() => setUserDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo người dùng đầu tiên
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div key={user.id} className="group bg-white rounded-lg p-4 border border-gray-100 hover:border-gray-200 hover:shadow-sm transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">{getInitials(user.full_name)}</span>
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-gray-900">{user.full_name}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                      <p className="text-xs text-gray-500">
                        Tạo lúc: {new Date(user.created_at).toLocaleString('vi-VN')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className="space-x-2">
                      {getRoleBadge(user.roles)}
                      {getStatusBadge(user.status)}
                    </div>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem onClick={() => handleViewUser(user)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600 hover:bg-red-50"
                          onClick={() => handleDeleteUser(user)}
                        >
                          <UserX className="h-4 w-4 mr-2" />
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

      <UserViewDialog
        user={selectedUser}
        open={userViewDialogOpen}
        onOpenChange={setUserViewDialogOpen}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa người dùng "{userToDelete?.full_name}"? 
              Hành động này không thể hoàn tác và sẽ xóa toàn bộ dữ liệu liên quan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
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
