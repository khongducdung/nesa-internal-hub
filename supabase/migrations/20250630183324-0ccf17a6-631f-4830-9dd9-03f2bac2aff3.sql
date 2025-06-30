
-- Tạo bảng competency_frameworks để lưu khung năng lực theo vị trí
CREATE TABLE public.competency_frameworks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  position_id UUID REFERENCES public.positions(id) ON DELETE CASCADE,
  name VARCHAR NOT NULL,
  description TEXT,
  competencies JSONB NOT NULL DEFAULT '[]'::jsonb,
  status VARCHAR DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tạo bảng employee_competency_assessments để lưu đánh giá năng lực của nhân viên
CREATE TABLE public.employee_competency_assessments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  competency_framework_id UUID REFERENCES public.competency_frameworks(id) ON DELETE CASCADE,
  assessment_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  overall_score NUMERIC(3,2),
  assessed_by UUID,
  assessed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  status VARCHAR DEFAULT 'draft' CHECK (status IN ('draft', 'completed', 'approved')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Thêm trigger để tự động cập nhật updated_at
CREATE TRIGGER update_competency_frameworks_updated_at
  BEFORE UPDATE ON public.competency_frameworks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_employee_competency_assessments_updated_at
  BEFORE UPDATE ON public.employee_competency_assessments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Tạo index để tối ưu hóa truy vấn
CREATE INDEX idx_competency_frameworks_position_id ON public.competency_frameworks(position_id);
CREATE INDEX idx_employee_competency_assessments_employee_id ON public.employee_competency_assessments(employee_id);
CREATE INDEX idx_employee_competency_assessments_framework_id ON public.employee_competency_assessments(competency_framework_id);
