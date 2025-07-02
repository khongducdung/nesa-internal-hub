-- Tạo đầy đủ database schema cho hệ thống OKR

-- 1. Tạo enum types cho OKR system
CREATE TYPE public.okr_status AS ENUM ('draft', 'active', 'completed', 'cancelled');
CREATE TYPE public.key_result_status AS ENUM ('not_started', 'on_track', 'at_risk', 'completed');
CREATE TYPE public.okr_owner_type AS ENUM ('company', 'department', 'individual');
CREATE TYPE public.okr_cycle_status AS ENUM ('planning', 'active', 'review', 'closed');
CREATE TYPE public.achievement_type AS ENUM ('milestone', 'achievement', 'collaboration', 'excellence');
CREATE TYPE public.reward_rule_priority AS ENUM ('high', 'medium', 'low');

-- 2. Bảng chu kỳ OKR
CREATE TABLE public.okr_cycles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    quarter VARCHAR(10) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status okr_cycle_status DEFAULT 'planning',
    is_current BOOLEAN DEFAULT false,
    description TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Bảng OKR chính
CREATE TABLE public.okr_objectives (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    description TEXT,
    cycle_id UUID REFERENCES public.okr_cycles(id),
    year INTEGER NOT NULL,
    quarter VARCHAR(10) NOT NULL,
    progress DECIMAL(5,2) DEFAULT 0,
    status okr_status DEFAULT 'draft',
    owner_id UUID NOT NULL, -- có thể là company_id, department_id, hoặc employee_id
    owner_type okr_owner_type NOT NULL,
    department_id UUID REFERENCES public.departments(id),
    employee_id UUID REFERENCES public.employees(id),
    parent_okr_id UUID REFERENCES public.okr_objectives(id),
    weight DECIMAL(5,2) DEFAULT 100,
    start_date DATE,
    end_date DATE,
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    updated_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Bảng Key Results
CREATE TABLE public.okr_key_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    okr_id UUID REFERENCES public.okr_objectives(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    target_value DECIMAL(15,2) NOT NULL,
    current_value DECIMAL(15,2) DEFAULT 0,
    unit VARCHAR(50),
    weight DECIMAL(5,2) DEFAULT 100,
    progress DECIMAL(5,2) DEFAULT 0,
    status key_result_status DEFAULT 'not_started',
    due_date DATE,
    notes TEXT,
    data_source VARCHAR(200),
    measurement_frequency VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Bảng cập nhật tiến độ Key Results
CREATE TABLE public.okr_key_result_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_result_id UUID REFERENCES public.okr_key_results(id) ON DELETE CASCADE,
    previous_value DECIMAL(15,2),
    new_value DECIMAL(15,2) NOT NULL,
    progress_change DECIMAL(5,2),
    notes TEXT,
    evidence_urls JSONB DEFAULT '[]',
    updated_by UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Bảng liên kết OKR (alignment)
CREATE TABLE public.okr_alignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_okr_id UUID REFERENCES public.okr_objectives(id) ON DELETE CASCADE,
    child_okr_id UUID REFERENCES public.okr_objectives(id) ON DELETE CASCADE,
    alignment_percentage DECIMAL(5,2) DEFAULT 100,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(parent_okr_id, child_okr_id)
);

-- 7. Bảng hệ thống thưởng OKR Coins
CREATE TABLE public.okr_rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    okr_coins INTEGER DEFAULT 0,
    trust_points INTEGER DEFAULT 0,
    dedication_points INTEGER DEFAULT 0,
    total_rewards INTEGER DEFAULT 0,
    current_rank INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

-- 8. Bảng lịch sử giao dịch thưởng
CREATE TABLE public.okr_reward_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL, -- 'earn', 'spend', 'transfer'
    reward_type VARCHAR(50) NOT NULL, -- 'okr_coins', 'trust_points', 'dedication_points'
    amount INTEGER NOT NULL,
    reason TEXT,
    reference_id UUID, -- có thể link tới okr_id, key_result_id, etc.
    reference_type VARCHAR(50), -- 'okr_completion', 'key_result_completion', 'peer_recognition', etc.
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Bảng quy tắc thưởng
CREATE TABLE public.okr_reward_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    action VARCHAR(500) NOT NULL,
    conditions JSONB DEFAULT '{}',
    rewards JSONB NOT NULL, -- { "okr_coins": 100, "trust_points": 10, "badges": ["achievement_1"] }
    priority reward_rule_priority DEFAULT 'medium',
    is_active BOOLEAN DEFAULT true,
    usage_count INTEGER DEFAULT 0,
    max_usage_per_user INTEGER,
    max_usage_total INTEGER,
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Bảng huy hiệu (achievements/badges)
CREATE TABLE public.okr_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    description TEXT,
    icon VARCHAR(10), -- emoji hoặc icon class
    type achievement_type NOT NULL,
    points INTEGER DEFAULT 0,
    conditions JSONB DEFAULT '{}',
    rarity VARCHAR(50) DEFAULT 'common', -- common, rare, epic, legendary
    is_active BOOLEAN DEFAULT true,
    unlock_order INTEGER,
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Bảng huy hiệu của người dùng
CREATE TABLE public.okr_user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    achievement_id UUID REFERENCES public.okr_achievements(id) NOT NULL,
    earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    progress DECIMAL(5,2) DEFAULT 100, -- cho các achievement có tiến độ
    metadata JSONB DEFAULT '{}',
    UNIQUE(user_id, achievement_id)
);

