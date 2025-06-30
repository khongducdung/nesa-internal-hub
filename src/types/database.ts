import { Database } from "@/integrations/supabase/types";

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Department = Database['public']['Tables']['departments']['Row'];
export type Position = Database['public']['Tables']['positions']['Row'];
export type Process = Database['public']['Tables']['processes']['Row'];
export type PerformanceReview = Database['public']['Tables']['performance_reviews']['Row'];
export type OKR = Database['public']['Tables']['okrs']['Row'];
export type KPI = Database['public']['Tables']['kpis']['Row'];
export type Employee = Database['public']['Tables']['employees']['Row'];
export type ProcessTemplate = Database['public']['Tables']['process_templates']['Row'];
export type ProcessInstance = Database['public']['Tables']['process_instances']['Row'];
export type Attendance = Database['public']['Tables']['attendance']['Row'];
export type LeaveRequest = Database['public']['Tables']['leave_requests']['Row'];
export type TrainingProgram = Database['public']['Tables']['training_programs']['Row'];
export type TrainingParticipant = Database['public']['Tables']['training_participants']['Row'];
export type Contract = Database['public']['Tables']['contracts']['Row'];
export type SalaryHistory = Database['public']['Tables']['salary_history']['Row'];
export type EmployeeEvaluation = Database['public']['Tables']['employee_evaluations']['Row'];
export type DisciplinaryAction = Database['public']['Tables']['disciplinary_actions']['Row'];
export type WorkHistory = Database['public']['Tables']['work_history']['Row'];
export type SystemRole = Database['public']['Enums']['system_role'];
export type EmployeeLevel = Database['public']['Enums']['employee_level'];
export type Status = Database['public']['Enums']['status'];

export type CompetencyFramework = Database['public']['Tables']['competency_frameworks']['Row'];
export type EmployeeCompetencyAssessment = Database['public']['Tables']['employee_competency_assessments']['Row'];

export type PayrollPeriod = Database['public']['Tables']['payroll_periods']['Row'];
export type PayrollDetail = Database['public']['Tables']['payroll_details']['Row'];
export type SalaryConfig = Database['public']['Tables']['salary_configs']['Row'];

// Extended types for joined data that match the actual query results
export type ProcessWithDetails = Process & {
  departments: {
    id: string;
    name: string;
  } | null;
  positions: {
    id: string;
    name: string;
  } | null;
  assigned_user: {
    id: string;
    full_name: string;
  } | null;
  created_by_user: {
    id: string;
    full_name: string;
  } | null;
};

export type EmployeeWithDetails = Employee & {
  departments: {
    id: string;
    name: string;
  } | null;
  positions: {
    id: string;
    name: string;
  } | null;
  manager: {
    id: string;
    full_name: string;
  } | null;
};

export type ProcessInstanceWithDetails = ProcessInstance & {
  process_templates: {
    id: string;
    name: string;
    category: string;
    steps: any;
  } | null;
  departments: {
    id: string;
    name: string;
  } | null;
  assigned_user: {
    id: string;
    full_name: string;
  } | null;
};

export type LeaveRequestWithDetails = LeaveRequest & {
  employees: {
    id: string;
    full_name: string;
    employee_code: string;
  } | null;
  approved_by_employee: {
    id: string;
    full_name: string;
  } | null;
};

export type AttendanceWithDetails = Attendance & {
  employees: {
    id: string;
    full_name: string;
    employee_code: string;
  } | null;
};

export type TrainingParticipantWithDetails = TrainingParticipant & {
  employees: {
    id: string;
    full_name: string;
    employee_code: string;
  } | null;
  training_programs: {
    id: string;
    name: string;
  } | null;
};

export type CompetencyFrameworkWithDetails = CompetencyFramework & {
  positions: {
    id: string;
    name: string;
  } | null;
};

export type WorkGroup = Database['public']['Tables']['work_groups']['Row'];
export type PerformanceCycle = Database['public']['Tables']['performance_cycles']['Row'];
export type PerformanceAssignment = Database['public']['Tables']['performance_assignments']['Row'];
export type PerformanceReport = Database['public']['Tables']['performance_reports']['Row'];
export type PerformanceEvaluation = Database['public']['Tables']['performance_evaluations']['Row'];

export type PayrollPeriod = Database['public']['Tables']['payroll_periods']['Row'];
export type PayrollDetail = Database['public']['Tables']['payroll_details']['Row'];
export type SalaryConfig = Database['public']['Tables']['salary_configs']['Row'];
