
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useCreateProcessNotifications, useGetTargetUsers } from '@/hooks/useNotifications';

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  processTemplateId: string;
  processName: string;
  targetType: string;
  targetIds: string[];
  notificationType: 'new_process' | 'process_updated';
  onConfirm: () => void;
  onCancel: () => void;
}

export function NotificationDialog({
  open,
  onOpenChange,
  processTemplateId,
  processName,
  targetType,
  targetIds,
  notificationType,
  onConfirm,
  onCancel
}: NotificationDialogProps) {
  const [sendNotification, setSendNotification] = useState(true);
  const { data: targetUsers } = useGetTargetUsers(targetType, targetIds);
  const createNotifications = useCreateProcessNotifications();

  const handleConfirm = async () => {
    if (sendNotification && targetUsers && targetUsers.length > 0) {
      try {
        await createNotifications.mutateAsync({
          processTemplateId,
          processName,
          targetUsers,
          notificationType
        });
      } catch (error) {
        console.error('Error sending notifications:', error);
      }
    }
    onConfirm();
    onOpenChange(false);
  };

  const handleCancel = () => {
    onCancel();
    onOpenChange(false);
  };

  const getTargetDescription = () => {
    if (!targetUsers) return 'Đang tải...';
    
    const count = targetUsers.length;
    switch (targetType) {
      case 'general':
        return `Tất cả nhân viên (${count} người)`;
      case 'department':
        return `Nhân viên theo phòng ban (${count} người)`;
      case 'position':
        return `Nhân viên theo vị trí (${count} người)`;
      case 'employee':
        return `Nhân viên được chỉ định (${count} người)`;
      default:
        return `${count} người`;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {notificationType === 'new_process' ? 'Thông báo tài liệu mới' : 'Thông báo cập nhật tài liệu'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-2">
              {notificationType === 'new_process' 
                ? 'Bạn có muốn gửi thông báo cho nhân sự về tài liệu hướng dẫn mới này không?'
                : 'Bạn có muốn gửi thông báo cho nhân sự về việc cập nhật tài liệu này không?'
              }
            </p>
            <p className="text-sm font-medium">Đối tượng: {getTargetDescription()}</p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="send-notification" 
              checked={sendNotification}
              onCheckedChange={setSendNotification}
            />
            <Label htmlFor="send-notification" className="text-sm">
              Gửi thông báo cho nhân sự
            </Label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              disabled={createNotifications.isPending}
            >
              Huỷ
            </Button>
            <Button 
              onClick={handleConfirm}
              disabled={createNotifications.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {createNotifications.isPending ? 'Đang xử lý...' : 'Xác nhận'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
