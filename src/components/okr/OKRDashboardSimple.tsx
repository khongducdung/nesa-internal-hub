import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Building2, Users, User, Target } from 'lucide-react';
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">OKR Dashboard</h1>
          <p className="text-gray-600">
            {currentCycle ? `Chu kỳ hiện tại: ${currentCycle.name}` : 'Chưa có chu kỳ hiện tại'}
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              OKR Công ty
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{companyOKRs.length}</span>
                {isAdmin && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCreateOKR('company')}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Progress value={calculateAverageProgress(companyOKRs)} className="h-2" />
              <p className="text-xs text-gray-500">
                Tiến độ trung bình: {calculateAverageProgress(companyOKRs)}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="h-4 w-4" />
              OKR Phòng ban
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{departmentOKRs.length}</span>
                {(isManager || isAdmin) && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCreateOKR('department')}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Progress value={calculateAverageProgress(departmentOKRs)} className="h-2" />
              <p className="text-xs text-gray-500">
                Tiến độ trung bình: {calculateAverageProgress(departmentOKRs)}%
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <User className="h-4 w-4" />
              OKR Cá nhân
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">{myOKRs.length}</span>
                <Button 
                  size="sm" 
                  variant="outline"
                  onClick={() => handleCreateOKR('individual')}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Progress value={calculateAverageProgress(myOKRs)} className="h-2" />
              <p className="text-xs text-gray-500">
                Tiến độ trung bình: {calculateAverageProgress(myOKRs)}%
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* OKR Lists */}
      <Tabs defaultValue="my-okrs" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="company">OKR Công ty</TabsTrigger>
          <TabsTrigger value="department">OKR Phòng ban</TabsTrigger>
          <TabsTrigger value="my-okrs">OKR của tôi</TabsTrigger>
        </TabsList>

        <TabsContent value="company" className="mt-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">OKR Công ty</h3>
              {isAdmin && (
                <Button onClick={() => handleCreateOKR('company')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo OKR Công ty
                </Button>
              )}
            </div>
            
            {companyLoading ? (
              <div className="text-center py-8">Đang tải...</div>
            ) : companyOKRs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {companyOKRs.map((okr) => (
                  <OKRCard key={okr.id} okr={okr} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Chưa có OKR công ty nào</p>
                {isAdmin && (
                  <Button className="mt-4" onClick={() => handleCreateOKR('company')}>
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
              <h3 className="text-lg font-semibold">OKR Phòng ban</h3>
              {(isManager || isAdmin) && (
                <Button onClick={() => handleCreateOKR('department')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo OKR Phòng ban
                </Button>
              )}
            </div>
            
            {departmentLoading ? (
              <div className="text-center py-8">Đang tải...</div>
            ) : departmentOKRs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {departmentOKRs.map((okr) => (
                  <OKRCard key={okr.id} okr={okr} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Chưa có OKR phòng ban nào</p>
                {(isManager || isAdmin) && (
                  <Button className="mt-4" onClick={() => handleCreateOKR('department')}>
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
              <h3 className="text-lg font-semibold">OKR của tôi</h3>
              <Button onClick={() => handleCreateOKR('individual')}>
                <Plus className="h-4 w-4 mr-2" />
                Tạo OKR cá nhân
              </Button>
            </div>
            
            {myLoading ? (
              <div className="text-center py-8">Đang tải...</div>
            ) : myOKRs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myOKRs.map((okr) => (
                  <OKRCard key={okr.id} okr={okr} />
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Chưa có OKR cá nhân nào</p>
                <Button className="mt-4" onClick={() => handleCreateOKR('individual')}>
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