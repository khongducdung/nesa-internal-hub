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

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => onEdit?.(okr)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getOwnerIcon()}
            <Badge variant="outline" className={getStatusColor()}>
              {getOwnerLabel()}
            </Badge>
          </div>
          <Badge className={getStatusColor()}>
            {getStatusLabel()}
          </Badge>
        </div>
        <CardTitle className="text-lg">{okr.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-2">{okr.description}</p>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              Tiến độ
            </span>
            <span className="font-medium">{okr.progress}%</span>
          </div>
          <Progress value={okr.progress} className="h-2" />
        </div>

        {/* Hierarchical Relationships */}
        {(okr.parent_okr || (okr.child_okrs_count && okr.child_okrs_count > 0)) && (
          <div className="space-y-2 border-t pt-3">
            {okr.parent_okr && (
              <div className="flex items-center gap-2 text-xs text-blue-600">
                <ArrowUp className="h-3 w-3" />
                <span>Liên kết: {okr.parent_okr.title}</span>
              </div>
            )}
            {okr.child_okrs_count && okr.child_okrs_count > 0 && (
              <div className="flex items-center gap-2 text-xs text-green-600">
                <ArrowDown className="h-3 w-3" />
                <span>{okr.child_okrs_count} OKR con</span>
              </div>
            )}
          </div>
        )}

        {okr.key_results && okr.key_results.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Key Results ({okr.key_results.length})</h4>
            {okr.key_results.slice(0, 2).map((kr) => (
              <div key={kr.id} className="flex items-center justify-between text-xs">
                <span className="line-clamp-1">{kr.title}</span>
                <span className="font-medium">{kr.progress}%</span>
              </div>
            ))}
            {okr.key_results.length > 2 && (
              <p className="text-xs text-gray-500">+{okr.key_results.length - 2} KR khác</p>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{okr.year} • {okr.quarter}</span>
          <span>{new Date(okr.created_at).toLocaleDateString('vi-VN')}</span>
        </div>
      </CardContent>
    </Card>
  );
}