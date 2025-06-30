
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
    <header className="bg-white border-b border-blue-200 shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-2">
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden hover:bg-blue-50 h-8 w-8 text-blue-600"
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          {/* Desktop sidebar toggle */}
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleSidebarCollapse}
            className="hidden lg:flex hover:bg-blue-50 h-8 w-8 text-blue-600"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Search Bar với màu xanh */}
        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-blue-400" />
            <Input 
              placeholder="Tìm kiếm..." 
              className="header-search pl-10 pr-4 py-2 h-9 w-full rounded-full transition-all duration-200 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Mobile search button */}
          <Button variant="ghost" size="icon" className="md:hidden hover:bg-blue-50 h-8 w-8">
            <Search className="h-4 w-4 text-blue-600" />
          </Button>
          
          {/* Notifications với màu xanh */}
          <Button variant="ghost" size="icon" className="relative hover:bg-blue-50 h-8 w-8">
            <Bell className="h-4 w-4 text-blue-600" />
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium text-[10px]">
              3
            </span>
          </Button>
          
          {/* User Profile với màu xanh */}
          <div className="flex items-center space-x-2 bg-blue-50 rounded-lg px-3 py-2 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer h-10">
            <div className="w-6 h-6 blue-gradient rounded-full flex items-center justify-center">
              <User className="h-3 w-3 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-blue-900 leading-none">
                {profile?.full_name || 'Admin'}
              </p>
              <p className="text-[10px] text-blue-600 mt-0.5">
                {profile?.employee_code || 'NV001'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
