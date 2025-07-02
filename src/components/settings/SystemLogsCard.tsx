import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Eye,
  Download,
  RefreshCw,
  User,
  Clock,
  FileText
} from 'lucide-react';
import { useAuditLogs } from '@/hooks/useSystemSettings';
import { useState } from 'react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export function SystemLogsCard() {
  const [limit, setLimit] = useState(20);
  const { data: auditLogs = [], isLoading, refetch } = useAuditLogs(limit);

  const getActionBadge = (action: string) => {
    const actionMap: Record<string, { label: string; color: string }> = {
      create_admin_user: { label: 'Tạo Admin', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      update_setting: { label: 'Cập nhật', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      delete_user: { label: 'Xóa user', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
      login: { label: 'Đăng nhập', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' }
    };
    
    const config = actionMap[action] || { label: action, color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' };
    
    return (
      <Badge className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const exportLogs = () => {
    const csvContent = [
      ['Thời gian', 'Người dùng', 'Hành động', 'Bảng', 'Chi tiết'],
      ...auditLogs.slice(0, 10).map(log => [
        format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss'),
        log.profiles?.full_name || 'Hệ thống',
        log.action,
        log.table_name || '',
        JSON.stringify(log.new_values || {})
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `audit_logs_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Nhật ký hệ thống
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-3 p-3 border rounded-lg animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                  <div className="h-2 bg-muted rounded w-1/2"></div>
                </div>
                <div className="h-5 w-16 bg-muted rounded"></div>
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
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Nhật ký hệ thống
            <Badge variant="outline" className="ml-2">{auditLogs.length}</Badge>
          </CardTitle>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isLoading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Làm mới
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={exportLogs}
              disabled={auditLogs.length === 0}
            >
              <Download className="h-4 w-4 mr-2" />
              Xuất
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {auditLogs.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
            <h3 className="font-medium text-foreground mb-1">Chưa có hoạt động</h3>
            <p className="text-sm text-muted-foreground">
              Nhật ký sẽ hiển thị khi có hoạt động hệ thống
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {auditLogs.slice(0, 10).map((log) => (
              <div key={log.id} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 text-white" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-foreground text-sm">
                      {log.profiles?.full_name || 'Hệ thống'}
                    </span>
                    {getActionBadge(log.action)}
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {format(new Date(log.created_at), 'dd/MM HH:mm', { locale: vi })}
                      </span>
                    </div>
                    
                    {log.table_name && (
                      <span>Bảng: {log.table_name}</span>
                    )}
                  </div>
                </div>
                
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <Eye className="h-3 w-3" />
                </Button>
              </div>
            ))}
            
            {auditLogs.length > 10 && (
              <div className="text-center pt-3 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLimit(prev => prev + 20)}
                >
                  Xem thêm
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}