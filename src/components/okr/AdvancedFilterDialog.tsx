
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Filter, X } from 'lucide-react';
import { useOKRAnalytics } from '@/hooks/useOKRAnalytics';

interface AdvancedFilterDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyFilters: (filters: any) => void;
}

export function AdvancedFilterDialog({ isOpen, onClose, onApplyFilters }: AdvancedFilterDialogProps) {
  const { getAdvancedFilters } = useOKRAnalytics();
  const filterOptions = getAdvancedFilters();
  
  const [filters, setFilters] = useState({
    departments: [] as string[],
    levels: [] as string[],
    positions: [] as string[],
    progress: { min: 0, max: 100 },
    status: [] as string[],
    period: 'current'
  });

  const statusOptions = [
    { value: 'on_track', label: 'Đúng tiến độ', color: 'bg-green-100 text-green-800' },
    { value: 'at_risk', label: 'Cần chú ý', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'behind', label: 'Chậm tiến độ', color: 'bg-red-100 text-red-800' },
    { value: 'completed', label: 'Hoàn thành', color: 'bg-blue-100 text-blue-800' }
  ];

  const handleCheckboxChange = (category: string, value: string, checked: boolean) => {
    setFilters(prev => ({
      ...prev,
      [category]: checked 
        ? [...prev[category as keyof typeof prev] as string[], value]
        : (prev[category as keyof typeof prev] as string[]).filter(item => item !== value)
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      departments: [],
      levels: [],
      positions: [],
      progress: { min: 0, max: 100 },
      status: [],
      period: 'current'
    });
  };

  const getActiveFiltersCount = () => {
    return filters.departments.length + 
           filters.levels.length + 
           filters.positions.length + 
           filters.status.length +
           (filters.period !== 'current' ? 1 : 0);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            Bộ lọc nâng cao
            {getActiveFiltersCount() > 0 && (
              <Badge variant="secondary">{getActiveFiltersCount()} bộ lọc</Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Period Filter */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Chu kỳ thời gian</Label>
            <Select value={filters.period} onValueChange={(value) => setFilters(prev => ({ ...prev, period: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filterOptions.periods.map((period) => (
                  <SelectItem key={period.value} value={period.value}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Department Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Phòng ban</Label>
            <div className="grid grid-cols-2 gap-2">
              {filterOptions.departments.map((dept) => (
                <div key={dept.name} className="flex items-center space-x-2">
                  <Checkbox
                    id={`dept-${dept.name}`}
                    checked={filters.departments.includes(dept.name)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('departments', dept.name, checked as boolean)
                    }
                  />
                  <Label htmlFor={`dept-${dept.name}`} className="text-sm cursor-pointer">
                    {dept.name}
                    <span className="text-gray-500 ml-1">({dept.total})</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Level Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Cấp bậc</Label>
            <div className="grid grid-cols-2 gap-2">
              {filterOptions.levels.map((level) => (
                <div key={level.level} className="flex items-center space-x-2">
                  <Checkbox
                    id={`level-${level.level}`}
                    checked={filters.levels.includes(level.level)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('levels', level.level, checked as boolean)
                    }
                  />
                  <Label htmlFor={`level-${level.level}`} className="text-sm cursor-pointer">
                    {level.level}
                    <span className="text-gray-500 ml-1">({level.total})</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Position Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Vị trí</Label>
            <div className="grid grid-cols-2 gap-2">
              {filterOptions.positions.map((position) => (
                <div key={position.position} className="flex items-center space-x-2">
                  <Checkbox
                    id={`pos-${position.position}`}
                    checked={filters.positions.includes(position.position)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('positions', position.position, checked as boolean)
                    }
                  />
                  <Label htmlFor={`pos-${position.position}`} className="text-sm cursor-pointer">
                    {position.position}
                    <span className="text-gray-500 ml-1">({position.total})</span>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Status Filter */}
          <div>
            <Label className="text-sm font-medium mb-3 block">Trạng thái tiến độ</Label>
            <div className="grid grid-cols-1 gap-2">
              {statusOptions.map((status) => (
                <div key={status.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status.value}`}
                    checked={filters.status.includes(status.value)}
                    onCheckedChange={(checked) => 
                      handleCheckboxChange('status', status.value, checked as boolean)
                    }
                  />
                  <Label htmlFor={`status-${status.value}`} className="text-sm cursor-pointer flex items-center gap-2">
                    <Badge variant="outline" className={status.color}>
                      {status.label}
                    </Badge>
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Active Filters Summary */}
          {getActiveFiltersCount() > 0 && (
            <>
              <Separator />
              <div>
                <Label className="text-sm font-medium mb-2 block">Bộ lọc đã chọn</Label>
                <div className="flex flex-wrap gap-2">
                  {filters.departments.map(dept => (
                    <Badge key={dept} variant="secondary" className="flex items-center gap-1">
                      {dept}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleCheckboxChange('departments', dept, false)}
                      />
                    </Badge>
                  ))}
                  {filters.levels.map(level => (
                    <Badge key={level} variant="secondary" className="flex items-center gap-1">
                      {level}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleCheckboxChange('levels', level, false)}
                      />
                    </Badge>
                  ))}
                  {filters.positions.map(pos => (
                    <Badge key={pos} variant="secondary" className="flex items-center gap-1">
                      {pos}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => handleCheckboxChange('positions', pos, false)}
                      />
                    </Badge>
                  ))}
                  {filters.status.map(status => {
                    const statusOption = statusOptions.find(s => s.value === status);
                    return (
                      <Badge key={status} variant="secondary" className="flex items-center gap-1">
                        {statusOption?.label}
                        <X 
                          className="h-3 w-3 cursor-pointer" 
                          onClick={() => handleCheckboxChange('status', status, false)}
                        />
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={handleReset}>
            Đặt lại
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button onClick={handleApply} className="bg-blue-600 hover:bg-blue-700">
              Áp dụng bộ lọc
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
