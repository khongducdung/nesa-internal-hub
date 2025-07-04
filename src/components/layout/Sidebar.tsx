
import {
  LayoutDashboard,
  Settings,
  User,
  Users,
  Briefcase,
  Calendar,
  BarChart,
  FileText,
  ListChecks,
  Book,
  GraduationCap,
  Coins,
  Scale,
  Landmark,
  MessageSquare,
  HelpCircle,
  Building,
  ClipboardList,
  CheckSquare,
  File,
  BadgePercent,
  ScrollText,
  LucideIcon,
  KanbanSquare,
  FolderKanban,
  UserCog2,
  Clock4,
  FileSignature,
  FileSpreadsheet,
  Contact2,
  Network,
  GitFork,
  PanelLeftClose,
  PanelLeft,
  Layout,
  LayoutList,
  LayoutGrid,
  LayoutPanelLeft,
  LayoutDashboardIcon
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NavItem {
  name: string;
  href: string;
  icon: LucideIcon;
  roles: string[];
}

export function Sidebar() {
  const { user, hasRole, isAdmin } = useAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    // Check local storage for the collapsed state on component mount
    const storedState = localStorage.getItem('sidebarCollapsed');
    if (storedState) {
      setIsCollapsed(storedState === 'true');
    }
  }, []);

  useEffect(() => {
    // Save the collapsed state to local storage whenever it changes
    localStorage.setItem('sidebarCollapsed', String(isCollapsed));
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const navigationItems = [
    { 
      name: 'Tổng quan', 
      href: '/dashboard', 
      icon: LayoutDashboardIcon,
      roles: [] // Available to all authenticated users
    },
    { 
      name: 'Quy trình', 
      href: '/process-management', 
      icon: FileText,
      roles: [] // Available to all authenticated users
    },
    { 
      name: 'Cài đặt', 
      href: '/settings', 
      icon: Settings,
      roles: ['admin', 'super_admin']
    },
  ];

  return (
    <div className={cn(
      "bg-secondary border-r border-muted h-full py-4 flex flex-col",
      isCollapsed ? "w-16" : "w-60"
    )}>
      <div className="px-3 mb-4">
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-md hover:bg-muted transition-colors"
        >
          {isCollapsed ? <PanelLeft /> : <PanelLeftClose />}
        </button>
      </div>
      <nav className="flex-1">
        <ul>
          {navigationItems.map((item) => {
            if (item.roles.length > 0 && !item.roles.some(role => hasRole(role as 'admin' | 'super_admin'))) {
              return null;
            }

            return (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center px-3 py-2 text-sm font-medium hover:bg-muted transition-colors",
                      isActive ? "bg-muted" : "text-foreground",
                      isCollapsed ? "justify-center" : "justify-start"
                    )
                  }
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {!isCollapsed && <span>{item.name}</span>}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
