
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, FileText } from 'lucide-react';

export function KPIEvaluationManagement() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Đánh giá KPI</h2>
          <p className="text-sm text-gray-500 mt-1">
            Đánh giá hiệu suất KPI của nhân viên và tính toán điểm số
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Star className="h-4 w-4 mr-2" />
          Đánh giá mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách cần đánh giá</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tính năng đang phát triển</h3>
            <p className="text-gray-500">
              Chức năng đánh giá KPI sẽ được hoàn thiện trong phiên bản tiếp theo
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
