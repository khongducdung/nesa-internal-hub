
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useCompanyPolicies } from '@/hooks/useCompanyPolicies';

export function CompanyPolicyList() {
  const { data: policies, isLoading } = useCompanyPolicies();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="status-active">Đang áp dụng</Badge>;
      case 'draft':
        return <Badge className="status-pending">Bản nháp</Badge>;
      case 'archived':
        return <Badge className="status-inactive">Đã lưu trữ</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case 'hr':
        return <Badge className="badge-blue">Nhân sự</Badge>;
      case 'finance':
        return <Badge className="bg-green-100 text-green-800 border border-green-200">Tài chính</Badge>;
      case 'security':
        return <Badge className="bg-red-100 text-red-800 border border-red-200">Bảo mật</Badge>;
      case 'general':
        return <Badge className="bg-gray-100 text-gray-800 border border-gray-200">Chung</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">N/A</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {policies?.map((policy) => (
        <div key={policy.id} className="card-blue rounded-lg p-4 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-semibold text-blue-900">{policy.title}</h3>
                {getCategoryBadge(policy.category)}
                {getStatusBadge(policy.status)}
              </div>
              <div className="text-sm text-blue-700 space-y-1">
                {policy.description && <p className="line-clamp-2">{policy.description}</p>}
                <div className="flex items-center space-x-4">
                  <span>Phiên bản: {policy.version}</span>
                  <span>Ngày hiệu lực: {new Date(policy.effective_date).toLocaleDateString('vi-VN')}</span>
                </div>
                <p>Cập nhật: {new Date(policy.updated_at).toLocaleDateString('vi-VN')}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
