// OKR System Settings - Settings for rewards, gamification, and system configuration
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Trophy, 
  Coins, 
  Gift, 
  Target,
  Users,
  Building2,
  Star,
  Award,
  TrendingUp,
  Save,
  Plus,
  Trash2
} from 'lucide-react';

export function OKRSystemSettings() {
  const [rewardSettings, setRewardSettings] = useState({
    enable_gamification: true,
    okr_completion_coins: 100,
    key_result_completion_coins: 25,
    weekly_check_in_coins: 5,
    collaboration_bonus: 10,
    excellence_multiplier: 1.5,
    trust_points_base: 50,
    dedication_points_base: 30
  });

  const [achievementSettings, setAchievementSettings] = useState([
    {
      id: '1',
      name: 'Người khởi đầu',
      description: 'Tạo OKR đầu tiên',
      icon: '🎯',
      type: 'milestone',
      points: 50,
      rarity: 'common',
      conditions: { first_okr: true }
    },
    {
      id: '2', 
      name: 'Chiến binh OKR',
      description: 'Hoàn thành 5 OKR liên tiếp',
      icon: '⚔️',
      type: 'achievement',
      points: 200,
      rarity: 'rare',
      conditions: { consecutive_okrs: 5 }
    }
  ] as any[]);

  const [alignmentSettings, setAlignmentSettings] = useState({
    require_alignment: true,
    max_individual_okrs: 3,
    max_department_okrs: 5,
    min_key_results: 2,
    max_key_results: 5,
    default_check_in_frequency: 'weekly',
    auto_status_update: true
  });

  const handleSaveRewards = () => {
    // TODO: Save reward settings to database
    console.log('Saving reward settings:', rewardSettings);
  };

  const handleSaveAlignment = () => {
    // TODO: Save alignment settings to database
    console.log('Saving alignment settings:', alignmentSettings);
  };

  const addNewAchievement = () => {
    const newAchievement = {
      id: Date.now().toString(),
      name: '',
      description: '',
      icon: '🏆',
      type: 'milestone',
      points: 0,
      rarity: 'common',
      conditions: { default: true }
    };
    setAchievementSettings([...achievementSettings, newAchievement]);
  };

  const removeAchievement = (id: string) => {
    setAchievementSettings(achievementSettings.filter(a => a.id !== id));
  };

  const updateAchievement = (id: string, field: string, value: any) => {
    setAchievementSettings(prev => prev.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Cài đặt hệ thống OKR
          </h2>
          <p className="text-muted-foreground mt-1">
            Quản lý quy tắc thưởng, gamification và cấu hình hệ thống
          </p>
        </div>
      </div>

      <Tabs defaultValue="rewards" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rewards" className="flex items-center gap-2">
            <Coins className="h-4 w-4" />
            Hệ thống thưởng
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Thành tựu
          </TabsTrigger>
          <TabsTrigger value="alignment" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Liên kết OKR
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Thông báo
          </TabsTrigger>
        </TabsList>

        {/* Reward Settings */}
        <TabsContent value="rewards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5" />
                Cấu hình hệ thống thưởng
              </CardTitle>
              <CardDescription>
                Thiết lập số điểm thưởng cho các hoạt động trong hệ thống OKR
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="enable-gamification">Kích hoạt gamification</Label>
                <Switch 
                  id="enable-gamification"
                  checked={rewardSettings.enable_gamification}
                  onCheckedChange={(checked) => 
                    setRewardSettings(prev => ({ ...prev, enable_gamification: checked }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="okr-completion">OKR Coins cho hoàn thành OKR</Label>
                  <Input
                    id="okr-completion"
                    type="number"
                    value={rewardSettings.okr_completion_coins}
                    onChange={(e) => 
                      setRewardSettings(prev => ({ 
                        ...prev, 
                        okr_completion_coins: parseInt(e.target.value) || 0 
                      }))
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="kr-completion">OKR Coins cho hoàn thành Key Result</Label>
                  <Input
                    id="kr-completion"
                    type="number"
                    value={rewardSettings.key_result_completion_coins}
                    onChange={(e) => 
                      setRewardSettings(prev => ({ 
                        ...prev, 
                        key_result_completion_coins: parseInt(e.target.value) || 0 
                      }))
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="checkin-coins">OKR Coins cho check-in hàng tuần</Label>
                  <Input
                    id="checkin-coins"
                    type="number"
                    value={rewardSettings.weekly_check_in_coins}
                    onChange={(e) => 
                      setRewardSettings(prev => ({ 
                        ...prev, 
                        weekly_check_in_coins: parseInt(e.target.value) || 0 
                      }))
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="collaboration-bonus">Bonus hợp tác</Label>
                  <Input
                    id="collaboration-bonus"
                    type="number"
                    value={rewardSettings.collaboration_bonus}
                    onChange={(e) => 
                      setRewardSettings(prev => ({ 
                        ...prev, 
                        collaboration_bonus: parseInt(e.target.value) || 0 
                      }))
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="trust-points">Trust Points cơ bản</Label>
                  <Input
                    id="trust-points"
                    type="number"
                    value={rewardSettings.trust_points_base}
                    onChange={(e) => 
                      setRewardSettings(prev => ({ 
                        ...prev, 
                        trust_points_base: parseInt(e.target.value) || 0 
                      }))
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="dedication-points">Dedication Points cơ bản</Label>
                  <Input
                    id="dedication-points"
                    type="number"
                    value={rewardSettings.dedication_points_base}
                    onChange={(e) => 
                      setRewardSettings(prev => ({ 
                        ...prev, 
                        dedication_points_base: parseInt(e.target.value) || 0 
                      }))
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveRewards}>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu cài đặt thưởng
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievement Settings */}
        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Quản lý thành tựu
                  </CardTitle>
                  <CardDescription>
                    Tạo và quản lý các thành tựu trong hệ thống
                  </CardDescription>
                </div>
                <Button onClick={addNewAchievement}>
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm thành tựu
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {achievementSettings.map((achievement) => (
                <Card key={achievement.id} className="border-l-4 border-l-orange-500">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <Label>Tên thành tựu</Label>
                        <Input
                          value={achievement.name}
                          onChange={(e) => updateAchievement(achievement.id, 'name', e.target.value)}
                          placeholder="Tên thành tựu"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>Icon</Label>
                        <Input
                          value={achievement.icon}
                          onChange={(e) => updateAchievement(achievement.id, 'icon', e.target.value)}
                          placeholder="🏆"
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label>Điểm thưởng</Label>
                        <Input
                          type="number"
                          value={achievement.points}
                          onChange={(e) => updateAchievement(achievement.id, 'points', parseInt(e.target.value) || 0)}
                          className="mt-1"
                        />
                      </div>

                      <div className="flex items-end gap-2">
                        <Badge variant={achievement.rarity === 'legendary' ? 'default' : 'secondary'}>
                          {achievement.rarity === 'common' && 'Thông thường'}
                          {achievement.rarity === 'rare' && 'Hiếm'}
                          {achievement.rarity === 'epic' && 'Sử thi'}
                          {achievement.rarity === 'legendary' && 'Huyền thoại'}
                        </Badge>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="text-red-600"
                          onClick={() => removeAchievement(achievement.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="md:col-span-4">
                        <Label>Mô tả</Label>
                        <Textarea
                          value={achievement.description}
                          onChange={(e) => updateAchievement(achievement.id, 'description', e.target.value)}
                          placeholder="Mô tả thành tựu..."
                          className="mt-1"
                          rows={2}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alignment Settings */}
        <TabsContent value="alignment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Cấu hình liên kết OKR
              </CardTitle>
              <CardDescription>
                Thiết lập quy tắc liên kết giữa các cấp độ OKR
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="require-alignment">Bắt buộc liên kết OKR</Label>
                <Switch 
                  id="require-alignment"
                  checked={alignmentSettings.require_alignment}
                  onCheckedChange={(checked) => 
                    setAlignmentSettings(prev => ({ ...prev, require_alignment: checked }))
                  }
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max-individual">Số OKR cá nhân tối đa</Label>
                  <Input
                    id="max-individual"
                    type="number"
                    value={alignmentSettings.max_individual_okrs}
                    onChange={(e) => 
                      setAlignmentSettings(prev => ({ 
                        ...prev, 
                        max_individual_okrs: parseInt(e.target.value) || 0 
                      }))
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="max-department">Số OKR phòng ban tối đa</Label>
                  <Input
                    id="max-department"
                    type="number"
                    value={alignmentSettings.max_department_okrs}
                    onChange={(e) => 
                      setAlignmentSettings(prev => ({ 
                        ...prev, 
                        max_department_okrs: parseInt(e.target.value) || 0 
                      }))
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="min-kr">Số Key Results tối thiểu</Label>
                  <Input
                    id="min-kr"
                    type="number"
                    value={alignmentSettings.min_key_results}
                    onChange={(e) => 
                      setAlignmentSettings(prev => ({ 
                        ...prev, 
                        min_key_results: parseInt(e.target.value) || 0 
                      }))
                    }
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="max-kr">Số Key Results tối đa</Label>
                  <Input
                    id="max-kr"
                    type="number"
                    value={alignmentSettings.max_key_results}
                    onChange={(e) => 
                      setAlignmentSettings(prev => ({ 
                        ...prev, 
                        max_key_results: parseInt(e.target.value) || 0 
                      }))
                    }
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="auto-status">Tự động cập nhật trạng thái</Label>
                <Switch 
                  id="auto-status"
                  checked={alignmentSettings.auto_status_update}
                  onCheckedChange={(checked) => 
                    setAlignmentSettings(prev => ({ ...prev, auto_status_update: checked }))
                  }
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveAlignment}>
                  <Save className="h-4 w-4 mr-2" />
                  Lưu cài đặt liên kết
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Cài đặt thông báo
              </CardTitle>
              <CardDescription>
                Quản lý thông báo tự động trong hệ thống OKR
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Thông báo deadline OKR</p>
                    <p className="text-sm text-muted-foreground">Nhắc nhở trước khi OKR hết hạn</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Thông báo check-in quá hạn</p>
                    <p className="text-sm text-muted-foreground">Nhắc nhở khi không check-in đúng hạn</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Thông báo OKR có rủi ro</p>
                    <p className="text-sm text-muted-foreground">Cảnh báo khi OKR có nguy cơ không đạt</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Thông báo thành tựu mới</p>
                    <p className="text-sm text-muted-foreground">Thông báo khi đạt được thành tựu</p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}