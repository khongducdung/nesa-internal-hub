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
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="shadow-md border-0">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Thông tin hệ thống
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {systemInfo.map((info, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                <span className="text-sm text-gray-600">{info.label}</span>
                <span className="font-medium text-gray-900">{info.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md border-0">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
            <Key className="h-5 w-5 mr-2" />
            Cài đặt API
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">API Endpoint</h4>
              <p className="text-sm text-gray-600 font-mono">https://api.nesa.com/v1</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Webhook URL</h4>
              <p className="text-sm text-gray-600 font-mono">https://nesa.com/webhook</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Rate Limiting</span>
              <Switch checked={true} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">API Logging</span>
              <Switch checked={false} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}