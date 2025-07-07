import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Shield, 
  ShieldCheck, 
  Plus, 
  X,
  User,
  Settings,
  Users,
  Clock,
  Target,
  TrendingUp,
  Workflow,
  Eye,
  Wrench,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import {
  useModuleCategories,
  usePermissions,
  useUserPermissionSummary,
  useUserPermissions,
  useGrantUserPermission,
  useRevokeUserPermission
} from '@/hooks/usePermissions';
import type { SystemUser } from '@/hooks/useSystemUsers';

interface UserPermissionsDialogProps {
  user: SystemUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const getModuleIcon = (iconName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    users: <Users className="h-4 w-4" />,
    clock: <Clock className="h-4 w-4" />,
    workflow: <Workflow className="h-4 w-4" />,
    'trending-up': <TrendingUp className="h-4 w-4" />,
    target: <Target className="h-4 w-4" />,
    settings: <Settings className="h-4 w-4" />
  };
  return iconMap[iconName] || <Settings className="h-4 w-4" />;
};

const getActionLabel = (action: string) => {
  return action === 'manage' ? 'Quản lý' : 'Xem';
};

const getActionIcon = (action: string) => {
  return action === 'manage' ? (
    <Wrench className="h-3 w-3 mr-1" />
  ) : (
    <Eye className="h-3 w-3 mr-1" />
  );
};

