
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Settings, 
  Coins, 
  Trophy, 
  Users, 
  Calendar,
  Target,
  Star,
  Award,
  Gift,
  AlertCircle,
  CheckCircle,
  Save
} from 'lucide-react';

export function OKRSettings() {
  const [settings, setSettings] = useState({
    // Reward System Settings
    okr_coins_per_completion: 100,
    trust_points_limit_per_day: 10,
    dedication_points_limit_per_day: 5,
    
    // Achievement Settings
    enable_public_leaderboard: true,
    enable_achievements: true,
    enable_emotional_rewards: true,
    
    // Cycle Settings
    default_cycle_duration: 90, // days
    auto_create_next_cycle: true,
    allow_mid_cycle_changes: false,
    
    // Notification Settings
    notify_on_okr_completion: true,
    notify_on_rewards_received: true,
    notify_on_cycle_end: true
  });

  const rewardRules = [
    {
      category: 'OKR Completion',
      rules: [
        { action: 'Hoàn thành 100% Key Results', reward: '100 OKR Coins + 10 Trust Points', status: 'active' },
        { action: 'Hoàn thành trước hạn 1 tuần', reward: '150 OKR Coins + 15 Trust Points', status: 'active' },
        { action: 'Vượt mục tiêu 120%+', reward: '200 OKR Coins + 20 Trust Points + Badge', status: 'active' }
      ]
    },
    {
      category: 'Collaboration',
      rules: [
        { action: 'Hỗ trợ 3+ OKR của đồng nghiệp', reward: '50 OKR Coins + 5 Dedication Points', status: 'active' },
        { action: 'Nhận 10+ Trust Points từ team', reward: '75 OKR Coins + Badge "Team Player"', status: 'active' },
        { action: 'Mentor cho junior', reward: '100 OKR Coins + 10 Dedication Points', status: 'draft' }
      ]
    },
    {
      category: 'Leadership',
      rules: [
        { action: 'Team đạt 90%+ OKR', reward: '300 OKR Coins + Leadership Badge', status: 'active' },
        { action: 'Không có OKR nào bị trễ', reward: '200 OKR Coins + 25 Trust Points', status: 'active' },
        { action: 'Tạo OKR sáng tạo được nhiều vote', reward: '150 OKR Coins + Innovation Badge', status: 'draft' }
      ]
    }
  ];

  const handleSaveSettings = () => {
    console.log('Saving settings:', settings);
    // Logic lưu cài đặt
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="h-6 w-6 text-blue-600" />
            Cài đặt OKR
          </h2>
          <p className="text-gray-600 mt-1">
            Quản lý hệ thống thưởng, quy tắc và vận hành OKR
          </p>
        </div>
        <Button onClick={handleSaveSettings} className="bg-blue-600 hover:bg-blue-700">
          <Save className="h-4 w-4 mr-2" />
          Lưu cài đặt
        </Button>
      </div>

      <Tabs defaultValue="rewards" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rewards">Hệ thống thưởng</TabsTrigger>
          <TabsTrigger value="rules">Quy tắc vận hành</TabsTrigger>
          <TabsTrigger value="cycles">Chu kỳ OKR</TabsTrigger>
          <TabsTrigger value="notifications">Thông báo</TabsTrigger>
        </TabsList>

        {/* Reward System Settings */}
        <TabsContent value="rewards" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-yellow-600" />
                  Cài đặt OKR Coins
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Coins khi hoàn thành OKR
                  </label>
                  <Input
                    type="number"
                    value={settings.okr_coins_per_completion}
                    onChange={(e) => handleSettingChange('okr_coins_per_completion', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2">Tỷ giá quy đổi</h4>
                  <div className="space-y-1 text-sm text-yellow-700">
                    <div>1000 Coins = 1 ngày nghỉ phép</div>
                    <div>500 Coins = Voucher ăn trưa</div>
                    <div>2000 Coins = Thưởng tiền mặt 500k</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-purple-600" />
                  Điểm cảm xúc
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Giới hạn Trust Points/ngày
                  </label>
                  <Input
                    type="number"
                    value={settings.trust_points_limit_per_day}
                    onChange={(e) => handleSettingChange('trust_points_limit_per_day', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Giới hạn Dedication Points/ngày
                  </label>
                  <Input
                    type="number"
                    value={settings.dedication_points_limit_per_day}
                    onChange={(e) => handleSettingChange('dedication_points_limit_per_day', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Hiển thị bảng xếp hạng công khai</span>
                  <Switch
                    checked={settings.enable_public_leaderboard}
                    onCheckedChange={(checked) => handleSettingChange('enable_public_leaderboard', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Operating Rules */}
        <TabsContent value="rules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-green-600" />
                Quy tắc thưởng và huy hiệu
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {rewardRules.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="space-y-3">
                    <h4 className="font-semibold text-gray-900 border-b pb-2">
                      {category.category}
                    </h4>
                    <div className="space-y-2">
                      {category.rules.map((rule, ruleIndex) => (
                        <div key={ruleIndex} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex-1">
                            <div className="font-medium text-sm text-gray-900">{rule.action}</div>
                            <div className="text-sm text-gray-600">{rule.reward}</div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge className={`${
                              rule.status === 'active' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {rule.status === 'active' ? (
                                <>
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                  Hoạt động
                                </>
                              ) : (
                                <>
                                  <AlertCircle className="h-3 w-3 mr-1" />
                                  Nháp
                                </>
                              )}
                            </Badge>
                            <Button variant="outline" size="sm">
                              Sửa
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Cycle Settings */}
        <TabsContent value="cycles" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Cài đặt chu kỳ OKR
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">
                    Thời gian chu kỳ mặc định (ngày)
                  </label>
                  <Input
                    type="number"
                    value={settings.default_cycle_duration}
                    onChange={(e) => handleSettingChange('default_cycle_duration', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Tự động tạo chu kỳ tiếp theo</span>
                    <Switch
                      checked={settings.auto_create_next_cycle}
                      onCheckedChange={(checked) => handleSettingChange('auto_create_next_cycle', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Cho phép thay đổi giữa chu kỳ</span>
                    <Switch
                      checked={settings.allow_mid_cycle_changes}
                      onCheckedChange={(checked) => handleSettingChange('allow_mid_cycle_changes', checked)}
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Lưu ý</h4>
                <ul className="space-y-1 text-sm text-blue-700">
                  <li>• Chu kỳ OKR thông thường là 90 ngày (1 quý)</li>
                  <li>• Không nên thay đổi mục tiêu quá nhiều giữa chu kỳ</li>
                  <li>• Đánh giá và review cuối mỗi chu kỳ để cải thiện</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                Cài đặt thông báo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Thông báo khi hoàn thành OKR</div>
                    <div className="text-xs text-gray-500">Nhận thông báo khi bạn hoặc team hoàn thành OKR</div>
                  </div>
                  <Switch
                    checked={settings.notify_on_okr_completion}
                    onCheckedChange={(checked) => handleSettingChange('notify_on_okr_completion', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Thông báo khi nhận thưởng</div>
                    <div className="text-xs text-gray-500">Nhận thông báo khi có điểm thưởng mới</div>
                  </div>
                  <Switch
                    checked={settings.notify_on_rewards_received}
                    onCheckedChange={(checked) => handleSettingChange('notify_on_rewards_received', checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium text-gray-700">Thông báo cuối chu kỳ</div>
                    <div className="text-xs text-gray-500">Nhắc nhở đánh giá và chuẩn bị chu kỳ mới</div>
                  </div>
                  <Switch
                    checked={settings.notify_on_cycle_end}
                    onCheckedChange={(checked) => handleSettingChange('notify_on_cycle_end', checked)}
                  />
                </div>
              </div>

              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Tần suất thông báo</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Nhắc nhở cập nhật tiến độ</span>
                    <select className="text-sm border border-gray-300 rounded px-2 py-1">
                      <option value="daily">Hàng ngày</option>
                      <option value="weekly">Hàng tuần</option>
                      <option value="never">Không bao giờ</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Báo cáo tổng kết</span>
                    <select className="text-sm border border-gray-300 rounded px-2 py-1">
                      <option value="weekly">Hàng tuần</option>
                      <option value="monthly">Hàng tháng</option>
                      <option value="quarterly">Hàng quý</option>
                    </select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
