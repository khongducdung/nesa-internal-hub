import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function KPIFrameworkManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý khung KPI</CardTitle>
        <CardDescription>Thiết lập khung KPI theo cấp độ tổ chức</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <p>Tính năng đang phát triển...</p>
        </div>
      </CardContent>
    </Card>
  );
}