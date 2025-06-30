
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTrainingRequirements } from '@/hooks/useTrainingRequirements';
import { ExternalLink, BookOpen } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TrainingRequirementListProps {
  searchTerm: string;
}

export function TrainingRequirementList({ searchTerm }: TrainingRequirementListProps) {
  const { data: requirements, isLoading } = useTrainingRequirements();

  const filteredRequirements = requirements?.filter(req =>
    req.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    req.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTargetTypeLabel = (targetType: string) => {
    switch (targetType) {
      case 'general': return 'Tất cả';
      case 'department': return 'Phòng ban';
      case 'position': return 'Chức vụ';
      case 'employee': return 'Cá nhân';
      default: return targetType;
    }
  };

  const getTargetTypeColor = (targetType: string) => {
    switch (targetType) {
      case 'general': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'department': return 'bg-green-50 text-green-700 border-green-200';
      case 'position': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'employee': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Training Requirements Table */}
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="p-0">
          {filteredRequirements && filteredRequirements.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow className="border-gray-100 bg-gray-50/80">
                  <TableHead className="font-semibold text-gray-900 py-4 px-6">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Chương trình đào tạo
                    </div>
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center py-4">Đối tượng</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center py-4">Trạng thái</TableHead>
                  <TableHead className="font-semibold text-gray-900 text-center py-4">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequirements.map((requirement) => (
                  <TableRow key={requirement.id} className="border-gray-100 hover:bg-gray-50/50">
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <h3 className="font-medium text-gray-900">
                          {requirement.name}
                        </h3>
                        {requirement.auto_assign_after_days > 0 && (
                          <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200">
                            Tự động giao sau {requirement.auto_assign_after_days} ngày
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      <Badge className={`${getTargetTypeColor(requirement.target_type)} font-medium text-xs`}>
                        {getTargetTypeLabel(requirement.target_type)}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      {requirement.is_active ? (
                        <Badge className="bg-green-50 text-green-700 border-green-200 font-medium text-xs">
                          Hoạt động
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200 font-medium text-xs">
                          Tạm dừng
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="py-4 text-center">
                      {requirement.course_url ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(requirement.course_url, '_blank')}
                          className="border-gray-200 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors text-xs"
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Xem khóa học
                        </Button>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Chưa có liên kết</span>
                      )}
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
                    {searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có yêu cầu đào tạo'}
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm 
                      ? 'Thử thay đổi từ khóa tìm kiếm hoặc tạo yêu cầu mới' 
                      : 'Bắt đầu bằng cách tạo yêu cầu đào tạo đầu tiên cho nhân viên'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      {filteredRequirements && filteredRequirements.length > 0 && (
        <div className="flex items-center justify-between text-sm text-gray-500 pt-2 border-t border-gray-100">
          <div>
            Hiển thị {filteredRequirements.length} yêu cầu đào tạo
            {searchTerm && requirements && ` (từ tổng số ${requirements.length})`}
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Đang hoạt động: {filteredRequirements.filter(r => r.is_active).length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
              <span>Tạm dừng: {filteredRequirements.filter(r => !r.is_active).length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
