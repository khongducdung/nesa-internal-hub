
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  MoreHorizontal,
  Building2,
  MapPin,
  Calendar,
  Mail,
  Phone
} from 'lucide-react';

export default function HRM() {
  const employees = [
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@company.com',
      phone: '0901234567',
      department: 'Phòng Kỹ Thuật',
      position: 'Senior Developer',
      level: 'Level 2',
      status: 'active',
      joinDate: '2023-01-15',
      avatar: 'A'
    },
    {
      id: 2,
      name: 'Trần Thị B',
      email: 'tranthib@company.com',
      phone: '0901234568',
      department: 'Phòng Nhân Sự',
      position: 'HR Manager',
      level: 'Level 2',
      status: 'active',
      joinDate: '2022-03-20',
      avatar: 'B'
    },
    {
      id: 3,
      name: 'Lê Văn C',
      email: 'levanc@company.com',
      phone: '0901234569',
      department: 'Phòng Kinh Doanh',
      position: 'Sales Executive',
      level: 'Level 3',
      status: 'active',
      joinDate: '2023-06-10',
      avatar: 'C'
    }
  ];

  const departments = [
    { name: 'Phòng Kỹ Thuật', count: 25, color: 'bg-blue-100 text-blue-800' },
    { name: 'Phòng Nhân Sự', count: 8, color: 'bg-green-100 text-green-800' },
    { name: 'Phòng Kinh Doanh', count: 15, color: 'bg-purple-100 text-purple-800' },
    { name: 'Phòng Kế Toán', count: 6, color: 'bg-orange-100 text-orange-800' }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý nhân sự</h1>
            <p className="text-gray-600 mt-1">Quản lý thông tin nhân viên và phòng ban</p>
          </div>
          <Button className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Thêm nhân viên
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng nhân viên</p>
                  <p className="text-3xl font-bold text-gray-900">156</p>
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
                  <p className="text-sm font-medium text-gray-600">Phòng ban</p>
                  <p className="text-3xl font-bold text-gray-900">12</p>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Building2 className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nhân viên mới</p>
                  <p className="text-3xl font-bold text-gray-900">8</p>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
                  <p className="text-3xl font-bold text-gray-900">148</p>
                </div>
                <div className="bg-orange-100 p-3 rounded-lg">
                  <MapPin className="h-6 w-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Departments */}
        <Card>
          <CardHeader>
            <CardTitle>Phòng ban</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {departments.map((dept, index) => (
                <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{dept.name}</h3>
                      <p className="text-sm text-gray-600">{dept.count} nhân viên</p>
                    </div>
                    <Badge className={dept.color}>{dept.count}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Employee List */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <CardTitle>Danh sách nhân viên</CardTitle>
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <div className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                  <Input placeholder="Tìm kiếm nhân viên..." className="pl-10 w-64" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Lọc
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {employees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{employee.avatar}</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{employee.name}</h3>
                      <p className="text-sm text-gray-600">{employee.position}</p>
                      <div className="flex items-center space-x-4 mt-1">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{employee.email}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Phone className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{employee.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{employee.department}</p>
                      <p className="text-xs text-gray-500">{employee.level}</p>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      {employee.status === 'active' ? 'Hoạt động' : 'Không hoạt động'}
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
