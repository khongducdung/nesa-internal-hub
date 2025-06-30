
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Edit, Trash2 } from 'lucide-react';
import { usePositions } from '@/hooks/usePositions';
import { useDeletePosition } from '@/hooks/usePositionMutations';
import { PositionEditDialog } from './PositionEditDialog';

export function PositionList() {
  const { data: positions, isLoading } = usePositions();
  const deletePosition = useDeletePosition();
  const [editingPosition, setEditingPosition] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Ngưng hoạt động</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Chờ duyệt</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'level_1':
        return <Badge className="bg-purple-100 text-purple-800">Cấp 1 (Lãnh đạo)</Badge>;
      case 'level_2':
        return <Badge className="bg-blue-100 text-blue-800">Cấp 2 (Quản lý)</Badge>;
      case 'level_3':
        return <Badge className="bg-gray-100 text-gray-800">Cấp 3 (Nhân viên)</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">N/A</Badge>;
    }
  };

  const handleDelete = async (id: string) => {
    await deletePosition.mutateAsync(id);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {positions?.map((position) => (
          <div key={position.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="font-semibold">{position.name}</h3>
                  {getLevelBadge(position.level)}
                  {getStatusBadge(position.status || 'active')}
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  {position.description && (
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ __html: position.description }}
                    />
                  )}
                  {position.departments && <p>Phòng ban: {position.departments.name}</p>}
                  <p>Ngày tạo: {new Date(position.created_at).toLocaleDateString('vi-VN')}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditingPosition(position.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                      <AlertDialogDescription>
                        Bạn có chắc chắn muốn xóa vị trí "{position.name}" không? Hành động này không thể hoàn tác.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Hủy</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(position.id)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Xóa
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingPosition && (
        <PositionEditDialog
          positionId={editingPosition}
          open={!!editingPosition}
          onClose={() => setEditingPosition(null)}
        />
      )}
    </>
  );
}
