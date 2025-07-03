
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useCreateNotification } from '@/hooks/useNotifications';

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
  const createNotifications = useCreateNotification();

  const handleConfirm = async () => {
    if (sendNotification) {
      try {
        const user = await import('@/integrations/supabase/client').then(m => m.supabase.auth.getUser());
        if (user.data.user) {
          await createNotifications.mutateAsync({
            user_id: user.data.user.id,
            title: notificationType === 'new_process' ? 'Tài liệu mới' : 'Tài liệu đã cập nhật',
            message: `Tài liệu "${processName}" đã được ${notificationType === 'new_process' ? 'tạo mới' : 'cập nhật'}`,
            type: 'info',
            category: 'processes',
            reference_id: processTemplateId,
            reference_type: 'process_templates',
            created_by: user.data.user.id
          });
        }
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

  const handleCheckboxChange = (checked: boolean | "indeterminate") => {
    // Convert "indeterminate" to false for our boolean state
    setSendNotification(checked === true);
  };

  const getTargetDescription = () => {
    switch (targetType) {
      case 'general':
        return 'Tất cả nhân viên';
      case 'department':
        return 'Nhân viên theo phòng ban';
      case 'position':
        return 'Nhân viên theo vị trí';
      case 'employee':
        return 'Nhân viên được chỉ định';
      default:
        return 'Toàn bộ nhân viên';
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
              onCheckedChange={handleCheckboxChange}
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
