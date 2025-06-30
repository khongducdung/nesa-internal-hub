
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PayrollPeriodsList } from './PayrollPeriodsList';
import { PayrollDetailsView } from './PayrollDetailsView';
import { SalaryConfigsList } from './SalaryConfigsList';
import { PayrollReports } from './PayrollReports';

export function PayrollManagement() {
  const [selectedPeriodId, setSelectedPeriodId] = useState<string>('');

  return (
    <Tabs defaultValue="periods" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="periods">Kỳ tính lương</TabsTrigger>
        <TabsTrigger value="details">Chi tiết lương</TabsTrigger>
        <TabsTrigger value="configs">Cấu hình</TabsTrigger>
        <TabsTrigger value="reports">Báo cáo</TabsTrigger>
      </TabsList>
      
      <TabsContent value="periods" className="mt-6">
        <PayrollPeriodsList 
          onSelectPeriod={setSelectedPeriodId}
          selectedPeriodId={selectedPeriodId}
        />
      </TabsContent>
      
      <TabsContent value="details" className="mt-6">
        <PayrollDetailsView periodId={selectedPeriodId} />
      </TabsContent>
      
      <TabsContent value="configs" className="mt-6">
        <SalaryConfigsList />
      </TabsContent>
      
      <TabsContent value="reports" className="mt-6">
        <PayrollReports />
      </TabsContent>
    </Tabs>
  );
}
