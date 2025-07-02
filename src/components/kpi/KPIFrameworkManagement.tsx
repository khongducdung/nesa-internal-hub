import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Building2, Users, Target } from 'lucide-react';
import { useKPIFrameworks } from '@/hooks/useKPI';
import { FRAMEWORK_TYPES } from '@/types/kpi';

export function KPIFrameworkManagement() {
  const { data: frameworks = [] } = useKPIFrameworks();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Quản lý khung KPI</h2>
          <p className="text-muted-foreground">Thiết lập khung KPI theo cấp độ tổ chức</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tạo khung KPI
        </Button>
      </div>

      <div className="grid gap-4">
        {frameworks.map((framework) => (
          <Card key={framework.id} className="hover-lift">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    {framework.name}
                  </CardTitle>
                  <CardDescription>{framework.description}</CardDescription>
                </div>
                <Badge>
                  {FRAMEWORK_TYPES.find(t => t.value === framework.framework_type)?.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Cấp độ mục tiêu</p>
                  <p className="font-medium">{framework.target_level}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Phòng ban</p>
                  <p className="font-medium">
                    {framework.departments?.name || 'Tất cả phòng ban'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Trạng thái</p>
                  <Badge variant={framework.is_active ? 'default' : 'secondary'}>
                    {framework.is_active ? 'Hoạt động' : 'Tạm ngưng'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}