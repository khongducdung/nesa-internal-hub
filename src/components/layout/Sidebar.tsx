
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Users, Building2, Settings, X, Home, FileText, TrendingUp, Target, BarChart3, User, LogOut } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export function Sidebar({ isOpen, toggleSidebar, isCollapsed, toggleCollapse }: SidebarProps) {
  const { profile, isSuperAdmin, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: Home, label: 'Dashboard', path: '/dashboard', access: 'all' },
    { icon: Users, label: 'Quản lý nhân sự', path: '/hrm', access: 'all' },
    { icon: FileText, label: 'Quản lý quy trình', path: '/processes', access: 'all' },
    { icon: TrendingUp, label: 'Đánh giá hiệu suất', path: '/performance', access: 'all' },
    { icon: Target, label: 'OKR', path: '/okr', access: 'all' },
    { icon: BarChart3, label: 'KPI', path: '/kpi', access: 'all' },
    { icon: Settings, label: 'Cài đặt hệ thống', path: '/settings', access: 'super_admin' }
  ];

  const handleNavigation = (path: string) => {
    console.log('Navigating to:', path);
    navigate(path);
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  const hasAccess = (access: string) => {
    if (access === 'all') return true;
    if (access === 'admin') return isAdmin || isSuperAdmin;
    if (access === 'super_admin') return isSuperAdmin;
    return false;
  };

  const handleProfileClick = () => {
    navigate('/profile');
    if (window.innerWidth < 1024) {
      toggleSidebar();
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={toggleSidebar} 
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full sidebar-gradient shadow-lg z-50 transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none
        ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
        w-64 flex flex-col
      `}>
        {/* Close button for mobile */}
        <div className="flex justify-end p-3 lg:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="text-white hover:bg-white/20 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Profile Section */}
        <div className={`p-3 border-b border-white/20 ${isCollapsed ? 'px-2' : ''}`}>
          <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} bg-white/10 rounded-lg p-3`}>
            <div className="flex items-center">
              <div className={`w-10 h-10 bg-white rounded-full flex items-center justify-center flex-shrink-0 ${isCollapsed ? '' : 'mr-3'}`}>
                <span className="text-primary font-bold text-sm">
                  {profile?.full_name ? profile.full_name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2) : 'DK'}
                </span>
              </div>
              {!isCollapsed && (
                <div className="flex flex-col">
                  <p className="text-sm font-medium text-white leading-tight">
                    {profile?.full_name || 'Khổng Đức Dũng'}
                  </p>
                  <p className="text-xs text-white/80 leading-tight">
                    {profile?.employee_code || 'khongducdzung@gmail...'}
                  </p>
                  <span className="text-xs bg-primary text-white px-2 py-0.5 rounded mt-1 w-fit">
                    Admin
                  </span>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleProfileClick}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  <User className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSignOut}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
          {menuItems.map(item => {
            if (!hasAccess(item.access)) return null;
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Button
                key={item.path}
                variant="ghost"
                className={`w-full ${isCollapsed ? 'justify-center px-0' : 'justify-start px-4'} h-12 text-left menu-item-hover ${
                  isActive 
                    ? 'bg-white/10 text-white' 
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`}
                onClick={() => handleNavigation(item.path)}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : ''} ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
              </Button>
            );
          })}
        </nav>

        {/* Footer with copyright */}
        <div className="p-3 border-t border-white/20">
          {!isCollapsed && (
            <div className="text-center">
              <p className="text-xs text-white/60">© 2025 Khổng Đức Dũng</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
