import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEmployees } from '@/hooks/useEmployees';

interface EmployeeJobDescriptionDialogProps {
  open: boolean;
  onClose: () => void;
  employeeId?: string;
}

export function EmployeeJobDescriptionDialog({ open, onClose, employeeId }: EmployeeJobDescriptionDialogProps) {
  const { data: employees, isLoading } = useEmployees();
  
  const employee = employees?.find(emp => emp.id === employeeId);

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">Đang tải...</div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!employee) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Mô tả công việc - {employee.full_name}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold text-lg">{employee.full_name}</h3>
              <p className="text-sm text-muted-foreground">Mã NV: {employee.employee_code}</p>
            </div>
            <div className="flex justify-end items-start">
              <Badge className="bg-blue-100 text-blue-800">
                {employee.positions?.name || 'Chưa có chức vụ'}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Thông tin cơ bản</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Phòng ban:</span> {employee.departments?.name || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Chức vụ:</span> {employee.positions?.name || 'N/A'}
                  </div>
                  <div>
                    <span className="font-medium">Cấp bậc:</span> {
                      employee.employee_level === 'level_1' ? 'Cấp 1' :
                      employee.employee_level === 'level_2' ? 'Cấp 2' :
                      employee.employee_level === 'level_3' ? 'Cấp 3' : 'N/A'
                    }
                  </div>
                  {employee.hire_date && (
                    <div>
                      <span className="font-medium">Ngày vào làm:</span> {new Date(employee.hire_date).toLocaleDateString('vi-VN')}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Liên hệ</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Email:</span> {employee.email}
                  </div>
                  <div>
                    <span className="font-medium">Điện thoại:</span> {employee.phone || 'Chưa có'}
                  </div>
                  <div>
                    <span className="font-medium">Địa chỉ:</span> {employee.address || 'Chưa có'}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {employee.job_description && (
            <Card>
              <CardHeader>
                <CardTitle>Mô tả công việc</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm">{employee.job_description}</div>
              </CardContent>
            </Card>
          )}

          {!employee.job_description && (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  Chưa có mô tả công việc cho nhân viên này.
                </div>
              </CardContent>
            </Card>
          )}

          {employee.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Ghi chú</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap text-sm">{employee.notes}</div>
              </CardContent>
            </Card>
          )}

          <div className="text-sm text-muted-foreground">
            <p>Ngày tạo: {new Date(employee.created_at).toLocaleDateString('vi-VN')}</p>
            <p>Cập nhật lần cuối: {new Date(employee.updated_at).toLocaleDateString('vi-VN')}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}