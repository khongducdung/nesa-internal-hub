
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Department } from '@/types/database';

export const useDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async (): Promise<Department[]> => {
      console.log('Fetching departments...');
      
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching departments:', error);
        throw error;
      }

      console.log('Departments fetched successfully:', data);
      return data || [];
    },
  });
};

export const useDepartmentStats = () => {
  return useQuery({
    queryKey: ['department-stats'],
    queryFn: async () => {
      console.log('Fetching department stats...');
      
      const { data: departmentsData, error: departmentsError } = await supabase
        .from('departments')
        .select('id, status')
        .eq('status', 'active');

      if (departmentsError) {
        console.error('Error fetching department stats:', departmentsError);
        throw departmentsError;
      }

      const { data: employeesPerDept, error: employeesError } = await supabase
        .from('employees')
        .select('department_id')
        .eq('work_status', 'active');

      if (employeesError) {
        console.error('Error fetching employees per department:', employeesError);
        throw employeesError;
      }

      // Count employees per department
      const employeeCount = employeesPerDept?.reduce((acc, emp) => {
        if (emp.department_id) {
          acc[emp.department_id] = (acc[emp.department_id] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const stats = {
        totalDepartments: departmentsData?.length || 0,
        activeDepartments: departmentsData?.filter(d => d.status === 'active').length || 0,
        averageEmployeesPerDept: employeeCount ? Math.round(Object.values(employeeCount).reduce((a, b) => a + b, 0) / Object.keys(employeeCount).length) : 0,
        largestDepartment: employeeCount ? Math.max(...Object.values(employeeCount)) : 0,
      };

      console.log('Department stats fetched:', stats);
      return stats;
    },
  });
};
