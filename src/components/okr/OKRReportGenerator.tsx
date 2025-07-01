
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Download, FileText, Calendar, TrendingUp, BarChart3, 
  PieChart, Users, Building2, Award, Target
} from 'lucide-react';
import { useOKRAnalytics } from '@/hooks/useOKRAnalytics';
import { useAuth } from '@/hooks/useAuth';

interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  format: 'pdf' | 'excel' | 'word';
  category: 'executive' | 'management' | 'team' | 'individual';
}

export function OKRReportGenerator() {
  const { analytics, loading, period, setPeriod, level, setLevel } = useOKRAnalytics();
  const { isAdmin } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [generatingReport, setGeneratingReport] = useState(false);

  const reportTemplates: ReportTemplate[] = [
    {
      id: 'executive-summary',
      name: 'Báo cáo điều hành',
      description: 'Tổng quan hiệu suất OKR cho lãnh đạo cấp cao',
      icon: Building2,
      format: 'pdf',
      category: 'executive'
    },
    {
      id: 'department-performance',
      name: 'Hiệu suất phòng ban',
      description: 'Phân tích chi tiết theo từng phòng ban',
      icon: Users,
      format: 'excel',
      category: 'management'
    },
    {
      id: 'progress-tracking',
      name: 'Theo dõi tiến độ',
      description: 'Báo cáo tiến độ chi tiết theo thời gian',
      icon: TrendingUp,
      format: 'pdf',
      category: 'management'
    },
    {
      id: 'individual-assessment',
      name: 'Đánh giá cá nhân',
      description: 'Báo cáo hiệu suất OKR cá nhân',
      icon: Award,
      format: 'word',
      category: 'individual'
    }
  ];

  const generateReport = async (templateId: string) => {
    setGeneratingReport(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const template = reportTemplates.find(t => t.id === templateId);
    if (template) {
      // Mock download
      const fileName = `OKR_Report_${template.name}_${new Date().toISOString().split('T')[0]}.${template.format}`;
      console.log(`Generating report: ${fileName}`);
      
      // Create mock download
      const element = document.createElement('a');
      element.href = '#';
      element.download = fileName;
      element.click();
    }
    
    setGeneratingReport(false);
  };

  if (loading || !analytics) {
    return <div className="flex items-center justify-center h-64">Đang tải dữ liệu...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-600" />
            Tạo báo cáo OKR
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Chu kỳ báo cáo</label>
              <Select value={period} onValueChange={setPeriod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Hiện tại</SelectItem>
                  <SelectItem value="q1-2024">Q1 2024</SelectItem>
                  <SelectItem value="q2-2024">Q2 2024</SelectItem>
                  <SelectItem value="yearly">Cả năm 2024</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Cấp độ phân tích</label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="company">Công ty</SelectItem>
                  <SelectItem value="department">Phòng ban</SelectItem>
                  <SelectItem value="individual">Cá nhân</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Mẫu báo cáo</label>
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn mẫu báo cáo" />
                </SelectTrigger>
                <SelectContent>
                  {reportTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedTemplate && (
            <div className="mb-6">
              {reportTemplates
                .filter(t => t.id === selectedTemplate)
                .map((template) => {
                  const Icon = template.icon;
                  return (
                    <div key={template.id} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon className="h-5 w-5 text-blue-600" />
                        <h4 className="font-medium text-blue-900">{template.name}</h4>
                        <Badge variant="outline">{template.format.toUpperCase()}</Badge>
                      </div>
                      <p className="text-sm text-blue-700">{template.description}</p>
                    </div>
                  );
                })}
            </div>
          )}

          <div className="flex gap-3">
            <Button 
              onClick={() => selectedTemplate && generateReport(selectedTemplate)}
              disabled={!selectedTemplate || generatingReport}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {generatingReport ? 'Đang tạo...' : 'Tạo báo cáo'}
            </Button>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Lên lịch báo cáo
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Preview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tổng OKRs</p>
                <p className="text-2xl font-bold">{analytics.totalOKRs}</p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tiến độ TB</p>
                <p className="text-2xl font-bold text-green-600">{analytics.avgProgress}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
            <Progress value={analytics.avgProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Đúng tiến độ</p>
                <p className="text-2xl font-bold text-blue-600">{analytics.onTrackCount}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Hoàn thành</p>
                <p className="text-2xl font-bold text-orange-600">{analytics.completedCount}</p>
              </div>
              <Award className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Department Performance */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-600" />
              Hiệu suất theo phòng ban
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.departmentBreakdown.map((dept, index) => (
                <div key={dept.name} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">{dept.name}</h4>
                    <Badge variant={dept.progress >= 80 ? 'default' : dept.progress >= 60 ? 'secondary' : 'destructive'}>
                      {dept.progress}%
                    </Badge>
                  </div>
                  <Progress value={dept.progress} className="mb-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{dept.onTrack}/{dept.total} OKR đúng tiến độ</span>
                    <span>{Math.round((dept.onTrack / dept.total) * 100)}% hiệu suất</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
