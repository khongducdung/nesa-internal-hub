
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/hooks/useAuth';
import { useEmployees } from '@/hooks/useEmployees';
import { useEmployeeTrainingAssignments, useUpdateTrainingAssignmentProgress } from '@/hooks/useTrainingRequirements';
import { BookOpen, Clock, ExternalLink, PlayCircle, CheckCircle } from 'lucide-react';

export function EmployeeTrainingDashboard() {
  const { user } = useAuth();
  const { data: employees } = useEmployees();
  const currentEmployee = employees?.find(emp => emp.auth_user_id === user?.id);
  const { data: assignments } = useEmployeeTrainingAssignments(currentEmployee?.id);
  const updateProgress = useUpdateTrainingAssignmentProgress();

  const handleStartTraining = async (assignmentId: string) => {
    await updateProgress.mutateAsync({
      id: assignmentId,
      status: 'in_progress',
      started_at: new Date().toISOString(),
    });
  };

  const handleCompleteTraining = async (assignmentId: string) => {
    await updateProgress.mutateAsync({
      id: assignmentId,
      status: 'completed',
      progress_percentage: 100,
      completed_at: new Date().toISOString(),
    });
  };

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

  if (!currentEmployee) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Đào tạo của tôi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Không tìm thấy thông tin nhân viên</p>
        </CardContent>
      </Card>
    );
  }

  const pendingAssignments = assignments?.filter(a => a.status === 'pending') || [];
  const inProgressAssignments = assignments?.filter(a => a.status === 'in_progress') || [];
  const completedAssignments = assignments?.filter(a => a.status === 'completed') || [];

  return (
    <div className="space-y-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Chưa bắt đầu</p>
                <p className="text-2xl font-bold text-orange-600">{pendingAssignments.length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đang học</p>
                <p className="text-2xl font-bold text-blue-600">{inProgressAssignments.length}</p>
              </div>
              <PlayCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hoàn thành</p>
                <p className="text-2xl font-bold text-green-600">{completedAssignments.length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Training Assignments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Các khóa học được giao
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {assignments && assignments.length > 0 ? (
            assignments.map((assignment) => (
              <div key={assignment.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {assignment.training_requirements?.name}
                    </h3>
                    {assignment.training_requirements?.description && (
                      <p className="text-gray-600 text-sm mt-1">
                        {assignment.training_requirements.description}
                      </p>
                    )}
                  </div>
                  {getStatusBadge(assignment.status, assignment.due_date)}
                </div>

                {assignment.training_requirements?.reason && (
                  <div>
                    <p className="text-sm font-medium text-gray-700">Lý do đào tạo:</p>
                    <p className="text-sm text-gray-600">{assignment.training_requirements.reason}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Hạn hoàn thành: </span>
                    <span className="text-gray-600">
                      {new Date(assignment.due_date).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Thời gian: </span>
                    <span className="text-gray-600">
                      {assignment.training_requirements?.duration_days} ngày
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Còn lại: </span>
                    <span className={`${getDaysRemaining(assignment.due_date) < 0 ? 'text-red-600' : 'text-gray-600'}`}>
                      {getDaysRemaining(assignment.due_date) < 0 
                        ? `Quá hạn ${Math.abs(getDaysRemaining(assignment.due_date))} ngày`
                        : `${getDaysRemaining(assignment.due_date)} ngày`
                      }
                    </span>
                  </div>
                </div>

                {assignment.status === 'in_progress' && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Tiến độ</span>
                      <span>{assignment.progress_percentage}%</span>
                    </div>
                    <Progress value={assignment.progress_percentage} className="h-2" />
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  {assignment.training_requirements?.course_url && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(assignment.training_requirements?.course_url, '_blank')}
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Vào khóa học
                    </Button>
                  )}

                  {assignment.status === 'pending' && (
                    <Button
                      size="sm"
                      onClick={() => handleStartTraining(assignment.id)}
                      disabled={updateProgress.isPending}
                    >
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Bắt đầu học
                    </Button>
                  )}

                  {assignment.status === 'in_progress' && (
                    <Button
                      size="sm"
                      onClick={() => handleCompleteTraining(assignment.id)}
                      disabled={updateProgress.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Hoàn thành
                    </Button>
                  )}
                </div>

                {assignment.notes && (
                  <div className="text-sm">
                    <span className="font-medium text-gray-700">Ghi chú: </span>
                    <span className="text-gray-600">{assignment.notes}</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Chưa có khóa học nào được giao</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
