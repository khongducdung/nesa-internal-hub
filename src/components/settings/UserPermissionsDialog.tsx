import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { 
  Shield, 
  ShieldCheck, 
  Plus, 
  X,
  User,
  Settings
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
import { Separator } from '@/components/ui/separator';

interface UserPermissionsDialogProps {
  user: SystemUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

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

  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            Quản lý quyền truy cập
          </DialogTitle>
          <DialogDescription>
            Cấp và thu hồi quyền truy cập các tính năng cho <strong>{user.full_name}</strong>
          </DialogDescription>
        </DialogHeader>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Tổng quan quyền
            </TabsTrigger>
            <TabsTrigger value="manage" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Quản lý quyền
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Quyền hiện tại</h3>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {userPermissionSummary.length} quyền
                  </Badge>
                </div>

                {Object.entries(permissionsByCategory).map(([categoryName, data]) => {
                  const { category, userPermissions } = data;
                  
                  if (userPermissions.length === 0) return null;
                  
                  return (
                    <Card key={category.id} className="border-gray-100">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <div className="p-1.5 bg-gray-100 rounded">
                            <Settings className="h-4 w-4 text-gray-600" />
                          </div>
                          {category.description}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex flex-wrap gap-2">
                          {userPermissions.map((permission) => (
                            <Badge 
                              key={permission.permission_id}
                              variant="outline" 
                              className={`${
                                permission.source === 'role' 
                                  ? 'bg-green-50 text-green-700 border-green-200' 
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}
                            >
                              <ShieldCheck className="h-3 w-3 mr-1" />
                              {permission.action === 'manage' ? 'Quản lý' : 'Xem'}
                              {permission.source === 'role' && (
                                <span className="ml-1 text-xs">(Role)</span>
                              )}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}

                {userPermissionSummary.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Shield className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>Người dùng chưa có quyền nào được cấp</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="manage" className="mt-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {Object.entries(permissionsByCategory).map(([categoryName, data]) => {
                  const { category, permissions, userPermissions } = data;
                  
                  return (
                    <Card key={category.id} className="border-gray-100">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                          <div className="p-1.5 bg-gray-100 rounded">
                            <Settings className="h-4 w-4 text-gray-600" />
                          </div>
                          {category.description}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0 space-y-3">
                        {permissions.map((permission) => {
                          const hasPermission = userPermissions.some(up => up.permission_id === permission.id);
                          const isFromRole = userPermissions.find(up => up.permission_id === permission.id)?.source === 'role';
                          
                          return (
                            <div key={permission.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium">
                                    {permission.action === 'manage' ? 'Quản lý' : 'Xem'} {category.description?.toLowerCase()}
                                  </h4>
                                  {hasPermission && (
                                    <Badge 
                                      variant="outline" 
                                      className={`text-xs ${
                                        isFromRole 
                                          ? 'bg-green-50 text-green-700 border-green-200' 
                                          : 'bg-blue-50 text-blue-700 border-blue-200'
                                      }`}
                                    >
                                      {isFromRole ? 'Role' : 'Riêng biệt'}
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600">{permission.description}</p>
                              </div>
                              
                              <div className="ml-4">
                                {hasPermission ? (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleRevokePermission(permission.id)}
                                    disabled={isFromRole || revokePermission.isPending}
                                    className="text-red-600 border-red-200 hover:bg-red-50"
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
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}