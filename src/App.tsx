import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Login from "@/pages/Login";
import HRLogin from "@/pages/HRLogin"; // 👈 1. IMPORT ADDED
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

const queryClient = new QueryClient();

// These are the pages WITH the Sidebar (Layout)
const AppRoutes = () => (
  <Layout>
    <Routes>
      <Route path="/add-employee" element={<AddEmployee />} />
      <Route path="/" element={<Dashboard />} />
      <Route path="/revenue" element={<Revenue />} />
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
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Layout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* 👇 2. ROUTE ADDED HERE (Outside Layout) */}
          <Route path="/hr-login" element={<HRLogin />} />
          <Route path="/login" element={<Login />} />
          
          {/* Main App Routes */}
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;