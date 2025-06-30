
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  Calendar,
  Users,
  Building2,
  UserCheck
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useCompanyPolicies, useCreateCompanyPolicy, useUpdateCompanyPolicy, useDeleteCompanyPolicy } from '@/hooks/useCompanyPolicies';
import { CompanyPolicyForm } from './CompanyPolicyForm';

export function CompanyPolicyList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [deletePolicy, setDeletePolicy] = useState(null);

  const { data: policies, isLoading } = useCompanyPolicies();
  const createMutation = useCreateCompanyPolicy();
  const updateMutation = useUpdateCompanyPolicy();
  const deleteMutation = useDeleteCompanyPolicy();

  const handleSubmit = async (data: any) => {
    try {
      if (editingPolicy) {
        await updateMutation.mutateAsync({ ...data, id: editingPolicy.id });
        setEditingPolicy(null);
      } else {
        await createMutation.mutateAsync(data);
      }
      setShowForm(false);
    } catch (error) {
      // Error handled in mutation
    }
  };

  const handleEdit = (policy: any) => {
    setEditingPolicy(policy);
    setShowForm(true);
  };

  const handleDelete = async () => {
    if (deletePolicy) {
      await deleteMutation.mutateAsync(deletePolicy.id);
      setDeletePolicy(null);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-red-100 text-red-800', 
      draft: 'bg-yellow-100 text-yellow-800'
    };
    const labels = {
      active: 'Có hiệu lực',
      inactive: 'Tạm dừng',
      draft: 'Bản nháp'
    };
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const getCategoryLabel = (category: string) => {
    const labels = {
      company_rules: 'Quy định chung công ty',
      hr_policy: 'Chính sách nhân sự',
      work_policy: 'Quy định làm việc',
      security_policy: 'Quy định bảo mật',
      finance_policy: 'Quy định tài chính',
      other: 'Khác'
    };
    return labels[category as keyof typeof labels] || category;
  };

  const getTargetIcon = (targetType: string) => {
    switch (targetType) {
      case 'department': return <Building2 className="h-4 w-4" />;
      case 'position': return <UserCheck className="h-4 w-4" />;
      case 'employee': return <Users className="h-4 w-4" />;
      default: return <Users className="h-4 w-4" />;
    }
  };

  const getTargetLabel = (targetType: string) => {
    switch (targetType) {
      case 'general': return 'Toàn công ty';
      case 'department': return 'Phòng ban';
      case 'position': return 'Vị trí';
      case 'employee': return 'Nhân viên';
      default: return 'Toàn công ty';
    }
  };

  const filteredPolicies = policies?.filter(policy => {
    const matchesSearch = policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         policy.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || policy.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || policy.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  }) || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Quy định công ty</h2>
          <p className="text-gray-600 mt-1">Quản lý các quy định và chính sách của công ty</p>
        </div>
        <Button onClick={() => setShowForm(true)} className="mt-4 sm:mt-0">
          <Plus className="h-4 w-4 mr-2" />
          Tạo quy định mới
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
          <Input 
            placeholder="Tìm kiếm quy định..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Tất cả loại" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả loại</SelectItem>
            <SelectItem value="company_rules">Quy định chung</SelectItem>
            <SelectItem value="hr_policy">Chính sách nhân sự</SelectItem>
            <SelectItem value="work_policy">Quy định làm việc</SelectItem>
            <SelectItem value="security_policy">Quy định bảo mật</SelectItem>
            <SelectItem value="finance_policy">Quy định tài chính</SelectItem>
            <SelectItem value="other">Khác</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="active">Có hiệu lực</SelectItem>
            <SelectItem value="draft">Bản nháp</SelectItem>
            <SelectItem value="inactive">Tạm dừng</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardContent className="p-0">
          {filteredPolicies.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có quy định nào</h3>
              <p className="text-gray-600 mb-4">Tạo quy định đầu tiên cho công ty của bạn</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo quy định mới
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tên quy định</TableHead>
                  <TableHead>Loại</TableHead>
                  <TableHead>Áp dụng cho</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày có hiệu lực</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPolicies.map((policy) => (
                  <TableRow key={policy.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{policy.title}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {policy.content}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">{getCategoryLabel(policy.category)}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getTargetIcon(policy.target_type)}
                        <span className="text-sm">{getTargetLabel(policy.target_type)}</span>
                        {policy.target_ids?.length > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {policy.target_ids.length}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(policy.status)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(policy.effective_date), 'dd/MM/yyyy', { locale: vi })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {}}>
                            <Eye className="h-4 w-4 mr-2" />
                            Xem chi tiết
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(policy)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Chỉnh sửa
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setDeletePolicy(policy)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Xóa
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <CompanyPolicyForm
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setEditingPolicy(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingPolicy}
      />

      <AlertDialog open={!!deletePolicy} onOpenChange={() => setDeletePolicy(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa quy định "{deletePolicy?.title}"? 
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
