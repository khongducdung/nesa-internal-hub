// Individual OKR View - Display and manage individual OKRs
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Plus, Target } from 'lucide-react';

import { useMyOKRs } from '@/hooks/useOKRSystem';

export function IndividualOKRView() {
  const { data: myOKRs = [], isLoading } = useMyOKRs();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <User className="h-6 w-6" />
            OKRs của tôi
          </h2>
          <p className="text-gray-600 mt-1">
            Quản lý các mục tiêu cá nhân của bạn
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Tạo OKR cá nhân
        </Button>
      </div>

      {/* Content */}
      {myOKRs.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Chưa có OKR cá nhân nào
            </h3>
            <p className="text-gray-600 mb-4">
              Tạo OKR đầu tiên để thiết lập mục tiêu cá nhân
            </p>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Tạo OKR đầu tiên
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {myOKRs.map((okr) => (
            <Card key={okr.id} className="border-l-4 border-l-purple-600">
              <CardHeader>
                <CardTitle>{okr.title}</CardTitle>
                <CardDescription>{okr.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Tiến độ: {okr.progress}%</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}