
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { periodId, configId } = await req.json()

    // Lấy thông tin kỳ lương
    const { data: period, error: periodError } = await supabaseClient
      .from('payroll_periods')
      .select('*')
      .eq('id', periodId)
      .single()

    if (periodError) throw periodError

    // Lấy cấu hình tính lương
    const { data: config, error: configError } = await supabaseClient
      .from('salary_configs')
      .select('*')
      .eq('id', configId)
      .single()

    if (configError) throw configError

    // Lấy danh sách nhân viên đang làm việc
    const { data: employees, error: employeesError } = await supabaseClient
      .from('employees')
      .select('*')
      .eq('work_status', 'active')

    if (employeesError) throw employeesError

    // Lấy dữ liệu chấm công trong kỳ
    const { data: attendanceData, error: attendanceError } = await supabaseClient
      .from('attendance')
      .select('*')
      .gte('date', period.start_date)
      .lte('date', period.end_date)

    if (attendanceError) throw attendanceError

    const payrollDetails = []
    let totalAmount = 0

    for (const employee of employees) {
      const employeeAttendance = attendanceData.filter(a => a.employee_id === employee.id)
      
      // Tính toán số ngày làm việc
      const workingDays = config.standard_working_days_per_month
      const presentDays = employeeAttendance.filter(a => a.status === 'present' || a.status === 'late').length
      const absentDays = employeeAttendance.filter(a => a.status === 'absent').length
      const lateDays = employeeAttendance.filter(a => a.status === 'late').length
      
      // Tính tổng giờ tăng ca
      const overtimeHours = employeeAttendance.reduce((sum, a) => sum + (a.overtime_hours || 0), 0)
      
      // Tính lương cơ bản theo ngày công
      const baseSalary = employee.salary || 0
      const dailySalary = baseSalary / workingDays
      const grossSalary = dailySalary * presentDays
      
      // Tính tiền tăng ca
      const hourlyRate = baseSalary / (workingDays * config.min_working_hours_per_day)
      const overtimeAmount = overtimeHours * hourlyRate * config.overtime_rate
      
      // Tính phạt
      const latePenalty = lateDays * config.late_penalty_per_hour
      const absentPenalty = absentDays * config.absent_penalty_per_day
      const totalPenalties = latePenalty + absentPenalty
      
      // Tính tổng lương gốc
      const totalGross = grossSalary + overtimeAmount
      
      // Tính thuế và bảo hiểm
      const taxAmount = totalGross * (config.tax_rate / 100)
      const insuranceAmount = totalGross * (config.insurance_rate / 100)
      
      // Tính lương thực nhận
      const netSalary = totalGross - taxAmount - insuranceAmount - totalPenalties
      
      const payrollDetail = {
        payroll_period_id: periodId,
        employee_id: employee.id,
        base_salary: baseSalary,
        working_days: workingDays,
        present_days: presentDays,
        absent_days: absentDays,
        late_days: lateDays,
        overtime_hours: overtimeHours,
        overtime_amount: overtimeAmount,
        allowances: 0, // Có thể mở rộng thêm
        deductions: 0,
        bonus: 0,
        penalties: totalPenalties,
        gross_salary: totalGross,
        tax_amount: taxAmount,
        insurance_amount: insuranceAmount,
        net_salary: netSalary,
      }
      
      payrollDetails.push(payrollDetail)
      totalAmount += netSalary
    }

    // Xóa dữ liệu cũ nếu có
    await supabaseClient
      .from('payroll_details')
      .delete()
      .eq('payroll_period_id', periodId)

    // Thêm dữ liệu mới
    const { error: insertError } = await supabaseClient
      .from('payroll_details')
      .insert(payrollDetails)

    if (insertError) throw insertError

    // Cập nhật thông tin kỳ lương
    const { error: updateError } = await supabaseClient
      .from('payroll_periods')
      .update({
        status: 'completed',
        total_employees: employees.length,
        total_amount: totalAmount,
        processed_at: new Date().toISOString(),
      })
      .eq('id', periodId)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ success: true, totalAmount, totalEmployees: employees.length }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
