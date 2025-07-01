
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Building2, Target, TrendingUp, Users, Award, Eye } from 'lucide-react';
import { useOKRAnalytics } from '@/hooks/useOKRAnalytics';

interface DepartmentDetailDialogProps {
  departmentId: string;
  departmentName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function DepartmentDetailDialog({ 
  departmentId, 
  departmentName, 
  isOpen, 
  onClose 
}: DepartmentDetailDialogProps) {
  const { getDepartmentDetails } = useOKRAnalytics();
  const departmentData = getDepartmentDetails(departmentId);

  const getStatusBadge = (progress: number) => {
    if (progress >= 100) return <Badge variant="default" className="bg-green-100 text-green-800">Hoàn thành</Badge>;
    if (progress >= 80) return <Badge variant="default" className="bg-blue-100 text-blue-800">Vượt tiến độ</Badge>;
    if (progress >= 60) return <Badge variant="default" className="bg-green-100 text-green-800">Đúng tiến độ</Badge>;
    if (progress >= 40) return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Cần chú ý</Badge>;
    return <Badge variant="destructive" className="bg-red-100 text-red-800">Chậm tiến độ</Badge>;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-blue-600" />
            Chi tiết phòng ban: {departmentName}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[70vh]">
          <div className="space-y-6 pr-4">
            {/* Department Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Tổng OKRs</p>
                      <p className="text-2xl font-bold">{departmentData.okrs.length}</p>
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
                      <p className="text-2xl font-bold text-green-600">{departmentData.totalProgress}%</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-500" />
                  </div>
                  <Progress value={departmentData.totalProgress} className="mt-2" />
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Key Results</p>
                      <p className="text-2xl font-bold text-purple-600">{departmentData.keyResults.length}</p>
                    </div>
                    <Award className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* OKRs List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-600" />
                  OKRs của phòng ban
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {departmentData.okrs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Target className="h-12 w-12 mx-auto mb-3 opacity-50" />
                      <p>Chưa có OKR nào cho phòng ban này</p>
                    </div>
                  ) : (
                    departmentData.okrs.map((okr) => (
                      <div key={okr.id} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">{okr.title}</h4>
                            <p className="text-sm text-gray-600 mb-2">{okr.description}</p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                              <span>Chu kỳ: {okr.cycle}</span>
                              <span>KRs: {okr.key_results?.length || 0}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-xl font-bold text-blue-600 mb-1">{okr.progress}%</div>
                              {getStatusBadge(okr.progress)}
                            </div>
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Progress value={okr.progress} className="h-2" />
                          
                          {okr.key_results && okr.key_results.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-medium text-gray-700 mb-2">Key Results:</p>
                              <div className="space-y-2">
                                {okr.key_results.slice(0, 3).map((kr) => (
                                  <div key={kr.id} className="flex items-center justify-between text-sm">
                                    <span className="text-gray-600 truncate">{kr.title}</span>
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
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Key Results Summary */}
            {departmentData.keyResults.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    Tổng hợp Key Results
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    {departmentData.keyResults.slice(0, 10).map((kr) => (
                      <div key={kr.id} className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{kr.title}</p>
                          <p className="text-sm text-gray-600">
                            {kr.current_value.toLocaleString()} / {kr.target_value.toLocaleString()} {kr.unit}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <Progress value={kr.progress} className="w-20 h-2" />
                          <span className="font-semibold text-purple-600 min-w-[3rem]">{kr.progress}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-4 border-t">
          <Button onClick={onClose}>Đóng</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
