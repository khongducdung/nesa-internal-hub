
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Target, Calendar, TrendingUp, Edit } from 'lucide-react';

export function MyOKRTasks() {
  // Mock data - sẽ thay thế bằng API call
  const myOKRs = [
    {
      id: 1,
      objective: 'Tăng trưởng doanh thu bán hàng Q1',
      cycle: 'Q1 2024',
      progress: 75,
      status: 'on_track',
      due_date: '2024-03-31',
      key_results: [
        { title: 'Tăng 25% doanh thu so với Q4', progress: 80, target: '25%', current: '20%' },
        { title: 'Thu hút 100 khách hàng mới', progress: 70, target: '100', current: '70' },
        { title: 'Tăng tỷ lệ chuyển đổi lên 20%', progress: 75, target: '20%', current: '15%' }
      ]
    },
    {
      id: 2,
      objective: 'Cải thiện quy trình làm việc',
      cycle: 'Q1 2024',
      progress: 60,
      status: 'at_risk',
      due_date: '2024-03-31',
      key_results: [
        { title: 'Triển khai 3 quy trình mới', progress: 50, target: '3', current: '1.5' },
        { title: 'Giảm 30% thời gian xử lý', progress: 65, target: '30%', current: '19.5%' },
        { title: 'Đạt 95% độ hài lòng nhân viên', progress: 65, target: '95%', current: '87%' }
      ]
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on_track':
        return <Badge className="bg-green-100 text-green-800">Đúng tiến độ</Badge>;
      case 'at_risk':
        return <Badge className="bg-orange-100 text-orange-800">Có rủi ro</Badge>;
      case 'off_track':
        return <Badge className="bg-red-100 text-red-800">Chậm tiến độ</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Hoàn thành</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">OKR của tôi</h2>
          <p className="text-sm text-gray-500 mt-1">
            Danh sách các Objectives được giao và tiến độ thực hiện
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {myOKRs.map((okr) => (
          <Card key={okr.id} className="hover:shadow-md transition-shadow border-l-4 border-l-blue-500">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{okr.objective}</CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>{okr.cycle}</span>
                      </div>
                      <span>Hạn: {new Date(okr.due_date).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600 mb-1">{okr.progress}%</div>
                    <Progress value={okr.progress} className="w-20 h-2" />
                  </div>
                  {getStatusBadge(okr.status)}
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3 ml-13">
                <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  Key Results:
                </h4>
                {okr.key_results.map((kr, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800 mb-1">{kr.title}</p>
                      <div className="flex items-center space-x-3">
                        <Progress value={kr.progress} className="flex-1 h-2" />
                        <span className="text-sm text-gray-600 min-w-[3rem]">{kr.progress}%</span>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      <p className="text-sm font-medium text-gray-900">{kr.current} / {kr.target}</p>
                      <div className={`w-3 h-3 rounded-full ${getProgressColor(kr.progress)} mt-1 ml-auto`} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {myOKRs.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có OKR nào được giao</h3>
              <p className="text-gray-500">
                Bạn chưa được phân công bất kỳ Objectives nào trong chu kỳ hiện tại
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
