
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { useEmployees } from '@/hooks/useEmployees';
import { useUpdateEmployee } from '@/hooks/useEmployeeMutations';
import { useDepartments } from '@/hooks/useDepartments';
import { usePositions } from '@/hooks/usePositions';
import { Upload, FileText, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EmployeeEditDialogProps {
  employeeId: string;
  open: boolean;
  onClose: () => void;
}

export function EmployeeEditDialog({ employeeId, open, onClose }: EmployeeEditDialogProps) {
  const { data: employees } = useEmployees();
  const { data: departments } = useDepartments();
  const { data: positions } = usePositions();
  const updateEmployee = useUpdateEmployee();
  const { toast } = useToast();
  
  const employee = employees?.find(emp => emp.id === employeeId);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    department_id: '',
    position_id: '',
    employee_level: 'level_3' as 'level_1' | 'level_2' | 'level_3',
    work_status: 'active' as 'active' | 'inactive' | 'pending',
    salary: '',
    address: '',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    notes: '',
    job_description: '',
  });

  const [contractFile, setContractFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [existingContractUrl, setExistingContractUrl] = useState<string>('');
  const [existingCvUrl, setExistingCvUrl] = useState<string>('');

  useEffect(() => {
    if (employee) {
      setFormData({
        full_name: employee.full_name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department_id: employee.department_id || '',
        position_id: employee.position_id || '',
        employee_level: employee.employee_level || 'level_3',
        work_status: employee.work_status || 'active',
        salary: employee.salary?.toString() || '',
        address: employee.address || '',
        emergency_contact_name: employee.emergency_contact_name || '',
        emergency_contact_phone: employee.emergency_contact_phone || '',
        notes: employee.notes || '',
        job_description: (employee as any).job_description || '',
      });
      
      setExistingContractUrl((employee as any).contract_file_url || '');
      setExistingCvUrl((employee as any).cv_file_url || '');
    }
  }, [employee]);

  const uploadFile = async (file: File, fileType: 'contract' | 'cv', employeeCode: string) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${employeeCode}_${fileType}_${Date.now()}.${fileExt}`;
      const filePath = `${fileType}s/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('employee-files')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('employee-files')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error(`Error uploading ${fileType}:`, error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let contractUrl = existingContractUrl;
      let cvUrl = existingCvUrl;

      // Upload new files if provided
      if (contractFile) {
        contractUrl = await uploadFile(contractFile, 'contract', employee?.employee_code || 'unknown');
      }
      if (cvFile) {
        cvUrl = await uploadFile(cvFile, 'cv', employee?.employee_code || 'unknown');
      }

      const updateData = {
        ...formData,
        salary: formData.salary ? parseFloat(formData.salary) : null,
        contract_file_url: contractUrl || null,
        cv_file_url: cvUrl || null,
      };

      await updateEmployee.mutateAsync({ id: employeeId, data: updateData });
      onClose();
    } catch (error) {
      console.error('Error updating employee:', error);
      toast({
        title: 'Lỗi',
        description: 'Có lỗi xảy ra khi cập nhật nhân viên',
        variant: 'destructive',
      });
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, fileType: 'contract' | 'cv') => {
    const file = event.target.files?.[0];
    if (file) {
      if (fileType === 'contract') {
        setContractFile(file);
      } else {
        setCvFile(file);
      }
    }
  };

  const removeFile = (fileType: 'contract' | 'cv') => {
    if (fileType === 'contract') {
      setContractFile(null);
      setExistingContractUrl('');
    } else {
      setCvFile(null);
      setExistingCvUrl('');
    }
  };

  const filteredPositions = positions?.filter(pos => 
    !formData.department_id || pos.department_id === formData.department_id
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin nhân viên</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Họ và tên *</Label>
              <Input
                id="full_name"
                value={formData.full_name}
                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Số điện thoại</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="salary">Lương (VNĐ)</Label>
              <Input
                id="salary"
                type="number"
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Phòng ban</Label>
              <Select 
                value={formData.department_id} 
                onValueChange={(value) => setFormData({...formData, department_id: value, position_id: ''})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn phòng ban" />
                </SelectTrigger>
                <SelectContent>
                  {departments?.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="position">Vị trí</Label>
              <Select 
                value={formData.position_id} 
                onValueChange={(value) => setFormData({...formData, position_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn vị trí" />
                </SelectTrigger>
                <SelectContent>
                  {filteredPositions?.map((pos) => (
                    <SelectItem key={pos.id} value={pos.id}>
                      {pos.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="employee_level">Cấp bậc</Label>
              <Select 
                value={formData.employee_level} 
                onValueChange={(value: 'level_1' | 'level_2' | 'level_3') => setFormData({...formData, employee_level: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="level_1">Cấp 1 (Quản lý)</SelectItem>
                  <SelectItem value="level_2">Cấp 2 (Trưởng nhóm)</SelectItem>
                  <SelectItem value="level_3">Cấp 3 (Nhân viên)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="work_status">Trạng thái</Label>
              <Select 
                value={formData.work_status} 
                onValueChange={(value: 'active' | 'inactive' | 'pending') => setFormData({...formData, work_status: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Hoạt động</SelectItem>
                  <SelectItem value="inactive">Ngưng hoạt động</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({...formData, address: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="job_description">Mô tả công việc</Label>
            <RichTextEditor
              value={formData.job_description}
              onChange={(value) => setFormData({...formData, job_description: value})}
              placeholder="Nhập mô tả chi tiết công việc của nhân viên..."
            />
          </div>

          {/* File Uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Contract File */}
            <div className="space-y-2">
              <Label>Hợp đồng lao động</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {contractFile || existingContractUrl ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <span className="text-sm">
                        {contractFile ? contractFile.name : 'Hợp đồng hiện tại'}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile('contract')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <label className="cursor-pointer">
                      <span className="text-sm text-blue-600 hover:text-blue-500">
                        Tải lên hợp đồng
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange(e, 'contract')}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* CV File */}
            <div className="space-y-2">
              <Label>CV/Hồ sơ</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                {cvFile || existingCvUrl ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-green-500" />
                      <span className="text-sm">
                        {cvFile ? cvFile.name : 'CV hiện tại'}
                      </span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile('cv')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-8 w-8 text-gray-400" />
                    <label className="cursor-pointer">
                      <span className="text-sm text-green-600 hover:text-green-500">
                        Tải lên CV
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange(e, 'cv')}
                      />
                    </label>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergency_contact_name">Người liên hệ khẩn cấp</Label>
              <Input
                id="emergency_contact_name"
                value={formData.emergency_contact_name}
                onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergency_contact_phone">SĐT liên hệ khẩn cấp</Label>
              <Input
                id="emergency_contact_phone"
                value={formData.emergency_contact_phone}
                onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Ghi chú</Label>
            <RichTextEditor
              value={formData.notes}
              onChange={(value) => setFormData({...formData, notes: value})}
              placeholder="Nhập ghi chú về nhân viên..."
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button type="submit" disabled={updateEmployee.isPending}>
              {updateEmployee.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
