
import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Users, 
  Building, 
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  Edit,
  Trash2,
  PlayCircle
} from 'lucide-react';

interface Process {
  id: string;
  name: string;
  description?: string;
  department_id?: string;
  position_id?: string;
  assigned_user_id?: string;
  steps?: any;
  status: 'active' | 'inactive' | 'pending';
  created_at: string;
  department?: { name: string };
  position?: { name: string };
  assigned_user?: { full_name: string };
  created_by_user?: { full_name: string };
}

interface Department {
  id: string;
  name: string;
}

interface Position {
  id: string;
  name: string;
  department_id: string;
}

interface User {
  id: string;
  full_name: string;
  department_id?: string;
}

export default function Processes() {
  const { profile, isAdmin, isSuperAdmin } = useAuth();
  const [processes, setProcesses] = useState<Process[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedProcess, setSelectedProcess] = useState<Process | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    department_id: '',
    position_id: '',
    assigned_user_id: '',
    steps: []
  });

  const [processSteps, setProcessSteps] = useState([
    { id: 1, title: '', description: '', duration: '', responsible: '' }
  ]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch processes with relations
      const { data: processesData, error: processesError } = await supabase
        .from('processes')
        .select(`
          *,
          department:departments(name),
          position:positions(name),
          assigned_user:profiles!processes_assigned_user_id_fkey(full_name),
          created_by_user:profiles!processes_created_by_fkey(full_name)
        `)
        .order('created_at', { ascending: false });

      if (processesError) throw processesError;

      // Fetch departments
      const { data: departmentsData, error: departmentsError } = await supabase
        .from('departments')
        .select('id, name')
        .eq('status', 'active')
        .order('name');

      if (departmentsError) throw departmentsError;

      // Fetch positions
      const { data: positionsData, error: positionsError } = await supabase
        .from('positions')
        .select('id, name, department_id')
        .eq('status', 'active')
        .order('name');

      if (positionsError) throw positionsError;

      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, full_name, department_id')
        .eq('status', 'active')
        .order('full_name');

      if (usersError) throw usersError;

      setProcesses(processesData || []);
      setDepartments(departmentsData || []);
      setPositions(positionsData || []);
      setUsers(usersData || []);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Có lỗi khi tải dữ liệu');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProcesses = processes.filter(process => {
    const matchesSearch = process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         process.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || process.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || process.department_id === departmentFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment;
  });

  const getStatusBadge = (status: string) => {
    const variants = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-gray-100 text-gray-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    
    const labels = {
      active: 'Hoạt động',
      inactive: 'Không hoạt động',
      pending: 'Chờ duyệt'
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const addProcessStep = () => {
    setProcessSteps([...processSteps, {
      id: processSteps.length + 1,
      title: '',
      description: '',
      duration: '',
      responsible: ''
    }]);
  };

  const removeProcessStep = (id: number) => {
    if (processSteps.length > 1) {
      setProcessSteps(processSteps.filter(step => step.id !== id));
    }
  };

  const updateProcessStep = (id: number, field: string, value: string) => {
    setProcessSteps(processSteps.map(step => 
      step.id === id ? { ...step, [field]: value } : step
    ));
  };

  const handleCreateProcess = async () => {
    try {
      if (!formData.name) {
        toast.error('Vui lòng nhập tên quy trình');
        return;
      }

      const { error } = await supabase
        .from('processes')
        .insert({
          ...formData,
          steps: processSteps,
          created_by: profile?.id
        });

      if (error) throw error;

      toast.success('Tạo quy trình thành công!');
      setIsCreateDialogOpen(false);
      resetForm();
      fetchData();
    } catch (error) {
      console.error('Error creating process:', error);
      toast.error('Có lỗi khi tạo quy trình');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      department_id: '',
      position_id: '',
      assigned_user_id: '',
      steps: []
    });
    setProcessSteps([{ id: 1, title: '', description: '', duration: '', responsible: '' }]);
  };

  const stats = {
    total: processes.length,
    active: processes.filter(p => p.status === 'active').length,
    pending: processes.filter(p => p.status === 'pending').length,
    inactive: processes.filter(p => p.status === 'inactive').length
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quản lý quy trình</h1>
            <p className="text-gray-600 mt-1">Tạo và quản lý các quy trình làm việc</p>
          </div>
          
          {(isAdmin || isSuperAdmin) && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Tạo quy trình mới
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Tạo quy trình mới</DialogTitle>
                  <DialogDescription>
                    Điền thông tin chi tiết để tạo quy trình làm việc mới
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Tên quy trình *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Nhập tên quy trình..."
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="department">Phòng ban</Label>
                      <Select 
                        value={formData.department_id} 
                        onValueChange={(value) => setFormData({...formData, department_id: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn phòng ban" />
                        </SelectTrigger>
                        <SelectContent>
                          {departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id}>
                              {dept.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="position">Vị trí công việc</Label>
                      <Select 
                        value={formData.position_id} 
                        onValueChange={(value) => setFormData({...formData, position_id: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn vị trí" />
                        </SelectTrigger>
                        <SelectContent>
                          {positions
                            .filter(pos => !formData.department_id || pos.department_id === formData.department_id)
                            .map((pos) => (
                            <SelectItem key={pos.id} value={pos.id}>
                              {pos.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="assigned_user">Người phụ trách</Label>
                      <Select 
                        value={formData.assigned_user_id} 
                        onValueChange={(value) => setFormData({...formData, assigned_user_id: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn người phụ trách" />
                        </SelectTrigger>
                        <SelectContent>
                          {users
                            .filter(user => !formData.department_id || user.department_id === formData.department_id)
                            .map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                              {user.full_name}
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
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Mô tả chi tiết về quy trình..."
                      rows={3}
                    />
                  </div>

                  {/* Process Steps */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <Label className="text-base font-semibold">Các bước thực hiện</Label>
                      <Button type="button" variant="outline" size="sm" onClick={addProcessStep}>
                        <Plus className="h-4 w-4 mr-1" />
                        Thêm bước
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {processSteps.map((step, index) => (
                        <Card key={step.id} className="p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <Label className="font-medium">Bước {index + 1}</Label>
                              {processSteps.length > 1 && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeProcessStep(step.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              <Input
                                placeholder="Tiêu đề bước..."
                                value={step.title}
                                onChange={(e) => updateProcessStep(step.id, 'title', e.target.value)}
                              />
                              <Input
                                placeholder="Thời gian thực hiện (VD: 2 giờ)"
                                value={step.duration}
                                onChange={(e) => updateProcessStep(step.id, 'duration', e.target.value)}
                              />
                            </div>
                            
                            <Textarea
                              placeholder="Mô tả chi tiết bước thực hiện..."
                              value={step.description}
                              onChange={(e) => updateProcessStep(step.id, 'description', e.target.value)}
                              rows={2}
                            />
                            
                            <Input
                              placeholder="Người chịu trách nhiệm"
                              value={step.responsible}
                              onChange={(e) => updateProcessStep(step.id, 'responsible', e.target.value)}
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Hủy
                    </Button>
                    <Button onClick={handleCreateProcess}>
                      Tạo quy trình
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng số quy trình</CardTitle>
              <FileText className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đang hoạt động</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.active}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chờ duyệt</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Không hoạt động</CardTitle>
              <AlertCircle className="h-4 w-4 text-gray-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600">{stats.inactive}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Tìm kiếm quy trình..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>

              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full lg:w-48">
                  <SelectValue placeholder="Phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả phòng ban</SelectItem>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Processes List */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách quy trình ({filteredProcesses.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredProcesses.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có quy trình nào</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || statusFilter !== 'all' || departmentFilter !== 'all' 
                    ? 'Không tìm thấy quy trình phù hợp với bộ lọc hiện tại'
                    : 'Bắt đầu bằng cách tạo quy trình đầu tiên'
                  }
                </p>
                {(isAdmin || isSuperAdmin) && (
                  <Button onClick={() => setIsCreateDialogOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tạo quy trình mới
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProcesses.map((process) => (
                  <div key={process.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-lg text-gray-900">{process.name}</h3>
                          {getStatusBadge(process.status)}
                        </div>
                        
                        {process.description && (
                          <p className="text-gray-600 mb-3">{process.description}</p>
                        )}
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-2" />
                            <span>{process.department?.name || 'Chưa phân phòng ban'}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            <span>{process.assigned_user?.full_name || 'Chưa phân công'}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Tạo: {new Date(process.created_at).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                        
                        {process.steps && Array.isArray(process.steps) && process.steps.length > 0 && (
                          <div className="mt-3">
                            <span className="text-sm text-gray-500">
                              <PlayCircle className="h-4 w-4 inline mr-1" />
                              {process.steps.length} bước thực hiện
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {(isAdmin || isSuperAdmin) && (
                          <>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
