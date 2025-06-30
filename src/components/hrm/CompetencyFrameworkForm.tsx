
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus } from 'lucide-react';
import { usePositions } from '@/hooks/usePositions';
import { useCreateCompetencyFramework, useUpdateCompetencyFramework } from '@/hooks/useCompetencyFrameworkMutations';
import { useCompetencyFramework } from '@/hooks/useCompetencyFrameworks';

interface CompetencyFrameworkFormProps {
  onClose: () => void;
  frameworkId?: string;
}

interface Competency {
  id: string;
  name: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  weight: number;
}

export function CompetencyFrameworkForm({ onClose, frameworkId }: CompetencyFrameworkFormProps) {
  const { data: positions } = usePositions();
  const { data: framework, isLoading } = useCompetencyFramework(frameworkId || '');
  const createFramework = useCreateCompetencyFramework();
  const updateFramework = useUpdateCompetencyFramework();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    position_id: '',
    status: 'draft' as 'draft' | 'active' | 'inactive',
  });

  const [competencies, setCompetencies] = useState<Competency[]>([]);

  useEffect(() => {
    if (framework) {
      setFormData({
        name: framework.name,
        description: framework.description || '',
        position_id: framework.position_id || '',
        status: framework.status as 'draft' | 'active' | 'inactive',
      });
      
      // Safely convert JSON data to Competency array
      const frameworkCompetencies = framework.competencies;
      if (Array.isArray(frameworkCompetencies)) {
        const typedCompetencies = frameworkCompetencies.map((comp: any) => ({
          id: comp.id || Date.now().toString(),
          name: comp.name || '',
          description: comp.description || '',
          level: comp.level || 'intermediate',
          weight: comp.weight || 1,
        })) as Competency[];
        setCompetencies(typedCompetencies);
      }
    }
  }, [framework]);

  const addCompetency = () => {
    const newCompetency: Competency = {
      id: Date.now().toString(),
      name: '',
      description: '',
      level: 'intermediate',
      weight: 1,
    };
    setCompetencies([...competencies, newCompetency]);
  };

  const updateCompetency = (id: string, field: keyof Competency, value: any) => {
    setCompetencies(competencies.map(comp => 
      comp.id === id ? { ...comp, [field]: value } : comp
    ));
  };

  const removeCompetency = (id: string) => {
    setCompetencies(competencies.filter(comp => comp.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...formData,
      competencies: competencies,
      created_by: 'current-user-id', // Replace with actual user ID
    };

    if (frameworkId) {
      await updateFramework.mutateAsync({ id: frameworkId, data });
    } else {
      await createFramework.mutateAsync(data);
    }
    
    onClose();
  };

  if (isLoading && frameworkId) {
    return <div className="p-6">Đang tải...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Tên khung năng lực *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Vị trí *</Label>
          <Select
            value={formData.position_id}
            onValueChange={(value) => setFormData({ ...formData, position_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn vị trí" />
            </SelectTrigger>
            <SelectContent>
              {positions?.map((position) => (
                <SelectItem key={position.id} value={position.id}>
                  {position.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Trạng thái</Label>
        <Select
          value={formData.status}
          onValueChange={(value: 'draft' | 'active' | 'inactive') => setFormData({ ...formData, status: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="draft">Nháp</SelectItem>
            <SelectItem value="active">Hoạt động</SelectItem>
            <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Năng lực yêu cầu</CardTitle>
          <Button type="button" onClick={addCompetency} size="sm">
            <Plus className="h-4 w-4 mr-1" />
            Thêm năng lực
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {competencies.map((competency) => (
            <Card key={competency.id} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>Tên năng lực</Label>
                  <Input
                    value={competency.name}
                    onChange={(e) => updateCompetency(competency.id, 'name', e.target.value)}
                    placeholder="VD: Giao tiếp"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Mức độ yêu cầu</Label>
                  <Select
                    value={competency.level}
                    onValueChange={(value: 'beginner' | 'intermediate' | 'advanced' | 'expert') => 
                      updateCompetency(competency.id, 'level', value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Cơ bản</SelectItem>
                      <SelectItem value="intermediate">Trung bình</SelectItem>
                      <SelectItem value="advanced">Cao</SelectItem>
                      <SelectItem value="expert">Chuyên gia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Trọng số (1-5)</Label>
                  <Input
                    type="number"
                    min="1"
                    max="5"
                    value={competency.weight}
                    onChange={(e) => updateCompetency(competency.id, 'weight', parseInt(e.target.value))}
                  />
                </div>

                <div className="flex items-end">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeCompetency(competency.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="mt-4 space-y-2">
                <Label>Mô tả chi tiết</Label>
                <Textarea
                  value={competency.description}
                  onChange={(e) => updateCompetency(competency.id, 'description', e.target.value)}
                  placeholder="Mô tả chi tiết về năng lực này..."
                  rows={2}
                />
              </div>
            </Card>
          ))}
          
          {competencies.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Chưa có năng lực nào. Nhấn "Thêm năng lực" để bắt đầu.
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Hủy
        </Button>
        <Button type="submit" disabled={createFramework.isPending || updateFramework.isPending}>
          {frameworkId ? 'Cập nhật' : 'Tạo mới'}
        </Button>
      </div>
    </form>
  );
}
