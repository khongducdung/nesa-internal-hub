
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useLeaveTypes, useLeaveTypeMutations } from '@/hooks/useLeaveTypes';
import { LeaveTypeDialog } from './LeaveTypeDialog';

export function LeaveTypeManagement() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | undefined>();
  const { data: leaveTypes, isLoading } = useLeaveTypes();
  const { deleteLeaveType } = useLeaveTypeMutations();

  const handleEdit = (id: string) => {
    setEditingId(id);
    setShowCreateDialog(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa loại nghỉ này?')) {
      await deleteLeaveType.mutateAsync(id);
    }
  };

  const handleCloseDialog = () => {
    setShowCreateDialog(false);
    setEditingId(undefined);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Quản lý loại nghỉ phép</h2>
          <p className="text-gray-600">Thiết lập các loại nghỉ phép và quy định</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo loại nghỉ mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leaveTypes?.map((leaveType) => (
          <Card key={leaveType.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${leaveType.color}20` }}
                >
                  <Calendar 
                    className="h-6 w-6" 
                    style={{ color: leaveType.color }}
                  />
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(leaveType.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(leaveType.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <h3 className="font-semibold text-lg mb-2">{leaveType.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{leaveType.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Có lương:</span>
                  <Badge variant={leaveType.is_paid ? "default" : "secondary"}>
                    {leaveType.is_paid ? 'Có' : 'Không'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Tối đa/năm:</span>
                  <span className="font-medium">{leaveType.max_days_per_year} ngày</span>
                </div>
                <div className="flex justify-between">
                  <span>Cần phê duyệt:</span>
                  <Badge variant={leaveType.requires_approval ? "outline" : "secondary"}>
                    {leaveType.requires_approval ? 'Có' : 'Không'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <LeaveTypeDialog
        open={showCreateDialog}
        onClose={handleCloseDialog}
        leaveTypeId={editingId}
      />
    </div>
  );
}
