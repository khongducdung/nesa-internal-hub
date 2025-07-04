
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Rocket, 
  Settings as SettingsIcon, 
  Save,
  AlertTriangle,
  Database,
  Cloud
} from 'lucide-react';
import { useSystemSettings, useUpdateSystemSetting } from '@/hooks/useSystemSettings';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function DeploymentConfigCard() {
  const { data: settings = [], isLoading } = useSystemSettings();
  const updateSetting = useUpdateSystemSetting();
  const { toast } = useToast();
  const [editingValues, setEditingValues] = useState<Record<string, any>>({});

  const deploymentSettings = settings.filter(s => s.category === 'deployment');

  const handleChange = (key: string, value: any) => {
    updateSetting.mutate({ key, value });
  };

  const handleInputChange = (key: string, value: string) => {
    setEditingValues(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = (setting: any) => {
    const value = editingValues[setting.key];
    if (value === undefined) return;
    
    const processedValue = setting.data_type === 'number' ? Number(value) : value;
    handleChange(setting.key, processedValue);
    setEditingValues(prev => {
      const newValues = { ...prev };
      delete newValues[setting.key];
      return newValues;
    });
  };

  const maintenanceMode = deploymentSettings.find(s => s.key === 'maintenance_mode')?.value || false;
  const environment = deploymentSettings.find(s => s.key === 'deployment_environment')?.value || 'production';

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Rocket className="h-5 w-5" />
            Cấu hình Deployment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Rocket className="h-5 w-5" />
          Cấu hình Deployment
          <div className="ml-auto">
            <Badge className={environment === 'production' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
              <Cloud className="h-3 w-3 mr-1" />
              {environment}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Maintenance Mode Warning */}
        {maintenanceMode && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">Chế độ bảo trì đang bật</span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              Hệ thống đang trong chế độ bảo trì. Người dùng sẽ không thể truy cập.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {deploymentSettings.map((setting) => (
            <div key={setting.id} className="p-4 bg-muted/30 rounded-lg border border-border/20">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-foreground text-sm">{setting.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="text-xs text-muted-foreground bg-background px-1.5 py-0.5 rounded">
                      {setting.key}
                    </code>
                    {setting.key === 'maintenance_mode' && (
                      <Badge variant="outline" className="text-xs">Quan trọng</Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {setting.data_type === 'boolean' && (
                    <Switch 
                      checked={setting.value}
                      onCheckedChange={(checked) => handleChange(setting.key, checked)}
                      disabled={updateSetting.isPending}
                    />
                  )}
                  
                  {setting.data_type === 'string' && setting.key === 'deployment_environment' && (
                    <Select 
                      value={setting.value}
                      onValueChange={(value) => handleChange(setting.key, value)}
                      disabled={updateSetting.isPending}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="development">Development</SelectItem>
                        <SelectItem value="staging">Staging</SelectItem>
                        <SelectItem value="production">Production</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  
                  {(setting.data_type === 'number' || (setting.data_type === 'string' && setting.key !== 'deployment_environment')) && (
                    <div className="flex items-center gap-2">
                      <Input
                        type={setting.data_type === 'number' ? 'number' : 'text'}
                        value={editingValues[setting.key] !== undefined ? editingValues[setting.key] : setting.value}
                        onChange={(e) => handleInputChange(setting.key, e.target.value)}
                        className="w-32 h-8 text-sm"
                        disabled={updateSetting.isPending}
                      />
                      {editingValues[setting.key] !== undefined && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSave(setting)}
                          disabled={updateSetting.isPending}
                          className="h-8 w-8 p-0"
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-border/30">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Database className="h-4 w-4" />
            <span>Thay đổi sẽ có hiệu lực ngay lập tức</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
