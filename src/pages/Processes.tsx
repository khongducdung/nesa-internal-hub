
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Search,
  CheckCircle,
  Eye,
  BookOpen
} from 'lucide-react';
import { useProcessTemplates, useCreateProcessTemplate, useUpdateProcessTemplate } from '@/hooks/useProcessTemplates';
import { useProcessCategories } from '@/hooks/useProcessCategories';
import { ProcessTemplateForm } from '@/components/processes/ProcessTemplateForm';
import { ProcessTemplateList } from '@/components/processes/ProcessTemplateList';

export default function Processes() {
  const [activeTab, setActiveTab] = useState('list');
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const { data: processTemplates, isLoading } = useProcessTemplates();
  const { data: categories } = useProcessCategories();
  const createMutation = useCreateProcessTemplate();
  const updateMutation = useUpdateProcessTemplate();

  // Thống kê
  const documentStats = [
    {
      title: 'Tổng tài liệu',
      value: processTemplates?.length.toString() || '0',
      icon: FileText,
      color: 'from-blue-500 to-blue-600',
      change: '+3',
      changeType: 'increase'
    },
    {
      title: 'Đang áp dụng',
      value: processTemplates?.filter(t => t.status === 'published').length.toString() || '0',
      icon: CheckCircle,
      color: 'from-green-500 to-green-600',
      change: '+2',
      changeType: 'increase'
    },
    {
      title: 'Tạm dừng',
      value: processTemplates?.filter(t => t.status === 'draft').length.toString() || '0',
      icon: BookOpen,
      color: 'from-yellow-500 to-yellow-600',
      change: '+1',
      changeType: 'increase'
    },
    {
      title: 'Lượt xem tháng',
      value: '1,247',
      icon: Eye,
      color: 'from-purple-500 to-purple-600',
      change: '+15%',
      changeType: 'increase'
    }
  ];

  const handleSubmit = async (data: any) => {
    if (editingTemplate) {
      await updateMutation.mutateAsync({ ...data, id: editingTemplate.id });
      setEditingTemplate(null);
    } else {
      await createMutation.mutateAsync({
        ...data,
        created_by: '00000000-0000-0000-0000-000000000000'
      });
    }
    // Không chuyển tab, giữ nguyên tab create
  };

  const handleEdit = (template: any) => {
    setEditingTemplate(template);
    setActiveTab('create');
  };

  const handleView = (template: any) => {
    console.log('View template:', template);
    // TODO: Implement view modal
  };

  const filteredTemplates = processTemplates?.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category_id === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quản lý tài liệu hướng dẫn</h1>
            <p className="text-gray-600 mt-1">Tạo và quản lý các tài liệu hướng dẫn công việc cho nhân viên</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {documentStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-all duration-200 border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-bold text-gray-900 mb-1">
                        {stat.value}
                      </p>
                      <p className="text-sm text-green-600 font-medium flex items-center">
                        {stat.change} so với tháng trước
                      </p>
                    </div>
                    <div className={`bg-gradient-to-br ${stat.color} p-4 rounded-xl shadow-lg`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="list">Danh sách</TabsTrigger>
            <TabsTrigger value="create">Tạo tài liệu</TabsTrigger>
          </TabsList>

          {/* List Tab */}
          <TabsContent value="list" className="space-y-6">
            <Card className="shadow-md border-0">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-900">Danh sách tài liệu</CardTitle>
                  <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input 
                        placeholder="Tìm kiếm tài liệu..." 
                        className="pl-10 w-64"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Tất cả danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tất cả danh mục</SelectItem>
                        {categories?.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              <div 
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: category.color || '#6B7280' }}
                              />
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ProcessTemplateList
                  templates={filteredTemplates}
                  isLoading={isLoading}
                  onEdit={handleEdit}
                  onView={handleView}
                  onCreateFirst={() => setActiveTab('create')}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card className="shadow-md border-0">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {editingTemplate ? 'Chỉnh sửa tài liệu hướng dẫn' : 'Tạo tài liệu hướng dẫn mới'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ProcessTemplateForm
                  open={true}
                  onOpenChange={() => {}}
                  onSubmit={handleSubmit}
                  initialData={editingTemplate}
                  inline={true}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
