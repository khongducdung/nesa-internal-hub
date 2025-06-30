
import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  FileText, 
  Plus, 
  Search,
  CheckCircle,
  Eye,
  BookOpen,
  Settings,
  List
} from 'lucide-react';
import { useProcessTemplates, useCreateProcessTemplate, useUpdateProcessTemplate } from '@/hooks/useProcessTemplates';
import { useProcessCategories } from '@/hooks/useProcessCategories';
import { ProcessTemplateForm } from '@/components/processes/ProcessTemplateForm';
import { ProcessTemplateCard } from '@/components/processes/ProcessTemplateCard';

export default function Processes() {
  const [activeTab, setActiveTab] = useState('create');
  const [showForm, setShowForm] = useState(false);
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
    setShowForm(false);
  };

  const handleEdit = (template: any) => {
    setEditingTemplate(template);
    setShowForm(true);
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
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Danh mục
            </Button>
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
            <TabsTrigger value="create">Tài liệu hướng dẫn</TabsTrigger>
            <TabsTrigger value="list">Danh sách</TabsTrigger>
          </TabsList>

          {/* Create/Edit Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card className="shadow-md border-0">
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {editingTemplate ? 'Chỉnh sửa tài liệu hướng dẫn' : 'Tạo tài liệu hướng dẫn mới'}
                  </CardTitle>
                  <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 mt-4 sm:mt-0">
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo tài liệu mới
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {editingTemplate ? 'Chỉnh sửa tài liệu' : 'Tạo tài liệu hướng dẫn mới'}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {editingTemplate 
                      ? 'Chỉnh sửa nội dung và thông tin tài liệu hướng dẫn'
                      : 'Bắt đầu tạo tài liệu hướng dẫn công việc cho nhân viên'
                    }
                  </p>
                  <Button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    {editingTemplate ? 'Chỉnh sửa' : 'Tạo tài liệu mới'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

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
                {isLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Đang tải...</p>
                  </div>
                ) : filteredTemplates.length === 0 ? (
                  <div className="text-center py-12">
                    <List className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có tài liệu hướng dẫn</h3>
                    <p className="text-gray-500 mb-6">Bắt đầu bằng cách tạo tài liệu hướng dẫn đầu tiên cho nhân viên</p>
                    <Button onClick={() => {
                      setActiveTab('create');
                      setShowForm(true);
                    }} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Tạo tài liệu đầu tiên
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map((template) => (
                      <ProcessTemplateCard
                        key={template.id}
                        template={template}
                        onEdit={(template) => {
                          handleEdit(template);
                          setActiveTab('create');
                        }}
                        onView={handleView}
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Form Modal */}
        <ProcessTemplateForm
          open={showForm}
          onOpenChange={(open) => {
            setShowForm(open);
            if (!open) {
              setEditingTemplate(null);
            }
          }}
          onSubmit={handleSubmit}
          initialData={editingTemplate}
        />
      </div>
    </DashboardLayout>
  );
}
