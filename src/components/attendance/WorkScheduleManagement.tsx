
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Clock, Users, Settings } from 'lucide-react';
import { WorkShiftsList } from './WorkShiftsList';
import { WorkShiftDialog } from './WorkShiftDialog';
import { ShiftAssignmentDialog } from './ShiftAssignmentDialog';

export function WorkScheduleManagement() {
  const [showShiftDialog, setShowShiftDialog] = useState(false);
  const [showAssignmentDialog, setShowAssignmentDialog] = useState(false);
  const [editingShift, setEditingShift] = useState<string | undefined>();

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Thiết kế lịch làm việc</h2>
          <p className="text-gray-600">Quản lý các ca làm việc và phân công nhân viên</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAssignmentDialog(true)} variant="outline">
            <Users className="h-4 w-4 mr-2" />
            Phân công ca
          </Button>
          <Button onClick={() => setShowShiftDialog(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tạo ca làm việc
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Full-time</p>
                <p className="text-2xl font-bold text-blue-600">-</p>
                <p className="text-sm text-gray-500">8 giờ/ngày</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Part-time</p>
                <p className="text-2xl font-bold text-green-600">-</p>
                <p className="text-sm text-gray-500">4 giờ/ngày</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Linh hoạt</p>
                <p className="text-2xl font-bold text-yellow-600">-</p>
                <p className="text-sm text-gray-500">6-10 giờ/ngày</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Settings className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Work Shifts List */}
      <WorkShiftsList 
        onEditShift={(id) => {
          setEditingShift(id);
          setShowShiftDialog(true);
        }}
      />

      {/* Dialogs */}
      <WorkShiftDialog
        open={showShiftDialog}
        onClose={() => {
          setShowShiftDialog(false);
          setEditingShift(undefined);
        }}
        shiftId={editingShift}
      />

      <ShiftAssignmentDialog
        open={showAssignmentDialog}
        onClose={() => setShowAssignmentDialog(false)}
      />
    </div>
  );
}
