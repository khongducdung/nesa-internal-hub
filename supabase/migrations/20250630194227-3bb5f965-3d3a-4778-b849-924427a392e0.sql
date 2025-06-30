
-- Tạo bảng tính lương hàng tháng
CREATE TABLE public.payroll_periods (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  month INTEGER NOT NULL,
  year INTEGER NOT NULL,
  status VARCHAR DEFAULT 'draft' CHECK (status IN ('draft', 'processing', 'completed', 'paid')),
  total_employees INTEGER DEFAULT 0,
  total_amount DECIMAL(15,2) DEFAULT 0,
  created_by UUID NOT NULL,
  processed_by UUID,
  processed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(month, year)
);

-- Tạo bảng chi tiết lương từng nhân viên
CREATE TABLE public.payroll_details (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  payroll_period_id UUID REFERENCES public.payroll_periods(id) NOT NULL,
  employee_id UUID REFERENCES public.employees(id) NOT NULL,
  base_salary DECIMAL(15,2) NOT NULL DEFAULT 0,
  working_days INTEGER NOT NULL DEFAULT 0,
  present_days INTEGER NOT NULL DEFAULT 0,
  absent_days INTEGER NOT NULL DEFAULT 0,
  late_days INTEGER NOT NULL DEFAULT 0,
  overtime_hours DECIMAL(5,2) NOT NULL DEFAULT 0,
  overtime_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  allowances DECIMAL(15,2) NOT NULL DEFAULT 0,
  deductions DECIMAL(15,2) NOT NULL DEFAULT 0,
  bonus DECIMAL(15,2) NOT NULL DEFAULT 0,
  penalties DECIMAL(15,2) NOT NULL DEFAULT 0,
  gross_salary DECIMAL(15,2) NOT NULL DEFAULT 0,
  tax_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  insurance_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
  net_salary DECIMAL(15,2) NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(payroll_period_id, employee_id)
);

-- Tạo bảng cấu hình lương
CREATE TABLE public.salary_configs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  overtime_rate DECIMAL(5,2) DEFAULT 1.5, -- Hệ số tăng ca
  late_penalty_per_hour DECIMAL(10,2) DEFAULT 0, -- Phạt đi muộn/giờ
  absent_penalty_per_day DECIMAL(10,2) DEFAULT 0, -- Phạt vắng mặt/ngày
  tax_rate DECIMAL(5,2) DEFAULT 10, -- Thuế thu nhập %
  insurance_rate DECIMAL(5,2) DEFAULT 8, -- Bảo hiểm %
  min_working_hours_per_day DECIMAL(4,2) DEFAULT 8, -- Giờ làm tối thiểu/ngày
  standard_working_days_per_month INTEGER DEFAULT 22, -- Số ngày làm chuẩn/tháng
  is_default BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tạo trigger cập nhật updated_at
CREATE TRIGGER update_payroll_periods_updated_at BEFORE UPDATE ON public.payroll_periods FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payroll_details_updated_at BEFORE UPDATE ON public.payroll_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_salary_configs_updated_at BEFORE UPDATE ON public.salary_configs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tạo index
CREATE INDEX idx_payroll_periods_month_year ON public.payroll_periods(month, year);
CREATE INDEX idx_payroll_details_period_employee ON public.payroll_details(payroll_period_id, employee_id);
CREATE INDEX idx_payroll_details_employee ON public.payroll_details(employee_id);

-- Thêm dữ liệu mẫu cho cấu hình lương
INSERT INTO public.salary_configs (
  name,
  description,
  overtime_rate,
  late_penalty_per_hour,
  absent_penalty_per_day,
  tax_rate,
  insurance_rate,
  min_working_hours_per_day,
  standard_working_days_per_month,
  is_default,
  created_by
) VALUES (
  'Cấu hình lương mặc định',
  'Cấu hình tính lương tiêu chuẩn cho công ty',
  1.5,
  50000,
  200000,
  10,
  8,
  8,
  22,
  true,
  '00000000-0000-0000-0000-000000000000'
);
