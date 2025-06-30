
import { Button } from '@/components/ui/button';
import { Bell, Search, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/useAuth';
import { SidebarTrigger } from '@/components/ui/sidebar';

export function Header() {
  const { profile } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex h-14 items-center gap-4 px-6">
        <SidebarTrigger className="h-7 w-7" />
        
        <div className="flex-1 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 bg-gray-50/80 rounded-lg px-3 py-2 w-80 border">
              <Search className="h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Tìm kiếm nhân viên, quy trình, báo cáo..." 
                className="border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-gray-500 text-sm"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="relative h-8 w-8">
              <Bell className="h-4 w-4 text-gray-600" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium text-[10px]">
                3
              </span>
            </Button>
            
            <div className="flex items-center space-x-2 bg-gray-50/80 rounded-lg px-2 py-1.5 border">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                <User className="h-3 w-3 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">
                  {profile?.full_name || 'Người dùng'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
