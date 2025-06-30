import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EmployeeList } from './EmployeeList';
import { DepartmentList } from './DepartmentList';
import { PositionList } from './PositionList';
import { AttendanceList } from './AttendanceList';
import { TrainingList } from './TrainingList';
import {
  Users,
  Building2,
  Briefcase,
  Clock,
  GraduationCap,
} from 'lucide-react';

export function HRMTabs() {
  const [activeTab, setActiveTab] = React.useState('employees');

  const tabs = [
    {
      id: 'employees',
      label: 'Nhân viên',
      icon: Users,
      component: <EmployeeList />,
    },
    {
      id: 'departments',
      label: 'Phòng ban',
      icon: Building2,
      component: <DepartmentList />,
    },
    {
      id: 'positions',
      label: 'Vị trí',
      icon: Briefcase,
      component: <PositionList />,
    },
    {
      id: 'attendance',
      label: 'Chấm công',
      icon: Clock,
      component: <AttendanceList />,
    },
    {
      id: 'training',
      label: 'Đào tạo',
      icon: GraduationCap,
      component: <TrainingList />,
    },
  ];

  return (
    <Tabs defaultValue={activeTab} className="w-full">
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.id} value={tab.id}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.id} value={tab.id}>
          {tab.component}
        </TabsContent>
      ))}
    </Tabs>
  );
}
