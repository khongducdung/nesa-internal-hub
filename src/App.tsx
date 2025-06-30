import Index from '@/pages/Index';
import LoginPage from '@/pages/LoginPage';
import Dashboard from '@/pages/Dashboard';
import HRM from '@/pages/HRM';
import Processes from '@/pages/Processes';
import Performance from '@/pages/Performance';
import OKR from '@/pages/OKR';
import KPI from '@/pages/KPI';
import Settings from '@/pages/Settings';
import NotFound from '@/pages/NotFound';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, ProtectedRoute } from '@/hooks/useAuth';
import { Toaster } from '@/components/ui/toaster';
import CompanyPolicies from '@/pages/CompanyPolicies';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/hrm"
              element={
                <ProtectedRoute>
                  <HRM />
                </ProtectedRoute>
              }
            />
            <Route
              path="/processes"
              element={
                <ProtectedRoute>
                  <Processes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/performance"
              element={
                <ProtectedRoute>
                  <Performance />
                </ProtectedRoute>
              }
            />
            <Route
              path="/okr"
              element={
                <ProtectedRoute>
                  <OKR />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kpi"
              element={
                <ProtectedRoute>
                  <KPI />
                </ProtectedRoute>
              }
            />
            <Route
              path="/company-policies"
              element={
                <ProtectedRoute>
                  <CompanyPolicies />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
