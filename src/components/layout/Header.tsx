
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Menu, Bell, PanelLeftClose, PanelLeftOpen, User, LogOut, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotificationCount } from '@/hooks/useNotifications';
import { NotificationWidget } from '@/components/widgets/NotificationWidget';
import { UserAvatar } from '@/components/ui/user-avatar';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useNavigate } from 'react-router-dom';

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
  const { profile, signOut } = useAuth();
  const { employee } = useProfile();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // Force refresh avatar on header by adding timestamp
  const [avatarRefreshKey, setAvatarRefreshKey] = useState(Date.now());

  // Refresh avatar every 5 seconds if on profile page
  React.useEffect(() => {
    const isProfilePage = window.location.pathname === '/profile';
    if (isProfilePage) {
      const interval = setInterval(() => {
        setAvatarRefreshKey(Date.now());
      }, 5000);
      return () => clearInterval(interval);
    }
  }, []);

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

            {/* User Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                  <UserAvatar 
                    size="md" 
                    showOnlineStatus 
                    forceRefresh={true}
                    key={avatarRefreshKey}
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex items-center space-x-3 p-2">
                    <UserAvatar 
                      size="sm" 
                      forceRefresh={true}
                      key={`sm-${avatarRefreshKey}`}
                    />
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {employee?.full_name || profile?.full_name || 'Chưa cập nhật'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {employee?.email || profile?.email || 'No email'}
                      </p>
                      {employee?.employee_code && (
                        <p className="text-xs leading-none text-muted-foreground">
                          Mã NV: {employee.employee_code}
                        </p>
                      )}
                    </div>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Hồ sơ cá nhân</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Cài đặt</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Đăng xuất</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    </>
  );
}
