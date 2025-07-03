// OKR System Types - Comprehensive type definitions for the new OKR system

// Enums cho các trạng thái và loại
export type OKROwnerType = 'company' | 'department' | 'individual';
export type OKRStatus = 'draft' | 'active' | 'completed' | 'cancelled';
export type OKRCycleStatus = 'planning' | 'active' | 'review' | 'closed';
export type KeyResultStatus = 'not_started' | 'on_track' | 'at_risk' | 'completed';
export type CheckInFrequency = 'weekly' | 'bi_weekly' | 'monthly';
export type AlertLevel = 'low' | 'medium' | 'high';

// Interface cho OKR Cycle (Chu kỳ)
export interface OKRCycle {
  id: string;
  name: string;
  year: number;
  quarter?: string;
  cycle_type: 'monthly' | 'quarterly' | 'yearly';
  start_date: string;
  end_date: string;
  status: OKRCycleStatus;
  is_current: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// Interface cho OKR Objective (Mục tiêu)
export interface OKRObjective {
  id: string;
  title: string;
  description: string;
  cycle_id: string;
  year: number;
  quarter: string;
  progress: number;
  status: OKRStatus;
  owner_type: OKROwnerType;
  owner_id: string;
  department_id?: string;
  employee_id?: string;
  parent_okr_id?: string;
  created_by: string;
  start_date: string;
  end_date: string;
  created_at: string;
  updated_at: string;
  
  // Computed fields
  key_results?: KeyResult[];
  parent_okr?: OKRObjective;
  child_okrs?: OKRObjective[];
  department?: { id: string; name: string };
  employee?: { id: string; full_name: string; employee_code: string };
  creator?: { id: string; full_name: string };
  
  // Metrics
  alignment_score?: number;
  completion_rate?: number;
  time_to_deadline?: number;
  child_okrs_count?: number;
}

// Interface cho Key Result
export interface KeyResult {
  id: string;
  okr_id: string;
  title: string;
  description?: string;
  target_value: number;
  current_value: number;
  unit: string;
  weight: number; // Percentage weight in the OKR (total should be 100%)
  progress: number; // Calculated percentage 0-100
  status: KeyResultStatus;
  created_at: string;
  updated_at: string;
  
  // Additional fields for tracking
  due_date?: string;
  responsible_person_id?: string;
  measurement_frequency?: string;
  data_source?: string;
  
  // Progress tracking
  updates?: KeyResultUpdate[];
  last_updated?: string;
  next_check_in?: string;
}

// Interface cho Key Result Updates (Lịch sử cập nhật)
export interface KeyResultUpdate {
  id: string;
  key_result_id: string;
  previous_value: number;
  new_value: number;
  progress_change: number;
  notes?: string;
  evidence_urls?: string[];
  updated_by: string;
  created_at: string;
  
  // Computed fields
  updater?: { id: string; full_name: string };
}

// Interface cho Check-in
export interface OKRCheckIn {
  id: string;
  okr_id?: string;
  key_result_id?: string;
  check_in_type: 'weekly' | 'monthly' | 'quarterly';
  confidence_level: number; // 1-5 scale
  status_update: string;
  challenges?: string;
  support_needed?: string;
  next_actions?: string;
  mood_indicator: 'confident' | 'concerned' | 'at_risk';
  created_by: string;
  created_at: string;
  
  // Computed fields
  creator?: { id: string; full_name: string };
}

// Interface cho Comments/Feedback
export interface OKRComment {
  id: string;
  okr_id?: string;
  key_result_id?: string;
  parent_comment_id?: string;
  content: string;
  is_private: boolean;
  mentioned_users?: string[];
  attachments?: string[];
  created_by: string;
  created_at: string;
  updated_at: string;
  
  // Computed fields
  creator?: { id: string; full_name: string };
  replies?: OKRComment[];
}

// Interface cho Gamification - Achievements/Badges
export interface OKRAchievement {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji or icon name
  type: 'milestone' | 'achievement' | 'collaboration' | 'excellence';
  points: number;
  conditions: Record<string, any>; // JSON conditions for earning
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  is_active: boolean;
  unlock_order?: number;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Interface cho User Achievements
export interface UserAchievement {
  id: string;
  user_id: string;
  achievement_id: string;
  earned_at: string;
  progress: number; // For progressive achievements
  metadata?: Record<string, any>;
  
