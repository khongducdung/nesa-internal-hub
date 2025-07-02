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
    <Card className="border border-border/50 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <SettingsIcon className="h-5 w-5" />
          Cài đặt hệ thống
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(settingsByCategory).map(([category, categorySettings]) => {
          const config = CATEGORY_CONFIG[category as keyof typeof CATEGORY_CONFIG];
          if (!config) return null;

          const CategoryIcon = config.icon;
          
          return (
            <div key={category} className="space-y-4">
              <div className="flex items-center gap-3 pb-3 border-b border-border/30">
                <CategoryIcon className={`h-4 w-4 ${config.color}`} />
                <h3 className="font-medium text-foreground">{config.title}</h3>
                <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full">
                  {categorySettings.length}
                </span>
              </div>
              
              <div className="space-y-3">
                {categorySettings.map((setting) => (
                  <div key={setting.id} className="flex flex-col lg:flex-row lg:items-center gap-3 p-3 bg-muted/30 rounded-lg border border-border/20 hover:bg-muted/50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-foreground text-sm mb-1">{setting.description}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <code className="bg-background px-1.5 py-0.5 rounded text-xs">{setting.key}</code>
                        <span className="text-muted-foreground/60">•</span>
                        <span>{setting.data_type}</span>
                        {!setting.is_public && (
                          <span className="bg-warning/20 text-warning-foreground px-1.5 py-0.5 rounded text-xs">
                            Private
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 lg:min-w-48 lg:justify-end">
                      {setting.data_type === 'boolean' && (
                        <Switch 
                          checked={setting.value}
                          onCheckedChange={(checked) => handleSettingChange(setting.key, checked)}
                          disabled={updateSetting.isPending}
                        />
                      )}
                      
                      {(setting.data_type === 'number' || setting.data_type === 'string') && (
                        <div className="flex items-center gap-2 w-full lg:w-auto">
                          <Input
                            type={setting.data_type === 'number' ? 'number' : 'text'}
                            value={getDisplayValue(setting)}
                            onChange={(e) => handleNumberChange(setting.key, e.target.value)}
                            className="lg:w-32 h-8 text-sm"
                            placeholder={String(setting.value)}
                            disabled={updateSetting.isPending}
                          />
                          {editingValues[setting.key] !== undefined && (
                            <div className="flex items-center gap-1">
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
      </CardContent>
    </Card>
  );
}