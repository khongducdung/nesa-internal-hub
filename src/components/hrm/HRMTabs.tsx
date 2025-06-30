
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { EmployeeList } from './EmployeeList';
import { DepartmentList } from './DepartmentList';
import { PositionList } from './PositionList';
import { TrainingList } from './TrainingList';
import { CompanyPolicyList } from './CompanyPolicyList';
import { AttendanceManagement } from './attendance/AttendanceManagement';

export function HRMTabs() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="employees" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="employees">Nhân viên</TabsTrigger>
          <TabsTrigger value="departments">Phòng ban</TabsTrigger>
          <TabsTrigger value="positions">Chức vụ</TabsTrigger>
          <TabsTrigger value="attendance-mgmt">Quản lý chấm công</TabsTrigger>
          <TabsTrigger value="training">Đào tạo</TabsTrigger>
          <TabsTrigger value="policies">Quy định công ty</TabsTrigger>
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

        <TabsContent value="attendance-mgmt" className="mt-6">
          <AttendanceManagement />
        </TabsContent>

        <TabsContent value="training" className="mt-6">
          <TrainingList />
        </TabsContent>

        <TabsContent value="policies" className="mt-6">
          <CompanyPolicyList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
