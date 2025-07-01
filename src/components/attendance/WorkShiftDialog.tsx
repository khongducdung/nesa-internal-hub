
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { WorkShiftFormAdvanced } from './WorkShiftFormAdvanced';

interface WorkShiftDialogProps {
  open: boolean;
  onClose: () => void;
  shiftId?: string;
}

export function WorkShiftDialog({ open, onClose, shiftId }: WorkShiftDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {shiftId ? 'Chỉnh sửa ca làm việc' : 'Tạo ca làm việc mới'}
          </DialogTitle>
        </DialogHeader>
        <WorkShiftFormAdvanced onClose={onClose} shiftId={shiftId} />
      </DialogContent>
    </Dialog>
  );
}
