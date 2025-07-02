import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { KPIDashboard } from './KPIDashboard';
import { KPIList } from './KPIList';
import { KPITargetManagement } from './KPITargetManagement';
import { KPIMeasurementTracking } from './KPIMeasurementTracking';
import { KPIActionPlanManagement } from './KPIActionPlanManagement';
import { KPIReviewManagement } from './KPIReviewManagement';
import { KPIFrameworkManagement } from './KPIFrameworkManagement';
import { useAuth } from '@/hooks/useAuth';

export function KPIManagement() {
  const { profile } = useAuth();
  
  // Kiểm tra quyền admin để hiển thị các tab quản lý
  const isAdmin = true; // Tạm thời set true, sau này có thể check thực tế từ roles

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Quản lý KPI</h1>
        <p className="text-muted-foreground mt-1">
          Hệ thống quản lý chỉ số đánh giá hiệu suất theo tiêu chuẩn doanh nghiệp
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList variant="primary" className={`grid w-full ${isAdmin ? 'grid-cols-7' : 'grid-cols-4'}`}>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="my-kpis">KPI của tôi</TabsTrigger>
          <TabsTrigger value="measurements">Đo lường</TabsTrigger>
          <TabsTrigger value="action-plans">Kế hoạch cải tiến</TabsTrigger>
          
          {isAdmin && (
            <>
              <TabsTrigger value="all-kpis">Tất cả KPI</TabsTrigger>
              <TabsTrigger value="frameworks">Khung KPI</TabsTrigger>
              <TabsTrigger value="reviews">Đánh giá</TabsTrigger>
            </>
          )}
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <KPIDashboard />
        </TabsContent>

        <TabsContent value="my-kpis" className="mt-6">
          <KPIList showPersonalOnly={true} />
        </TabsContent>

        <TabsContent value="measurements" className="mt-6">
          <KPIMeasurementTracking />
        </TabsContent>

        <TabsContent value="action-plans" className="mt-6">
          <KPIActionPlanManagement />
        </TabsContent>

        {isAdmin && (
          <>
            <TabsContent value="all-kpis" className="mt-6">
              <KPIList showPersonalOnly={false} />
            </TabsContent>

            <TabsContent value="frameworks" className="mt-6">
              <KPIFrameworkManagement />
            </TabsContent>

            <TabsContent value="reviews" className="mt-6">
              <KPIReviewManagement />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}