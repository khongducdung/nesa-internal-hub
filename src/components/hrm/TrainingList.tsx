
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';

export function TrainingList() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <GraduationCap className="h-5 w-5 mr-2" />
          Danh sách đào tạo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">Chức năng quản lý đào tạo sẽ được phát triển</p>
      </CardContent>
    </Card>
  );
}
