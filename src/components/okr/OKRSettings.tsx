
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
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
  Save,
  Plus,
  Edit,
  Trash2,
  Bell,
  Shield,
  Zap,
  Clock,
  TrendingUp,
  Eye
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RuleEditDialog } from './dialogs/RuleEditDialog';
import { AchievementCreateDialog } from './dialogs/AchievementCreateDialog';

interface RewardRule {
  id: number;
  category: string;
  action: string;
  reward: string;
  conditions: string;
  status: string;
  priority: string;
  usage_count: number;
}

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: string;
  type: string;
  points: number;
  status: string;
}

export function OKRSettings() {
  const { toast } = useToast();
  const [loading, setSaving] = useState(false);
  const [newRuleOpen, setNewRuleOpen] = useState(false);
  const [editRuleOpen, setEditRuleOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<RewardRule | null>(null);
  const [createAchievementOpen, setCreateAchievementOpen] = useState(false);
  const [editAchievementOpen, setEditAchievementOpen] = useState(false);
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  
  const [settings, setSettings] = useState({
    // Reward System Settings
    okr_coins_per_completion: 100,
    trust_points_limit_per_day: 10,
    dedication_points_limit_per_day: 5,
    bonus_multiplier: 1.5,
    early_completion_bonus: 50,
    
    // Achievement Settings
    enable_public_leaderboard: true,
    enable_achievements: true,
    enable_emotional_rewards: true,
    enable_peer_recognition: true,
    
    // Cycle Settings
    default_cycle_duration: 90,
    auto_create_next_cycle: true,
    allow_mid_cycle_changes: false,
    require_manager_approval: true,
    
    // Notification Settings
    notify_on_okr_completion: true,
    notify_on_rewards_received: true,
    notify_on_cycle_end: true,
    daily_reminder: true,
    weekly_summary: true
  });

  const [rewardRules, setRewardRules] = useState<RewardRule[]>([
    {
      id: 1,
      category: 'OKR Completion',
      action: 'Hoàn thành 100% Key Results',
      reward: '100 OKR Coins + 10 Trust Points',
      conditions: 'Trong thời hạn quy định',
      status: 'active',
      priority: 'high',
      usage_count: 45
    },
    {
      id: 2,
      category: 'OKR Completion',
      action: 'Hoàn thành trước hạn 1 tuần',
      reward: '150 OKR Coins + 15 Trust Points + Badge',
      conditions: 'Hoàn thành ít nhất 7 ngày trước deadline',
      status: 'active',
      priority: 'high',
      usage_count: 23
    },
    {
      id: 3,
      category: 'Excellence',
      action: 'Vượt mục tiêu 120%+',
      reward: '200 OKR Coins + 20 Trust Points + Badge "Xuất sắc"',
      conditions: 'Đạt từ 120% trở lên so với mục tiêu',
      status: 'active',
      priority: 'high',
      usage_count: 12
    },
    {
      id: 4,
      category: 'Collaboration',
      action: 'Hỗ trợ 3+ OKR của đồng nghiệp',
      reward: '50 OKR Coins + 5 Dedication Points',
      conditions: 'Được xác nhận bởi người được hỗ trợ',
      status: 'active',
      priority: 'medium',
      usage_count: 31
    },
    {
      id: 5,
      category: 'Leadership',
      action: 'Team đạt 90%+ OKR',
      reward: '300 OKR Coins + Leadership Badge',
      conditions: 'Tất cả thành viên trong team đạt từ 90% trở lên',
      status: 'active',
      priority: 'high',
      usage_count: 8
    }
  ]);

  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: 1,
      name: 'First Goal',
      description: 'Hoàn thành OKR đầu tiên',
      icon: '🎯',
      type: 'milestone',
      points: 50,
      status: 'active'
    },
    {
      id: 2,
      name: 'Speed Runner',
      description: 'Hoàn thành OKR trước hạn 3 lần',
      icon: '⚡',
      type: 'achievement',
      points: 150,
      status: 'active'
    },
    {
      id: 3,
      name: 'Team Player',
      description: 'Hỗ trợ đồng nghiệp 10 lần',
      icon: '🤝',
      type: 'collaboration',
      points: 200,
      status: 'active'
    },
    {
      id: 4,
      name: 'Perfectionist',
      description: 'Đạt 100% trong 5 OKR liên tiếp',
      icon: '💎',
      type: 'excellence',
      points: 500,
      status: 'draft'
    }
  ]);

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Cài đặt đã được lưu",
        description: "Tất cả thay đổi đã được áp dụng thành công",
      });
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể lưu cài đặt. Vui lòng thử lại.",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleEditRule = (rule: RewardRule) => {
    setSelectedRule(rule);
    setEditRuleOpen(true);
  };

  const handleViewRule = (rule: RewardRule) => {
    setSelectedRule(rule);
    // Could open a view-only dialog
    toast({
      title: "Xem chi tiết quy tắc",
      description: `${rule.action} - ${rule.reward}`,
    });
  };

  const handleDeleteRule = (ruleId: number) => {
    setRewardRules(prev => prev.filter(rule => rule.id !== ruleId));
    toast({
      title: "Đã xóa quy tắc",
      description: "Quy tắc thưởng đã được xóa thành công",
    });
  };

  const handleSaveRule = (updatedRule: RewardRule) => {
    if (updatedRule.id === 0) {
      // New rule
      const newRule = { ...updatedRule, id: Date.now(), usage_count: 0 };
      setRewardRules(prev => [...prev, newRule]);
    } else {
      // Edit existing rule
      setRewardRules(prev => prev.map(rule => 
        rule.id === updatedRule.id ? updatedRule : rule
      ));
    }
  };

  const handleEditAchievement = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setEditAchievementOpen(true);
  };

  const handleDeleteAchievement = (achievementId: number) => {
    setAchievements(prev => prev.filter(ach => ach.id !== achievementId));
    toast({
      title: "Đã xóa huy hiệu",
      description: "Huy hiệu đã được xóa thành công",
    });
  };

  const handleSaveAchievement = (achievementData: Omit<Achievement, 'id'>) => {
    if (selectedAchievement) {
      // Edit existing achievement
      setAchievements(prev => prev.map(ach => 
        ach.id === selectedAchievement.id 
          ? { ...achievementData, id: selectedAchievement.id }
          : ach
      ));
    } else {
      // New achievement
      const newAchievement = { ...achievementData, id: Date.now() };
      setAchievements(prev => [...prev, newAchievement]);
    }
    setSelectedAchievement(null);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Cài đặt OKR</h2>
          <p className="text-gray-600 mt-1">
            Quản lý hệ thống thưởng, quy tắc và vận hành OKR
          </p>
        </div>
        <Button 
          onClick={handleSaveSettings} 
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {loading ? (
            <>
              <Clock className="h-4 w-4 mr-2 animate-spin" />
              Đang lưu...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Lưu cài đặt
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="rewards" className="w-full">
        <TabsList className="grid w-full grid-cols-5 h-12">
          <TabsTrigger value="rewards" className="flex items-center gap-2">
            <Coins className="h-4 w-4" />
            Hệ thống thưởng
          </TabsTrigger>
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Quy tắc thưởng
          </TabsTrigger>
          <TabsTrigger value="achievements" className="flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Huy hiệu
          </TabsTrigger>
          <TabsTrigger value="cycles" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Chu kỳ OKR
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            Thông báo
          </TabsTrigger>
        </TabsList>

        {/* Reward System Settings */}
        <TabsContent value="rewards" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Coins className="h-5 w-5 text-yellow-600" />
                  Cài đặt OKR Coins
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="coins-completion">Coins khi hoàn thành OKR</Label>
                  <Input
                    id="coins-completion"
                    type="number"
                    value={settings.okr_coins_per_completion}
                    onChange={(e) => handleSettingChange('okr_coins_per_completion', parseInt(e.target.value))}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="early-bonus">Thưởng hoàn thành sớm (%)</Label>
                  <Input
                    id="early-bonus"
                    type="number"
                    value={settings.early_completion_bonus}
                    onChange={(e) => handleSettingChange('early_completion_bonus', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bonus-multiplier">Hệ số nhân thưởng</Label>
                  <Input
                    id="bonus-multiplier"
                    type="number"
                    step="0.1"
                    value={settings.bonus_multiplier}
                    onChange={(e) => handleSettingChange('bonus_multiplier', parseFloat(e.target.value))}
                  />
                </div>
                
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                    <Gift className="h-4 w-4" />
                    Tỷ giá quy đổi
                  </h4>
                  <div className="space-y-1 text-sm text-yellow-700">
                    <div>• 1000 Coins = 1 ngày nghỉ phép</div>
                    <div>• 500 Coins = Voucher ăn trưa 100k</div>
                    <div>• 2000 Coins = Thưởng tiền mặt 500k</div>
                    <div>• 5000 Coins = Voucher du lịch 2tr</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-purple-600" />
                  Điểm cảm xúc & Tương tác
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="trust-limit">Giới hạn Trust Points/ngày</Label>
                  <Input
                    id="trust-limit"
                    type="number"
                    value={settings.trust_points_limit_per_day}
                    onChange={(e) => handleSettingChange('trust_points_limit_per_day', parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dedication-limit">Giới hạn Dedication Points/ngày</Label>
                  <Input
                    id="dedication-limit"
                    type="number"
                    value={settings.dedication_points_limit_per_day}
                    onChange={(e) => handleSettingChange('dedication_points_limit_per_day', parseInt(e.target.value))}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Bảng xếp hạng công khai</Label>
                      <p className="text-sm text-gray-500">Hiển thị thành tích của mọi người</p>
                    </div>
                    <Switch
                      checked={settings.enable_public_leaderboard}
                      onCheckedChange={(checked) => handleSettingChange('enable_public_leaderboard', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Hệ thống huy hiệu</Label>
                      <p className="text-sm text-gray-500">Kích hoạt achievements</p>
                    </div>
                    <Switch
                      checked={settings.enable_achievements}
                      onCheckedChange={(checked) => handleSettingChange('enable_achievements', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Thưởng cảm xúc</Label>
                      <p className="text-sm text-gray-500">Cho phép gửi emoji, sticker</p>
                    </div>
                    <Switch
                      checked={settings.enable_emotional_rewards}
                      onCheckedChange={(checked) => handleSettingChange('enable_emotional_rewards', checked)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Reward Rules */}
        <TabsContent value="rules" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Quy tắc thưởng tự động</h3>
              <p className="text-gray-600">Quản lý các điều kiện và mức thưởng cho từng hành động</p>
            </div>
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                setSelectedRule(null);
                setNewRuleOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm quy tắc
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="space-y-1">
                {rewardRules.map((rule, index) => (
                  <div key={rule.id} className="flex items-center justify-between p-4 hover:bg-gray-50 border-b last:border-b-0">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="outline" className="text-xs">{rule.category}</Badge>
                        <Badge className={`text-xs ${getPriorityColor(rule.priority)}`}>
                          {rule.priority === 'high' ? 'Cao' : rule.priority === 'medium' ? 'TB' : 'Thấp'}
                        </Badge>
                        <Badge className={`text-xs ${
                          rule.status === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {rule.status === 'active' ? 'Hoạt động' : 'Nháp'}
                        </Badge>
                      </div>
                      <div className="font-medium text-gray-900 mb-1">{rule.action}</div>
                      <div className="text-sm text-blue-600 mb-1">🎁 {rule.reward}</div>
                      <div className="text-xs text-gray-500">{rule.conditions}</div>
                      <div className="text-xs text-gray-400 mt-2">Đã sử dụng: {rule.usage_count} lần</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewRule(rule)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleEditRule(rule)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteRule(rule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements */}
        <TabsContent value="achievements" className="space-y-4">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold">Quản lý huy hiệu</h3>
              <p className="text-gray-600">Tạo và quản lý các huy hiệu thành tích danh giá</p>
            </div>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              onClick={() => {
                setSelectedAchievement(null);
                setCreateAchievementOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Tạo huy hiệu
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="hover:shadow-lg transition-all hover:scale-105 bg-gradient-to-br from-white to-gray-50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="text-3xl filter drop-shadow-lg">{achievement.icon}</div>
                    <Badge className={`text-xs ${
                      achievement.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {achievement.status === 'active' ? 'Hoạt động' : 'Nháp'}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{achievement.name}</h4>
                  <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1 text-sm text-blue-600 font-medium">
                      <Star className="h-4 w-4" />
                      {achievement.points} điểm
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {achievement.type}
                    </Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleEditAchievement(achievement)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Sửa
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600"
                      onClick={() => handleDeleteAchievement(achievement.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Cycle Settings */}
        <TabsContent value="cycles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                Cài đặt chu kỳ OKR
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cycle-duration">Thời gian chu kỳ mặc định (ngày)</Label>
                    <Input
                      id="cycle-duration"
                      type="number"
                      value={settings.default_cycle_duration}
                      onChange={(e) => handleSettingChange('default_cycle_duration', parseInt(e.target.value))}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Tự động tạo chu kỳ tiếp theo</Label>
                        <p className="text-sm text-gray-500">Khi chu kỳ hiện tại kết thúc</p>
                      </div>
                      <Switch
                        checked={settings.auto_create_next_cycle}
                        onCheckedChange={(checked) => handleSettingChange('auto_create_next_cycle', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Cho phép thay đổi giữa chu kỳ</Label>
                        <p className="text-sm text-gray-500">Nhân viên có thể sửa OKR</p>
                      </div>
                      <Switch
                        checked={settings.allow_mid_cycle_changes}
                        onCheckedChange={(checked) => handleSettingChange('allow_mid_cycle_changes', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Yêu cầu phê duyệt quản lý</Label>
                        <p className="text-sm text-gray-500">Manager phải duyệt mới có hiệu lực</p>
                      </div>
                      <Switch
                        checked={settings.require_manager_approval}
                        onCheckedChange={(checked) => handleSettingChange('require_manager_approval', checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                      <Shield className="h-4 w-4" />
                      Nguyên tắc OKR
                    </h4>
                    <ul className="space-y-1 text-sm text-blue-700">
                      <li>• Chu kỳ OKR tiêu chuẩn là 90 ngày (1 quý)</li>
                      <li>• Mỗi Objective nên có 3-5 Key Results</li>
                      <li>• Key Results phải có thể đo lường được</li>
                      <li>• Không nên thay đổi mục tiêu quá 2 lần/chu kỳ</li>
                      <li>• Đánh giá và review cuối mỗi chu kỳ</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                      <TrendingUp className="h-4 w-4" />
                      Thống kê chu kỳ hiện tại
                    </h4>
                    <div className="space-y-2 text-sm text-green-700">
                      <div className="flex justify-between">
                        <span>Tổng số OKR:</span>
                        <span className="font-medium">156</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Đã hoàn thành:</span>
                        <span className="font-medium">89 (57%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Đang tiến hành:</span>
                        <span className="font-medium">52 (33%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Chậm tiến độ:</span>
                        <span className="font-medium">15 (10%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-600" />
                Cài đặt thông báo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <h4 className="font-medium text-gray-900">Thông báo hệ thống</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Hoàn thành OKR</Label>
                        <p className="text-sm text-gray-500">Thông báo khi có OKR được hoàn thành</p>
                      </div>
                      <Switch
                        checked={settings.notify_on_okr_completion}
                        onCheckedChange={(checked) => handleSettingChange('notify_on_okr_completion', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Nhận thưởng</Label>
                        <p className="text-sm text-gray-500">Thông báo khi nhận coins, points</p>
                      </div>
                      <Switch
                        checked={settings.notify_on_rewards_received}
                        onCheckedChange={(checked) => handleSettingChange('notify_on_rewards_received', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Cuối chu kỳ</Label>
                        <p className="text-sm text-gray-500">Nhắc nhở đánh giá và chuẩn bị chu kỳ mới</p>
                      </div>
                      <Switch
                        checked={settings.notify_on_cycle_end}
                        onCheckedChange={(checked) => handleSettingChange('notify_on_cycle_end', checked)}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="font-medium text-gray-900">Nhắc nhở định kỳ</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Nhắc nhở hàng ngày</Label>
                        <p className="text-sm text-gray-500">Nhắc cập nhật tiến độ OKR</p>
                      </div>
                      <Switch
                        checked={settings.daily_reminder}
                        onCheckedChange={(checked) => handleSettingChange('daily_reminder', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Báo cáo tuần</Label>
                        <p className="text-sm text-gray-500">Tóm tắt tiến độ hàng tuần</p>
                      </div>
                      <Switch
                        checked={settings.weekly_summary}
                        onCheckedChange={(checked) => handleSettingChange('weekly_summary', checked)}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="font-medium text-gray-800">Tần suất thông báo</h5>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Nhắc nhở cập nhật tiến độ</Label>
                        <Select defaultValue="daily">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Hàng ngày</SelectItem>
                            <SelectItem value="weekly">Hàng tuần</SelectItem>
                            <SelectItem value="never">Không</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-sm">Báo cáo tổng kết</Label>
                        <Select defaultValue="weekly">
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="weekly">Hàng tuần</SelectItem>
                            <SelectItem value="monthly">Hàng tháng</SelectItem>
                            <SelectItem value="quarterly">Hàng quý</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <h4 className="font-medium text-orange-800 mb-2 flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Thông báo thông minh
                </h4>
                <p className="text-sm text-orange-700 mb-3">
                  Hệ thống sẽ tự động điều chỉnh tần suất thông báo dựa trên:
                </p>
                <ul className="space-y-1 text-sm text-orange-700">
                  <li>• Mức độ tương tác của người dùng</li>
                  <li>• Tiến độ hoàn thành OKR</li>
                  <li>• Thời gian còn lại của chu kỳ</li>
                  <li>• Độ ưu tiên của từng mục tiêu</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <RuleEditDialog
        open={newRuleOpen}
        onOpenChange={setNewRuleOpen}
        rule={null}
        onSave={handleSaveRule}
      />
      
      <RuleEditDialog
        open={editRuleOpen}
        onOpenChange={setEditRuleOpen}
        rule={selectedRule}
        onSave={handleSaveRule}
      />

      <AchievementCreateDialog
        open={createAchievementOpen}
        onOpenChange={setCreateAchievementOpen}
        achievement={null}
        onSave={handleSaveAchievement}
      />

      <AchievementCreateDialog
        open={editAchievementOpen}
        onOpenChange={setEditAchievementOpen}
        achievement={selectedAchievement}
        onSave={handleSaveAchievement}
      />
    </div>
  );
}
