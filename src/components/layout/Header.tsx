
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Menu, Bell, Search, User, PanelLeftClose, PanelLeftOpen, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  toggleSidebar: () => void;
  toggleSidebarCollapse: () => void;
  sidebarCollapsed: boolean;
}

export function Header({ toggleSidebar, toggleSidebarCollapse, sidebarCollapsed }: HeaderProps) {
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <header className="bg-white border-b border-brand-border shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleSidebar}
            className="lg:hidden hover:bg-brand-accent h-8 w-8"
          >
            <Menu className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon"
            onClick={toggleSidebarCollapse}
            className="hidden lg:flex hover:bg-brand-accent h-8 w-8 text-muted-foreground hover:text-brand-primary"
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Tìm kiếm..." 
              className="pl-10 pr-4 py-2 h-9 w-full bg-muted/50 border-brand-border rounded-full focus:ring-brand-primary focus:border-brand-primary placeholder:text-muted-foreground text-sm"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="md:hidden hover:bg-brand-accent h-8 w-8">
            <Search className="h-4 w-4 text-muted-foreground" />
          </Button>
          
          <Button variant="ghost" size="icon" className="relative hover:bg-brand-accent h-8 w-8">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="absolute -top-1 -right-1 bg-brand-primary text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium text-[10px]">
              3
            </span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="flex items-center space-x-2 bg-brand-accent/50 rounded-lg px-3 py-2 border border-brand-border hover:bg-brand-accent transition-colors cursor-pointer h-10">
                <div className="w-6 h-6 bg-brand-gradient rounded-full flex items-center justify-center">
                  <User className="h-3 w-3 text-white" />
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs font-medium text-foreground leading-none">
                    {profile?.full_name || 'Admin'}
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">
                    {profile?.employee_code || 'NV001'}
                  </p>
                </div>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Cài đặt tài khoản</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
