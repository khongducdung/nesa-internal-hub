
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export function EmployeeList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="h-5 w-5 mr-2" />
          Danh sách nhân viên
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Chức năng quản lý nhân viên sẽ được phát triển</p>
      </CardContent>
    </Card>
  );
}
