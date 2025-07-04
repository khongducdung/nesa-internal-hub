import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  FileText, 
  Calendar, 
  Eye, 
  Shield, 
  BookOpen, 
  Users, 
  Building,
  Clock,
  ArrowRight
} from 'lucide-react';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useCompanyPolicies } from '@/hooks/useCompanyPolicies';

export function CompanyPoliciesSection() {
  const { data: policies, isLoading } = useCompanyPolicies();
  const [selectedPolicy, setSelectedPolicy] = useState(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200">Hiệu lực</Badge>;
      case 'draft':
        return <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200">Bản nháp</Badge>;
      case 'inactive':
        return <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200">Ngưng hiệu lực</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'hr':
      case 'nhân sự':
        return <Users className="h-4 w-4" />;
      case 'security':
      case 'bảo mật':
        return <Shield className="h-4 w-4" />;
      case 'operation':
      case 'vận hành':
        return <Building className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'hr':
      case 'nhân sự':
        return 'text-blue-600 bg-blue-50';
      case 'security':
      case 'bảo mật':
        return 'text-red-600 bg-red-50';
      case 'operation':
      case 'vận hành':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-purple-600 bg-purple-50';
    }
  };

  const activePolicies = policies?.filter(policy => policy.status === 'active') || [];
  const recentPolicies = activePolicies.slice(0, 6);

  if (isLoading) {
    return (
      <Card className="h-96">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Quy định & Chính sách
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-60">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-lg border-0 bg-gradient-to-br from-slate-50 to-white">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <span className="text-lg font-semibold">Quy định & Chính sách</span>
                <p className="text-sm text-muted-foreground font-normal">
                  {activePolicies.length} quy định đang hiệu lực
                </p>
              </div>
            </CardTitle>
            <Button variant="ghost" size="sm" className="text-primary hover:bg-primary/10">
              Xem tất cả
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <div className="space-y-3">
              {recentPolicies.map((policy) => (
                <div
                  key={policy.id}
                  className="group p-4 rounded-xl border border-border/50 hover:border-primary/20 hover:shadow-md transition-all duration-200 cursor-pointer bg-white/50 hover:bg-white"
                  onClick={() => setSelectedPolicy(policy)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${getCategoryColor(policy.category)}`}>
                      {getCategoryIcon(policy.category)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-sm group-hover:text-primary transition-colors line-clamp-2">
                          {policy.title}
                        </h4>
                        <div className="flex items-center gap-2 ml-2">
                          {getStatusBadge(policy.status)}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(policy.effective_date), 'dd/MM/yyyy', { locale: vi })}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>Cập nhật {format(new Date(policy.updated_at), 'dd/MM', { locale: vi })}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {recentPolicies.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Chưa có quy định nào được phát hành</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Policy Detail Dialog */}
      <Dialog open={!!selectedPolicy} onOpenChange={() => setSelectedPolicy(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${getCategoryColor(selectedPolicy?.category || '')}`}>
                {getCategoryIcon(selectedPolicy?.category || '')}
              </div>
              <div>
                <span>{selectedPolicy?.title}</span>
                <div className="flex items-center gap-2 mt-1">
                  {selectedPolicy && getStatusBadge(selectedPolicy.status)}
                  <Badge variant="outline" className="text-xs">
                    {selectedPolicy?.category}
                  </Badge>
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div>
                <span className="text-sm text-muted-foreground">Ngày hiệu lực</span>
                <p className="font-medium">
                  {selectedPolicy && format(new Date(selectedPolicy.effective_date), 'dd/MM/yyyy', { locale: vi })}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Ngày hết hạn</span>
                <p className="font-medium">
                  {selectedPolicy?.expiry_date 
                    ? format(new Date(selectedPolicy.expiry_date), 'dd/MM/yyyy', { locale: vi })
                    : 'Không giới hạn'
                  }
                </p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Nội dung quy định</h3>
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: selectedPolicy?.content || '' }}
              />
            </div>

            <div className="text-sm text-muted-foreground border-t pt-4">
              <p>Cập nhật lần cuối: {selectedPolicy && format(new Date(selectedPolicy.updated_at), 'dd/MM/yyyy HH:mm', { locale: vi })}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}