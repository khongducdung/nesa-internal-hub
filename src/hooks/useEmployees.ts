
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { EmployeeWithDetails } from '@/types/database';

export const useEmployees = () => {
  return useQuery({
    queryKey: ['employees'],
    queryFn: async (): Promise<EmployeeWithDetails[]> => {
      console.log('Fetching employees...');
      
      const { data, error } = await supabase
        .from('employees')
        .select(`
          *,
          departments:department_id (
            id,
            name
          ),
          positions:position_id (
            id,
            name
          ),
          manager:manager_id (
            id,
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching employees:', error);
        throw error;
      }

      console.log('Employees fetched successfully:', data);
      return data || [];
    },
  });
};

export const useEmployeeStats = () => {
  return useQuery({
    queryKey: ['employee-stats'],
    queryFn: async () => {
      console.log('Fetching employee stats...');
      
      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('work_status')
        .eq('work_status', 'active');

      if (employeesError) {
        console.error('Error fetching employee stats:', employeesError);
        throw employeesError;
      }

      const { data: departmentsData, error: departmentsError } = await supabase
        .from('departments')
        .select('id');

      if (departmentsError) {
        console.error('Error fetching departments:', departmentsError);
        throw departmentsError;
      }

      const stats = {
        totalEmployees: employeesData?.length || 0,
        activeDepartments: departmentsData?.length || 0,
        newEmployees: 0, // This would need a more complex query based on hire_date
        presentToday: employeesData?.length || 0, // This would connect to attendance data
      };

      console.log('Employee stats fetched:', stats);
      return stats;
    },
  });
};
