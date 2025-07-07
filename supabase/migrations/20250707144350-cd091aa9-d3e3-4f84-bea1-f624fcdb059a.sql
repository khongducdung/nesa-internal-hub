-- Tạo bảng user_permissions để quản lý quyền riêng biệt cho từng user
CREATE TABLE public.user_permissions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    permission_id UUID REFERENCES public.permissions(id) ON DELETE CASCADE NOT NULL,
    granted_by UUID REFERENCES auth.users(id),
    granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revoked_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    notes TEXT,
    UNIQUE(user_id, permission_id)
);

-- Tạo bảng module_categories để nhóm các module
CREATE TABLE public.module_categories (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cập nhật bảng permissions để thêm thông tin category và mở rộng
ALTER TABLE public.permissions 
ADD COLUMN category_id UUID REFERENCES public.module_categories(id),
ADD COLUMN is_core_feature BOOLEAN DEFAULT false,
ADD COLUMN sort_order INTEGER DEFAULT 0,
ADD COLUMN is_active BOOLEAN DEFAULT true;

-- Enable RLS
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_categories ENABLE ROW LEVEL SECURITY;

-- RLS Policies cho user_permissions
CREATE POLICY "Super admins can manage all user permissions" 
ON public.user_permissions 
FOR ALL 
USING (has_system_role(auth.uid(), 'super_admin'::system_role));

CREATE POLICY "Admins can manage user permissions" 
ON public.user_permissions 
FOR ALL 
USING (has_system_role(auth.uid(), 'admin'::system_role));

-- RLS Policies cho module_categories
CREATE POLICY "Admins can manage module categories" 
ON public.module_categories 
FOR ALL 
USING (has_system_role(auth.uid(), 'admin'::system_role) OR has_system_role(auth.uid(), 'super_admin'::system_role));

CREATE POLICY "Everyone can view active module categories" 
ON public.module_categories 
FOR SELECT 
USING (is_active = true);

-- Cập nhật function has_permission để kiểm tra cả role và user permissions
CREATE OR REPLACE FUNCTION public.has_permission(_user_id UUID, _permission_name TEXT)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        -- Kiểm tra quyền từ role
        SELECT 1 FROM public.user_system_roles usr
        JOIN public.role_permissions rp ON rp.role = usr.role
        JOIN public.permissions p ON p.id = rp.permission_id
        WHERE usr.user_id = _user_id AND p.name = _permission_name
    ) OR EXISTS (
        -- Kiểm tra quyền riêng biệt của user
        SELECT 1 FROM public.user_permissions up
        JOIN public.permissions p ON p.id = up.permission_id
        WHERE up.user_id = _user_id 
        AND p.name = _permission_name 
        AND up.is_active = true 
        AND up.revoked_at IS NULL
    )
$$;

-- Tạo function để lấy tất cả permissions của user
CREATE OR REPLACE FUNCTION public.get_user_permissions(_user_id UUID)
RETURNS TABLE (
    permission_id UUID,
    permission_name TEXT,
    module TEXT,
    action TEXT,
    source TEXT
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
    -- Quyền từ role
    SELECT 
        p.id as permission_id,
        p.name as permission_name,
        p.module,
        p.action,
        'role' as source
    FROM public.user_system_roles usr
    JOIN public.role_permissions rp ON rp.role = usr.role
    JOIN public.permissions p ON p.id = rp.permission_id
    WHERE usr.user_id = _user_id
    
    UNION
    
    -- Quyền riêng biệt
    SELECT 
        p.id as permission_id,
        p.name as permission_name,
        p.module,
        p.action,
        'user' as source
    FROM public.user_permissions up
    JOIN public.permissions p ON p.id = up.permission_id
    WHERE up.user_id = _user_id 
    AND up.is_active = true 
    AND up.revoked_at IS NULL
$$;

-- Thêm dữ liệu mẫu cho module categories
INSERT INTO public.module_categories (name, description, icon, sort_order) VALUES
('HRM', 'Quản lý nhân sự', 'users', 1),
('Attendance', 'Chấm công', 'clock', 2),
('OKR', 'Mục tiêu và kết quả chính', 'target', 3),
('KPI', 'Chỉ số hiệu suất', 'trending-up', 4),
('Performance', 'Đánh giá hiệu suất', 'award', 5),
('Processes', 'Quy trình', 'workflow', 6),
('System', 'Hệ thống', 'settings', 7);

-- Cập nhật permissions hiện tại với category
UPDATE public.permissions 
SET category_id = (SELECT id FROM public.module_categories WHERE name = 'HRM')
WHERE module = 'hrm';

UPDATE public.permissions 
SET category_id = (SELECT id FROM public.module_categories WHERE name = 'Processes')
WHERE module = 'process';

UPDATE public.permissions 
SET category_id = (SELECT id FROM public.module_categories WHERE name = 'Performance')
WHERE module = 'performance';

-- Thêm indexes cho performance
CREATE INDEX idx_user_permissions_user_id ON public.user_permissions(user_id);
CREATE INDEX idx_user_permissions_active ON public.user_permissions(is_active) WHERE is_active = true;
CREATE INDEX idx_permissions_category ON public.permissions(category_id);
CREATE INDEX idx_permissions_module ON public.permissions(module);