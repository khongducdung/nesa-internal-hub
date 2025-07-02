import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function KPIReviewManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý đánh giá KPI</CardTitle>
        <CardDescription>Đánh giá định kỳ hiệu suất KPI</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <p>Tính năng đang phát triển...</p>
        </div>
      </CardContent>
    </Card>
  );
}