
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, BarChart3 } from 'lucide-react';
import { useSettings } from '@/components/ui/settings-context';

export function OKRProgressTracking() {
  const { hideDescriptions } = useSettings();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Theo dõi tiến độ OKR</h2>
          {!hideDescriptions && (
            <p className="text-sm text-gray-500 mt-1">
              Theo dõi và cập nhật tiến độ thực hiện các OKR
            </p>
          )}
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <TrendingUp className="h-4 w-4 mr-2" />
          Cập nhật tiến độ
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bảng theo dõi tiến độ</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tính năng đang phát triển</h3>
            <p className="text-gray-500">
              Chức năng theo dõi tiến độ OKR sẽ được hoàn thiện trong phiên bản tiếp theo
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
