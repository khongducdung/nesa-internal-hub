
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkGroupManagement } from './WorkGroupManagement';
import { PerformanceCycleManagement } from './PerformanceCycleManagement';
import { PerformanceDashboard } from './PerformanceDashboard';
import { PerformanceEvaluationManagement } from './PerformanceEvaluationManagement';
import { EmployeeReportManagement } from './EmployeeReportManagement';
import { useAuth } from '@/hooks/useAuth';

export function PerformanceManagement() {
  const { profile } = useAuth();
  
  // Kiểm tra xem user có phải là manager không (có nhân viên dưới quyền)
  const isManager = true; // Tạm thời set true, sau này có thể check thực tế

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đánh giá hiệu suất</h1>
        <p className="text-gray-600 mt-1">Theo dõi và đánh giá hiệu suất làm việc của nhân viên</p>
      </div>

      <Tabs defaultValue={isManager ? "dashboard" : "my-work"} className="w-full">
        <TabsList className={`grid w-full ${isManager ? 'grid-cols-5' : 'grid-cols-1'}`}>
          {isManager && (
            <>
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="cycles">Chu kỳ đánh giá</TabsTrigger>
              <TabsTrigger value="workgroups">Nhóm công việc</TabsTrigger>
              <TabsTrigger value="evaluations">Đánh giá</TabsTrigger>
            </>
          )}
          <TabsTrigger value="my-work">Công việc của tôi</TabsTrigger>
        </TabsList>

        {isManager && (
          <>
            <TabsContent value="dashboard" className="mt-6">
              <PerformanceDashboard />
            </TabsContent>

            <TabsContent value="cycles" className="mt-6">
              <PerformanceCycleManagement />
            </TabsContent>

            <TabsContent value="workgroups" className="mt-6">
              <WorkGroupManagement />
            </TabsContent>

            <TabsContent value="evaluations" className="mt-6">
              <PerformanceEvaluationManagement />
            </TabsContent>
          </>
        )}

        <TabsContent value="my-work" className="mt-6">
          <EmployeeReportManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
