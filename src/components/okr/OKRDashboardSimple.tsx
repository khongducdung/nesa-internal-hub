
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Building2, Users, User, Target, TrendingUp, Award } from 'lucide-react';
import { 
  useCompanyOKRs, 
  useDepartmentOKRs, 
  useMyOKRs, 
  useCurrentOKRCycle,
  OKRObjective 
} from '@/hooks/useOKRSimple';
import { useAuth } from '@/hooks/useAuth';
import { OKRCard } from './OKRCard';
import { CreateOKRDialog } from './CreateOKRDialog';

export function OKRDashboardSimple() {
  const { profile, isAdmin } = useAuth();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createOwnerType, setCreateOwnerType] = useState<'company' | 'department' | 'individual'>('individual');

  const { data: currentCycle } = useCurrentOKRCycle();
  const { data: companyOKRs = [], isLoading: companyLoading } = useCompanyOKRs();
  const { data: departmentOKRs = [], isLoading: departmentLoading } = useDepartmentOKRs();
  const { data: myOKRs = [], isLoading: myLoading } = useMyOKRs();

  const calculateAverageProgress = (okrs: OKRObjective[]) => {
    if (okrs.length === 0) return 0;
    return Math.round(okrs.reduce((sum, okr) => sum + okr.progress, 0) / okrs.length);
  };

  const handleCreateOKR = (ownerType: 'company' | 'department' | 'individual') => {
    setCreateOwnerType(ownerType);
    setCreateDialogOpen(true);
  };

  const isManager = profile?.employee_level === 'level_1' || profile?.employee_level === 'level_2';
  const totalOKRs = companyOKRs.length + departmentOKRs.length + myOKRs.length;
  const averageProgress = calculateAverageProgress([...companyOKRs, ...departmentOKRs, ...myOKRs]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">OKR Dashboard</h1>
          <p className="text-gray-600 mt-1">
            {currentCycle ? `Chu kỳ hiện tại: ${currentCycle.name}` : 'Chưa có chu kỳ hiện tại'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{totalOKRs}</div>
            <div className="text-sm text-gray-500">Tổng OKRs</div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4 text-purple-600" />
              OKR Công ty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{companyOKRs.length}</span>
                {isAdmin && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCreateOKR('company')}
                    className="h-8 px-2"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Progress value={calculateAverageProgress(companyOKRs)} className="h-2" />
              <p className="text-xs text-gray-500">
                Tiến độ: {calculateAverageProgress(companyOKRs)}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4 text-blue-600" />
              OKR Phòng ban
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{departmentOKRs.length}</span>
                {(isManager || isAdmin) && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCreateOKR('department')}
                    className="h-8 px-2"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Progress value={calculateAverageProgress(departmentOKRs)} className="h-2" />
              <p className="text-xs text-gray-500">
                Tiến độ: {calculateAverageProgress(departmentOKRs)}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="h-4 w-4 text-green-600" />
              OKR Cá nhân
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{myOKRs.length}</span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleCreateOKR('individual')}
                  className="h-8 px-2"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Progress value={calculateAverageProgress(myOKRs)} className="h-2" />
              <p className="text-xs text-gray-500">
                Tiến độ: {calculateAverageProgress(myOKRs)}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-orange-600" />
              Tổng quan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="text-2xl font-bold">{averageProgress}%</div>
              <Progress value={averageProgress} className="h-2" />
              <p className="text-xs text-gray-500">
                Tiến độ trung bình
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* OKR Lists */}
      <Tabs defaultValue="my-okrs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="company" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" />
            OKR Công ty
          </TabsTrigger>
          <TabsTrigger value="department" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            OKR Phòng ban
          </TabsTrigger>
          <TabsTrigger value="my-okrs" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            OKR của tôi
          </TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="mt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Building2 className="h-5 w-5 text-purple-600" />
                OKR Công ty ({companyOKRs.length})
              </h3>
              {isAdmin && (
                <Button onClick={() => handleCreateOKR('company')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo OKR Công ty
                </Button>
              )}
            </div>
            
            {companyLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Đang tải...</p>
              </div>
            ) : companyOKRs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {companyOKRs.map((okr) => (
                  <OKRCard key={okr.id} okr={okr} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có OKR công ty</h3>
                <p className="text-gray-500 mb-4">Bắt đầu bằng cách tạo OKR đầu tiên cho công ty</p>
                {isAdmin && (
                  <Button onClick={() => handleCreateOKR('company')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo OKR đầu tiên
                  </Button>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="department" className="mt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                OKR Phòng ban ({departmentOKRs.length})
              </h3>
              {(isManager || isAdmin) && (
                <Button onClick={() => handleCreateOKR('department')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo OKR Phòng ban
                </Button>
              )}
            </div>
            
            {departmentLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Đang tải...</p>
              </div>
            ) : departmentOKRs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {departmentOKRs.map((okr) => (
                  <OKRCard key={okr.id} okr={okr} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có OKR phòng ban</h3>
                <p className="text-gray-500 mb-4">Tạo OKR cho phòng ban để hỗ trợ mục tiêu công ty</p>
                {(isManager || isAdmin) && (
                  <Button onClick={() => handleCreateOKR('department')}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo OKR đầu tiên
                  </Button>
                )}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="my-okrs" className="mt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <User className="h-5 w-5 text-green-600" />
                OKR của tôi ({myOKRs.length})
              </h3>
              <Button onClick={() => handleCreateOKR('individual')}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo OKR cá nhân
              </Button>
            </div>
            
            {myLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 mt-2">Đang tải...</p>
              </div>
            ) : myOKRs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myOKRs.map((okr) => (
                  <OKRCard key={okr.id} okr={okr} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <Target className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có OKR cá nhân</h3>
                <p className="text-gray-500 mb-4">Tạo OKR cá nhân để đóng góp vào mục tiêu chung</p>
                <Button onClick={() => handleCreateOKR('individual')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo OKR đầu tiên
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <CreateOKRDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        defaultOwnerType={createOwnerType}
      />
    </div>
  );
}
