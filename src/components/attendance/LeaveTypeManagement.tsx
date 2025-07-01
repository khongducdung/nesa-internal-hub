
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, Clock } from 'lucide-react';

export function LeaveTypeManagement() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold">Quản lý loại nghỉ phép</h2>
          <p className="text-gray-600">Thiết lập các loại nghỉ phép và quy định</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo loại nghỉ mới
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Nghỉ phép năm</h3>
            <p className="text-gray-600 text-sm mb-4">Nghỉ phép có lương theo quy định</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Có lương:</span>
                <span className="text-green-600 font-medium">Có</span>
              </div>
              <div className="flex justify-between">
                <span>Tối đa/năm:</span>
                <span className="font-medium">12 ngày</span>
              </div>
              <div className="flex justify-between">
                <span>Cần phê duyệt:</span>
                <span className="text-yellow-600 font-medium">Có</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Nghỉ ốm</h3>
            <p className="text-gray-600 text-sm mb-4">Nghỉ ốm có lương</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Có lương:</span>
                <span className="text-green-600 font-medium">Có</span>
              </div>
              <div className="flex justify-between">
                <span>Tối đa/năm:</span>
                <span className="font-medium">30 ngày</span>
              </div>
              <div className="flex justify-between">
                <span>Cần phê duyệt:</span>
                <span className="text-yellow-600 font-medium">Có</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-red-600" />
              </div>
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            </div>
            <h3 className="font-semibold text-lg mb-2">Nghỉ không lương</h3>
            <p className="text-gray-600 text-sm mb-4">Nghỉ không được trả lương</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Có lương:</span>
                <span className="text-red-600 font-medium">Không</span>
              </div>
              <div className="flex justify-between">
                <span>Tối đa/năm:</span>
                <span className="font-medium">Không giới hạn</span>
              </div>
              <div className="flex justify-between">
                <span>Cần phê duyệt:</span>
                <span className="text-yellow-600 font-medium">Có</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
