
import { useAuth } from '@/hooks/useAuth';
import { 
  Users, 
  Building2, 
  Settings, 
  LogOut,
  Home,
  FileText,
  TrendingUp,
  Target,
  BarChart3
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar
} from '@/components/ui/sidebar';

export function AppSidebar() {
  const { signOut, profile, isSuperAdmin, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();

  const menuItems = [
    { 
      icon: Home, 
      label: 'Dashboard', 
      path: '/dashboard',
      access: 'all'
    },
    { 
      icon: Users, 
      label: 'Quản lý nhân sự', 
      path: '/hrm',
      access: 'admin'
    },
    { 
      icon: FileText, 
      label: 'Quản lý quy trình', 
      path: '/processes',
      access: 'admin'
    },
    { 
      icon: TrendingUp, 
      label: 'Đánh giá hiệu suất', 
      path: '/performance',
      access: 'all'
    },
    { 
      icon: Target, 
      label: 'OKR', 
      path: '/okr',
      access: 'all'
    },
    { 
      icon: BarChart3, 
      label: 'KPI', 
      path: '/kpi',
      access: 'all'
    }
  ];

  const adminItems = [
    { 
      icon: Settings, 
      label: 'Cài đặt hệ thống', 
      path: '/settings',
      access: 'super_admin'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const hasAccess = (access: string) => {
    if (access === 'all') return true;
    if (access === 'admin') return isAdmin || isSuperAdmin;
    if (access === 'super_admin') return isSuperAdmin;
    return false;
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b border-gray-100">
        <div className="flex items-center gap-3 px-2 py-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 shadow-md">
            <span className="text-lg font-bold text-white">N</span>
          </div>
          {state === 'expanded' && (
            <div className="flex flex-col">
              <h1 className="text-lg font-semibold text-gray-900">NESA</h1>
              <p className="text-xs text-gray-500">Nền tảng quản trị nội bộ</p>
            </div>
          )}
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Tổng quan</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                if (!hasAccess(item.access)) return null;
                
                const Icon = item.icon;
                const active = isActive(item.path);
                
                return (
                  <SidebarMenuItem key={item.path}>
                    <SidebarMenuButton
                      onClick={() => handleNavigation(item.path)}
                      isActive={active}
                      tooltip={state === 'collapsed' ? item.label : undefined}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {(isSuperAdmin && adminItems.some(item => hasAccess(item.access))) && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Quản trị</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {adminItems.map((item) => {
                    if (!hasAccess(item.access)) return null;
                    
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    
                    return (
                      <SidebarMenuItem key={item.path}>
                        <SidebarMenuButton
                          onClick={() => handleNavigation(item.path)}
                          isActive={active}
                          tooltip={state === 'collapsed' ? item.label : undefined}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-gray-100">
        {state === 'expanded' && (
          <div className="flex items-center gap-3 px-2 py-3 mb-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600">
              <span className="text-sm font-medium text-white">
                {profile?.full_name?.charAt(0) || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {profile?.full_name || 'Người dùng'}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {isSuperAdmin ? 'Super Admin' : isAdmin ? 'Admin' : 'Nhân viên'}
              </p>
            </div>
          </div>
        )}
        
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleSignOut}
              tooltip={state === 'collapsed' ? 'Đăng xuất' : undefined}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span>Đăng xuất</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