-- 12. Bảng cấu hình hệ thống OKR
CREATE TABLE public.okr_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    description TEXT,
    is_system BOOLEAN DEFAULT false,
    updated_by UUID REFERENCES auth.users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. Bảng nhận xét và phản hồi OKR
CREATE TABLE public.okr_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    okr_id UUID REFERENCES public.okr_objectives(id) ON DELETE CASCADE,
    key_result_id UUID REFERENCES public.okr_key_results(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES public.okr_comments(id),
    content TEXT NOT NULL,
    is_private BOOLEAN DEFAULT false,
    mentioned_users UUID[] DEFAULT '{}',
    attachments JSONB DEFAULT '[]',
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CHECK ((okr_id IS NOT NULL) OR (key_result_id IS NOT NULL))
);

-- 14. Bảng cộng tác OKR (collaborative OKRs)
CREATE TABLE public.okr_collaborators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    okr_id UUID REFERENCES public.okr_objectives(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    role VARCHAR(50) NOT NULL, -- 'contributor', 'reviewer', 'stakeholder'
    permissions JSONB DEFAULT '{}',
    contribution_percentage DECIMAL(5,2) DEFAULT 0,
    added_by UUID REFERENCES auth.users(id) NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(okr_id, user_id)
);

-- 15. Bảng báo cáo OKR
CREATE TABLE public.okr_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(200) NOT NULL,
    report_type VARCHAR(100) NOT NULL, -- 'progress', 'performance', 'alignment', 'custom'
    cycle_id UUID REFERENCES public.okr_cycles(id),
    filters JSONB DEFAULT '{}',
    data JSONB DEFAULT '{}',
    file_url TEXT,
    is_scheduled BOOLEAN DEFAULT false,
    schedule_config JSONB DEFAULT '{}',
    generated_by UUID REFERENCES auth.users(id) NOT NULL,
    generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo indexes để tối ưu hiệu suất
