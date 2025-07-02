import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, FileText, TrendingUp, TrendingDown, CheckCircle, AlertTriangle } from 'lucide-react';
import { useKPIs, useKPIReviews } from '@/hooks/useKPI';
import { KPIReviewFormDialog } from './KPIReviewFormDialog';
import { PERFORMANCE_RATINGS, getPerformanceRatingColor } from '@/types/kpi';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

export function KPIReviewManagement() {
  const [selectedKPI, setSelectedKPI] = useState<string>('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const { data: kpis = [] } = useKPIs();
  const { data: reviews = [] } = useKPIReviews(selectedKPI);

  const selectedKPIData = kpis.find(k => k.id === selectedKPI);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'draft':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Đã phê duyệt';
      case 'draft':
        return 'Bản nháp';
      default:
        return 'Đang xử lý';
    }
  };

  const getRatingInfo = (rating: string) => {
    return PERFORMANCE_RATINGS.find(r => r.value === rating);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Quản lý đánh giá KPI</h2>
          <p className="text-muted-foreground">Đánh giá định kỳ hiệu suất KPI</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} disabled={!selectedKPI}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo đánh giá
        </Button>
      </div>

      {/* KPI Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Chọn KPI để đánh giá
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedKPI} onValueChange={setSelectedKPI}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Chọn KPI để thực hiện đánh giá" />
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
                  <p className="text-sm text-muted-foreground">KPI</p>
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
                  <p className="text-sm text-muted-foreground">Trạng thái</p>
                  <Badge variant={selectedKPIData.status === 'active' ? 'default' : 'secondary'}>
                    {selectedKPIData.status === 'active' ? 'Hoạt động' : 'Tạm ngưng'}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reviews List */}
      {selectedKPI && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Lịch sử đánh giá
            </CardTitle>
            <CardDescription>
              Các đánh giá đã thực hiện cho KPI: {selectedKPIData?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {reviews.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chưa có đánh giá nào</p>
                <p className="text-sm">Nhấn "Tạo đánh giá" để bắt đầu</p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Tổng đánh giá</p>
                    <p className="text-2xl font-bold">{reviews.length}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Đánh giá mới nhất</p>
                    <p className="text-lg font-bold">
                      {reviews[0]?.achievement_percentage || 0}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Trung bình đạt được</p>
                    <p className="text-lg font-bold text-primary">
                      {reviews.length > 0 
                        ? (reviews.reduce((sum, r) => sum + (r.achievement_percentage || 0), 0) / reviews.length).toFixed(1)
                        : 0
                      }%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Đã phê duyệt</p>
                    <p className="text-lg font-bold text-success">
                      {reviews.filter(r => r.status === 'approved').length}
                    </p>
                  </div>
                </div>

                {/* Reviews Table */}
                <div className="border rounded-lg">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kỳ đánh giá</TableHead>
                        <TableHead>Tỷ lệ đạt được</TableHead>
                        <TableHead>Mức đánh giá</TableHead>
                        <TableHead>Người đánh giá</TableHead>
                        <TableHead>Trạng thái</TableHead>
                        <TableHead>Ngày đánh giá</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {reviews.map((review) => {
                        const ratingInfo = getRatingInfo(review.performance_rating);
                        
                        return (
                          <TableRow key={review.id} className="cursor-pointer hover:bg-muted/50">
                            <TableCell>
                              <Badge variant="outline">{review.review_period}</Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="font-medium">{review.achievement_percentage || 0}%</span>
                                {(review.achievement_percentage || 0) >= 100 ? (
                                  <TrendingUp className="h-4 w-4 text-success" />
                                ) : (
                                  <TrendingDown className="h-4 w-4 text-destructive" />
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              {ratingInfo && (
                                <Badge 
                                  style={{ backgroundColor: ratingInfo.color }}
                                  className="text-white"
                                >
                                  {ratingInfo.label}
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <span className="text-sm">
                                {review.reviewed_by_employee?.full_name || 'Chưa xác định'}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                {getStatusIcon(review.status)}
                                <span className="text-sm">{getStatusLabel(review.status)}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="text-sm text-muted-foreground">
                                {format(new Date(review.reviewed_at), 'dd/MM/yyyy', { locale: vi })}
                              </span>
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

      {/* Create Review Dialog */}
      <KPIReviewFormDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        kpiId={selectedKPI}
        kpis={kpis}
      />
    </div>
  );
}