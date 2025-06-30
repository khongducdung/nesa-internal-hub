
import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useCompanyPolicies, useDeleteCompanyPolicy, CompanyPolicy } from '@/hooks/useCompanyPolicies';
import { CompanyPolicyForm } from '@/components/hrm/CompanyPolicyForm';
import { useAuth } from '@/hooks/useAuth';
import { 
  FileText, 
  Plus, 
  Search, 
  Calendar,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function CompanyPolicies() {
  const { data: policies = [], isLoading } = useCompanyPolicies();
  const deleteMutation = useDeleteCompanyPolicy();
  const { isAdmin, isSuperAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedPolicy, setSelectedPolicy] = useState<CompanyPolicy | undefined>();
  const [viewPolicy, setViewPolicy] = useState<CompanyPolicy | undefined>();

  const canEdit = isAdmin || isSuperAdmin;

  const filteredPolicies = policies.filter(policy =>
    policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    policy.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryBadge = (category: string) => {
    const categoryMap: Record<string, { label: string; className: string }> = {
      work_hours: { label: 'Giờ làm việc', className: 'bg-blue-100 text-blue-800' },
      leave_policy: { label: 'Nghỉ phép', className: 'bg-green-100 text-green-800' },
      conduct: { label: 'Quy tắc ứng xử', className: 'bg-purple-100 text-purple-800' },
      safety: { label: 'An toàn lao động', className: 'bg-orange-100 text-orange-800' },
      benefits: { label: 'Phúc lợi', className: 'bg-pink-100 text-pink-800' },
      other: { label: 'Khác', className: 'bg-gray-100 text-gray-800' },
    };

    const categoryInfo = categoryMap[category] || categoryMap.other;
    return <Badge className={categoryInfo.className}>{categoryInfo.label}</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">Bản nháp</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Ngưng hoạt động</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const handleEdit = (policy: CompanyPolicy) => {
    setSelectedPolicy(policy);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa quy định này?')) {
      await deleteMutation.mutateAsync(id);
    }
  };

  const handleAdd = () => {
    setSelectedPolicy(undefined);
    setIsFormOpen(true);
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Đang tải...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quy định công ty</h1>
            <p className="text-gray-600 mt-1">Quản lý các quy định và chính sách của công ty</p>
          </div>
          {canEdit && (
            <Button onClick={handleAdd} className="mt-4 sm:mt-0">
              <Plus className="h-4 w-4 mr-2" />
              Thêm quy định
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <Input
              placeholder="Tìm kiếm quy định..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Policies List */}
        <div className="grid gap-6">
          {filteredPolicies.map((policy) => (
            <Card key={policy.id} className="shadow-md border-0 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg font-semibold text-gray-900 mb-2">
                      {policy.title}
                    </CardTitle>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        Hiệu lực: {new Date(policy.effective_date).toLocaleDateString('vi-VN')}
                      </div>
                      {policy.expiry_date && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          Hết hạn: {new Date(policy.expiry_date).toLocaleDateString('vi-VN')}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getCategoryBadge(policy.category)}
                    {getStatusBadge(policy.status)}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setViewPolicy(policy)}>
                          <Eye className="h-4 w-4 mr-2" />
                          Xem chi tiết
                        </DropdownMenuItem>
                        {canEdit && (
                          <>
                            <DropdownMenuItem onClick={() => handleEdit(policy)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(policy.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Xóa
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 line-clamp-3">{policy.content}</p>
              </CardContent>
            </Card>
          ))}

          {filteredPolicies.length === 0 && (
            <Card className="shadow-md border-0">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {searchTerm ? 'Không tìm thấy quy định' : 'Chưa có quy định nào'}
                </h3>
                <p className="text-gray-600 text-center">
                  {searchTerm 
                    ? 'Thử tìm kiếm với từ khóa khác' 
                    : canEdit 
                      ? 'Hãy thêm quy định đầu tiên cho công ty'
                      : 'Chưa có quy định nào được tạo'
                  }
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Form Dialog */}
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {selectedPolicy ? 'Chỉnh sửa quy định' : 'Thêm quy định mới'}
              </DialogTitle>
            </DialogHeader>
            <CompanyPolicyForm
              policy={selectedPolicy}
              onClose={() => setIsFormOpen(false)}
            />
          </DialogContent>
        </Dialog>

        {/* View Dialog */}
        <Dialog open={!!viewPolicy} onOpenChange={() => setViewPolicy(undefined)}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">{viewPolicy?.title}</DialogTitle>
            </DialogHeader>
            {viewPolicy && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  {getCategoryBadge(viewPolicy.category)}
                  {getStatusBadge(viewPolicy.status)}
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Ngày hiệu lực:</span>{' '}
                    {new Date(viewPolicy.effective_date).toLocaleDateString('vi-VN')}
                  </div>
                  {viewPolicy.expiry_date && (
                    <div>
                      <span className="font-medium">Ngày hết hạn:</span>{' '}
                      {new Date(viewPolicy.expiry_date).toLocaleDateString('vi-VN')}
                    </div>
                  )}
                </div>
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Nội dung:</h3>
                  <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700">{viewPolicy.content}</p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
