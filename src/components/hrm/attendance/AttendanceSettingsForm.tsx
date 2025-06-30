
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateAttendanceSetting, AttendanceSetting } from '@/hooks/useAttendanceSettings';

interface AttendanceSettingsFormProps {
  open: boolean;
  onClose: () => void;
}

export function AttendanceSettingsForm({ open, onClose }: AttendanceSettingsFormProps) {
  const createSetting = useCreateAttendanceSetting();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    work_start_time: '08:00',
    work_end_time: '17:00',
    break_start_time: '12:00',
    break_end_time: '13:00',
    late_threshold_minutes: 15,
    early_leave_threshold_minutes: 15,
    overtime_start_after_minutes: 30,
    weekend_work_allowed: false,
    require_gps_check: false,
    gps_radius_meters: 100,
    is_default: false,
    status: 'active' as 'active' | 'inactive',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createSetting.mutateAsync({
      ...formData,
      work_start_time: formData.work_start_time + ':00',
      work_end_time: formData.work_end_time + ':00',
      break_start_time: formData.break_start_time + ':00',
      break_end_time: formData.break_end_time + ':00',
    });
    
    setFormData({
      name: '',
      description: '',
      work_start_time: '08:00',
      work_end_time: '17:00',
      break_start_time: '12:00',
      break_end_time: '13:00',
      late_threshold_minutes: 15,
      early_leave_threshold_minutes: 15,
      overtime_start_after_minutes: 30,
      weekend_work_allowed: false,
      require_gps_check: false,
      gps_radius_meters: 100,
      is_default: false,
      status: 'active',
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo cài đặt chấm công mới</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Tên cài đặt *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="work_start_time">Giờ bắt đầu làm việc</Label>
                  <Input
                    id="work_start_time"
                    type="time"
                    value={formData.work_start_time}
                    onChange={(e) => setFormData({...formData, work_start_time: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="work_end_time">Giờ kết thúc làm việc</Label>
                  <Input
                    id="work_end_time"
                    type="time"
                    value={formData.work_end_time}
                    onChange={(e) => setFormData({...formData, work_end_time: e.target.value})}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="break_start_time">Giờ bắt đầu nghỉ trưa</Label>
                  <Input
                    id="break_start_time"
                    type="time"
                    value={formData.break_start_time}
                    onChange={(e) => setFormData({...formData, break_start_time: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="break_end_time">Giờ kết thúc nghỉ trưa</Label>
                  <Input
                    id="break_end_time"
                    type="time"
                    value={formData.break_end_time}
                    onChange={(e) => setFormData({...formData, break_end_time: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="late_threshold">Ngưỡng đi muộn (phút)</Label>
                  <Input
                    id="late_threshold"
                    type="number"
                    value={formData.late_threshold_minutes}
                    onChange={(e) => setFormData({...formData, late_threshold_minutes: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="early_leave_threshold">Ngưỡng về sớm (phút)</Label>
                  <Input
                    id="early_leave_threshold"
                    type="number"
                    value={formData.early_leave_threshold_minutes}
                    onChange={(e) => setFormData({...formData, early_leave_threshold_minutes: parseInt(e.target.value) || 0})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="overtime_start">Bắt đầu tính overtime sau (phút)</Label>
                <Input
                  id="overtime_start"
                  type="number"
                  value={formData.overtime_start_after_minutes}
                  onChange={(e) => setFormData({...formData, overtime_start_after_minutes: parseInt(e.target.value) || 0})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gps_radius">Bán kính GPS (mét)</Label>
                <Input
                  id="gps_radius"
                  type="number"
                  value={formData.gps_radius_meters}
                  onChange={(e) => setFormData({...formData, gps_radius_meters: parseInt(e.target.value) || 100})}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="weekend_work"
                    checked={formData.weekend_work_allowed}
                    onCheckedChange={(checked) => setFormData({...formData, weekend_work_allowed: checked})}
                  />
                  <Label htmlFor="weekend_work">Cho phép làm việc cuối tuần</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="require_gps"
                    checked={formData.require_gps_check}
                    onCheckedChange={(checked) => setFormData({...formData, require_gps_check: checked})}
                  />
                  <Label htmlFor="require_gps">Yêu cầu kiểm tra GPS</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_default"
                    checked={formData.is_default}
                    onCheckedChange={(checked) => setFormData({...formData, is_default: checked})}
                  />
                  <Label htmlFor="is_default">Đặt làm mặc định</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={createSetting.isPending}>
              {createSetting.isPending ? 'Đang tạo...' : 'Tạo cài đặt'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
