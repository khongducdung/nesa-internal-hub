-- Cải tiến và mở rộng hệ thống OKR với các tính năng nâng cao

-- Tạo bảng OKR Check-ins cho tính năng theo dõi định kỳ
CREATE TABLE public.okr_check_ins (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  okr_id UUID REFERENCES public.okr_objectives(id) ON DELETE CASCADE,
  key_result_id UUID REFERENCES public.okr_key_results(id) ON DELETE CASCADE,
  check_in_type VARCHAR NOT NULL CHECK (check_in_type IN ('weekly', 'monthly', 'quarterly')),
  confidence_level INTEGER NOT NULL CHECK (confidence_level >= 1 AND confidence_level <= 5),
  status_update TEXT NOT NULL,
  challenges TEXT,
  support_needed TEXT,
  next_actions TEXT,
  mood_indicator VARCHAR NOT NULL CHECK (mood_indicator IN ('confident', 'concerned', 'at_risk')),
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  CHECK (okr_id IS NOT NULL OR key_result_id IS NOT NULL)
);

-- Tạo bảng Key Result Updates để theo dõi lịch sử thay đổi
CREATE TABLE public.okr_key_result_updates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key_result_id UUID NOT NULL REFERENCES public.okr_key_results(id) ON DELETE CASCADE,
  previous_value NUMERIC NOT NULL,
  new_value NUMERIC NOT NULL,
  progress_change NUMERIC NOT NULL,
  notes TEXT,
  evidence_urls JSONB DEFAULT '[]'::jsonb,
  updated_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tạo bảng Comments cho OKR và Key Results
CREATE TABLE public.okr_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  okr_id UUID REFERENCES public.okr_objectives(id) ON DELETE CASCADE,
  key_result_id UUID REFERENCES public.okr_key_results(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES public.okr_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_private BOOLEAN DEFAULT false,
  mentioned_users UUID[] DEFAULT '{}',
  attachments JSONB DEFAULT '[]'::jsonb,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  
  CHECK (okr_id IS NOT NULL OR key_result_id IS NOT NULL)
);

-- Tạo bảng Achievements cho gamification
CREATE TABLE public.okr_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  icon VARCHAR,
  type VARCHAR NOT NULL CHECK (type IN ('milestone', 'achievement', 'collaboration', 'excellence')),
  points INTEGER DEFAULT 0,
  conditions JSONB DEFAULT '{}',
  rarity VARCHAR DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
  is_active BOOLEAN DEFAULT true,
  unlock_order INTEGER,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tạo bảng User Achievements
CREATE TABLE public.okr_user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  achievement_id UUID REFERENCES public.okr_achievements(id) NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  progress NUMERIC DEFAULT 100,
  metadata JSONB DEFAULT '{}',
  
  UNIQUE(user_id, achievement_id)
);

-- Tạo bảng Rewards System
CREATE TABLE public.okr_rewards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL UNIQUE,
  okr_coins INTEGER DEFAULT 0,
  trust_points INTEGER DEFAULT 0,
  dedication_points INTEGER DEFAULT 0,
  total_rewards INTEGER DEFAULT 0,
  current_rank INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tạo bảng Reward Transactions
CREATE TABLE public.okr_reward_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  transaction_type VARCHAR NOT NULL CHECK (transaction_type IN ('earn', 'spend', 'transfer')),
  reward_type VARCHAR NOT NULL CHECK (reward_type IN ('okr_coins', 'trust_points', 'dedication_points')),
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reference_id VARCHAR,
  reference_type VARCHAR,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tạo bảng Activity Feed
CREATE TABLE public.okr_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR NOT NULL CHECK (type IN ('create_okr', 'update_progress', 'complete_kr', 'check_in', 'comment', 'achieve_badge')),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  target_id VARCHAR NOT NULL,
  target_type VARCHAR NOT NULL CHECK (target_type IN ('okr', 'key_result')),
  description TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tạo bảng Alerts/Notifications
CREATE TABLE public.okr_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR NOT NULL CHECK (type IN ('overdue', 'no_update', 'low_progress', 'deadline_approaching', 'misaligned')),
  level VARCHAR NOT NULL CHECK (level IN ('low', 'medium', 'high')),
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  target_id VARCHAR NOT NULL,
  target_type VARCHAR NOT NULL CHECK (target_type IN ('okr', 'key_result')),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tạo indexes để tối ưu hiệu suất
CREATE INDEX idx_okr_check_ins_okr ON public.okr_check_ins(okr_id);
CREATE INDEX idx_okr_check_ins_kr ON public.okr_check_ins(key_result_id);
CREATE INDEX idx_okr_check_ins_date ON public.okr_check_ins(created_at);

