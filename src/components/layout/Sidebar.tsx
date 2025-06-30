
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
        fixed top-0 left-0 h-full bg-white shadow-lg z-50 transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none
        ${isCollapsed ? 'lg:w-16' : 'lg:w-64'}
        w-64 border-r border-border flex flex-col
      `}>
        {/* Header with NESA logo - blue gradient */}
        <div className={`flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-brand h-[65px] ${isCollapsed ? 'lg:px-3' : ''}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
              <div className="text-primary font-bold text-lg">N</div>
            </div>
            {!isCollapsed && (
              <div>
                <h1 className="font-bold text-lg text-primary-foreground">NESA</h1>
                <p className="text-xs text-primary-foreground/80">Nền tảng quản trị nội bộ</p>
              </div>
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar} 
            className="lg:hidden text-primary-foreground hover:bg-white/20 h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {menuItems.map(item => {
            if (!hasAccess(item.access)) return null;
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Button
                key={item.path}
                variant="ghost"
                className={`w-full ${isCollapsed ? 'justify-center px-0' : 'justify-start px-3'} h-10 text-left transition-all duration-200 ${
                  isActive 
                    ? 'nav-active' 
                    : 'text-muted-foreground hover:bg-accent hover:text-primary'
                }`}
                onClick={() => handleNavigation(item.path)}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`h-4 w-4 ${isActive ? 'text-primary' : ''} ${isCollapsed ? '' : 'mr-3'}`} />
                {!isCollapsed && <span className="text-sm">{item.label}</span>}
              </Button>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-2 border-t border-border">
          <Button 
            variant="ghost" 
            className={`w-full ${isCollapsed ? 'justify-center px-0' : 'justify-start px-3'} h-10 text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors duration-200`}
            onClick={handleSignOut}
            title={isCollapsed ? 'Đăng xuất' : undefined}
          >
            <LogOut className={`h-4 w-4 ${isCollapsed ? '' : 'mr-3'}`} />
            {!isCollapsed && <span className="text-sm">Đăng xuất</span>}
          </Button>
        </div>
      </div>
    </>
  );
}
