import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AvatarUpload } from './AvatarUpload';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { User, Lock, Save } from 'lucide-react';

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
  const { employee, isLoading: profileLoading, updateEmployeeData, updateAvatar } = useProfile();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

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
    if (employee) {
      profileForm.reset({
        full_name: employee.full_name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        address: employee.address || '',
        emergency_contact_name: employee.emergency_contact_name || '',
        emergency_contact_phone: employee.emergency_contact_phone || '',
      });
    }
  }, [employee, profileForm]);

  const handleAvatarUpdated = async (url: string) => {
    const success = await updateAvatar(url);
    if (success) {
      toast({
        title: 'Thành công',
        description: 'Cập nhật ảnh đại diện thành công',
      });
    }
  };

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

      updateEmployeeData({
        full_name: data.full_name,
        phone: data.phone || undefined,
        address: data.address || undefined,
        emergency_contact_name: data.emergency_contact_name || undefined,
        emergency_contact_phone: data.emergency_contact_phone || undefined,
      });

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
      // Verify current password first
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: data.current_password
      });

      if (signInError) {
        throw new Error('Mật khẩu hiện tại không đúng');
      }

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

  if (profileLoading) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 p-6">
        <div className="animate-pulse">
          <div className="h-32 bg-gray-200 rounded-lg mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      {/* Profile Header Card */}
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="p-8">
          <div className="flex items-center space-x-6">
            <AvatarUpload
              employeeId={employee?.id}
              currentAvatarUrl={employee?.avatar_url}
              fullName={profile?.full_name}
              onAvatarUpdated={handleAvatarUpdated}
            />
            <div className="flex-1 space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">{profile?.full_name}</h1>
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="bg-white px-3 py-1 rounded-full shadow-sm">
                  Mã NV: {employee?.employee_code}
                </span>
                {employee?.hire_date && (
                  <span className="bg-white px-3 py-1 rounded-full shadow-sm">
                    Ngày vào làm: {formatDate(employee.hire_date)}
                  </span>
                )}
                {employee?.salary && (
                  <span className="bg-white px-3 py-1 rounded-full shadow-sm">
                    Lương: {formatSalary(employee.salary)} VNĐ
                  </span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile Information Card */}
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-blue-100 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            Thông tin cá nhân
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...profileForm}>
            <form onSubmit={profileForm.handleSubmit(onUpdateProfile)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={profileForm.control}
                  name="full_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Họ và tên *</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
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
                      <FormLabel className="text-sm font-medium text-gray-700">Email</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          disabled 
                          className="h-11 bg-gray-50 border-gray-200"
                        />
                      </FormControl>
                      <p className="text-xs text-gray-500">Email không thể thay đổi</p>
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Số điện thoại</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="0901234567" 
                          {...field} 
                          className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
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
                      <FormLabel className="text-sm font-medium text-gray-700">SĐT người liên hệ khẩn cấp</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="0901234567" 
                          {...field} 
                          className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
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
                    <FormLabel className="text-sm font-medium text-gray-700">Địa chỉ</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Nhập địa chỉ..." 
                        {...field} 
                        className="min-h-[100px] border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
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
                    <FormLabel className="text-sm font-medium text-gray-700">Người liên hệ khẩn cấp</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Tên người liên hệ" 
                        {...field} 
                        className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isLoading ? 'Đang cập nhật...' : 'Lưu thông tin'}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Change Password Card */}
      <Card className="shadow-lg border-0">
        <CardHeader className="pb-6">
          <CardTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 bg-red-100 rounded-lg">
              <Lock className="h-5 w-5 text-red-600" />
            </div>
            Đổi mật khẩu
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...passwordForm}>
            <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-6">
              <FormField
                control={passwordForm.control}
                name="current_password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">Mật khẩu hiện tại *</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        {...field} 
                        className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={passwordForm.control}
                  name="new_password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">Mật khẩu mới *</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          {...field} 
                          className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
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
                      <FormLabel className="text-sm font-medium text-gray-700">Xác nhận mật khẩu mới *</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          {...field} 
                          className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button 
                  type="submit" 
                  disabled={isLoading} 
                  className="px-8 py-3 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg"
                >
                  <Lock className="h-4 w-4 mr-2" />
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
