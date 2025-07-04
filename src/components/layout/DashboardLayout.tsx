
import { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { RightTaskbar } from './RightTaskbar';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <Sidebar />
        
        <div className="flex-1 flex flex-col overflow-hidden min-w-0">
          <Header toggleSidebar={toggleSidebar} />
          
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
      
      <RightTaskbar />
    </div>
  );
}
