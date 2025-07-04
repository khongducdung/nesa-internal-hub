
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Webhook, 
  ExternalLink, 
  Save, 
  Globe,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { useSystemSettings, useUpdateSystemSetting } from '@/hooks/useSystemSettings';
import { useState } from 'react';

export function IntegrationConfigCard() {
  const { data: settings = [], isLoading } = useSystemSettings();
  const updateSetting = useUpdateSystemSetting();
  const [editingValues, setEditingValues] = useState<Record<string, any>>({});

  const integrationSettings = settings.filter(s => s.category === 'integration');

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

  const webhookEnabled = integrationSettings.find(s => s.key === 'webhook_enabled')?.value || false;

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Tích hợp & API
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-3/4"></div>
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
          <Globe className="h-5 w-5" />
          Tích hợp & API
          <div className="ml-auto">
            <Badge className={webhookEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
              <Webhook className="h-3 w-3 mr-1" />
              {webhookEnabled ? 'Webhook ON' : 'Webhook OFF'}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Integration Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-muted/30 rounded-lg border border-border/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-sm">API External</span>
              </div>
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Hoạt động
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              Tất cả API bên ngoài đang hoạt động bình thường
            </p>
          </div>

          <div className="p-4 bg-muted/30 rounded-lg border border-border/20">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Webhook className="h-4 w-4 text-purple-600" />
                <span className="font-medium text-sm">Webhooks</span>
              </div>
              <Badge className={webhookEnabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {webhookEnabled ? (
                  <><CheckCircle className="h-3 w-3 mr-1" />Bật</>
                ) : (
                  <><AlertCircle className="h-3 w-3 mr-1" />Tắt</>
                )}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {webhookEnabled ? 'Webhook đang được kích hoạt' : 'Webhook chưa được kích hoạt'}
            </p>
          </div>
        </div>

        {/* Integration Settings */}
        <div className="space-y-4">
          <h4 className="font-medium text-foreground">Cài đặt tích hợp</h4>
          
          {integrationSettings.map((setting) => (
            <div key={setting.id} className="p-4 bg-muted/30 rounded-lg border border-border/20">
              <div className="flex items-center justify-between mb-2">
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
                        className="w-20 h-8 text-sm"
                        disabled={updateSetting.isPending}
                      />
                      <span className="text-xs text-muted-foreground">giây</span>
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

        {/* API Information */}
        <div className="pt-4 border-t border-border/30">
          <h4 className="font-medium text-foreground mb-3">Thông tin API</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Base URL:</span>
              <code className="bg-background px-2 py-1 rounded text-xs">https://gkfcgrohoryaokwuxnox.supabase.co</code>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">API Version:</span>
              <Badge variant="outline">v1</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rate Limit:</span>
              <span className="text-foreground">1000 requests/hour</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
