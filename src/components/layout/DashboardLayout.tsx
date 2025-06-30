
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const toggleSidebarCollapse = () => setSidebarCollapsed(!sidebarCollapsed);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <Sidebar 
          isOpen={sidebarOpen} 
          toggleSidebar={toggleSidebar}
          isCollapsed={sidebarCollapsed}
          toggleCollapse={toggleSidebarCollapse}
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            toggleSidebar={toggleSidebar} 
            toggleSidebarCollapse={toggleSidebarCollapse}
            sidebarCollapsed={sidebarCollapsed}
          />
          
          <main className="flex-1 overflow-y-auto p-4 max-w-7xl mx-auto w-full">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
