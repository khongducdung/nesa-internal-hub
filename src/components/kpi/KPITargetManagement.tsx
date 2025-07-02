import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Target, TrendingUp, TrendingDown, Calendar } from 'lucide-react';
import { useKPIs, useKPITargets } from '@/hooks/useKPI';
import { KPITargetFormDialog } from './KPITargetFormDialog';
import { calculateKPIProgress, getKPIProgressStatus, getPerformanceRatingColor } from '@/types/kpi';
import { format } from 'date-fns';

export function KPITargetManagement() {
  const [selectedKPI, setSelectedKPI] = useState<string>('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const { data: kpis = [] } = useKPIs();
  const { data: targets = [] } = useKPITargets(selectedKPI);

  const selectedKPIData = kpis.find(k => k.id === selectedKPI);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Quản lý mục tiêu KPI</h2>
          <p className="text-muted-foreground">Thiết lập và theo dõi mục tiêu cho các KPI</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} disabled={!selectedKPI}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo mục tiêu
        </Button>
      </div>

      {/* KPI Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Chọn KPI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedKPI} onValueChange={setSelectedKPI}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Chọn KPI để quản lý mục tiêu" />
            </SelectTrigger>
            <SelectContent>
              {kpis.map((kpi) => (
                <SelectItem key={kpi.id} value={kpi.id}>
                  <div className="flex items-center gap-2">
                    <span>{kpi.name}</span>
                    <Badge variant="outline">{kpi.unit}</Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedKPIData && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">KPI hiện tại</p>
                  <p className="font-medium">{selectedKPIData.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Giá trị hiện tại</p>
                  <p className="font-medium">{selectedKPIData.current_value || 0} {selectedKPIData.unit}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Loại đo lường</p>
                  <Badge variant="secondary">{selectedKPIData.kpi_type === 'quantitative' ? 'Định lượng' : 'Định tính'}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tần suất đo</p>
                  <p className="font-medium">
                    {selectedKPIData.measurement_frequency === 'daily' && 'Hàng ngày'}
                    {selectedKPIData.measurement_frequency === 'weekly' && 'Hàng tuần'}
                    {selectedKPIData.measurement_frequency === 'monthly' && 'Hàng tháng'}
                    {selectedKPIData.measurement_frequency === 'quarterly' && 'Hàng quý'}
                    {selectedKPIData.measurement_frequency === 'yearly' && 'Hàng năm'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Targets List */}
      {selectedKPI && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Danh sách mục tiêu
            </CardTitle>
            <CardDescription>
              Các mục tiêu đã thiết lập cho KPI: {selectedKPIData?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {targets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có mục tiêu nào được thiết lập</p>
                <p className="text-sm">Nhấn "Tạo mục tiêu" để bắt đầu</p>
              </div>
            ) : (
              <div className="space-y-4">
                {targets.map((target) => {
                  const currentValue = selectedKPIData?.current_value || 0;
                  const progress = calculateKPIProgress(currentValue, target.target_value);
                  const status = getKPIProgressStatus(progress);
                  
                  return (
                    <div key={target.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">Kỳ: {target.target_period}</h4>
                          <p className="text-sm text-muted-foreground">
                            {target.target_type === 'absolute' && 'Mục tiêu tuyệt đối'}
                            {target.target_type === 'percentage' && 'Mục tiêu phần trăm'}
                            {target.target_type === 'growth' && 'Mục tiêu tăng trưởng'}
                          </p>
                        </div>
                        <Badge 
                          style={{ backgroundColor: getPerformanceRatingColor(status) }}
                          className="text-white"
                        >
                          {progress.toFixed(1)}%
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Mục tiêu</p>
                          <p className="font-medium">{target.target_value} {selectedKPIData?.unit}</p>
                        </div>
                        {target.minimum_acceptable && (
                          <div>
                            <p className="text-sm text-muted-foreground">Tối thiểu</p>
                            <p className="font-medium">{target.minimum_acceptable} {selectedKPIData?.unit}</p>
                          </div>
                        )}
                        {target.excellent_threshold && (
                          <div>
                            <p className="text-sm text-muted-foreground">Xuất sắc</p>
                            <p className="font-medium">{target.excellent_threshold} {selectedKPIData?.unit}</p>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Tiến độ</span>
                          <span>{currentValue} / {target.target_value} {selectedKPIData?.unit}</span>
                        </div>
                        <Progress value={Math.min(progress, 100)} />
                      </div>

                      {target.notes && (
                        <div className="mt-3 p-2 bg-muted/50 rounded text-sm">
                          <p className="text-muted-foreground">Ghi chú:</p>
                          <p>{target.notes}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Target Dialog */}
      <KPITargetFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        kpiId={selectedKPI}
        kpis={kpis}
      />
    </div>
  );
}