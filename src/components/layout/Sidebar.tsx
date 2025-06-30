
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Users, Building2, Settings, LogOut, X, Home, FileText, TrendingUp, Target, BarChart3 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
}

export function Sidebar({ isOpen, toggleSidebar, isCollapsed, toggleCollapse }: SidebarProps) {
  const { signOut, isSuperAdmin, isAdmin } = useAuth();
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
        {/* Header - simplified without logo */}
        <div className={`flex items-center justify-between px-4 py-6 border-b border-white/20 h-[73px] ${isCollapsed ? 'lg:px-3' : ''}`}>
          <div className="flex items-center space-x-3">
            {!isCollapsed && (
              <div>
                <h1 className="font-bold text-xl text-white">Quản lý</h1>
                <p className="text-sm text-white/80">Nền tảng quản trị nội bộ</p>
              </div>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="lg:hidden text-white hover:bg-white/20 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
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
                    ? 'nav-active' 
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
        <div className="p-3 border-t border-white/20 space-y-2">
          <Button 
            variant="ghost" 
            className={`w-full ${isCollapsed ? 'justify-center px-0' : 'justify-start px-4'} h-12 text-white/80 hover:bg-white/10 hover:text-white menu-item-hover`}
            onClick={handleSignOut}
            title={isCollapsed ? 'Đăng xuất' : undefined}
          >
            <LogOut className={`h-5 w-5 ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed && <span className="text-sm font-medium">Đăng xuất</span>}
          </Button>
          
          {!isCollapsed && (
            <div className="text-center pt-2">
              <p className="text-xs text-white/60">© 2025 Khổng Đức Dũng</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
