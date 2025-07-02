
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plus, Building2, Target, TrendingUp, Users, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDepartmentOKRs } from '@/hooks/useOKR';
import { useAuth } from '@/hooks/useAuth';
import { useDepartments } from '@/hooks/useDepartments';
import { OKREditDialog } from './OKREditDialog';
import { OKRViewDialog } from './OKRViewDialog';

export function DepartmentOKRView() {
  const { profile } = useAuth();
  const { data: departmentOKRs = [], isLoading } = useDepartmentOKRs();
  const { data: departments = [] } = useDepartments();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedOKR, setSelectedOKR] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Tìm phòng ban của user hiện tại
  const userDepartment = departments.find(dept => dept.id === profile?.department_id);
  const isManager = profile?.employee_level === 'level_1' || profile?.employee_level === 'level_2';

  // Filter OKRs
  const filteredOKRs = departmentOKRs.filter(okr => {
    const matchesSearch = okr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         okr.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || okr.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = {
      'active': { label: 'Đang thực hiện', variant: 'default' },
      'completed': { label: 'Hoàn thành', variant: 'success' },
      'draft': { label: 'Nháp', variant: 'secondary' },
      'cancelled': { label: 'Đã hủy', variant: 'destructive' }
    };
    const config = statusConfig[status] || statusConfig.active;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const getProgressColor = (progress) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 80) return 'bg-blue-500';
    if (progress >= 60) return 'bg-green-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải OKR phòng ban...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            OKR Phòng ban: {userDepartment?.name || 'Chưa xác định'}
          </h2>
          <p className="text-gray-600 mt-1">
            Quản lý mục tiêu phòng ban và theo dõi tiến độ thực hiện
          </p>
        </div>
        {isManager && (
          <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Tạo OKR phòng ban
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm OKR..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Lọc theo trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Tất cả trạng thái</SelectItem>
                <SelectItem value="active">Đang thực hiện</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="draft">Nháp</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => {
              setSearchTerm('');
              setStatusFilter('');
            }}>
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Department Summary */}
      {filteredOKRs.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tổng OKRs</p>
                  <p className="text-2xl font-bold">{filteredOKRs.length}</p>
                </div>
                <Target className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Tiến độ TB</p>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(filteredOKRs.reduce((sum, okr) => sum + okr.progress, 0) / filteredOKRs.length)}%
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Hoàn thành</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {filteredOKRs.filter(okr => okr.status === 'completed').length}
                  </p>
                </div>
                <Badge className="h-8 w-8 rounded-full bg-purple-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Key Results</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {filteredOKRs.reduce((sum, okr) => sum + (okr.key_results?.length || 0), 0)}
                  </p>
                </div>
                <Users className="h-8 w-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* OKRs List */}
      <div className="space-y-4">
        {filteredOKRs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {departmentOKRs.length === 0 ? 'Chưa có OKR phòng ban' : 'Không tìm thấy OKR'}
              </h3>
              <p className="text-gray-500 text-center mb-4">
                {departmentOKRs.length === 0 
                  ? 'Hãy tạo OKR đầu tiên cho phòng ban của bạn để bắt đầu theo dõi mục tiêu.'
                  : 'Thử điều chỉnh bộ lọc để tìm thấy OKR phù hợp.'
                }
              </p>
              {isManager && departmentOKRs.length === 0 && (
                <Button onClick={() => setShowCreateDialog(true)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Tạo OKR đầu tiên
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredOKRs.map((okr) => (
            <Card key={okr.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-blue-600" />
                      {okr.title}
                    </CardTitle>
                    <p className="text-gray-600 text-sm mb-3">{okr.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Chu kỳ: {okr.cycle?.name || `${okr.quarter} ${okr.year}`}</span>
                      <span>Key Results: {okr.key_results?.length || 0}</span>
                      <span>Phòng ban: {userDepartment?.name}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600 mb-1">{okr.progress}%</div>
                      {getStatusBadge(okr.status)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedOKR(okr);
                        setShowViewDialog(true);
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">Tiến độ tổng thể</span>
                      <span className="text-sm text-gray-500">{okr.progress}%</span>
                    </div>
                    <Progress 
                      value={okr.progress} 
                      className={`h-2 ${getProgressColor(okr.progress)}`}
                    />
                  </div>

                  {okr.key_results && okr.key_results.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-2">Key Results:</p>
                      <div className="space-y-2">
                        {okr.key_results.slice(0, 3).map((kr) => (
                          <div key={kr.id} className="flex items-center justify-between text-sm">
                            <span className="text-gray-600 truncate flex-1">{kr.title}</span>
                            <div className="flex items-center gap-2 ml-4">
                              <Progress value={kr.progress} className="w-16 h-1" />
                              <span className="font-medium text-gray-700 min-w-[3rem]">{kr.progress}%</span>
                            </div>
                          </div>
                        ))}
                        {okr.key_results.length > 3 && (
                          <p className="text-xs text-gray-500">
                            +{okr.key_results.length - 3} KR khác
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Dialogs */}
      <OKREditDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
        okr={null}
        defaultOwnerType="department"
        defaultDepartmentId={profile?.department_id}
      />

      <OKRViewDialog
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
        okr={selectedOKR}
      />
    </div>
  );
}
