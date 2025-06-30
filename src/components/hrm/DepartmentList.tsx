
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building2 } from 'lucide-react';

export function DepartmentList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Building2 className="h-5 w-5 mr-2" />
          Danh sách phòng ban
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Chức năng quản lý phòng ban sẽ được phát triển</p>
      </CardContent>
    </Card>
  );
}
