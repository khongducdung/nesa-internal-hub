// OKR System Hooks - Main hooks for the new OKR system
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import type {
  OKRCycle,
  OKRObjective,
  KeyResult,
  OKRFilters,
  CreateOKRForm,
  OKRDashboardStats,
  OKRAnalytics,
  OKRCheckIn,
  OKRComment
} from '@/types/okr';

// ============= OKR CYCLES =============

export const useOKRCycles = () => {
  return useQuery({
    queryKey: ['okr-cycles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('okr_cycles')
        .select('*')
        .order('year', { ascending: false })
        .order('quarter', { ascending: false });
      
      if (error) throw error;
      return data as OKRCycle[];
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
        .maybeSingle();
      
      if (error) throw error;
      return data as OKRCycle | null;
    }
  });
};

export const useCreateOKRCycle = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (cycleData: {
      name: string;
      year: number;
      quarter: string;
      cycle_type: 'monthly' | 'quarterly' | 'yearly';
      start_date: string;
      end_date: string;
      status?: 'planning' | 'active' | 'review' | 'closed';
      is_current?: boolean;
      created_by?: string;
    }) => {
      const { data, error } = await supabase
        .from('okr_cycles')
        .insert(cycleData)
        .select()
        .single();
      
      if (error) throw error;
      return data as OKRCycle;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['okr-cycles'] });
      queryClient.invalidateQueries({ queryKey: ['current-okr-cycle'] });
      toast({
        title: "Thành công",
        description: "Chu kỳ OKR mới đã được tạo thành công",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tạo chu kỳ OKR mới",
      });
    }
  });
};

// ============= OKR OBJECTIVES =============

