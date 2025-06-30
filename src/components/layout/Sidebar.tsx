
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Building2, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Home,
  FileText,
  TrendingUp,
  Target,
  BarChart3
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const { signOut, profile, isSuperAdmin, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

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
    },
    { 
      icon: Settings, 
      label: 'Cài đặt hệ thống', 
      path: '/settings',
      access: 'super_admin'
    }
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) {
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
        fixed top-0 left-0 h-full bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none
        w-64 border-r border-gray-200
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">NESA</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-gray-800">NESA</h1>
              <p className="text-xs text-gray-500">Quản trị nội bộ</p>
            </div>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-gray-600">
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
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => {
            if (!hasAccess(item.access)) return null;
            
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Button
                key={item.path}
                variant={isActive ? "default" : "ghost"}
                className={`w-full justify-start space-x-3 h-12 ${
                  isActive 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </nav>

        {/* Sign Out */}
        <div className="p-4 border-t border-gray-200">
          <Button 
            variant="ghost" 
            className="w-full justify-start space-x-3 h-12 text-gray-700 hover:bg-red-50 hover:text-red-600"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
            <span>Đăng xuất</span>
          </Button>
        </div>
      </div>
    </>
  );
}
