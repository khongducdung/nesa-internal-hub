
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DepartmentForm } from './DepartmentForm';

interface DepartmentFormDialogProps {
  open: boolean;
  onClose: () => void;
  departmentId?: string;
}

export function DepartmentFormDialog({ open, onClose, departmentId }: DepartmentFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {departmentId ? 'Chỉnh sửa phòng ban' : 'Tạo phòng ban mới'}
          </DialogTitle>
        </DialogHeader>
        <DepartmentForm onClose={onClose} departmentId={departmentId} />
      </DialogContent>
    </Dialog>
  );
}
