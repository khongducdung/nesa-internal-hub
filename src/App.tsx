
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/hooks/useAuth';
import Dashboard from '@/pages/Dashboard';
import Settings from '@/pages/Settings';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Processes from '@/pages/Processes';
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
              <Route path="/processes" element={
                <ProtectedRoute>
                  <Processes />
                </ProtectedRoute>
              } />
              <Route path="/process-management" element={
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
