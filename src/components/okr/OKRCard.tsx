
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, User, Target, Link, ArrowDown, ArrowUp } from 'lucide-react';
import { OKRObjective } from '@/hooks/useOKRSimple';

interface OKRCardProps {
  okr: OKRObjective;
  onEdit?: (okr: OKRObjective) => void;
}

export function OKRCard({ okr, onEdit }: OKRCardProps) {
  console.log('OKRCard rendering with OKR:', okr);
  
  const getOwnerIcon = () => {
    switch (okr.owner_type) {
      case 'company':
        return <Building2 className="h-4 w-4" />;
      case 'department':
        return <Users className="h-4 w-4" />;
      case 'individual':
        return <User className="h-4 w-4" />;
    }
  };

  const getOwnerLabel = () => {
    switch (okr.owner_type) {
      case 'company':
        return 'Công ty';
      case 'department':
        return 'Phòng ban';
      case 'individual':
        return 'Cá nhân';
    }
  };

  const getStatusColor = () => {
    switch (okr.status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'active':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = () => {
    switch (okr.status) {
      case 'draft':
        return 'Nháp';
      case 'active':
        return 'Đang thực hiện';
      case 'completed':
        return 'Hoàn thành';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  const getProgressColor = () => {
    if (okr.progress >= 80) return 'bg-green-500';
    if (okr.progress >= 60) return 'bg-blue-500';
    if (okr.progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-blue-500" onClick={() => onEdit?.(okr)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getOwnerIcon()}
            <Badge variant="outline" className="text-xs">
              {getOwnerLabel()}
            </Badge>
          </div>
          <Badge className={`text-xs ${getStatusColor()}`}>
            {getStatusLabel()}
          </Badge>
        </div>
        <CardTitle className="text-lg font-semibold line-clamp-2 leading-tight">{okr.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-2">{okr.description}</p>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1 font-medium">
              <Target className="h-4 w-4 text-blue-600" />
              Tiến độ
            </span>
            <span className="font-bold text-lg">{okr.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full transition-all duration-300 ${getProgressColor()}`}
              style={{ width: `${okr.progress}%` }}
            />
          </div>
        </div>

        {/* Hierarchical Relationships - ALWAYS SHOW if exists */}
        {(okr.parent_okr || (okr.child_okrs_count && okr.child_okrs_count > 0)) && (
          <div className="space-y-2 border-t pt-3">
            <div className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
              <Link className="h-3 w-3 text-blue-600" />
              Liên kết OKR
            </div>
            
            {okr.parent_okr && (
              <div className="flex items-start gap-2 text-xs text-blue-700 bg-blue-50 px-3 py-2 rounded-md border border-blue-200">
                <ArrowUp className="h-3 w-3 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <div className="font-medium">Liên kết từ cấp trên:</div>
                  <div className="line-clamp-1">{okr.parent_okr.title}</div>
                </div>
              </div>
            )}
            
            {okr.child_okrs_count && okr.child_okrs_count > 0 && (
              <div className="flex items-center gap-2 text-xs text-green-700 bg-green-50 px-3 py-2 rounded-md border border-green-200">
                <ArrowDown className="h-3 w-3" />
                <span className="font-medium">{okr.child_okrs_count} OKR cấp dưới đang thực hiện</span>
              </div>
            )}
          </div>
        )}

        {okr.key_results && okr.key_results.length > 0 && (
          <div className="space-y-2 border-t pt-3">
            <h4 className="text-sm font-semibold flex items-center gap-1">
              <Target className="h-4 w-4 text-purple-600" />
              Key Results ({okr.key_results.length})
            </h4>
            {okr.key_results.slice(0, 2).map((kr) => (
              <div key={kr.id} className="flex items-center justify-between text-xs bg-gray-50 px-2 py-1 rounded">
                <span className="line-clamp-1 flex-1">{kr.title}</span>
                <div className="flex items-center gap-1 ml-2">
                  <span className="font-medium">{kr.progress}%</span>
                  <div className={`w-2 h-2 rounded-full ${
                    kr.status === 'completed' ? 'bg-green-500' :
                    kr.status === 'on_track' ? 'bg-blue-500' :
                    kr.status === 'at_risk' ? 'bg-yellow-500' : 'bg-gray-400'
                  }`} />
                </div>
              </div>
            ))}
            {okr.key_results.length > 2 && (
              <p className="text-xs text-gray-500 font-medium">+{okr.key_results.length - 2} KR khác</p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t">
          <span className="font-medium">{okr.year} • {okr.quarter}</span>
          <span>{new Date(okr.created_at).toLocaleDateString('vi-VN')}</span>
        </div>
      </CardContent>
    </Card>
  );
}
