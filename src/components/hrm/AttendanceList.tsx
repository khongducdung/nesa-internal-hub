
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';

export function AttendanceList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Clock className="h-5 w-5 mr-2" />
          Danh sách chấm công
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Chức năng quản lý chấm công sẽ được phát triển</p>
      </CardContent>
    </Card>
  );
}
