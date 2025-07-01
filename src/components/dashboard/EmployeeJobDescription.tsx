
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useEmployees } from '@/hooks/useEmployees';
import { FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function EmployeeJobDescription() {
  const { user } = useAuth();
  const { data: employees } = useEmployees();

  const currentEmployee = employees?.find(emp => emp.auth_user_id === user?.id);

  if (!currentEmployee) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Mô tả công việc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Không tìm thấy thông tin nhân viên</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Mô tả công việc của tôi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentEmployee.job_description ? (
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: currentEmployee.job_description }}
          />
        ) : (
          <p className="text-gray-500 italic">
            Chưa có mô tả công việc được cập nhật
          </p>
        )}

        {/* File attachments */}
        {(currentEmployee.contract_file_url || currentEmployee.cv_file_url) && (
          <div className="mt-6 pt-4 border-t">
            <h4 className="font-medium mb-3">Tài liệu liên quan</h4>
            <div className="flex flex-wrap gap-3">
              {currentEmployee.contract_file_url && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => window.open(currentEmployee.contract_file_url, '_blank')}
                >
                  <Download className="h-4 w-4" />
                  Hợp đồng lao động
                </Button>
              )}
              {currentEmployee.cv_file_url && (
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                  onClick={() => window.open(currentEmployee.cv_file_url, '_blank')}
                >
                  <Download className="h-4 w-4" />
                  CV/Hồ sơ
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
