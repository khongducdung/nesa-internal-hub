
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, FileText } from 'lucide-react';
import { usePayrollDetails } from '@/hooks/usePayroll';

interface PayrollDetailsViewProps {
  periodId: string;
}

export function PayrollDetailsView({ periodId }: PayrollDetailsViewProps) {
  const { data: details = [], isLoading } = usePayrollDetails(periodId);

  const handleExportExcel = () => {
    if (!details.length) return;

    // Tạo dữ liệu Excel
    const excelData = details.map((detail, index) => ({
      'STT': index + 1,
      'Mã NV': detail.employee?.employee_code || '',
      'Họ tên': detail.employee?.full_name || '',
      'Phòng ban': detail.employee?.department?.name || '',
      'Chức vụ': detail.employee?.position?.name || '',
      'Lương cơ bản': detail.base_salary,
      'Số ngày làm': detail.working_days,
      'Số ngày có mặt': detail.present_days,
      'Số ngày vắng': detail.absent_days,
      'Số ngày trễ': detail.late_days,
      'Giờ tăng ca': detail.overtime_hours,
      'Tiền tăng ca': detail.overtime_amount,
      'Phụ cấp': detail.allowances,
      'Khấu trừ': detail.deductions,
      'Thưởng': detail.bonus,
      'Phạt': detail.penalties,
      'Lương gốp': detail.gross_salary,
      'Thuế': detail.tax_amount,
      'Bảo hiểm': detail.insurance_amount,
      'Lương thực nhận': detail.net_salary,
      'Ghi chú': detail.notes || '',
    }));

    // Chuyển đổi thành CSV
    const headers = Object.keys(excelData[0] || {});
    const csvContent = [
      headers.join(','),
      ...excelData.map(row => headers.map(header => `"${row[header as keyof typeof row] || ''}"`).join(','))
    ].join('\n');

    // Tạo file và download
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `bang-luong-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  if (!periodId) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Chọn kỳ tính lương</h3>
          <p className="mt-1 text-sm text-gray-500">Vui lòng chọn một kỳ tính lương để xem chi tiết.</p>
        </CardContent>
      </Card>
    );
  }

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
        <h2 className="text-xl font-semibold">Chi tiết lương nhân viên</h2>
        {details.length > 0 && (
          <Button onClick={handleExportExcel}>
            <Download className="h-4 w-4 mr-2" />
            Xuất Excel
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bảng lương chi tiết</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nhân viên</TableHead>
                  <TableHead>Phòng ban</TableHead>
                  <TableHead>Ngày công</TableHead>
                  <TableHead>Tăng ca</TableHead>
                  <TableHead>Lương gốc</TableHead>
                  <TableHead>Phụ cấp</TableHead>
                  <TableHead>Khấu trừ</TableHead>
                  <TableHead>Thuế</TableHead>
                  <TableHead>Thực nhận</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {details.map((detail) => (
                  <TableRow key={detail.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{detail.employee?.full_name}</div>
                        <div className="text-sm text-gray-500">{detail.employee?.employee_code}</div>
                      </div>
                    </TableCell>
                    <TableCell>{detail.employee?.department?.name || '-'}</TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>Có mặt: {detail.present_days}/{detail.working_days}</div>
                        {detail.absent_days > 0 && (
                          <Badge variant="destructive" className="text-xs mt-1">
                            Vắng: {detail.absent_days}
                          </Badge>
                        )}
                        {detail.late_days > 0 && (
                          <Badge variant="secondary" className="text-xs mt-1">
                            Trễ: {detail.late_days}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {detail.overtime_hours > 0 ? (
                        <div className="text-sm">
                          <div>{detail.overtime_hours}h</div>
                          <div className="text-gray-500">
                            {detail.overtime_amount.toLocaleString('vi-VN')} VNĐ
                          </div>
                        </div>
                      ) : '-'}
                    </TableCell>
                    <TableCell>{detail.gross_salary.toLocaleString('vi-VN')} VNĐ</TableCell>
                    <TableCell>{detail.allowances.toLocaleString('vi-VN')} VNĐ</TableCell>
                    <TableCell>
                      {(detail.deductions + detail.penalties) > 0 ? (
                        <span className="text-red-600">
                          {(detail.deductions + detail.penalties).toLocaleString('vi-VN')} VNĐ
                        </span>
                      ) : '-'}
                    </TableCell>
                    <TableCell>{detail.tax_amount.toLocaleString('vi-VN')} VNĐ</TableCell>
                    <TableCell>
                      <span className="font-medium text-green-600">
                        {detail.net_salary.toLocaleString('vi-VN')} VNĐ
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {details.length === 0 && (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có dữ liệu lương</h3>
              <p className="mt-1 text-sm text-gray-500">Kỳ tính lương này chưa được tính toán.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
