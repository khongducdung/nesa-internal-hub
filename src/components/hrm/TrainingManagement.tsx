
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrainingRequirementList } from './TrainingRequirementList';
import { TrainingAssignmentList } from './TrainingAssignmentList';

export function TrainingManagement() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Quản lý đào tạo</h2>
        <p className="text-gray-600">Quản lý yêu cầu đào tạo và tiến độ học tập của nhân viên</p>
      </div>

      <Tabs defaultValue="requirements" className="w-full">
        <TabsList>
          <TabsTrigger value="requirements">Yêu cầu đào tạo</TabsTrigger>
          <TabsTrigger value="assignments">Phân công đào tạo</TabsTrigger>
        </TabsList>
        
        <TabsContent value="requirements" className="mt-6">
          <TrainingRequirementList />
        </TabsContent>
        
        <TabsContent value="assignments" className="mt-6">
          <TrainingAssignmentList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
