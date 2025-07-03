// OKR System Hooks - Complete implementation for OKR management
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { 
  OKRObjective, 
  OKRCycle, 
  OKRDashboardStats, 
  CreateOKRForm,
  KeyResult,
  OKRLeaderboard 
} from '@/types/okr';

// OKR Cycles hooks
export function useOKRCycles() {
  return useQuery({
    queryKey: ['okr-cycles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('okr_cycles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });
}

export function useCurrentOKRCycle() {
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
}

export function useCreateOKRCycle() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (cycleData: {
      name: string;
      year: number;
      quarter?: string;
      cycle_type: string;
      start_date: string;
      end_date: string;
      status?: string;
      is_current?: boolean;
    }) => {
      // Set current cycle to false for all existing cycles
      await supabase
        .from('okr_cycles')
        .update({ is_current: false })
        .neq('id', '00000000-0000-0000-0000-000000000000');

      const { data, error } = await supabase
        .from('okr_cycles')
        .insert({
          name: cycleData.name,
          year: cycleData.year,
          quarter: cycleData.quarter,
          cycle_type: cycleData.cycle_type,
          start_date: cycleData.start_date,
          end_date: cycleData.end_date,
          status: (cycleData.status as any) || 'active',
          is_current: cycleData.is_current ?? true,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['okr-cycles'] });
      queryClient.invalidateQueries({ queryKey: ['current-okr-cycle'] });
    }
  });
}

// OKR CRUD hooks
export function useCreateOKR() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData: CreateOKRForm) => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data: currentCycle } = await supabase
        .from('okr_cycles')
        .select('*')
        .eq('is_current', true)
        .single();

      if (!currentCycle) {
        throw new Error('Không có chu kỳ OKR nào đang hoạt động');
      }

      // Prepare OKR data
      let owner_id = '';
      if (formData.owner_type === 'company') {
        owner_id = 'company';
      } else if (formData.owner_type === 'department') {
        owner_id = formData.department_id || '';
      } else if (formData.owner_type === 'individual') {
        // Get employee_id from employees table
        const { data: employee } = await supabase
          .from('employees')
          .select('id')
          .eq('auth_user_id', user.user.id)
          .single();
        
        owner_id = formData.employee_id || employee?.id || '';
      }

      const okrData = {
        title: formData.title,
        description: formData.description,
        cycle_id: currentCycle.id,
        year: currentCycle.year,
        quarter: currentCycle.quarter || 'Q4',
        progress: 0,
        status: 'active' as const,
        owner_type: formData.owner_type,
        owner_id,
        department_id: formData.department_id || null,
        employee_id: formData.employee_id || null,
        parent_okr_id: formData.parent_okr_id || null,
        created_by: user.user.id,
        start_date: currentCycle.start_date,
        end_date: currentCycle.end_date
      };

      const { data: okr, error: okrError } = await supabase
        .from('okr_objectives')
        .insert(okrData)
        .select()
        .single();

      if (okrError) throw okrError;

      // Create key results
      if (formData.key_results && formData.key_results.length > 0) {
        const keyResultsData = formData.key_results.map(kr => ({
          okr_id: okr.id,
          title: kr.title,
          description: kr.description || '',
          target_value: kr.target_value,
          current_value: 0,
          unit: kr.unit,
          weight: kr.weight,
          progress: 0,
          status: 'not_started' as const,
          due_date: kr.due_date || null
        }));

        const { error: krError } = await supabase
          .from('okr_key_results')
          .insert(keyResultsData);

        if (krError) throw krError;
      }

      return okr;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['department-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['individual-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['my-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['okr-dashboard-stats'] });
    }
  });
}

export function useUpdateOKR() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (params: { id: string; title?: string; description?: string; status?: any; updates?: Partial<OKRObjective> }) => {
      const { id, updates, ...directUpdates } = params;
      const updateData = updates ? updates : directUpdates;
      
      const { data, error } = await supabase
        .from('okr_objectives')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
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
      queryClient.invalidateQueries({ queryKey: ['okr-dashboard-stats'] });
    }
  });
}

