
-- Tạo bảng company_policies để lưu trữ quy định công ty
CREATE TABLE public.company_policies (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL,
  effective_date date NOT NULL DEFAULT current_date,
  expiry_date date,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
  created_by uuid NOT NULL,
  updated_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Bật Row Level Security
ALTER TABLE public.company_policies ENABLE ROW LEVEL SECURITY;

-- Tạo policy cho phép tất cả người dùng đăng nhập xem quy định đang hoạt động
CREATE POLICY "Everyone can view active policies" 
  ON public.company_policies 
  FOR SELECT 
  TO authenticated
  USING (status = 'active');

-- Tạo policy cho phép admin và hr_director thêm quy định
CREATE POLICY "Admin and HR Director can insert policies" 
  ON public.company_policies 
  FOR INSERT 
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_system_roles usr
      WHERE usr.user_id = auth.uid() 
      AND usr.role IN ('admin', 'super_admin')
    )
  );

-- Tạo policy cho phép admin và hr_director cập nhật quy định
CREATE POLICY "Admin and HR Director can update policies" 
  ON public.company_policies 
  FOR UPDATE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_system_roles usr
      WHERE usr.user_id = auth.uid() 
      AND usr.role IN ('admin', 'super_admin')
    )
  );

-- Tạo policy cho phép admin và hr_director xóa quy định
CREATE POLICY "Admin and HR Director can delete policies" 
  ON public.company_policies 
  FOR DELETE 
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.user_system_roles usr
      WHERE usr.user_id = auth.uid() 
      AND usr.role IN ('admin', 'super_admin')
    )
  );

-- Tạo function để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Tạo trigger để tự động cập nhật updated_at khi có thay đổi
CREATE TRIGGER update_company_policies_updated_at 
    BEFORE UPDATE ON public.company_policies 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
