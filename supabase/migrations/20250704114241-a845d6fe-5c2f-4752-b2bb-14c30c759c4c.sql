
-- Tạo bảng quản lý quy trình
CREATE TABLE public.processes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  content TEXT,
  status VARCHAR DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'inactive')),
  target_type VARCHAR DEFAULT 'general' CHECK (target_type IN ('employee', 'department', 'position', 'general')),
  target_ids UUID[], -- Mảng các ID đối tượng áp dụng
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Tạo trigger cập nhật updated_at
CREATE TRIGGER update_processes_updated_at 
  BEFORE UPDATE ON public.processes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tạo index để tối ưu hiệu suất
CREATE INDEX IF NOT EXISTS idx_processes_created_by ON public.processes(created_by);
CREATE INDEX IF NOT EXISTS idx_processes_target_type ON public.processes(target_type);
CREATE INDEX IF NOT EXISTS idx_processes_status ON public.processes(status);

-- Bật Row Level Security
ALTER TABLE public.processes ENABLE ROW LEVEL SECURITY;

-- Policy cho Admin/Super Admin: có thể xem tất cả quy trình
CREATE POLICY "Admins can view all processes" 
  ON public.processes 
  FOR SELECT 
  USING (
    has_system_role(auth.uid(), 'admin'::system_role) OR 
    has_system_role(auth.uid(), 'super_admin'::system_role)
  );

-- Policy cho Admin/Super Admin: có thể quản lý tất cả quy trình
CREATE POLICY "Admins can manage all processes" 
  ON public.processes 
  FOR ALL 
  USING (
    has_system_role(auth.uid(), 'admin'::system_role) OR 
    has_system_role(auth.uid(), 'super_admin'::system_role)
  );

-- Policy: Người tạo có thể xem và chỉnh sửa quy trình của mình
CREATE POLICY "Users can view and edit their own processes" 
  ON public.processes 
  FOR ALL 
  USING (created_by = auth.uid());

-- Policy: Người dùng có thể xem quy trình dành cho mình
CREATE POLICY "Users can view processes targeted to them" 
  ON public.processes 
  FOR SELECT 
  USING (
    target_type = 'general' OR
    (target_type = 'employee' AND auth.uid()::TEXT = ANY(target_ids)) OR
    (target_type = 'department' AND EXISTS (
      SELECT 1 FROM employees e 
      WHERE e.auth_user_id = auth.uid() 
      AND e.department_id::TEXT = ANY(target_ids)
    )) OR
    (target_type = 'position' AND EXISTS (
      SELECT 1 FROM employees e 
      WHERE e.auth_user_id = auth.uid() 
      AND e.position_id::TEXT = ANY(target_ids)
    ))
  );

-- Policy: Người dùng có thể tạo quy trình mới
CREATE POLICY "Users can create processes" 
  ON public.processes 
  FOR INSERT 
  WITH CHECK (created_by = auth.uid());
