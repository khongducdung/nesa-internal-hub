-- Cập nhật RLS policies cho kpi_frameworks để cho phép managers tạo khung KPI
DROP POLICY IF EXISTS "Admins can manage KPI frameworks" ON kpi_frameworks;
DROP POLICY IF EXISTS "Everyone can view active KPI frameworks" ON kpi_frameworks;

-- Policy cho phép admin và super admin quản lý tất cả
CREATE POLICY "Admins can manage all KPI frameworks" 
ON kpi_frameworks 
FOR ALL 
TO authenticated 
USING (has_system_role(auth.uid(), 'super_admin'::system_role) OR has_system_role(auth.uid(), 'admin'::system_role));

-- Policy cho phép managers tạo khung KPI cho department của họ
CREATE POLICY "Managers can create KPI frameworks for their department" 
ON kpi_frameworks 
FOR INSERT 
TO authenticated 
WITH CHECK (
  department_id IN (
    SELECT e.department_id 
    FROM employees e 
    WHERE e.auth_user_id = auth.uid() 
    AND e.employee_level IN ('level_1', 'level_2')
  )
  OR department_id IS NULL
);

-- Policy cho phép managers xem và sửa khung KPI của department họ
CREATE POLICY "Managers can manage their department KPI frameworks" 
ON kpi_frameworks 
FOR ALL 
TO authenticated 
USING (
  department_id IN (
    SELECT e.department_id 
    FROM employees e 
    WHERE e.auth_user_id = auth.uid() 
    AND e.employee_level IN ('level_1', 'level_2')
  )
  OR created_by = auth.uid()
);

-- Policy cho phép tất cả người dùng xem khung KPI active
CREATE POLICY "Everyone can view active KPI frameworks" 
ON kpi_frameworks 
FOR SELECT 
TO authenticated 
USING (is_active = true);