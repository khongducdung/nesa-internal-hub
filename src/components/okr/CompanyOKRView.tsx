
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Building2, Target, TrendingUp } from 'lucide-react';

export function CompanyOKRView() {
  // Mock data - sẽ thay thế bằng API call
  const companyOKRs = [
    {
      id: 1,
      title: 'Tăng trưởng doanh thu 50% trong năm 2024',
      description: 'Mở rộng thị trường và phát triển sản phẩm mới',
      progress: 68,
      status: 'on_track',
      cycle: 'Năm 2024',
      key_results: [
        { title: 'Tăng 30% khách hàng mới', progress: 75, target: '30%', current: '22.5%' },
        { title: 'Ra mắt 3 sản phẩm mới', progress: 67, target: '3', current: '2' },
        { title: 'Mở rộng 5 thị trường mới', progress: 60, target: '5', current: '3' }
      ]
    },
    {
      id: 2,
      title: 'Nâng cao chất lượng dịch vụ khách hàng',
      description: 'Đạt mức độ hài lòng khách hàng 95%',
      progress: 82,
      status: 'on_track',
      cycle: 'Q1 2024',
      key_results: [
        { title: 'Giảm thời gian phản hồi xuống 2h', progress: 90, target: '2h', current: '2.2h' },
        { title: 'Đạt 95% độ hài lòng khách hàng', progress: 85, target: '95%', current: '91%' },
        { title: 'Xử lý 100% khiếu nại trong 24h', progress: 70, target: '100%', current: '85%' }
      ]
    }
  ];

  const departmentOKRs = [
    {
      department: 'Phòng Kinh Doanh',
      okr_title: 'Tăng 40% doanh số bán hàng Q1',
      progress: 85,
      contributes_to: 'Tăng trưởng doanh thu 50% trong năm 2024'
    },
    {
      department: 'Phòng Kỹ Thuật',
      okr_title: 'Phát triển 2 tính năng mới',
      progress: 60,
      contributes_to: 'Tăng trưởng doanh thu 50% trong năm 2024'
    },
    {
      department: 'Phòng Chăm Sóc Khách Hàng',
      okr_title: 'Nâng cao chất lượng hỗ trợ',
      progress: 92,
      contributes_to: 'Nâng cao chất lượng dịch vụ khách hàng'
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
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Company OKRs */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Building2 className="h-6 w-6 text-blue-600" />
          <h2 className="text-xl font-bold text-gray-900">OKR Công ty</h2>
        </div>
        
        <div className="space-y-4">
          {companyOKRs.map((okr) => (
            <Card key={okr.id} className="border-l-4 border-l-blue-600 hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{okr.title}</CardTitle>
                    <p className="text-sm text-gray-600 mb-3">{okr.description}</p>
                    <Badge variant="outline" className="mb-2">{okr.cycle}</Badge>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{okr.progress}%</div>
                      <Progress value={okr.progress} className="w-24 h-2" />
                    </div>
                    {getStatusBadge(okr.status)}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <h4 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
                    <Target className="h-4 w-4 text-blue-600" />
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
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Department OKRs */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-6 w-6 text-green-600" />
          <h2 className="text-xl font-bold text-gray-900">OKR Theo Phòng Ban</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {departmentOKRs.map((dept, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="font-semibold text-gray-900">{dept.department}</h3>
                </div>
                
                <p className="text-sm text-gray-800 mb-3 font-medium">{dept.okr_title}</p>
                
                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Tiến độ</span>
                    <span className="text-sm font-medium text-blue-600">{dept.progress}%</span>
                  </div>
                  <Progress value={dept.progress} className="h-2" />
                </div>
                
                <div className="text-xs text-gray-500 p-2 bg-blue-50 rounded">
                  <strong>Đóng góp cho:</strong> {dept.contributes_to}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
