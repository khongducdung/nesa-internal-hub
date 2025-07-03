// Delete OKR Dialog - Confirmation dialog for deleting OKRs
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Trash2, AlertTriangle } from 'lucide-react';
import { useDeleteOKR } from '@/hooks/useOKRSystem';
import type { OKRObjective } from '@/types/okr';

interface DeleteOKRDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  okr: OKRObjective | null;
}

export function DeleteOKRDialog({ open, onOpenChange, okr }: DeleteOKRDialogProps) {
  const deleteOKR = useDeleteOKR();

  const handleDelete = () => {
    if (!okr) return;

    deleteOKR.mutate(okr.id, {
      onSuccess: () => {
        onOpenChange(false);
      }
    });
  };

  if (!okr) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Xác nhận xóa OKR
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              Bạn có chắc chắn muốn xóa OKR này không? Hành động này không thể hoàn tác.
            </p>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="font-medium text-gray-900">{okr.title}</p>
              <p className="text-sm text-gray-600 mt-1">{okr.description}</p>
            </div>
            {okr.key_results && okr.key_results.length > 0 && (
              <p className="text-sm text-red-600">
                ⚠️ OKR này có {okr.key_results.length} Key Results sẽ bị xóa cùng.
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteOKR.isPending}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteOKR.isPending}
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {deleteOKR.isPending ? 'Đang xóa...' : 'Xóa OKR'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}