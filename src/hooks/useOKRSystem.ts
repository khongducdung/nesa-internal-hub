
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// Settings hooks (existing)
export const useSaveRewardSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: any) => {
      const { data, error } = await supabase
        .from('system_settings')
        .upsert([
          {
            key: 'okr_reward_settings',
            value: JSON.stringify(settings),
            category: 'okr',
            description: 'Cài đặt hệ thống thưởng OKR',
            data_type: 'json',
            is_public: false
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast({
        title: 'Thành công',
        description: 'Đã lưu cài đặt hệ thống thưởng'
      });
    },
    onError: (error: any) => {
      console.error('Error saving reward settings:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể lưu cài đặt hệ thống thưởng',
        variant: 'destructive'
      });
    }
  });
};

export const useSaveAlignmentSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: any) => {
      const { data, error } = await supabase
        .from('system_settings')
        .upsert([
          {
            key: 'okr_alignment_settings',
            value: JSON.stringify(settings),
            category: 'okr',
            description: 'Cài đặt liên kết OKR',
            data_type: 'json',
            is_public: false
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast({
        title: 'Thành công',
        description: 'Đã lưu cài đặt liên kết OKR'
      });
    },
    onError: (error: any) => {
      console.error('Error saving alignment settings:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể lưu cài đặt liên kết OKR',
        variant: 'destructive'
      });
    }
  });
};

export const useSaveAchievements = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (achievements: any[]) => {
      const { data, error } = await supabase
        .from('system_settings')
        .upsert([
          {
            key: 'okr_achievements',
            value: JSON.stringify(achievements),
            category: 'okr',
            description: 'Danh sách thành tựu OKR',
            data_type: 'json',
            is_public: false
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast({
        title: 'Thành công',
        description: 'Đã lưu danh sách thành tựu'
      });
    },
    onError: (error: any) => {
      console.error('Error saving achievements:', error);
      toast({
        title: 'Lỗi',  
        description: error.message || 'Không thể lưu danh sách thành tựu',
        variant: 'destructive'
      });
    }
  });
};

export const useSaveNotificationSettings = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: any) => {
      const { data, error } = await supabase
        .from('system_settings')
        .upsert([
          {
            key: 'okr_notification_settings',
            value: JSON.stringify(settings),
            category: 'okr',
            description: 'Cài đặt thông báo OKR',
            data_type: 'json',
            is_public: false
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['system-settings'] });
      toast({
        title: 'Thành công',
        description: 'Đã lưu cài đặt thông báo'
      });
    },
    onError: (error: any) => {
      console.error('Error saving notification settings:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể lưu cài đặt thông báo',
        variant: 'destructive'
      });
    }
  });
};

// OKR Data hooks
export const useCompanyOKRs = () => {
  return useQuery({
    queryKey: ['company-okrs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('okrs')
        .select(`
          *,
          key_results (*),
          department:departments (*),
          employee:employees (*)
        `)
        .eq('owner_type', 'company')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });
};

export const useDepartmentOKRs = () => {
  return useQuery({
    queryKey: ['department-okrs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('okrs')
        .select(`
          *,
          key_results (*),
          department:departments (*),
          employee:employees (*)
        `)
        .eq('owner_type', 'department')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });
};

export const useIndividualOKRs = () => {
  return useQuery({
    queryKey: ['individual-okrs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('okrs')
        .select(`
          *,
          key_results (*),
          department:departments (*),
          employee:employees (*)
        `)
        .eq('owner_type', 'individual')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });
};

export const useMyOKRs = () => {
  return useQuery({
    queryKey: ['my-okrs'],
    queryFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) return [];

      const { data, error } = await supabase
        .from('okrs')
        .select(`
          *,
          key_results (*),
          department:departments (*),
          employee:employees (*)
        `)
        .eq('owner_type', 'individual')
        .eq('employee_id', userData.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });
};

export const useCurrentOKRCycle = () => {
  return useQuery({
    queryKey: ['current-okr-cycle'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('okr_cycles')
        .select('*')
        .eq('is_current', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    }
  });
};

export const useOKRDashboardStats = () => {
  return useQuery({
    queryKey: ['okr-dashboard-stats'],
    queryFn: async () => {
      // This would normally aggregate data from multiple tables
      // For now, return mock data structure
      return {
        totalOKRs: 0,
        completedOKRs: 0,
        averageProgress: 0,
        upcomingDeadlines: 0
      };
    }
  });
};

// OKR Mutation hooks
export const useCreateOKR = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (okrData: any) => {
      const { data, error } = await supabase
        .from('okrs')
        .insert([okrData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['department-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['individual-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['my-okrs'] });
      toast({
        title: 'Thành công',
        description: 'Đã tạo OKR mới'
      });
    },
    onError: (error: any) => {
      console.error('Error creating OKR:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tạo OKR',
        variant: 'destructive'
      });
    }
  });
};

export const useUpdateOKR = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updateData }: any) => {
      const { data, error } = await supabase
        .from('okrs')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['department-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['individual-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['my-okrs'] });
      toast({
        title: 'Thành công',
        description: 'Đã cập nhật OKR'
      });
    },
    onError: (error: any) => {
      console.error('Error updating OKR:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể cập nhật OKR',
        variant: 'destructive'
      });
    }
  });
};

export const useDeleteOKR = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('okrs')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['department-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['individual-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['my-okrs'] });
      toast({
        title: 'Thành công',
        description: 'Đã xóa OKR'
      });
    },
    onError: (error: any) => {
      console.error('Error deleting OKR:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể xóa OKR',
        variant: 'destructive'
      });
    }
  });
};

export const useCreateOKRCycle = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cycleData: any) => {
      const { data, error } = await supabase
        .from('okr_cycles')
        .insert([cycleData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['current-okr-cycle'] });
      toast({
        title: 'Thành công',
        description: 'Đã tạo chu kỳ OKR mới'
      });
    },
    onError: (error: any) => {
      console.error('Error creating OKR cycle:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tạo chu kỳ OKR',
        variant: 'destructive'
      });
    }
  });
};

export const useUpdateKeyResultProgress = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ keyResultId, newValue }: { keyResultId: string; newValue: number }) => {
      const { data, error } = await supabase
        .from('key_results')
        .update({ current_value: newValue })
        .eq('id', keyResultId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['department-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['individual-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['my-okrs'] });
    },
    onError: (error: any) => {
      console.error('Error updating key result progress:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể cập nhật tiến độ',
        variant: 'destructive'
      });
    }
  });
};

export const useCreateOKRCheckIn = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (checkInData: any) => {
      const { data, error } = await supabase
        .from('okr_check_ins')
        .insert([checkInData])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['department-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['individual-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['my-okrs'] });
    },
    onError: (error: any) => {
      console.error('Error creating OKR check-in:', error);
      toast({
        title: 'Lỗi',
        description: error.message || 'Không thể tạo check-in',
        variant: 'destructive'
      });
    }
  });
};
