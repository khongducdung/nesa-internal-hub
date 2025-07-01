
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OKRDashboard } from './OKRDashboard';
import { OKRCycleManagement } from './OKRCycleManagement';
import { OKRObjectiveManagement } from './OKRObjectiveManagement';
import { OKRProgressTracking } from './OKRProgressTracking';
import { OKRReporting } from './OKRReporting';
import { MyOKRTasks } from './MyOKRTasks';
import { CompanyOKRView } from './CompanyOKRView';
import { CollaborativeOKRForm } from './CollaborativeOKRForm';
import { OKRSettings } from './OKRSettings';
import { useAuth } from '@/hooks/useAuth';
import { Target, Users, BarChart3, Settings, Plus, Building2 } from 'lucide-react';

export function OKRManagement() {
  const { profile, isAdmin } = useAuth();

  // Kiểm tra xem user có phải là manager không
  const isManager = true; // Tạm thời set true, sau này có thể check thực tế

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header với gradient và typography hiện đại */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                OKR Management
              </h1>
              <p className="text-indigo-100 text-lg">
                Objectives & Key Results - Định hướng thành công, tạo động lực vượt trội
              </p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <div className="text-2xl font-bold">Q1 2024</div>
                <div className="text-indigo-200 text-sm">Chu kỳ hiện tại</div>
              </div>
              {/* Settings button only for admins */}
              {isAdmin && (
                <Button 
                  variant="outline" 
                  className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Cài đặt hệ thống
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Top Action Bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto px-6 py-8">
        <Tabs defaultValue="dashboard" className="w-full">
          <div className="mb-8">
            <TabsList className="bg-white shadow-sm border border-gray-200 p-1 rounded-2xl">
              <TabsTrigger value="dashboard" className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="company-okr" className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md">
                <Building2 className="h-4 w-4" />
                OKR Công ty
              </TabsTrigger>
              <TabsTrigger value="my-okrs" className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md">
                <Target className="h-4 w-4" />
                OKR của tôi
              </TabsTrigger>
              <TabsTrigger value="collaborative" className="flex items-center gap-2 px-6 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-500 data-[state=active]:text-white data-[state=active]:shadow-md">
                <Users className="h-4 w-4" />
                Cộng tác
              </TabsTrigger>
              
              {isManager && (
                <>
                  <TabsTrigger value="cycles" className="flex items-center gap-2 px-4 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md">
                    Chu kỳ OKR
                  </TabsTrigger>
                  <TabsTrigger value="objectives" className="flex items-center gap-2 px-4 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md">
                    Quản lý Objectives
                  </TabsTrigger>
                  <TabsTrigger value="tracking" className="flex items-center gap-2 px-4 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md">
                    Theo dõi tiến độ
                  </TabsTrigger>
                  <TabsTrigger value="reporting" className="flex items-center gap-2 px-4 py-3 rounded-xl data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md">
                    Báo cáo OKR
                  </TabsTrigger>
                </>
              )}
            </TabsList>
          </div>

          {/* Tab Contents */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <TabsContent value="dashboard" className="m-0 p-8">
              <OKRDashboard />
            </TabsContent>

            <TabsContent value="company-okr" className="m-0 p-8">
              <CompanyOKRView />
            </TabsContent>

            <TabsContent value="my-okrs" className="m-0 p-8">
              <MyOKRTasks />
            </TabsContent>

            <TabsContent value="collaborative" className="m-0 p-8">
              <CollaborativeOKRForm />
            </TabsContent>

            {isManager && (
              <>
                <TabsContent value="cycles" className="m-0 p-8">
                  <OKRCycleManagement />
                </TabsContent>

                <TabsContent value="objectives" className="m-0 p-8">
                  <OKRObjectiveManagement />
                </TabsContent>

                <TabsContent value="tracking" className="m-0 p-8">
                  <OKRProgressTracking />
                </TabsContent>

                <TabsContent value="reporting" className="m-0 p-8">
                  <OKRReporting />
                </TabsContent>
              </>
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
}