export const useOKRObjectives = (filters?: OKRFilters) => {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['okr-objectives', filters, profile?.id],
    queryFn: async () => {
      let query = supabase
        .from('okr_objectives')
        .select(`
          *,
          key_results:okr_key_results(*),
          department:departments(id, name),
          employee:employees(id, full_name, employee_code)
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.cycle_id) {
        query = query.eq('cycle_id', filters.cycle_id);
      }
      
      if (filters?.owner_type) {
        query = query.eq('owner_type', filters.owner_type);
      }
      
      if (filters?.status) {
        query = query.eq('status', filters.status);
      }
      
      if (filters?.department_id) {
        query = query.eq('department_id', filters.department_id);
      }
      
      if (filters?.employee_id) {
        query = query.eq('employee_id', filters.employee_id);
      }
      
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
      }

      // Apply RLS - users can see relevant OKRs based on their role
      if (!filters && profile) {
        query = query.or(`
          owner_type.eq.company,
          and(owner_type.eq.department,department_id.eq.${profile.department_id}),
          and(owner_type.eq.individual,employee_id.eq.${profile.employee_id})
        `);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Calculate progress and enrich data
      const enrichedData = await Promise.all(
        data.map(async (okr) => {
          // Calculate progress based on key results
          const keyResults = okr.key_results || [];
          const totalProgress = keyResults.length > 0 
            ? keyResults.reduce((sum, kr) => sum + (kr.progress * kr.weight / 100), 0)
            : okr.progress || 0;
          
          // Count child OKRs
          const { count: childCount } = await supabase
            .from('okr_objectives')
            .select('*', { count: 'exact', head: true })
            .eq('parent_okr_id', okr.id);
          
          return {
            ...okr,
            progress: Math.round(totalProgress),
            child_okrs_count: childCount || 0,
            alignment_score: okr.parent_okr_id ? Math.random() * 100 : 100, // Mock alignment score
            completion_rate: totalProgress,
            time_to_deadline: Math.ceil((new Date(okr.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
          };
        })
      );
      
      return enrichedData as any[];
    }
  });
};

export const useMyOKRs = () => {
  const { profile } = useAuth();
  
  return useOKRObjectives({
    owner_type: 'individual',
    employee_id: profile?.employee_id
  });
};

export const useCompanyOKRs = () => {
  return useOKRObjectives({
    owner_type: 'company'
  });
};

export const useDepartmentOKRs = () => {
  const { profile } = useAuth();
  
  return useOKRObjectives({
    owner_type: 'department',
    department_id: profile?.department_id
  });
};

export const useCreateOKR = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (formData: CreateOKRForm) => {
      // Get current cycle
      const { data: currentCycle } = await supabase
        .from('okr_cycles')
        .select('*')
        .eq('is_current', true)
        .maybeSingle();

      if (!currentCycle) {
        throw new Error('Không có chu kỳ OKR nào đang hoạt động');
      }

      // Prepare OKR data
      let owner_id = '';
      if (formData.owner_type === 'company') {
        owner_id = 'company';
      } else if (formData.owner_type === 'department') {
        owner_id = formData.department_id || profile?.department_id || '';
      } else if (formData.owner_type === 'individual') {
        owner_id = formData.employee_id || profile?.employee_id || '';
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
        owner_id: owner_id,
        department_id: formData.owner_type === 'department' ? (formData.department_id || profile?.department_id) : null,
        employee_id: formData.owner_type === 'individual' ? (formData.employee_id || profile?.employee_id) : null,
        parent_okr_id: formData.parent_okr_id || null,
        start_date: currentCycle.start_date,
        end_date: currentCycle.end_date,
        created_by: profile?.id || ''
      };

      // Create OKR
      const { data: okr, error: okrError } = await supabase
        .from('okr_objectives')
        .insert(okrData)
        .select()
        .single();

      if (okrError) throw okrError;

      // Create Key Results
      if (formData.key_results.length > 0) {
        const { error: krError } = await supabase
          .from('okr_key_results')
          .insert(
            formData.key_results.map(kr => ({
              okr_id: okr.id,
              title: kr.title,
              description: kr.description || '',
              target_value: kr.target_value,
              current_value: 0,
              unit: kr.unit,
              weight: kr.weight,
              progress: 0,
              status: 'not_started' as const
            }))
          );

        if (krError) throw krError;
      }

      return okr as OKRObjective;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['okr-objectives'] });
      toast({
        title: "Thành công",
        description: "OKR mới đã được tạo thành công",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tạo OKR mới",
      });
    }
  });
};

export const useUpdateOKR = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<OKRObjective> & { id: string }) => {
      const { data, error } = await supabase
        .from('okr_objectives')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as OKRObjective;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['okr-objectives'] });
      toast({
        title: "Thành công",
        description: "OKR đã được cập nhật",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể cập nhật OKR",
      });
    }
  });
};

export const useDeleteOKR = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('okr_objectives')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['okr-objectives'] });
      toast({
        title: "Thành công",
        description: "OKR đã được xóa",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể xóa OKR",
      });
    }
  });
};

// ============= KEY RESULTS =============

export const useUpdateKeyResult = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: {
      id: string;
      current_value: number;
      progress: number;
      status: 'not_started' | 'on_track' | 'at_risk' | 'completed';
      notes?: string;
    }) => {
      const { data: result, error } = await supabase
        .from('okr_key_results')
        .update({
          current_value: data.current_value,
          progress: data.progress,
          status: data.status
        })
        .eq('id', data.id)
        .select()
        .single();

      if (error) throw error;

      // Create update log if notes provided
      if (data.notes) {
        await supabase
          .from('okr_key_result_updates')
          .insert({
            key_result_id: data.id,
            previous_value: result.current_value,
            new_value: data.current_value,
            progress_change: data.progress - result.progress,
            notes: data.notes,
            updated_by: profile?.id || ''
          });
      }

      return result as KeyResult;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['okr-objectives'] });
      toast({
        title: "Thành công",
        description: "Key Result đã được cập nhật",
      });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể cập nhật Key Result",
      });
    }
  });
};

// ============= DASHBOARD STATS =============

export const useOKRDashboardStats = () => {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['okr-dashboard-stats', profile?.id],
    queryFn: async () => {
      // Get current cycle
      const { data: currentCycle } = await supabase
        .from('okr_cycles')
        .select('*')
        .eq('is_current', true)
        .maybeSingle();

      if (!currentCycle) {
        throw new Error('Không có chu kỳ OKR nào đang hoạt động');
      }

      // Calculate cycle progress
      const totalDays = Math.ceil(
        (new Date(currentCycle.end_date).getTime() - new Date(currentCycle.start_date).getTime()) / (1000 * 60 * 60 * 24)
      );
      const completedDays = Math.ceil(
        (new Date().getTime() - new Date(currentCycle.start_date).getTime()) / (1000 * 60 * 60 * 24)
      );
      const remainingDays = Math.max(0, totalDays - completedDays);
      const progressPercentage = Math.min(100, Math.max(0, (completedDays / totalDays) * 100));

      // Get OKR summary
      const { data: allOKRs } = await supabase
        .from('okr_objectives')
        .select('id, status, progress, end_date')
        .eq('cycle_id', currentCycle.id);

      const okrSummary = {
        total: allOKRs?.length || 0,
        completed: allOKRs?.filter(okr => okr.status === 'completed').length || 0,
        on_track: allOKRs?.filter(okr => okr.status === 'active' && okr.progress >= 70).length || 0,
        at_risk: allOKRs?.filter(okr => okr.status === 'active' && okr.progress < 70 && okr.progress >= 30).length || 0,
        overdue: allOKRs?.filter(okr => okr.status === 'active' && new Date(okr.end_date) < new Date()).length || 0
      };

      // Get Key Results summary
      const { data: allKRs } = await supabase
        .from('okr_key_results')
        .select('id, status, progress')
        .in('okr_id', allOKRs?.map(okr => okr.id) || []);

      const keyResultsSummary = {
        total: allKRs?.length || 0,
        completed: allKRs?.filter(kr => kr.status === 'completed').length || 0,
        on_track: allKRs?.filter(kr => kr.status === 'on_track').length || 0,
        at_risk: allKRs?.filter(kr => kr.status === 'at_risk').length || 0,
        not_started: allKRs?.filter(kr => kr.status === 'not_started').length || 0
      };

      const stats: OKRDashboardStats = {
        cycle_progress: {
          total_days: totalDays,
          completed_days: completedDays,
          remaining_days: remainingDays,
          progress_percentage: Math.round(progressPercentage)
        },
        okr_summary: okrSummary,
        key_results_summary: keyResultsSummary,
        recent_activities: [], // TODO: Implement activity feed
        top_performers: [], // TODO: Implement leaderboard
        alerts: [] // TODO: Implement alerts system
      };

      return stats;
    }
  });
};

// ============= ANALYTICS =============

export const useOKRAnalytics = (filters?: { 
  period_start?: string; 
  period_end?: string; 
  department_id?: string 
}) => {
  return useQuery({
    queryKey: ['okr-analytics', filters],
    queryFn: async () => {
      // This would be a comprehensive analytics query
      // For now, returning mock data structure
      
      const analytics: OKRAnalytics = {
        total_okrs: 0,
        active_okrs: 0,
        completed_okrs: 0,
        avg_completion_rate: 0,
        on_track_percentage: 0,
        at_risk_percentage: 0,
        overdue_percentage: 0,
        company_okrs_progress: 0,
        department_okrs_progress: 0,
        individual_okrs_progress: 0,
        check_in_frequency: 0,
        avg_key_results_per_okr: 0,
        alignment_score: 0,
        period_start: filters?.period_start || '',
        period_end: filters?.period_end || '',
        last_updated: new Date().toISOString()
      };

      return analytics;
    }
  });
};