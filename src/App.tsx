import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Revenue from "@/pages/Revenue";
import Leaderboard from "@/pages/Leaderboard";
import Teams from "@/pages/Teams";
import Leaves from "@/pages/Leaves";
import Attendance from "@/pages/Attendance";
import Payroll from "@/pages/Payroll";
import CALeads from "@/pages/CALeads";
import SalesLeads from "@/pages/SalesLeads";
import WAGroupUpdate from "@/pages/WAGroupUpdate";
import CAReport from "@/pages/CAReport";
import DailyReport from "@/pages/DailyReport";
import Rules from "@/pages/Rules";
import ScholarshipSlots from "@/pages/ScholarshipSlots";
import Resources from "@/pages/Resources";
import Tickets from "@/pages/Tickets";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import AddEmployee from './pages/AddEmployee';
import AdminDashboard from "@/pages/AdminDashboard";

const queryClient = new QueryClient();

// These are the pages WITH the Sidebar (Layout)
const AppRoutes = () => (
  <Layout>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} /> 
      <Route path="/revenue" element={<Revenue />} />
      
      {/* The Admin Route */}
      <Route path="/admin" element={<AdminDashboard />} />
      
      <Route path="/add-employee" element={<AddEmployee />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/teams" element={<Teams />} />
      <Route path="/leaves" element={<Leaves />} />
      <Route path="/attendance" element={<Attendance />} />
      <Route path="/payroll" element={<Payroll />} />
      <Route path="/ca-leads" element={<CALeads />} />
      <Route path="/sales-leads" element={<SalesLeads />} />
      <Route path="/wa-groups" element={<WAGroupUpdate />} />
      <Route path="/ca-report" element={<CAReport />} />
      <Route path="/daily-report" element={<DailyReport />} />
      <Route path="/rules" element={<Rules />} />
      <Route path="/scholarship" element={<ScholarshipSlots />} />
      <Route path="/resources" element={<Resources />} />
      <Route path="/tickets" element={<Tickets />} />
      <Route path="/profile" element={<Profile />} />
      
      {/* Catch-all route must be at the bottom */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Layout>
);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* 1. STRICT LOGIN ROUTE: The login page only ever loads if the URL is exactly /hr-login */}
            <Route path="/hr-login" element={<Login />} />
            
            {/* 2. ROOT REDIRECT: If anyone goes to localhost:8080/, instantly send them to the dashboard path */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* 3. APP ROUTES: Everything else goes through the Sidebar Layout */}
            <Route path="/*" element={<AppRoutes />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;