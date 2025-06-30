
export interface WorkGroup {
  id: string;
  name: string;
  description?: string;
  salary_percentage: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PerformanceCycle {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  status: 'draft' | 'active' | 'completed';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface PerformanceAssignment {
  id: string;
  performance_cycle_id: string;
  employee_id: string;
  work_group_id: string;
  kpi_target: number;
  kpi_unit?: string;
  description?: string;
  salary_percentage: number;
  status: 'assigned' | 'in_progress' | 'submitted' | 'evaluated';
  created_by: string;
  assigned_at: string;
  created_at: string;
  updated_at: string;
  // Relations
  performance_cycles?: PerformanceCycle;
  employees?: {
    id: string;
    full_name: string;
    employee_code: string;
  };
  work_groups?: WorkGroup;
}

export interface PerformanceReport {
  id: string;
  performance_assignment_id: string;
  actual_quantity: number;
  report_content?: string;
  attachments: any[];
  submitted_at: string;
  created_at: string;
  updated_at: string;
}

export interface PerformanceEvaluation {
  id: string;
  performance_assignment_id: string;
  quantity_score?: number;
  quality_rating?: number;
  quality_percentage?: number;
  final_score?: number;
  comments?: string;
  evaluated_by: string;
  evaluated_at: string;
  created_at: string;
  updated_at: string;
}

export interface PerformanceAssignmentWithDetails extends PerformanceAssignment {
  performance_reports?: PerformanceReport[];
  performance_evaluations?: PerformanceEvaluation[];
}
