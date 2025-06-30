
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { 
  WorkGroup, 
  PerformanceCycle, 
  PerformanceAssignment, 
  PerformanceReport, 
  PerformanceEvaluation,
  PerformanceAssignmentWithDetails 
} from '@/types/performance';

// Work Groups
export const useWorkGroups = () => {
  return useQuery({
    queryKey: ['work-groups'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('work_groups')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as WorkGroup[];
    }
  });
};

export const useCreateWorkGroup = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<WorkGroup, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('work_groups')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['work-groups'] });
    }
  });
};

// Performance Cycles
export const usePerformanceCycles = () => {
  return useQuery({
    queryKey: ['performance-cycles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performance_cycles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as PerformanceCycle[];
    }
  });
};

export const useCreatePerformanceCycle = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<PerformanceCycle, 'id' | 'created_at' | 'updated_at'>) => {
      const { data: result, error } = await supabase
        .from('performance_cycles')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance-cycles'] });
    }
  });
};

// Performance Assignments
export const usePerformanceAssignments = (cycleId?: string) => {
  return useQuery({
    queryKey: ['performance-assignments', cycleId],
    queryFn: async () => {
      let query = supabase
        .from('performance_assignments')
        .select(`
          *,
          performance_cycles!inner(id, name, start_date, end_date, status),
          employees!inner(id, full_name, employee_code),
          work_groups!inner(id, name, salary_percentage)
        `);
      
      if (cycleId) {
        query = query.eq('performance_cycle_id', cycleId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as any[];
    }
  });
};

export const useCreatePerformanceAssignment = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<PerformanceAssignment, 'id' | 'created_at' | 'updated_at' | 'assigned_at'>) => {
      const { data: result, error } = await supabase
        .from('performance_assignments')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['performance-assignments'] });
    }
  });
};

// Performance Reports
export const usePerformanceReports = (assignmentId: string) => {
  return useQuery({
    queryKey: ['performance-reports', assignmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performance_reports')
        .select('*')
        .eq('performance_assignment_id', assignmentId)
        .order('submitted_at', { ascending: false });
      
      if (error) throw error;
      return data as PerformanceReport[];
    }
  });
};

export const useCreatePerformanceReport = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<PerformanceReport, 'id' | 'created_at' | 'updated_at' | 'submitted_at'>) => {
      const { data: result, error } = await supabase
        .from('performance_reports')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['performance-reports', data.performance_assignment_id] });
      queryClient.invalidateQueries({ queryKey: ['performance-assignments'] });
    }
  });
};

// Performance Evaluations
export const usePerformanceEvaluations = (assignmentId: string) => {
  return useQuery({
    queryKey: ['performance-evaluations', assignmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performance_evaluations')
        .select('*')
        .eq('performance_assignment_id', assignmentId)
        .order('evaluated_at', { ascending: false });
      
      if (error) throw error;
      return data as PerformanceEvaluation[];
    }
  });
};

export const useCreatePerformanceEvaluation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Omit<PerformanceEvaluation, 'id' | 'created_at' | 'updated_at' | 'evaluated_at'>) => {
      const { data: result, error } = await supabase
        .from('performance_evaluations')
        .insert(data)
        .select()
        .single();
      
      if (error) throw error;
      return result;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['performance-evaluations', data.performance_assignment_id] });
      queryClient.invalidateQueries({ queryKey: ['performance-assignments'] });
    }
  });
};

// Employee's assignments
export const useMyPerformanceAssignments = () => {
  return useQuery({
    queryKey: ['my-performance-assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('performance_assignments')
        .select(`
          *,
          performance_cycles!inner(id, name, start_date, end_date, status),
          work_groups!inner(id, name, salary_percentage)
        `)
        .order('assigned_at', { ascending: false });
      
      if (error) throw error;
      return data as any[];
    }
  });
};

// Dashboard data
export const usePerformanceDashboard = () => {
  return useQuery({
    queryKey: ['performance-dashboard'],
    queryFn: async () => {
      // Get managed employees assignments
      const { data: assignments, error } = await supabase
        .from('performance_assignments')
        .select(`
          *,
          performance_cycles!inner(id, name, start_date, end_date, status),
          employees!inner(id, full_name, employee_code),
          work_groups!inner(id, name, salary_percentage),
          performance_reports(id, actual_quantity, submitted_at),
          performance_evaluations(id, final_score, evaluated_at)
        `)
        .order('assigned_at', { ascending: false });
      
      if (error) throw error;
      return assignments as any[];
    }
  });
};
