
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EmployeeForm } from './EmployeeForm';

interface EmployeeFormDialogProps {
  open: boolean;
  onClose: () => void;
  employeeId?: string;
}

export function EmployeeFormDialog({ open, onClose, employeeId }: EmployeeFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {employeeId ? 'Chỉnh sửa nhân viên' : 'Tạo nhân viên mới'}
          </DialogTitle>
        </DialogHeader>
        <EmployeeForm onClose={onClose} employeeId={employeeId} />
      </DialogContent>
    </Dialog>
  );
}
