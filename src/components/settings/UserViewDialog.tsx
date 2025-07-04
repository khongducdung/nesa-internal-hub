
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Calendar, 
  Shield, 
  Clock,
  Copy,
  Check
} from 'lucide-react';
import { SystemUser } from '@/hooks/useSystemUsers';
import { useState } from 'react';
import { toast } from '@/hooks/use-toast';

interface UserViewDialogProps {
  user: SystemUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UserViewDialog({ user, open, onOpenChange }: UserViewDialogProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  if (!user) return null;

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
      toast({
        title: 'Đã sao chép',
        description: `Đã sao chép ${field} vào clipboard`
      });
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể sao chép vào clipboard',
        variant: 'destructive'
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <User className="h-5 w-5" />
            Chi tiết người dùng
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Avatar & Basic Info */}
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-2xl">{getInitials(user.full_name)}</span>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-gray-900">{user.full_name}</h3>
                <div className="flex gap-2">
                  {getRoleBadge(user.roles)}
                  {getStatusBadge(user.status)}
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => copyToClipboard(user.email, 'email')}
                  className="h-6 w-6 p-0"
                >
                  {copiedField === 'email' ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Account Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Thông tin tài khoản
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">ID người dùng</label>
                <div className="flex items-center gap-2">
                  <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                    {user.id}
                  </code>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => copyToClipboard(user.id, 'ID')}
                    className="h-6 w-6 p-0"
                  >
                    {copiedField === 'ID' ? (
                      <Check className="h-3 w-3 text-green-600" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Vai trò</label>
                <div className="flex flex-wrap gap-1">
                  {user.roles.map((role, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {role === 'super_admin' ? 'Super Admin' : 
                       role === 'admin' ? 'Admin' : 'User'}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Trạng thái</label>
                <div>
                  {getStatusBadge(user.status)}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-500">Ngày tạo</label>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(user.created_at).toLocaleString('vi-VN')}</span>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Activity Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Hoạt động gần đây
            </h4>
            
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                Tài khoản được tạo vào {new Date(user.created_at).toLocaleDateString('vi-VN')}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Thông tin hoạt động chi tiết sẽ được cập nhật trong phiên bản tương lai
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
