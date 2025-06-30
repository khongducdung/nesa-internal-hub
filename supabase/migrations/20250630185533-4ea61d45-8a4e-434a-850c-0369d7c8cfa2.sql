
-- Thêm các trường mới vào bảng employees
ALTER TABLE public.employees 
ADD COLUMN job_description TEXT,
ADD COLUMN contract_file_url TEXT,
ADD COLUMN cv_file_url TEXT;

-- Tạo bảng để lưu trữ file đính kèm
CREATE TABLE public.employee_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
    file_type VARCHAR(50) NOT NULL, -- 'contract' hoặc 'cv'
    file_name VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_size INTEGER,
    uploaded_by UUID REFERENCES auth.users(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo storage bucket cho employee files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('employee-files', 'employee-files', false);

-- Kích hoạt RLS cho bảng employee_attachments
ALTER TABLE public.employee_attachments ENABLE ROW LEVEL SECURITY;

-- Tạo policies cho employee_attachments
CREATE POLICY "Admins can manage all employee attachments" ON public.employee_attachments
    FOR ALL USING (
        public.has_system_role(auth.uid(), 'super_admin') OR 
        public.has_system_role(auth.uid(), 'admin')
    );

CREATE POLICY "Users can view their own employee attachments" ON public.employee_attachments
    FOR SELECT USING (
        employee_id IN (
            SELECT id FROM public.employees WHERE auth_user_id = auth.uid()
        )
    );

-- Tạo policies cho storage bucket employee-files
CREATE POLICY "Admins can upload employee files" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'employee-files' AND
        (public.has_system_role(auth.uid(), 'super_admin') OR 
         public.has_system_role(auth.uid(), 'admin'))
    );

CREATE POLICY "Admins can view all employee files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'employee-files' AND
        (public.has_system_role(auth.uid(), 'super_admin') OR 
         public.has_system_role(auth.uid(), 'admin'))
    );

CREATE POLICY "Users can view their own employee files" ON storage.objects
    FOR SELECT USING (
        bucket_id = 'employee-files' AND
        EXISTS (
            SELECT 1 FROM public.employees e
            WHERE e.auth_user_id = auth.uid()
            AND (name LIKE '%' || e.employee_code || '%' OR name LIKE '%' || e.id::text || '%')
        )
    );

CREATE POLICY "Admins can update employee files" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'employee-files' AND
        (public.has_system_role(auth.uid(), 'super_admin') OR 
         public.has_system_role(auth.uid(), 'admin'))
    );

CREATE POLICY "Admins can delete employee files" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'employee-files' AND
        (public.has_system_role(auth.uid(), 'super_admin') OR 
         public.has_system_role(auth.uid(), 'admin'))
    );
