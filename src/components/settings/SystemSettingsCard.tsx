import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Database, 
  Key 
} from 'lucide-react';
import { useSystemSettings, useUpdateSystemSetting } from '@/hooks/useSystemSettings';

const CATEGORY_CONFIG = {
  security: {
    title: 'Bảo mật',
    icon: Shield,
  },
  notifications: {
    title: 'Thông báo',
    icon: Bell,
  },
  system: {
    title: 'Hệ thống',
    icon: Database,
  },
  api: {
    title: 'API',
    icon: Key,
  },
};

export function SystemSettingsCard() {
  const { data: settings = [], isLoading } = useSystemSettings();
  const updateSetting = useUpdateSystemSetting();

  const handleSettingChange = (key: string, value: any) => {
    updateSetting.mutate({ key, value });
  };

  if (isLoading) {
    return (
      <Card className="shadow-md border-0">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
            <SettingsIcon className="h-5 w-5 mr-2" />
            Cài đặt hệ thống
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">Đang tải...</div>
        </CardContent>
      </Card>
    );
  }

  // Nhóm settings theo category
  const settingsByCategory = settings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, typeof settings>);

  return (
    <Card className="shadow-md border-0">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center">
          <SettingsIcon className="h-5 w-5 mr-2" />
          Cài đặt hệ thống
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {Object.entries(settingsByCategory).map(([category, categorySettings]) => {
            const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
            if (!config) return null;

            const CategoryIcon = config.icon;
            
            return (
              <div key={category} className="border-b border-gray-200 last:border-b-0 pb-6 last:pb-0">
                <div className="flex items-center space-x-2 mb-4">
                  <CategoryIcon className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">{config.title}</h3>
                </div>
                <div className="space-y-4 ml-7">
                  {categorySettings.map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-1">{setting.description}</h4>
                        <p className="text-sm text-gray-600">Key: {setting.key}</p>
                      </div>
                      {setting.data_type === 'boolean' && (
                        <Switch 
                          checked={setting.value}
                          onCheckedChange={(checked) => handleSettingChange(setting.key, checked)}
                          disabled={updateSetting.isPending}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}