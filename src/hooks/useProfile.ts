import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

interface Employee {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  avatar_url?: string;
  employee_code: string;
  auth_user_id: string;
  department_id?: string;
  position_id?: string;
  hire_date?: string;
  salary?: number;
}

export function useProfile() {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateEmployeeCode = () => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `NV${year}${month}${random}`;
  };

  const fetchOrCreateEmployee = async () => {
    if (!user?.id || !profile) return;
    
    setIsLoading(true);
    try {
      // Tìm employee record hiện có
      const { data: existingEmployee, error: fetchError } = await supabase
        .from('employees')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      if (existingEmployee) {
        setEmployee(existingEmployee);
      } else if (fetchError?.code === 'PGRST116') {
        // Không tìm thấy employee record, tạo mới
        console.log('Creating new employee record for user:', user.id);
        
        const newEmployee = {
          auth_user_id: user.id,
          full_name: profile.full_name || 'Chưa cập nhật',
          email: profile.email || user.email || '',
          employee_code: generateEmployeeCode(),
        };

        const { data: createdEmployee, error: createError } = await supabase
          .from('employees')
          .insert(newEmployee)
          .select()
          .single();

        if (createError) {
          console.error('Error creating employee record:', createError);
          toast({
            title: 'Lỗi',
            description: 'Không thể tạo hồ sơ nhân viên. Vui lòng liên hệ admin.',
            variant: 'destructive',
          });
        } else {
          setEmployee(createdEmployee);
          toast({
            title: 'Thành công',
            description: 'Đã tạo hồ sơ nhân viên thành công',
          });
        }
      } else {
        console.error('Error fetching employee:', fetchError);
        toast({
          title: 'Lỗi',
          description: 'Không thể tải thông tin nhân viên',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error in fetchOrCreateEmployee:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateEmployeeData = (updates: Partial<Employee>) => {
    setEmployee(prev => prev ? { ...prev, ...updates } : null);
  };

  const updateAvatar = async (avatarUrl: string) => {
    if (!employee?.id) return false;

    try {
      const { error } = await supabase
        .from('employees')
        .update({ avatar_url: avatarUrl })
        .eq('id', employee.id);

      if (error) throw error;

      updateEmployeeData({ avatar_url: avatarUrl });
      return true;
    } catch (error) {
      console.error('Error updating avatar:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchOrCreateEmployee();
  }, [user?.id, profile?.id]);

  return {
    employee,
    isLoading,
    updateEmployeeData,
    updateAvatar,
    refetch: fetchOrCreateEmployee,
  };
}