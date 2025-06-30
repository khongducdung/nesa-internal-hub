
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEmployeeTrainingAssignments } from '@/hooks/useTrainingRequirements';
import { Calendar, User, BookOpen } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface TrainingAssignmentListProps {
  searchTerm: string;
}

export function TrainingAssignmentList({ searchTerm }: TrainingAssignmentListProps) {
  const { data: assignments, isLoading } = useEmployeeTrainingAssignments();

  const filteredAssignments = assignments?.filter(assignment => {
    const matchesSearch = 
      assignment.training_requirements?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.employees?.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      assignment.employees?.employee_code.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const getStatusBadge = (status: string, dueDate: string) => {
    const isOverdue = new Date(dueDate) < new Date() && status !== 'completed';
    
    if (isOverdue && status !== 'completed') {
      return <Badge variant="destructive">Quá hạn</Badge>;
    }
    
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Chưa bắt đầu</Badge>;
      case 'in_progress':
        return <Badge variant="default">Đang học</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Hoàn thành</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDaysRemaining = (dueDate: string) => {
    const days = Math.ceil((new Date(dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Assignments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredAssignments?.map((assignment) => (
          <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">
                    {assignment.training_requirements?.name}
                  </CardTitle>
                  {getStatusBadge(assignment.status, assignment.due_date)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-gray-400" />
                <span className="font-medium">{assignment.employees?.full_name}</span>
                <span className="text-gray-500">({assignment.employees?.employee_code})</span>
              </div>

              {assignment.training_requirements?.description && (
                <p className="text-gray-600 text-sm line-clamp-2">
                  {assignment.training_requirements.description}
                </p>
              )}

              <div className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Hạn hoàn thành:
                  </span>
                  <span className="font-medium">
                    {new Date(assignment.due_date).toLocaleDateString('vi-VN')}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Thời gian còn lại:</span>
                  <span className={`font-medium ${getDaysRemaining(assignment.due_date) < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                    {getDaysRemaining(assignment.due_date) < 0 
                      ? `Quá hạn ${Math.abs(getDaysRemaining(assignment.due_date))} ngày`
                      : `${getDaysRemaining(assignment.due_date)} ngày`
                    }
                  </span>
                </div>

                {assignment.started_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Bắt đầu:</span>
                    <span>{new Date(assignment.started_at).toLocaleDateString('vi-VN')}</span>
                  </div>
                )}

                {assignment.completed_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700">Hoàn thành:</span>
                    <span className="text-green-600 font-medium">
                      {new Date(assignment.completed_at).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                )}
              </div>

              {assignment.status === 'in_progress' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Tiến độ</span>
                    <span className="font-medium">{assignment.progress_percentage}%</span>
                  </div>
                  <Progress value={assignment.progress_percentage} className="h-2" />
                </div>
              )}

              {assignment.notes && (
                <div className="text-sm">
                  <span className="font-medium text-gray-700">Ghi chú: </span>
                  <span className="text-gray-600">{assignment.notes}</span>
                </div>
              )}

              <div className="text-xs text-gray-500 pt-2 border-t">
                Phân công: {new Date(assignment.assigned_date).toLocaleDateString('vi-VN')}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAssignments?.length === 0 && (
        <div className="text-center py-8">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchTerm ? 'Không tìm thấy phân công đào tạo nào' : 'Chưa có phân công đào tạo nào'}
          </p>
        </div>
      )}
    </div>
  );
}