  // Computed fields
  achievement?: OKRAchievement;
  user?: { id: string; full_name: string };
}

// Interface cho Rewards System
export interface OKRReward {
  id: string;
  user_id: string;
  okr_coins: number;
  trust_points: number;
  dedication_points: number;
  total_rewards: number;
  current_rank?: number;
  created_at: string;
  updated_at: string;
  
  // Computed fields
  user?: { id: string; full_name: string };
  achievements?: UserAchievement[];
}

// Interface cho Reward Transactions
export interface RewardTransaction {
  id: string;
  user_id: string;
  transaction_type: 'earn' | 'spend' | 'transfer';
  reward_type: 'okr_coins' | 'trust_points' | 'dedication_points';
  amount: number;
  reason: string;
  reference_id?: string; // Link to OKR, KR, etc.
  reference_type?: string;
  created_by?: string;
  created_at: string;
  
  // Computed fields
  user?: { id: string; full_name: string };
}

// Interface cho OKR Analytics/Reports
export interface OKRAnalytics {
  total_okrs: number;
  active_okrs: number;
  completed_okrs: number;
  avg_completion_rate: number;
  on_track_percentage: number;
  at_risk_percentage: number;
  overdue_percentage: number;
  
  // By level
  company_okrs_progress: number;
  department_okrs_progress: number;
  individual_okrs_progress: number;
  
  // Engagement metrics
  check_in_frequency: number;
  avg_key_results_per_okr: number;
  alignment_score: number;
  
  // Time-based
  period_start: string;
  period_end: string;
  last_updated: string;
}

// Interface cho Dashboard Stats
export interface OKRDashboardStats {
  cycle_progress: {
    total_days: number;
    completed_days: number;
    remaining_days: number;
    progress_percentage: number;
  };
  
  okr_summary: {
    total: number;
    completed: number;
    on_track: number;
    at_risk: number;
    overdue: number;
  };
  
  key_results_summary: {
    total: number;
    completed: number;
    on_track: number;
    at_risk: number;
    not_started: number;
  };

  // Level-specific OKR counts
  company_okrs: number;
  department_okrs: number;
  individual_okrs: number;
  alignment_score: number;
  
  recent_activities: OKRActivity[];
  top_performers: Array<{
    user: { id: string; full_name: string };
    completion_rate: number;
    okr_coins: number;
  }>;
  
  alerts: OKRAlert[];
}

// Interface cho Activity Feed
export interface OKRActivity {
  id: string;
  type: 'create_okr' | 'update_progress' | 'complete_kr' | 'check_in' | 'comment' | 'achieve_badge';
  user_id: string;
  target_id: string; // OKR or KR ID
  target_type: 'okr' | 'key_result';
  description: string;
  metadata?: Record<string, any>;
  created_at: string;
  
  // Computed fields
  user?: { id: string; full_name: string };
  target?: OKRObjective | KeyResult;
}

// Interface cho Alerts/Notifications
export interface OKRAlert {
  id: string;
  type: 'overdue' | 'no_update' | 'low_progress' | 'deadline_approaching' | 'misaligned';
  level: AlertLevel;
  title: string;
  message: string;
  target_id: string;
  target_type: 'okr' | 'key_result';
  user_id: string;
  is_read: boolean;
  created_at: string;
  
  // Computed fields
  target?: OKRObjective | KeyResult;
}

// Interface cho Filters
export interface OKRFilters {
  cycle_id?: string;
  owner_type?: OKROwnerType;
  status?: OKRStatus;
  department_id?: string;
  employee_id?: string;
  search?: string;
  date_range?: {
    start: string;
    end: string;
  };
}

// Interface cho Create/Update OKR Form Data
export interface CreateOKRForm {
  title: string;
  description: string;
  owner_type: OKROwnerType;
  department_id?: string;
  employee_id?: string;
  parent_okr_id?: string;
  key_results: Array<{
    title: string;
    description?: string;
    target_value: number;
    unit: string;
    weight: number;
    due_date?: string;
  }>;
}

// Interface cho Leaderboard
export interface OKRLeaderboard {
  individual: Array<{
    user: { id: string; full_name: string; avatar_url?: string };
    completion_rate: number;
    okr_coins: number;
    trust_points: number;
    rank: number;
    achievements_count: number;
  }>;
  
  department: Array<{
    department: { id: string; name: string };
    avg_completion_rate: number;
    total_okrs: number;
    completed_okrs: number;
    rank: number;
  }>;
}