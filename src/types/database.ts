
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
export type SystemRole = Database['public']['Enums']['system_role'];
export type EmployeeLevel = Database['public']['Enums']['employee_level'];
export type Status = Database['public']['Enums']['status'];

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
