import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Building2, Users, Target, Search, Filter } from 'lucide-react';
import { useKPIFrameworks } from '@/hooks/useKPI';
import { useDepartments } from '@/hooks/useDepartments';
import { FRAMEWORK_TYPES } from '@/types/kpi';
import { KPIFrameworkFormDialog } from './KPIFrameworkFormDialog';

const TARGET_LEVELS = [
  { value: 'strategic', label: 'Chiến lược' },
  { value: 'operational', label: 'Vận hành' },
  { value: 'tactical', label: 'Chiến thuật' },
];

export function KPIFrameworkManagement() {
  const { data: frameworks = [] } = useKPIFrameworks();
  const { data: departments = [] } = useDepartments();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFrameworkType, setSelectedFrameworkType] = useState('');
  const [selectedTargetLevel, setSelectedTargetLevel] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  // Filter frameworks based on search and filters
  const filteredFrameworks = useMemo(() => {
    return frameworks.filter((framework) => {
      const matchesSearch = framework.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           framework.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFrameworkType = !selectedFrameworkType || 
                                  selectedFrameworkType === 'all' || 
                                  framework.framework_type === selectedFrameworkType;
      
      const matchesTargetLevel = !selectedTargetLevel || 
                                selectedTargetLevel === 'all-levels' || 
                                framework.target_level === selectedTargetLevel;
      
      const matchesDepartment = !selectedDepartment || 
                               selectedDepartment === 'all-departments' ||
                               (selectedDepartment === 'no-department' && !framework.department_id) ||
                               framework.department_id === selectedDepartment;

      return matchesSearch && matchesFrameworkType && matchesTargetLevel && matchesDepartment;
    });
  }, [frameworks, searchTerm, selectedFrameworkType, selectedTargetLevel, selectedDepartment]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Quản lý khung KPI</h2>
          <p className="text-muted-foreground">Thiết lập khung KPI theo cấp độ tổ chức</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Tạo khung KPI
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Bộ lọc và tìm kiếm
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm khung KPI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Framework Type Filter */}
            <Select value={selectedFrameworkType} onValueChange={setSelectedFrameworkType}>
              <SelectTrigger>
                <SelectValue placeholder="Loại khung" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại</SelectItem>
                {FRAMEWORK_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Target Level Filter */}
            <Select value={selectedTargetLevel} onValueChange={setSelectedTargetLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Cấp độ mục tiêu" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-levels">Tất cả cấp độ</SelectItem>
                {TARGET_LEVELS.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Department Filter */}
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Phòng ban" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-departments">Tất cả phòng ban</SelectItem>
                <SelectItem value="no-department">Không thuộc phòng ban</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept.id} value={dept.id}>
                    {dept.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Clear Filters */}
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedFrameworkType('');
                setSelectedTargetLevel('');
                setSelectedDepartment('');
              }}
              className="w-full"
            >
              Xóa bộ lọc
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Hiển thị {filteredFrameworks.length} trong số {frameworks.length} khung KPI
        </p>
      </div>

      <div className="grid gap-4">
        {filteredFrameworks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Không tìm thấy khung KPI</h3>
              <p className="text-muted-foreground text-center mb-4">
                {frameworks.length === 0 
                  ? 'Chưa có khung KPI nào. Hãy tạo khung KPI đầu tiên của bạn.'
                  : 'Thử điều chỉnh bộ lọc để tìm thấy khung KPI phù hợp.'
                }
              </p>
              {frameworks.length === 0 && (
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo khung KPI đầu tiên
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          filteredFrameworks.map((framework) => (
            <Card key={framework.id} className="hover-lift">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="h-5 w-5" />
                      {framework.name}
                    </CardTitle>
                    <CardDescription>{framework.description}</CardDescription>
                  </div>
                  <Badge>
                    {FRAMEWORK_TYPES.find(t => t.value === framework.framework_type)?.label}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Cấp độ mục tiêu</p>
                    <p className="font-medium">
                      {TARGET_LEVELS.find(level => level.value === framework.target_level)?.label || framework.target_level}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phòng ban</p>
                    <p className="font-medium">
                      {framework.departments?.name || 'Tất cả phòng ban'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Trạng thái</p>
                    <Badge variant={framework.is_active ? 'default' : 'secondary'}>
                      {framework.is_active ? 'Hoạt động' : 'Tạm ngưng'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <KPIFrameworkFormDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
      />
    </div>
  );
}