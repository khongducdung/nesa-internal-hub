-- Sửa foreign key constraint để employee_id reference trực tiếp tới employees table
ALTER TABLE public.kpis DROP CONSTRAINT IF EXISTS kpis_employee_id_fkey;
ALTER TABLE public.kpis ADD CONSTRAINT kpis_employee_id_fkey FOREIGN KEY (employee_id) REFERENCES public.employees(id);