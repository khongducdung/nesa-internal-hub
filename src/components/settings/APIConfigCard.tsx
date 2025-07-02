import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Key, Save, RotateCcw, Copy } from 'lucide-react';
import { useSystemSettings, useUpdateSystemSetting } from '@/hooks/useSystemSettings';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export function APIConfigCard() {
  const { data: settings = [], isLoading } = useSystemSettings();
  const updateSetting = useUpdateSystemSetting();
  const { toast } = useToast();
  const [editingValues, setEditingValues] = useState<Record<string, any>>({});

  const apiSettings = settings.filter(s => s.category === 'api');

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
    if (setting.data_type === 'number' && isNaN(processedValue)) {
      toast({
        title: 'Lỗi',
        description: 'Giá trị phải là số hợp lệ',
        variant: 'destructive'
      });
      return;
    }
    
    handleChange(setting.key, processedValue);
    setEditingValues(prev => {
      const newValues = { ...prev };
      delete newValues[setting.key];
      return newValues;
    });
  };

  const handleReset = (key: string) => {
    setEditingValues(prev => {
      const newValues = { ...prev };
      delete newValues[key];
      return newValues;
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Đã sao chép',
      description: 'Đã sao chép vào clipboard'
    });
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Key className="h-5 w-5" />
            Cấu hình API
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
          <Key className="h-5 w-5" />
          Cấu hình API
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* API Endpoints */}
        <div className="space-y-3">
          <div className="p-3 bg-muted/50 rounded-lg border border-border/20">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground mb-1 text-sm">API Endpoint</h4>
                <p className="text-xs text-muted-foreground font-mono break-all">
                  https://app.nesagroups.com/api/v1
                </p>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => copyToClipboard('https://app.nesagroups.com/api/v1')}
                className="h-8 w-8 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
          
          <div className="p-3 bg-muted/50 rounded-lg border border-border/20">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-foreground mb-1 text-sm">Webhook URL</h4>
                <p className="text-xs text-muted-foreground font-mono break-all">
                  https://app.nesagroups.com/webhook
                </p>
              </div>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => copyToClipboard('https://app.nesagroups.com/webhook')}
                className="h-8 w-8 p-0"
              >
                <Copy className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        {/* API Settings */}
        {apiSettings.map((setting) => (
          <div key={setting.id} className="p-4 bg-muted/30 rounded-lg border border-border/20">
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-medium text-foreground text-sm">{setting.description}</p>
                <code className="text-xs text-muted-foreground bg-background px-1 py-0.5 rounded">
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
                
                {(setting.data_type === 'number' || setting.data_type === 'string') && (
                  <div className="flex items-center gap-2">
                    <Input
                      type={setting.data_type === 'number' ? 'number' : 'text'}
                      value={editingValues[setting.key] !== undefined ? editingValues[setting.key] : setting.value}
                      onChange={(e) => handleInputChange(setting.key, e.target.value)}
                      className="w-32 h-8 text-sm"
                      disabled={updateSetting.isPending}
                    />
                    {editingValues[setting.key] !== undefined && (
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSave(setting)}
                          disabled={updateSetting.isPending}
                          className="h-8 w-8 p-0"
                        >
                          <Save className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleReset(setting.key)}
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
          </div>
        ))}
      </CardContent>
    </Card>
  );
}