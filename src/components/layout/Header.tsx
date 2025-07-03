import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Menu, Bell, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useNotificationCount } from '@/hooks/useNotifications';
import { NotificationWidget } from '@/components/widgets/NotificationWidget';
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
              <div className="hidden sm:block">
                
                
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
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