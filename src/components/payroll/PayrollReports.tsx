
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { usePayrollPeriods } from '@/hooks/usePayroll';

export function PayrollReports() {
  const { data: periods = [] } = usePayrollPeriods();

  // Tạo dữ liệu cho biểu đồ
  const monthlyData = periods.slice(0, 6).reverse().map(period => ({
    name: `T${period.month}/${period.year}`,
    amount: period.total_amount,
    employees: period.total_employees,
  }));

  const statusData = [
    { name: 'Nháp', value: periods.filter(p => p.status === 'draft').length, color: '#6B7280' },
    { name: 'Đang xử lý', value: periods.filter(p => p.status === 'processing').length, color: '#F59E0B' },
    { name: 'Hoàn thành', value: periods.filter(p => p.status === 'completed').length, color: '#10B981' },
    { name: 'Đã trả lương', value: periods.filter(p => p.status === 'paid').length, color: '#3B82F6' },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Báo cáo lương</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ tổng lương theo tháng */}
        <Card>
          <CardHeader>
            <CardTitle>Tổng lương theo tháng</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => [
                    `${value.toLocaleString('vi-VN')} VNĐ`,
                    'Tổng lương'
                  ]}
                />
                <Bar dataKey="amount" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Biểu đồ trạng thái kỳ lương */}
        <Card>
          <CardHeader>
            <CardTitle>Trạng thái kỳ lương</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Thống kê tổng quan */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê tổng quan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {periods.length}
              </div>
              <div className="text-sm text-gray-600">Tổng kỳ lương</div>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {periods.filter(p => p.status === 'completed' || p.status === 'paid').length}
              </div>
              <div className="text-sm text-gray-600">Đã hoàn thành</div>
            </div>
            
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {periods.reduce((sum, p) => sum + p.total_employees, 0)}
              </div>
              <div className="text-sm text-gray-600">Tổng lượt tính lương</div>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {periods.reduce((sum, p) => sum + p.total_amount, 0).toLocaleString('vi-VN')}
              </div>
              <div className="text-sm text-gray-600">Tổng tiền lương (VNĐ)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