export function UserPermissionsDialog({ user, open, onOpenChange }: UserPermissionsDialogProps) {
  const [selectedTab, setSelectedTab] = useState('summary');
  
  const { data: moduleCategories = [] } = useModuleCategories();
  const { data: allPermissions = [] } = usePermissions();
  const { data: userPermissionSummary = [] } = useUserPermissionSummary(user?.id);
  const { data: userPermissions = [] } = useUserPermissions(user?.id);
  
  const grantPermission = useGrantUserPermission();
  const revokePermission = useRevokeUserPermission();

  const getUserPermissionsByCategory = () => {
    const result: Record<string, any> = {};
    
    moduleCategories.forEach(category => {
      const categoryPermissions = allPermissions.filter(p => p.category_id === category.id);
      const userHasPermissions = userPermissionSummary.filter(up => 
        categoryPermissions.some(cp => cp.id === up.permission_id)
      );
      
      result[category.name] = {
        category,
        permissions: categoryPermissions,
        userPermissions: userHasPermissions
      };
    });
    
    return result;
  };

  const handleGrantPermission = async (permissionId: string) => {
    if (!user) return;
    
    await grantPermission.mutateAsync({
      userId: user.id,
      permissionId,
      notes: `Cấp quyền bởi admin`
    });
  };

  const handleRevokePermission = async (permissionId: string) => {
    if (!user) return;
    
    await revokePermission.mutateAsync({
      userId: user.id,
      permissionId
    });
  };

  const permissionsByCategory = getUserPermissionsByCategory();
  const totalPermissions = userPermissionSummary.length;
  const totalAvailablePermissions = allPermissions.length;

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            Quản lý quyền truy cập chi tiết
          </DialogTitle>
          <DialogDescription>
            Cấp và thu hồi quyền truy cập các tính năng cho <strong>{user.full_name}</strong>
          </DialogDescription>
          <div className="flex items-center gap-4 pt-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              {totalPermissions}/{totalAvailablePermissions} quyền
            </Badge>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {user.roles.join(', ')}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Tổng quan quyền
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Quản lý quyền chi tiết
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-4">
            <ScrollArea className="h-[500px]">
              <div className="space-y-4">
                {Object.entries(permissionsByCategory).map(([categoryName, data]) => {
                  const { category, userPermissions } = data;
                  
                  if (userPermissions.length === 0) return null;
                  
                  return (
                    <Card key={category.id} className="border-gray-100">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <div className="p-1.5 bg-gray-100 rounded">
                            {getModuleIcon(category.icon)}
                          </div>
                          {category.description}
                          <Badge variant="outline" className="ml-auto bg-blue-50 text-blue-700 border-blue-200">
                            {userPermissions.length} quyền
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="grid grid-cols-2 gap-2">
                          {userPermissions.map((permission) => (
                            <div
                              key={permission.permission_id}
                              className={`p-3 rounded-lg border ${
                                permission.source === 'role' 
                                  ? 'bg-green-50 border-green-200' 
                                  : 'bg-blue-50 border-blue-200'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                {getActionIcon(permission.action)}
                                <span className="text-sm font-medium">
                                  {getActionLabel(permission.action)}
                                </span>
                                {permission.source === 'role' && (
                                  <Badge variant="outline" className="text-xs bg-green-100 text-green-700 border-green-300">
                                    Role
                                  </Badge>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {totalPermissions === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <AlertCircle className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold mb-2">Chưa có quyền nào</h3>
                    <p className="text-gray-600 mb-4">
                      Người dùng chưa được cấp quyền truy cập tính năng nào
                    </p>
                    <Button 
                      onClick={() => setSelectedTab('manage')}
                      className="mt-2"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Cấp quyền ngay
                    </Button>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="manage" className="mt-4">
            <ScrollArea className="h-[500px]">
              <div className="space-y-6">
                {Object.entries(permissionsByCategory).map(([categoryName, data]) => {
                  const { category, permissions, userPermissions } = data;
                  
                  return (
                    <Card key={category.id} className="border-gray-100">
                      <CardHeader className="pb-4">
                        <CardTitle className="text-lg flex items-center gap-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            {getModuleIcon(category.icon)}
                          </div>
                          {category.description}
                          <Badge variant="outline" className="ml-auto bg-gray-50 text-gray-700 border-gray-200">
                            {userPermissions.length}/{permissions.length}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="space-y-3">
                          {permissions.map((permission) => {
                            const hasPermission = userPermissions.some(up => up.permission_id === permission.id);
                            const isFromRole = userPermissions.find(up => up.permission_id === permission.id)?.source === 'role';
                            
                            return (
                              <div key={permission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3">
                                    {getActionIcon(permission.action)}
                                    <div>
                                      <h4 className="font-medium text-gray-900">
                                        {permission.description}
                                      </h4>
                                      <p className="text-sm text-gray-600 mt-1">
                                        {permission.name}
                                      </p>
                                    </div>
                                    {hasPermission && (
                                      <Badge 
                                        variant="outline" 
                                        className={`text-xs ${
                                          isFromRole 
                                            ? 'bg-green-50 text-green-700 border-green-200' 
                                            : 'bg-blue-50 text-blue-700 border-blue-200'
                                        }`}
                                      >
                                        <ShieldCheck className="h-3 w-3 mr-1" />
                                        {isFromRole ? 'Từ Role' : 'Riêng biệt'}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="ml-4">
                                  {hasPermission ? (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleRevokePermission(permission.id)}
                                      disabled={isFromRole || revokePermission.isPending}
                                      className={`${
                                        isFromRole 
                                          ? 'text-gray-500 border-gray-300 cursor-not-allowed' 
                                          : 'text-red-600 border-red-200 hover:bg-red-50'
                                      }`}
                                    >
                                      <X className="h-4 w-4 mr-1" />
                                      {isFromRole ? 'Từ Role' : 'Thu hồi'}
                                    </Button>
                                  ) : (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleGrantPermission(permission.id)}
                                      disabled={grantPermission.isPending}
                                      className="text-green-600 border-green-200 hover:bg-green-50"
                                    >
                                      <Plus className="h-4 w-4 mr-1" />
                                      Cấp quyền
                                    </Button>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <Separator />
        <div className="flex justify-between items-center pt-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{totalPermissions}</span> quyền đã được cấp / 
            <span className="font-medium"> {totalAvailablePermissions}</span> quyền có sẵn
          </div>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}