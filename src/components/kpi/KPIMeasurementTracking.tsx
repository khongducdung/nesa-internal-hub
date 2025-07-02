import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Activity, TrendingUp, TrendingDown, Calendar, Target } from 'lucide-react';
import { useKPIs, useKPIMeasurements } from '@/hooks/useKPI';
import { KPIMeasurementFormDialog } from './KPIMeasurementFormDialog';
import { calculateKPIProgress, getKPIProgressStatus, getPerformanceRatingColor } from '@/types/kpi';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export function KPIMeasurementTracking() {
  const [selectedKPI, setSelectedKPI] = useState<string>('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const { data: kpis = [] } = useKPIs();
  const { data: measurements = [] } = useKPIMeasurements(selectedKPI);

  const selectedKPIData = kpis.find(k => k.id === selectedKPI);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Theo dõi đo lường KPI</h2>
          <p className="text-muted-foreground">Nhập và theo dõi các lần đo lường KPI</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} disabled={!selectedKPI}>
          <Plus className="h-4 w-4 mr-2" />
          Thêm đo lường
        </Button>
      </div>

      {/* KPI Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Chọn KPI
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedKPI} onValueChange={setSelectedKPI}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Chọn KPI để theo dõi đo lường" />
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
                  <p className="text-sm text-muted-foreground">Mục tiêu</p>
                  <p className="font-medium">{selectedKPIData.target_value || 'Chưa đặt'} {selectedKPIData.unit}</p>
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

      {/* Measurements List */}
      {selectedKPI && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Lịch sử đo lường
            </CardTitle>
            <CardDescription>
              Các lần đo lường đã ghi nhận cho KPI: {selectedKPIData?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {measurements.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có dữ liệu đo lường nào</p>
                <p className="text-sm">Nhấn "Thêm đo lường" để bắt đầu</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Tổng số lần đo</p>
                    <p className="text-2xl font-bold">{measurements.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Giá trị cao nhất</p>
                    <p className="text-2xl font-bold text-success">
                      {Math.max(...measurements.map(m => m.measured_value))} {selectedKPIData?.unit}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Giá trị trung bình</p>
                    <p className="text-2xl font-bold text-primary">
                      {(measurements.reduce((sum, m) => sum + m.measured_value, 0) / measurements.length).toFixed(1)} {selectedKPIData?.unit}
                    </p>
                  </div>
                </div>

                {/* Measurements Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ngày đo</TableHead>
                        <TableHead>Kỳ đo</TableHead>
                        <TableHead>Giá trị</TableHead>
                        <TableHead>So với mục tiêu</TableHead>
                        <TableHead>Ghi chú</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {measurements.map((measurement) => {
                        const target = selectedKPIData?.current_target?.target_value || selectedKPIData?.target_value;
                        const progress = target ? calculateKPIProgress(measurement.measured_value, target) : 0;
                        const status = getKPIProgressStatus(progress);

                        return (
                          <TableRow key={measurement.id}>
                            <TableCell>
                              {format(new Date(measurement.measurement_date), 'dd/MM/yyyy', { locale: vi })}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{measurement.measurement_period}</Badge>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium">
                                {measurement.measured_value} {selectedKPIData?.unit}
                              </span>
                            </TableCell>
                            <TableCell>
                              {target ? (
                                <div className="flex items-center gap-2">
                                  <Badge 
                                    style={{ backgroundColor: getPerformanceRatingColor(status) }}
                                    className="text-white"
                                  >
                                    {progress.toFixed(1)}%
                                  </Badge>
                                  {measurement.measured_value >= target ? (
                                    <TrendingUp className="h-4 w-4 text-success" />
                                  ) : (
                                    <TrendingDown className="h-4 w-4 text-destructive" />
                                  )}
                                </div>
                              ) : (
                                <span className="text-muted-foreground">Chưa có mục tiêu</span>
                              )}
                            </TableCell>
                            <TableCell>
                              {measurement.notes ? (
                                <span className="text-sm text-muted-foreground">{measurement.notes}</span>
                              ) : (
                                <span className="text-muted-foreground">-</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Create Measurement Dialog */}
      <KPIMeasurementFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        kpiId={selectedKPI}
        kpis={kpis}
      />
    </div>
  );
}