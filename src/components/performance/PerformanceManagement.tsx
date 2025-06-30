
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { WorkGroupManagement } from './WorkGroupManagement';
import { PerformanceCycleManagement } from './PerformanceCycleManagement';
import { PerformanceAssignmentManagement } from './PerformanceAssignmentManagement';
import { PerformanceDashboard } from './PerformanceDashboard';
import { PerformanceEvaluationManagement } from './PerformanceEvaluationManagement';

export function PerformanceManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Quản lý đánh giá hiệu suất</h1>
        <p className="text-gray-600 mt-1">Theo dõi và đánh giá hiệu suất làm việc của nhân viên</p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="cycles">Chu kỳ đánh giá</TabsTrigger>
          <TabsTrigger value="workgroups">Nhóm công việc</TabsTrigger>
          <TabsTrigger value="assignments">Phân công công việc</TabsTrigger>
          <TabsTrigger value="evaluations">Đánh giá</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <PerformanceDashboard />
        </TabsContent>

        <TabsContent value="cycles" className="mt-6">
          <PerformanceCycleManagement />
        </TabsContent>

        <TabsContent value="workgroups" className="mt-6">
          <WorkGroupManagement />
        </TabsContent>

        <TabsContent value="assignments" className="mt-6">
          <PerformanceAssignmentManagement />
        </TabsContent>

        <TabsContent value="evaluations" className="mt-6">
          <PerformanceEvaluationManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
}
