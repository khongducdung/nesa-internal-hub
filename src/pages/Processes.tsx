import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { ProcessWithDetails, Department, Position, Profile } from '@/types/database';
import { Plus, Search, Filter, Edit, Trash2, Users, Building, Clock, CheckCircle } from 'lucide-react';

export default function Processes() {
  const [processes, setProcesses] = useState<ProcessWithDetails[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  // Stats
  const activeProcesses = processes.filter(p => p.status === 'active').length;
  const pendingProcesses = processes.filter(p => p.status === 'pending').length;
  const totalProcesses = processes.length;

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch processes with joined data
      const { data: processesData, error: processesError } = await supabase
        .from('processes')
        .select(`
          *,
          departments:department_id (id, name),
          positions:position_id (id, name),
          assigned_user:assigned_user_id (id, full_name),
          created_by_user:created_by (id, full_name)
        `);

      if (processesError) throw processesError;
      
      // Type cast to match our ProcessWithDetails type
      setProcesses((processesData as any[]) || []);

      // Fetch departments
      const { data: departmentsData, error: departmentsError } = await supabase
        .from('departments')
        .select('*')
        .eq('status', 'active');

      if (departmentsError) throw departmentsError;
      setDepartments(departmentsData || []);

      // Fetch positions
      const { data: positionsData, error: positionsError } = await supabase
        .from('positions')
        .select('*')
        .eq('status', 'active');

      if (positionsError) throw positionsError;
      setPositions(positionsData || []);

      // Fetch users
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('*')
        .eq('status', 'active');

      if (usersError) throw usersError;
      setUsers(usersData || []);

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tải dữ liệu",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredProcesses = processes.filter(process => {
    const matchesSearch = process.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         process.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || process.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Hoạt động';
      case 'inactive': return 'Không hoạt động';
      case 'pending': return 'Chờ duyệt';
      default: return status;
    }
  };

  const handleCreateProcess = async (formData: any) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Not authenticated');

      const { error } = await supabase
        .from('processes')
        .insert([
          {
            ...formData,
            created_by: userData.user.id,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast({
        title: "Thành công",
        description: "Quy trình đã được tạo thành công",
      });

      fetchData();
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating process:', error);
      toast({
        title: "Lỗi",
        description: "Không thể tạo quy trình",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Đang tải...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Quản lý Quy trình</h1>
            <p className="text-muted-foreground">
              Quản lý và theo dõi các quy trình công việc
            </p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tạo Quy trình
              </Button>
            </DialogTrigger>
            <ProcessDialog 
              departments={departments}
              positions={positions}
              users={users}
              onSubmit={handleCreateProcess}
            />
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tổng Quy trình</CardTitle>
              <Building className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalProcesses}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Đang Hoạt động</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeProcesses}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Chờ Duyệt</CardTitle>
              <Clock className="h-4 w-4 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingProcesses}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Người Tham gia</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{users.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách Quy trình</CardTitle>
            <CardDescription>
              Quản lý và theo dõi tất cả các quy trình trong hệ thống
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm quy trình..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                  <SelectItem value="inactive">Không hoạt động</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên Quy trình</TableHead>
                    <TableHead>Phòng ban</TableHead>
                    <TableHead>Vị trí</TableHead>
                    <TableHead>Người phụ trách</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProcesses.map((process) => (
                    <TableRow key={process.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{process.name}</div>
                          {process.description && (
                            <div className="text-sm text-muted-foreground">
                              {process.description.length > 50 
                                ? `${process.description.substring(0, 50)}...` 
                                : process.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        {process.departments?.name || 'Chưa phân công'}
                      </TableCell>
                      <TableCell>
                        {process.positions?.name || 'Chưa phân công'}
                      </TableCell>
                      <TableCell>
                        {process.assigned_user?.full_name || 'Chưa phân công'}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(process.status || 'pending')}>
                          {getStatusText(process.status || 'pending')}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {process.created_at ? new Date(process.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

// Create Process Dialog Component
function ProcessDialog({ 
  departments, 
  positions, 
  users, 
  onSubmit 
}: {
  departments: Department[];
  positions: Position[];
  users: Profile[];
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    department_id: '',
    position_id: '',
    assigned_user_id: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      description: '',
      department_id: '',
      position_id: '',
      assigned_user_id: ''
    });
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Tạo Quy trình mới</DialogTitle>
        <DialogDescription>
          Tạo một quy trình công việc mới cho tổ chức
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Tên quy trình</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Nhập tên quy trình"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Mô tả chi tiết về quy trình"
          />
        </div>
        
        <div className="space-y-2">
          <Label>Phòng ban</Label>
          <Select 
            value={formData.department_id} 
            onValueChange={(value) => setFormData({ ...formData, department_id: value })}
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
        
        <div className="space-y-2">
          <Label>Vị trí</Label>
          <Select 
            value={formData.position_id} 
            onValueChange={(value) => setFormData({ ...formData, position_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn vị trí" />
            </SelectTrigger>
            <SelectContent>
              {positions.map((pos) => (
                <SelectItem key={pos.id} value={pos.id}>
                  {pos.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label>Người phụ trách</Label>
          <Select 
            value={formData.assigned_user_id} 
            onValueChange={(value) => setFormData({ ...formData, assigned_user_id: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn người phụ trách" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={user.id} value={user.id}>
                  {user.full_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <DialogFooter>
          <Button type="submit">Tạo Quy trình</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
