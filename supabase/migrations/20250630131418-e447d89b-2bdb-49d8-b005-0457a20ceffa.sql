
-- Tạo bảng employees để lưu trữ thông tin nhân viên chi tiết
CREATE TABLE public.employees (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    employee_code VARCHAR(50) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    department_id UUID REFERENCES public.departments(id),
    position_id UUID REFERENCES public.positions(id),
    manager_id UUID REFERENCES public.employees(id),
    hire_date DATE,
    salary DECIMAL(15,2),
    employee_level public.employee_level DEFAULT 'level_3',
    work_status VARCHAR(50) DEFAULT 'active',
    address TEXT,
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo bảng process_templates để lưu mẫu quy trình
CREATE TABLE public.process_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    steps JSONB NOT NULL,
    estimated_duration INTEGER, -- thời gian ước tính (phút)
    priority VARCHAR(20) DEFAULT 'medium',
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo bảng process_instances để lưu các instance của quy trình
CREATE TABLE public.process_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    process_template_id UUID REFERENCES public.process_templates(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    assigned_user_id UUID REFERENCES public.profiles(id),
    department_id UUID REFERENCES public.departments(id),
    current_step INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    due_date TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    steps_data JSONB, -- dữ liệu cụ thể cho từng bước
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo bảng attendance để theo dõi chấm công
CREATE TABLE public.attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES public.employees(id) NOT NULL,
    date DATE NOT NULL,
    check_in_time TIMESTAMP WITH TIME ZONE,
    check_out_time TIMESTAMP WITH TIME ZONE,
    break_time INTEGER DEFAULT 0, -- phút nghỉ
    overtime_hours DECIMAL(4,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'present', -- present, absent, late, half_day
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(employee_id, date)
);

-- Kích hoạt RLS cho các bảng mới
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.process_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.process_instances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

-- Tạo policies cho employees
CREATE POLICY "Super admins can manage employees" ON public.employees
    FOR ALL USING (public.has_system_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can view employees" ON public.employees
    FOR SELECT USING (public.has_system_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own employee record" ON public.employees
    FOR SELECT USING (profile_id = auth.uid());

-- Tạo policies cho process_templates
CREATE POLICY "Admins can manage process templates" ON public.process_templates
    FOR ALL USING (
        public.has_system_role(auth.uid(), 'super_admin') OR 
        public.has_system_role(auth.uid(), 'admin')
    );

CREATE POLICY "Users can view active process templates" ON public.process_templates
    FOR SELECT USING (is_active = true);

-- Tạo policies cho process_instances
CREATE POLICY "Admins can manage all process instances" ON public.process_instances
    FOR ALL USING (
        public.has_system_role(auth.uid(), 'super_admin') OR 
        public.has_system_role(auth.uid(), 'admin')
    );

CREATE POLICY "Users can view assigned process instances" ON public.process_instances
    FOR SELECT USING (assigned_user_id = auth.uid());

CREATE POLICY "Users can update assigned process instances" ON public.process_instances
    FOR UPDATE USING (assigned_user_id = auth.uid());

-- Tạo policies cho attendance
CREATE POLICY "Admins can manage all attendance" ON public.attendance
    FOR ALL USING (
        public.has_system_role(auth.uid(), 'super_admin') OR 
        public.has_system_role(auth.uid(), 'admin')
    );

CREATE POLICY "Users can view their own attendance" ON public.attendance
    FOR SELECT USING (
        employee_id IN (
            SELECT id FROM public.employees WHERE profile_id = auth.uid()
        )
    );

-- Thêm dữ liệu mẫu cho employees
INSERT INTO public.employees (employee_code, full_name, email, phone, department_id, position_id, hire_date, work_status) 
SELECT 
    'EMP001', 'Nguyễn Văn An', 'nguyenvanan@company.com', '0901234567',
    d.id, p.id, '2023-01-15', 'active'
FROM public.departments d, public.positions p 
WHERE d.name = 'Phòng Kỹ Thuật' AND p.name LIKE '%Developer%'
LIMIT 1;

INSERT INTO public.employees (employee_code, full_name, email, phone, department_id, position_id, hire_date, work_status) 
SELECT 
    'EMP002', 'Trần Thị Bình', 'tranthibinh@company.com', '0901234568',
    d.id, p.id, '2022-03-20', 'active'
FROM public.departments d, public.positions p 
WHERE d.name = 'Phòng Nhân Sự' AND p.name LIKE '%HR%'
LIMIT 1;

-- Thêm dữ liệu mẫu cho process_templates
INSERT INTO public.process_templates (name, description, category, steps, estimated_duration, created_by)
VALUES 
(
    'Quy trình tuyển dụng nhân viên mới',
    'Quy trình tuyển dụng từ đăng tin đến onboarding',
    'Nhân sự',
    '[
        {"step": 1, "name": "Đăng tin tuyển dụng", "description": "Đăng tin lên các kênh tuyển dụng"},
        {"step": 2, "name": "Sàng lọc CV", "description": "Xem xét và sàng lọc hồ sơ ứng viên"},
        {"step": 3, "name": "Phỏng vấn vòng 1", "description": "Phỏng vấn qua điện thoại hoặc video call"},
        {"step": 4, "name": "Phỏng vấn vòng 2", "description": "Phỏng vấn trực tiếp với trưởng phòng"},
        {"step": 5, "name": "Quyết định tuyển dụng", "description": "Đưa ra quyết định cuối cùng"},
        {"step": 6, "name": "Onboarding", "description": "Hướng dẫn nhân viên mới"}
    ]'::jsonb,
    10080,
    (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com' LIMIT 1)
),
(
    'Quy trình xử lý nghỉ phép',
    'Quy trình xử lý đơn xin nghỉ phép của nhân viên',
    'Hành chính',
    '[
        {"step": 1, "name": "Nộp đơn xin nghỉ", "description": "Nhân viên nộp đơn xin nghỉ phép"},
        {"step": 2, "name": "Trưởng phòng duyệt", "description": "Trưởng phòng xem xét và phê duyệt"},
        {"step": 3, "name": "HR cập nhật", "description": "HR cập nhật vào hệ thống"},
        {"step": 4, "name": "Thông báo kết quả", "description": "Thông báo kết quả cho nhân viên"}
    ]'::jsonb,
    1440,
    (SELECT id FROM auth.users WHERE email = 'khongducdung@gmail.com' LIMIT 1)
);
