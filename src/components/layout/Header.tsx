
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Menu, Bell, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useNotificationCount } from '@/hooks/useNotifications';
import { NotificationWidget } from '@/components/widgets/NotificationWidget';
import { useAuth } from '@/hooks/useAuth';
import { useEmployees } from '@/hooks/useEmployees';
import { useDepartments } from '@/hooks/useDepartments';
import { usePositions } from '@/hooks/usePositions';

interface HeaderProps {
  toggleSidebar: () => void;
  toggleSidebarCollapse: () => void;
  sidebarCollapsed: boolean;
}

export function Header({
  toggleSidebar,
  toggleSidebarCollapse,
  sidebarCollapsed
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const { data: notificationCount = 0 } = useNotificationCount();
  const { user } = useAuth();
  const { data: employees } = useEmployees();
  const { data: departments } = useDepartments();
  const { data: positions } = usePositions();

  // Get current employee info
  const currentEmployee = employees?.find(emp => emp.auth_user_id === user?.id);
  const currentDepartment = departments?.find(dept => dept.id === currentEmployee?.department_id);
  const currentPosition = positions?.find(pos => pos.id === currentEmployee?.position_id);

  return (
    <>
      {/* Overlay */}
      {showNotifications && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[45]"
          onClick={() => setShowNotifications(false)}
        />
      )}

      {/* Notification Widget */}
      {showNotifications && (
        <div className="fixed top-16 right-4 z-[50]">
          <NotificationWidget />
        </div>
      )}

      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" onClick={toggleSidebar} className="lg:hidden hover:bg-gray-100 h-8 w-8">
              <Menu className="h-4 w-4" />
            </Button>
            
            <Button variant="ghost" size="icon" onClick={toggleSidebarCollapse} className="hidden lg:flex hover:bg-gray-100 h-8 w-8 text-gray-600 hover:text-primary">
              {sidebarCollapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
            </Button>

            {/* NESA Logo */}
            <div className="flex items-center space-x-3">
              <img src="/lovable-uploads/e6c395cd-68c2-46ec-8fef-ddaecbf68791.png" alt="NESA Logo" className="h-8 w-auto" />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* User Profile Info */}
            <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm">
              <div className="flex items-center space-x-3">
                {/* Avatar */}
                <div className="w-8 h-8 rounded-full overflow-hidden bg-white/20 flex items-center justify-center">
                  {currentEmployee?.avatar_url ? (
                    <img 
                      src={currentEmployee.avatar_url} 
                      alt="Avatar" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-sm font-semibold text-white">
                      {currentEmployee?.full_name 
                        ? currentEmployee.full_name.split(' ').map(n => n.charAt(0)).join('').toUpperCase().slice(0, 2)
                        : 'A'
                      }
                    </span>
                  )}
                </div>
                
                {/* Profile Info */}
                <div className="flex flex-col text-left">
                  <span className="text-sm font-semibold leading-tight">
                    {currentEmployee?.full_name || 'Admin'}
                  </span>
                  <span className="text-xs text-white/80 leading-tight">
                    {currentDepartment?.name || 'Chưa có phòng ban'}
                  </span>
                  <span className="text-xs text-white/70 leading-tight">
                    {currentPosition?.name || 'Admin'}
                  </span>
                </div>
              </div>
            </div>

            {/* Notification Bell */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative hover:bg-gray-100 h-8 w-8"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-4 w-4 text-gray-500" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium text-[10px]">
                  {notificationCount > 99 ? '99+' : notificationCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}
