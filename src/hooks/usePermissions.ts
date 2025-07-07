import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ModuleCategory {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface Permission {
  id: string;
  name: string;
  description?: string;
  module: string;
  action: string;
  category_id?: string;
  is_core_feature: boolean;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface UserPermission {
  id: string;
  user_id: string;
  permission_id: string;
  granted_by?: string;
  granted_at: string;
  revoked_at?: string;
  is_active: boolean;
  notes?: string;
  permission?: Permission;
  granted_by_user?: {
    id: string;
    full_name: string;
  };
}

export interface UserPermissionSummary {
  permission_id: string;
  permission_name: string;
  module: string;
  action: string;
  source: 'role' | 'user';
}

export const useModuleCategories = () => {
  return useQuery({
    queryKey: ['module-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('module_categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as ModuleCategory[];
    },
  });
};

export const usePermissions = () => {
  return useQuery({
    queryKey: ['permissions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('permissions')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (error) throw error;
      return data as Permission[];
    },
  });
};

export const useUserPermissions = (userId?: string) => {
  return useQuery({
    queryKey: ['user-permissions', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase
        .from('user_permissions')
        .select(`
          *,
          permission:permissions(*),
          granted_by_user:profiles(id, full_name)
        `)
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('granted_at', { ascending: false });

      if (error) throw error;
      return data as any[];
    },
    enabled: !!userId,
  });
};

export const useUserPermissionSummary = (userId?: string) => {
  return useQuery({
    queryKey: ['user-permission-summary', userId],
    queryFn: async () => {
      if (!userId) return [];

      const { data, error } = await supabase.rpc('get_user_permissions', {
        _user_id: userId
      });

      if (error) throw error;
      return data as UserPermissionSummary[];
    },
    enabled: !!userId,
  });
};

export const useGrantUserPermission = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      permissionId,
      notes
    }: {
      userId: string;
      permissionId: string;
      notes?: string;
    }) => {
      const { data, error } = await supabase
        .from('user_permissions')
        .insert({
          user_id: userId,
          permission_id: permissionId,
          notes: notes || null,
          granted_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['user-permission-summary', variables.userId] });
      toast({
        title: 'Thành công',
        description: 'Đã cấp quyền cho người dùng',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi cấp quyền',
        variant: 'destructive',
      });
    },
  });
};

export const useRevokeUserPermission = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      permissionId
    }: {
      userId: string;
      permissionId: string;
    }) => {
      const { error } = await supabase
        .from('user_permissions')
        .update({
          is_active: false,
          revoked_at: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('permission_id', permissionId);

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['user-permissions', variables.userId] });
      queryClient.invalidateQueries({ queryKey: ['user-permission-summary', variables.userId] });
      toast({
        title: 'Thành công',
        description: 'Đã thu hồi quyền của người dùng',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi thu hồi quyền',
        variant: 'destructive',
      });
    },
  });
};