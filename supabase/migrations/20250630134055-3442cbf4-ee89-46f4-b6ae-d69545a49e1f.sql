
-- Xóa bảng positions nếu tồn tại để tạo lại với cấu trúc đúng
DROP TABLE IF EXISTS public.positions CASCADE;

-- Tạo lại bảng positions với department_id có thể NULL
CREATE TABLE public.positions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  department_id UUID REFERENCES public.departments(id),
  level employee_level NOT NULL,
  status status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tạo các bảng khác
CREATE TABLE IF NOT EXISTS public.work_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  department_id UUID REFERENCES public.departments(id),
  position_id UUID REFERENCES public.positions(id),
  start_date DATE NOT NULL,
  end_date DATE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.leave_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  leave_type VARCHAR NOT NULL DEFAULT 'annual',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  days_count INTEGER NOT NULL,
  reason TEXT,
  status VARCHAR DEFAULT 'pending',
  approved_by UUID REFERENCES public.employees(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.salary_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  base_salary NUMERIC NOT NULL,
  allowances NUMERIC DEFAULT 0,
  bonus NUMERIC DEFAULT 0,
  deductions NUMERIC DEFAULT 0,
  effective_date DATE NOT NULL,
  reason TEXT,
  created_by UUID REFERENCES public.employees(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.contracts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  contract_type VARCHAR NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  salary NUMERIC NOT NULL,
  terms TEXT,
  status VARCHAR DEFAULT 'active',
  signed_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.employee_evaluations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  evaluator_id UUID REFERENCES public.employees(id),
  evaluation_period VARCHAR NOT NULL,
  year INTEGER NOT NULL,
  quarter INTEGER,
  month INTEGER,
  performance_score NUMERIC CHECK (performance_score >= 0 AND performance_score <= 10),
  strengths TEXT,
  weaknesses TEXT,
  goals TEXT,
  comments TEXT,
  status VARCHAR DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.training_programs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  trainer VARCHAR,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  max_participants INTEGER,
  status VARCHAR DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.training_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  training_id UUID REFERENCES public.training_programs(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  status VARCHAR DEFAULT 'enrolled',
  completion_date DATE,
  score NUMERIC,
  certificate_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.disciplinary_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  action_type VARCHAR NOT NULL,
  reason TEXT NOT NULL,
  description TEXT,
  action_date DATE NOT NULL,
  issued_by UUID REFERENCES public.employees(id),
  status VARCHAR DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Thêm các index
CREATE INDEX IF NOT EXISTS idx_employees_department ON public.employees(department_id);
CREATE INDEX IF NOT EXISTS idx_employees_position ON public.employees(position_id);
CREATE INDEX IF NOT EXISTS idx_attendance_employee_date ON public.attendance(employee_id, date);
CREATE INDEX IF NOT EXISTS idx_leave_requests_employee ON public.leave_requests(employee_id);
CREATE INDEX IF NOT EXISTS idx_salary_history_employee ON public.salary_history(employee_id);

-- Thêm dữ liệu mẫu cho positions
INSERT INTO public.positions (name, description, level, status) VALUES
('Giám đốc', 'Giám đốc điều hành công ty', 'level_1', 'active'),
('Phó giám đốc', 'Phó giám đốc điều hành', 'level_1', 'active'),
('Trưởng phòng', 'Trưởng phòng ban', 'level_2', 'active'),
('Phó trưởng phòng', 'Phó trưởng phòng ban', 'level_2', 'active'),
('Nhân viên chính', 'Nhân viên chính thức', 'level_3', 'active'),
('Nhân viên', 'Nhân viên thử việc', 'level_3', 'active'),
('Thực tập sinh', 'Sinh viên thực tập', 'level_3', 'active')
ON CONFLICT DO NOTHING;
