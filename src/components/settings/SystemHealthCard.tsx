
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Activity, 
  Server, 
  Database, 
  HardDrive, 
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useSystemOverview } from '@/hooks/useSystemOverview';

export function SystemHealthCard() {
  const { data: stats, isLoading } = useSystemOverview();

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Tình trạng hệ thống
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-2 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const storagePercentage = stats ? (stats.storage_used / stats.storage_limit) * 100 : 0;
  const getHealthBadge = (health: string) => {
    if (health === 'healthy') {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Tốt</Badge>;
    }
    return <Badge className="bg-yellow-100 text-yellow-800"><AlertTriangle className="h-3 w-3 mr-1" />Cảnh báo</Badge>;
  };

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Tình trạng hệ thống
          <div className="ml-auto">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Server className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium">Trạng thái server</span>
              </div>
              {getHealthBadge(stats?.system_health || 'healthy')}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium">Uptime</span>
              </div>
              <span className="text-sm font-semibold">{stats?.uptime_days || 0} ngày</span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium">Backup cuối</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {stats?.last_backup ? new Date(stats.last_backup).toLocaleDateString('vi-VN') : 'N/A'}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HardDrive className="h-4 w-4 text-orange-600" />
                <span className="text-sm font-medium">Dung lượng</span>
              </div>
              <span className="text-sm font-semibold">
                {stats?.storage_used || 0} / {stats?.storage_limit || 0} GB
              </span>
            </div>
            <Progress value={storagePercentage} className="h-2" />
          </div>
        </div>

        <div className="pt-4 border-t border-border/30">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Phiên bản</span>
            <Badge variant="outline">{stats?.version || 'NESA v2.1.0'}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
