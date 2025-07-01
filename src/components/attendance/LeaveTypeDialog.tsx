
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useForm } from 'react-hook-form';
import { useLeaveTypes, useLeaveTypeMutations, LeaveType } from '@/hooks/useLeaveTypes';

interface LeaveTypeDialogProps {
  open: boolean;
  onClose: () => void;
  leaveTypeId?: string;
}

interface LeaveTypeFormData {
  name: string;
  description: string;
  is_paid: boolean;
  max_days_per_year: number;
  requires_approval: boolean;
  color: string;
}

export function LeaveTypeDialog({ open, onClose, leaveTypeId }: LeaveTypeDialogProps) {
  const { data: leaveTypes } = useLeaveTypes();
  const { createLeaveType, updateLeaveType } = useLeaveTypeMutations();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, setValue, watch } = useForm<LeaveTypeFormData>({
    defaultValues: {
      name: '',
      description: '',
      is_paid: true,
      max_days_per_year: 12,
      requires_approval: true,
      color: '#10B981'
    }
  });

  const currentLeaveType = leaveTypes?.find(lt => lt.id === leaveTypeId);

  useEffect(() => {
    if (currentLeaveType) {
      setValue('name', currentLeaveType.name);
      setValue('description', currentLeaveType.description || '');
      setValue('is_paid', currentLeaveType.is_paid);
      setValue('max_days_per_year', currentLeaveType.max_days_per_year);
      setValue('requires_approval', currentLeaveType.requires_approval);
      setValue('color', currentLeaveType.color);
    } else {
      reset();
    }
  }, [currentLeaveType, setValue, reset]);

  const onSubmit = async (data: LeaveTypeFormData) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        created_by: '00000000-0000-0000-0000-000000000000', // Should be current user ID
        is_active: true
      };

      if (leaveTypeId) {
        await updateLeaveType.mutateAsync({ id: leaveTypeId, data: payload });
      } else {
        await createLeaveType.mutateAsync(payload);
      }
      
      onClose();
      reset();
    } catch (error) {
      console.error('Error saving leave type:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {leaveTypeId ? 'Chỉnh sửa loại nghỉ' : 'Tạo loại nghỉ mới'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Tên loại nghỉ</Label>
            <Input
              id="name"
              {...register('name', { required: true })}
              placeholder="Ví dụ: Nghỉ phép năm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Mô tả</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Mô tả chi tiết về loại nghỉ"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="max_days_per_year">Số ngày tối đa/năm</Label>
              <Input
                id="max_days_per_year"
                type="number"
                {...register('max_days_per_year', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Màu sắc</Label>
              <Input
                id="color"
                type="color"
                {...register('color')}
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="is_paid">Có lương</Label>
              <Switch
                id="is_paid"
                checked={watch('is_paid')}
                onCheckedChange={(checked) => setValue('is_paid', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="requires_approval">Cần phê duyệt</Label>
              <Switch
                id="requires_approval"
                checked={watch('requires_approval')}
                onCheckedChange={(checked) => setValue('requires_approval', checked)}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Đang lưu...' : (leaveTypeId ? 'Cập nhật' : 'Tạo mới')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
