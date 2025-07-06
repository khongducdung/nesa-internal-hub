import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Settings,
  Award,
  Target,
  Bell,
  Gift,
  Trophy,
  Star,
  Crown,
  Heart,
  Zap,
  CheckCircle,
  Save,
  Plus,
  Trash2
} from 'lucide-react';
import { 
  useSaveRewardSettings, 
  useSaveAlignmentSettings, 
  useSaveAchievements, 
  useSaveNotificationSettings,
  useOKRSystemSettings
} from '@/hooks/useOKRSystem';
import { useToast } from '@/hooks/use-toast';

export function OKRSystemSettings() {
  const { toast } = useToast();
  const { data: systemSettings = [], isLoading: isLoadingSettings } = useOKRSystemSettings();
  const saveRewardSettings = useSaveRewardSettings();
  const saveAlignmentSettings = useSaveAlignmentSettings();
  const saveAchievements = useSaveAchievements();
  const saveNotificationSettings = useSaveNotificationSettings();
  
  // Load existing settings from database
  const rewardsData = systemSettings.find(s => s.setting_type === 'rewards')?.settings || {};
  const alignmentData = systemSettings.find(s => s.setting_type === 'alignment')?.settings || {};
  const notificationsData = systemSettings.find(s => s.setting_type === 'notifications')?.settings || {};

  const [rewardSettings, setRewardSettings] = useState({
    enable_gamification: true,
    okr_completion_coins: 100,
    key_result_completion_coins: 25,
    weekly_check_in_coins: 5,
    collaboration_bonus: 10,
    trust_points_base: 10,
    dedication_points_base: 5,
    achievement_multiplier: 1.5,
    season_bonus: true,
    tier_progression: true,
    ...rewardsData
  });

  const [alignmentSettings, setAlignmentSettings] = useState({
    require_parent_alignment: true,
    max_alignment_levels: 3,
    alignment_threshold: 70,
    auto_cascade_updates: true,
    cross_department_alignment: false,
    quarterly_alignment_review: true,
    alignment_notification: true,
    cascade_deadline_days: 7,
    misalignment_alerts: true,
    alignment_scoring: true,
    enable_peer_alignment: false,
    auto_status_update: true,
    ...alignmentData
  });

  const [achievements, setAchievements] = useState([
    {
      id: '1',
      name: 'Người khởi đầu',
      icon: '🎯',
      description: 'Tạo OKR đầu tiên',
      points: 25,
      rarity: 'common',
      type: 'milestone'
    },
    {
      id: '2', 
      name: 'Chiến binh',
      icon: '⚔️',
      description: 'Hoàn thành 5 OKR',
      points: 100,
      rarity: 'rare',
      type: 'achievement'
    }
  ]);

  const [notificationSettings, setNotificationSettings] = useState({
    // Deadline notifications
    deadline_7_days: true,
    deadline_3_days: true,
    deadline_overdue: true,
    deadline_email: false,
    
    // Progress notifications
    key_result_update: true,
    okr_completion: true,
    slow_progress: true,
    weekly_checkin_reminder: true,
    
    // Collaboration notifications
    mention_in_comment: true,
    added_to_okr: true,
    okr_linked: true,
    approval_request: true,
    
    // Achievement notifications
    new_achievement: true,
    okr_coins_received: true,
    leaderboard_rank_up: true,
    cycle_ended: true,
    
    // Email settings
    summary_frequency: 'weekly',
    summary_time: '09:00',
    ...notificationsData
  });

  // Update local state when data loads
  useEffect(() => {
    if (rewardsData && Object.keys(rewardsData).length > 0) {
      setRewardSettings(prev => ({ ...prev, ...rewardsData }));
    }
  }, [rewardsData]);

  useEffect(() => {
    if (alignmentData && Object.keys(alignmentData).length > 0) {
      setAlignmentSettings(prev => ({ ...prev, ...alignmentData }));
    }
  }, [alignmentData]);

  useEffect(() => {
    if (notificationsData && Object.keys(notificationsData).length > 0) {
      setNotificationSettings(prev => ({ ...prev, ...notificationsData }));
    }
  }, [notificationsData]);

  const handleSaveRewards = async () => {
    try {
      await saveRewardSettings.mutateAsync(rewardSettings);
      toast({
        title: "Thành công",
        description: "Đã lưu cài đặt hệ thống thưởng",
      });
    } catch (error: any) {
      console.error('Error saving rewards:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể lưu cài đặt",
        variant: "destructive",
      });
    }
  };

  const handleSaveAlignment = async () => {
    try {
      await saveAlignmentSettings.mutateAsync(alignmentSettings);
      toast({
        title: "Thành công", 
        description: "Đã lưu cài đặt liên kết OKR",
      });
    } catch (error: any) {
      console.error('Error saving alignment:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể lưu cài đặt liên kết",
        variant: "destructive",
      });
    }
  };

  const addNewAchievement = () => {
    const newAchievement = {
      id: Date.now().toString(),
      name: '',
      icon: '🏆',
      description: '',
      points: 10,
      rarity: 'common',
      type: 'milestone'
    };
    setAchievements([...achievements, newAchievement]);
  };

  const handleSaveAchievements = async () => {
    try {
      await saveAchievements.mutateAsync(achievements);
      toast({
        title: "Thành công",
        description: "Đã lưu danh sách thành tựu",
      });
    } catch (error: any) {
      console.error('Error saving achievements:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể lưu thành tựu",
        variant: "destructive",
      });
    }
  };

  const handleSaveNotifications = async () => {
    try {
      await saveNotificationSettings.mutateAsync(notificationSettings);
      toast({
        title: "Thành công",
        description: "Đã lưu cài đặt thông báo",
      });
    } catch (error: any) {
      console.error('Error saving notifications:', error);
      toast({
        title: "Lỗi",
        description: error.message || "Không thể lưu cài đặt thông báo",
        variant: "destructive",
      });
    }
  };

  const updateAchievement = (id: string, field: string, value: any) => {
    setAchievements(achievements.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    ));
  };

  const removeAchievement = (id: string) => {
    setAchievements(achievements.filter(a => a.id !== id));
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800';
      case 'rare': return 'bg-blue-100 text-blue-800';
      case 'epic': return 'bg-purple-100 text-purple-800';
      case 'legendary': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoadingSettings) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Settings className="h-6 w-6" />
              Cài đặt hệ thống OKR
            </h2>
            <p className="text-muted-foreground mt-1">
              Quản lý cấu hình và tùy chỉnh hệ thống OKR
            </p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center py-8 text-gray-500">Đang tải cài đặt...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Cài đặt hệ thống OKR
          </h2>
          <p className="text-muted-foreground mt-1">
            Quản lý cấu hình và tùy chỉnh hệ thống OKR
          </p>
        </div>
      </div>

      <Tabs defaultValue="rewards" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="rewards" className="flex items-center gap-2">
            <Gift className="h-4 w-4" />
            Hệ thống thưởng
          </TabsTrigger>
          <TabsTrigger value="alignment" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Liên kết OKR
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Thành tựu
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Thông báo
          </TabsTrigger>
        </TabsList>

        {/* Reward Settings */}
        <TabsContent value="rewards" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="h-5 w-5" />
                Cài đặt hệ thống thưởng
              </CardTitle>
              <CardDescription>
                Cấu hình OKR Coins, Trust Points và Dedication Points
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
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

              <div className="grid grid-cols-2 gap-4">
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
                  />
                </div>
              </div>

              <Button onClick={handleSaveRewards} disabled={saveRewardSettings.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {saveRewardSettings.isPending ? 'Đang lưu...' : 'Lưu cài đặt thưởng'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alignment Settings */}
        <TabsContent value="alignment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Cài đặt liên kết OKR
              </CardTitle>
              <CardDescription>
                Cấu hình quy tắc liên kết giữa các cấp độ OKR
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between">
                  <Label>Bắt buộc liên kết OKR cha</Label>
                  <Switch 
                    checked={alignmentSettings.require_parent_alignment}
                    onCheckedChange={(checked) => 
                      setAlignmentSettings(prev => ({ ...prev, require_parent_alignment: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Cập nhật tự động khi cascade</Label>
                  <Switch 
                    checked={alignmentSettings.auto_cascade_updates}
                    onCheckedChange={(checked) => 
                      setAlignmentSettings(prev => ({ ...prev, auto_cascade_updates: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Liên kết giữa các phòng ban</Label>
                  <Switch 
                    checked={alignmentSettings.cross_department_alignment}
                    onCheckedChange={(checked) => 
                      setAlignmentSettings(prev => ({ ...prev, cross_department_alignment: checked }))
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Cảnh báo mất liên kết</Label>
                  <Switch 
                    checked={alignmentSettings.misalignment_alerts}
                    onCheckedChange={(checked) => 
                      setAlignmentSettings(prev => ({ ...prev, misalignment_alerts: checked }))
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Số cấp liên kết tối đa</Label>
                  <Input
                    type="number"
                    value={alignmentSettings.max_alignment_levels}
                    onChange={(e) => 
                      setAlignmentSettings(prev => ({ 
                        ...prev, 
                        max_alignment_levels: parseInt(e.target.value) || 3 
                      }))
                    }
                  />
                </div>

                <div>
                  <Label>Ngưỡng điểm liên kết (%)</Label>
                  <Input
                    type="number"
                    value={alignmentSettings.alignment_threshold}
                    onChange={(e) => 
                      setAlignmentSettings(prev => ({ 
                        ...prev, 
                        alignment_threshold: parseInt(e.target.value) || 70 
                      }))
                    }
                  />
                </div>

                <div>
                  <Label>Thời hạn cascade (ngày)</Label>
                  <Input
                    type="number"
                    value={alignmentSettings.cascade_deadline_days}
                    onChange={(e) => 
                      setAlignmentSettings(prev => ({ 
                        ...prev, 
                        cascade_deadline_days: parseInt(e.target.value) || 7 
                      }))
                    }
                  />
                </div>
              </div>

              <Button onClick={handleSaveAlignment} disabled={saveAlignmentSettings.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {saveAlignmentSettings.isPending ? 'Đang lưu...' : 'Lưu cài đặt liên kết'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements */}
        <TabsContent value="achievements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Quản lý thành tựu
              </CardTitle>
              <CardDescription>
                Thiết lập các thành tựu và huy hiệu cho hệ thống
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-end">
                <Button onClick={addNewAchievement} variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm thành tựu
                </Button>
              </div>

              <div className="space-y-4">
                {achievements.map((achievement) => (
                  <Card key={achievement.id} className="border">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-6 gap-4 items-end">
                        <div>
                          <Label>Tên thành tựu</Label>
                          <Input
                            value={achievement.name}
                            onChange={(e) => updateAchievement(achievement.id, 'name', e.target.value)}
                            placeholder="Tên thành tựu"
                          />
                        </div>

                        <div>
                          <Label>Icon (emoji hoặc text)</Label>
                          <Input
                            value={achievement.icon}
                            onChange={(e) => updateAchievement(achievement.id, 'icon', e.target.value)}
                            placeholder="🏆"
                          />
                        </div>

                        <div>
                          <Label>Điểm thưởng</Label>
                          <Input
                            type="number"
                            value={achievement.points}
                            onChange={(e) => updateAchievement(achievement.id, 'points', parseInt(e.target.value) || 0)}
                          />
                        </div>

                        <div>
                          <Label>Độ hiếm</Label>
                          <Select 
                            value={achievement.rarity} 
                            onValueChange={(value) => updateAchievement(achievement.id, 'rarity', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="common">Thường</SelectItem>
                              <SelectItem value="rare">Hiếm</SelectItem>
                              <SelectItem value="epic">Sử thi</SelectItem>
                              <SelectItem value="legendary">Huyền thoại</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label>Loại</Label>
                          <Select 
                            value={achievement.type} 
                            onValueChange={(value) => updateAchievement(achievement.id, 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="milestone">Cột mốc</SelectItem>
                              <SelectItem value="achievement">Thành tựu</SelectItem>
                              <SelectItem value="collaboration">Hợp tác</SelectItem>
                              <SelectItem value="excellence">Xuất sắc</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => removeAchievement(achievement.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4">
                        <Label>Mô tả</Label>
                        <Textarea
                          value={achievement.description}
                          onChange={(e) => updateAchievement(achievement.id, 'description', e.target.value)}
                          placeholder="Mô tả thành tựu này..."
                          rows={2}
                        />
                      </div>

                      <div className="mt-2">
                        <Badge className={getRarityColor(achievement.rarity)}>
                          {achievement.icon} {achievement.name}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button onClick={handleSaveAchievements} disabled={saveAchievements.isPending}>
                <Save className="h-4 w-4 mr-2" />
                {saveAchievements.isPending ? 'Đang lưu...' : 'Lưu danh sách thành tựu'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Cài đặt thông báo OKR
              </CardTitle>
              <CardDescription>
                Quản lý các loại thông báo trong hệ thống OKR
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Thông báo deadline</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label>Nhắc nhở trước deadline 7 ngày</Label>
                    <Switch 
                      checked={notificationSettings.deadline_7_days}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, deadline_7_days: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Nhắc nhở trước deadline 3 ngày</Label>
                    <Switch 
                      checked={notificationSettings.deadline_3_days}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, deadline_3_days: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Thông báo quá deadline</Label>
                    <Switch 
                      checked={notificationSettings.deadline_overdue}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, deadline_overdue: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Gửi email nhắc nhở</Label>
                    <Switch 
                      checked={notificationSettings.deadline_email}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, deadline_email: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Thông báo tiến độ</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label>Cập nhật Key Result</Label>
                    <Switch 
                      checked={notificationSettings.key_result_update}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, key_result_update: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>OKR hoàn thành</Label>
                    <Switch 
                      checked={notificationSettings.okr_completion}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, okr_completion: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Tiến độ chậm (dưới 30%)</Label>
                    <Switch 
                      checked={notificationSettings.slow_progress}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, slow_progress: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Nhắc nhở check-in hàng tuần</Label>
                    <Switch 
                      checked={notificationSettings.weekly_checkin_reminder}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, weekly_checkin_reminder: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Thông báo hợp tác</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label>Được mention trong comment</Label>
                    <Switch 
                      checked={notificationSettings.mention_in_comment}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, mention_in_comment: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Được thêm vào OKR</Label>
                    <Switch 
                      checked={notificationSettings.added_to_okr}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, added_to_okr: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>OKR được liên kết</Label>
                    <Switch 
                      checked={notificationSettings.okr_linked}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, okr_linked: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Yêu cầu phê duyệt</Label>
                    <Switch 
                      checked={notificationSettings.approval_request}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, approval_request: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Thông báo thành tựu</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center justify-between">
                    <Label>Mở khóa thành tựu mới</Label>
                    <Switch 
                      checked={notificationSettings.new_achievement}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, new_achievement: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Nhận OKR Coins</Label>
                    <Switch 
                      checked={notificationSettings.okr_coins_received}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, okr_coins_received: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Tăng hạng trong bảng xếp hạng</Label>
                    <Switch 
                      checked={notificationSettings.leaderboard_rank_up}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, leaderboard_rank_up: checked }))
                      }
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Chu kỳ OKR kết thúc</Label>
                    <Switch 
                      checked={notificationSettings.cycle_ended}
                      onCheckedChange={(checked) => 
                        setNotificationSettings(prev => ({ ...prev, cycle_ended: checked }))
                      }
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Cài đặt email</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center space-x-4">
                    <Label className="w-48">Tần suất gửi tóm tắt</Label>
                    <Select 
                      value={notificationSettings.summary_frequency}
                      onValueChange={(value) => 
                        setNotificationSettings(prev => ({ ...prev, summary_frequency: value }))
                      }
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Hàng ngày</SelectItem>
                        <SelectItem value="weekly">Hàng tuần</SelectItem>
                        <SelectItem value="monthly">Hàng tháng</SelectItem>
                        <SelectItem value="never">Không gửi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Label className="w-48">Thời gian gửi</Label>
                    <Select 
                      value={notificationSettings.summary_time}
                      onValueChange={(value) => 
                        setNotificationSettings(prev => ({ ...prev, summary_time: value }))
                      }
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="07:00">07:00</SelectItem>
                        <SelectItem value="08:00">08:00</SelectItem>
                        <SelectItem value="09:00">09:00</SelectItem>
                        <SelectItem value="10:00">10:00</SelectItem>
                        <SelectItem value="17:00">17:00</SelectItem>
                        <SelectItem value="18:00">18:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleSaveNotifications} 
                disabled={saveNotificationSettings.isPending}
                className="w-full"
              >
                <Save className="h-4 w-4 mr-2" />
                {saveNotificationSettings.isPending ? 'Đang lưu...' : 'Lưu cài đặt thông báo'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