export function useDeleteOKR() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('okr_objectives')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['department-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['individual-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['my-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['okr-dashboard-stats'] });
    }
  });
}

// OKR listing hooks
export function useCompanyOKRs() {
  return useQuery({
    queryKey: ['company-okrs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('okr_objectives')
        .select(`
          *,
          key_results:okr_key_results(*),
          department:departments(id, name),
          employee:employees(id, full_name, employee_code)
        `)
        .eq('owner_type', 'company')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });
}

export function useDepartmentOKRs() {
  return useQuery({
    queryKey: ['department-okrs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('okr_objectives')
        .select(`
          *,
          key_results:okr_key_results(*),
          department:departments(id, name),
          employee:employees(id, full_name, employee_code)
        `)
        .eq('owner_type', 'department')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });
}

export function useIndividualOKRs() {
  return useQuery({
    queryKey: ['individual-okrs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('okr_objectives')
        .select(`
          *,
          key_results:okr_key_results(*),
          department:departments(id, name),
          employee:employees(id, full_name, employee_code)
        `)
        .eq('owner_type', 'individual')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });
}

export function useMyOKRs() {
  return useQuery({
    queryKey: ['my-okrs'],
    queryFn: async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data: employee } = await supabase
        .from('employees')
        .select('id')
        .eq('auth_user_id', user.user.id)
        .single();

      if (!employee) return [];

      const { data, error } = await supabase
        .from('okr_objectives')
        .select(`
          *,
          key_results:okr_key_results(*),
          employee:employees(id, full_name, employee_code),
          department:departments(id, name)
        `)
        .eq('owner_type', 'individual')
        .eq('employee_id', employee.id)
        .order('created_at', { ascending: false });

      if (error) return [];
      
      return (data || []).map(okr => ({
        ...okr,
        time_to_deadline: Math.ceil((new Date(okr.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      }));
    }
  });
}

// Dashboard stats
export function useOKRDashboardStats() {
  return useQuery({
    queryKey: ['okr-dashboard-stats'],
    queryFn: async (): Promise<OKRDashboardStats> => {
      const { data: currentCycle } = await supabase
        .from('okr_cycles')
        .select('*')
        .eq('is_current', true)
        .single();

      if (!currentCycle) {
        return {
          cycle_progress: {
            total_days: 0,
            completed_days: 0,
            remaining_days: 0,
            progress_percentage: 0
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

      // Calculate cycle progress
      const startDate = new Date(currentCycle.start_date);
      const endDate = new Date(currentCycle.end_date);
      const currentDate = new Date();
      
      const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const completedDays = Math.max(0, Math.ceil((currentDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
      const remainingDays = Math.max(0, totalDays - completedDays);
      const progressPercentage = Math.min(100, Math.max(0, (completedDays / totalDays) * 100));

      // Get OKR statistics
      const { data: allOKRs } = await supabase
        .from('okr_objectives')
        .select('*, key_results:okr_key_results(*)')
        .eq('cycle_id', currentCycle.id);

      const okrs = allOKRs || [];
      const companyOKRs = okrs.filter(okr => okr.owner_type === 'company').length;
      const departmentOKRs = okrs.filter(okr => okr.owner_type === 'department').length;
      const individualOKRs = okrs.filter(okr => okr.owner_type === 'individual').length;

      const okrSummary = {
        total: okrs.length,
        completed: okrs.filter(okr => okr.status === 'completed').length,
        on_track: okrs.filter(okr => okr.progress >= 70 && okr.status !== 'completed').length,
        at_risk: okrs.filter(okr => okr.progress < 70 && okr.progress >= 30).length,
        overdue: okrs.filter(okr => okr.progress < 30 && new Date(okr.end_date) < currentDate).length
      };

      const allKeyResults = okrs.flatMap(okr => okr.key_results || []);
      const keyResultsSummary = {
        total: allKeyResults.length,
        completed: allKeyResults.filter(kr => kr.status === 'completed').length,
        on_track: allKeyResults.filter(kr => kr.status === 'on_track').length,
        at_risk: allKeyResults.filter(kr => kr.status === 'at_risk').length,
        not_started: allKeyResults.filter(kr => kr.status === 'not_started').length
      };

      // Calculate alignment score
      const alignedOKRs = okrs.filter(okr => okr.parent_okr_id).length;
      const alignmentScore = okrs.length > 0 ? Math.round((alignedOKRs / okrs.length) * 100) : 0;

      return {
        cycle_progress: {
          total_days: totalDays,
          completed_days: completedDays,
          remaining_days: remainingDays,
          progress_percentage: Math.round(progressPercentage)
        },
        okr_summary: okrSummary,
        key_results_summary: keyResultsSummary,
        company_okrs: companyOKRs,
        department_okrs: departmentOKRs,
        individual_okrs: individualOKRs,
        alignment_score: alignmentScore,
        recent_activities: [],
        top_performers: [],
        alerts: []
      };
    }
  });
}

// Leaderboard
export function useOKRLeaderboard() {
  return useQuery({
    queryKey: ['okr-leaderboard'],
    queryFn: async (): Promise<OKRLeaderboard> => {
      const leaderboard: OKRLeaderboard = {
        individual: [],
        department: []
      };
      
      return leaderboard;
    }
  });
}

// Key Result Progress
export function useUpdateKeyResultProgress() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      keyResultId, 
      newValue 
    }: { 
      keyResultId: string; 
      newValue: number; 
    }) => {
      const { data: keyResult } = await supabase
        .from('okr_key_results')
        .select('*')
        .eq('id', keyResultId)
        .single();

      if (!keyResult) throw new Error('Key Result not found');

      const progress = Math.min(100, Math.max(0, (newValue / keyResult.target_value) * 100));
      
      const { data, error } = await supabase
        .from('okr_key_results')
        .update({
          current_value: newValue,
          progress,
          updated_at: new Date().toISOString()
        })
        .eq('id', keyResultId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['company-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['department-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['individual-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['okr-dashboard-stats'] });
    }
  });
}

// OKR Check-in
export function useCreateOKRCheckIn() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (checkIn: {
      okr_id?: string;
      key_result_id?: string;
      check_in_type: 'weekly' | 'monthly' | 'quarterly';
      confidence_level: number;
      status_update: string;
      challenges?: string;
      support_needed?: string;
      next_actions?: string;
      mood_indicator: 'confident' | 'concerned' | 'at_risk';
    }) => {
      const { data, error } = await (supabase as any)
        .from('okr_check_ins')
        .insert({
          ...checkIn,
          created_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['okr-dashboard-stats'] });
    }
  });
}

// Reward System Management
export function useSaveRewardSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: any) => {
      const { data, error } = await supabase
        .from('okr_system_settings')
        .upsert({
          setting_type: 'rewards',
          settings: settings,
          updated_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['okr-system-settings'] });
    }
  });
}

// Alignment Settings Management
export function useSaveAlignmentSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (settings: any) => {
      const { data, error } = await supabase
        .from('okr_system_settings')
        .upsert({
          setting_type: 'alignment',
          settings: settings,
          updated_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['okr-system-settings'] });
    }
  });
}

// Achievement Management
export function useSaveAchievements() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (achievements: any[]) => {
      const promises = achievements.map(achievement => 
        supabase
          .from('okr_achievements')
          .upsert({
            ...achievement,
            icon: typeof achievement.icon === 'string' ? achievement.icon : '🏆'
          })
      );
      
      const results = await Promise.all(promises);
      const error = results.find(result => result.error);
      if (error?.error) throw error.error;
      
      return results.map(result => result.data).flat();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['okr-achievements'] });
    }
  });
}

// Notification Settings Management
export function useSaveNotificationSettings() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (notificationSettings: any) => {
      const { data, error } = await supabase
        .from('okr_system_settings')
        .upsert({
          setting_type: 'notifications',
          settings: notificationSettings,
          updated_by: (await supabase.auth.getUser()).data.user?.id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['okr-system-settings'] });
    }
  });
}