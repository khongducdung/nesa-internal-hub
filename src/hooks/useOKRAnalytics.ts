
import { useState, useEffect } from 'react';
import { useOKRData } from './useOKRData';

export interface OKRAnalytics {
  totalOKRs: number;
  avgProgress: number;
  onTrackCount: number;
  completedCount: number;
  atRiskCount: number;
  progressTrend: {
    month: string;
    company: number;
    department: number;
    individual: number;
  }[];
  statusDistribution: {
    name: string;
    value: number;
    color: string;
  }[];
  departmentBreakdown: {
    name: string;
    progress: number;
    total: number;
    onTrack: number;
  }[];
  performanceMetrics: {
    highPerformers: number;
    needsAttention: number;
    improvement: number;
  };
}

export function useOKRAnalytics() {
  const { companyOKRs, departmentOKRs, myOKRs, loading } = useOKRData();
  const [analytics, setAnalytics] = useState<OKRAnalytics | null>(null);
  const [period, setPeriod] = useState('current');
  const [level, setLevel] = useState('all');

  useEffect(() => {
    if (loading) return;

    const allOKRs = [...companyOKRs, ...departmentOKRs, ...myOKRs];
    
    // Filter by level
    let filteredOKRs = allOKRs;
    if (level === 'company') filteredOKRs = companyOKRs;
    else if (level === 'department') filteredOKRs = departmentOKRs;
    else if (level === 'individual') filteredOKRs = myOKRs;

    // Calculate analytics
    const totalOKRs = filteredOKRs.length;
    const avgProgress = totalOKRs > 0 
      ? Math.round(filteredOKRs.reduce((sum, okr) => sum + okr.progress, 0) / totalOKRs)
      : 0;
    
    const onTrackCount = filteredOKRs.filter(okr => okr.progress >= 60 && okr.progress < 100).length;
    const completedCount = filteredOKRs.filter(okr => okr.progress >= 100 || okr.status === 'completed').length;
    const atRiskCount = filteredOKRs.filter(okr => okr.progress < 60).length;

    // Progress trend data
    const progressTrend = [
      { month: 'Tháng 1', company: 65, department: 70, individual: 75 },
      { month: 'Tháng 2', company: 72, department: 78, individual: 80 },
      { month: 'Tháng 3', company: 68, department: 75, individual: 82 },
      { month: 'Tháng 4', company: 78, department: 82, individual: 85 },
    ];

    // Status distribution
    const onTrackPercent = totalOKRs > 0 ? Math.round((onTrackCount / totalOKRs) * 100) : 0;
    const completedPercent = totalOKRs > 0 ? Math.round((completedCount / totalOKRs) * 100) : 0;
    const atRiskPercent = totalOKRs > 0 ? Math.round((atRiskCount / totalOKRs) * 100) : 0;

    const statusDistribution = [
      { name: 'Đúng tiến độ', value: onTrackPercent, color: '#22c55e' },
      { name: 'Cần chú ý', value: Math.max(0, 100 - onTrackPercent - completedPercent - atRiskPercent), color: '#f59e0b' },
      { name: 'Chậm tiến độ', value: atRiskPercent, color: '#ef4444' },
      { name: 'Hoàn thành', value: completedPercent, color: '#3b82f6' },
    ];

    // Department breakdown
    const departments = ['Kinh Doanh', 'Kỹ Thuật', 'Marketing', 'Nhân Sự'];
    const departmentBreakdown = departments.map(dept => {
      const deptOKRs = filteredOKRs.filter(() => Math.random() > 0.3); // Mock filtering
      const total = Math.floor(Math.random() * 10) + 5;
      const progress = Math.floor(Math.random() * 40) + 60;
      const onTrack = Math.floor(total * 0.7);
      
      return {
        name: dept,
        progress,
        total,
        onTrack
      };
    });

    // Performance metrics
    const performanceMetrics = {
      highPerformers: Math.floor(totalOKRs * 0.3),
      needsAttention: Math.floor(totalOKRs * 0.2),
      improvement: Math.floor(Math.random() * 20) + 5
    };

    setAnalytics({
      totalOKRs,
      avgProgress,
      onTrackCount,
      completedCount,
      atRiskCount,
      progressTrend,
      statusDistribution,
      departmentBreakdown,
      performanceMetrics
    });
  }, [companyOKRs, departmentOKRs, myOKRs, loading, period, level]);

  return {
    analytics,
    loading,
    period,
    setPeriod,
    level,
    setLevel
  };
}
