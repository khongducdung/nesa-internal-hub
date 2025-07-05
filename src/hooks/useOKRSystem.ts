
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

// OKR Data hooks - Using mock data for now since the actual OKR tables don't exist yet
export const useCompanyOKRs = () => {
  return useQuery({
    queryKey: ['company-okrs'],
    queryFn: async () => {
      // Return mock data since OKR tables don't exist yet
      return [];
    }
  });
};

export const useDepartmentOKRs = () => {
  return useQuery({
    queryKey: ['department-okrs'],
    queryFn: async () => {
      // Return mock data since OKR tables don't exist yet
      return [];
    }
  });
};

export const useIndividualOKRs = () => {
  return useQuery({
    queryKey: ['individual-okrs'],
    queryFn: async () => {
      // Return mock data since OKR tables don't exist yet
      return [];
    }
  });
};

export const useMyOKRs = () => {
  return useQuery({
    queryKey: ['my-okrs'],
    queryFn: async () => {
      // Return mock data since OKR tables don't exist yet
      return [];
    }
  });
};

export const useCurrentOKRCycle = () => {
  return useQuery({
    queryKey: ['current-okr-cycle'],
    queryFn: async () => {
      // Return mock data since OKR tables don't exist yet
      return null;
    }
  });
};

export const useOKRDashboardStats = () => {
  return useQuery({
    queryKey: ['okr-dashboard-stats'],
    queryFn: async () => {
      // Return mock data structure that matches what the components expect
      return {
        totalOKRs: 0,
        completedOKRs: 0,
        averageProgress: 0,
        upcomingDeadlines: 0,
        cycle_progress: {
          total_days: 90,
          completed_days: 30,
          remaining_days: 60,
          progress_percentage: 33
        },
        okr_summary: {
          total: 0,
          completed: 0,
          on_track: 0,
          at_risk: 0,
          overdue: 0
        },
        key_results_summary: {
          total: 0,
          completed: 0,
          on_track: 0,
          at_risk: 0,
          not_started: 0
        },
        company_okrs: 0,
        department_okrs: 0,
        individual_okrs: 0,
        alignment_score: 0,
        recent_activities: [],
        top_performers: [],
        alerts: []
      };
    }
  });
};

// OKR Mutation hooks - Using mock implementations
export const useCreateOKR = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (okrData: any) => {
      // Mock implementation - will need real OKR tables
      console.log('Creating OKR:', okrData);
      return { id: 'mock-id', ...okrData };
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
      // Mock implementation - will need real OKR tables
      console.log('Updating OKR:', id, updateData);
      return { id, ...updateData };
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
      // Mock implementation - will need real OKR tables
      console.log('Deleting OKR:', id);
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
      // Mock implementation - will need real OKR tables
      console.log('Creating OKR Cycle:', cycleData);
      return { id: 'mock-cycle-id', ...cycleData };
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
      // Mock implementation - will need real key_results table
      console.log('Updating Key Result Progress:', keyResultId, newValue);
      return { keyResultId, newValue };
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
      // Mock implementation - will need real check-in table
      console.log('Creating OKR Check-in:', checkInData);
      return { id: 'mock-checkin-id', ...checkInData };
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
