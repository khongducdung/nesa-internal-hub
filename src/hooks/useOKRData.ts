
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export interface OKRObjective {
  id: string;
  title: string;
  description: string;
  cycle: string;
  year: number;
  quarter: string;
  progress: number;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  owner_id: string;
  owner_type: 'company' | 'department' | 'individual';
  department_id?: string;
  parent_okr_id?: string;
  key_results: KeyResult[];
  created_at: string;
  updated_at: string;
}

export interface KeyResult {
  id: string;
  title: string;
  target_value: number;
  current_value: number;
  unit: string;
  weight: number;
  progress: number;
  status: 'not_started' | 'on_track' | 'at_risk' | 'completed';
  due_date?: string;
}

export interface OKRCycle {
  id: string;
  name: string;
  year: number;
  quarter: string;
  start_date: string;
  end_date: string;
  status: 'planning' | 'active' | 'review' | 'closed';
  is_current: boolean;
}

export function useOKRData() {
  const { profile } = useAuth();
  const [companyOKRs, setCompanyOKRs] = useState<OKRObjective[]>([]);
  const [myOKRs, setMyOKRs] = useState<OKRObjective[]>([]);
  const [cycles, setCycles] = useState<OKRCycle[]>([]);
  const [currentCycle, setCurrentCycle] = useState<OKRCycle | null>(null);
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration - replace with real API calls
  useEffect(() => {
    const loadMockData = () => {
      // Mock cycles
      const mockCycles: OKRCycle[] = [
        {
          id: '1',
          name: 'Q1 2024',
          year: 2024,
          quarter: 'Q1',
          start_date: '2024-01-01',
          end_date: '2024-03-31',
          status: 'active',
          is_current: true
        },
        {
          id: '2',
          name: 'Q2 2024',
          year: 2024,
          quarter: 'Q2',
          start_date: '2024-04-01',
          end_date: '2024-06-30',
          status: 'planning',
          is_current: false
        }
      ];

      // Mock company OKRs
      const mockCompanyOKRs: OKRObjective[] = [
        {
          id: '1',
          title: 'Tăng trưởng doanh thu 50% trong năm 2024',
          description: 'Đẩy mạnh hoạt động kinh doanh và mở rộng thị trường',
          cycle: 'Q1 2024',
          year: 2024,
          quarter: 'Q1',
          progress: 68,
          status: 'active',
          owner_id: 'company',
          owner_type: 'company',
          key_results: [
            {
              id: '1',
              title: 'Thu hút 1000 khách hàng mới',
              target_value: 1000,
              current_value: 680,
              unit: 'khách hàng',
              weight: 40,
              progress: 68,
              status: 'on_track',
              due_date: '2024-03-31'
            },
            {
              id: '2',
              title: 'Tăng doanh thu 30% so với Q4/2023',
              target_value: 30,
              current_value: 22,
              unit: '%',
              weight: 35,
              progress: 73,
              status: 'on_track',
              due_date: '2024-03-31'
            },
            {
              id: '3',
              title: 'Ra mắt 3 sản phẩm mới',
              target_value: 3,
              current_value: 2,
              unit: 'sản phẩm',
              weight: 25,
              progress: 67,
              status: 'on_track',
              due_date: '2024-03-31'
            }
          ],
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        },
        {
          id: '2',
          title: 'Nâng cao chất lượng dịch vụ khách hàng',
          description: 'Cải thiện trải nghiệm và độ hài lòng của khách hàng',
          cycle: 'Q1 2024',
          year: 2024,
          quarter: 'Q1',
          progress: 82,
          status: 'active',
          owner_id: 'company',
          owner_type: 'company',
          key_results: [
            {
              id: '4',
              title: 'Đạt 95% độ hài lòng khách hàng',
              target_value: 95,
              current_value: 91,
              unit: '%',
              weight: 50,
              progress: 96,
              status: 'on_track',
              due_date: '2024-03-31'
            },
            {
              id: '5',
              title: 'Giảm thời gian phản hồi xuống 2 giờ',
              target_value: 2,
              current_value: 2.2,
              unit: 'giờ',
              weight: 30,
              progress: 90,
              status: 'on_track',
              due_date: '2024-03-31'
            },
            {
              id: '6',
              title: 'Xử lý 100% khiếu nại trong 24h',
              target_value: 100,
              current_value: 85,
              unit: '%',
              weight: 20,
              progress: 85,
              status: 'at_risk',
              due_date: '2024-03-31'
            }
          ],
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        }
      ];

      // Mock user OKRs based on profile
      const mockMyOKRs: OKRObjective[] = [
        {
          id: '3',
          title: 'Tăng hiệu suất bán hàng cá nhân 40%',
          description: 'Cải thiện kỹ năng bán hàng và chăm sóc khách hàng',
          cycle: 'Q1 2024',
          year: 2024,
          quarter: 'Q1',
          progress: 75,
          status: 'active',
          owner_id: profile?.id || 'user',
          owner_type: 'individual',
          department_id: profile?.department_id,
          parent_okr_id: '1', // Links to company OKR
          key_results: [
            {
              id: '7',
              title: 'Đạt doanh số 500 triệu VND',
              target_value: 500000000,
              current_value: 375000000,
              unit: 'VND',
              weight: 60,
              progress: 75,
              status: 'on_track',
              due_date: '2024-03-31'
            },
            {
              id: '8',
              title: 'Chốt 50 deal mới',
              target_value: 50,
              current_value: 35,
              unit: 'deal',
              weight: 40,
              progress: 70,
              status: 'on_track',
              due_date: '2024-03-31'
            }
          ],
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        },
        {
          id: '4',
          title: 'Phát triển kỹ năng chuyên môn',
          description: 'Nâng cao năng lực cá nhân thông qua học tập và thực hành',
          cycle: 'Q1 2024',
          year: 2024,
          quarter: 'Q1',
          progress: 60,
          status: 'active',
          owner_id: profile?.id || 'user',
          owner_type: 'individual',
          department_id: profile?.department_id,
          key_results: [
            {
              id: '9',
              title: 'Hoàn thành 3 khóa học online',
              target_value: 3,
              current_value: 2,
              unit: 'khóa học',
              weight: 50,
              progress: 67,
              status: 'on_track',
              due_date: '2024-03-31'
            },
            {
              id: '10',
              title: 'Đạt chứng chỉ chuyên môn',
              target_value: 1,
              current_value: 0,
              unit: 'chứng chỉ',
              weight: 50,
              progress: 30,
              status: 'at_risk',
              due_date: '2024-03-31'
            }
          ],
          created_at: '2024-01-01T00:00:00Z',
          updated_at: '2024-01-15T00:00:00Z'
        }
      ];

      setCycles(mockCycles);
      setCurrentCycle(mockCycles.find(c => c.is_current) || null);
      setCompanyOKRs(mockCompanyOKRs);
      setMyOKRs(mockMyOKRs);
      setLoading(false);
    };

    loadMockData();
  }, [profile]);

  const createOKR = async (okrData: Partial<OKRObjective>) => {
    // Mock create function - replace with real API call
    const newOKR: OKRObjective = {
      id: Date.now().toString(),
      title: okrData.title || '',
      description: okrData.description || '',
      cycle: currentCycle?.name || 'Q1 2024',
      year: currentCycle?.year || 2024,
      quarter: currentCycle?.quarter || 'Q1',
      progress: 0,
      status: 'draft',
      owner_id: okrData.owner_id || profile?.id || 'user',
      owner_type: okrData.owner_type || 'individual',
      department_id: okrData.department_id,
      parent_okr_id: okrData.parent_okr_id,
      key_results: okrData.key_results || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    if (okrData.owner_type === 'company') {
      setCompanyOKRs(prev => [...prev, newOKR]);
    } else {
      setMyOKRs(prev => [...prev, newOKR]);
    }

    return newOKR;
  };

  const updateOKR = async (id: string, updates: Partial<OKRObjective>) => {
    // Mock update function - replace with real API call
    const updateOKRList = (okrs: OKRObjective[]) =>
      okrs.map(okr => okr.id === id ? { ...okr, ...updates, updated_at: new Date().toISOString() } : okr);

    setCompanyOKRs(updateOKRList);
    setMyOKRs(updateOKRList);
  };

  const updateKeyResult = async (okrId: string, keyResultId: string, updates: Partial<KeyResult>) => {
    // Mock update function - replace with real API call
    const updateOKRs = (okrs: OKRObjective[]) =>
      okrs.map(okr => {
        if (okr.id === okrId) {
          const updatedKeyResults = okr.key_results.map(kr =>
            kr.id === keyResultId ? { ...kr, ...updates } : kr
          );
          const totalProgress = updatedKeyResults.reduce((sum, kr) => sum + (kr.progress * kr.weight / 100), 0);
          return { ...okr, key_results: updatedKeyResults, progress: Math.round(totalProgress), updated_at: new Date().toISOString() };
        }
        return okr;
      });

    setCompanyOKRs(updateOKRs);
    setMyOKRs(updateOKRs);
  };

  return {
    companyOKRs,
    myOKRs,
    cycles,
    currentCycle,
    loading,
    createOKR,
    updateOKR,
    updateKeyResult
  };
}
