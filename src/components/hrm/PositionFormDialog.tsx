
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PositionForm } from './PositionForm';

interface PositionFormDialogProps {
  open: boolean;
  onClose: () => void;
  positionId?: string;
}

export function PositionFormDialog({ open, onClose, positionId }: PositionFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {positionId ? 'Chỉnh sửa chức vụ' : 'Tạo chức vụ mới'}
          </DialogTitle>
        </DialogHeader>
        <PositionForm onClose={onClose} />
      </DialogContent>
    </Dialog>
  );
}
