// OKR Detail View - Xem chi tiết OKR với tất cả thông tin
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { 
  Target, 
  Calendar, 
  User, 
  Users, 
  Building2, 
  TrendingUp, 
  MessageCircle, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  Edit,
  Plus,
  BarChart3,
  Activity
} from 'lucide-react';
import type { OKRObjective } from '@/types/okr';
import { KeyResultProgressDialog } from './KeyResultProgressDialog';
import { OKRCheckInDialog } from './OKRCheckInDialog';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

interface OKRDetailViewProps {
  okr: OKRObjective;
  onClose: () => void;
}

export function OKRDetailView({ okr, onClose }: OKRDetailViewProps) {
  const [showKRDialog, setShowKRDialog] = useState(false);
  const [showCheckInDialog, setShowCheckInDialog] = useState(false);
  const [selectedKR, setSelectedKR] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'on_track': return 'bg-blue-500'; 
      case 'at_risk': return 'bg-yellow-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'on_track': return <TrendingUp className="h-4 w-4" />;
      case 'at_risk': return <AlertCircle className="h-4 w-4" />;
      case 'overdue': return <Clock className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const getOwnerIcon = (ownerType: string) => {
    switch (ownerType) {
      case 'company': return <Building2 className="h-4 w-4" />;
      case 'department': return <Users className="h-4 w-4" />;
      case 'individual': return <User className="h-4 w-4" />;
      default: return <Target className="h-4 w-4" />;
    }
  };

  const handleKRUpdate = (kr: any) => {
    setSelectedKR(kr);
    setShowKRDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="flex items-center gap-1">
              {getOwnerIcon(okr.owner_type)}
              {okr.owner_type === 'company' ? 'Công ty' :
               okr.owner_type === 'department' ? 'Phòng ban' : 'Cá nhân'}
            </Badge>
            <Badge variant="outline">
              {okr.quarter} {okr.year}
            </Badge>
            <Badge className={`${getStatusColor(okr.status)} text-white`}>
              {getStatusIcon(okr.status)}
              <span className="ml-1">
                {okr.status === 'completed' ? 'Hoàn thành' :
                 okr.status === 'active' ? 'Đang thực hiện' :
                 okr.status === 'draft' ? 'Nháp' : 'Đã hủy'}
              </span>
            </Badge>
          </div>
          <h1 className="text-3xl font-bold">{okr.title}</h1>
          <p className="text-muted-foreground max-w-2xl">{okr.description}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowCheckInDialog(true)}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Check-in
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            Đóng
          </Button>
        </div>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Tổng quan tiến độ
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">{okr.progress}%</div>
              <div className="text-sm text-muted-foreground">Tiến độ tổng thể</div>
              <Progress value={okr.progress} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{okr.key_results?.length || 0}</div>
              <div className="text-sm text-muted-foreground">Key Results</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {okr.key_results?.filter(kr => kr.status === 'completed').length || 0}
              </div>
              <div className="text-sm text-muted-foreground">Hoàn thành</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {okr.time_to_deadline || 0} ngày
              </div>
              <div className="text-sm text-muted-foreground">Còn lại</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="key-results" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="key-results">Key Results</TabsTrigger>
          <TabsTrigger value="check-ins">Check-ins</TabsTrigger>
          <TabsTrigger value="comments">Bình luận</TabsTrigger>
          <TabsTrigger value="alignment">Liên kết</TabsTrigger>
          <TabsTrigger value="analytics">Phân tích</TabsTrigger>
        </TabsList>

        <TabsContent value="key-results" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Key Results ({okr.key_results?.length || 0})</h3>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Thêm KR
            </Button>
          </div>
          
          <div className="space-y-4">
            {okr.key_results?.map((kr, index) => (
              <Card key={kr.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          KR {index + 1}
                        </Badge>
                        <Badge className={`${getStatusColor(kr.status)} text-white text-xs`}>
                          {getStatusIcon(kr.status)}
                          <span className="ml-1">
                            {kr.status === 'completed' ? 'Hoàn thành' :
                             kr.status === 'on_track' ? 'Đúng tiến độ' :
                             kr.status === 'at_risk' ? 'Có rủi ro' : 'Chưa bắt đầu'}
                          </span>
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {kr.weight}%
                        </Badge>
                      </div>
                      <h4 className="font-semibold mb-2">{kr.title}</h4>
                      {kr.description && (
                        <p className="text-sm text-muted-foreground mb-2">{kr.description}</p>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleKRUpdate(kr)}
                    >
                      Cập nhật
                    </Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span>Tiến độ: {kr.progress}%</span>
                      <span>{kr.current_value} / {kr.target_value} {kr.unit}</span>
                    </div>
                    <Progress value={kr.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="check-ins" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Lịch sử Check-ins</h3>
            <Button size="sm" onClick={() => setShowCheckInDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Check-in mới
            </Button>
          </div>
          
          <Card>
            <CardContent className="p-6 text-center">
              <Activity className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Chưa có check-in nào</h4>
              <p className="text-muted-foreground mb-4">
                Tạo check-in đầu tiên để theo dõi tiến độ
              </p>
              <Button onClick={() => setShowCheckInDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo check-in
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comments" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Bình luận và thảo luận</h3>
          </div>
          
          <Card>
            <CardContent className="p-6 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h4 className="font-semibold mb-2">Chưa có bình luận nào</h4>
              <p className="text-muted-foreground">
                Bắt đầu thảo luận về OKR này
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alignment" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Liên kết mục tiêu</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {okr.parent_okr_id && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Mục tiêu cha</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Mục tiêu cấp trên mà OKR này góp phần thực hiện</p>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Mục tiêu con ({okr.child_okrs_count || 0})</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Các mục tiêu cấp dưới hỗ trợ thực hiện OKR này</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Điểm liên kết</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary mb-2">
                  {okr.alignment_score?.toFixed(1) || 0}%
                </div>
                <p className="text-sm text-muted-foreground">Mức độ liên kết với mục tiêu cấp trên</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tỷ lệ hoàn thành</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {okr.completion_rate?.toFixed(1) || 0}%
                </div>
                <p className="text-sm text-muted-foreground">Tỷ lệ hoàn thành trung bình</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Thời gian còn lại</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {okr.time_to_deadline || 0}
                </div>
                <p className="text-sm text-muted-foreground">Ngày còn lại đến deadline</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      {selectedKR && (
        <KeyResultProgressDialog
          open={showKRDialog}
          onOpenChange={setShowKRDialog}
          keyResult={selectedKR}
        />
      )}
      
      <OKRCheckInDialog
        open={showCheckInDialog}
        onOpenChange={setShowCheckInDialog}
        okr={okr}
      />
    </div>
  );
}