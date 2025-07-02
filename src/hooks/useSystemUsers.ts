import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';

export interface SystemUser {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  last_sign_in_at: string | null;
  roles: string[];
  status: 'active' | 'inactive';
}

export const useSystemUsers = () => {
  return useQuery({
    queryKey: ['system-users'],
    queryFn: async () => {
      // Lấy danh sách profiles với roles
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
      const users: SystemUser[] = profiles.map(profile => {
        const roles = userRoles
          .filter(role => role.user_id === profile.id)
          .map(role => role.role);

        return {
          id: profile.id,
          email: profile.email || '',
          full_name: profile.full_name || '',
          created_at: profile.created_at || '',
          last_sign_in_at: null, // Có thể lấy từ auth.users nếu cần
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
      // Tạo user qua Auth Admin API (cần service role)
      const { data: user, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name }
      });

      if (createError) throw createError;

      // Assign role
      if (user.user) {
        const { error: roleError } = await supabase
          .from('user_system_roles')
          .insert({
            user_id: user.user.id,
            role: role as any
          });

        if (roleError) throw roleError;
      }

      return user;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-users'] });
      toast({
        title: 'Thành công',
        description: 'Tạo tài khoản người dùng thành công'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi tạo tài khoản',
        variant: 'destructive'
      });
    }
  });
};

export const useUpdateUserStatus = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ 
      userId, 
      status 
    }: {
      userId: string;
      status: 'active' | 'inactive';
    }) => {
      // Cập nhật status (có thể disable user qua Auth Admin API)
      const { error } = await supabase.auth.admin.updateUserById(userId, {
        ban_duration: status === 'inactive' ? '876000h' : 'none' // Ban for ~100 years or unban
      });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-users'] });
      toast({
        title: 'Thành công',
        description: 'Cập nhật trạng thái người dùng thành công'
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi cập nhật trạng thái',
        variant: 'destructive'
      });
    }
  });
};