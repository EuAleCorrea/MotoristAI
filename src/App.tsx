import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

// Import pages
import Revenues from "./pages/Revenues"; // Updated import
import Expenses from "./pages/Expenses";
import Maintenances from "./pages/Maintenances";
import RiskZones from "./pages/RiskZones";
import Summary from "./pages/Summary";
import PerformanceGoals from "./pages/PerformanceGoals";
import DriverIndicators from "./pages/DriverIndicators";
import AlertsNotifications from "./pages/AlertsNotifications";
import FeedbackReceived from "./pages/FeedbackReceived";
import Vehicles from "./pages/Vehicles";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/revenues" element={<Revenues />} /> {/* Updated route */}
              <Route path="/expenses" element={<Expenses />} />
              <Route path="/maintenances" element={<Maintenances />} />
              <Route path="/risk-zones" element={<RiskZones />} />
              <Route path="/summary" element={<Summary />} />
              <Route path="/performance/goals" element={<PerformanceGoals />} />
              <Route path="/performance/indicators" element={<DriverIndicators />} />
              <Route path="/monitoring/alerts" element={<AlertsNotifications />} />
              <Route path="/monitoring/feedback" element={<FeedbackReceived />} />
              <Route path="/account/profile" element={<Profile />} />
              <Route path="/account/vehicles" element={<Vehicles />} />
              <Route path="/account/settings" element={<Settings />} />
            </Route>
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;