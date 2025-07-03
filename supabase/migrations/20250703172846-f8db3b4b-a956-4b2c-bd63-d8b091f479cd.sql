-- Create OKR system database tables
-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.okr_comments CASCADE;
DROP TABLE IF EXISTS public.okr_check_ins CASCADE;
DROP TABLE IF EXISTS public.okr_key_result_updates CASCADE;
DROP TABLE IF EXISTS public.okr_key_results CASCADE;
DROP TABLE IF EXISTS public.okr_objectives CASCADE;
DROP TABLE IF EXISTS public.okr_cycles CASCADE;
DROP TABLE IF EXISTS public.okr_achievements CASCADE;
DROP TABLE IF EXISTS public.user_achievements CASCADE;
DROP TABLE IF EXISTS public.okr_rewards CASCADE;
DROP TABLE IF EXISTS public.reward_transactions CASCADE;

-- Create enums
CREATE TYPE public.okr_owner_type AS ENUM ('company', 'department', 'individual');
CREATE TYPE public.okr_status AS ENUM ('draft', 'active', 'completed', 'cancelled');
CREATE TYPE public.okr_cycle_status AS ENUM ('planning', 'active', 'review', 'closed');
CREATE TYPE public.key_result_status AS ENUM ('not_started', 'on_track', 'at_risk', 'completed');
CREATE TYPE public.check_in_frequency AS ENUM ('weekly', 'bi_weekly', 'monthly');
CREATE TYPE public.alert_level AS ENUM ('low', 'medium', 'high');
CREATE TYPE public.achievement_type AS ENUM ('milestone', 'achievement', 'collaboration', 'excellence');

-- OKR Cycles table
CREATE TABLE public.okr_cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    year INTEGER NOT NULL,
    quarter VARCHAR,
    cycle_type VARCHAR NOT NULL DEFAULT 'quarterly',
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status okr_cycle_status DEFAULT 'planning',
    is_current BOOLEAN DEFAULT false,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- OKR Objectives table
CREATE TABLE public.okr_objectives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    cycle_id UUID REFERENCES public.okr_cycles(id),
    year INTEGER NOT NULL,
    quarter VARCHAR NOT NULL,
    progress NUMERIC DEFAULT 0,
    status okr_status DEFAULT 'draft',
    owner_type okr_owner_type NOT NULL,
    owner_id VARCHAR NOT NULL,
    department_id UUID REFERENCES public.departments(id),
    employee_id UUID REFERENCES public.employees(id),
    parent_okr_id UUID REFERENCES public.okr_objectives(id),
    created_by UUID NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Key Results table
CREATE TABLE public.okr_key_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    okr_id UUID REFERENCES public.okr_objectives(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    target_value NUMERIC NOT NULL,
    current_value NUMERIC DEFAULT 0,
    unit VARCHAR NOT NULL,
    weight NUMERIC NOT NULL,
    progress NUMERIC DEFAULT 0,
    status key_result_status DEFAULT 'not_started',
    due_date DATE,
    responsible_person_id UUID REFERENCES public.employees(id),
    measurement_frequency VARCHAR,
    data_source TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Key Result Updates table
CREATE TABLE public.okr_key_result_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_result_id UUID REFERENCES public.okr_key_results(id) ON DELETE CASCADE,
    previous_value NUMERIC NOT NULL,
    new_value NUMERIC NOT NULL,
    progress_change NUMERIC NOT NULL,
    notes TEXT,
    evidence_urls JSONB DEFAULT '[]',
    updated_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- OKR Check-ins table
CREATE TABLE public.okr_check_ins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    okr_id UUID REFERENCES public.okr_objectives(id),
    key_result_id UUID REFERENCES public.okr_key_results(id),
    check_in_type VARCHAR NOT NULL,
    confidence_level INTEGER NOT NULL,
    status_update TEXT NOT NULL,
    challenges TEXT,
    support_needed TEXT,
    next_actions TEXT,
    mood_indicator VARCHAR NOT NULL,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- OKR Comments table
CREATE TABLE public.okr_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    okr_id UUID REFERENCES public.okr_objectives(id),
    key_result_id UUID REFERENCES public.okr_key_results(id),
    parent_comment_id UUID REFERENCES public.okr_comments(id),
    content TEXT NOT NULL,
    is_private BOOLEAN DEFAULT false,
    mentioned_users UUID[],
    attachments JSONB DEFAULT '[]',
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- OKR Achievements table
CREATE TABLE public.okr_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR NOT NULL,
    description TEXT,
    icon VARCHAR,
    type achievement_type NOT NULL,
    points INTEGER DEFAULT 0,
    conditions JSONB DEFAULT '{}',
    rarity VARCHAR DEFAULT 'common',
    is_active BOOLEAN DEFAULT true,
    unlock_order INTEGER,
    created_by UUID NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User Achievements table
CREATE TABLE public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    achievement_id UUID REFERENCES public.okr_achievements(id),
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    progress NUMERIC DEFAULT 0,
    metadata JSONB DEFAULT '{}'
);

