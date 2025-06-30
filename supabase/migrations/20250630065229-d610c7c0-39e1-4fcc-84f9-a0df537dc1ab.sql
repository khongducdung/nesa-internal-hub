
-- Tạo enum cho vai trò hệ thống
CREATE TYPE public.system_role AS ENUM ('super_admin', 'admin');

-- Tạo enum cho cấp độ nhân sự
CREATE TYPE public.employee_level AS ENUM ('level_1', 'level_2', 'level_3');

-- Tạo enum cho trạng thái
CREATE TYPE public.status AS ENUM ('active', 'inactive', 'pending');

-- Bảng phòng ban
CREATE TABLE public.departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES public.departments(id),
    status public.status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng vị trí công việc
CREATE TABLE public.positions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    department_id UUID REFERENCES public.departments(id) NOT NULL,
    level public.employee_level NOT NULL,
    status public.status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng hồ sơ người dùng mở rộng
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    employee_code VARCHAR(50) UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    avatar_url TEXT,
    department_id UUID REFERENCES public.departments(id),
    position_id UUID REFERENCES public.positions(id),
    employee_level public.employee_level DEFAULT 'level_3',
    manager_id UUID REFERENCES public.profiles(id),
    hire_date DATE,
    status public.status DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng vai trò hệ thống (admin, super_admin)
CREATE TABLE public.user_system_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role public.system_role NOT NULL,
    granted_by UUID REFERENCES auth.users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, role)
);

-- Bảng quyền (permissions)
CREATE TABLE public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    module VARCHAR(100) NOT NULL,
    action VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng phân quyền cho vai trò
CREATE TABLE public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role public.system_role NOT NULL,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE,
    UNIQUE(role, permission_id)
);

-- Bảng quy trình
CREATE TABLE public.processes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    department_id UUID REFERENCES public.departments(id),
    position_id UUID REFERENCES public.positions(id),
    assigned_user_id UUID REFERENCES public.profiles(id),
    steps JSONB,
    status public.status DEFAULT 'active',
    created_by UUID REFERENCES auth.users(id) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng đánh giá hiệu suất
CREATE TABLE public.performance_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES public.profiles(id) NOT NULL,
    reviewer_id UUID REFERENCES public.profiles(id) NOT NULL,
    review_period_start DATE NOT NULL,
    review_period_end DATE NOT NULL,
    overall_score DECIMAL(3,2),
    comments TEXT,
    status VARCHAR(50) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng OKR
CREATE TABLE public.okrs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES public.profiles(id) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    quarter VARCHAR(10) NOT NULL,
    year INTEGER NOT NULL,
    objectives JSONB,
    key_results JSONB,
    progress DECIMAL(5,2) DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bảng KPI
CREATE TABLE public.kpis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES public.profiles(id) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    target_value DECIMAL(10,2),
    current_value DECIMAL(10,2) DEFAULT 0,
    unit VARCHAR(50),
    period VARCHAR(50) NOT NULL,
    year INTEGER NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Kích hoạt RLS cho tất cả bảng
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.positions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_system_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.performance_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.okrs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kpis ENABLE ROW LEVEL SECURITY;

-- Hàm kiểm tra vai trò hệ thống
CREATE OR REPLACE FUNCTION public.has_system_role(_user_id UUID, _role public.system_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_system_roles
        WHERE user_id = _user_id AND role = _role
    )
$$;

-- Hàm kiểm tra quyền
CREATE OR REPLACE FUNCTION public.has_permission(_user_id UUID, _permission_name TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_system_roles usr
        JOIN public.role_permissions rp ON rp.role = usr.role
        JOIN public.permissions p ON p.id = rp.permission_id
        WHERE usr.user_id = _user_id AND p.name = _permission_name
    )
$$;

