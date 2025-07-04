
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Search,
  Plus,
  Filter,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react';
import { useProcesses, useCreateProcess, useUpdateProcess, useDeleteProcess, type ProcessWithDetails } from '@/hooks/useProcesses';
import { ProcessCard } from '@/components/processes/ProcessCard';
import { ProcessFormDialog } from '@/components/processes/ProcessFormDialog';
import { ProcessViewDialog } from '@/components/processes/ProcessViewDialog';
import { useAuth } from '@/hooks/useAuth';

export default function ProcessManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<ProcessWithDetails | null>(null);
  const [editingProcess, setEditingProcess] = useState<ProcessWithDetails | null>(null);

  const { data: processes = [], isLoading } = useProcesses();
  const createMutation = useCreateProcess();
  const updateMutation = useUpdateProcess();
  const deleteMutation = useDeleteProcess();
  const { user, isLoading: authLoading } = useAuth();

  // Stats
  const processStats = [
    {
      title: 'Tổng quy trình',
      value: processes.length.toString(),
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Đang hoạt động',
      value: processes.filter(p => p.status === 'active').length.toString(),
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Nháp',
      value: processes.filter(p => p.status === 'draft').length.toString(),
      icon: Clock,
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      title: 'Không hoạt động',
      value: processes.filter(p => p.status === 'inactive').length.toString(),
      icon: XCircle,
      color: 'from-red-500 to-red-600',
    }
  ];

  const filteredProcesses = processes.filter(process => {
    const matchesSearch = process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         process.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || process.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleCreateProcess = async (data: any) => {
    await createMutation.mutateAsync(data);
    setFormDialogOpen(false);
  };

  const handleUpdateProcess = async (data: any) => {
    if (editingProcess) {
      await updateMutation.mutateAsync({ id: editingProcess.id, ...data });
      setFormDialogOpen(false);
      setEditingProcess(null);
    }
  };

  const handleViewProcess = (process: ProcessWithDetails) => {
    setSelectedProcess(process);
    setViewDialogOpen(true);
  };

  const handleEditProcess = (process: ProcessWithDetails) => {
    setEditingProcess(process);
    setFormDialogOpen(true);
    setViewDialogOpen(false);
  };

  const handleDeleteProcess = async (process: ProcessWithDetails) => {
    if (confirm(`Bạn có chắc chắn muốn xóa quy trình "${process.name}"?`)) {
      await deleteMutation.mutateAsync(process.id);
    }
  };

  // Hiển thị loading khi đang kiểm tra auth
  if (authLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  // Hiển thị thông báo nếu chưa đăng nhập
  if (!user) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Cần đăng nhập</h2>
          <p className="text-gray-600">Bạn cần đăng nhập để sử dụng chức năng quản lý quy trình.</p>
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
            <h1 className="text-2xl font-bold text-gray-900">Quản lý quy trình</h1>
            <p className="text-gray-600 mt-1">Tạo và quản lý các quy trình công việc</p>
          </div>
          
          <Button onClick={() => setFormDialogOpen(true)} className="mt-4 sm:mt-0">
            <Plus className="h-4 w-4 mr-2" />
            Tạo quy trình
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {processStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                    </div>
                    <div className={`bg-gradient-to-br ${stat.color} p-4 rounded-xl shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Filters */}
        <Card className="shadow-md border-0">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">
              Danh sách quy trình
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input 
                  placeholder="Tìm kiếm quy trình..." 
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="draft">Nháp</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Process List */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-lg p-4 border border-gray-100 animate-pulse">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : filteredProcesses.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy quy trình</h3>
                <p className="text-gray-600 mb-4 max-w-md mx-auto">
                  {searchTerm || statusFilter !== 'all' 
                    ? 'Thử điều chỉnh bộ lọc của bạn để tìm kiếm quy trình khác'
                    : 'Hãy tạo quy trình đầu tiên để bắt đầu'
                  }
                </p>
                {!searchTerm && statusFilter === 'all' && (
                  <Button onClick={() => setFormDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo quy trình đầu tiên
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProcesses.map((process) => (
                  <ProcessCard
                    key={process.id}
                    process={process}
                    onView={handleViewProcess}
                    onEdit={handleEditProcess}
                    onDelete={handleDeleteProcess}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Dialogs */}
        <ProcessFormDialog
          open={formDialogOpen}
          onOpenChange={setFormDialogOpen}
          onSubmit={editingProcess ? handleUpdateProcess : handleCreateProcess}
          initialData={editingProcess}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />

        <ProcessViewDialog
          process={selectedProcess}
          open={viewDialogOpen}
          onOpenChange={setViewDialogOpen}
          onEdit={handleEditProcess}
        />
      </div>
    </DashboardLayout>
  );
}
