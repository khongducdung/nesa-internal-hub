import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Filter, Edit, Target, TrendingUp } from 'lucide-react';
import { useKPIs, useAllKPIs, useKPICategories } from '@/hooks/useKPI';
import { calculateKPIProgress, getKPIStatusColor, getPerformanceRatingColor, getKPIProgressStatus } from '@/types/kpi';
import { KPIFormDialog } from './KPIFormDialog';
import { format } from 'date-fns';

interface KPIListProps {
  showPersonalOnly?: boolean;
}

export function KPIList({ showPersonalOnly = true }: KPIListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingKPI, setEditingKPI] = useState<any>(null);

  const { data: personalKPIs = [], isLoading: personalLoading } = useKPIs();
  const { data: allKPIs = [], isLoading: allLoading } = useAllKPIs();
  const { data: categories = [] } = useKPICategories();

  const kpis = showPersonalOnly ? personalKPIs : allKPIs;
  const isLoading = showPersonalOnly ? personalLoading : allLoading;

  // Filter KPIs
  const filteredKPIs = kpis.filter(kpi => {
    const matchesSearch = kpi.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         kpi.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || kpi.kpi_category_id === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || kpi.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="animate-pulse h-6 bg-muted rounded w-48"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse h-16 bg-muted rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{showPersonalOnly ? 'KPI của tôi' : 'Tất cả KPI'}</CardTitle>
              <CardDescription>
                {showPersonalOnly 
                  ? 'Quản lý và theo dõi các KPI được giao cho bạn'
                  : 'Tổng quan tất cả KPI trong hệ thống'
                }
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Tạo KPI mới
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm kiếm KPI..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Chọn danh mục" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả danh mục</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="inactive">Tạm ngưng</SelectItem>
                <SelectItem value="draft">Bản nháp</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* KPI Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên KPI</TableHead>
                  <TableHead>Danh mục</TableHead>
                  <TableHead>Mục tiêu</TableHead>
                  <TableHead>Tiến độ</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Cập nhật</TableHead>
                  <TableHead className="w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKPIs.map((kpi) => {
                  const progress = kpi.current_target && kpi.latest_measurement
                    ? calculateKPIProgress(
                        kpi.latest_measurement.measured_value,
                        kpi.current_target.target_value
                      )
                    : 0;
                  
                  const progressStatus = getKPIProgressStatus(progress);
                  
                  return (
                    <TableRow key={kpi.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{kpi.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {kpi.description}
                          </div>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {kpi.kpi_categories && (
                          <Badge 
                            variant="outline"
                            style={{ 
                              borderColor: kpi.kpi_categories.color,
                              color: kpi.kpi_categories.color 
                            }}
                          >
                            {kpi.kpi_categories.name}
                          </Badge>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {kpi.current_target ? (
                          <div className="text-sm">
                            <div className="font-medium">
                              {kpi.current_target.target_value} {kpi.unit}
                            </div>
                            <div className="text-muted-foreground">
                              {kpi.current_target.target_period}
                            </div>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Chưa đặt mục tiêu</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        {kpi.latest_measurement && kpi.current_target ? (
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium">
                                {progress.toFixed(1)}%
                              </span>
                              <Badge 
                                variant="outline"
                                style={{ backgroundColor: getPerformanceRatingColor(progressStatus) }}
                                className="text-white"
                              >
                                {kpi.latest_measurement.measured_value} {kpi.unit}
                              </Badge>
                            </div>
                            <Progress value={Math.min(progress, 100)} className="h-2" />
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-sm">Chưa có dữ liệu</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <Badge 
                          variant="outline"
                          style={{ backgroundColor: getKPIStatusColor(kpi.status || 'draft') }}
                          className="text-white"
                        >
                          {kpi.status === 'active' ? 'Hoạt động' :
                           kpi.status === 'inactive' ? 'Tạm ngưng' :
                           kpi.status === 'completed' ? 'Hoàn thành' : 'Bản nháp'}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        {kpi.updated_at && (
                          <span className="text-sm text-muted-foreground">
                            {format(new Date(kpi.updated_at), 'dd/MM/yyyy')}
                          </span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingKPI(kpi)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            
            {filteredKPIs.length === 0 && (
              <div className="text-center py-12">
                <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">Không có KPI nào</h3>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all'
                    ? 'Không tìm thấy KPI phù hợp với bộ lọc'
                    : 'Chưa có KPI nào được tạo'
                  }
                </p>
                {!searchTerm && selectedCategory === 'all' && selectedStatus === 'all' && (
                  <Button onClick={() => setShowCreateDialog(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo KPI đầu tiên
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <KPIFormDialog
        open={showCreateDialog || !!editingKPI}
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false);
            setEditingKPI(null);
          }
        }}
        kpi={editingKPI}
      />
    </div>
  );
}