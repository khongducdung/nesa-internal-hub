
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { LoginPage } from "@/components/auth/LoginPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import HRM from "./pages/HRM";
import Performance from "./pages/Performance";
import OKR from "./pages/OKR";
import KPI from "./pages/KPI";
import Settings from "./pages/Settings";
import Processes from "./pages/Processes";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<LoginPage />} />
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
              path="/settings" 
              element={
                <ProtectedRoute requiredRole="super_admin">
                  <Settings />
                </ProtectedRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
