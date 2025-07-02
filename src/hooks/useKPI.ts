import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { 
  KPI, 
  KPICategory, 
  KPIFramework, 
  KPIMeasurement, 
  KPITarget, 
  KPIActionPlan, 
  KPIReview,
  KPIWithDetails,
  KPIMeasurementWithDetails,
  KPIActionPlanWithDetails,
  KPIReviewWithDetails
} from '@/types/kpi';

// KPI Categories
export const useKPICategories = () => {
  return useQuery({
    queryKey: ['kpi-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpi_categories')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as KPICategory[];
    }
  });
};

export const useCreateKPICategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<KPICategory, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('kpi_categories')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpi-categories'] });
    }
  });
};

// KPI Frameworks
export const useKPIFrameworks = () => {
  return useQuery({
    queryKey: ['kpi-frameworks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpi_frameworks')
        .select(`
          *,
          departments(id, name),
          positions(id, name)
        `)
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as any[];
    }
  });
};

export const useCreateKPIFramework = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<KPIFramework, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('kpi_frameworks')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpi-frameworks'] });
    }
  });
};

// KPIs
export const useKPIs = (employeeId?: string) => {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['kpis', employeeId || profile?.employee_id || 'all'],
    queryFn: async () => {
      // Nếu có employeeId cụ thể, filter theo employee đó
      if (employeeId) {
        const { data, error } = await supabase
          .from('kpis')
          .select(`
            *,
            kpi_categories(id, name, color),
            kpi_frameworks(id, name, framework_type),
            employees!kpis_employee_id_fkey(id, full_name, employee_code),
            responsible_person:employees!kpis_responsible_person_id_fkey(id, full_name),
            kpi_measurements(
              id, measured_value, measurement_date, measurement_period, notes
            ),
            kpi_targets(
              id, target_period, target_value, minimum_acceptable, excellent_threshold
            )
          `)
          .eq('employee_id', employeeId)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return enrichKPIData(data);
      }
      
      // Nếu có profile.employee_id, filter theo user hiện tại
      if (profile?.employee_id) {
        const { data, error } = await supabase
          .from('kpis')
          .select(`
            *,
            kpi_categories(id, name, color),
            kpi_frameworks(id, name, framework_type),
            employees!kpis_employee_id_fkey(id, full_name, employee_code),
            responsible_person:employees!kpis_responsible_person_id_fkey(id, full_name),
            kpi_measurements(
              id, measured_value, measurement_date, measurement_period, notes
            ),
            kpi_targets(
              id, target_period, target_value, minimum_acceptable, excellent_threshold
            )
          `)
          .eq('employee_id', profile.employee_id)
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        return enrichKPIData(data);
      }
      
      // Fallback: Lấy tất cả KPIs để demo (khi chưa authentication)
      const { data, error } = await supabase
        .from('kpis')
        .select(`
          *,
          kpi_categories(id, name, color),
          kpi_frameworks(id, name, framework_type),
          employees!kpis_employee_id_fkey(id, full_name, employee_code),
          responsible_person:employees!kpis_responsible_person_id_fkey(id, full_name),
          kpi_measurements(
            id, measured_value, measurement_date, measurement_period, notes
          ),
          kpi_targets(
            id, target_period, target_value, minimum_acceptable, excellent_threshold
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10); // Giới hạn 10 KPIs cho demo
      
      if (error) throw error;
      return enrichKPIData(data);
    }
  });
};

// Helper function to enrich KPI data
function enrichKPIData(data: any[]) {
  return data.map(kpi => {
    const latestMeasurement = kpi.kpi_measurements?.[0] || null;
    const currentPeriod = new Date().toISOString().slice(0, 7); // YYYY-MM format
    const currentTarget = kpi.kpi_targets?.find(t => t.target_period.includes(currentPeriod)) || null;
    
    return {
      ...kpi,
      latest_measurement: latestMeasurement,
      current_target: currentTarget
    };
  });
}

export const useAllKPIs = () => {
  return useQuery({
    queryKey: ['all-kpis'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('kpis')
        .select(`
          *,
          kpi_categories(id, name, color),
          kpi_frameworks(id, name, framework_type),
          employees!kpis_employee_id_fkey(id, full_name, employee_code, departments(name)),
          responsible_person:employees!kpis_responsible_person_id_fkey(id, full_name),
          kpi_measurements(
            id, measured_value, measurement_date, measurement_period, notes
          ),
          kpi_targets(
            id, target_period, target_value, minimum_acceptable, excellent_threshold
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as any[];
    }
  });
};

export const useCreateKPI = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<KPI, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('kpis')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
      queryClient.invalidateQueries({ queryKey: ['all-kpis'] });
    }
  });
};

export const useUpdateKPI = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<KPI> & { id: string }) => {
      const { data: result, error } = await supabase
        .from('kpis')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
      queryClient.invalidateQueries({ queryKey: ['all-kpis'] });
    }
  });
};

