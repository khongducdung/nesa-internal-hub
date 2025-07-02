import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface OKRObjective {
  id: string;
  title: string;
  description: string;
  cycle_id: string;
  year: number;
  quarter: string;
  progress: number;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  owner_type: 'company' | 'department' | 'individual';
  department_id?: string;
  employee_id?: string;
  created_by: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  key_results?: KeyResult[];
}

export interface KeyResult {
  id: string;
  okr_id: string;
  title: string;
  description?: string;
  target_value: number;
  current_value: number;
  unit: string;
  weight: number;
  progress: number;
  status: 'not_started' | 'on_track' | 'at_risk' | 'completed';
  created_at: string;
  updated_at: string;
}

export interface OKRCycle {
  id: string;
  name: string;
  year: number;
  quarter?: string;
  cycle_type: 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date: string;
  status: 'planning' | 'active' | 'review' | 'closed';
  is_current: boolean;
  created_at: string;
  updated_at: string;
}

// Get OKR Cycles
export const useOKRCycles = () => {
  return useQuery({
    queryKey: ['okr-cycles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('okr_cycles')
        .select('*')
        .order('year', { ascending: false });
      
      if (error) throw error;
      return data as OKRCycle[];
    }
  });
};

// Get Current OKR Cycle
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
      return data as OKRCycle | null;
    }
  });
};

// Get Company OKRs
export const useCompanyOKRs = () => {
  return useQuery({
    queryKey: ['company-okrs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('okr_objectives')
        .select(`
          *,
          key_results:okr_key_results(*)
        `)
        .eq('owner_type', 'company')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as OKRObjective[];
    }
  });
};

// Get Department OKRs
export const useDepartmentOKRs = () => {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['department-okrs', profile?.department_id],
    queryFn: async () => {
      if (!profile?.department_id) return [];
      
      const { data, error } = await supabase
        .from('okr_objectives')
        .select(`
          *,
          key_results:okr_key_results(*)
        `)
        .eq('owner_type', 'department')
        .eq('department_id', profile.department_id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as OKRObjective[];
    },
    enabled: !!profile?.department_id
  });
};

// Get My OKRs
export const useMyOKRs = () => {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['my-okrs', profile?.employee_id],
    queryFn: async () => {
      if (!profile?.employee_id) return [];
      
      const { data, error } = await supabase
        .from('okr_objectives')
        .select(`
          *,
          key_results:okr_key_results(*)
        `)
        .eq('owner_type', 'individual')
        .eq('employee_id', profile.employee_id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as OKRObjective[];
    },
    enabled: !!profile?.employee_id
  });
};

// Create OKR
export const useCreateOKR = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      owner_type: 'company' | 'department' | 'individual';
      department_id?: string;
      employee_id?: string;
      key_results: Array<{
        title: string;
        description?: string;
        target_value: number;
        unit: string;
        weight: number;
      }>;
    }) => {
      // Get current cycle
      const { data: currentCycle } = await supabase
        .from('okr_cycles')
        .select('*')
        .eq('is_current', true)
        .single();

      // Determine owner_id based on owner_type
      let owner_id = '';
      if (data.owner_type === 'company') {
        owner_id = 'company';
      } else if (data.owner_type === 'department') {
        owner_id = data.department_id || '';
      } else {
        owner_id = data.employee_id || '';
      }

      // Create OKR
      const { data: okr, error: okrError } = await supabase
        .from('okr_objectives')
        .insert({
          title: data.title,
          description: data.description,
          cycle_id: currentCycle?.id || '',
          year: currentCycle?.year || new Date().getFullYear(),
          quarter: currentCycle?.quarter || 'Q1',
          progress: 0,
          status: 'draft' as const,
          owner_type: data.owner_type,
          owner_id: owner_id,
          department_id: data.department_id || null,
          employee_id: data.employee_id || null,
          start_date: currentCycle?.start_date || new Date().toISOString().split('T')[0],
          end_date: currentCycle?.end_date || new Date().toISOString().split('T')[0],
          created_by: '', // Will be set by auth
        })
        .select()
        .single();

      if (okrError) throw okrError;

      // Create Key Results
      if (data.key_results.length > 0) {
        const { error: krError } = await supabase
          .from('okr_key_results')
          .insert(
            data.key_results.map(kr => ({
              okr_id: okr.id,
              title: kr.title,
              description: kr.description || '',
              target_value: kr.target_value,
              current_value: 0,
              unit: kr.unit,
              weight: kr.weight,
              progress: 0,
              status: 'not_started' as const,
            }))
          );

        if (krError) throw krError;
      }

      return okr;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['department-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['my-okrs'] });
    }
  });
};

// Update Key Result Progress
export const useUpdateKeyResult = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: {
      id: string;
      current_value: number;
      progress: number;
      status: 'not_started' | 'on_track' | 'at_risk' | 'completed';
    }) => {
      const { data: result, error } = await supabase
        .from('okr_key_results')
        .update({
          current_value: data.current_value,
          progress: data.progress,
          status: data.status,
        })
        .eq('id', data.id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['company-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['department-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['my-okrs'] });
    }
  });
};