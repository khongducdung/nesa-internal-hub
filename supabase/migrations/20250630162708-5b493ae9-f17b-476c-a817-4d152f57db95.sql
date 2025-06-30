
-- Tạo bảng nhóm/danh mục quy trình
CREATE TABLE public.process_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR NOT NULL,
  description TEXT,
  color VARCHAR(7), -- Hex color code
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_by UUID NOT NULL
);

-- Cập nhật bảng process_templates để hỗ trợ nội dung phong phú
ALTER TABLE public.process_templates 
ADD COLUMN IF NOT EXISTS content TEXT, -- Nội dung hướng dẫn chính
ADD COLUMN IF NOT EXISTS target_type VARCHAR DEFAULT 'general' CHECK (target_type IN ('employee', 'department', 'position', 'general')),
ADD COLUMN IF NOT EXISTS target_ids UUID[], -- Mảng các ID mục tiêu
ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.process_categories(id),
ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb, -- Lưu thông tin file đính kèm
ADD COLUMN IF NOT EXISTS external_links JSONB DEFAULT '[]'::jsonb, -- Lưu các URL bên ngoài
ADD COLUMN IF NOT EXISTS tags VARCHAR[] DEFAULT '{}', -- Tags để tìm kiếm
ADD COLUMN IF NOT EXISTS version INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS status VARCHAR DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived'));

-- Tạo bảng lưu trữ file đính kèm
CREATE TABLE public.process_attachments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  process_template_id UUID REFERENCES public.process_templates(id) ON DELETE CASCADE,
  file_name VARCHAR NOT NULL,
  file_type VARCHAR NOT NULL,
  file_size INTEGER,
  file_url TEXT NOT NULL,
  uploaded_by UUID NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  is_active BOOLEAN DEFAULT true
);

-- Tạo bảng theo dõi ai đã xem/hoàn thành quy trình
CREATE TABLE public.process_completions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  process_template_id UUID REFERENCES public.process_templates(id) ON DELETE CASCADE,
  employee_id UUID REFERENCES public.employees(id) ON DELETE CASCADE,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status VARCHAR DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'skipped')),
  feedback TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  time_spent_minutes INTEGER DEFAULT 0,
  UNIQUE(process_template_id, employee_id)
);

-- Tạo bảng lưu lịch sử thay đổi quy trình
CREATE TABLE public.process_revisions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  process_template_id UUID REFERENCES public.process_templates(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  content TEXT,
  steps JSONB,
  changes_summary TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tạo trigger cập nhật updated_at
CREATE TRIGGER update_process_categories_updated_at 
  BEFORE UPDATE ON public.process_categories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Tạo index để tối ưu hiệu suất
CREATE INDEX IF NOT EXISTS idx_process_templates_category ON public.process_templates(category_id);
CREATE INDEX IF NOT EXISTS idx_process_templates_status ON public.process_templates(status);
CREATE INDEX IF NOT EXISTS idx_process_templates_target ON public.process_templates(target_type);
CREATE INDEX IF NOT EXISTS idx_process_attachments_template ON public.process_attachments(process_template_id);
CREATE INDEX IF NOT EXISTS idx_process_completions_employee ON public.process_completions(employee_id);
CREATE INDEX IF NOT EXISTS idx_process_completions_template ON public.process_completions(process_template_id);

-- Thêm dữ liệu mẫu cho danh mục quy trình
INSERT INTO public.process_categories (name, description, color, created_by) VALUES 
('Tuyển dụng', 'Các quy trình liên quan đến tuyển dụng nhân sự', '#3B82F6', '00000000-0000-0000-0000-000000000000'),
('Đào tạo', 'Các quy trình đào tạo và phát triển nhân viên', '#10B981', '00000000-0000-0000-0000-000000000000'),
('Hành chính', 'Các quy trình hành chính nội bộ', '#F59E0B', '00000000-0000-0000-0000-000000000000'),
('IT & Công nghệ', 'Các quy trình liên quan đến IT và công nghệ', '#8B5CF6', '00000000-0000-0000-0000-000000000000'),
('Tài chính', 'Các quy trình liên quan đến tài chính kế toán', '#EF4444', '00000000-0000-0000-0000-000000000000');

-- Cập nhật dữ liệu mẫu cho process_templates hiện có
UPDATE public.process_templates 
SET 
  content = 'Đây là hướng dẫn chi tiết cho quy trình tuyển dụng nhân viên mới...',
  target_type = 'department',
  category_id = (SELECT id FROM public.process_categories WHERE name = 'Tuyển dụng' LIMIT 1),
  status = 'published'
WHERE name = 'Quy trình tuyển dụng nhân viên mới';
