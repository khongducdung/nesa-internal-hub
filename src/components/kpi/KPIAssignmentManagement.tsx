
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';

export function KPIAssignmentManagement() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Phân công KPI</h2>
          <p className="text-sm text-gray-500 mt-1">
            Phân công các KPI cụ thể cho từng nhân viên theo chu kỳ
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Phân công KPI mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách phân công</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tính năng đang phát triển</h3>
            <p className="text-gray-500">
              Chức năng phân công KPI sẽ được hoàn thiện trong phiên bản tiếp theo
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