-- OKR Rewards table
CREATE TABLE public.okr_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    okr_coins INTEGER DEFAULT 0,
    trust_points INTEGER DEFAULT 0,
    dedication_points INTEGER DEFAULT 0,
    total_rewards INTEGER DEFAULT 0,
    current_rank INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Reward Transactions table
CREATE TABLE public.reward_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    transaction_type VARCHAR NOT NULL,
    reward_type VARCHAR NOT NULL,
    amount INTEGER NOT NULL,
    reason TEXT NOT NULL,
    reference_id UUID,
    reference_type VARCHAR,
    created_by UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.okr_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_key_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_key_result_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reward_transactions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- OKR Cycles policies
CREATE POLICY "Everyone can view active OKR cycles" ON public.okr_cycles FOR SELECT USING (true);
CREATE POLICY "Admins can manage OKR cycles" ON public.okr_cycles FOR ALL USING (has_system_role(auth.uid(), 'admin'::system_role) OR has_system_role(auth.uid(), 'super_admin'::system_role));

-- OKR Objectives policies
CREATE POLICY "Users can view accessible OKRs" ON public.okr_objectives FOR SELECT USING (
    owner_type = 'company' OR 
    (owner_type = 'department' AND department_id IN (SELECT department_id FROM employees WHERE auth_user_id = auth.uid())) OR
    (owner_type = 'individual' AND employee_id IN (SELECT id FROM employees WHERE auth_user_id = auth.uid())) OR
    created_by = auth.uid()
);

CREATE POLICY "Users can create their own OKRs" ON public.okr_objectives FOR INSERT WITH CHECK (
    created_by = auth.uid() AND (
        owner_type = 'company' OR
        (owner_type = 'department' AND department_id IN (SELECT department_id FROM employees WHERE auth_user_id = auth.uid())) OR
        (owner_type = 'individual' AND employee_id IN (SELECT id FROM employees WHERE auth_user_id = auth.uid()))
    )
);

CREATE POLICY "Users can update their own OKRs" ON public.okr_objectives FOR UPDATE USING (
    created_by = auth.uid() OR
    employee_id IN (SELECT id FROM employees WHERE auth_user_id = auth.uid())
);

CREATE POLICY "Admins can manage all OKRs" ON public.okr_objectives FOR ALL USING (has_system_role(auth.uid(), 'admin'::system_role) OR has_system_role(auth.uid(), 'super_admin'::system_role));

-- Key Results policies
CREATE POLICY "Users can view accessible key results" ON public.okr_key_results FOR SELECT USING (
    okr_id IN (SELECT id FROM okr_objectives WHERE 
        owner_type = 'company' OR 
        (owner_type = 'department' AND department_id IN (SELECT department_id FROM employees WHERE auth_user_id = auth.uid())) OR
        (owner_type = 'individual' AND employee_id IN (SELECT id FROM employees WHERE auth_user_id = auth.uid())) OR
        created_by = auth.uid()
    )
);

