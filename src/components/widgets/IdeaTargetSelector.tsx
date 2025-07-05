
import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Building, User, X } from 'lucide-react';
import { useDepartments } from '@/hooks/useDepartments';
import { usePositions } from '@/hooks/usePositions';
import { useEmployees } from '@/hooks/useEmployees';

interface TargetSelection {
  type: 'department' | 'position' | 'employee';
  id: string;
  name: string;
}

interface IdeaTargetSelectorProps {
  selectedTargets: TargetSelection[];
  onSelectionChange: (targets: TargetSelection[]) => void;
}

export function IdeaTargetSelector({ selectedTargets, onSelectionChange }: IdeaTargetSelectorProps) {
  const [targetType, setTargetType] = useState<'department' | 'position' | 'employee'>('department');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: departments = [] } = useDepartments();
  const { data: positions = [] } = usePositions();
  const { data: employees = [] } = useEmployees();

  const getTargetOptions = () => {
    switch (targetType) {
      case 'department':
        return departments
          .filter(dept => dept.status === 'active')
          .map(dept => ({ 
            type: 'department' as const, 
            id: dept.id, 
            name: dept.name 
          }));
      case 'position':
        return positions
          .filter(pos => pos.status === 'active')
          .map(pos => ({ 
            type: 'position' as const, 
            id: pos.id, 
            name: pos.name 
          }));
      case 'employee':
        return employees
          .filter(emp => emp.work_status === 'active')
          .map(emp => ({ 
            type: 'employee' as const, 
            id: emp.id, 
            name: emp.full_name 
          }));
      default:
        return [];
    }
  };

  const filteredOptions = useMemo(() => {
    const options = getTargetOptions();
    if (!searchTerm.trim()) return options;
    
    return options.filter(option =>
      option.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [targetType, searchTerm, departments, positions, employees]);

  const handleAddTarget = (option: { type: 'department' | 'position' | 'employee'; id: string; name: string }) => {
    const isAlreadySelected = selectedTargets.some(
      target => target.type === option.type && target.id === option.id
    );
    
    if (!isAlreadySelected) {
      onSelectionChange([...selectedTargets, option]);
    }
  };

  const handleRemoveTarget = (targetToRemove: TargetSelection) => {
    onSelectionChange(
      selectedTargets.filter(
        target => !(target.type === targetToRemove.type && target.id === targetToRemove.id)
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

  return (
    <div className="space-y-4">
      <div>
        <Label>Chia sẻ với</Label>
        <Select value={targetType} onValueChange={(value: 'department' | 'position' | 'employee') => setTargetType(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent style={{ zIndex: 9999 }}>
            <SelectItem value="department">
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4" />
                Phòng ban
              </div>
            </SelectItem>
            <SelectItem value="position">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Vị trí chức vụ
              </div>
            </SelectItem>
            <SelectItem value="employee">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nhân viên cụ thể
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="relative">
        <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
        <Input
          placeholder={`Tìm kiếm ${getTargetTypeLabel(targetType).toLowerCase()}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3">
        {filteredOptions.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">
            {searchTerm ? 'Không tìm thấy kết quả phù hợp' : 'Không có dữ liệu'}
          </p>
        ) : (
          filteredOptions.map((option) => {
            const isSelected = selectedTargets.some(
              target => target.type === option.type && target.id === option.id
            );
            
            return (
              <button
                key={`${option.type}-${option.id}`}
                className={`w-full text-left p-2 rounded flex items-center gap-2 hover:bg-gray-50 transition-colors ${
                  isSelected ? 'bg-primary/10 text-primary' : ''
                }`}
                onClick={() => handleAddTarget(option)}
                disabled={isSelected}
              >
                {getTargetIcon(option.type)}
                <span className="text-sm">{option.name}</span>
                {isSelected && <span className="text-xs ml-auto">(Đã chọn)</span>}
              </button>
            );
          })
        )}
      </div>

      {selectedTargets.length > 0 && (
        <div>
          <Label className="text-sm font-medium">Đã chọn:</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {selectedTargets.map((target, index) => (
              <Badge
                key={`${target.type}-${target.id}-${index}`}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {getTargetIcon(target.type)}
                <span>{target.name}</span>
                <button
                  onClick={() => handleRemoveTarget(target)}
                  className="ml-1 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
