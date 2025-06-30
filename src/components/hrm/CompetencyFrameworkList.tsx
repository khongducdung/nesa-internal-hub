
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
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
import { Edit, Trash2, Plus, Search, Eye } from 'lucide-react';
import { useCompetencyFrameworks } from '@/hooks/useCompetencyFrameworks';
import { useDeleteCompetencyFramework } from '@/hooks/useCompetencyFrameworkMutations';
import { CompetencyFrameworkFormDialog } from './CompetencyFrameworkFormDialog';
import { CompetencyFrameworkViewDialog } from './CompetencyFrameworkViewDialog';

export function CompetencyFrameworkList() {
  const { data: frameworks, isLoading } = useCompetencyFrameworks();
  const deleteFramework = useDeleteCompetencyFramework();
  const [editingFramework, setEditingFramework] = useState<string | null>(null);
  const [viewingFramework, setViewingFramework] = useState<string | null>(null);
  const [deletingFramework, setDeletingFramework] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Ngưng hoạt động</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">Nháp</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const handleDelete = async () => {
    if (deletingFramework) {
      await deleteFramework.mutateAsync(deletingFramework);
      setDeletingFramework(null);
    }
  };

  const filteredFrameworks = frameworks?.filter(framework =>
    framework.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    framework.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    framework.positions?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {/* Header with search and create button */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Tìm kiếm khung năng lực..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Tạo khung năng lực
          </Button>
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên khung năng lực</TableHead>
                <TableHead>Vị trí</TableHead>
                <TableHead>Mô tả</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFrameworks?.map((framework) => (
                <TableRow key={framework.id}>
                  <TableCell className="font-medium">{framework.name}</TableCell>
                  <TableCell>{framework.positions?.name || 'N/A'}</TableCell>
                  <TableCell>{framework.description || 'N/A'}</TableCell>
                  <TableCell>{getStatusBadge(framework.status || 'active')}</TableCell>
                  <TableCell>{new Date(framework.created_at).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setViewingFramework(framework.id)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingFramework(framework.id)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setDeletingFramework(framework.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create Form Dialog */}
      <CompetencyFrameworkFormDialog
        open={showCreateForm}
        onClose={() => setShowCreateForm(false)}
      />

      {/* Edit Dialog */}
      <CompetencyFrameworkFormDialog
        open={!!editingFramework}
        onClose={() => setEditingFramework(null)}
        frameworkId={editingFramework || undefined}
      />

      {/* View Dialog */}
      <CompetencyFrameworkViewDialog
        open={!!viewingFramework}
        onClose={() => setViewingFramework(null)}
        frameworkId={viewingFramework || undefined}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deletingFramework} onOpenChange={() => setDeletingFramework(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa khung năng lực này? Hành động này không thể hoàn tác.
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
    </>
  );
}
