import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { queryClient } from '@/lib/react-query';

import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import HRM from '@/pages/HRM';
import Attendance from '@/pages/Attendance';
import Processes from '@/pages/Processes';
import Performance from '@/pages/Performance';
import OKR from '@/pages/OKR';
import Settings from '@/pages/Settings';
import Profile from '@/pages/Profile';
import ResetPassword from '@/pages/ResetPassword';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';
import KPI from '@/pages/KPI';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/hrm" element={<HRM />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/processes" element={<Processes />} />
            <Route path="/kpi" element={<KPI />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/okr" element={<OKR />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
          
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
