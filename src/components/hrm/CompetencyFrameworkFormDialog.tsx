
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CompetencyFrameworkForm } from './CompetencyFrameworkForm';

interface CompetencyFrameworkFormDialogProps {
  open: boolean;
  onClose: () => void;
  frameworkId?: string;
}

export function CompetencyFrameworkFormDialog({ open, onClose, frameworkId }: CompetencyFrameworkFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {frameworkId ? 'Chỉnh sửa khung năng lực' : 'Tạo khung năng lực mới'}
          </DialogTitle>
        </DialogHeader>
        <CompetencyFrameworkForm onClose={onClose} frameworkId={frameworkId} />
      </DialogContent>
    </Dialog>
  );
}
