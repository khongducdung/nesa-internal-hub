
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  Users,
  Calendar,
  Settings,
  User,
  BarChart3,
  Home,
  FileText,
  Target,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Quản lý nhân sự', href: '/hrm', icon: Users },
  { name: 'Chấm công', href: '/attendance', icon: Calendar },
  { name: 'Quy trình', href: '/processes', icon: FileText },
  { name: 'Đánh giá hiệu suất', href: '/performance', icon: BarChart3 },
  { name: 'Hồ sơ cá nhân', href: '/profile', icon: User },
  { name: 'Cài đặt', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex flex-1 flex-col pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-xl font-bold text-gray-900">HR Management</h1>
        </div>
        <nav className="mt-8 flex-1 px-2 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  'group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-blue-100 text-blue-900 border-r-2 border-blue-500'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                )}
              >
                <item.icon
                  className={cn(
                    'mr-3 h-5 w-5 transition-colors',
                    isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  )}
                />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
