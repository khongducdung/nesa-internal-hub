
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OKRDashboard } from './OKRDashboard';
import { OKRProgressAndReporting } from './OKRProgressAndReporting';
import { MyOKRTasks } from './MyOKRTasks';
import { CompanyOKRView } from './CompanyOKRView';
import { OKRSettings } from './OKRSettings';
import { useAuth } from '@/hooks/useAuth';
import { Target, Users, BarChart3, Settings, Building2, TrendingUp } from 'lucide-react';

export function OKRManagement() {
  const { profile, isAdmin } = useAuth();
  const isManager = true;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          {/* Navigation Tabs - Full Width */}
          <div className="mb-8">
            <TabsList className="w-full h-12 items-center justify-start rounded-lg bg-white p-1 shadow-sm border border-gray-200 grid grid-cols-5">
              <TabsTrigger 
                value="dashboard" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              
              <TabsTrigger 
                value="company-okr" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <Building2 className="h-4 w-4 mr-2" />
                OKR Công ty
              </TabsTrigger>
              
              <TabsTrigger 
                value="my-okrs" 
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
              >
                <Target className="h-4 w-4 mr-2" />
                OKR của tôi
              </TabsTrigger>
              
              {isManager && (
                <TabsTrigger 
                  value="progress-reporting" 
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Tiến độ & Báo cáo
                </TabsTrigger>
              )}

              {isAdmin && (
                <TabsTrigger 
                  value="settings" 
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-sm"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Cài đặt OKR
                </TabsTrigger>
              )}
            </TabsList>
          </div>

          {/* Tab Contents */}
          <div className="space-y-6">
            <TabsContent value="dashboard" className="m-0">
              <OKRDashboard />
            </TabsContent>

            <TabsContent value="company-okr" className="m-0">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <CompanyOKRView />
              </div>
            </TabsContent>

            <TabsContent value="my-okrs" className="m-0">
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <MyOKRTasks />
              </div>
            </TabsContent>

            {isManager && (
              <TabsContent value="progress-reporting" className="m-0">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <OKRProgressAndReporting />
                </div>
              </TabsContent>
            )}

            {isAdmin && (
              <TabsContent value="settings" className="m-0">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <OKRSettings />
                </div>
              </TabsContent>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
