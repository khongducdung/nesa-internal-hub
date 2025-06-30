
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, CheckCircle2, XCircle } from 'lucide-react';
import { useUpdateAttendanceSetting } from '@/hooks/useAttendanceSettings';

const checkinConfigSchema = z.object({
  check_type_config: z.enum(['daily', 'shift', 'both']),
  require_shift_start_checkin: z.boolean(),
  require_shift_start_checkout: z.boolean(),
  require_shift_end_checkin: z.boolean(),
  require_shift_end_checkout: z.boolean(),
  require_daily_start_checkin: z.boolean(),
  require_daily_end_checkout: z.boolean(),
  allow_multiple_checkins: z.boolean(),
});

type CheckinConfigFormData = z.infer<typeof checkinConfigSchema>;

interface CheckinConfigFormProps {
  settingId: string;
  initialData?: Partial<CheckinConfigFormData>;
  onSuccess?: () => void;
}

export function CheckinConfigForm({ settingId, initialData, onSuccess }: CheckinConfigFormProps) {
  const updateMutation = useUpdateAttendanceSetting();

  const form = useForm<CheckinConfigFormData>({
    resolver: zodResolver(checkinConfigSchema),
    defaultValues: {
      check_type_config: initialData?.check_type_config || 'daily',
      require_shift_start_checkin: initialData?.require_shift_start_checkin || false,
      require_shift_start_checkout: initialData?.require_shift_start_checkout || false,
      require_shift_end_checkin: initialData?.require_shift_end_checkin || false,
      require_shift_end_checkout: initialData?.require_shift_end_checkout || false,
      require_daily_start_checkin: initialData?.require_daily_start_checkin || true,
      require_daily_end_checkout: initialData?.require_daily_end_checkout || true,
      allow_multiple_checkins: initialData?.allow_multiple_checkins || false,
    },
  });

  const watchedCheckType = form.watch('check_type_config');

  const onSubmit = async (data: CheckinConfigFormData) => {
    try {
      await updateMutation.mutateAsync({
        id: settingId,
        data: data,
      });
      onSuccess?.();
    } catch (error) {
      console.error('Error updating checkin config:', error);
    }
  };

  const getConfigDescription = (type: string) => {
    switch (type) {
      case 'daily':
        return 'Chấm công một lần đầu ngày và một lần cuối ngày';
      case 'shift':
        return 'Chấm công theo ca làm việc (2 lần checkin, 2 lần checkout)';
      case 'both':
        return 'Kết hợp cả chấm công theo ngày và theo ca';
      default:
        return '';
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              Cấu hình chấm công
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="check_type_config"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại chấm công *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn loại chấm công" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">
                        <div className="flex flex-col">
                          <span>Chấm công theo ngày</span>
                          <span className="text-xs text-muted-foreground">
                            Đầu ngày và cuối ngày
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="shift">
                        <div className="flex flex-col">
                          <span>Chấm công theo ca</span>
                          <span className="text-xs text-muted-foreground">
                            Theo từng ca làm việc
                          </span>
                        </div>
                      </SelectItem>
                      <SelectItem value="both">
                        <div className="flex flex-col">
                          <span>Kết hợp cả hai</span>
                          <span className="text-xs text-muted-foreground">
                            Linh hoạt theo nhu cầu
                          </span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    {getConfigDescription(field.value)}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Cấu hình chấm công theo ngày */}
            {(watchedCheckType === 'daily' || watchedCheckType === 'both') && (
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-green-600" />
                    Chấm công theo ngày
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="require_daily_start_checkin"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Checkin đầu ngày
                          </FormLabel>
                          <FormDescription>
                            Bắt buộc checkin khi bắt đầu ngày làm việc
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="require_daily_end_checkout"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Checkout cuối ngày
                          </FormLabel>
                          <FormDescription>
                            Bắt buộc checkout khi kết thúc ngày làm việc
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* Cấu hình chấm công theo ca */}
            {(watchedCheckType === 'shift' || watchedCheckType === 'both') && (
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    Chấm công theo ca làm việc
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-gray-700">Đầu ca làm việc</h4>
                      
                      <FormField
                        control={form.control}
                        name="require_shift_start_checkin"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm">
                                Checkin đầu ca
                              </FormLabel>
                              <FormDescription className="text-xs">
                                Bắt buộc checkin khi bắt đầu ca
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="require_shift_start_checkout"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm">
                                Checkout đầu ca
                              </FormLabel>
                              <FormDescription className="text-xs">
                                Checkout trước khi nghỉ giữa ca
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium text-sm text-gray-700">Cuối ca làm việc</h4>
                      
                      <FormField
                        control={form.control}
                        name="require_shift_end_checkin"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm">
                                Checkin cuối ca
                              </FormLabel>
                              <FormDescription className="text-xs">
                                Checkin sau khi nghỉ giữa ca
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="require_shift_end_checkout"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-3">
                            <div className="space-y-0.5">
                              <FormLabel className="text-sm">
                                Checkout cuối ca
                              </FormLabel>
                              <FormDescription className="text-xs">
                                Bắt buộc checkout khi kết thúc ca
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Cấu hình bổ sung */}
            <Card className="border-purple-200 bg-purple-50/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-purple-600" />
                  Cấu hình bổ sung
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="allow_multiple_checkins"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between space-y-0 rounded-lg border p-3">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Cho phép chấm công nhiều lần
                        </FormLabel>
                        <FormDescription>
                          Nhân viên có thể thực hiện nhiều lần checkin/checkout trong ngày
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-2">
          <Button 
            type="submit" 
            disabled={updateMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {updateMutation.isPending ? 'Đang lưu...' : 'Lưu cấu hình'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
