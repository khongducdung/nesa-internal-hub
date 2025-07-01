
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Target, 
  Users, 
  MessageSquare, 
  Settings, 
  Gift,
  Coins,
  Heart,
  HandHeart
} from 'lucide-react';

export function OKRQuickActions() {
  // Mock data cho OKR Coins và Emotional Rewards
  const okrCoins = 2850;
  const trustPoints = 89;
  const dedicationPoints = 92;

  return (
    <div className="space-y-6">
      {/* OKR Coins & Emotional Rewards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Coins className="h-8 w-8 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-yellow-700">{okrCoins}</div>
            <div className="text-xs text-yellow-600">OKR Coins</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <HandHeart className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-700">{trustPoints}</div>
            <div className="text-xs text-blue-600">Điểm Trust</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200">
          <CardContent className="p-4 text-center">
            <div className="flex items-center justify-center mb-2">
              <Heart className="h-8 w-8 text-red-600" />
            </div>
            <div className="text-2xl font-bold text-red-700">{dedicationPoints}</div>
            <div className="text-xs text-red-600">Điểm Cống hiến</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Hành động nhanh
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <Target className="h-5 w-5" />
              <span className="text-xs">Tạo OKR</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <span className="text-xs">Feedback</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <Users className="h-5 w-5" />
              <span className="text-xs">Đánh giá đồng nghiệp</span>
            </Button>
            
            <Button variant="outline" className="h-20 flex flex-col items-center gap-2">
              <Gift className="h-5 w-5" />
              <span className="text-xs">Đổi quà</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Hoạt động gần đây</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">Bạn đã nhận được 50 OKR Coins</div>
                <div className="text-xs text-gray-500">Hoàn thành Key Result "Tăng doanh số 15%"</div>
              </div>
              <Badge className="bg-yellow-100 text-yellow-800">+50 Coins</Badge>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">Nguyễn Văn A đã gửi Trust Point cho bạn</div>
                <div className="text-xs text-gray-500">"Cảm ơn sự hỗ trợ tuyệt vời trong dự án!"</div>
              </div>
              <Badge className="bg-blue-100 text-blue-800">+5 Trust</Badge>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <div className="text-sm font-medium">Bạn đã lên hạng #3 trong bảng xếp hạng</div>
                <div className="text-xs text-gray-500">Tăng 2 bậc so với tuần trước</div>
              </div>
              <Badge className="bg-purple-100 text-purple-800">Rank Up!</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
