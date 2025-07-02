import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from 'react-hook-form';
import { useCreateKPI, useUpdateKPI, useKPICategories, useKPIFrameworks } from '@/hooks/useKPI';
import { useDepartments } from '@/hooks/useDepartments';
import { useEmployees } from '@/hooks/useEmployees';
import { useAuth } from '@/hooks/useAuth';
import { KPI_MEASUREMENT_FREQUENCIES, KPI_TYPES, TREND_DIRECTIONS, KPI_STATUSES } from '@/types/kpi';
import { toast } from '@/hooks/use-toast';

interface KPIFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  kpi?: any;
}

export function KPIFormDialog({ open, onOpenChange, kpi }: KPIFormDialogProps) {
  const { profile } = useAuth();
  const { data: categories = [] } = useKPICategories();
  const { data: frameworks = [] } = useKPIFrameworks();
  const { data: departments = [] } = useDepartments();
  const { data: employees = [] } = useEmployees();
  
  const createKPI = useCreateKPI();
  const updateKPI = useUpdateKPI();

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    defaultValues: {
      name: kpi?.name || '',
      description: kpi?.description || '',
      unit: kpi?.unit || '',
      period: kpi?.period || 'monthly',
      year: kpi?.year || new Date().getFullYear(),
      employee_id: kpi?.employee_id || profile?.employee_id || '',
      target_value: kpi?.target_value || '',
      current_value: kpi?.current_value || 0,
      status: kpi?.status || 'active',
      kpi_category_id: kpi?.kpi_category_id || '',
      kpi_framework_id: kpi?.kpi_framework_id || '',
      measurement_frequency: kpi?.measurement_frequency || 'monthly',
      weight: kpi?.weight || 100,
      baseline_value: kpi?.baseline_value || '',
      calculation_method: kpi?.calculation_method || '',
      data_source: kpi?.data_source || '',
      responsible_person_id: kpi?.responsible_person_id || '',
      kpi_type: kpi?.kpi_type || 'quantitative',
      trend_direction: kpi?.trend_direction || 'increase',
      start_date: kpi?.start_date || new Date().toISOString().split('T')[0],
      end_date: kpi?.end_date || ''
    }
  });

  React.useEffect(() => {
    if (kpi) {
      Object.keys(kpi).forEach(key => {
        setValue(key as any, kpi[key]);
      });
    } else {
      reset();
    }
  }, [kpi, setValue, reset]);

  const onSubmit = async (data: any) => {
    try {
      if (kpi) {
        await updateKPI.mutateAsync({ id: kpi.id, ...data });
        toast({
          title: "Thành công",
          description: "KPI đã được cập nhật thành công!"
        });
      } else {
        await createKPI.mutateAsync({
          ...data,
          employee_id: data.employee_id || profile?.employee_id
        });
        toast({
          title: "Thành công",
          description: "KPI đã được tạo thành công!"
        });
      }
      onOpenChange(false);
      reset();
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi lưu KPI. Vui lòng thử lại.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{kpi ? 'Chỉnh sửa KPI' : 'Tạo KPI mới'}</DialogTitle>
          <DialogDescription>
            {kpi ? 'Cập nhật thông tin KPI' : 'Điền thông tin để tạo KPI mới theo tiêu chuẩn doanh nghiệp'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Thông tin cơ bản</h3>
              
              <div>
                <Label htmlFor="name">Tên KPI *</Label>
                <Input
                  id="name"
                  {...register('name', { required: 'Tên KPI là bắt buộc' })}
                  placeholder="VD: Doanh thu tháng"
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{String(errors.name.message)}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Mô tả</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Mô tả chi tiết về KPI này"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="unit">Đơn vị *</Label>
                  <Input
                    id="unit"
                    {...register('unit', { required: 'Đơn vị là bắt buộc' })}
                    placeholder="VD: VND, %, số lượng"
                  />
                  {errors.unit && (
                    <p className="text-sm text-destructive mt-1">{String(errors.unit.message)}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="period">Chu kỳ</Label>
                  <Input
                    id="period"
                    {...register('period')}
                    placeholder="VD: Q1 2024, Tháng 1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="year">Năm *</Label>
                  <Input
                    id="year"
                    type="number"
                    {...register('year', { 
                      required: 'Năm là bắt buộc',
                      min: { value: 2020, message: 'Năm phải từ 2020 trở lên' },
                      max: { value: 2030, message: 'Năm không được quá 2030' }
                    })}
                  />
                  {errors.year && (
                    <p className="text-sm text-destructive mt-1">{String(errors.year.message)}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="weight">Trọng số (%)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    {...register('weight')}
                  />
                </div>
              </div>
            </div>

            {/* Configuration */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Cấu hình</h3>

              <div>
                <Label htmlFor="kpi_category_id">Danh mục KPI</Label>
                <Select onValueChange={(value) => setValue('kpi_category_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="kpi_framework_id">Khung KPI</Label>
                <Select onValueChange={(value) => setValue('kpi_framework_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khung KPI" />
                  </SelectTrigger>
                  <SelectContent>
                    {frameworks.map(framework => (
                      <SelectItem key={framework.id} value={framework.id}>
                        {framework.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="measurement_frequency">Tần suất đo lường</Label>
                <Select onValueChange={(value) => setValue('measurement_frequency', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn tần suất" />
                  </SelectTrigger>
                  <SelectContent>
                    {KPI_MEASUREMENT_FREQUENCIES.map(freq => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="kpi_type">Loại KPI</Label>
                  <Select onValueChange={(value) => setValue('kpi_type', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn loại" />
                    </SelectTrigger>
                    <SelectContent>
                      {KPI_TYPES.map(type => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="trend_direction">Hướng xu hướng</Label>
                  <Select onValueChange={(value) => setValue('trend_direction', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn hướng" />
                    </SelectTrigger>
                    <SelectContent>
                      {TREND_DIRECTIONS.map(trend => (
                        <SelectItem key={trend.value} value={trend.value}>
                          {trend.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="status">Trạng thái</Label>
                <Select onValueChange={(value) => setValue('status', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {KPI_STATUSES.map(status => (
                      <SelectItem key={status.value} value={status.value}>
                        {status.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Additional Configuration */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Cấu hình bổ sung</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employee_id">Nhân viên phụ trách</Label>
                <Select onValueChange={(value) => setValue('employee_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn nhân viên" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.full_name} - {employee.employee_code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="responsible_person_id">Người chịu trách nhiệm</Label>
                <Select onValueChange={(value) => setValue('responsible_person_id', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn người chịu trách nhiệm" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map(employee => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.full_name} - {employee.employee_code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="baseline_value">Giá trị cơ sở</Label>
                <Input
                  id="baseline_value"
                  type="number"
                  step="0.01"
                  {...register('baseline_value')}
                  placeholder="Giá trị khởi điểm"
                />
              </div>

              <div>
                <Label htmlFor="data_source">Nguồn dữ liệu</Label>
                <Input
                  id="data_source"
                  {...register('data_source')}
                  placeholder="VD: Hệ thống CRM, Báo cáo tài chính"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="calculation_method">Phương pháp tính toán</Label>
              <Textarea
                id="calculation_method"
                {...register('calculation_method')}
                placeholder="Mô tả cách tính toán KPI này"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start_date">Ngày bắt đầu</Label>
                <Input
                  id="start_date"
                  type="date"
                  {...register('start_date')}
                />
              </div>

              <div>
                <Label htmlFor="end_date">Ngày kết thúc</Label>
                <Input
                  id="end_date"
                  type="date"
                  {...register('end_date')}
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button 
              type="submit" 
              disabled={createKPI.isPending || updateKPI.isPending}
            >
              {createKPI.isPending || updateKPI.isPending ? 'Đang lưu...' : (kpi ? 'Cập nhật' : 'Tạo KPI')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}