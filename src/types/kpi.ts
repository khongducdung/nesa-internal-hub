import { Database } from "@/integrations/supabase/types";

// Base types from database
export type KPI = Database['public']['Tables']['kpis']['Row'];
export type KPICategory = Database['public']['Tables']['kpi_categories']['Row'];
export type KPIFramework = Database['public']['Tables']['kpi_frameworks']['Row'];
export type KPIMeasurement = Database['public']['Tables']['kpi_measurements']['Row'];
export type KPITarget = Database['public']['Tables']['kpi_targets']['Row'];
export type KPIActionPlan = Database['public']['Tables']['kpi_action_plans']['Row'];
export type KPIReview = Database['public']['Tables']['kpi_reviews']['Row'];

// Extended types with relations
export type KPIWithDetails = KPI & {
  kpi_categories?: KPICategory | null;
  kpi_frameworks?: KPIFramework | null;
  employees?: {
    id: string;
    full_name: string;
    employee_code: string;
  } | null;
  responsible_person?: {
    id: string;
    full_name: string;
  } | null;
  kpi_measurements?: KPIMeasurement[];
  kpi_targets?: KPITarget[];
  latest_measurement?: KPIMeasurement | null;
  current_target?: KPITarget | null;
};

export type KPIMeasurementWithDetails = KPIMeasurement & {
  kpis?: {
    id: string;
    name: string;
    unit: string;
  } | null;
  measured_by_employee?: {
    id: string;
    full_name: string;
  } | null;
};

export type KPIActionPlanWithDetails = KPIActionPlan & {
  kpis?: {
    id: string;
    name: string;
  } | null;
  assigned_to_employee?: {
    id: string;
    full_name: string;
  } | null;
  created_by_employee?: {
    id: string;
    full_name: string;
  } | null;
};

export type KPIReviewWithDetails = KPIReview & {
  kpis?: {
    id: string;
    name: string;
  } | null;
  reviewed_by_employee?: {
    id: string;
    full_name: string;
  } | null;
};

// Enums and constants
export const KPI_MEASUREMENT_FREQUENCIES = [
  { value: 'daily', label: 'Hàng ngày' },
  { value: 'weekly', label: 'Hàng tuần' },
  { value: 'monthly', label: 'Hàng tháng' },
  { value: 'quarterly', label: 'Hàng quý' },
  { value: 'yearly', label: 'Hàng năm' }
] as const;

export const KPI_TYPES = [
  { value: 'quantitative', label: 'Định lượng' },
  { value: 'qualitative', label: 'Định tính' }
] as const;

export const TREND_DIRECTIONS = [
  { value: 'increase', label: 'Tăng lên' },
  { value: 'decrease', label: 'Giảm xuống' },
  { value: 'maintain', label: 'Duy trì' }
] as const;

export const KPI_STATUSES = [
  { value: 'active', label: 'Đang hoạt động', color: '#10B981' },
  { value: 'inactive', label: 'Tạm ngưng', color: '#6B7280' },
  { value: 'draft', label: 'Bản nháp', color: '#F59E0B' },
  { value: 'completed', label: 'Hoàn thành', color: '#3B82F6' }
] as const;

export const ACTION_PLAN_PRIORITIES = [
  { value: 'low', label: 'Thấp', color: '#10B981' },
  { value: 'medium', label: 'Trung bình', color: '#F59E0B' },
  { value: 'high', label: 'Cao', color: '#EF4444' },
  { value: 'critical', label: 'Khẩn cấp', color: '#7C2D12' }
] as const;

export const ACTION_PLAN_TYPES = [
  { value: 'improvement', label: 'Cải thiện' },
  { value: 'corrective', label: 'Khắc phục' },
  { value: 'preventive', label: 'Phòng ngừa' }
] as const;

export const PERFORMANCE_RATINGS = [
  { value: 'excellent', label: 'Xuất sắc', color: '#059669' },
  { value: 'good', label: 'Tốt', color: '#10B981' },
  { value: 'acceptable', label: 'Đạt yêu cầu', color: '#F59E0B' },
  { value: 'below_target', label: 'Dưới mục tiêu', color: '#EF4444' },
  { value: 'poor', label: 'Kém', color: '#DC2626' }
] as const;

export const FRAMEWORK_TYPES = [
  { value: 'company', label: 'Công ty' },
  { value: 'department', label: 'Phòng ban' },
  { value: 'team', label: 'Nhóm' },
  { value: 'individual', label: 'Cá nhân' }
] as const;

export const TARGET_LEVELS = [
  { value: 'strategic', label: 'Chiến lược' },
  { value: 'operational', label: 'Vận hành' },
  { value: 'tactical', label: 'Chiến thuật' }
] as const;

// Helper functions
export const getKPIStatusColor = (status: string) => {
  return KPI_STATUSES.find(s => s.value === status)?.color || '#6B7280';
};

export const getPerformanceRatingColor = (rating: string) => {
  return PERFORMANCE_RATINGS.find(r => r.value === rating)?.color || '#6B7280';
};

export const calculateKPIProgress = (current: number, target: number): number => {
  if (target === 0) return 0;
  return Math.round((current / target) * 100);
};

export const getKPIProgressStatus = (progress: number): 'excellent' | 'good' | 'acceptable' | 'below_target' | 'poor' => {
  if (progress >= 100) return 'excellent';
  if (progress >= 80) return 'good';
  if (progress >= 60) return 'acceptable';
  if (progress >= 40) return 'below_target';
  return 'poor';
};