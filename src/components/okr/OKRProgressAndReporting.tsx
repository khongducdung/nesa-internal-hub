
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, BarChart3, Download, FileText } from 'lucide-react';

export function OKRProgressAndReporting() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Tiến độ & Báo cáo OKR</h2>
          <p className="text-sm text-gray-500 mt-1">
            Theo dõi tiến độ và tạo báo cáo hiệu suất OKR
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-green-600 hover:bg-green-700">
            <TrendingUp className="h-4 w-4 mr-2" />
            Cập nhật tiến độ
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Xuất báo cáo
          </Button>
        </div>
      </div>

      <Tabs defaultValue="tracking" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tracking" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Theo dõi tiến độ
          </TabsTrigger>
          <TabsTrigger value="reporting" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Báo cáo
          </TabsTrigger>
        </TabsList>

        <TabsContent value="tracking" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bảng theo dõi tiến độ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tính năng đang phát triển</h3>
                <p className="text-gray-500">
                  Chức năng theo dõi tiến độ OKR sẽ được hoàn thiện trong phiên bản tiếp theo
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reporting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Danh sách báo cáo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Tính năng đang phát triển</h3>
                <p className="text-gray-500">
                  Chức năng báo cáo OKR sẽ được hoàn thiện trong phiên bản tiếp theo
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
