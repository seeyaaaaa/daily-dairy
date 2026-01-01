import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { OnboardingPage } from "@/pages/OnboardingPage";
import { AuthPage } from "@/pages/AuthPage";
import { SetupProfilePage } from "@/pages/SetupProfilePage";
import { ConsumerDashboard } from "@/pages/consumer/ConsumerDashboard";
import { SubscriptionPage } from "@/pages/consumer/SubscriptionPage";
import { TodayOverridePage } from "@/pages/consumer/TodayOverridePage";
import { OrdersPage } from "@/pages/consumer/OrdersPage";
import { BillsPage } from "@/pages/consumer/BillsPage";
import { AccountPage } from "@/pages/consumer/AccountPage";
import { DeliveryStatusPage } from "@/pages/consumer/DeliveryStatusPage";
import { OwnerDashboard } from "@/pages/owner/OwnerDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, role }: { children: React.ReactNode; role?: 'consumer' | 'owner' }) => {
  const { user, isOnboarded } = useApp();
  
  if (!user) return <Navigate to="/" replace />;
  if (!isOnboarded && user.role === 'consumer') return <Navigate to="/setup-profile" replace />;
  if (role && user.role !== role) return <Navigate to={user.role === 'owner' ? '/owner' : '/consumer'} replace />;
  
  return <>{children}</>;
};

const AppRoutes = () => {
  const { user, isOnboarded } = useApp();

  return (
    <Routes>
      <Route path="/" element={
        user && isOnboarded 
          ? <Navigate to={user.role === 'owner' ? '/owner' : '/consumer'} replace />
          : <OnboardingPage />
      } />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/setup-profile" element={<SetupProfilePage />} />
      
      {/* Consumer Routes */}
      <Route path="/consumer" element={<ProtectedRoute role="consumer"><ConsumerDashboard /></ProtectedRoute>} />
      <Route path="/consumer/subscription" element={<ProtectedRoute role="consumer"><SubscriptionPage /></ProtectedRoute>} />
      <Route path="/consumer/today-override" element={<ProtectedRoute role="consumer"><TodayOverridePage /></ProtectedRoute>} />
      <Route path="/consumer/orders" element={<ProtectedRoute role="consumer"><OrdersPage /></ProtectedRoute>} />
      <Route path="/consumer/bills" element={<ProtectedRoute role="consumer"><BillsPage /></ProtectedRoute>} />
      <Route path="/consumer/account" element={<ProtectedRoute role="consumer"><AccountPage /></ProtectedRoute>} />
      <Route path="/consumer/delivery-status" element={<ProtectedRoute role="consumer"><DeliveryStatusPage /></ProtectedRoute>} />
      
      {/* Owner Routes */}
      <Route path="/owner" element={<ProtectedRoute role="owner"><OwnerDashboard /></ProtectedRoute>} />
      <Route path="/owner/deliveries" element={<ProtectedRoute role="owner"><OwnerDashboard /></ProtectedRoute>} />
      <Route path="/owner/customers" element={<ProtectedRoute role="owner"><OwnerDashboard /></ProtectedRoute>} />
      <Route path="/owner/stats" element={<ProtectedRoute role="owner"><OwnerDashboard /></ProtectedRoute>} />
      
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AppProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </AppProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
