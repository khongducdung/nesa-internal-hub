import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Shield, 
  Users as UsersIcon,
  Clock,
  Workflow,
  TrendingUp,
  Target,
  Settings,
  Eye,
  Wrench,
  ChevronRight,
  Lock
} from 'lucide-react';
import {
  useModuleCategories,
  usePermissions,
} from '@/hooks/usePermissions';
import { useAuth } from '@/hooks/useAuth';

const getModuleIcon = (iconName: string) => {
  const iconMap: Record<string, React.ReactNode> = {
    users: <UsersIcon className="h-5 w-5" />,
    clock: <Clock className="h-5 w-5" />,
    workflow: <Workflow className="h-5 w-5" />,
    'trending-up': <TrendingUp className="h-5 w-5" />,
    target: <Target className="h-5 w-5" />,
    settings: <Settings className="h-5 w-5" />
  };
  return iconMap[iconName] || <Settings className="h-5 w-5" />;
};

const getActionLabel = (action: string) => {
  return action === 'manage' ? 'Quản lý' : 'Xem';
};

const getActionIcon = (action: string) => {
  return action === 'manage' ? (
    <Wrench className="h-4 w-4" />
  ) : (
    <Eye className="h-4 w-4" />
  );
};

export function SystemPermissionsOverviewCard() {
  const { isSuperAdmin, isAdmin } = useAuth();
  const { data: moduleCategories = [] } = useModuleCategories();
  const { data: allPermissions = [] } = usePermissions();

  const getPermissionsByCategory = () => {
    const result: Record<string, any> = {};
    
    moduleCategories.forEach(category => {
      const categoryPermissions = allPermissions.filter(p => p.category_id === category.id);
      const managePermissions = categoryPermissions.filter(p => p.action === 'manage');
      const viewPermissions = categoryPermissions.filter(p => p.action === 'view');
      
      result[category.name] = {
        category,
        permissions: categoryPermissions,
        managePermissions,
        viewPermissions
      };
    });
    
    return result;
  };

  const permissionsByCategory = getPermissionsByCategory();

  if (!isAdmin && !isSuperAdmin) {
    return (
      <Card className="border-0 shadow-sm">
        <CardContent className="p-8 text-center">
          <Lock className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có quyền truy cập</h3>
          <p className="text-gray-600">
            Bạn không có quyền xem thông tin hệ thống phân quyền
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Shield className="h-5 w-5 text-purple-600" />
          </div>
          Tổng quan hệ thống phân quyền
          <Badge variant="outline" className="ml-2 bg-purple-50 text-purple-700 border-purple-200">
            {allPermissions.length} quyền
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Thống kê tổng quan */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-blue-100 rounded">
                <Shield className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-blue-700 font-medium">Tổng số module</p>
                <p className="text-2xl font-bold text-blue-900">{moduleCategories.length}</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-green-100 rounded">
                <Wrench className="h-4 w-4 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-green-700 font-medium">Quyền quản lý</p>
                <p className="text-2xl font-bold text-green-900">
                  {allPermissions.filter(p => p.action === 'manage').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-amber-100 rounded">
                <Eye className="h-4 w-4 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-amber-700 font-medium">Quyền xem</p>
                <p className="text-2xl font-bold text-amber-900">
                  {allPermissions.filter(p => p.action === 'view').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Chi tiết từng module */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Chi tiết quyền theo module</h3>
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {Object.entries(permissionsByCategory).map(([categoryName, data]) => {
                const { category, permissions, managePermissions, viewPermissions } = data;
                
                return (
                  <Card key={category.id} className="border-gray-100">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded-lg">
                          {getModuleIcon(category.icon)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span>{category.description}</span>
                            <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                              {permissions.length} quyền
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {managePermissions.length} quyền quản lý • {viewPermissions.length} quyền xem
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="grid grid-cols-2 gap-3">
                        {/* Quyền quản lý */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-green-700 flex items-center gap-1">
                            <Wrench className="h-3 w-3" />
                            Quyền quản lý ({managePermissions.length})
                          </h4>
                          <div className="space-y-1">
                            {managePermissions.slice(0, 3).map((permission) => (
                              <div key={permission.id} className="text-xs p-2 bg-green-50 rounded border border-green-200">
                                {permission.description}
                              </div>
                            ))}
                            {managePermissions.length > 3 && (
                              <div className="text-xs text-green-600 p-2">
                                +{managePermissions.length - 3} quyền khác...
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quyền xem */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-amber-700 flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            Quyền xem ({viewPermissions.length})
                          </h4>
                          <div className="space-y-1">
                            {viewPermissions.slice(0, 3).map((permission) => (
                              <div key={permission.id} className="text-xs p-2 bg-amber-50 rounded border border-amber-200">
                                {permission.description}
                              </div>
                            ))}
                            {viewPermissions.length > 3 && (
                              <div className="text-xs text-amber-600 p-2">
                                +{viewPermissions.length - 3} quyền khác...
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </CardContent>
    </Card>
  );
}