
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Menu, Bell, Search, PanelLeftClose, PanelLeftOpen } from 'lucide-react';

interface HeaderProps {
  toggleSidebar: () => void;
  toggleSidebarCollapse: () => void;
  sidebarCollapsed: boolean;
}

export function Header({ toggleSidebar, toggleSidebarCollapse, sidebarCollapsed }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden hover:bg-gray-100 h-8 w-8"
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleSidebarCollapse}
            className="hidden lg:flex hover:bg-gray-100 h-8 w-8 text-gray-600 hover:text-primary"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>

          {/* NESA Logo */}
          <div className="flex items-center space-x-3">
            <img 
              src="/lovable-uploads/e6c395cd-68c2-46ec-8fef-ddaecbf68791.png" 
              alt="NESA Logo" 
              className="h-8 w-auto"
            />
            <div className="hidden sm:block">
              <h1 className="font-bold text-lg text-primary">NESA</h1>
              <p className="text-xs text-gray-500 -mt-1">Nền tảng quản trị nội bộ</p>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input 
              placeholder="Tìm kiếm..." 
              className="pl-10 pr-4 py-2 h-9 w-full bg-gray-50 border-gray-200 rounded-full focus:ring-primary focus:border-primary placeholder:text-gray-400 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="md:hidden hover:bg-gray-100 h-8 w-8">
            <Search className="h-4 w-4 text-gray-500" />
          </Button>
          
          <Button variant="ghost" size="icon" className="relative hover:bg-gray-100 h-8 w-8">
            <Bell className="h-4 w-4 text-gray-500" />
            <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium text-[10px]">
              3
            </span>
          </Button>
        </div>
      </div>
    </header>
  );
}
