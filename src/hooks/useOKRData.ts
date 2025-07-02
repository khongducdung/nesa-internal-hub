
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
  useCreateKeyResult,
  type OKRObjective,
  type KeyResult,
  type OKRCycle
} from '@/hooks/useOKR';
import { supabase } from '@/integrations/supabase/client';

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
  const createKeyResultMutation = useCreateKeyResult();
  
  const loading = cyclesLoading || currentCycleLoading || companyLoading || departmentLoading || myOKRsLoading;

  const getAllOKRs = () => [...companyOKRs, ...departmentOKRs, ...myOKRs];

  const refreshAlignments = () => {
    // This would need to be implemented with real data
    console.log('Alignments refreshed');
  };

  const createOKR = async (okrData: Partial<OKRObjective> & { key_results?: any[] }) => {
    console.log('Creating OKR with data:', okrData);
    
    // Extract key results from okrData
    const { key_results, ...okrCreateData } = okrData;
    
    // Prepare the data for database insertion
    const insertData = {
      title: okrCreateData.title || '',
      description: okrCreateData.description || '',
      cycle_id: okrCreateData.cycle_id || currentCycle?.id || '',
      year: currentCycle?.year || 2024,
      quarter: currentCycle?.quarter || 'Q1',
      progress: 0,
      status: okrCreateData.status || 'draft',
      owner_id: okrCreateData.owner_type === 'company' 
        ? 'company'
        : okrCreateData.owner_type === 'department'
        ? (okrCreateData.department_id || profile?.department_id)
        : (okrCreateData.employee_id || profile?.employee_id),
      owner_type: okrCreateData.owner_type || 'individual',
      department_id: okrCreateData.owner_type === 'department' ? (okrCreateData.department_id || profile?.department_id) : null,
      employee_id: okrCreateData.owner_type === 'individual' ? (okrCreateData.employee_id || profile?.employee_id) : null,
      parent_okr_id: okrCreateData.parent_okr_id || null,
      created_by: profile?.id || '',
      start_date: currentCycle?.start_date || new Date().toISOString().split('T')[0],
      end_date: currentCycle?.end_date || new Date().toISOString().split('T')[0],
    };

    try {
      // Create the OKR first
      const okrResult = await createOKRMutation.mutateAsync(insertData);
      
      // Then create the key results if any
      if (key_results && key_results.length > 0) {
        for (const kr of key_results) {
          const krData = {
            okr_id: okrResult.id,
            title: kr.title,
            description: kr.description || '',
            target_value: kr.target_value,
            current_value: 0,
            unit: kr.unit,
            weight: kr.weight || 100,
            progress: 0,
            status: 'not_started' as const,
            due_date: kr.due_date || undefined,
            linked_okr_id: kr.linked_okr_id || undefined,
            linked_department_id: kr.linked_department_id || undefined,
          };
          
          await createKeyResultMutation.mutateAsync(krData);
        }
      }
      
      return okrResult;
    } catch (error) {
      console.error('Error creating OKR:', error);
      throw error;
    }
  };

  const updateOKR = async (id: string, updates: Partial<OKRObjective> & { key_results?: any[] }) => {
    console.log('Updating OKR:', id, 'with:', updates);
    
    // Extract key results from updates
    const { key_results, ...okrUpdates } = updates;
    
    try {
      // Update the OKR
      const result = await updateOKRMutation.mutateAsync({ id, ...okrUpdates });
      
      // Handle key results updates if provided
      if (key_results) {
        // For simplicity, we'll delete existing key results and recreate them
        // In a production app, you might want more sophisticated update logic
        
        // Delete existing key results
        const { error: deleteError } = await supabase
          .from('okr_key_results')
          .delete()
          .eq('okr_id', id);
          
        if (deleteError) throw deleteError;
        
        // Create new key results
        for (const kr of key_results) {
          const krData = {
            okr_id: id,
            title: kr.title,
            description: kr.description || '',
            target_value: kr.target_value,
            current_value: kr.current_value || 0,
            unit: kr.unit,
            weight: kr.weight || 100,
            progress: kr.progress || 0,
            status: kr.status || 'not_started' as const,
            due_date: kr.due_date || undefined,
            linked_okr_id: kr.linked_okr_id || undefined,
            linked_department_id: kr.linked_department_id || undefined,
          };
          
          await createKeyResultMutation.mutateAsync(krData);
        }
      }
      
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
