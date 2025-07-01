
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Target } from 'lucide-react';

export function OKRObjectiveManagement() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Quản lý Objectives</h2>
          <p className="text-sm text-gray-500 mt-1">
            Tạo và quản lý các mục tiêu chính (Objectives) và kết quả then chốt (Key Results)
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Tạo Objective mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Objectives</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tính năng đang phát triển</h3>
            <p className="text-gray-500">
              Chức năng quản lý Objectives sẽ được hoàn thiện trong phiên bản tiếp theo
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
