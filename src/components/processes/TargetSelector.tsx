
import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useDepartments } from '@/hooks/useDepartments';
import { usePositions } from '@/hooks/usePositions';
import { useEmployees } from '@/hooks/useEmployees';

interface TargetSelectorProps {
  targetType: string;
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function TargetSelector({ targetType, selectedIds, onSelectionChange }: TargetSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: departments = [] } = useDepartments();
  const { data: positions = [] } = usePositions();
  const { data: employees = [] } = useEmployees();

  const getTargetOptions = () => {
    switch (targetType) {
      case 'department':
        return departments?.map(dept => ({ id: dept.id, name: dept.name })) || [];
      case 'position':
        return positions?.map(pos => ({ id: pos.id, name: pos.name })) || [];
      case 'employee':
        return employees?.map(emp => ({ id: emp.id, name: emp.full_name })) || [];
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

  const handleToggleSelection = (id: string) => {
    if (selectedIds.includes(id)) {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      onSelectionChange([...selectedIds, id]);
    }
  };

  // Always render the component structure, even for unsupported target types
  if (targetType === 'general' || targetType === 'mixed') {
    return (
      <div className="text-sm text-gray-500 text-center py-4 border-2 border-dashed border-gray-200 rounded-lg">
        {targetType === 'general' 
          ? 'Áp dụng cho toàn công ty' 
          : 'Sử dụng Multi Target Selector cho loại mixed'
        }
      </div>
    );
  }

  return (
    <div>
      <div className="relative mb-3">
        <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
        <Input
          placeholder={`Tìm kiếm ${targetType === 'department' ? 'phòng ban' : targetType === 'position' ? 'vị trí' : 'nhân viên'}...`}
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
          filteredOptions.map((option) => (
            <label key={option.id} className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={selectedIds.includes(option.id)}
                onChange={() => handleToggleSelection(option.id)}
                className="rounded"
              />
              <span className="text-sm">{option.name}</span>
            </label>
          ))
        )}
      </div>
    </div>
  );
}