CREATE INDEX idx_okr_kr_updates_kr ON public.okr_key_result_updates(key_result_id);
CREATE INDEX idx_okr_kr_updates_date ON public.okr_key_result_updates(created_at);

CREATE INDEX idx_okr_comments_okr ON public.okr_comments(okr_id);
CREATE INDEX idx_okr_comments_kr ON public.okr_comments(key_result_id);
CREATE INDEX idx_okr_comments_parent ON public.okr_comments(parent_comment_id);

CREATE INDEX idx_okr_activities_user ON public.okr_activities(user_id);
CREATE INDEX idx_okr_activities_target ON public.okr_activities(target_id, target_type);
CREATE INDEX idx_okr_activities_date ON public.okr_activities(created_at);

CREATE INDEX idx_okr_alerts_user ON public.okr_alerts(user_id);
CREATE INDEX idx_okr_alerts_unread ON public.okr_alerts(user_id, is_read) WHERE is_read = false;

-- Tạo triggers cho updated_at
CREATE TRIGGER update_okr_comments_updated_at
  BEFORE UPDATE ON public.okr_comments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_okr_achievements_updated_at
  BEFORE UPDATE ON public.okr_achievements
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_okr_rewards_updated_at
  BEFORE UPDATE ON public.okr_rewards
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Thiết lập RLS cho các bảng mới
ALTER TABLE public.okr_check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_key_result_updates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_reward_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okr_alerts ENABLE ROW LEVEL SECURITY;

-- RLS policies cho okr_check_ins
CREATE POLICY "Users can view check-ins on accessible OKRs" ON public.okr_check_ins
  FOR SELECT USING (
    (okr_id IS NOT NULL AND okr_id IN (
      SELECT id FROM public.okr_objectives WHERE
        owner_type = 'company' OR
        (owner_type = 'department' AND department_id IN (
          SELECT department_id FROM public.employees WHERE auth_user_id = auth.uid()
        )) OR
        (owner_type = 'individual' AND employee_id IN (
          SELECT id FROM public.employees WHERE auth_user_id = auth.uid()
        )) OR
        created_by = auth.uid()
    )) OR
    (key_result_id IS NOT NULL AND key_result_id IN (
      SELECT kr.id FROM okr_key_results kr
      JOIN okr_objectives o ON kr.okr_id = o.id WHERE
        o.owner_type = 'company' OR
        (o.owner_type = 'department' AND o.department_id IN (
          SELECT department_id FROM public.employees WHERE auth_user_id = auth.uid()
        )) OR
        (o.owner_type = 'individual' AND o.employee_id IN (
          SELECT id FROM public.employees WHERE auth_user_id = auth.uid()
        )) OR
        o.created_by = auth.uid()
    ))
  );

CREATE POLICY "Users can create check-ins on accessible OKRs" ON public.okr_check_ins
  FOR INSERT WITH CHECK (
    created_by = auth.uid() AND (
      (okr_id IS NOT NULL AND okr_id IN (
        SELECT id FROM public.okr_objectives WHERE
          owner_type = 'company' OR
          (owner_type = 'department' AND department_id IN (
            SELECT department_id FROM public.employees WHERE auth_user_id = auth.uid()
          )) OR
          (owner_type = 'individual' AND employee_id IN (
            SELECT id FROM public.employees WHERE auth_user_id = auth.uid()
          )) OR
          created_by = auth.uid()
      )) OR
      (key_result_id IS NOT NULL AND key_result_id IN (
        SELECT kr.id FROM okr_key_results kr
        JOIN okr_objectives o ON kr.okr_id = o.id WHERE
          o.owner_type = 'company' OR
          (o.owner_type = 'department' AND o.department_id IN (
            SELECT department_id FROM public.employees WHERE auth_user_id = auth.uid()
          )) OR
          (o.owner_type = 'individual' AND o.employee_id IN (
            SELECT id FROM public.employees WHERE auth_user_id = auth.uid()
          )) OR
          o.created_by = auth.uid()
      ))
    )
  );

