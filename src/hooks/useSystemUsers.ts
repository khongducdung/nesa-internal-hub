import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SystemUser {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  roles: string[];
  status: 'active' | 'inactive';
}

export const useSystemUsers = () => {
  return useQuery({
    queryKey: ['system-users'],
    queryFn: async () => {
      // Lấy danh sách profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          full_name,
          email,
          created_at
        `);

      if (profilesError) throw profilesError;

      // Lấy roles cho từng user
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_system_roles')
        .select('user_id, role');

      if (rolesError) throw rolesError;

      // Combine data
      const users: SystemUser[] = (profiles || []).map(profile => {
        const roles = (userRoles || [])
          .filter(role => role.user_id === profile.id)
          .map(role => role.role);

        return {
          id: profile.id,
          email: profile.email || '',
          full_name: profile.full_name || '',
          created_at: profile.created_at || '',
          roles,
          status: 'active' as const
        };
      });

      return users;
    }
  });
};

export const useCreateSystemUser = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      email, 
      password, 
      full_name, 
      role 
    }: {
      email: string;
      password: string;
      full_name: string;
      role: string;
    }) => {
      // Sử dụng database function để tạo admin user
      const { data, error } = await supabase.rpc('create_admin_user', {
        p_email: email,
        p_password: password,
        p_full_name: full_name,
        p_role: role as 'admin' | 'super_admin'
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['system-users'] });
      queryClient.invalidateQueries({ queryKey: ['system-stats'] });
      toast({
        title: 'Thành công',
        description: `Tạo tài khoản ${data?.role || 'admin'} "${data?.full_name || 'user'}" thành công`
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi tạo tài khoản',
        description: error.message || 'Có lỗi xảy ra khi tạo tài khoản',
        variant: 'destructive'
      });
    }
  });
};

export const useDeleteSystemUser = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      // Xóa roles trước
      const { error: roleError } = await supabase
        .from('user_system_roles')
        .delete()
        .eq('user_id', userId);

      if (roleError) throw roleError;

      // Xóa profile
      const { error: profileError } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (profileError) throw profileError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-users'] });
      toast({
        title: 'Thành công',
        description: 'Xóa người dùng thành công'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi xóa người dùng',
        variant: 'destructive'
      });
    }
  });
};