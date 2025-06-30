
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { TargetSelector } from '@/components/processes/TargetSelector';
import { NotificationDialog } from '@/components/processes/NotificationDialog';
import { useCreateProcessNotifications, useGetTargetUsers } from '@/hooks/useNotifications';
import { CompanyPolicy } from '@/hooks/useCompanyPolicies';
import { cn } from '@/lib/utils';

interface CompanyPolicyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => void;
  initialData?: CompanyPolicy | null;
}

export function CompanyPolicyForm({ open, onOpenChange, onSubmit, initialData }: CompanyPolicyFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    status: 'draft' as 'active' | 'inactive' | 'draft',
    effective_date: new Date(),
    expiry_date: null as Date | null,
    target_type: 'general' as 'general' | 'department' | 'position' | 'employee',
    target_ids: [] as string[]
  });

  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const [effectiveDateOpen, setEffectiveDateOpen] = useState(false);
  const [expiryDateOpen, setExpiryDateOpen] = useState(false);

  const createNotifications = useCreateProcessNotifications();
  const { data: targetUsers } = useGetTargetUsers(formData.target_type, formData.target_ids);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        category: initialData.category || '',
        status: initialData.status || 'draft',
        effective_date: initialData.effective_date ? new Date(initialData.effective_date) : new Date(),
        expiry_date: initialData.expiry_date ? new Date(initialData.expiry_date) : null,
        target_type: (initialData.target_type as any) || 'general',
        target_ids: initialData.target_ids || []
      });
    } else {
      setFormData({
        title: '',
        content: '',
        category: '',
        status: 'draft',
        effective_date: new Date(),
        expiry_date: null,
        target_type: 'general',
        target_ids: []
      });
    }
  }, [initialData, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.status === 'active' && formData.target_type !== 'general' && formData.target_ids.length > 0) {
      setShowNotificationDialog(true);
      return;
    }

    await submitForm(false);
  };

  const submitForm = async (sendNotification: boolean) => {
    const submitData = {
      ...formData,
      effective_date: formData.effective_date.toISOString().split('T')[0],
      expiry_date: formData.expiry_date ? formData.expiry_date.toISOString().split('T')[0] : null
    };

    await onSubmit(submitData);

    if (sendNotification && formData.status === 'active' && targetUsers?.length) {
      await createNotifications.mutateAsync({
        processTemplateId: 'policy-' + Date.now(), // Temporary ID for policies
        processName: formData.title,
        targetUsers,
        notificationType: initialData ? 'process_updated' : 'new_process'
      });
    }

    setShowNotificationDialog(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {initialData ? 'Chỉnh sửa quy định công ty' : 'Tạo quy định công ty mới'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tên quy định *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Nhập tên quy định..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Loại quy định *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại quy định" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="company_rules">Quy định chung công ty</SelectItem>
                    <SelectItem value="hr_policy">Chính sách nhân sự</SelectItem>
                    <SelectItem value="work_policy">Quy định làm việc</SelectItem>
                    <SelectItem value="security_policy">Quy định bảo mật</SelectItem>
                    <SelectItem value="finance_policy">Quy định tài chính</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Nội dung quy định *</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Nhập nội dung chi tiết của quy định..."
                rows={8}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select value={formData.status} onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Bản nháp</SelectItem>
                    <SelectItem value="active">Có hiệu lực</SelectItem>
                    <SelectItem value="inactive">Tạm dừng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Ngày có hiệu lực</Label>
                <Popover open={effectiveDateOpen} onOpenChange={setEffectiveDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.effective_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.effective_date ? format(formData.effective_date, "dd/MM/yyyy") : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.effective_date}
                      onSelect={(date) => {
                        setFormData(prev => ({ ...prev, effective_date: date || new Date() }));
                        setEffectiveDateOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>Ngày hết hạn (tùy chọn)</Label>
                <Popover open={expiryDateOpen} onOpenChange={setExpiryDateOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.expiry_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.expiry_date ? format(formData.expiry_date, "dd/MM/yyyy") : "Không giới hạn"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.expiry_date}
                      onSelect={(date) => {
                        setFormData(prev => ({ ...prev, expiry_date: date }));
                        setExpiryDateOpen(false);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <TargetSelector
              targetType={formData.target_type}
              targetIds={formData.target_ids}
              onTargetTypeChange={(type) => setFormData(prev => ({ ...prev, target_type: type, target_ids: [] }))}
              onTargetIdsChange={(ids) => setFormData(prev => ({ ...prev, target_ids: ids }))}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Hủy
              </Button>
              <Button type="submit">
                {initialData ? 'Cập nhật' : 'Tạo quy định'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <NotificationDialog
        open={showNotificationDialog}
        onOpenChange={setShowNotificationDialog}
        onConfirm={(sendNotification) => submitForm(sendNotification)}
        targetCount={targetUsers?.length || 0}
        itemName="quy định"
        isUpdate={!!initialData}
      />
    </>
  );
}