// KPI Measurements
export const useKPIMeasurements = (kpiId?: string) => {
  return useQuery({
    queryKey: ['kpi-measurements', kpiId],
    queryFn: async () => {
      if (!kpiId) return [];
      
      const { data, error } = await supabase
        .from('kpi_measurements')
        .select(`
          *,
          kpis(id, name, unit),
          measured_by_employee:employees!kpi_measurements_measured_by_fkey(id, full_name)
        `)
        .eq('kpi_id', kpiId)
        .order('measurement_date', { ascending: false });
      
      if (error) throw error;
      return data as any[];
    },
    enabled: !!kpiId
  });
};

export const useCreateKPIMeasurement = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<KPIMeasurement, 'id' | 'created_at' | 'updated_at' | 'verified_at' | 'verified_by'>) => {
      const { data: result, error } = await supabase
        .from('kpi_measurements')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['kpi-measurements', data.kpi_id] });
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
    }
  });
};

// KPI Targets
export const useKPITargets = (kpiId?: string) => {
  return useQuery({
    queryKey: ['kpi-targets', kpiId],
    queryFn: async () => {
      if (!kpiId) return [];
      
      const { data, error } = await supabase
        .from('kpi_targets')
        .select('*')
        .eq('kpi_id', kpiId)
        .order('target_period', { ascending: false });
      
      if (error) throw error;
      return data as KPITarget[];
    },
    enabled: !!kpiId
  });
};

export const useCreateKPITarget = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<KPITarget, 'id' | 'created_at' | 'updated_at' | 'approved_at' | 'approved_by' | 'set_by'>) => {
      const { data: result, error } = await supabase
        .from('kpi_targets')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['kpi-targets', data.kpi_id] });
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
    }
  });
};

// KPI Action Plans
export const useKPIActionPlans = (kpiId?: string) => {
  return useQuery({
    queryKey: ['kpi-action-plans', kpiId],
    queryFn: async () => {
      if (!kpiId) return [];
      
      const { data, error } = await supabase
        .from('kpi_action_plans')
        .select(`
          *,
          kpis(id, name),
          assigned_to_employee:employees!kpi_action_plans_assigned_to_fkey(id, full_name),
          created_by_employee:employees!kpi_action_plans_created_by_fkey(id, full_name)
        `)
        .eq('kpi_id', kpiId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as any[];
    },
    enabled: !!kpiId
  });
};

export const useMyKPIActionPlans = () => {
  const { profile } = useAuth();
  
  return useQuery({
    queryKey: ['my-kpi-action-plans', profile?.employee_id],
    queryFn: async () => {
      if (!profile?.employee_id) return [];
      
      const { data, error } = await supabase
        .from('kpi_action_plans')
        .select(`
          *,
          kpis(id, name),
          assigned_to_employee:employees!kpi_action_plans_assigned_to_fkey(id, full_name),
          created_by_employee:employees!kpi_action_plans_created_by_fkey(id, full_name)
        `)
        .eq('assigned_to', profile.employee_id)
        .order('due_date', { ascending: true });
      
      if (error) throw error;
      return data as any[];
    },
    enabled: !!profile?.employee_id
  });
};

export const useCreateKPIActionPlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<KPIActionPlan, 'id' | 'created_at' | 'updated_at' | 'actual_impact'>) => {
      const { data: result, error } = await supabase
        .from('kpi_action_plans')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['kpi-action-plans', data.kpi_id] });
      queryClient.invalidateQueries({ queryKey: ['my-kpi-action-plans'] });
    }
  });
};

export const useUpdateKPIActionPlan = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<KPIActionPlan> & { id: string }) => {
      const { data: result, error } = await supabase
        .from('kpi_action_plans')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['kpi-action-plans', data.kpi_id] });
      queryClient.invalidateQueries({ queryKey: ['my-kpi-action-plans'] });
    }
  });
};

// KPI Reviews
export const useKPIReviews = (kpiId?: string) => {
  return useQuery({
    queryKey: ['kpi-reviews', kpiId],
    queryFn: async () => {
      if (!kpiId) return [];
      
      const { data, error } = await supabase
        .from('kpi_reviews')
        .select(`
          *,
          kpis(id, name),
          reviewed_by_employee:employees!kpi_reviews_reviewed_by_fkey(id, full_name)
        `)
        .eq('kpi_id', kpiId)
        .order('reviewed_at', { ascending: false });
      
      if (error) throw error;
      return data as any[];
    },
    enabled: !!kpiId
  });
};

export const useCreateKPIReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<KPIReview, 'id' | 'created_at' | 'updated_at' | 'reviewed_at' | 'approved_at' | 'approved_by'>) => {
      const { data: result, error } = await supabase
        .from('kpi_reviews')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['kpi-reviews', data.kpi_id] });
    }
  });
};