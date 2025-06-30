
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQueryClient } from '@tanstack/react-query';
import { Upload, FileText, X } from 'lucide-react';

const employeeFormSchema = z.object({
  employee_code: z.string().min(1, 'Mã nhân viên là bắt buộc'),
  full_name: z.string().min(1, 'Họ tên là bắt buộc'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().optional(),
  department_id: z.string().optional(),
  position_id: z.string().optional(),
  hire_date: z.string().optional(),
  salary: z.string().optional(),
  employee_level: z.enum(['level_1', 'level_2', 'level_3']),
  work_status: z.enum(['active', 'inactive', 'pending']),
  address: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
  notes: z.string().optional(),
  job_description: z.string().optional(),
  create_account: z.boolean().default(false),
  password: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeFormSchema>;

interface EmployeeFormProps {
  onClose: () => void;
  employeeId?: string;
}

export function EmployeeForm({ onClose, employeeId }: EmployeeFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [departments, setDepartments] = React.useState<any[]>([]);
  const [positions, setPositions] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [contractFile, setContractFile] = React.useState<File | null>(null);
  const [cvFile, setCvFile] = React.useState<File | null>(null);
  const [existingContractUrl, setExistingContractUrl] = React.useState<string>('');
  const [existingCvUrl, setExistingCvUrl] = React.useState<string>('');

  const form = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: {
      employee_level: 'level_3',
      work_status: 'active',
      create_account: false,
      job_description: '',
    },
  });

  const createAccount = form.watch('create_account');

  React.useEffect(() => {
    loadDepartmentsAndPositions();
    if (employeeId) {
      loadEmployeeData();
    }
  }, [employeeId]);

  const loadDepartmentsAndPositions = async () => {
    try {
      const [deptResponse, posResponse] = await Promise.all([
        supabase.from('departments').select('id, name').eq('status', 'active'),
        supabase.from('positions').select('id, name').eq('status', 'active')
      ]);

      if (deptResponse.data) setDepartments(deptResponse.data);
      if (posResponse.data) setPositions(posResponse.data);
    } catch (error) {
      console.error('Error loading departments and positions:', error);
    }
  };

  const loadEmployeeData = async () => {
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('id', employeeId)
        .single();

      if (error) throw error;
      if (data) {
        const validEmployeeLevel = ['level_1', 'level_2', 'level_3'].includes(data.employee_level || '') 
          ? (data.employee_level as 'level_1' | 'level_2' | 'level_3')
          : 'level_3';

        const validWorkStatus = ['active', 'inactive', 'pending'].includes(data.work_status || '') 
          ? (data.work_status as 'active' | 'inactive' | 'pending')
          : 'active';

        form.reset({
          employee_code: data.employee_code,
          full_name: data.full_name,
          email: data.email,
          phone: data.phone || '',
          department_id: data.department_id || '',
          position_id: data.position_id || '',
          hire_date: data.hire_date || '',
          salary: data.salary?.toString() || '',
          employee_level: validEmployeeLevel,
          work_status: validWorkStatus,
          address: data.address || '',
          emergency_contact_name: data.emergency_contact_name || '',
          emergency_contact_phone: data.emergency_contact_phone || '',
          notes: data.notes || '',
          job_description: data.job_description || '',
        });

        setExistingContractUrl(data.contract_file_url || '');
        setExistingCvUrl(data.cv_file_url || '');
      }
    } catch (error) {
      console.error('Error loading employee:', error);
      toast({
        title: 'Lỗi',
        description: 'Không thể tải thông tin nhân viên',
        variant: 'destructive',
      });
    }
  };

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

  const onSubmit = async (data: EmployeeFormData) => {
    setIsLoading(true);
    try {
      let authUserId = null;
      let contractUrl = existingContractUrl;
      let cvUrl = existingCvUrl;

      // Tạo tài khoản đăng nhập nếu được yêu cầu
      if (data.create_account && data.password && !employeeId) {
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: data.email,
          password: data.password,
          email_confirm: true,
          user_metadata: {
            full_name: data.full_name,
            employee_code: data.employee_code,
          }
        });

        if (authError) {
          throw new Error(`Lỗi tạo tài khoản: ${authError.message}`);
        }

        authUserId = authData.user?.id;
      }

      // Upload files if provided
      if (contractFile) {
        contractUrl = await uploadFile(contractFile, 'contract', data.employee_code);
      }
      if (cvFile) {
        cvUrl = await uploadFile(cvFile, 'cv', data.employee_code);
      }

      // Chuẩn bị dữ liệu employee
      const employeeData = {
        employee_code: data.employee_code,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone || null,
        department_id: data.department_id || null,
        position_id: data.position_id || null,
        hire_date: data.hire_date || null,
        salary: data.salary ? parseFloat(data.salary) : null,
        employee_level: data.employee_level,
        work_status: data.work_status,
        address: data.address || null,
        emergency_contact_name: data.emergency_contact_name || null,
        emergency_contact_phone: data.emergency_contact_phone || null,
        notes: data.notes || null,
        job_description: data.job_description || null,
        contract_file_url: contractUrl || null,
        cv_file_url: cvUrl || null,
        auth_user_id: authUserId,
      };

      if (employeeId) {
        const { error } = await supabase
          .from('employees')
          .update(employeeData)
          .eq('id', employeeId);
        
        if (error) throw error;
        
        toast({
          title: 'Thành công',
          description: 'Cập nhật thông tin nhân viên thành công',
        });
      } else {
        const { error } = await supabase
          .from('employees')
          .insert(employeeData);
        
        if (error) throw error;
        
        toast({
          title: 'Thành công',
          description: `Thêm nhân viên mới thành công${authUserId ? ' và tạo tài khoản đăng nhập' : ''}`,
        });
      }

      queryClient.invalidateQueries({ queryKey: ['employees'] });
      queryClient.invalidateQueries({ queryKey: ['employee-stats'] });
      onClose();
    } catch (error: any) {
      console.error('Error saving employee:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi lưu thông tin nhân viên',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="employee_code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mã nhân viên *</FormLabel>
                <FormControl>
                  <Input placeholder="EMP001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Họ và tên *</FormLabel>
                <FormControl>
                  <Input placeholder="Nguyễn Văn A" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email *</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@company.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input placeholder="0901234567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="department_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phòng ban</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn phòng ban" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id}>
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="position_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chức vụ</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn chức vụ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {positions.map((pos) => (
                      <SelectItem key={pos.id} value={pos.id}>
                        {pos.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hire_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ngày vào làm</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="salary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Lương (VNĐ)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="15000000" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="employee_level"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cấp độ nhân viên</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn cấp độ" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="level_1">Cấp 1 (Cao cấp)</SelectItem>
                    <SelectItem value="level_2">Cấp 2 (Trung cấp)</SelectItem>
                    <SelectItem value="level_3">Cấp 3 (Nhân viên)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="work_status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trạng thái làm việc</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Chọn trạng thái" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="active">Đang làm việc</SelectItem>
                    <SelectItem value="pending">Chờ duyệt</SelectItem>
                    <SelectItem value="inactive">Nghỉ việc</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Job Description */}
        <FormField
          control={form.control}
          name="job_description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả công việc</FormLabel>
              <FormControl>
                <RichTextEditor
                  value={field.value || ''}
                  onChange={field.onChange}
                  placeholder="Nhập mô tả chi tiết công việc của nhân viên..."
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* File Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Contract File */}
          <div className="space-y-2">
            <FormLabel>Hợp đồng lao động</FormLabel>
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
            <FormLabel>CV/Hồ sơ</FormLabel>
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

        {!employeeId && (
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="create_account"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Tạo tài khoản đăng nhập cho nhân viên
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Nhân viên sẽ có thể đăng nhập vào hệ thống bằng email và mật khẩu
                    </p>
                  </div>
                </FormItem>
              )}
            />
          </div>
        )}

        {createAccount && !employeeId && (
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu đăng nhập *</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Nhập mật khẩu cho nhân viên" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Địa chỉ</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập địa chỉ..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="emergency_contact_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Người liên hệ khẩn cấp</FormLabel>
                <FormControl>
                  <Input placeholder="Tên người liên hệ" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="emergency_contact_phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SĐT người liên hệ khẩn cấp</FormLabel>
                <FormControl>
                  <Input placeholder="0901234567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ghi chú</FormLabel>
              <FormControl>
                <Textarea placeholder="Nhập ghi chú..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Đang lưu...' : employeeId ? 'Cập nhật' : 'Thêm mới'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
