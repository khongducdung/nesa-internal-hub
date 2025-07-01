
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, 
  HandHeart, 
  Send, 
  Users, 
  MessageSquare,
  Trophy,
  Star,
  Gift,
  Clock,
  User,
  ThumbsUp,
  Award
} from 'lucide-react';

export function EmotionalRewards() {
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [message, setMessage] = useState('');
  const [selectedType, setSelectedType] = useState<'trust' | 'dedication'>('trust');

  // Mock data - sẽ thay thế bằng API call
  const employees = [
    { id: '1', name: 'Nguyễn Văn A', department: 'Kinh Doanh' },
    { id: '2', name: 'Trần Thị B', department: 'Kỹ Thuật' },
    { id: '3', name: 'Lê Văn C', department: 'Marketing' },
    { id: '4', name: 'Phạm Thị D', department: 'Nhân Sự' }
  ];

  const myRewards = {
    trust_points: 89,
    dedication_points: 92,
    total_sent: 45,
    total_received: 67
  };

  const recentActivities = [
    {
      id: 1,
      type: 'received',
      reward_type: 'trust',
      from: 'Nguyễn Văn A',
      points: 5,
      message: 'Cảm ơn sự hỗ trợ tuyệt vời trong dự án!',
      date: '2024-03-15',
      department: 'Kinh Doanh'
    },
    {
      id: 2,
      type: 'sent',
      reward_type: 'dedication',
      to: 'Trần Thị B',
      points: 3,
      message: 'Làm việc rất chăm chỉ và tận tâm!',
      date: '2024-03-14',
      department: 'Kỹ Thuật'
    },
    {
      id: 3,
      type: 'received',
      reward_type: 'trust',
      from: 'Leader Team',
      points: 10,
      message: 'Xuất sắc trong việc hoàn thành OKR Q1!',
      date: '2024-03-13',
      department: 'Management'
    }
  ];

  const handleSendReward = () => {
    if (!selectedEmployee || !message) return;
    
    // Logic gửi thưởng cảm xúc
    console.log('Sending reward:', {
      to: selectedEmployee,
      type: selectedType,
      message
    });
    
    // Reset form
    setSelectedEmployee('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Heart className="h-6 w-6 text-red-500" />
            Thưởng cảm xúc
          </h2>
          <p className="text-gray-600 mt-1">
            Gửi và nhận điểm Trust & Cống hiến từ đồng nghiệp
          </p>
        </div>
      </div>

      {/* My Emotional Points Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <HandHeart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-700">{myRewards.trust_points}</div>
            <div className="text-sm text-blue-600">Điểm Trust</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <CardContent className="p-4 text-center">
            <Heart className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-red-700">{myRewards.dedication_points}</div>
            <div className="text-sm text-red-600">Điểm Cống hiến</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
          <CardContent className="p-4 text-center">
            <Send className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-700">{myRewards.total_sent}</div>
            <div className="text-sm text-green-600">Đã gửi</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200">
          <CardContent className="p-4 text-center">
            <Gift className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-700">{myRewards.total_received}</div>
            <div className="text-sm text-purple-600">Đã nhận</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="send" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="send">Gửi thưởng</TabsTrigger>
          <TabsTrigger value="history">Lịch sử</TabsTrigger>
          <TabsTrigger value="leaderboard">Bảng xếp hạng</TabsTrigger>
        </TabsList>

        {/* Send Emotional Rewards */}
        <TabsContent value="send" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="h-5 w-5 text-blue-600" />
                Gửi thưởng cảm xúc cho đồng nghiệp
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Chọn đồng nghiệp</label>
                  <select 
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">-- Chọn nhân viên --</option>
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name} - {emp.department}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Loại thưởng</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedType('trust')}
                      className={`flex-1 p-2 rounded-md border-2 transition-colors ${
                        selectedType === 'trust' 
                          ? 'border-blue-500 bg-blue-50 text-blue-700' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <HandHeart className="h-4 w-4 mx-auto mb-1" />
                      <div className="text-sm">Trust Point</div>
                    </button>
                    <button
                      onClick={() => setSelectedType('dedication')}
                      className={`flex-1 p-2 rounded-md border-2 transition-colors ${
                        selectedType === 'dedication' 
                          ? 'border-red-500 bg-red-50 text-red-700' 
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <Heart className="h-4 w-4 mx-auto mb-1" />
                      <div className="text-sm">Cống hiến</div>
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Lời nhắn</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Viết lời cảm ơn hoặc ghi nhận đóng góp của đồng nghiệp..."
                  className="min-h-[100px]"
                />
              </div>

              <Button 
                onClick={handleSendReward}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                disabled={!selectedEmployee || !message}
              >
                <Send className="h-4 w-4 mr-2" />
                Gửi thưởng cảm xúc
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History */}
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-600" />
                Lịch sử thưởng cảm xúc
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === 'received' ? 'bg-green-100' : 'bg-blue-100'
                    }`}>
                      {activity.type === 'received' ? (
                        <Gift className="h-5 w-5 text-green-600" />
                      ) : (
                        <Send className="h-5 w-5 text-blue-600" />
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-sm font-medium ${
                          activity.type === 'received' ? 'text-green-700' : 'text-blue-700'
                        }`}>
                          {activity.type === 'received' ? 'Nhận từ' : 'Gửi cho'} {
                            activity.type === 'received' ? activity.from : activity.to
                          }
                        </span>
                        <Badge className={`${
                          activity.reward_type === 'trust' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {activity.reward_type === 'trust' ? (
                            <>
                              <HandHeart className="h-3 w-3 mr-1" />
                              +{activity.points} Trust
                            </>
                          ) : (
                            <>
                              <Heart className="h-3 w-3 mr-1" />
                              +{activity.points} Cống hiến
                            </>
                          )}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{activity.message}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <User className="h-3 w-3" />
                        <span>{activity.department}</span>
                        <span>•</span>
                        <span>{new Date(activity.date).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emotional Rewards Leaderboard */}
        <TabsContent value="leaderboard" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-700">
                  <HandHeart className="h-5 w-5" />
                  Top Trust Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Nguyễn Văn A', points: 145, department: 'Kinh Doanh' },
                    { name: 'Trần Thị B', points: 132, department: 'Kỹ Thuật' },
                    { name: 'Lê Văn C', points: 118, department: 'Marketing' },
                    { name: 'Tôi', points: 89, department: 'Marketing', isMe: true }
                  ].map((person, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                      person.isMe ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100">
                          <span className="text-sm font-bold text-blue-700">#{index + 1}</span>
                        </div>
                        <div>
                          <div className={`font-medium text-sm ${person.isMe ? 'text-blue-800' : 'text-gray-900'}`}>
                            {person.name}
                          </div>
                          <div className="text-xs text-gray-500">{person.department}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-blue-600">{person.points}</div>
                        <div className="text-xs text-gray-500">Trust</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-700">
                  <Heart className="h-5 w-5" />
                  Top Cống hiến
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: 'Phạm Thị D', points: 158, department: 'Nhân Sự' },
                    { name: 'Hoàng Văn E', points: 142, department: 'Kỹ Thuật' },
                    { name: 'Tôi', points: 92, department: 'Marketing', isMe: true },
                    { name: 'Vũ Thị F', points: 88, department: 'Kinh Doanh' }
                  ].map((person, index) => (
                    <div key={index} className={`flex items-center justify-between p-3 rounded-lg ${
                      person.isMe ? 'bg-red-50 border border-red-200' : 'bg-gray-50'
                    }`}>
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-100">
                          <span className="text-sm font-bold text-red-700">#{index + 1}</span>
                        </div>
                        <div>
                          <div className={`font-medium text-sm ${person.isMe ? 'text-red-800' : 'text-gray-900'}`}>
                            {person.name}
                          </div>
                          <div className="text-xs text-gray-500">{person.department}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-red-600">{person.points}</div>
                        <div className="text-xs text-gray-500">Cống hiến</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
