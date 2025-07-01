export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      attendance: {
        Row: {
          approval_required: boolean | null
          approved_at: string | null
          approved_by: string | null
          attendance_setting_id: string | null
          break_time: number | null
          check_in_latitude: number | null
          check_in_longitude: number | null
          check_in_time: string | null
          check_out_latitude: number | null
          check_out_longitude: number | null
          check_out_time: string | null
          check_type: string | null
          created_at: string | null
          daily_end_check_out: string | null
          daily_start_check_in: string | null
          date: string
          early_leave_minutes: number | null
          employee_id: string
          id: string
          is_approved: boolean | null
          is_early_leave: boolean | null
          is_late: boolean | null
          late_minutes: number | null
          location_id: string | null
          manager_notes: string | null
          notes: string | null
          overtime_hours: number | null
          shift_assignment_id: string | null
          shift_end_check_in: string | null
          shift_end_check_out: string | null
          shift_start_check_in: string | null
          shift_start_check_out: string | null
          status: string | null
          total_work_hours: number | null
          updated_at: string | null
          work_shift_id: string | null
        }
        Insert: {
          approval_required?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          attendance_setting_id?: string | null
          break_time?: number | null
          check_in_latitude?: number | null
          check_in_longitude?: number | null
          check_in_time?: string | null
          check_out_latitude?: number | null
          check_out_longitude?: number | null
          check_out_time?: string | null
          check_type?: string | null
          created_at?: string | null
          daily_end_check_out?: string | null
          daily_start_check_in?: string | null
          date: string
          early_leave_minutes?: number | null
          employee_id: string
          id?: string
          is_approved?: boolean | null
          is_early_leave?: boolean | null
          is_late?: boolean | null
          late_minutes?: number | null
          location_id?: string | null
          manager_notes?: string | null
          notes?: string | null
          overtime_hours?: number | null
          shift_assignment_id?: string | null
          shift_end_check_in?: string | null
          shift_end_check_out?: string | null
          shift_start_check_in?: string | null
          shift_start_check_out?: string | null
          status?: string | null
          total_work_hours?: number | null
          updated_at?: string | null
          work_shift_id?: string | null
        }
        Update: {
          approval_required?: boolean | null
          approved_at?: string | null
          approved_by?: string | null
          attendance_setting_id?: string | null
          break_time?: number | null
          check_in_latitude?: number | null
          check_in_longitude?: number | null
          check_in_time?: string | null
          check_out_latitude?: number | null
          check_out_longitude?: number | null
          check_out_time?: string | null
          check_type?: string | null
          created_at?: string | null
          daily_end_check_out?: string | null
          daily_start_check_in?: string | null
          date?: string
          early_leave_minutes?: number | null
          employee_id?: string
          id?: string
          is_approved?: boolean | null
          is_early_leave?: boolean | null
          is_late?: boolean | null
          late_minutes?: number | null
          location_id?: string | null
          manager_notes?: string | null
          notes?: string | null
          overtime_hours?: number | null
          shift_assignment_id?: string | null
          shift_end_check_in?: string | null
          shift_end_check_out?: string | null
          shift_start_check_in?: string | null
          shift_start_check_out?: string | null
          status?: string | null
          total_work_hours?: number | null
          updated_at?: string | null
          work_shift_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_attendance_setting_id_fkey"
            columns: ["attendance_setting_id"]
            isOneToOne: false
            referencedRelation: "attendance_settings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "attendance_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_shift_assignment_id_fkey"
            columns: ["shift_assignment_id"]
            isOneToOne: false
            referencedRelation: "shift_assignments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_work_shift_id_fkey"
            columns: ["work_shift_id"]
            isOneToOne: false
            referencedRelation: "work_shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_assignments: {
        Row: {
          attendance_setting_id: string
          created_at: string | null
          created_by: string
          department_id: string | null
          effective_from: string
          effective_to: string | null
          employee_id: string | null
          id: string
          is_active: boolean | null
          location_id: string | null
          position_id: string | null
          updated_at: string | null
          work_shift_id: string | null
        }
        Insert: {
          attendance_setting_id: string
          created_at?: string | null
          created_by: string
          department_id?: string | null
          effective_from?: string
          effective_to?: string | null
          employee_id?: string | null
          id?: string
          is_active?: boolean | null
          location_id?: string | null
          position_id?: string | null
          updated_at?: string | null
          work_shift_id?: string | null
        }
        Update: {
          attendance_setting_id?: string
          created_at?: string | null
          created_by?: string
          department_id?: string | null
          effective_from?: string
          effective_to?: string | null
          employee_id?: string | null
          id?: string
          is_active?: boolean | null
          location_id?: string | null
          position_id?: string | null
          updated_at?: string | null
          work_shift_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_assignments_attendance_setting_id_fkey"
            columns: ["attendance_setting_id"]
            isOneToOne: false
            referencedRelation: "attendance_settings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_assignments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_assignments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_assignments_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "attendance_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_assignments_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_assignments_work_shift_id_fkey"
            columns: ["work_shift_id"]
            isOneToOne: false
            referencedRelation: "work_shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_check_locations: {
        Row: {
          address: string | null
          attendance_id: string
          check_type: string
          created_at: string | null
          id: string
          latitude: number
          longitude: number
          timestamp: string | null
        }
        Insert: {
          address?: string | null
          attendance_id: string
          check_type: string
          created_at?: string | null
          id?: string
          latitude: number
          longitude: number
          timestamp?: string | null
        }
        Update: {
          address?: string | null
          attendance_id?: string
          check_type?: string
          created_at?: string | null
          id?: string
          latitude?: number
          longitude?: number
          timestamp?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_check_locations_attendance_id_fkey"
            columns: ["attendance_id"]
            isOneToOne: false
            referencedRelation: "attendance"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_locations: {
        Row: {
          address: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          latitude: number
          longitude: number
          name: string
          radius_meters: number | null
          updated_at: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          latitude: number
          longitude: number
          name: string
          radius_meters?: number | null
          updated_at?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number
          longitude?: number
          name?: string
          radius_meters?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      attendance_reports: {
        Row: {
          created_at: string | null
          date_from: string
          date_to: string
          file_url: string | null
          filters: Json | null
          generated_at: string | null
          generated_by: string
          id: string
          name: string
          report_type: string
        }
        Insert: {
          created_at?: string | null
          date_from: string
          date_to: string
          file_url?: string | null
          filters?: Json | null
          generated_at?: string | null
          generated_by: string
          id?: string
          name: string
          report_type: string
        }
        Update: {
          created_at?: string | null
          date_from?: string
          date_to?: string
          file_url?: string | null
          filters?: Json | null
          generated_at?: string | null
          generated_by?: string
          id?: string
          name?: string
          report_type?: string
        }
        Relationships: []
      }
      attendance_settings: {
        Row: {
          allow_multiple_checkins: boolean | null
          break_end_time: string | null
          break_start_time: string | null
          check_type_config: string | null
          count_early_checkin_as_work: boolean | null
          count_late_checkout_as_work: boolean | null
          created_at: string | null
          created_by: string
          description: string | null
          early_checkin_allowed_minutes: number | null
          early_leave_threshold_minutes: number | null
          gps_radius_meters: number | null
          id: string
          is_default: boolean | null
          late_checkout_allowed_minutes: number | null
          late_threshold_minutes: number | null
          name: string
          overtime_start_after_minutes: number | null
          require_daily_end_checkout: boolean | null
          require_daily_start_checkin: boolean | null
          require_gps_check: boolean | null
          require_shift_end_checkin: boolean | null
          require_shift_end_checkout: boolean | null
          require_shift_start_checkin: boolean | null
          require_shift_start_checkout: boolean | null
          saturday_work_enabled: boolean | null
          saturday_work_type: string | null
          status: string | null
          updated_at: string | null
          weekend_work_allowed: boolean | null
          work_end_time: string
          work_start_time: string
        }
        Insert: {
          allow_multiple_checkins?: boolean | null
          break_end_time?: string | null
          break_start_time?: string | null
          check_type_config?: string | null
          count_early_checkin_as_work?: boolean | null
          count_late_checkout_as_work?: boolean | null
          created_at?: string | null
          created_by: string
          description?: string | null
          early_checkin_allowed_minutes?: number | null
          early_leave_threshold_minutes?: number | null
          gps_radius_meters?: number | null
          id?: string
          is_default?: boolean | null
          late_checkout_allowed_minutes?: number | null
          late_threshold_minutes?: number | null
          name: string
          overtime_start_after_minutes?: number | null
          require_daily_end_checkout?: boolean | null
          require_daily_start_checkin?: boolean | null
          require_gps_check?: boolean | null
          require_shift_end_checkin?: boolean | null
          require_shift_end_checkout?: boolean | null
          require_shift_start_checkin?: boolean | null
          require_shift_start_checkout?: boolean | null
          saturday_work_enabled?: boolean | null
          saturday_work_type?: string | null
          status?: string | null
          updated_at?: string | null
          weekend_work_allowed?: boolean | null
          work_end_time?: string
          work_start_time?: string
        }
        Update: {
          allow_multiple_checkins?: boolean | null
          break_end_time?: string | null
          break_start_time?: string | null
          check_type_config?: string | null
          count_early_checkin_as_work?: boolean | null
          count_late_checkout_as_work?: boolean | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          early_checkin_allowed_minutes?: number | null
          early_leave_threshold_minutes?: number | null
          gps_radius_meters?: number | null
          id?: string
          is_default?: boolean | null
          late_checkout_allowed_minutes?: number | null
          late_threshold_minutes?: number | null
          name?: string
          overtime_start_after_minutes?: number | null
          require_daily_end_checkout?: boolean | null
          require_daily_start_checkin?: boolean | null
          require_gps_check?: boolean | null
          require_shift_end_checkin?: boolean | null
          require_shift_end_checkout?: boolean | null
          require_shift_start_checkin?: boolean | null
          require_shift_start_checkout?: boolean | null
          saturday_work_enabled?: boolean | null
          saturday_work_type?: string | null
          status?: string | null
          updated_at?: string | null
          weekend_work_allowed?: boolean | null
          work_end_time?: string
          work_start_time?: string
        }
        Relationships: []
      }
      company_policies: {
        Row: {
          category: string
          content: string
          created_at: string
          created_by: string
          effective_date: string
          expiry_date: string | null
          id: string
          status: string
          title: string
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          category: string
          content: string
          created_at?: string
          created_by: string
          effective_date?: string
          expiry_date?: string | null
          id?: string
          status?: string
          title: string
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          category?: string
          content?: string
          created_at?: string
          created_by?: string
          effective_date?: string
          expiry_date?: string | null
          id?: string
          status?: string
          title?: string
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: []
      }
      competency_frameworks: {
        Row: {
          competencies: Json
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          name: string
          position_id: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          competencies?: Json
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          name: string
          position_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          competencies?: Json
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          position_id?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "competency_frameworks_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
        ]
      }
      contracts: {
        Row: {
          contract_type: string
          created_at: string | null
          employee_id: string | null
          end_date: string | null
          id: string
          salary: number
          signed_date: string | null
          start_date: string
          status: string | null
          terms: string | null
          updated_at: string | null
        }
        Insert: {
          contract_type: string
          created_at?: string | null
          employee_id?: string | null
          end_date?: string | null
          id?: string
          salary: number
          signed_date?: string | null
          start_date: string
          status?: string | null
          terms?: string | null
          updated_at?: string | null
        }
        Update: {
          contract_type?: string
          created_at?: string | null
          employee_id?: string | null
          end_date?: string | null
          id?: string
          salary?: number
          signed_date?: string | null
          start_date?: string
          status?: string | null
          terms?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "contracts_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      departments: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          parent_id: string | null
          status: Database["public"]["Enums"]["status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          parent_id?: string | null
          status?: Database["public"]["Enums"]["status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          parent_id?: string | null
          status?: Database["public"]["Enums"]["status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "departments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      disciplinary_actions: {
        Row: {
          action_date: string
          action_type: string
          created_at: string | null
          description: string | null
          employee_id: string | null
          id: string
          issued_by: string | null
          reason: string
          status: string | null
        }
        Insert: {
          action_date: string
          action_type: string
          created_at?: string | null
          description?: string | null
          employee_id?: string | null
          id?: string
          issued_by?: string | null
          reason: string
          status?: string | null
        }
        Update: {
          action_date?: string
          action_type?: string
          created_at?: string | null
          description?: string | null
          employee_id?: string | null
          id?: string
          issued_by?: string | null
          reason?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "disciplinary_actions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disciplinary_actions_issued_by_fkey"
            columns: ["issued_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_attachments: {
        Row: {
          created_at: string | null
          employee_id: string | null
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string | null
          employee_id?: string | null
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string | null
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_attachments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_competency_assessments: {
        Row: {
          assessed_at: string | null
          assessed_by: string | null
          assessment_data: Json
          competency_framework_id: string | null
          created_at: string | null
          employee_id: string | null
          id: string
          notes: string | null
          overall_score: number | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          assessed_at?: string | null
          assessed_by?: string | null
          assessment_data?: Json
          competency_framework_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          notes?: string | null
          overall_score?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          assessed_at?: string | null
          assessed_by?: string | null
          assessment_data?: Json
          competency_framework_id?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          notes?: string | null
          overall_score?: number | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_competency_assessments_competency_framework_id_fkey"
            columns: ["competency_framework_id"]
            isOneToOne: false
            referencedRelation: "competency_frameworks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_competency_assessments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_evaluations: {
        Row: {
          comments: string | null
          created_at: string | null
          employee_id: string | null
          evaluation_period: string
          evaluator_id: string | null
          goals: string | null
          id: string
          month: number | null
          performance_score: number | null
          quarter: number | null
          status: string | null
          strengths: string | null
          updated_at: string | null
          weaknesses: string | null
          year: number
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          employee_id?: string | null
          evaluation_period: string
          evaluator_id?: string | null
          goals?: string | null
          id?: string
          month?: number | null
          performance_score?: number | null
          quarter?: number | null
          status?: string | null
          strengths?: string | null
          updated_at?: string | null
          weaknesses?: string | null
          year: number
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          employee_id?: string | null
          evaluation_period?: string
          evaluator_id?: string | null
          goals?: string | null
          id?: string
          month?: number | null
          performance_score?: number | null
          quarter?: number | null
          status?: string | null
          strengths?: string | null
          updated_at?: string | null
          weaknesses?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "employee_evaluations_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_evaluations_evaluator_id_fkey"
            columns: ["evaluator_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employee_training_assignments: {
        Row: {
          assigned_by: string | null
          assigned_date: string | null
          completed_at: string | null
          created_at: string | null
          due_date: string
          employee_id: string | null
          id: string
          notes: string | null
          progress_percentage: number | null
          started_at: string | null
          status: string | null
          training_requirement_id: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_by?: string | null
          assigned_date?: string | null
          completed_at?: string | null
          created_at?: string | null
          due_date: string
          employee_id?: string | null
          id?: string
          notes?: string | null
          progress_percentage?: number | null
          started_at?: string | null
          status?: string | null
          training_requirement_id?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_by?: string | null
          assigned_date?: string | null
          completed_at?: string | null
          created_at?: string | null
          due_date?: string
          employee_id?: string | null
          id?: string
          notes?: string | null
          progress_percentage?: number | null
          started_at?: string | null
          status?: string | null
          training_requirement_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employee_training_assignments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employee_training_assignments_training_requirement_id_fkey"
            columns: ["training_requirement_id"]
            isOneToOne: false
            referencedRelation: "training_requirements"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          address: string | null
          auth_user_id: string | null
          avatar_url: string | null
          contract_file_url: string | null
          created_at: string | null
          cv_file_url: string | null
          department_id: string | null
          email: string
          emergency_contact_name: string | null
          emergency_contact_phone: string | null
          employee_code: string
          employee_level: Database["public"]["Enums"]["employee_level"] | null
          full_name: string
          hire_date: string | null
          id: string
          job_description: string | null
          manager_id: string | null
          notes: string | null
          phone: string | null
          position_id: string | null
          profile_id: string | null
          salary: number | null
          updated_at: string | null
          work_status: string | null
        }
        Insert: {
          address?: string | null
          auth_user_id?: string | null
          avatar_url?: string | null
          contract_file_url?: string | null
          created_at?: string | null
          cv_file_url?: string | null
          department_id?: string | null
          email: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_code: string
          employee_level?: Database["public"]["Enums"]["employee_level"] | null
          full_name: string
          hire_date?: string | null
          id?: string
          job_description?: string | null
          manager_id?: string | null
          notes?: string | null
          phone?: string | null
          position_id?: string | null
          profile_id?: string | null
          salary?: number | null
          updated_at?: string | null
          work_status?: string | null
        }
        Update: {
          address?: string | null
          auth_user_id?: string | null
          avatar_url?: string | null
          contract_file_url?: string | null
          created_at?: string | null
          cv_file_url?: string | null
          department_id?: string | null
          email?: string
          emergency_contact_name?: string | null
          emergency_contact_phone?: string | null
          employee_code?: string
          employee_level?: Database["public"]["Enums"]["employee_level"] | null
          full_name?: string
          hire_date?: string | null
          id?: string
          job_description?: string | null
          manager_id?: string | null
          notes?: string | null
          phone?: string | null
          position_id?: string | null
          profile_id?: string | null
          salary?: number | null
          updated_at?: string | null
          work_status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "employees_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "employees_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      holidays: {
        Row: {
          created_at: string | null
          date: string
          description: string | null
          id: string
          is_active: boolean | null
          is_recurring: boolean | null
          name: string
          updated_at: string | null
          year: number | null
        }
        Insert: {
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_recurring?: boolean | null
          name: string
          updated_at?: string | null
          year?: number | null
        }
        Update: {
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_recurring?: boolean | null
          name?: string
          updated_at?: string | null
          year?: number | null
        }
        Relationships: []
      }
      kpis: {
        Row: {
          created_at: string | null
          current_value: number | null
          description: string | null
          employee_id: string
          id: string
          name: string
          period: string
          status: string | null
          target_value: number | null
          unit: string | null
          updated_at: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          employee_id: string
          id?: string
          name: string
          period: string
          status?: string | null
          target_value?: number | null
          unit?: string | null
          updated_at?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          current_value?: number | null
          description?: string | null
          employee_id?: string
          id?: string
          name?: string
          period?: string
          status?: string | null
          target_value?: number | null
          unit?: string | null
          updated_at?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "kpis_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_requests: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          attachment_url: string | null
          created_at: string | null
          days_count: number
          employee_id: string | null
          end_date: string
          id: string
          leave_type: string
          leave_type_id: string | null
          manager_notes: string | null
          reason: string | null
          start_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          attachment_url?: string | null
          created_at?: string | null
          days_count: number
          employee_id?: string | null
          end_date: string
          id?: string
          leave_type?: string
          leave_type_id?: string | null
          manager_notes?: string | null
          reason?: string | null
          start_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          attachment_url?: string | null
          created_at?: string | null
          days_count?: number
          employee_id?: string | null
          end_date?: string
          id?: string
          leave_type?: string
          leave_type_id?: string | null
          manager_notes?: string | null
          reason?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leave_requests_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_requests_leave_type_id_fkey"
            columns: ["leave_type_id"]
            isOneToOne: false
            referencedRelation: "leave_types"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_types: {
        Row: {
          color: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_active: boolean | null
          is_paid: boolean | null
          max_days_per_year: number | null
          name: string
          requires_approval: boolean | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_paid?: boolean | null
          max_days_per_year?: number | null
          name: string
          requires_approval?: boolean | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          is_paid?: boolean | null
          max_days_per_year?: number | null
          name?: string
          requires_approval?: boolean | null
          updated_at?: string | null
        }
        Relationships: []
      }
      okrs: {
        Row: {
          created_at: string | null
          description: string | null
          employee_id: string
          id: string
          key_results: Json | null
          objectives: Json | null
          progress: number | null
          quarter: string
          status: string | null
          title: string
          updated_at: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          employee_id: string
          id?: string
          key_results?: Json | null
          objectives?: Json | null
          progress?: number | null
          quarter: string
          status?: string | null
          title: string
          updated_at?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          employee_id?: string
          id?: string
          key_results?: Json | null
          objectives?: Json | null
          progress?: number | null
          quarter?: string
          status?: string | null
          title?: string
          updated_at?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "okrs_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_details: {
        Row: {
          absent_days: number
          allowances: number
          base_salary: number
          bonus: number
          created_at: string | null
          deductions: number
          employee_id: string
          gross_salary: number
          id: string
          insurance_amount: number
          late_days: number
          net_salary: number
          notes: string | null
          overtime_amount: number
          overtime_hours: number
          payroll_period_id: string
          penalties: number
          present_days: number
          tax_amount: number
          updated_at: string | null
          working_days: number
        }
        Insert: {
          absent_days?: number
          allowances?: number
          base_salary?: number
          bonus?: number
          created_at?: string | null
          deductions?: number
          employee_id: string
          gross_salary?: number
          id?: string
          insurance_amount?: number
          late_days?: number
          net_salary?: number
          notes?: string | null
          overtime_amount?: number
          overtime_hours?: number
          payroll_period_id: string
          penalties?: number
          present_days?: number
          tax_amount?: number
          updated_at?: string | null
          working_days?: number
        }
        Update: {
          absent_days?: number
          allowances?: number
          base_salary?: number
          bonus?: number
          created_at?: string | null
          deductions?: number
          employee_id?: string
          gross_salary?: number
          id?: string
          insurance_amount?: number
          late_days?: number
          net_salary?: number
          notes?: string | null
          overtime_amount?: number
          overtime_hours?: number
          payroll_period_id?: string
          penalties?: number
          present_days?: number
          tax_amount?: number
          updated_at?: string | null
          working_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "payroll_details_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payroll_details_payroll_period_id_fkey"
            columns: ["payroll_period_id"]
            isOneToOne: false
            referencedRelation: "payroll_periods"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll_periods: {
        Row: {
          created_at: string | null
          created_by: string
          end_date: string
          id: string
          month: number
          name: string
          processed_at: string | null
          processed_by: string | null
          start_date: string
          status: string | null
          total_amount: number | null
          total_employees: number | null
          updated_at: string | null
          year: number
        }
        Insert: {
          created_at?: string | null
          created_by: string
          end_date: string
          id?: string
          month: number
          name: string
          processed_at?: string | null
          processed_by?: string | null
          start_date: string
          status?: string | null
          total_amount?: number | null
          total_employees?: number | null
          updated_at?: string | null
          year: number
        }
        Update: {
          created_at?: string | null
          created_by?: string
          end_date?: string
          id?: string
          month?: number
          name?: string
          processed_at?: string | null
          processed_by?: string | null
          start_date?: string
          status?: string | null
          total_amount?: number | null
          total_employees?: number | null
          updated_at?: string | null
          year?: number
        }
        Relationships: []
      }
      performance_assignments: {
        Row: {
          assigned_at: string | null
          created_at: string | null
          created_by: string
          description: string | null
          employee_id: string | null
          id: string
          kpi_target: number
          kpi_unit: string | null
          performance_cycle_id: string | null
          salary_percentage: number
          status: string | null
          updated_at: string | null
          work_group_id: string | null
        }
        Insert: {
          assigned_at?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          employee_id?: string | null
          id?: string
          kpi_target: number
          kpi_unit?: string | null
          performance_cycle_id?: string | null
          salary_percentage: number
          status?: string | null
          updated_at?: string | null
          work_group_id?: string | null
        }
        Update: {
          assigned_at?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          employee_id?: string | null
          id?: string
          kpi_target?: number
          kpi_unit?: string | null
          performance_cycle_id?: string | null
          salary_percentage?: number
          status?: string | null
          updated_at?: string | null
          work_group_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_assignments_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_assignments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_assignments_performance_cycle_id_fkey"
            columns: ["performance_cycle_id"]
            isOneToOne: false
            referencedRelation: "performance_cycles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_assignments_work_group_id_fkey"
            columns: ["work_group_id"]
            isOneToOne: false
            referencedRelation: "work_groups"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_cycles: {
        Row: {
          created_at: string | null
          created_by: string
          end_date: string
          id: string
          name: string
          start_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          end_date: string
          id?: string
          name: string
          start_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          end_date?: string
          id?: string
          name?: string
          start_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_cycles_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_evaluations: {
        Row: {
          comments: string | null
          created_at: string | null
          evaluated_at: string | null
          evaluated_by: string
          final_score: number | null
          id: string
          performance_assignment_id: string | null
          quality_percentage: number | null
          quality_rating: number | null
          quantity_score: number | null
          updated_at: string | null
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          evaluated_at?: string | null
          evaluated_by: string
          final_score?: number | null
          id?: string
          performance_assignment_id?: string | null
          quality_percentage?: number | null
          quality_rating?: number | null
          quantity_score?: number | null
          updated_at?: string | null
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          evaluated_at?: string | null
          evaluated_by?: string
          final_score?: number | null
          id?: string
          performance_assignment_id?: string | null
          quality_percentage?: number | null
          quality_rating?: number | null
          quantity_score?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_evaluations_evaluated_by_fkey"
            columns: ["evaluated_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_evaluations_performance_assignment_id_fkey"
            columns: ["performance_assignment_id"]
            isOneToOne: false
            referencedRelation: "performance_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_reports: {
        Row: {
          actual_quantity: number | null
          attachments: Json | null
          created_at: string | null
          id: string
          performance_assignment_id: string | null
          report_content: string | null
          submitted_at: string | null
          updated_at: string | null
        }
        Insert: {
          actual_quantity?: number | null
          attachments?: Json | null
          created_at?: string | null
          id?: string
          performance_assignment_id?: string | null
          report_content?: string | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Update: {
          actual_quantity?: number | null
          attachments?: Json | null
          created_at?: string | null
          id?: string
          performance_assignment_id?: string | null
          report_content?: string | null
          submitted_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_reports_performance_assignment_id_fkey"
            columns: ["performance_assignment_id"]
            isOneToOne: false
            referencedRelation: "performance_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      performance_reviews: {
        Row: {
          comments: string | null
          created_at: string | null
          employee_id: string
          id: string
          overall_score: number | null
          review_period_end: string
          review_period_start: string
          reviewer_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          comments?: string | null
          created_at?: string | null
          employee_id: string
          id?: string
          overall_score?: number | null
          review_period_end: string
          review_period_start: string
          reviewer_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          comments?: string | null
          created_at?: string | null
          employee_id?: string
          id?: string
          overall_score?: number | null
          review_period_end?: string
          review_period_start?: string
          reviewer_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "performance_reviews_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "performance_reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      permissions: {
        Row: {
          action: string
          created_at: string | null
          description: string | null
          id: string
          module: string
          name: string
        }
        Insert: {
          action: string
          created_at?: string | null
          description?: string | null
          id?: string
          module: string
          name: string
        }
        Update: {
          action?: string
          created_at?: string | null
          description?: string | null
          id?: string
          module?: string
          name?: string
        }
        Relationships: []
      }
      positions: {
        Row: {
          created_at: string | null
          department_id: string | null
          description: string | null
          id: string
          level: Database["public"]["Enums"]["employee_level"]
          name: string
          status: Database["public"]["Enums"]["status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          level: Database["public"]["Enums"]["employee_level"]
          name: string
          status?: Database["public"]["Enums"]["status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          department_id?: string | null
          description?: string | null
          id?: string
          level?: Database["public"]["Enums"]["employee_level"]
          name?: string
          status?: Database["public"]["Enums"]["status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "positions_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      process_attachments: {
        Row: {
          file_name: string
          file_size: number | null
          file_type: string
          file_url: string
          id: string
          is_active: boolean | null
          process_template_id: string | null
          uploaded_at: string | null
          uploaded_by: string
        }
        Insert: {
          file_name: string
          file_size?: number | null
          file_type: string
          file_url: string
          id?: string
          is_active?: boolean | null
          process_template_id?: string | null
          uploaded_at?: string | null
          uploaded_by: string
        }
        Update: {
          file_name?: string
          file_size?: number | null
          file_type?: string
          file_url?: string
          id?: string
          is_active?: boolean | null
          process_template_id?: string | null
          uploaded_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "process_attachments_process_template_id_fkey"
            columns: ["process_template_id"]
            isOneToOne: false
            referencedRelation: "process_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      process_categories: {
        Row: {
          color: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      process_completions: {
        Row: {
          completed_at: string | null
          employee_id: string | null
          feedback: string | null
          id: string
          process_template_id: string | null
          rating: number | null
          started_at: string | null
          status: string | null
          time_spent_minutes: number | null
        }
        Insert: {
          completed_at?: string | null
          employee_id?: string | null
          feedback?: string | null
          id?: string
          process_template_id?: string | null
          rating?: number | null
          started_at?: string | null
          status?: string | null
          time_spent_minutes?: number | null
        }
        Update: {
          completed_at?: string | null
          employee_id?: string | null
          feedback?: string | null
          id?: string
          process_template_id?: string | null
          rating?: number | null
          started_at?: string | null
          status?: string | null
          time_spent_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "process_completions_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "process_completions_process_template_id_fkey"
            columns: ["process_template_id"]
            isOneToOne: false
            referencedRelation: "process_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      process_instances: {
        Row: {
          assigned_user_id: string | null
          completed_at: string | null
          created_at: string | null
          created_by: string
          current_step: number | null
          department_id: string | null
          description: string | null
          due_date: string | null
          id: string
          name: string
          priority: string | null
          process_template_id: string
          status: string | null
          steps_data: Json | null
          updated_at: string | null
        }
        Insert: {
          assigned_user_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by: string
          current_step?: number | null
          department_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          name: string
          priority?: string | null
          process_template_id: string
          status?: string | null
          steps_data?: Json | null
          updated_at?: string | null
        }
        Update: {
          assigned_user_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          created_by?: string
          current_step?: number | null
          department_id?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          name?: string
          priority?: string | null
          process_template_id?: string
          status?: string | null
          steps_data?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "process_instances_assigned_user_id_fkey"
            columns: ["assigned_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "process_instances_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "process_instances_process_template_id_fkey"
            columns: ["process_template_id"]
            isOneToOne: false
            referencedRelation: "process_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      process_notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          process_template_id: string | null
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          process_template_id?: string | null
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          process_template_id?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "process_notifications_process_template_id_fkey"
            columns: ["process_template_id"]
            isOneToOne: false
            referencedRelation: "process_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      process_revisions: {
        Row: {
          changes_summary: string | null
          content: string | null
          created_at: string | null
          created_by: string
          id: string
          process_template_id: string | null
          steps: Json | null
          version: number
        }
        Insert: {
          changes_summary?: string | null
          content?: string | null
          created_at?: string | null
          created_by: string
          id?: string
          process_template_id?: string | null
          steps?: Json | null
          version: number
        }
        Update: {
          changes_summary?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string
          id?: string
          process_template_id?: string | null
          steps?: Json | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "process_revisions_process_template_id_fkey"
            columns: ["process_template_id"]
            isOneToOne: false
            referencedRelation: "process_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      process_templates: {
        Row: {
          attachments: Json | null
          category: string
          category_id: string | null
          content: string | null
          created_at: string | null
          created_by: string
          description: string | null
          estimated_duration: number | null
          external_links: Json | null
          id: string
          is_active: boolean | null
          name: string
          priority: string | null
          status: string | null
          steps: Json
          tags: string[] | null
          target_ids: string[] | null
          target_type: string | null
          updated_at: string | null
          version: number | null
        }
        Insert: {
          attachments?: Json | null
          category: string
          category_id?: string | null
          content?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          estimated_duration?: number | null
          external_links?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          priority?: string | null
          status?: string | null
          steps: Json
          tags?: string[] | null
          target_ids?: string[] | null
          target_type?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          attachments?: Json | null
          category?: string
          category_id?: string | null
          content?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          estimated_duration?: number | null
          external_links?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          priority?: string | null
          status?: string | null
          steps?: Json
          tags?: string[] | null
          target_ids?: string[] | null
          target_type?: string | null
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "process_templates_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "process_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      processes: {
        Row: {
          assigned_user_id: string | null
          created_at: string | null
          created_by: string
          department_id: string | null
          description: string | null
          id: string
          name: string
          position_id: string | null
          status: Database["public"]["Enums"]["status"] | null
          steps: Json | null
          updated_at: string | null
        }
        Insert: {
          assigned_user_id?: string | null
          created_at?: string | null
          created_by: string
          department_id?: string | null
          description?: string | null
          id?: string
          name: string
          position_id?: string | null
          status?: Database["public"]["Enums"]["status"] | null
          steps?: Json | null
          updated_at?: string | null
        }
        Update: {
          assigned_user_id?: string | null
          created_at?: string | null
          created_by?: string
          department_id?: string | null
          description?: string | null
          id?: string
          name?: string
          position_id?: string | null
          status?: Database["public"]["Enums"]["status"] | null
          steps?: Json | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "processes_assigned_user_id_fkey"
            columns: ["assigned_user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "processes_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          department_id: string | null
          email: string
          employee_code: string | null
          employee_id: string | null
          employee_level: Database["public"]["Enums"]["employee_level"] | null
          full_name: string
          hire_date: string | null
          id: string
          manager_id: string | null
          phone: string | null
          position_id: string | null
          status: Database["public"]["Enums"]["status"] | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          department_id?: string | null
          email: string
          employee_code?: string | null
          employee_id?: string | null
          employee_level?: Database["public"]["Enums"]["employee_level"] | null
          full_name: string
          hire_date?: string | null
          id: string
          manager_id?: string | null
          phone?: string | null
          position_id?: string | null
          status?: Database["public"]["Enums"]["status"] | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          department_id?: string | null
          email?: string
          employee_code?: string | null
          employee_id?: string | null
          employee_level?: Database["public"]["Enums"]["employee_level"] | null
          full_name?: string
          hire_date?: string | null
          id?: string
          manager_id?: string | null
          phone?: string | null
          position_id?: string | null
          status?: Database["public"]["Enums"]["status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_manager_id_fkey"
            columns: ["manager_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      role_permissions: {
        Row: {
          id: string
          permission_id: string | null
          role: Database["public"]["Enums"]["system_role"]
        }
        Insert: {
          id?: string
          permission_id?: string | null
          role: Database["public"]["Enums"]["system_role"]
        }
        Update: {
          id?: string
          permission_id?: string | null
          role?: Database["public"]["Enums"]["system_role"]
        }
        Relationships: [
          {
            foreignKeyName: "role_permissions_permission_id_fkey"
            columns: ["permission_id"]
            isOneToOne: false
            referencedRelation: "permissions"
            referencedColumns: ["id"]
          },
        ]
      }
      salary_configs: {
        Row: {
          absent_penalty_per_day: number | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          insurance_rate: number | null
          is_active: boolean | null
          is_default: boolean | null
          late_penalty_per_hour: number | null
          min_working_hours_per_day: number | null
          name: string
          overtime_rate: number | null
          standard_working_days_per_month: number | null
          tax_rate: number | null
          updated_at: string | null
        }
        Insert: {
          absent_penalty_per_day?: number | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          insurance_rate?: number | null
          is_active?: boolean | null
          is_default?: boolean | null
          late_penalty_per_hour?: number | null
          min_working_hours_per_day?: number | null
          name: string
          overtime_rate?: number | null
          standard_working_days_per_month?: number | null
          tax_rate?: number | null
          updated_at?: string | null
        }
        Update: {
          absent_penalty_per_day?: number | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          insurance_rate?: number | null
          is_active?: boolean | null
          is_default?: boolean | null
          late_penalty_per_hour?: number | null
          min_working_hours_per_day?: number | null
          name?: string
          overtime_rate?: number | null
          standard_working_days_per_month?: number | null
          tax_rate?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      salary_history: {
        Row: {
          allowances: number | null
          base_salary: number
          bonus: number | null
          created_at: string | null
          created_by: string | null
          deductions: number | null
          effective_date: string
          employee_id: string | null
          id: string
          reason: string | null
        }
        Insert: {
          allowances?: number | null
          base_salary: number
          bonus?: number | null
          created_at?: string | null
          created_by?: string | null
          deductions?: number | null
          effective_date: string
          employee_id?: string | null
          id?: string
          reason?: string | null
        }
        Update: {
          allowances?: number | null
          base_salary?: number
          bonus?: number | null
          created_at?: string | null
          created_by?: string | null
          deductions?: number | null
          effective_date?: string
          employee_id?: string | null
          id?: string
          reason?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "salary_history_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "salary_history_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      shift_assignments: {
        Row: {
          created_at: string | null
          created_by: string
          department_id: string | null
          effective_from: string
          effective_to: string | null
          employee_id: string | null
          id: string
          is_active: boolean | null
          position_id: string | null
          updated_at: string | null
          work_shift_id: string
        }
        Insert: {
          created_at?: string | null
          created_by: string
          department_id?: string | null
          effective_from?: string
          effective_to?: string | null
          employee_id?: string | null
          id?: string
          is_active?: boolean | null
          position_id?: string | null
          updated_at?: string | null
          work_shift_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string
          department_id?: string | null
          effective_from?: string
          effective_to?: string | null
          employee_id?: string | null
          id?: string
          is_active?: boolean | null
          position_id?: string | null
          updated_at?: string | null
          work_shift_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shift_assignments_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_assignments_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_assignments_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shift_assignments_work_shift_id_fkey"
            columns: ["work_shift_id"]
            isOneToOne: false
            referencedRelation: "work_shifts"
            referencedColumns: ["id"]
          },
        ]
      }
      training_notifications: {
        Row: {
          created_at: string | null
          employee_training_assignment_id: string | null
          id: string
          is_read: boolean | null
          message: string
          type: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          employee_training_assignment_id?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          type: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          employee_training_assignment_id?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          type?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_notifications_employee_training_assignment_id_fkey"
            columns: ["employee_training_assignment_id"]
            isOneToOne: false
            referencedRelation: "employee_training_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      training_participants: {
        Row: {
          certificate_url: string | null
          completion_date: string | null
          created_at: string | null
          employee_id: string | null
          id: string
          score: number | null
          status: string | null
          training_id: string | null
        }
        Insert: {
          certificate_url?: string | null
          completion_date?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          score?: number | null
          status?: string | null
          training_id?: string | null
        }
        Update: {
          certificate_url?: string | null
          completion_date?: string | null
          created_at?: string | null
          employee_id?: string | null
          id?: string
          score?: number | null
          status?: string | null
          training_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "training_participants_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_participants_training_id_fkey"
            columns: ["training_id"]
            isOneToOne: false
            referencedRelation: "training_programs"
            referencedColumns: ["id"]
          },
        ]
      }
      training_programs: {
        Row: {
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          max_participants: number | null
          name: string
          start_date: string
          status: string | null
          trainer: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          max_participants?: number | null
          name: string
          start_date: string
          status?: string | null
          trainer?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          max_participants?: number | null
          name?: string
          start_date?: string
          status?: string | null
          trainer?: string | null
        }
        Relationships: []
      }
      training_requirements: {
        Row: {
          auto_assign_after_days: number | null
          course_url: string | null
          created_at: string | null
          created_by: string | null
          description: string | null
          duration_days: number
          id: string
          is_active: boolean | null
          name: string
          reason: string | null
          target_ids: string[] | null
          target_type: string
          updated_at: string | null
        }
        Insert: {
          auto_assign_after_days?: number | null
          course_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_days?: number
          id?: string
          is_active?: boolean | null
          name: string
          reason?: string | null
          target_ids?: string[] | null
          target_type?: string
          updated_at?: string | null
        }
        Update: {
          auto_assign_after_days?: number | null
          course_url?: string | null
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          duration_days?: number
          id?: string
          is_active?: boolean | null
          name?: string
          reason?: string | null
          target_ids?: string[] | null
          target_type?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      user_system_roles: {
        Row: {
          granted_at: string | null
          granted_by: string | null
          id: string
          role: Database["public"]["Enums"]["system_role"]
          user_id: string
        }
        Insert: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["system_role"]
          user_id: string
        }
        Update: {
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["system_role"]
          user_id?: string
        }
        Relationships: []
      }
      work_groups: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "work_groups_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      work_history: {
        Row: {
          created_at: string | null
          department_id: string | null
          employee_id: string | null
          end_date: string | null
          id: string
          position_id: string | null
          reason: string | null
          start_date: string
        }
        Insert: {
          created_at?: string | null
          department_id?: string | null
          employee_id?: string | null
          end_date?: string | null
          id?: string
          position_id?: string | null
          reason?: string | null
          start_date: string
        }
        Update: {
          created_at?: string | null
          department_id?: string | null
          employee_id?: string | null
          end_date?: string | null
          id?: string
          position_id?: string | null
          reason?: string | null
          start_date?: string
        }
        Relationships: [
          {
            foreignKeyName: "work_history_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_history_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "work_history_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
        ]
      }
      work_shifts: {
        Row: {
          attendance_setting_id: string | null
          break_duration_minutes: number | null
          color: string | null
          created_at: string | null
          days_of_week: number[]
          end_time: string
          id: string
          is_active: boolean | null
          is_flexible: boolean | null
          max_hours_per_day: number | null
          min_hours_per_day: number | null
          name: string
          saturday_work_sessions: Json | null
          saturday_work_type: string | null
          shift_type: string | null
          start_time: string
          total_work_coefficient: number | null
          updated_at: string | null
          work_sessions: Json | null
        }
        Insert: {
          attendance_setting_id?: string | null
          break_duration_minutes?: number | null
          color?: string | null
          created_at?: string | null
          days_of_week: number[]
          end_time: string
          id?: string
          is_active?: boolean | null
          is_flexible?: boolean | null
          max_hours_per_day?: number | null
          min_hours_per_day?: number | null
          name: string
          saturday_work_sessions?: Json | null
          saturday_work_type?: string | null
          shift_type?: string | null
          start_time: string
          total_work_coefficient?: number | null
          updated_at?: string | null
          work_sessions?: Json | null
        }
        Update: {
          attendance_setting_id?: string | null
          break_duration_minutes?: number | null
          color?: string | null
          created_at?: string | null
          days_of_week?: number[]
          end_time?: string
          id?: string
          is_active?: boolean | null
          is_flexible?: boolean | null
          max_hours_per_day?: number | null
          min_hours_per_day?: number | null
          name?: string
          saturday_work_sessions?: Json | null
          saturday_work_type?: string | null
          shift_type?: string | null
          start_time?: string
          total_work_coefficient?: number | null
          updated_at?: string | null
          work_sessions?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "work_shifts_attendance_setting_id_fkey"
            columns: ["attendance_setting_id"]
            isOneToOne: false
            referencedRelation: "attendance_settings"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      auto_assign_training_requirements: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      has_permission: {
        Args: { _user_id: string; _permission_name: string }
        Returns: boolean
      }
      has_system_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["system_role"]
        }
        Returns: boolean
      }
    }
    Enums: {
      employee_level: "level_1" | "level_2" | "level_3"
      status: "active" | "inactive" | "pending"
      system_role: "super_admin" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      employee_level: ["level_1", "level_2", "level_3"],
      status: ["active", "inactive", "pending"],
      system_role: ["super_admin", "admin"],
    },
  },
} as const
