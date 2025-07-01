
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPIWorkGroupManagement } from './KPIWorkGroupManagement';
import { KPICycleManagement } from './KPICycleManagement';
import { KPIAssignmentManagement } from './KPIAssignmentManagement';
import { KPIDashboard } from './KPIDashboard';
import { KPIEvaluationManagement } from './KPIEvaluationManagement';
import { MyKPITasks } from './MyKPITasks';
import { useAuth } from '@/hooks/useAuth';

export function KPIManagement() {
  const { profile } = useAuth();
  
  // Kiểm tra xem user có phải là manager không (có nhân viên dưới quyền)
  const isManager = true; // Tạm thời set true, sau này có thể check thực tế

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý KPI</h1>
        <p className="text-gray-600 mt-1">Thiết lập và quản lý các chỉ số hiệu suất chính (Key Performance Indicators)</p>
      </div>

      <Tabs defaultValue={isManager ? "dashboard" : "my-tasks"} className="w-full">
        <TabsList className={`grid w-full ${isManager ? 'grid-cols-6' : 'grid-cols-1'}`}>
          {isManager && (
            <>
              <TabsTrigger value="dashboard">Dashboard KPI</TabsTrigger>
              <TabsTrigger value="cycles">Chu kỳ KPI</TabsTrigger>
              <TabsTrigger value="workgroups">Nhóm công việc</TabsTrigger>
              <TabsTrigger value="assignments">Phân công KPI</TabsTrigger>
              <TabsTrigger value="evaluations">Đánh giá KPI</TabsTrigger>
            </>
          )}
          <TabsTrigger value="my-tasks">Công việc của tôi</TabsTrigger>
        </TabsList>

        {isManager && (
          <>
            <TabsContent value="dashboard" className="mt-6">
              <KPIDashboard />
            </TabsContent>

            <TabsContent value="cycles" className="mt-6">
              <KPICycleManagement />
            </TabsContent>

            <TabsContent value="workgroups" className="mt-6">
              <KPIWorkGroupManagement />
            </TabsContent>

            <TabsContent value="assignments" className="mt-6">
              <KPIAssignmentManagement />
            </TabsContent>

            <TabsContent value="evaluations" className="mt-6">
              <KPIEvaluationManagement />
            </TabsContent>
          </>
        )}

        <TabsContent value="my-tasks" className="mt-6">
          <MyKPITasks />
        </TabsContent>
      </Tabs>
    </div>
  );
}
