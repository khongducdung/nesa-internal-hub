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

export function AuditLogsCard() {
  const [limit, setLimit] = useState(50);
  const { data: auditLogs = [], isLoading, refetch } = useAuditLogs(limit);

  const getActionBadge = (action: string) => {
    const actionMap: Record<string, { label: string; color: string }> = {
      create_admin_user: { label: 'Tạo Admin', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' },
      update_setting: { label: 'Cập nhật cài đặt', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' },
      delete_user: { label: 'Xóa user', color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300' },
      login: { label: 'Đăng nhập', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' },
      logout: { label: 'Đăng xuất', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300' }
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
      ['Thời gian', 'Người dùng', 'Hành động', 'Bảng', 'ID bản ghi', 'Giá trị mới'],
      ...auditLogs.map(log => [
        format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss'),
        log.profiles?.full_name || 'Hệ thống',
        log.action,
        log.table_name || '',
        log.record_id || '',
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
      <Card className="shadow-md border-0">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-foreground flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Nhật ký hoạt động
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
                <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-6 w-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md border-0">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="text-xl font-semibold text-foreground flex items-center">
            <Activity className="h-5 w-5 mr-2" />
            Nhật ký hoạt động
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
              Xuất CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {auditLogs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">Chưa có hoạt động nào</h3>
            <p className="text-muted-foreground">
              Nhật ký hoạt động sẽ được hiển thị tại đây khi có các thao tác quản trị
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div key={log.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-all duration-200 group">
                <div className="flex items-start space-x-3 flex-1 min-w-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-foreground">
                        {log.profiles?.full_name || 'Hệ thống'}
                      </span>
                      {getActionBadge(log.action)}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {log.profiles?.email || 'system@admin'}
                    </p>
                    
                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm:ss', { locale: vi })}
                        </span>
                      </div>
                      
                      {log.table_name && (
                        <span>Bảng: {log.table_name}</span>
                      )}
                      
                      {log.record_id && (
                        <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded">
                          ID: {log.record_id.slice(0, 8)}...
                        </span>
                      )}
                    </div>
                    
                    {log.new_values && Object.keys(log.new_values).length > 0 && (
                      <div className="mt-2 p-2 bg-muted/50 rounded text-xs">
                        <span className="font-medium">Thay đổi: </span>
                        <span className="font-mono">
                          {JSON.stringify(log.new_values, null, 0)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {auditLogs.length >= limit && (
              <div className="text-center py-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setLimit(prev => prev + 50)}
                >
                  Tải thêm hoạt động
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}