-- RLS policies cho okr_comments
CREATE POLICY "Users can view comments on accessible OKRs" ON public.okr_comments
  FOR SELECT USING (
    (okr_id IS NOT NULL AND okr_id IN (
      SELECT id FROM public.okr_objectives WHERE
        owner_type = 'company' OR
        (owner_type = 'department' AND department_id IN (
          SELECT department_id FROM public.employees WHERE auth_user_id = auth.uid()
        )) OR
        (owner_type = 'individual' AND employee_id IN (
          SELECT id FROM public.employees WHERE auth_user_id = auth.uid()
        )) OR
        created_by = auth.uid()
    )) OR
    (key_result_id IS NOT NULL AND key_result_id IN (
      SELECT kr.id FROM okr_key_results kr
      JOIN okr_objectives o ON kr.okr_id = o.id WHERE
        o.owner_type = 'company' OR
        (o.owner_type = 'department' AND o.department_id IN (
          SELECT department_id FROM public.employees WHERE auth_user_id = auth.uid()
        )) OR
        (o.owner_type = 'individual' AND o.employee_id IN (
          SELECT id FROM public.employees WHERE auth_user_id = auth.uid()
        )) OR
        o.created_by = auth.uid()
    ))
  );

CREATE POLICY "Users can create comments on accessible OKRs" ON public.okr_comments
  FOR INSERT WITH CHECK (
    created_by = auth.uid() AND (
      (okr_id IS NOT NULL AND okr_id IN (
        SELECT id FROM public.okr_objectives WHERE
          owner_type = 'company' OR
          (owner_type = 'department' AND department_id IN (
            SELECT department_id FROM public.employees WHERE auth_user_id = auth.uid()
          )) OR
          (owner_type = 'individual' AND employee_id IN (
            SELECT id FROM public.employees WHERE auth_user_id = auth.uid()
          )) OR
          created_by = auth.uid()
      )) OR
      (key_result_id IS NOT NULL AND key_result_id IN (
        SELECT kr.id FROM okr_key_results kr
        JOIN okr_objectives o ON kr.okr_id = o.id WHERE
          o.owner_type = 'company' OR
          (o.owner_type = 'department' AND o.department_id IN (
            SELECT department_id FROM public.employees WHERE auth_user_id = auth.uid()
          )) OR
          (o.owner_type = 'individual' AND o.employee_id IN (
            SELECT id FROM public.employees WHERE auth_user_id = auth.uid()
          )) OR
          o.created_by = auth.uid()
      ))
    )
  );

-- RLS policies cho achievements
CREATE POLICY "Everyone can view active achievements" ON public.okr_achievements
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage achievements" ON public.okr_achievements
  FOR ALL USING (has_system_role(auth.uid(), 'admin'::system_role) OR has_system_role(auth.uid(), 'super_admin'::system_role));

-- RLS policies cho user achievements
CREATE POLICY "Users can view their own achievements" ON public.okr_user_achievements
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can create user achievements" ON public.okr_user_achievements
  FOR INSERT WITH CHECK (true);

-- RLS policies cho rewards
CREATE POLICY "Users can view their own rewards" ON public.okr_rewards
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view all rewards" ON public.okr_rewards
  FOR SELECT USING (has_system_role(auth.uid(), 'admin'::system_role) OR has_system_role(auth.uid(), 'super_admin'::system_role));

-- RLS policies cho alerts
CREATE POLICY "Users can view their own alerts" ON public.okr_alerts
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update their own alerts" ON public.okr_alerts
  FOR UPDATE USING (user_id = auth.uid());

-- Tạo dữ liệu demo cho achievements
INSERT INTO public.okr_achievements (name, description, icon, type, points, rarity, conditions, created_by) VALUES
('Starter', 'Tạo OKR đầu tiên', '🚀', 'milestone', 10, 'common', '{"first_okr": true}', (SELECT id FROM auth.users LIMIT 1)),
('Consistent Tracker', 'Cập nhật tiến độ 5 tuần liên tiếp', '📈', 'achievement', 50, 'rare', '{"consecutive_updates": 5}', (SELECT id FROM auth.users LIMIT 1)),
('Goal Crusher', 'Hoàn thành 100% OKR', '🎯', 'achievement', 100, 'epic', '{"okr_completion": 100}', (SELECT id FROM auth.users LIMIT 1)),
('Team Player', 'Được 10 comments tích cực', '🤝', 'collaboration', 30, 'common', '{"positive_comments": 10}', (SELECT id FROM auth.users LIMIT 1)),
('Excellence Award', 'Đạt trên 90% trong 3 chu kỳ liên tiếp', '👑', 'excellence', 200, 'legendary', '{"consecutive_excellent": 3}', (SELECT id FROM auth.users LIMIT 1));

-- Tạo rewards cho user hiện có
INSERT INTO public.okr_rewards (user_id) 
SELECT id FROM auth.users 
ON CONFLICT (user_id) DO NOTHING;