
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { VietnameseDatePicker } from '@/components/ui/vietnamese-date-picker';
import { Upload, FileText, X } from 'lucide-react';
import { useEmployees } from '@/hooks/useEmployees';
import { useUpdateEmployee, useCreateEmployeeAccount } from '@/hooks/useEmployeeMutations';
import { useDepartments } from '@/hooks/useDepartments';
import { usePositions } from '@/hooks/usePositions';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { formatSalaryInput, parseSalaryValue } from '@/utils/formatters';

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
  const createEmployeeAccount = useCreateEmployeeAccount();
  const { toast } = useToast();
  
  const employee = employees?.find(emp => emp.id === employeeId);
  
  const [formData, setFormData] = useState({
    employee_code: '',
    full_name: '',
    email: '',
    phone: '',
    department_id: '',
    position_id: '',
    hire_date: null as Date | null,
    salary: '',
    employee_level: 'level_3' as 'level_1' | 'level_2' | 'level_3',
    work_status: 'active' as 'active' | 'inactive' | 'pending',
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
  const [createAccount, setCreateAccount] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (employee) {
      setFormData({
        employee_code: employee.employee_code || '',
        full_name: employee.full_name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        department_id: employee.department_id || '',
        position_id: employee.position_id || '',
        hire_date: employee.hire_date ? new Date(employee.hire_date) : null,
        salary: employee.salary ? formatSalaryInput(employee.salary.toString()) : '',
        employee_level: employee.employee_level || 'level_3',
        work_status: employee.work_status || 'active',
        address: employee.address || '',
        emergency_contact_name: employee.emergency_contact_name || '',
        emergency_contact_phone: employee.emergency_contact_phone || '',
        notes: employee.notes || '',
        job_description: employee.job_description || '',
      });
      
      setExistingContractUrl(employee.contract_file_url || '');
      setExistingCvUrl(employee.cv_file_url || '');
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
        hire_date: formData.hire_date ? formData.hire_date.toISOString().split('T')[0] : undefined,
        salary: formData.salary ? parseSalaryValue(formData.salary) : undefined,
        contract_file_url: contractUrl || undefined,
        cv_file_url: cvUrl || undefined,
      };

      await updateEmployee.mutateAsync({ id: employeeId, data: updateData });

      // Create account if requested and employee doesn't have one
      if (createAccount && password && !employee?.auth_user_id) {
        await createEmployeeAccount.mutateAsync({
          employeeId,
          email: formData.email,
          password,
          fullName: formData.full_name,
        });
      }

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employee_code">Mã nhân viên *</Label>
              <Input
                id="employee_code"
                value={formData.employee_code}
                onChange={(e) => setFormData({...formData, employee_code: e.target.value})}
                required
              />
            </div>

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
              <Label htmlFor="position">Chức vụ</Label>
              <Select 
                value={formData.position_id} 
                onValueChange={(value) => setFormData({...formData, position_id: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chức vụ" />
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
              <Label>Ngày vào làm</Label>
              <VietnameseDatePicker
                date={formData.hire_date || undefined}
                onDateChange={(date) => setFormData({...formData, hire_date: date || null})}
                placeholder="Chọn ngày"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="salary">Lương (VNĐ)</Label>
              <Input
                id="salary"
                placeholder="15,000,000"
                value={formData.salary}
                onChange={(e) => {
                  const formatted = formatSalaryInput(e.target.value);
                  setFormData({...formData, salary: formatted});
                }}
              />
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
                  <SelectItem value="level_1">Cấp 1 (Cao cấp)</SelectItem>
                  <SelectItem value="level_2">Cấp 2 (Trung cấp)</SelectItem>
                  <SelectItem value="level_3">Cấp 3 (Nhân viên)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="work_status">Trạng thái làm việc</Label>
              <Select 
                value={formData.work_status} 
                onValueChange={(value: 'active' | 'inactive' | 'pending') => setFormData({...formData, work_status: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang làm việc</SelectItem>
                  <SelectItem value="pending">Chờ duyệt</SelectItem>
                  <SelectItem value="inactive">Nghỉ việc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Địa chỉ</Label>
            <Textarea
              id="address"
              placeholder="Nhập địa chỉ..."
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
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="emergency_contact_name">Người liên hệ khẩn cấp</Label>
              <Input
                id="emergency_contact_name"
                placeholder="Tên người liên hệ"
                value={formData.emergency_contact_name}
                onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="emergency_contact_phone">SĐT người liên hệ khẩn cấp</Label>
              <Input
                id="emergency_contact_phone"
                placeholder="0901234567"
                value={formData.emergency_contact_phone}
                onChange={(e) => setFormData({...formData, emergency_contact_phone: e.target.value})}
              />
            </div>
          </div>

          {/* Account Creation Section */}
          {!employee?.auth_user_id && (
            <div className="space-y-4 p-4 border rounded-lg bg-muted/30">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="create_account"
                  checked={createAccount}
                  onCheckedChange={setCreateAccount}
                />
                <Label htmlFor="create_account">
                  Tạo tài khoản đăng nhập cho nhân viên
                </Label>
              </div>
              
              {createAccount && (
                <div className="space-y-2">
                  <Label htmlFor="password">Mật khẩu *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Nhập mật khẩu cho nhân viên"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required={createAccount}
                  />
                </div>
              )}
            </div>
          )}
          
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
            <Button type="submit" disabled={updateEmployee.isPending || createEmployeeAccount.isPending}>
              {updateEmployee.isPending || createEmployeeAccount.isPending ? 'Đang lưu...' : 'Lưu thay đổi'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
