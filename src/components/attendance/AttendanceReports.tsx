
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, Download, Filter, FileText, Users, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useAttendanceReports, useAttendanceReportMutations } from '@/hooks/useAttendanceReports';
import { useForm } from 'react-hook-form';

interface ReportFormData {
  name: string;
  report_type: 'daily' | 'weekly' | 'monthly' | 'custom';
  date_from: string;
  date_to: string;
}

export function AttendanceReports() {
  const { data: reports, isLoading } = useAttendanceReports();
  const { generateReport } = useAttendanceReportMutations();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [generating, setGenerating] = useState(false);

  const { register, handleSubmit, reset, watch } = useForm<ReportFormData>({
    defaultValues: {
      report_type: 'monthly',
      date_from: new Date().toISOString().split('T')[0],
      date_to: new Date().toISOString().split('T')[0]
    }
  });

  const onSubmit = async (data: ReportFormData) => {
    setGenerating(true);
    try {
      await generateReport.mutateAsync({
        ...data,
        filters: {} // Can be extended with more filters
      });
      reset();
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error generating report:', error);
    } finally {
      setGenerating(false);
    }
  };

  const getReportTypeLabel = (type: string) => {
    const labels = {
      daily: 'Hàng ngày',
      weekly: 'Hàng tuần', 
      monthly: 'Hàng tháng',
      custom: 'Tùy chỉnh'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const mockStats = {
    totalEmployees: 45,
    presentToday: 42,
    lateToday: 3,
    absentToday: 3
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Báo cáo chấm công</h2>
          <p className="text-gray-600">Xem và tạo báo cáo chi tiết về chấm công</p>
        </div>
        <Button onClick={() => setShowCreateForm(!showCreateForm)}>
          <FileText className="h-4 w-4 mr-2" />
          Tạo báo cáo
        </Button>
      </div>

      {/* Statistics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tổng nhân viên</p>
                <p className="text-2xl font-bold">{mockStats.totalEmployees}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Có mặt hôm nay</p>
                <p className="text-2xl font-bold text-green-600">{mockStats.presentToday}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Đi muộn hôm nay</p>
                <p className="text-2xl font-bold text-yellow-600">{mockStats.lateToday}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Vắng mặt hôm nay</p>
                <p className="text-2xl font-bold text-red-600">{mockStats.absentToday}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Create Report Form */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Tạo báo cáo mới</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tên báo cáo</Label>
                  <Input 
                    placeholder="Ví dụ: Báo cáo chấm công tháng 12"
                    {...register('name', { required: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Loại báo cáo</Label>
                  <Select 
                    value={watch('report_type')} 
                    onValueChange={(value: any) => register('report_type').onChange({ target: { value } })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Hàng ngày</SelectItem>
                      <SelectItem value="weekly">Hàng tuần</SelectItem>
                      <SelectItem value="monthly">Hàng tháng</SelectItem>
                      <SelectItem value="custom">Tùy chỉnh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Từ ngày</Label>
                  <Input 
                    type="date" 
                    {...register('date_from', { required: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Đến ngày</Label>
                  <Input 
                    type="date" 
                    {...register('date_to', { required: true })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                >
                  Hủy
                </Button>
                <Button type="submit" disabled={generating}>
                  {generating ? 'Đang tạo...' : 'Tạo báo cáo'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Lịch sử báo cáo</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Đang tải báo cáo...</div>
          ) : reports && reports.length > 0 ? (
            <div className="space-y-4">
              {reports.map((report) => (
                <div key={report.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FileText className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-medium">{report.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Badge variant="outline">
                          {getReportTypeLabel(report.report_type)}
                        </Badge>
                        <span>
                          {new Date(report.date_from).toLocaleDateString()} - {new Date(report.date_to).toLocaleDateString()}
                        </span>
                        <span>•</span>
                        <span>{new Date(report.generated_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Tải xuống
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Chưa có báo cáo nào</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
