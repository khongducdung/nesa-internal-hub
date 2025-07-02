
import { useAuth } from '@/hooks/useAuth';
import { 
  useOKRCycles, 
  useCurrentOKRCycle, 
  useCompanyOKRs, 
  useDepartmentOKRs, 
  useMyOKRs,
  useCreateOKR,
  useUpdateOKR,
  useDeleteOKR,
  useUpdateKeyResult,
  type OKRObjective,
  type KeyResult,
  type OKRCycle
} from '@/hooks/useOKR';

export interface OKRAlignment {
  parent_id: string;
  child_id: string;
  alignment_percentage: number;
  notes?: string;
}

export { type OKRObjective, type KeyResult, type OKRCycle };

export function useOKRData() {
  const { profile } = useAuth();
  
  // Use real database hooks
  const { data: cycles = [], isLoading: cyclesLoading } = useOKRCycles();
  const { data: currentCycle, isLoading: currentCycleLoading } = useCurrentOKRCycle();
  const { data: companyOKRs = [], isLoading: companyLoading } = useCompanyOKRs();
  const { data: departmentOKRs = [], isLoading: departmentLoading } = useDepartmentOKRs();
  const { data: myOKRs = [], isLoading: myOKRsLoading } = useMyOKRs();
  
  // Mutation hooks
  const createOKRMutation = useCreateOKR();
  const updateOKRMutation = useUpdateOKR();
  const deleteOKRMutation = useDeleteOKR();
  const updateKeyResultMutation = useUpdateKeyResult();
  
  const loading = cyclesLoading || currentCycleLoading || companyLoading || departmentLoading || myOKRsLoading;

  const getAllOKRs = () => [...companyOKRs, ...departmentOKRs, ...myOKRs];

  const refreshAlignments = () => {
    // This would need to be implemented with real data
    console.log('Alignments refreshed');
  };

  const createOKR = async (okrData: Partial<OKRObjective>) => {
    console.log('Creating OKR with data:', okrData);
    
    // Prepare the data for database insertion
    const insertData = {
      title: okrData.title || '',
      description: okrData.description || '',
      cycle_id: currentCycle?.id || '',
      year: currentCycle?.year || 2024,
      quarter: currentCycle?.quarter || 'Q1',
      progress: 0,
      status: okrData.status || 'draft',
      owner_id: okrData.owner_id || profile?.employee_id || '',
      owner_type: okrData.owner_type || 'individual',
      department_id: okrData.owner_type === 'department' ? (okrData.department_id || profile?.department_id) : undefined,
      employee_id: okrData.owner_type === 'individual' ? profile?.employee_id : undefined,
      parent_okr_id: okrData.parent_okr_id,
      created_by: profile?.id || '',
      start_date: currentCycle?.start_date || new Date().toISOString().split('T')[0],
      end_date: currentCycle?.end_date || new Date().toISOString().split('T')[0],
    };

    try {
      const result = await createOKRMutation.mutateAsync(insertData);
      return result;
    } catch (error) {
      console.error('Error creating OKR:', error);
      throw error;
    }
  };

  const updateOKR = async (id: string, updates: Partial<OKRObjective>) => {
    console.log('Updating OKR:', id, 'with:', updates);
    
    try {
      const result = await updateOKRMutation.mutateAsync({ id, ...updates });
      return result;
    } catch (error) {
      console.error('Error updating OKR:', error);
      throw error;
    }
  };

  const deleteOKR = async (id: string) => {
    try {
      await deleteOKRMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting OKR:', error);
      throw error;
    }
  };

  const updateKeyResult = async (okrId: string, keyResultId: string, updates: Partial<KeyResult>) => {
    try {
      await updateKeyResultMutation.mutateAsync({ id: keyResultId, ...updates });
    } catch (error) {
      console.error('Error updating key result:', error);
      throw error;
    }
  };

  const getOKRById = (id: string): OKRObjective | undefined => {
    return getAllOKRs().find(okr => okr.id === id);
  };

  const getAlignedOKRs = (parentId: string): OKRObjective[] => {
    return getAllOKRs().filter(okr => okr.parent_okr_id === parentId);
  };

  const getParentOKR = (okr: OKRObjective): OKRObjective | undefined => {
    if (!okr.parent_okr_id) return undefined;
    return getOKRById(okr.parent_okr_id);
  };

  const getDepartmentOKRs = (departmentId?: string): OKRObjective[] => {
    const deptId = departmentId || profile?.department_id;
    if (!deptId) return [];
    return departmentOKRs.filter(okr => okr.department_id === deptId);
  };

  const getCompanyOKRs = (): OKRObjective[] => {
    return companyOKRs;
  };

  const getMyOKRs = (): OKRObjective[] => {
    return myOKRs;
  };

  return {
    companyOKRs,
    myOKRs,
    departmentOKRs,
    cycles,
    currentCycle,
    loading,
    createOKR,
    updateOKR,
    deleteOKR,
    updateKeyResult,
    getOKRById,
    getAlignedOKRs,
    getParentOKR,
    getAllOKRs,
    getDepartmentOKRs,
    getCompanyOKRs,
    getMyOKRs,
    refreshAlignments
  };
}
