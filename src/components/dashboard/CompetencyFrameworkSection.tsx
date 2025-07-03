import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Award, 
  BookOpen, 
  Target, 
  Star,
  TrendingUp,
  User,
  Lightbulb
} from 'lucide-react';
import { useUserCompetencyFramework } from '@/hooks/useDashboard';
import { useNavigate } from 'react-router-dom';

export function CompetencyFrameworkSection() {
  const { data: framework } = useUserCompetencyFramework();
  const navigate = useNavigate();

  if (!framework) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Khung năng lực của tôi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">
              Chưa có khung năng lực được thiết lập cho vị trí của bạn
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Liên hệ với HR để thiết lập khung năng lực
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Parse competencies JSON
  const competencies = framework.competencies as any[] || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5" />
          Khung năng lực của tôi
        </CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          {framework.name}
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Framework Overview */}
          {framework.description && (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-start gap-3">
                <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Mô tả khung năng lực</h4>
                  <p className="text-blue-700 text-sm">
                    {framework.description}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Competencies List */}
          <div className="space-y-4">
            <h4 className="font-semibold flex items-center gap-2">
              <Target className="h-4 w-4" />
              Các năng lực cần thiết
            </h4>
            
            {competencies.length > 0 ? (
              <div className="space-y-3">
                {competencies.slice(0, 5).map((competency, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h5 className="font-medium">{competency.name || `Năng lực ${index + 1}`}</h5>
                        {competency.description && (
                          <p className="text-sm text-muted-foreground mt-1">
                            {competency.description}
                          </p>
                        )}
                      </div>
                      <Badge variant="outline" className="ml-2">
                        {competency.level || 'Trung bình'}
                      </Badge>
                    </div>
                    
                    {/* Mock progress - would be actual assessment data */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Mức độ thành thạo</span>
                        <span className="font-medium">{Math.floor(Math.random() * 30) + 70}%</span>
                      </div>
                      <Progress value={Math.floor(Math.random() * 30) + 70} className="h-2" />
                    </div>
                  </div>
                ))}
                
                {competencies.length > 5 && (
                  <div className="text-center pt-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => navigate('/hrm')}
                    >
                      Xem tất cả {competencies.length} năng lực
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4">
                <Star className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">
                  Khung năng lực đang được thiết lập
                </p>
              </div>
            )}
          </div>

          {/* Assessment Status */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-sm">Đánh giá năng lực</p>
                <p className="text-muted-foreground text-xs">
                  Lần đánh giá gần nhất: Chưa có
                </p>
              </div>
              <Button 
                size="sm" 
                onClick={() => navigate('/hrm')}
              >
                <User className="h-4 w-4 mr-2" />
                Tự đánh giá
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}