CREATE INDEX idx_okr_objectives_owner ON public.okr_objectives(owner_type, owner_id);
CREATE INDEX idx_okr_objectives_cycle ON public.okr_objectives(cycle_id);
CREATE INDEX idx_okr_objectives_parent ON public.okr_objectives(parent_okr_id);
CREATE INDEX idx_okr_objectives_employee ON public.okr_objectives(employee_id);
CREATE INDEX idx_okr_objectives_department ON public.okr_objectives(department_id);
CREATE INDEX idx_okr_key_results_okr ON public.okr_key_results(okr_id);
CREATE INDEX idx_okr_rewards_user ON public.okr_rewards(user_id);
CREATE INDEX idx_okr_reward_transactions_user ON public.okr_reward_transactions(user_id);
CREATE INDEX idx_okr_reward_transactions_type ON public.okr_reward_transactions(transaction_type, reward_type);
CREATE INDEX idx_okr_comments_okr ON public.okr_comments(okr_id);
CREATE INDEX idx_okr_comments_key_result ON public.okr_comments(key_result_id);
CREATE INDEX idx_okr_collaborators_okr ON public.okr_collaborators(okr_id);
CREATE INDEX idx_okr_user_achievements_user ON public.okr_user_achievements(user_id);

-- Triggers để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_okr_cycles_updated_at BEFORE UPDATE ON public.okr_cycles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_okr_objectives_updated_at BEFORE UPDATE ON public.okr_objectives FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_okr_key_results_updated_at BEFORE UPDATE ON public.okr_key_results FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_okr_rewards_updated_at BEFORE UPDATE ON public.okr_rewards FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_okr_reward_rules_updated_at BEFORE UPDATE ON public.okr_reward_rules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_okr_achievements_updated_at BEFORE UPDATE ON public.okr_achievements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_okr_comments_updated_at BEFORE UPDATE ON public.okr_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS cho tất cả bảng OKR
ALTER TABLE public.okr_cycles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_objectives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_key_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_key_result_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_alignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_reward_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_reward_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Policies cho okr_cycles
CREATE POLICY "Managers and admins can manage cycles" ON public.okr_cycles
FOR ALL USING (
    has_system_role(auth.uid(), 'super_admin'::system_role) OR 
    has_system_role(auth.uid(), 'admin'::system_role)
);

CREATE POLICY "Everyone can view active cycles" ON public.okr_cycles
FOR SELECT USING (status = 'active' OR auth.role() = 'authenticated');

-- Policies cho okr_objectives
CREATE POLICY "Admins can manage all objectives" ON public.okr_objectives
FOR ALL USING (
    has_system_role(auth.uid(), 'super_admin'::system_role) OR 
    has_system_role(auth.uid(), 'admin'::system_role)
);

CREATE POLICY "Users can view relevant objectives" ON public.okr_objectives
FOR SELECT USING (
    owner_type = 'company' OR
    (owner_type = 'department' AND department_id IN (
        SELECT department_id FROM employees WHERE auth_user_id = auth.uid()
    )) OR
    (owner_type = 'individual' AND employee_id IN (
        SELECT id FROM employees WHERE auth_user_id = auth.uid()
    )) OR
    created_by = auth.uid()
);

CREATE POLICY "Users can manage their own objectives" ON public.okr_objectives
FOR ALL USING (
    employee_id IN (SELECT id FROM employees WHERE auth_user_id = auth.uid()) OR
    created_by = auth.uid()
);

-- Policies cho okr_key_results  
CREATE POLICY "Users can view key results of accessible objectives" ON public.okr_key_results
FOR SELECT USING (
    okr_id IN (
        SELECT id FROM okr_objectives WHERE 
        owner_type = 'company' OR
        (owner_type = 'department' AND department_id IN (
            SELECT department_id FROM employees WHERE auth_user_id = auth.uid()
        )) OR
        (owner_type = 'individual' AND employee_id IN (
            SELECT id FROM employees WHERE auth_user_id = auth.uid()
        )) OR
        created_by = auth.uid()
    )
);

CREATE POLICY "Users can manage key results of their objectives" ON public.okr_key_results
FOR ALL USING (
    okr_id IN (
        SELECT id FROM okr_objectives WHERE 
        employee_id IN (SELECT id FROM employees WHERE auth_user_id = auth.uid()) OR
        created_by = auth.uid()
    )
);

