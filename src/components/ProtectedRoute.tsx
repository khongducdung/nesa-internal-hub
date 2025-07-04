
import { useAuth } from '@/hooks/useAuth';
import { Navigate } from 'react-router-dom';
import { SystemRole } from '@/types/database';
import { useEmployees } from '@/hooks/useEmployees';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: SystemRole;
  requireHR?: boolean;
}

export function ProtectedRoute({ children, requiredRole, requireHR }: ProtectedRouteProps) {
  const { user, isLoading, hasRole } = useAuth();
  const { data: employees } = useEmployees();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Check HR access requirement
  if (requireHR) {
    const isAdmin = hasRole('admin') || hasRole('super_admin');
    
    // Find current employee info
    const currentEmployee = employees?.find(emp => emp.auth_user_id === user.id);
    const isHRDepartment = currentEmployee?.departments?.name?.toLowerCase().includes('nhân sự') || 
                          currentEmployee?.departments?.name?.toLowerCase().includes('hr') ||
                          currentEmployee?.positions?.name?.toLowerCase().includes('nhân sự') ||
                          currentEmployee?.positions?.name?.toLowerCase().includes('hr');
    
    if (!isAdmin && !isHRDepartment) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
