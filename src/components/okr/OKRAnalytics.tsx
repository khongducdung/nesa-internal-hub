// OKR Analytics - Analytics and reporting view
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3 } from 'lucide-react';

export function OKRAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <BarChart3 className="h-6 w-6" />
          Phân tích & Báo cáo
        </h2>
        <p className="text-gray-600 mt-1">
          Phân tích hiệu suất và tạo báo cáo OKR
        </p>
      </div>

      <Card>
        <CardContent className="text-center py-12">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Tính năng phân tích
          </h3>
          <p className="text-gray-600">
            Tính năng phân tích và báo cáo sẽ được phát triển trong phiên bản tiếp theo
          </p>
        </CardContent>
      </Card>
    </div>
  );
}