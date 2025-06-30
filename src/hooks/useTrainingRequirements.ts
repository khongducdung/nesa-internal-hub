
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface TrainingRequirement {
  id: string;
  name: string;
  description?: string;
  reason?: string;
  course_url?: string;
  duration_days: number;
  target_type: 'general' | 'department' | 'position' | 'employee';
  target_ids?: string[];
  auto_assign_after_days: number;
  is_active: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface EmployeeTrainingAssignment {
  id: string;
  training_requirement_id: string;
  employee_id: string;
  assigned_date: string;
  due_date: string;
  status: 'pending' | 'in_progress' | 'completed' | 'overdue';
  started_at?: string;
  completed_at?: string;
  progress_percentage: number;
  notes?: string;
  assigned_by?: string;
  created_at: string;
  updated_at: string;
  training_requirements?: TrainingRequirement;
  employees?: {
    id: string;
    full_name: string;
    employee_code: string;
  };
}

export function useTrainingRequirements() {
  return useQuery({
    queryKey: ['training-requirements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('training_requirements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as TrainingRequirement[];
    },
  });
}

export function useEmployeeTrainingAssignments(employeeId?: string) {
  return useQuery({
    queryKey: ['employee-training-assignments', employeeId],
    queryFn: async () => {
      let query = supabase
        .from('employee_training_assignments')
        .select(`
          *,
          training_requirements (
            id,
            name,
            description,
            reason,
            course_url,
            duration_days
          ),
          employees (
            id,
            full_name,
            employee_code
          )
        `);

      if (employeeId) {
        query = query.eq('employee_id', employeeId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return data as EmployeeTrainingAssignment[];
    },
  });
}

export function useCreateTrainingRequirement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: Omit<TrainingRequirement, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
      const { data: result, error } = await supabase
        .from('training_requirements')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['training-requirements'] });
      toast({
        title: 'Thành công',
        description: 'Tạo yêu cầu đào tạo thành công',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi tạo yêu cầu đào tạo',
        variant: 'destructive',
      });
    },
  });
}

export function useUpdateTrainingAssignmentProgress() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      progress_percentage, 
      notes,
      started_at,
      completed_at 
    }: { 
      id: string; 
      status?: string; 
      progress_percentage?: number; 
      notes?: string;
      started_at?: string;
      completed_at?: string;
    }) => {
      const updateData: any = {};
      if (status !== undefined) updateData.status = status;
      if (progress_percentage !== undefined) updateData.progress_percentage = progress_percentage;
      if (notes !== undefined) updateData.notes = notes;
      if (started_at !== undefined) updateData.started_at = started_at;
      if (completed_at !== undefined) updateData.completed_at = completed_at;

      const { error } = await supabase
        .from('employee_training_assignments')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee-training-assignments'] });
      toast({
        title: 'Thành công',
        description: 'Cập nhật tiến độ đào tạo thành công',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Lỗi',
        description: error.message || 'Có lỗi xảy ra khi cập nhật tiến độ',
        variant: 'destructive',
      });
    },
  });
}
