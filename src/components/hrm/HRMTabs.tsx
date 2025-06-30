
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Users, 
  Building2, 
  Briefcase, 
  FileText, 
  GraduationCap,
  Plus,
  Clock
} from 'lucide-react';
import { EmployeeForm } from './EmployeeForm';
import { DepartmentForm } from './DepartmentForm';
import { PositionForm } from './PositionForm';
import { CompanyPolicyForm } from './CompanyPolicyForm';
import { TrainingProgramForm } from './TrainingProgramForm';
import { AttendanceForm } from './AttendanceForm';
import { EmployeeList } from './EmployeeList';
import { DepartmentList } from './DepartmentList';
import { PositionList } from './PositionList';
import { CompanyPolicyList } from './CompanyPolicyList';
import { TrainingList } from './TrainingList';
import { AttendanceList } from './AttendanceList';
import { useEmployees } from '@/hooks/useEmployees';
import { useDepartments } from '@/hooks/useDepartments';
import { usePositions } from '@/hooks/usePositions';
import { useCompanyPolicies } from '@/hooks/useCompanyPolicies';
import { useTrainingPrograms } from '@/hooks/useTrainingPrograms';
import { useAttendance } from '@/hooks/useAttendance';

export function HRMTabs() {
  const [activeTab, setActiveTab] = useState('employees');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: employees, isLoading: loadingEmployees } = useEmployees();
  const { data: departments } = useDepartments();
  const { data: positions } = usePositions();
  const { data: policies } = useCompanyPolicies();
  const { data: trainingPrograms } = useTrainingPrograms();
  const { data: attendance } = useAttendance();

  const getDialogTitle = () => {
    switch (activeTab) {
      case 'employees': return 'Thêm nhân viên mới';
      case 'departments': return 'Thêm phòng ban mới';
      case 'positions': return 'Thêm vị trí công việc';
      case 'policies': return 'Thêm quy định công ty';
      case 'training': return 'Tạo chương trình đào tạo';
      case 'attendance': return 'Chấm công';
      default: return 'Thêm mới';
    }
  };

  const renderDialogContent = () => {
    switch (activeTab) {
      case 'employees': 
        return <EmployeeForm onClose={() => setIsDialogOpen(false)} />;
      case 'departments': 
        return <DepartmentForm onClose={() => setIsDialogOpen(false)} />;
      case 'positions': 
        return <PositionForm onClose={() => setIsDialogOpen(false)} />;
      case 'policies': 
        return <CompanyPolicyForm onClose={() => setIsDialogOpen(false)} />;
      case 'training': 
        return <TrainingProgramForm onClose={() => setIsDialogOpen(false)} />;
      case 'attendance': 
        return <AttendanceForm onClose={() => setIsDialogOpen(false)} />;
      default: 
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="employees" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Nhân viên
          </TabsTrigger>
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            Phòng ban
          </TabsTrigger>
          <TabsTrigger value="positions" className="flex items-center gap-2">
            <Briefcase className="h-4 w-4" />
            Vị trí
          </TabsTrigger>
          <TabsTrigger value="policies" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Quy định
          </TabsTrigger>
          <TabsTrigger value="training" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Đào tạo
          </TabsTrigger>
          <TabsTrigger value="attendance" className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Chấm công
          </TabsTrigger>
        </TabsList>

        {/* Employees Tab */}
        <TabsContent value="employees" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Danh sách nhân viên</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm nhân viên
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{getDialogTitle()}</DialogTitle>
                  </DialogHeader>
                  {renderDialogContent()}
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <EmployeeList />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Departments Tab */}
        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Danh sách phòng ban</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm phòng ban
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{getDialogTitle()}</DialogTitle>
                  </DialogHeader>
                  {renderDialogContent()}
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <DepartmentList />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Positions Tab */}
        <TabsContent value="positions" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Danh sách vị trí công việc</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm vị trí
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{getDialogTitle()}</DialogTitle>
                  </DialogHeader>
                  {renderDialogContent()}
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <PositionList />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Company Policies Tab */}
        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Quy định công ty</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Thêm quy định
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>{getDialogTitle()}</DialogTitle>
                  </DialogHeader>
                  {renderDialogContent()}
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <CompanyPolicyList />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Training Programs Tab */}
        <TabsContent value="training" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Chương trình đào tạo</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo chương trình
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{getDialogTitle()}</DialogTitle>
                  </DialogHeader>
                  {renderDialogContent()}
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <TrainingList />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Quản lý chấm công</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Chấm công
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{getDialogTitle()}</DialogTitle>
                  </DialogHeader>
                  {renderDialogContent()}
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <AttendanceList />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
