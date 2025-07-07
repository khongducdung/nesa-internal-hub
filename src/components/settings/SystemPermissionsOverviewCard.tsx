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
      <CardHeader className="pb-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-sm">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                Hệ thống phân quyền
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  {allPermissions.length} quyền
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-normal mt-1">
                Quản lý chi tiết quyền truy cập theo từng module
              </p>
            </div>
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Enhanced Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Tổng số module</p>
                <p className="text-3xl font-bold mt-1">{moduleCategories.length}</p>
                <p className="text-blue-100 text-xs mt-1">Module đang hoạt động</p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <Shield className="h-6 w-6" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full"></div>
          </div>
          
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500 to-green-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Quyền quản lý</p>
                <p className="text-3xl font-bold mt-1">
                  {allPermissions.filter(p => p.action === 'manage').length}
                </p>
                <p className="text-green-100 text-xs mt-1">Quyền cấp cao</p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <Wrench className="h-6 w-6" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full"></div>
          </div>
          
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-amber-100 text-sm font-medium">Quyền xem</p>
                <p className="text-3xl font-bold mt-1">
                  {allPermissions.filter(p => p.action === 'view').length}
                </p>
                <p className="text-amber-100 text-xs mt-1">Quyền cơ bản</p>
              </div>
              <div className="p-3 bg-white/20 rounded-lg">
                <Eye className="h-6 w-6" />
              </div>
            </div>
            <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-white/10 rounded-full"></div>
          </div>
        </div>

        {/* Module Permissions Grid */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Chi tiết quyền theo module</h3>
            <Badge variant="outline" className="bg-gray-50">
              {Object.keys(permissionsByCategory).length} module
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Object.entries(permissionsByCategory).map(([categoryName, data]) => {
              const { category, permissions, managePermissions, viewPermissions } = data;
              
              return (
                <Card key={category.id} className="border border-gray-200 hover:border-primary/20 transition-colors group">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base flex items-center gap-3">
                      <div className="p-2 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg group-hover:from-primary/10 group-hover:to-primary/20 transition-all">
                        {getModuleIcon(category.icon)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold">{category.description}</span>
                          <Badge variant="outline" className="text-xs">
                            {permissions.length}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {managePermissions.length} quản lý • {viewPermissions.length} xem
                        </p>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 space-y-4">
                    {/* Manage Permissions */}
                    {managePermissions.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-green-700 flex items-center gap-1">
                          <Wrench className="h-3 w-3" />
                          Quyền quản lý ({managePermissions.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {managePermissions.slice(0, 4).map((permission) => (
                            <Badge 
                              key={permission.id} 
                              variant="outline" 
                              className="text-xs bg-green-50 text-green-700 border-green-200 hover:bg-green-100 transition-colors"
                            >
                              {permission.description}
                            </Badge>
                          ))}
                          {managePermissions.length > 4 && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-600 border-green-200">
                              +{managePermissions.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* View Permissions */}
                    {viewPermissions.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-amber-700 flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          Quyền xem ({viewPermissions.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {viewPermissions.slice(0, 4).map((permission) => (
                            <Badge 
                              key={permission.id} 
                              variant="outline" 
                              className="text-xs bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 transition-colors"
                            >
                              {permission.description}
                            </Badge>
                          ))}
                          {viewPermissions.length > 4 && (
                            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-600 border-amber-200">
                              +{viewPermissions.length - 4}
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}