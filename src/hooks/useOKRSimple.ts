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
  parent_okr_id?: string;
  created_by: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  key_results?: KeyResult[];
  parent_okr?: {
    id: string;
    title: string;
    owner_type: string;
  };
  child_okrs_count?: number;
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
        .maybeSingle();
      
      if (error) throw error;
      return data as OKRCycle | null;
    }
  });
};

// Get Company OKRs
export const useCompanyOKRs = () => {
  return useQuery({
    queryKey: ['company-okrs'],
    queryFn: async () => {
      console.log('Fetching company OKRs...');
      const { data, error } = await supabase
        .from('okr_objectives')
        .select(`
          *,
          key_results:okr_key_results(*),
          parent_okr:parent_okr_id(id, title, owner_type)
        `)
        .eq('owner_type', 'company')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching company OKRs:', error);
        throw error;
      }
      
      console.log('Company OKRs fetched:', data);
      
      // Get child counts separately
      const enrichedData = await Promise.all(
        data.map(async (okr) => {
          const { count } = await supabase
            .from('okr_objectives')
            .select('*', { count: 'exact', head: true })
            .eq('parent_okr_id', okr.id);
          
          return {
            ...okr,
            child_okrs_count: count || 0
          };
        })
      );
      
      return enrichedData as OKRObjective[];
    }
  });
};

// Get Department OKRs
export const useDepartmentOKRs = () => {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['department-okrs', profile?.department_id],
    queryFn: async () => {
      if (!profile?.department_id) {
        console.log('No department_id, returning empty array');
        return [];
      }
      
      console.log('Fetching department OKRs for department:', profile.department_id);
      const { data, error } = await supabase
        .from('okr_objectives')
        .select(`
          *,
          key_results:okr_key_results(*),
          parent_okr:parent_okr_id(id, title, owner_type)
        `)
        .eq('owner_type', 'department')
        .eq('department_id', profile.department_id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching department OKRs:', error);
        throw error;
      }
      
      console.log('Department OKRs fetched:', data);
      
      // Get child counts separately
      const enrichedData = await Promise.all(
        data.map(async (okr) => {
          const { count } = await supabase
            .from('okr_objectives')
            .select('*', { count: 'exact', head: true })
            .eq('parent_okr_id', okr.id);
          
          return {
            ...okr,
            child_okrs_count: count || 0
          };
        })
      );
      
      return enrichedData as OKRObjective[];
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
      if (!profile?.employee_id) {
        console.log('No employee_id, returning empty array');
        return [];
      }
      
      console.log('Fetching my OKRs for employee:', profile.employee_id);
      const { data, error } = await supabase
        .from('okr_objectives')
        .select(`
          *,
          key_results:okr_key_results(*),
          parent_okr:parent_okr_id(id, title, owner_type)
        `)
        .eq('owner_type', 'individual')
        .eq('employee_id', profile.employee_id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching my OKRs:', error);
        throw error;
      }
      
      console.log('My OKRs fetched:', data);
      
      // Get child counts separately (individuals can't have child OKRs, but keeping for consistency)
      const enrichedData = await Promise.all(
        data.map(async (okr) => {
          const { count } = await supabase
            .from('okr_objectives')
            .select('*', { count: 'exact', head: true })
            .eq('parent_okr_id', okr.id);
          
          return {
            ...okr,
            child_okrs_count: count || 0
          };
        })
      );
      
      return enrichedData as OKRObjective[];
    },
    enabled: !!profile?.employee_id
  });
};

// Get Parent OKRs (for hierarchical linking)
export const useParentOKRs = (ownerType: 'company' | 'department' | 'individual') => {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['parent-okrs', ownerType, profile?.department_id],
    queryFn: async () => {
      console.log('Fetching parent OKRs for owner type:', ownerType, 'department:', profile?.department_id);
      
      let query = supabase
        .from('okr_objectives')
        .select(`
          id,
          title,
          description,
          owner_type,
          progress,
          status
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      // Logic for hierarchical linking:
      // - Department OKRs can link to Company OKRs
      // - Individual OKRs can link to Department OKRs (same department)
      if (ownerType === 'department') {
        query = query.eq('owner_type', 'company');
      } else if (ownerType === 'individual') {
        if (!profile?.department_id) {
          console.log('No department for individual, returning empty');
          return [];
        }
        query = query
          .eq('owner_type', 'department')
          .eq('department_id', profile.department_id);
      } else {
        // Company OKRs cannot have parent
        console.log('Company OKRs cannot have parent');
        return [];
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching parent OKRs:', error);
        throw error;
      }
      
      console.log('Parent OKRs fetched:', data);
      return data as OKRObjective[];
    },
    enabled: !!profile && ownerType !== 'company'
  });
};

// Create OKR
export const useCreateOKR = () => {
  const queryClient = useQueryClient();
  const { profile } = useAuth();
  
  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      owner_type: 'company' | 'department' | 'individual';
      department_id?: string;
      employee_id?: string;
      parent_okr_id?: string;
      key_results: Array<{
        title: string;
        description?: string;
        target_value: number;
        unit: string;
        weight: number;
      }>;
    }) => {
      console.log('Creating OKR with data:', data);
      
      // Get current cycle
      const { data: currentCycle } = await supabase
        .from('okr_cycles')
        .select('*')
        .eq('is_current', true)
        .maybeSingle();

      // Get auth user info
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // Prepare OKR data for insertion
      const okrData: any = {
        title: data.title,
        description: data.description,
        cycle_id: currentCycle?.id || '',
        year: currentCycle?.year || new Date().getFullYear(),
        quarter: currentCycle?.quarter || 'Q1',
        progress: 0,
        status: 'active',
        owner_type: data.owner_type,
        parent_okr_id: data.parent_okr_id || null,
        start_date: currentCycle?.start_date || new Date().toISOString().split('T')[0],
        end_date: currentCycle?.end_date || new Date().toISOString().split('T')[0],
        created_by: user.id,
      };

      // Set owner-specific fields
      if (data.owner_type === 'department') {
        okrData.department_id = data.department_id || profile?.department_id;
      } else if (data.owner_type === 'individual') {
        okrData.employee_id = data.employee_id || profile?.employee_id;
      }

      console.log('Final OKR data for insertion:', okrData);

      // Create OKR
      const { data: okr, error: okrError } = await supabase
        .from('okr_objectives')
        .insert(okrData)
        .select()
        .single();

      if (okrError) {
        console.error('Error creating OKR:', okrError);
        throw okrError;
      }

      console.log('OKR created successfully:', okr);

      // Create Key Results
      if (data.key_results.length > 0) {
        console.log('Creating key results:', data.key_results);
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

        if (krError) {
          console.error('Error creating key results:', krError);
          throw krError;
        }
        
        console.log('Key results created successfully');
      }

      return okr;
    },
    onSuccess: () => {
      console.log('OKR creation successful, invalidating queries');
      queryClient.invalidateQueries({ queryKey: ['company-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['department-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['my-okrs'] });
      queryClient.invalidateQueries({ queryKey: ['parent-okrs'] });
    },
    onError: (error) => {
      console.error('OKR creation failed:', error);
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