-- Policies cho okr_rewards
CREATE POLICY "Users can view their own rewards" ON public.okr_rewards
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage all rewards" ON public.okr_rewards
FOR ALL USING (
    has_system_role(auth.uid(), 'super_admin'::system_role) OR 
    has_system_role(auth.uid(), 'admin'::system_role)
);

-- Policies cho okr_reward_transactions
CREATE POLICY "Users can view their own transactions" ON public.okr_reward_transactions
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all transactions" ON public.okr_reward_transactions
FOR SELECT USING (
    has_system_role(auth.uid(), 'super_admin'::system_role) OR 
    has_system_role(auth.uid(), 'admin'::system_role)
);

-- Policies cho okr_achievements
CREATE POLICY "Everyone can view active achievements" ON public.okr_achievements
FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage achievements" ON public.okr_achievements
FOR ALL USING (
    has_system_role(auth.uid(), 'super_admin'::system_role) OR 
    has_system_role(auth.uid(), 'admin'::system_role)
);

-- Policies cho okr_user_achievements
CREATE POLICY "Users can view their own achievements" ON public.okr_user_achievements
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can grant achievements" ON public.okr_user_achievements
FOR INSERT WITH CHECK (true);

-- Policies cho okr_comments
CREATE POLICY "Users can view comments on accessible OKRs" ON public.okr_comments
FOR SELECT USING (
    (okr_id IS NOT NULL AND okr_id IN (
        SELECT id FROM okr_objectives WHERE 
        owner_type = 'company' OR
        (owner_type = 'department' AND department_id IN (
            SELECT department_id FROM employees WHERE auth_user_id = auth.uid()
        )) OR
        (owner_type = 'individual' AND employee_id IN (
            SELECT id FROM employees WHERE auth_user_id = auth.uid()
        )) OR
        created_by = auth.uid()
    )) OR
    (key_result_id IS NOT NULL AND key_result_id IN (
        SELECT kr.id FROM okr_key_results kr
        JOIN okr_objectives o ON kr.okr_id = o.id
        WHERE 
        o.owner_type = 'company' OR
        (o.owner_type = 'department' AND o.department_id IN (
            SELECT department_id FROM employees WHERE auth_user_id = auth.uid()
        )) OR
        (o.owner_type = 'individual' AND o.employee_id IN (
            SELECT id FROM employees WHERE auth_user_id = auth.uid()
        )) OR
        o.created_by = auth.uid()
    ))
);

CREATE POLICY "Users can create comments on accessible OKRs" ON public.okr_comments
FOR INSERT WITH CHECK (
    created_by = auth.uid() AND (
        (okr_id IS NOT NULL AND okr_id IN (
            SELECT id FROM okr_objectives WHERE 
            owner_type = 'company' OR
            (owner_type = 'department' AND department_id IN (
                SELECT department_id FROM employees WHERE auth_user_id = auth.uid()
            )) OR
            (owner_type = 'individual' AND employee_id IN (
                SELECT id FROM employees WHERE auth_user_id = auth.uid()
            )) OR
            created_by = auth.uid()
        )) OR
        (key_result_id IS NOT NULL AND key_result_id IN (
            SELECT kr.id FROM okr_key_results kr
            JOIN okr_objectives o ON kr.okr_id = o.id
            WHERE 
            o.owner_type = 'company' OR
            (o.owner_type = 'department' AND o.department_id IN (
                SELECT department_id FROM employees WHERE auth_user_id = auth.uid()
            )) OR
            (o.owner_type = 'individual' AND o.employee_id IN (
                SELECT id FROM employees WHERE auth_user_id = auth.uid()
            )) OR
            o.created_by = auth.uid()
        ))
    )
);