-- Tạo policies cơ bản cho Super Admin và Admin
CREATE POLICY "Super admins can do everything on departments" ON public.departments
    FOR ALL USING (public.has_system_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can view departments" ON public.departments
    FOR SELECT USING (public.has_system_role(auth.uid(), 'admin'));

CREATE POLICY "Super admins can do everything on positions" ON public.positions
    FOR ALL USING (public.has_system_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can view positions" ON public.positions
    FOR SELECT USING (public.has_system_role(auth.uid(), 'admin'));

CREATE POLICY "Super admins can do everything on profiles" ON public.profiles
    FOR ALL USING (public.has_system_role(auth.uid(), 'super_admin'));

CREATE POLICY "Admins can view profiles" ON public.profiles
    FOR SELECT USING (public.has_system_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Policies cho user_system_roles
CREATE POLICY "Super admins can manage system roles" ON public.user_system_roles
    FOR ALL USING (public.has_system_role(auth.uid(), 'super_admin'));

-- Policies cho permissions và role_permissions
CREATE POLICY "Admins can view permissions" ON public.permissions
    FOR SELECT USING (public.has_system_role(auth.uid(), 'admin') OR public.has_system_role(auth.uid(), 'super_admin'));

CREATE POLICY "Super admins can manage role permissions" ON public.role_permissions
    FOR ALL USING (public.has_system_role(auth.uid(), 'super_admin'));

-- Trigger để tự động tạo profile khi user được tạo
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', 'Chưa cập nhật'),
        NEW.email
    );
    RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Chèn dữ liệu mẫu
-- Quyền cơ bản
INSERT INTO public.permissions (name, description, module, action) VALUES
('manage_departments', 'Quản lý phòng ban', 'hrm', 'manage'),
('view_departments', 'Xem phòng ban', 'hrm', 'view'),
('manage_employees', 'Quản lý nhân viên', 'hrm', 'manage'),
('view_employees', 'Xem nhân viên', 'hrm', 'view'),
('manage_processes', 'Quản lý quy trình', 'process', 'manage'),
('view_processes', 'Xem quy trình', 'process', 'view'),
('manage_performance', 'Quản lý đánh giá hiệu suất', 'performance', 'manage'),
('view_performance', 'Xem đánh giá hiệu suất', 'performance', 'view');

-- Phân quyền cho vai trò
INSERT INTO public.role_permissions (role, permission_id)
SELECT 'super_admin', id FROM public.permissions;

INSERT INTO public.role_permissions (role, permission_id)
SELECT 'admin', id FROM public.permissions WHERE name LIKE 'view_%';

-- Phòng ban mẫu
INSERT INTO public.departments (name, description) VALUES
('Ban Giám Đốc', 'Ban lãnh đạo công ty'),
('Phòng Nhân Sự', 'Quản lý nguồn nhân lực'),
('Phòng Kế Toán', 'Quản lý tài chính kế toán'),
('Phòng Kinh Doanh', 'Phát triển kinh doanh'),
('Phòng Kỹ Thuật', 'Phát triển sản phẩm kỹ thuật');

-- Vị trí công việc mẫu
INSERT INTO public.positions (name, description, department_id, level)
SELECT 
    'Giám Đốc', 'Giám đốc điều hành', 
    d.id, 'level_2'
FROM public.departments d WHERE d.name = 'Ban Giám Đốc';

INSERT INTO public.positions (name, description, department_id, level)
SELECT 
    'Trưởng Phòng Nhân Sự', 'Quản lý phòng nhân sự', 
    d.id, 'level_2'
FROM public.departments d WHERE d.name = 'Phòng Nhân Sự';

INSERT INTO public.positions (name, description, department_id, level)
SELECT 
    'Nhân Viên Nhân Sự', 'Nhân viên bộ phận nhân sự', 
    d.id, 'level_3'
FROM public.departments d WHERE d.name = 'Phòng Nhân Sự';

-- Tạo tài khoản Super Admin
INSERT INTO auth.users (
    instance_id,
    id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    recovery_sent_at,
    last_sign_in_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at,
    confirmation_token,
    email_change,
    email_change_token_new,
    recovery_token
) VALUES (
    '00000000-0000-0000-0000-000000000000',
    gen_random_uuid(),
    'authenticated',
    'authenticated',
    'khongducdung@gmail.com',
    crypt('123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW(),
    '{"provider": "email", "providers": ["email"]}',
    '{"full_name": "Admin"}',
    NOW(),
    NOW(),
    '',
    '',
    '',
    ''
);

-- Gán vai trò Super Admin
INSERT INTO public.user_system_roles (user_id, role)
SELECT id, 'super_admin'
FROM auth.users
WHERE email = 'khongducdung@gmail.com';
