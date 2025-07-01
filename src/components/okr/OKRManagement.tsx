
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
          {/* Navigation Tabs - Menu chính với variant primary */}
          <div className="mb-8">
            <TabsList variant="primary" className="grid grid-cols-5">
              <TabsTrigger variant="primary" value="dashboard">
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard
              </TabsTrigger>
              
              <TabsTrigger variant="primary" value="company-okr">
                <Building2 className="h-4 w-4 mr-2" />
                OKR Công ty
              </TabsTrigger>
              
              <TabsTrigger variant="primary" value="my-okrs">
                <Target className="h-4 w-4 mr-2" />
                OKR của tôi
              </TabsTrigger>
              
              {isManager && (
                <TabsTrigger variant="primary" value="progress-reporting">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Tiến độ & Báo cáo
                </TabsTrigger>
              )}

              {isAdmin && (
                <TabsTrigger variant="primary" value="settings">
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
