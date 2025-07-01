
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OKRDashboard } from './OKRDashboard';
import { OKRCycleManagement } from './OKRCycleManagement';
import { OKRObjectiveManagement } from './OKRObjectiveManagement';
import { OKRProgressTracking } from './OKRProgressTracking';
import { OKRReporting } from './OKRReporting';
import { MyOKRTasks } from './MyOKRTasks';
import { useAuth } from '@/hooks/useAuth';

export function OKRManagement() {
  const { profile } = useAuth();
  
  // Kiểm tra xem user có phải là manager không
  const isManager = true; // Tạm thời set true, sau này có thể check thực tế

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý OKR</h1>
        <p className="text-gray-600 mt-1">Objectives and Key Results - Quản lý mục tiêu và kết quả then chốt</p>
      </div>

      <Tabs defaultValue={isManager ? "dashboard" : "my-okrs"} className="w-full">
        <TabsList className={`grid w-full ${isManager ? 'grid-cols-6' : 'grid-cols-1'}`}>
          {isManager && (
            <>
              <TabsTrigger value="dashboard">Dashboard OKR</TabsTrigger>
              <TabsTrigger value="cycles">Chu kỳ OKR</TabsTrigger>
              <TabsTrigger value="objectives">Quản lý Objectives</TabsTrigger>
              <TabsTrigger value="tracking">Theo dõi tiến độ</TabsTrigger>
              <TabsTrigger value="reporting">Báo cáo OKR</TabsTrigger>
            </>
          )}
          <TabsTrigger value="my-okrs">OKR của tôi</TabsTrigger>
        </TabsList>

        {isManager && (
          <>
            <TabsContent value="dashboard" className="mt-6">
              <OKRDashboard />
            </TabsContent>

            <TabsContent value="cycles" className="mt-6">
              <OKRCycleManagement />
            </TabsContent>

            <TabsContent value="objectives" className="mt-6">
              <OKRObjectiveManagement />
            </TabsContent>

            <TabsContent value="tracking" className="mt-6">
              <OKRProgressTracking />
            </TabsContent>

            <TabsContent value="reporting" className="mt-6">
              <OKRReporting />
            </TabsContent>
          </>
        )}

        <TabsContent value="my-okrs" className="mt-6">
          <MyOKRTasks />
        </TabsContent>
      </Tabs>
    </div>
  );
}
