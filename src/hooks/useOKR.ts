
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
  owner_id: string;
  owner_type: 'company' | 'department' | 'individual';
  department_id?: string;
  employee_id?: string;
  parent_okr_id?: string;
  created_by: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  key_results?: KeyResult[];
  cycle?: OKRCycle;
  aligned_okrs?: OKRObjective[];
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
  due_date?: string;
  notes?: string;
  linked_okr_id?: string;
  created_at: string;
  updated_at: string;
}

export interface OKRCycle {
  id: string;
  name: string;
  year: number;
  quarter: string;
  start_date: string;
  end_date: string;
  status: 'planning' | 'active' | 'review' | 'closed';
  is_current: boolean;
  description?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// OKR Cycles
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
        .single();
      
      if (error) throw error;
      return data as OKRCycle;
    }
  });
};

// OKR Objectives
export const useOKRObjectives = (filters?: {
  owner_type?: 'company' | 'department' | 'individual';
  cycle_id?: string;
  employee_id?: string;
  department_id?: string;
}) => {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['okr-objectives', filters],
    queryFn: async () => {
      console.log('🔍 Fetching OKR objectives with filters:', filters);
      console.log('👤 Current user profile:', profile);
      
      let query = supabase
        .from('okr_objectives')
        .select(`
          *,
          cycle:okr_cycles(*),
          key_results:okr_key_results(*),
          department:departments(name),
          employee:employees(full_name, employee_code)
        `)
        .order('created_at', { ascending: false });

      if (filters?.owner_type) {
        query = query.eq('owner_type', filters.owner_type);
      }
      
      if (filters?.cycle_id) {
        query = query.eq('cycle_id', filters.cycle_id);
      }
      
      if (filters?.employee_id) {
        query = query.eq('employee_id', filters.employee_id);
      }
      
      if (filters?.department_id) {
        query = query.eq('department_id', filters.department_id);
      }
      
      // If no specific filters and user is not admin, show relevant OKRs
      if (!filters && profile?.employee_id) {
        query = query.or(`
          owner_type.eq.company,
          and(owner_type.eq.department,department_id.eq.${profile.department_id}),
          and(owner_type.eq.individual,employee_id.eq.${profile.employee_id})
        `);
      }

      const { data, error } = await query;
      
      console.log('📊 Query result:', { data, error });
      
      if (error) {
        console.error('❌ Database error:', error);
        throw error;
      }
      
      // Calculate progress for each OKR based on key results
      const enrichedData = data.map(okr => {
        const keyResults = okr.key_results || [];
        const totalProgress = keyResults.length > 0 
          ? keyResults.reduce((sum, kr) => sum + (kr.progress * kr.weight / 100), 0)
          : okr.progress || 0;
        
        return {
          ...okr,
          progress: Math.round(totalProgress),
          key_results: keyResults
        };
      });
      
      console.log('✅ Enriched data:', enrichedData);
      return enrichedData as OKRObjective[];
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

// CRUD Operations
export const useCreateOKR = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<OKRObjective, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('okr_objectives')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['okr-objectives'] });
    }
  });
};

export const useUpdateOKR = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<OKRObjective> & { id: string }) => {
      const { data: result, error } = await supabase
        .from('okr_objectives')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['okr-objectives'] });
    }
  });
};

export const useDeleteOKR = () => {
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
      queryClient.invalidateQueries({ queryKey: ['okr-objectives'] });
    }
  });
};

// Key Results
export const useKeyResults = (okrId: string) => {
  return useQuery({
    queryKey: ['key-results', okrId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('okr_key_results')
        .select('*')
        .eq('okr_id', okrId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as KeyResult[];
    },
    enabled: !!okrId
  });
};

export const useCreateKeyResult = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<KeyResult, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('okr_key_results')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['key-results', data.okr_id] });
      queryClient.invalidateQueries({ queryKey: ['okr-objectives'] });
    }
  });
};

export const useUpdateKeyResult = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<KeyResult> & { id: string }) => {
      const { data: result, error } = await supabase
        .from('okr_key_results')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['key-results', data.okr_id] });
      queryClient.invalidateQueries({ queryKey: ['okr-objectives'] });
    }
  });
};

export const useDeleteKeyResult = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      // Get okr_id before deleting
      const { data: keyResult } = await supabase
        .from('okr_key_results')
        .select('okr_id')
        .eq('id', id)
        .single();
      
      const { error } = await supabase
        .from('okr_key_results')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return keyResult?.okr_id;
    },
    onSuccess: (okrId) => {
      if (okrId) {
        queryClient.invalidateQueries({ queryKey: ['key-results', okrId] });
        queryClient.invalidateQueries({ queryKey: ['okr-objectives'] });
      }
    }
  });
};
