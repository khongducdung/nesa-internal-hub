
export interface PayrollPeriod {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  month: number;
  year: number;
  status: 'draft' | 'processing' | 'completed' | 'paid';
  total_employees: number;
  total_amount: number;
  created_by: string;
  processed_by?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface PayrollDetail {
  id: string;
  payroll_period_id: string;
  employee_id: string;
  base_salary: number;
  working_days: number;
  present_days: number;
  absent_days: number;
  late_days: number;
  overtime_hours: number;
  overtime_amount: number;
  allowances: number;
  deductions: number;
  bonus: number;
  penalties: number;
  gross_salary: number;
  tax_amount: number;
  insurance_amount: number;
  net_salary: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  employee?: {
    full_name: string;
    employee_code: string;
    department?: {
      name: string;
    };
    position?: {
      name: string;
    };
  };
}

export interface SalaryConfig {
  id: string;
  name: string;
  description?: string;
  overtime_rate: number;
  late_penalty_per_hour: number;
  absent_penalty_per_day: number;
  tax_rate: number;
  insurance_rate: number;
  min_working_hours_per_day: number;
  standard_working_days_per_month: number;
  is_default: boolean;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}