CREATE POLICY "Users can update their key results" ON public.okr_key_results FOR UPDATE USING (
    okr_id IN (SELECT id FROM okr_objectives WHERE 
        created_by = auth.uid() OR
        employee_id IN (SELECT id FROM employees WHERE auth_user_id = auth.uid())
    )
);

-- Check-ins policies
CREATE POLICY "Users can view accessible check-ins" ON public.okr_check_ins FOR SELECT USING (
    okr_id IN (SELECT id FROM okr_objectives WHERE 
        owner_type = 'company' OR 
        (owner_type = 'department' AND department_id IN (SELECT department_id FROM employees WHERE auth_user_id = auth.uid())) OR
        (owner_type = 'individual' AND employee_id IN (SELECT id FROM employees WHERE auth_user_id = auth.uid())) OR
        created_by = auth.uid()
    ) OR created_by = auth.uid()
);

CREATE POLICY "Users can create check-ins" ON public.okr_check_ins FOR INSERT WITH CHECK (created_by = auth.uid());

-- Achievements policies
CREATE POLICY "Everyone can view active achievements" ON public.okr_achievements FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage achievements" ON public.okr_achievements FOR ALL USING (has_system_role(auth.uid(), 'admin'::system_role) OR has_system_role(auth.uid(), 'super_admin'::system_role));

-- User achievements policies
CREATE POLICY "Users can view their achievements" ON public.user_achievements FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can create user achievements" ON public.user_achievements FOR INSERT WITH CHECK (true);

-- Rewards policies
CREATE POLICY "Users can view their rewards" ON public.okr_rewards FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "System can manage rewards" ON public.okr_rewards FOR ALL USING (true);

-- Comments policies
CREATE POLICY "Users can view comments on accessible OKRs" ON public.okr_comments FOR SELECT USING (
    okr_id IN (SELECT id FROM okr_objectives WHERE 
        owner_type = 'company' OR 
        (owner_type = 'department' AND department_id IN (SELECT department_id FROM employees WHERE auth_user_id = auth.uid())) OR
        (owner_type = 'individual' AND employee_id IN (SELECT id FROM employees WHERE auth_user_id = auth.uid())) OR
        created_by = auth.uid()
    )
);

CREATE POLICY "Users can create comments" ON public.okr_comments FOR INSERT WITH CHECK (created_by = auth.uid());

-- Create indexes for performance
CREATE INDEX idx_okr_objectives_cycle_id ON public.okr_objectives(cycle_id);
CREATE INDEX idx_okr_objectives_owner ON public.okr_objectives(owner_type, department_id, employee_id);
CREATE INDEX idx_okr_key_results_okr_id ON public.okr_key_results(okr_id);
CREATE INDEX idx_okr_check_ins_okr_id ON public.okr_check_ins(okr_id);
CREATE INDEX idx_user_achievements_user_id ON public.user_achievements(user_id);

-- Insert sample data
INSERT INTO public.okr_cycles (name, year, quarter, cycle_type, start_date, end_date, status, is_current) 
VALUES ('Q4 2024', 2024, 'Q4', 'quarterly', '2024-10-01', '2024-12-31', 'active', true);

-- Create default achievements
INSERT INTO public.okr_achievements (name, description, icon, type, points, rarity, created_by) VALUES
('First OKR', 'Tạo OKR đầu tiên', '🎯', 'milestone', 10, 'common', '00000000-0000-0000-0000-000000000000'),
('Goal Crusher', 'Hoàn thành 100% OKR', '💪', 'achievement', 50, 'rare', '00000000-0000-0000-0000-000000000000'),
('Team Player', 'Hỗ trợ đồng nghiệp đạt OKR', '🤝', 'collaboration', 30, 'common', '00000000-0000-0000-0000-000000000000'),
('Excellence Award', 'Đạt xuất sắc mọi Key Results', '⭐', 'excellence', 100, 'legendary', '00000000-0000-0000-0000-000000000000');