
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrainingProgramList } from './TrainingProgramList';
import { TrainingManagement } from './TrainingManagement';
import { Badge } from '@/components/ui/badge';
import { useEmployeeTrainingAssignments } from '@/hooks/useTrainingRequirements';

export function TrainingList() {
  const { data: assignments } = useEmployeeTrainingAssignments();
  const pendingAssignments = assignments?.filter(a => a.status === 'pending').length || 0;

  return (
    <Tabs defaultValue="programs" className="w-full">
      <div className="border-b border-gray-200">
        <TabsList className="bg-transparent h-auto p-0 space-x-0">
          <TabsTrigger 
            value="programs" 
            className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent px-6 py-3 font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Chương trình đào tạo
          </TabsTrigger>
          <TabsTrigger 
            value="requirements" 
            className="data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-blue-500 data-[state=active]:text-blue-600 rounded-none border-b-2 border-transparent px-6 py-3 font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            Yêu cầu đào tạo
            {pendingAssignments > 0 && (
              <Badge variant="secondary" className="ml-2 bg-orange-100 text-orange-700 border-orange-200">
                {pendingAssignments}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>
      </div>
      
      <TabsContent value="programs" className="mt-6 space-y-1">
        <TrainingProgramList />
      </TabsContent>
      
      <TabsContent value="requirements" className="mt-6 space-y-0">
        <TrainingManagement />
      </TabsContent>
    </Tabs>
  );
}
