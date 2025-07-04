import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/useAuth';
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';
import Employees from '@/pages/Employees';
import Departments from '@/pages/Departments';
import Positions from '@/pages/Positions';
import ProtectedRoute from '@/components/ProtectedRoute';
import Attendance from '@/pages/Attendance';
import LeaveRequests from '@/pages/LeaveRequests';
import TrainingPrograms from '@/pages/TrainingPrograms';
import PerformanceReviews from '@/pages/PerformanceReviews';
import Contracts from '@/pages/Contracts';
import OKRs from '@/pages/OKRs';
import Processes from '@/pages/Processes';
import CompetencyFrameworks from '@/pages/CompetencyFrameworks';
import Payroll from '@/pages/Payroll';
import Reports from '@/pages/Reports';
import WorkGroups from '@/pages/WorkGroups';
import PerformanceCycles from '@/pages/PerformanceCycles';
import ProcessManagement from '@/pages/ProcessManagement';

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute requiredRole="admin">
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path="/employees" element={
                <ProtectedRoute requireHR={true}>
                  <Employees />
                </ProtectedRoute>
              } />
              <Route path="/departments" element={
                <ProtectedRoute requireHR={true}>
                  <Departments />
                </ProtectedRoute>
              } />
              <Route path="/positions" element={
                <ProtectedRoute requireHR={true}>
                  <Positions />
                </ProtectedRoute>
              } />
              <Route path="/attendance" element={
                <ProtectedRoute requireAttendanceAccess={true}>
                  <Attendance />
                </ProtectedRoute>
              } />
              <Route path="/leave-requests" element={
                <ProtectedRoute requireHR={true}>
                  <LeaveRequests />
                </ProtectedRoute>
              } />
              <Route path="/training-programs" element={
                <ProtectedRoute requireHR={true}>
                  <TrainingPrograms />
                </ProtectedRoute>
              } />
              <Route path="/performance-reviews" element={
                 <ProtectedRoute>
                  <PerformanceReviews />
                </ProtectedRoute>
              } />
              <Route path="/contracts" element={
                <ProtectedRoute requireHR={true}>
                  <Contracts />
                </ProtectedRoute>
              } />
              <Route path="/okrs" element={
                <ProtectedRoute>
                  <OKRs />
                </ProtectedRoute>
              } />
              <Route path="/processes" element={
                <ProtectedRoute>
                  <Processes />
                </ProtectedRoute>
              } />
              <Route path="/competency-frameworks" element={
                <ProtectedRoute requireHR={true}>
                  <CompetencyFrameworks />
                </ProtectedRoute>
              } />
              <Route path="/payroll" element={
                <ProtectedRoute requireHR={true}>
                  <Payroll />
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute requiredRole="admin">
                  <Reports />
                </ProtectedRoute>
              } />
              <Route path="/work-groups" element={
                <ProtectedRoute requireHR={true}>
                  <WorkGroups />
                </ProtectedRoute>
              } />
              <Route path="/performance-cycles" element={
                <ProtectedRoute requireHR={true}>
                  <PerformanceCycles />
                </ProtectedRoute>
              } />
              
              <Route path="/processes" element={
                <ProtectedRoute>
                  <ProcessManagement />
                </ProtectedRoute>
              } />
              
            </Routes>
          </div>
          <Toaster />
        </QueryClientProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
