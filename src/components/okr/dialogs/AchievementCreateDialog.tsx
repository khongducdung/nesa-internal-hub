
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

const achievementIcons = [
  { value: '🏆', label: 'Cúp vàng', category: 'trophy' },
  { value: '🥇', label: 'Huy chương vàng', category: 'medal' },
  { value: '🥈', label: 'Huy chương bạc', category: 'medal' },
  { value: '🥉', label: 'Huy chương đồng', category: 'medal' },
  { value: '👑', label: 'Vương miện', category: 'crown' },
  { value: '⭐', label: 'Ngôi sao', category: 'star' },
  { value: '🌟', label: 'Ngôi sao sáng', category: 'star' },
  { value: '💎', label: 'Kim cương', category: 'gem' },
  { value: '🔥', label: 'Lửa đam mê', category: 'element' },
  { value: '⚡', label: 'Tốc độ', category: 'element' },
  { value: '🎯', label: 'Mục tiêu', category: 'target' },
  { value: '🚀', label: 'Tên lửa', category: 'speed' },
  { value: '🦅', label: 'Đại bàng', category: 'animal' },
  { value: '🦁', label: 'Sư tử', category: 'animal' },
  { value: '🔱', label: 'Tam thoa', category: 'weapon' },
  { value: '⚔️', label: 'Thanh kiếm', category: 'weapon' },
  { value: '🛡️', label: 'Khiên', category: 'shield' },
  { value: '🏅', label: 'Huy hiệu', category: 'badge' },
  { value: '🎖️', label: 'Huân chương', category: 'medal' },
  { value: '🏰', label: 'Lâu đài', category: 'building' }
];

const achievementTypes = [
  { value: 'milestone', label: 'Cột mốc', color: 'bg-blue-100 text-blue-800' },
  { value: 'achievement', label: 'Thành tích', color: 'bg-green-100 text-green-800' },
  { value: 'collaboration', label: 'Cộng tác', color: 'bg-purple-100 text-purple-800' },
  { value: 'excellence', label: 'Xuất sắc', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'leadership', label: 'Lãnh đạo', color: 'bg-red-100 text-red-800' },
  { value: 'innovation', label: 'Sáng tạo', color: 'bg-orange-100 text-orange-800' }
];

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  type: string;
  points: number;
  status: string;
}

interface AchievementCreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  achievement?: Achievement | null;
  onSave: (achievement: Omit<Achievement, 'id'>) => void;
}

export function AchievementCreateDialog({ open, onOpenChange, achievement, onSave }: AchievementCreateDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: achievement?.name || '',
    description: achievement?.description || '',
    icon: achievement?.icon || '🏆',
    type: achievement?.type || 'milestone',
    points: achievement?.points || 100,
    status: achievement?.status || 'active'
  });

  const [selectedCategory, setSelectedCategory] = useState('trophy');

  const filteredIcons = achievementIcons.filter(icon => 
    selectedCategory === 'all' || icon.category === selectedCategory
  );

  const handleSave = () => {
    if (!formData.name || !formData.description) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ tên và mô tả huy hiệu",
        variant: "destructive",
      });
      return;
    }

    onSave(formData);
    toast({
      title: "Đã tạo thành công",
      description: "Huy hiệu mới đã được tạo",
    });
    onOpenChange(false);
  };

  const getTypeColor = (type: string) => {
    return achievementTypes.find(t => t.value === type)?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {achievement ? 'Chỉnh sửa huy hiệu' : 'Tạo huy hiệu mới'}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Preview */}
          <div className="flex items-center justify-center p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border-2 border-dashed border-yellow-200">
            <div className="text-center">
              <div className="text-6xl mb-3">{formData.icon}</div>
              <h3 className="font-bold text-lg text-gray-900 mb-1">
                {formData.name || 'Tên huy hiệu'}
              </h3>
              <p className="text-gray-600 text-sm mb-2">
                {formData.description || 'Mô tả huy hiệu'}
              </p>
              <div className="flex items-center justify-center gap-2">
                <Badge className={getTypeColor(formData.type)}>
                  {achievementTypes.find(t => t.value === formData.type)?.label}
                </Badge>
                <Badge variant="outline">
                  {formData.points} điểm
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tên huy hiệu</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="VD: Chinh phục đỉnh cao"
                />
              </div>

              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Mô tả chi tiết về huy hiệu và cách đạt được..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Loại huy hiệu</Label>
                  <Select value={formData.type} onValueChange={(value) => setFormData({...formData, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {achievementTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Điểm thưởng</Label>
                  <Input
                    type="number"
                    value={formData.points}
                    onChange={(e) => setFormData({...formData, points: parseInt(e.target.value) || 0})}
                    min="0"
                    step="10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Trạng thái</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Hoạt động</SelectItem>
                    <SelectItem value="draft">Nháp</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Icon Selection */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Chọn biểu tượng</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trophy">Cúp & Giải thưởng</SelectItem>
                    <SelectItem value="medal">Huy chương</SelectItem>
                    <SelectItem value="crown">Vương miện</SelectItem>
                    <SelectItem value="star">Ngôi sao</SelectItem>
                    <SelectItem value="gem">Đá quý</SelectItem>
                    <SelectItem value="element">Nguyên tố</SelectItem>
                    <SelectItem value="target">Mục tiêu</SelectItem>
                    <SelectItem value="speed">Tốc độ</SelectItem>
                    <SelectItem value="animal">Động vật</SelectItem>
                    <SelectItem value="weapon">Vũ khí</SelectItem>
                    <SelectItem value="shield">Khiên</SelectItem>
                    <SelectItem value="badge">Huy hiệu</SelectItem>
                    <SelectItem value="building">Kiến trúc</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-5 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg">
                {filteredIcons.map((icon) => (
                  <button
                    key={icon.value}
                    type="button"
                    onClick={() => setFormData({...formData, icon: icon.value})}
                    className={`p-3 text-2xl rounded-lg border-2 transition-all hover:scale-110 ${
                      formData.icon === icon.value 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    title={icon.label}
                  >
                    {icon.value}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            {achievement ? 'Lưu thay đổi' : 'Tạo huy hiệu'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
