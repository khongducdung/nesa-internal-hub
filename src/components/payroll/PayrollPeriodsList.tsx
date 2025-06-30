
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Calculator, FileText, Download } from 'lucide-react';
import { usePayrollPeriods, useCreatePayrollPeriod, useGeneratePayroll } from '@/hooks/usePayroll';
import { useSalaryConfigs } from '@/hooks/usePayroll';
import { PayrollPeriodForm } from './PayrollPeriodForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface PayrollPeriodsListProps {
  onSelectPeriod: (periodId: string) => void;
  selectedPeriodId: string;
}

export function PayrollPeriodsList({ onSelectPeriod, selectedPeriodId }: PayrollPeriodsListProps) {
  const { data: periods = [], isLoading } = usePayrollPeriods();
  const { data: configs = [] } = useSalaryConfigs();
  const createMutation = useCreatePayrollPeriod();
  const generateMutation = useGeneratePayroll();
  const [showForm, setShowForm] = useState(false);
  const [selectedConfig, setSelectedConfig] = useState<string>('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'paid': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft': return 'Nháp';
      case 'processing': return 'Đang xử lý';
      case 'completed': return 'Hoàn thành';
      case 'paid': return 'Đã trả lương';
      default: return status;
    }
  };

  const handleGeneratePayroll = async (periodId: string) => {
    if (!selectedConfig) {
      alert('Vui lòng chọn cấu hình tính lương');
      return;
    }
    
    await generateMutation.mutateAsync({ periodId, configId: selectedConfig });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Danh sách kỳ tính lương</h2>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo kỳ mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tạo kỳ tính lương mới</DialogTitle>
            </DialogHeader>
            <PayrollPeriodForm 
              onSubmit={createMutation.mutate}
              onClose={() => setShowForm(false)}
              isLoading={createMutation.isPending}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Cấu hình tính lương */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Cấu hình tính lương</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Select value={selectedConfig} onValueChange={setSelectedConfig}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn cấu hình tính lương" />
                </SelectTrigger>
                <SelectContent>
                  {configs.map((config) => (
                    <SelectItem key={config.id} value={config.id}>
                      {config.name} {config.is_default && '(Mặc định)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {periods.map((period) => (
          <Card 
            key={period.id} 
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedPeriodId === period.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => onSelectPeriod(period.id)}
          >
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{period.name}</h3>
                  <Badge className={getStatusColor(period.status)}>
                    {getStatusText(period.status)}
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Tháng {period.month}/{period.year}</p>
                  <p>Từ {new Date(period.start_date).toLocaleDateString('vi-VN')} đến {new Date(period.end_date).toLocaleDateString('vi-VN')}</p>
                  <p>Số nhân viên: {period.total_employees}</p>
                  <p>Tổng tiền: {period.total_amount.toLocaleString('vi-VN')} VNĐ</p>
                </div>

                <div className="flex items-center space-x-2">
                  {period.status === 'draft' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleGeneratePayroll(period.id);
                      }}
                      disabled={generateMutation.isPending || !selectedConfig}
                    >
                      <Calculator className="h-4 w-4 mr-1" />
                      Tính lương
                    </Button>
                  )}
                  
                  {period.status === 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation();
                        // TODO: Export Excel
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Xuất Excel
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {periods.length === 0 && (
        <div className="text-center py-12">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có kỳ tính lương</h3>
          <p className="mt-1 text-sm text-gray-500">Bắt đầu bằng cách tạo kỳ tính lương đầu tiên.</p>
        </div>
      )}
    </div>
  );
}
