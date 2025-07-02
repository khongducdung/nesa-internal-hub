import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database, Key } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export function SystemInfoCard() {
  const systemInfo = [
    { label: 'Phiên bản', value: 'NESA v2.1.0' },
    { label: 'Cơ sở dữ liệu', value: 'PostgreSQL 14.2' },
    { label: 'Thời gian hoạt động', value: '15 ngày 8 giờ' },
    { label: 'Dung lượng sử dụng', value: '2.3 GB / 10 GB' },
    { label: 'Bản sao lưu cuối', value: '15/01/2024 02:00' }
  ];

  return (
    <div className="space-y-6">
      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Database className="h-5 w-5" />
            Thông tin hệ thống
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {systemInfo.map((info, index) => (
              <div key={index} className="flex items-center justify-between py-2.5 border-b border-border/30 last:border-b-0">
                <span className="text-sm text-muted-foreground">{info.label}</span>
                <span className="font-medium text-foreground text-sm">{info.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Key className="h-5 w-5" />
            Cài đặt API
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 bg-muted/50 rounded-lg border border-border/20">
            <h4 className="font-medium text-foreground mb-2 text-sm">API Endpoint</h4>
            <p className="text-xs text-muted-foreground font-mono break-all">https://app.nesagroups.com/api/v1</p>
          </div>
          <div className="p-3 bg-muted/50 rounded-lg border border-border/20">
            <h4 className="font-medium text-foreground mb-2 text-sm">Webhook URL</h4>
            <p className="text-xs text-muted-foreground font-mono break-all">https://app.nesagroups.com/webhook</p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">API Rate Limiting</span>
              <Switch checked={true} />
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-muted-foreground">API Logging</span>
              <Switch checked={false} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}