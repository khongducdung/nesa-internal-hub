import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function KPIActionPlanManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý kế hoạch cải tiến</CardTitle>
        <CardDescription>Tạo và theo dõi các kế hoạch cải tiến KPI</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <p>Tính năng đang phát triển...</p>
        </div>
      </CardContent>
    </Card>
  );
}