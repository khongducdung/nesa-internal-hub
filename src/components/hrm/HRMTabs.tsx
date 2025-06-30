
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmployeeList } from './EmployeeList';
import { DepartmentList } from './DepartmentList';
import { PositionList } from './PositionList';
import { CompetencyFrameworkList } from './CompetencyFrameworkList';
import { TrainingManagement } from './TrainingManagement';
import { CompanyPolicyList } from './CompanyPolicyList';

export function HRMTabs() {
  return (
    <Tabs defaultValue="employees" className="w-full">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="employees">Nhân viên</TabsTrigger>
        <TabsTrigger value="departments">Phòng ban</TabsTrigger>
        <TabsTrigger value="positions">Chức vụ</TabsTrigger>
        <TabsTrigger value="competency">Khung năng lực</TabsTrigger>
        <TabsTrigger value="training">Đào tạo</TabsTrigger>
        <TabsTrigger value="policies">Chính sách</TabsTrigger>
      </TabsList>
      
      <TabsContent value="employees" className="mt-6">
        <EmployeeList />
      </TabsContent>
      
      <TabsContent value="departments" className="mt-6">
        <DepartmentList />
      </TabsContent>
      
      <TabsContent value="positions" className="mt-6">
        <PositionList />
      </TabsContent>
      
      <TabsContent value="competency" className="mt-6">
        <CompetencyFrameworkList />
      </TabsContent>
      
      <TabsContent value="training" className="mt-6">
        <TrainingManagement />
      </TabsContent>
      
      <TabsContent value="policies" className="mt-6">
        <CompanyPolicyList />
      </TabsContent>
    </Tabs>
  );
}
