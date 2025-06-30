
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { User, Camera, Lock } from 'lucide-react';

const profileFormSchema = z.object({
  full_name: z.string().min(1, 'Họ tên là bắt buộc'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().optional(),
  address: z.string().optional(),
  emergency_contact_name: z.string().optional(),
  emergency_contact_phone: z.string().optional(),
});

const passwordFormSchema = z.object({
  current_password: z.string().min(1, 'Mật khẩu hiện tại là bắt buộc'),
  new_password: z.string().min(6, 'Mật khẩu mới phải có ít nhất 6 ký tự'),
  confirm_password: z.string().min(1, 'Xác nhận mật khẩu là bắt buộc'),
}).refine((data) => data.new_password === data.confirm_password, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirm_password"],
});

type ProfileFormData = z.infer<typeof profileFormSchema>;
type PasswordFormData = z.infer<typeof passwordFormSchema>;

export function ProfileSettings() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);
  const [employee, setEmployee] = React.useState<any>(null);

  const profileForm = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      full_name: profile?.full_name || '',
      email: profile?.email || '',
      phone: '',
      address: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
    },
  });

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordFormSchema),
  });

  React.useEffect(() => {
    const fetchEmployeeData = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('employees')
          .select('*')
          .eq('auth_user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching employee data:', error);
          return;
        }

        if (data) {
          setEmployee(data);
          profileForm.reset({
            full_name: data.full_name || '',
            email: data.email || '',
            phone: data.phone || '',
            address: data.address || '',
            emergency_contact_name: data.emergency_contact_name || '',
            emergency_contact_phone: data.emergency_contact_phone || '',
          });
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchEmployeeData();
  }, [user?.id, profileForm]);

  const onUpdateProfile = async (data: ProfileFormData) => {
    if (!user?.id || !employee?.id) return;
    
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('employees')
        .update({
          full_name: data.full_name,
          phone: data.phone || null,
          address: data.address || null,
          emergency_contact_name: data.emergency_contact_name || null,
          emergency_contact_phone: data.emergency_contact_phone || null,
        })
        .eq('id', employee.id);

      if (error) throw error;

      toast({
        title: 'Thành công',
        description: 'Cập nhật thông tin cá nhân thành công',
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi cập nhật thông tin',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onChangePassword = async (data: PasswordFormData) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.new_password
      });

      if (error) throw error;

      toast({
        title: 'Thành công',
        description: 'Đổi mật khẩu thành công',
      });
      
      passwordForm.reset();
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi đổi mật khẩu',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatSalary = (salary: number) => {
    return new Intl.NumberFormat('vi-VN').format(salary);
  };

  return (
    <div className="space-y-6">
      {/* Profile Info Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Thông tin cá nhân
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={employee?.avatar_url} />
              <AvatarFallback className="bg-brand-primary text-white text-lg">
                {profile?.full_name?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold">{profile?.full_name}</h3>
              <p className="text-sm text-muted-foreground">Mã NV: {employee?.employee_code}</p>
              {employee?.hire_date && (
                <p className="text-sm text-muted-foreground">
                  Ngày vào làm: {formatDate(employee.hire_date)}
                </p>
              )}
              {employee?.salary && (
                <p className="text-sm text-muted-foreground">
                  Lương: {formatSalary(employee.salary)} VNĐ
                </p>
              )}
            </div>
          </div>

          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={profileForm.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Họ và tên *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} disabled />
                      </FormControl>
                      <p className="text-xs text-muted-foreground">Email không thể thay đổi</p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
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
                  control={profileForm.control}
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
                control={profileForm.control}
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

              <FormField
                control={profileForm.control}
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

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading} className="bg-brand-primary hover:bg-brand-primary/90">
                  {isLoading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Đổi mật khẩu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
              <FormField
                control={passwordForm.control}
                name="current_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu hiện tại *</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={passwordForm.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mật khẩu mới *</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={passwordForm.control}
                  name="confirm_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Xác nhận mật khẩu mới *</FormLabel>
                      <FormControl>
                        <Input type="password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isLoading} className="bg-brand-primary hover:bg-brand-primary/90">
                  {isLoading ? 'Đang đổi...' : 'Đổi mật khẩu'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
