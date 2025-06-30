
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useCompanyPolicies } from '@/hooks/useCompanyPolicies';

export function CompanyPolicyList() {
  const { data: policies, isLoading } = useCompanyPolicies();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Hiệu lực</Badge>;
      case 'inactive':
        return <Badge className="bg-red-100 text-red-800">Ngưng hiệu lực</Badge>;
      case 'draft':
        return <Badge className="bg-yellow-100 text-yellow-800">Bản nháp</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Không xác định</Badge>;
    }
  };

  const getCategoryBadge = (category: string) => {
    const categoryConfig = {
      hr: { label: 'Nhân sự', className: 'bg-blue-100 text-blue-800' },
      finance: { label: 'Tài chính', className: 'bg-purple-100 text-purple-800' },
      it: { label: 'CNTT', className: 'bg-indigo-100 text-indigo-800' },
      safety: { label: 'An toàn', className: 'bg-orange-100 text-orange-800' },
      general: { label: 'Chung', className: 'bg-gray-100 text-gray-800' },
    };

    const config = categoryConfig[category as keyof typeof categoryConfig];
    if (!config) return <Badge className="bg-gray-100 text-gray-800">N/A</Badge>;

    return <Badge className={config.className}>{config.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {policies?.map((policy) => (
        <div key={policy.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="font-semibold">{policy.title}</h3>
                {getCategoryBadge(policy.category)}
                {getStatusBadge(policy.status)}
              </div>
              <div className="text-sm text-gray-600 space-y-1">
                <p className="line-clamp-2">{policy.content}</p>
                <div className="flex items-center space-x-4">
                  <span>Hiệu lực: {new Date(policy.effective_date).toLocaleDateString('vi-VN')}</span>
                  {policy.expiry_date && (
                    <span>Hết hạn: {new Date(policy.expiry_date).toLocaleDateString('vi-VN')}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
