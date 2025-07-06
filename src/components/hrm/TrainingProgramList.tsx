
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useTrainingPrograms, useDeleteTrainingProgram, TrainingProgram } from '@/hooks/useTrainingPrograms';
import { TrainingProgramForm } from './TrainingProgramForm';
import { TrainingProgramViewDialog } from './TrainingProgramViewDialog';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit, 
  Trash2, 
  Calendar, 
  Users, 
  User,
  BookOpen,
  AlertTriangle
} from 'lucide-react';
import { formatDate } from '@/utils/formatters';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export function TrainingProgramList() {
  const { data: programs, isLoading } = useTrainingPrograms();
  const deleteProgram = useDeleteTrainingProgram();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<TrainingProgram | null>(null);

  const filteredPrograms = programs?.filter(program =>
    program.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    program.trainer?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Đang mở</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800">Đã hoàn thành</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Đã hủy</Badge>;
      default:
        return <Badge variant="outline">Không xác định</Badge>;
    }
  };

  const handleView = (program: TrainingProgram) => {
    console.log('View program:', program);
    setSelectedProgram(program);
    setShowViewDialog(true);
  };

  const handleEdit = (program: TrainingProgram) => {
    console.log('Edit program:', program);
    setSelectedProgram(program);
    setShowEditForm(true);
  };

  const handleDelete = async (program: TrainingProgram) => {
    console.log('Delete program:', program);
    try {
      await deleteProgram.mutateAsync(program.id);
    } catch (error) {
      console.error('Error deleting program:', error);
    }
  };

  const handleCloseEditForm = () => {
    setShowEditForm(false);
    setSelectedProgram(null);
  };

  const handleEditFromView = (program: TrainingProgram) => {
    setShowViewDialog(false);
    setSelectedProgram(program);
    setShowEditForm(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header với thống kê */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Chương trình đào tạo</h1>
          <p className="text-gray-600 mt-1">Quản lý các chương trình đào tạo trong công ty</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tổng chương trình</p>
                  <p className="text-2xl font-bold text-gray-900">{programs?.length || 0}</p>
                </div>
                <BookOpen className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đang mở</p>
                  <p className="text-2xl font-bold text-green-600">
                    {programs?.filter(p => p.status === 'active').length || 0}
                  </p>
                </div>
                <Users className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đã hoàn thành</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {programs?.filter(p => p.status === 'completed').length || 0}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Đã hủy</p>
                  <p className="text-2xl font-bold text-red-600">
                    {programs?.filter(p => p.status === 'cancelled').length || 0}
                  </p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Tìm kiếm chương trình đào tạo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-80 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              <Plus className="h-4 w-4 mr-2" />
              Tạo chương trình mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">Tạo chương trình đào tạo mới</DialogTitle>
            </DialogHeader>
            <TrainingProgramForm onClose={() => setShowCreateForm(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Training Programs Table */}
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="p-0">
          {filteredPrograms && filteredPrograms.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100 bg-gray-50/80">
                  <TableHead className="font-semibold text-gray-900 py-4 px-6">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Tên chương trình
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center py-4">Giảng viên</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center py-4">Thời gian</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center py-4">Trạng thái</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center py-4">Số lượng tối đa</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center py-4">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPrograms.map((program) => (
                  <TableRow key={program.id} className="border-gray-100 hover:bg-gray-50/50">
                    <TableCell className="py-4 px-6">
                      <div>
                        <h3 className="font-medium text-gray-900 cursor-pointer hover:text-blue-600" 
                            onClick={() => handleView(program)}>
                          {program.name}
                        </h3>
                        {program.description && (
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {program.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{program.trainer || 'Chưa xác định'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <div className="text-sm">
                        <div>{formatDate(program.start_date)}</div>
                        <div className="text-gray-500">đến {formatDate(program.end_date)}</div>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      {getStatusBadge(program.status)}
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span>{program.max_participants || 'Không giới hạn'}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleView(program)}
                          className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(program)}
                          className="h-8 w-8 p-0 hover:bg-orange-50 hover:text-orange-600"
                          title="Chỉnh sửa"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                              title="Xóa"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn xóa chương trình đào tạo "{program.name}"? 
                                Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(program)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-medium text-gray-900">
                    {searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có chương trình đào tạo'}
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm 
                      ? 'Thử thay đổi từ khóa tìm kiếm hoặc tạo chương trình mới' 
                      : 'Bắt đầu bằng cách tạo chương trình đào tạo đầu tiên'
                    }
                  </p>
                </div>
                {!searchTerm && (
                  <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Tạo chương trình đầu tiên
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-semibold">Tạo chương trình đào tạo mới</DialogTitle>
                      </DialogHeader>
                      <TrainingProgramForm onClose={() => setShowCreateForm(false)} />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      {filteredPrograms && filteredPrograms.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
          <div>
            Hiển thị {filteredPrograms.length} chương trình đào tạo
            {searchTerm && programs && ` (từ tổng số ${programs.length})`}
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Đang mở: {filteredPrograms.filter(p => p.status === 'active').length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Đã hoàn thành: {filteredPrograms.filter(p => p.status === 'completed').length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">Chỉnh sửa chương trình đào tạo</DialogTitle>
          </DialogHeader>
          {selectedProgram && (
            <TrainingProgramForm 
              onClose={handleCloseEditForm}
              initialData={selectedProgram}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <TrainingProgramViewDialog
        program={selectedProgram}
        open={showViewDialog}
        onOpenChange={setShowViewDialog}
        onEdit={handleEditFromView}
      />
    </div>
  );
}
