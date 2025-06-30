
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Menu, Bell, Search, User, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  toggleSidebar: () => void;
  toggleSidebarCollapse: () => void;
  sidebarCollapsed: boolean;
}

export function Header({ toggleSidebar, toggleSidebarCollapse, sidebarCollapsed }: HeaderProps) {
  const { profile } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-3">
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden hover:bg-gray-100 h-9 w-9"
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Desktop sidebar toggle */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleSidebarCollapse}
            className="hidden lg:flex hover:bg-gray-100 h-9 w-9 text-gray-600"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="h-5 w-5" />
            ) : (
              <PanelLeftClose className="h-5 w-5" />
            )}
          </Button>
          
          {/* Modern Search Bar */}
          <div className="hidden md:flex relative">
            <div className="relative w-80">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Tìm kiếm nhân viên, quy trình, báo cáo..." 
                className="pl-10 pr-4 py-2 h-10 bg-gray-50 border-gray-200 rounded-lg focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder:text-gray-500"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Mobile search button */}
          <Button variant="ghost" size="icon" className="md:hidden hover:bg-gray-100 h-9 w-9">
            <Search className="h-4 w-4 text-gray-600" />
          </Button>
          
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 h-9 w-9">
            <Bell className="h-4 w-4 text-gray-600" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium text-[10px]">
              3
            </span>
          </Button>
          
          {/* User Profile */}
          <div className="flex items-center space-x-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="w-7 h-7 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <User className="h-3 w-3 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900 leading-none">
                {profile?.full_name || 'Người dùng'}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {profile?.employee_code || 'NV001'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