-- Insert default settings
INSERT INTO public.okr_settings (setting_key, setting_value, description, is_system) VALUES
('okr_coins_per_completion', '100', 'Số OKR Coins nhận được khi hoàn thành OKR', true),
('trust_points_limit_per_day', '10', 'Giới hạn Trust Points có thể tặng mỗi ngày', true),
('dedication_points_limit_per_day', '5', 'Giới hạn Dedication Points có thể tặng mỗi ngày', true),
('bonus_multiplier', '1.5', 'Hệ số nhân thưởng cho hoàn thành sớm', true),
('early_completion_bonus', '50', 'Phần trăm thưởng thêm khi hoàn thành sớm', true),
('enable_public_leaderboard', 'true', 'Hiển thị bảng xếp hạng công khai', false),
('enable_achievements', 'true', 'Kích hoạt hệ thống huy hiệu', false),
('enable_emotional_rewards', 'true', 'Cho phép thưởng cảm xúc', false),
('default_cycle_duration', '90', 'Số ngày mặc định cho một chu kỳ OKR', true),
('auto_create_next_cycle', 'true', 'Tự động tạo chu kỳ tiếp theo', false),
('require_manager_approval', 'true', 'Yêu cầu phê duyệt từ quản lý', false);

-- Insert default achievements
INSERT INTO public.okr_achievements (name, description, icon, type, points, conditions, rarity, created_by) VALUES
('First Goal', 'Hoàn thành OKR đầu tiên', '🎯', 'milestone', 50, '{"okr_completed": 1}', 'common', (SELECT id FROM auth.users LIMIT 1)),
('Speed Runner', 'Hoàn thành OKR trước hạn 3 lần', '⚡', 'achievement', 150, '{"early_completion": 3}', 'rare', (SELECT id FROM auth.users LIMIT 1)),
('Team Player', 'Hỗ trợ đồng nghiệp 10 lần', '🤝', 'collaboration', 200, '{"collaborations": 10}', 'rare', (SELECT id FROM auth.users LIMIT 1)),
('Perfectionist', 'Đạt 100% trong 5 OKR liên tiếp', '💎', 'excellence', 500, '{"perfect_streak": 5}', 'epic', (SELECT id FROM auth.users LIMIT 1)),
('Goal Crusher', 'Vượt mục tiêu 120% trong 1 OKR', '💪', 'excellence', 300, '{"exceed_target": 120}', 'rare', (SELECT id FROM auth.users LIMIT 1));

-- Insert default reward rules
INSERT INTO public.okr_reward_rules (name, category, action, conditions, rewards, priority, created_by) VALUES
('OKR Completion Basic', 'OKR Completion', 'Hoàn thành 100% Key Results', '{"progress": 100, "within_deadline": true}', '{"okr_coins": 100, "trust_points": 10}', 'high', (SELECT id FROM auth.users LIMIT 1)),
('Early Completion Bonus', 'OKR Completion', 'Hoàn thành trước hạn 1 tuần', '{"progress": 100, "days_early": 7}', '{"okr_coins": 150, "trust_points": 15, "badges": ["speed_runner"]}', 'high', (SELECT id FROM auth.users LIMIT 1)),
('Excellence Award', 'Excellence', 'Vượt mục tiêu 120%+', '{"progress": 120}', '{"okr_coins": 200, "trust_points": 20, "badges": ["excellence"]}', 'high', (SELECT id FROM auth.users LIMIT 1)),
('Collaboration Bonus', 'Collaboration', 'Hỗ trợ 3+ OKR của đồng nghiệp', '{"collaborations": 3}', '{"okr_coins": 50, "dedication_points": 5}', 'medium', (SELECT id FROM auth.users LIMIT 1)),
('Leadership Excellence', 'Leadership', 'Team đạt 90%+ OKR', '{"team_avg_progress": 90}', '{"okr_coins": 300, "badges": ["leadership"]}', 'high', (SELECT id FROM auth.users LIMIT 1));