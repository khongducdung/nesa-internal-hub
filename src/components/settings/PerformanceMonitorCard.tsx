
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  Users, 
  Clock, 
  BarChart3,
  Save,
  TrendingUp
} from 'lucide-react';
import { useSystemSettings, useUpdateSystemSetting } from '@/hooks/useSystemSettings';
import { useSystemOverview } from '@/hooks/useSystemOverview';
import { useState } from 'react';

export function PerformanceMonitorCard() {
  const { data: settings = [], isLoading } = useSystemSettings();
  const { data: stats } = useSystemOverview();
  const updateSetting = useUpdateSystemSetting();
  const [editingValues, setEditingValues] = useState<Record<string, any>>({});

  const performanceSettings = settings.filter(s => s.category === 'performance');

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

  // Mock performance data
  const currentUsers = stats?.total_users || 0;
  const maxUsers = performanceSettings.find(s => s.key === 'max_concurrent_users')?.value || 1000;
  const userLoadPercentage = (currentUsers / maxUsers) * 100;
  const cacheEnabled = performanceSettings.find(s => s.key === 'cache_enabled')?.value || false;

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Hiệu suất & Giám sát
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-2 bg-muted rounded"></div>
            <div className="h-8 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Zap className="h-5 w-5" />
          Hiệu suất & Giám sát
          <div className="ml-auto">
            <Badge className={cacheEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
              <TrendingUp className="h-3 w-3 mr-1" />
              {cacheEnabled ? 'Cache ON' : 'Cache OFF'}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Tải người dùng</span>
              </div>
              <span className="text-sm font-semibold">{currentUsers} / {maxUsers}</span>
            </div>
            <Progress value={userLoadPercentage} className="h-2" />
            <p className="text-xs text-muted-foreground">
              {userLoadPercentage.toFixed(1)}% capacity
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Response time</span>
              </div>
              <span className="text-sm font-semibold">145ms</span>
            </div>
            <Progress value={25} className="h-2" />
            <p className="text-xs text-muted-foreground">Tốt (&lt; 200ms)</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">CPU Usage</span>
              </div>
              <span className="text-sm font-semibold">23%</span>
            </div>
            <Progress value={23} className="h-2" />
            <p className="text-xs text-muted-foreground">Bình thường</p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Memory Usage</span>
              </div>
              <span className="text-sm font-semibold">67%</span>
            </div>
            <Progress value={67} className="h-2" />
            <p className="text-xs text-muted-foreground">Bình thường</p>
          </div>
        </div>

        {/* Performance Settings */}
        <div className="space-y-4 pt-4 border-t border-border/30">
          <h4 className="font-medium text-foreground">Cài đặt hiệu suất</h4>
          
          {performanceSettings.map((setting) => (
            <div key={setting.id} className="p-3 bg-muted/30 rounded-lg border border-border/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground text-sm">{setting.description}</p>
                  <code className="text-xs text-muted-foreground bg-background px-1.5 py-0.5 rounded mt-1 inline-block">
                    {setting.key}
                  </code>
                </div>
                
                <div className="flex items-center gap-2">
                  {setting.data_type === 'boolean' && (
                    <Switch 
                      checked={setting.value}
                      onCheckedChange={(checked) => handleChange(setting.key, checked)}
                      disabled={updateSetting.isPending}
                    />
                  )}
                  
                  {setting.data_type === 'number' && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={editingValues[setting.key] !== undefined ? editingValues[setting.key] : setting.value}
                        onChange={(e) => handleInputChange(setting.key, e.target.value)}
                        className="w-24 h-8 text-sm"
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
      </CardContent>
    </Card>
  );
}
