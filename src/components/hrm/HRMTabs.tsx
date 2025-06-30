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
  Calendar, 
  GraduationCap,
  Plus,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { EmployeeForm } from './EmployeeForm';
import { DepartmentForm } from './DepartmentForm';
import { PositionForm } from './PositionForm';
import { LeaveRequestForm } from './LeaveRequestForm';
import { TrainingProgramForm } from './TrainingProgramForm';
import { AttendanceForm } from './AttendanceForm';
import { useEmployees } from '@/hooks/useEmployees';
import { useDepartments } from '@/hooks/useDepartments';
import { usePositions } from '@/hooks/usePositions';
import { useLeaveRequests, useUpdateLeaveRequestStatus } from '@/hooks/useLeaveRequests';
import { useTrainingPrograms } from '@/hooks/useTrainingPrograms';
import { useAttendance } from '@/hooks/useAttendance';

export function HRMTabs() {
  const [activeTab, setActiveTab] = useState('employees');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: employees, isLoading: loadingEmployees } = useEmployees();
  const { data: departments } = useDepartments();
  const { data: positions } = usePositions();
  const { data: leaveRequests } = useLeaveRequests();
  const { data: trainingPrograms } = useTrainingPrograms();
  const { data: attendance } = useAttendance();
  const updateLeaveStatus = useUpdateLeaveRequestStatus();

  const getStatusBadge = (status: string, type: 'employee' | 'leave' | 'training' = 'employee') => {
    const statusConfig = {
      employee: {
        active: { label: 'Đang làm việc', className: 'bg-green-100 text-green-800' },
        inactive: { label: 'Nghỉ việc', className: 'bg-red-100 text-red-800' },
        pending: { label: 'Chờ xử lý', className: 'bg-yellow-100 text-yellow-800' },
      },
      leave: {
        pending: { label: 'Chờ duyệt', className: 'bg-yellow-100 text-yellow-800' },
        approved: { label: 'Đã duyệt', className: 'bg-green-100 text-green-800' },
        rejected: { label: 'Từ chối', className: 'bg-red-100 text-red-800' },
      },
      training: {
        active: { label: 'Đang mở', className: 'bg-blue-100 text-blue-800' },
        completed: { label: 'Hoàn thành', className: 'bg-green-100 text-green-800' },
        cancelled: { label: 'Đã hủy', className: 'bg-red-100 text-red-800' },
      }
    };

    const config = statusConfig[type]?.[status as keyof typeof statusConfig[typeof type]];
    if (!config) return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;

    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getLevelBadge = (level: string) => {
    const levelConfig = {
      level_1: { label: 'Cấp 1', className: 'bg-purple-100 text-purple-800' },
      level_2: { label: 'Cấp 2', className: 'bg-blue-100 text-blue-800' },
      level_3: { label: 'Cấp 3', className: 'bg-gray-100 text-gray-800' },
    };

    const config = levelConfig[level as keyof typeof levelConfig];
    if (!config) return <Badge className="bg-gray-100 text-gray-800">N/A</Badge>;

    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const getLeaveTypeBadge = (type: string) => {
    const typeConfig = {
      annual: { label: 'Phép năm', className: 'bg-blue-100 text-blue-800' },
      sick: { label: 'Nghỉ ốm', className: 'bg-red-100 text-red-800' },
      personal: { label: 'Cá nhân', className: 'bg-yellow-100 text-yellow-800' },
      emergency: { label: 'Khẩn cấp', className: 'bg-orange-100 text-orange-800' },
    };

    const config = typeConfig[type as keyof typeof typeConfig];
    if (!config) return <Badge className="bg-gray-100 text-gray-800">N/A</Badge>;

    return <Badge className={config.className}>{config.label}</Badge>;
  };

  const handleApproveLeave = async (leaveId: string) => {
    await updateLeaveStatus.mutateAsync({
      id: leaveId,
      status: 'approved',
      approved_by: 'current_user_id', // Sẽ được thay thế bằng ID người dùng hiện tại
    });
  };

  const handleRejectLeave = async (leaveId: string) => {
    await updateLeaveStatus.mutateAsync({
      id: leaveId,
      status: 'rejected',
      approved_by: 'current_user_id', // Sẽ được thay thế bằng ID người dùng hiện tại
    });
  };

  const getDialogTitle = () => {
    switch (activeTab) {
      case 'employees': return 'Thêm nhân viên mới';
      case 'departments': return 'Thêm phòng ban mới';
      case 'positions': return 'Thêm vị trí công việc';
      case 'leave': return 'Tạo đơn nghỉ phép';
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
      case 'leave': 
        return <LeaveRequestForm onClose={() => setIsDialogOpen(false)} />;
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
          <TabsTrigger value="leave" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Nghỉ phép
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
              {loadingEmployees ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {employees?.map((employee) => (
                    <div key={employee.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="font-semibold">{employee.full_name}</h3>
                            <Badge variant="outline">{employee.employee_code}</Badge>
                            {getLevelBadge(employee.employee_level || 'level_3')}
                            {getStatusBadge(employee.work_status || 'active')}
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Email: {employee.email}</p>
                            {employee.phone && <p>Điện thoại: {employee.phone}</p>}
                            {employee.departments && <p>Phòng ban: {employee.departments.name}</p>}
                            {employee.positions && <p>Vị trí: {employee.positions.name}</p>}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
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
              <div className="space-y-4">
                {departments?.map((department) => (
                  <div key={department.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold">{department.name}</h3>
                          {getStatusBadge(department.status || 'active')}
                        </div>
                        {department.description && (
                          <p className="text-sm text-gray-600">{department.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
              <div className="space-y-4">
                {positions?.map((position) => (
                  <div key={position.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold">{position.name}</h3>
                          {getLevelBadge(position.level)}
                          {getStatusBadge(position.status)}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          {position.description && <p>{position.description}</p>}
                          {position.departments && <p>Phòng ban: {position.departments.name}</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Leave Requests Tab */}
        <TabsContent value="leave" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Quản lý nghỉ phép</CardTitle>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo đơn nghỉ phép
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
              <div className="space-y-4">
                {leaveRequests?.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold">
                            {request.employees?.full_name} ({request.employees?.employee_code})
                          </h3>
                          {getLeaveTypeBadge(request.leave_type)}
                          {getStatusBadge(request.status, 'leave')}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Từ {new Date(request.start_date).toLocaleDateString('vi-VN')} đến {new Date(request.end_date).toLocaleDateString('vi-VN')}</p>
                          <p>Số ngày: {request.days_count}</p>
                          {request.reason && <p>Lý do: {request.reason}</p>}
                        </div>
                      </div>
                      {request.status === 'pending' && (
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleApproveLeave(request.id)}
                            disabled={updateLeaveStatus.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                            Duyệt
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => handleRejectLeave(request.id)}
                            disabled={updateLeaveStatus.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-1 text-red-600" />
                            Từ chối
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
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
              <div className="space-y-4">
                {trainingPrograms?.map((program) => (
                  <div key={program.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold">{program.name}</h3>
                          {getStatusBadge(program.status, 'training')}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          {program.description && <p>{program.description}</p>}
                          {program.trainer && <p>Giảng viên: {program.trainer}</p>}
                          <p>Thời gian: {new Date(program.start_date).toLocaleDateString('vi-VN')} - {new Date(program.end_date).toLocaleDateString('vi-VN')}</p>
                          {program.max_participants && <p>Số lượng tối đa: {program.max_participants} người</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
              <div className="space-y-4">
                {attendance?.map((record) => (
                  <div key={record.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold">
                            Nhân viên ID: {record.employee_id}
                          </h3>
                          {getStatusBadge(record.status || 'present')}
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Ngày: {new Date(record.date).toLocaleDateString('vi-VN')}</p>
                          {record.check_in_time && <p>Giờ vào: {new Date(record.check_in_time).toLocaleTimeString('vi-VN')}</p>}
                          {record.check_out_time && <p>Giờ ra: {new Date(record.check_out_time).toLocaleTimeString('vi-VN')}</p>}
                          {record.overtime_hours && record.overtime_hours > 0 && <p>Làm thêm: {record.overtime_hours}h</p>}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
