
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings, CheckCircle2 } from 'lucide-react';
import { CheckinConfigForm } from './CheckinConfigForm';
import { useToast } from '@/hooks/use-toast';

interface CheckinConfigDialogProps {
  settingId: string;
  settingName: string;
  initialData?: any;
  trigger?: React.ReactNode;
}

export function CheckinConfigDialog({ 
  settingId, 
  settingName, 
  initialData,
  trigger 
}: CheckinConfigDialogProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleSuccess = () => {
    toast({
      title: 'Thành công',
      description: 'Cấu hình chấm công đã được cập nhật',
      variant: 'default',
    });
    setOpen(false);
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="gap-2">
      <Settings className="h-4 w-4" />
      Cấu hình
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            Cấu hình chấm công - {settingName}
          </DialogTitle>
        </DialogHeader>
        <CheckinConfigForm
          settingId={settingId}
          initialData={initialData}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
