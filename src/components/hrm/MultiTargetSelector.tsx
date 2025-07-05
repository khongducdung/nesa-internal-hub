
import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Users, Building, User, X } from 'lucide-react';
import { useDepartments } from '@/hooks/useDepartments';
import { usePositions } from '@/hooks/usePositions';
import { useEmployees } from '@/hooks/useEmployees';

interface TargetSelection {
  type: 'department' | 'position' | 'employee';
  id: string;
  name: string;
}

interface MultiTargetSelectorProps {
  selectedTargets: TargetSelection[];
  onSelectionChange: (targets: TargetSelection[]) => void;
}

export function MultiTargetSelector({ selectedTargets, onSelectionChange }: MultiTargetSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('departments');
  
  const { data: departments = [] } = useDepartments();
  const { data: positions = [] } = usePositions();
  const { data: employees = [] } = useEmployees();

  const filteredDepartments = useMemo(() => {
    if (!searchTerm.trim()) return departments.filter(dept => dept.status === 'active');
    return departments.filter(dept => 
      dept.status === 'active' && 
      dept.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [departments, searchTerm]);

  const filteredPositions = useMemo(() => {
    if (!searchTerm.trim()) return positions.filter(pos => pos.status === 'active');
    return positions.filter(pos => 
      pos.status === 'active' && 
      pos.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [positions, searchTerm]);

  const filteredEmployees = useMemo(() => {
    if (!searchTerm.trim()) return employees.filter(emp => emp.work_status === 'active');
    return employees.filter(emp => 
      emp.work_status === 'active' && 
      emp.full_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [employees, searchTerm]);

  const handleAddTarget = (target: TargetSelection) => {
    const isAlreadySelected = selectedTargets.some(
      t => t.type === target.type && t.id === target.id
    );
    
    if (!isAlreadySelected) {
      onSelectionChange([...selectedTargets, target]);
    }
  };

  const handleRemoveTarget = (targetToRemove: TargetSelection) => {
    onSelectionChange(
      selectedTargets.filter(
        t => !(t.type === targetToRemove.type && t.id === targetToRemove.id)
      )
    );
  };

  const getTargetIcon = (type: string) => {
    switch (type) {
      case 'department': return <Building className="h-3 w-3" />;
      case 'position': return <Users className="h-3 w-3" />;
      case 'employee': return <User className="h-3 w-3" />;
      default: return null;
    }
  };

  const getTargetTypeLabel = (type: string) => {
    switch (type) {
      case 'department': return 'Phòng ban';
      case 'position': return 'Vị trí';
      case 'employee': return 'Nhân viên';
      default: return '';
    }
  };

  const renderTargetList = (targets: any[], type: 'department' | 'position' | 'employee') => (
    <div className="space-y-2 max-h-60 overflow-y-auto">
      {targets.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">
          {searchTerm ? 'Không tìm thấy kết quả phù hợp' : 'Không có dữ liệu'}
        </p>
      ) : (
        targets.map((target) => {
          const targetSelection: TargetSelection = {
            type,
            id: target.id,
            name: type === 'employee' ? target.full_name : target.name
          };
          
          const isSelected = selectedTargets.some(
            t => t.type === type && t.id === target.id
          );
          
          return (
            <button
              key={target.id}
              className={`w-full text-left p-3 rounded-lg border flex items-center gap-3 hover:bg-gray-50 transition-colors ${
                isSelected ? 'bg-primary/10 border-primary text-primary' : 'border-gray-200'
              }`}
              onClick={() => handleAddTarget(targetSelection)}
              disabled={isSelected}
            >
              {getTargetIcon(type)}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">
                  {type === 'employee' ? target.full_name : target.name}
                </div>
                {type === 'employee' && target.employee_code && (
                  <div className="text-sm text-gray-500">{target.employee_code}</div>
                )}
              </div>
              {isSelected && (
                <div className="text-xs text-primary font-medium">✓ Đã chọn</div>
              )}
            </button>
          );
        })
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
        <Input
          placeholder="Tìm kiếm phòng ban, vị trí hoặc nhân viên..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="departments" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            Phòng ban
          </TabsTrigger>
          <TabsTrigger value="positions" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Vị trí
          </TabsTrigger>
          <TabsTrigger value="employees" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            Nhân viên
          </TabsTrigger>
        </TabsList>

        <TabsContent value="departments" className="mt-4">
          {renderTargetList(filteredDepartments, 'department')}
        </TabsContent>

        <TabsContent value="positions" className="mt-4">
          {renderTargetList(filteredPositions, 'position')}
        </TabsContent>

        <TabsContent value="employees" className="mt-4">
          {renderTargetList(filteredEmployees, 'employee')}
        </TabsContent>
      </Tabs>

      {selectedTargets.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-medium text-gray-700">
            Đã chọn ({selectedTargets.length}):
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedTargets.map((target, index) => (
              <Badge
                key={`${target.type}-${target.id}-${index}`}
                variant="secondary"
                className="flex items-center gap-2 px-3 py-1"
              >
                {getTargetIcon(target.type)}
                <span className="text-sm">
                  {target.name}
                  <span className="text-xs text-gray-500 ml-1">
                    ({getTargetTypeLabel(target.type)})
                  </span>
                </span>
                <button
                  onClick={() => handleRemoveTarget(target)}
                  className="ml-1 hover:text-red-600 transition-colors"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {selectedTargets.length === 0 && (
        <div className="text-sm text-gray-500 text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
          Chọn phòng ban, vị trí hoặc nhân viên để áp dụng yêu cầu đào tạo
        </div>
      )}
    </div>
  );
}
