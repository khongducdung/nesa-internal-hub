import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function KPITargetManagement() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quản lý mục tiêu KPI</CardTitle>
        <CardDescription>Thiết lập và theo dõi mục tiêu cho các KPI</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8 text-muted-foreground">
          <p>Tính năng đang phát triển...</p>
        </div>
      </CardContent>
    </Card>
  );
}