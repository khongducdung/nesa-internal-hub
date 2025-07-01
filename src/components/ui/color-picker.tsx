
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card } from '@/components/ui/card';
import { Check } from 'lucide-react';

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
}

const predefinedColors = [
  { name: 'Xanh dương', value: '#3B82F6' },
  { name: 'Xanh lá', value: '#10B981' },
  { name: 'Vàng', value: '#F59E0B' },
  { name: 'Tím', value: '#8B5CF6' },
  { name: 'Đỏ', value: '#EF4444' },
  { name: 'Hồng', value: '#EC4899' },
  { name: 'Xanh ngọc', value: '#06B6D4' },
  { name: 'Cam', value: '#F97316' },
  { name: 'Xám', value: '#6B7280' },
  { name: 'Xanh đậm', value: '#1E40AF' },
  { name: 'Xanh lá đậm', value: '#059669' },
  { name: 'Nâu', value: '#92400E' }
];

export function ColorPicker({ value, onChange, className }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [customColor, setCustomColor] = useState(value);

  const handleColorSelect = (color: string) => {
    onChange(color);
    setCustomColor(color);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={`w-full justify-start ${className}`}
        >
          <div 
            className="w-4 h-4 rounded-full border mr-2 flex-shrink-0"
            style={{ backgroundColor: value }}
          />
          <span className="truncate">
            {predefinedColors.find(c => c.value === value)?.name || 'Màu tùy chỉnh'}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-3">Màu sẵn có</h4>
            <div className="grid grid-cols-4 gap-2">
              {predefinedColors.map((color) => (
                <Button
                  key={color.value}
                  variant="outline"
                  className="h-12 p-2 flex flex-col items-center justify-center relative"
                  onClick={() => handleColorSelect(color.value)}
                >
                  <div 
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: color.value }}
                  />
                  {value === color.value && (
                    <Check className="absolute top-1 right-1 h-3 w-3 text-white" />
                  )}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h4 className="text-sm font-medium mb-3">Màu tùy chỉnh</h4>
            <div className="flex gap-2">
              <input
                type="color"
                value={customColor}
                onChange={(e) => setCustomColor(e.target.value)}
                className="w-12 h-12 rounded border cursor-pointer"
              />
              <Button
                variant="outline"
                onClick={() => handleColorSelect(customColor)}
                className="flex-1"
              >
                Áp dụng màu tùy chỉnh
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
