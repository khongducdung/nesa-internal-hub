import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Settings as SettingsIcon, 
  Shield, 
  Bell, 
  Database, 
  Key,
  Palette,
  Save,
  RotateCcw
} from 'lucide-react';
import { useSystemSettings, useUpdateSystemSetting } from '@/hooks/useSystemSettings';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const CATEGORY_CONFIG = {
  security: {
    title: 'Bảo mật',
    icon: Shield,
    color: 'text-red-600'
  },
  notifications: {
    title: 'Thông báo',
    icon: Bell,
    color: 'text-yellow-600'
  },
  system: {
    title: 'Hệ thống',
    icon: Database,
    color: 'text-blue-600'
  },
  api: {
    title: 'API',
    icon: Key,
    color: 'text-green-600'
  },
  ui: {
    title: 'Giao diện',
    icon: Palette,
    color: 'text-purple-600'
  },
};

export function SystemSettingsCard() {
  const { data: settings = [], isLoading } = useSystemSettings();
  const updateSetting = useUpdateSystemSetting();
  const { toast } = useToast();
  const [editingValues, setEditingValues] = useState<Record<string, any>>({});

  const handleSettingChange = (key: string, value: any) => {
    updateSetting.mutate({ key, value });
  };

  const handleNumberChange = (key: string, value: string) => {
    setEditingValues(prev => ({ ...prev, [key]: value }));
  };

  const handleNumberSave = (key: string, dataType: string) => {
    const value = editingValues[key];
    if (value === undefined || value === '') return;
    
    const numValue = dataType === 'number' ? Number(value) : value;
    if (dataType === 'number' && isNaN(numValue)) {
      toast({
        title: 'Lỗi',
        description: 'Giá trị phải là số hợp lệ',
        variant: 'destructive'
      });
      return;
    }
    
    handleSettingChange(key, numValue);
    setEditingValues(prev => {
      const newValues = { ...prev };
      delete newValues[key];
      return newValues;
    });
  };

  const handleNumberReset = (key: string, originalValue: any) => {
    setEditingValues(prev => {
      const newValues = { ...prev };
      delete newValues[key];
      return newValues;
    });
  };

  const getDisplayValue = (setting: any) => {
    if (editingValues[setting.key] !== undefined) {
      return editingValues[setting.key];
    }
    return setting.value;
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
              <div key={category} className="border-b border-border last:border-b-0 pb-6 last:pb-0">
                <div className="flex items-center space-x-2 mb-4">
                  <CategoryIcon className={`h-5 w-5 ${config.color}`} />
                  <h3 className="font-semibold text-foreground">{config.title}</h3>
                  <div className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                    {categorySettings.length} cài đặt
                  </div>
                </div>
                <div className="space-y-4 ml-7">
                  {categorySettings.map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between p-4 bg-card border rounded-lg hover:bg-accent/50 transition-all duration-200 group">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground mb-1">{setting.description}</h4>
                        <p className="text-sm text-muted-foreground">
                          {setting.key} • {setting.data_type}
                          {!setting.is_public && (
                            <span className="ml-2 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 px-1 py-0.5 rounded">
                              Private
                            </span>
                          )}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2 min-w-0">
                        {setting.data_type === 'boolean' && (
                          <Switch 
                            checked={setting.value}
                            onCheckedChange={(checked) => handleSettingChange(setting.key, checked)}
                            disabled={updateSetting.isPending}
                          />
                        )}
                        
                        {(setting.data_type === 'number' || setting.data_type === 'string') && (
                          <div className="flex items-center space-x-2">
                            <Input
                              type={setting.data_type === 'number' ? 'number' : 'text'}
                              value={getDisplayValue(setting)}
                              onChange={(e) => handleNumberChange(setting.key, e.target.value)}
                              className="w-32 h-8 text-sm"
                              placeholder={String(setting.value)}
                              disabled={updateSetting.isPending}
                            />
                            {editingValues[setting.key] !== undefined && (
                              <div className="flex items-center space-x-1">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleNumberSave(setting.key, setting.data_type)}
                                  disabled={updateSetting.isPending}
                                  className="h-8 w-8 p-0"
                                >
                                  <Save className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleNumberReset(setting.key, setting.value)}
                                  disabled={updateSetting.isPending}
                                  className="h-8 w-8 p-0"
                                >
                                  <RotateCcw className="h-3 w-3" />
                                </Button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
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