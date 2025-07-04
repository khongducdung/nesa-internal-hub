import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Department } from '@/types/database';

export interface DepartmentWithEmployeeCount extends Department {
  employee_count: number;
}

export const useDepartments = () => {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async (): Promise<DepartmentWithEmployeeCount[]> => {
      console.log('Fetching departments...');
      
      const { data, error } = await supabase
        .from('departments')
        .select(`
          *,
          employees!employees_department_id_fkey(id)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching departments:', error);
        throw error;
      }

      // Transform data to include employee count
      const departmentsWithCount = (data || []).map(dept => ({
        ...dept,
        employee_count: dept.employees?.length || 0,
        employees: undefined // Remove the employees array from the response
      }));

      console.log('Departments fetched successfully:', departmentsWithCount);
      return departmentsWithCount;
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
        .select('id, status');

      if (departmentsError) {
        console.error('Error fetching department stats:', departmentsError);
        throw departmentsError;
      }

      const { data: employeesPerDept, error: employeesError } = await supabase
        .from('employees')
        .select('department_id')
        .eq('work_status', 'active')
        .not('department_id', 'is', null);

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

      const activeDepartments = departmentsData?.filter(d => d.status === 'active') || [];
      const totalEmployees = Object.values(employeeCount || {}).reduce((a, b) => a + b, 0);
      const avgEmployees = activeDepartments.length > 0 ? Math.round(totalEmployees / activeDepartments.length) : 0;

      const stats = {
        totalDepartments: departmentsData?.length || 0,
        activeDepartments: activeDepartments.length,
        averageEmployeesPerDept: avgEmployees,
        largestDepartment: employeeCount ? Math.max(...Object.values(employeeCount), 0) : 0,
      };

      console.log('Department stats fetched:', stats);
      return stats;
    },
  });
};
