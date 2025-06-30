
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrainingRequirementList } from './TrainingRequirementList';
import { TrainingAssignmentList } from './TrainingAssignmentList';
import { useTrainingRequirements, useEmployeeTrainingAssignments } from '@/hooks/useTrainingRequirements';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { TrainingRequirementForm } from './TrainingRequirementForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BookOpen, Users, Clock, CheckCircle, Plus, Search } from 'lucide-react';

export function TrainingManagement() {
  const { data: requirements } = useTrainingRequirements();
  const { data: assignments } = useEmployeeTrainingAssignments();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Tính toán thống kê
  const totalRequirements = requirements?.length || 0;
  const activeRequirements = requirements?.filter(r => r.is_active).length || 0;
  const totalAssignments = assignments?.length || 0;
  const completedAssignments = assignments?.filter(a => a.status === 'completed').length || 0;
  const pendingAssignments = assignments?.filter(a => a.status === 'pending').length || 0;
  const overdueAssignments = assignments?.filter(a => a.status === 'overdue').length || 0;

  const stats = [
    {
      title: 'Yêu cầu đào tạo',
      value: activeRequirements,
      total: totalRequirements,
      icon: BookOpen,
      color: 'bg-blue-500'
    },
    {
      title: 'Đang chờ thực hiện',
      value: pendingAssignments,
      icon: Clock,
      color: 'bg-orange-500'
    },
    {
      title: 'Đã hoàn thành',
      value: completedAssignments,
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Quá hạn',
      value: overdueAssignments,
      icon: Users,
      color: 'bg-red-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header với thống kê tổng quan */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Quản lý đào tạo</h1>
          <p className="text-gray-600 mt-1">Quản lý yêu cầu đào tạo và tiến độ học tập của nhân viên</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="border-0 shadow-sm bg-white hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        {stat.title}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-gray-900">
                          {stat.value}
                        </span>
                        {stat.total && (
                          <span className="text-sm text-gray-500">
                            / {stat.total}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className={`${stat.color} p-2 rounded-lg`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Tabs Navigation with Search and Create Button */}
      <Tabs defaultValue="requirements" className="w-full">
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <TabsList className="bg-transparent h-auto p-0 space-x-0">
              <TabsTrigger 
                value="requirements" 
                className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent px-6 py-3 font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                Yêu cầu đào tạo
              </TabsTrigger>
              <TabsTrigger 
                value="assignments" 
                className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent px-6 py-3 font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                Phân công đào tạo
                {pendingAssignments > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700 border-orange-200">
                    {pendingAssignments}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>
            
            {/* Search and Create Controls */}
            <div className="flex items-center gap-3 pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo yêu cầu mới
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Tạo yêu cầu đào tạo mới</DialogTitle>
                  </DialogHeader>
                  <TrainingRequirementForm onSuccess={() => setShowCreateForm(false)} />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        
        <TabsContent value="requirements" className="mt-6 space-y-0">
          <TrainingRequirementList searchTerm={searchTerm} />
        </TabsContent>
        
        <TabsContent value="assignments" className="mt-6 space-y-0">
          <TrainingAssignmentList />
        </TabsContent>
      </Tabs>
    </div>
  );
}
