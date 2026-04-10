import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IndianRupee, CreditCard, TrendingUp, Trophy, Calendar, Mail, Phone, BadgeCheck, Edit, CalendarDays, ShoppingCart, Clock, GraduationCap, Briefcase, Crown } from "lucide-react";
import { motivationalQuotes, topPerformers, formatCurrency } from "@/lib/mock-data";
import ClockInWidget from "@/components/ClockInWidget";
import { supabase } from "@/lib/supabaseClient";

const upcomingEvents: any[] = []; 

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null); 

  const today = new Date();
  const quote = motivationalQuotes[today.getDate() % motivationalQuotes.length];
  const daysLeft = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() - today.getDate();

  useEffect(() => {
    const checkSession = async () => {
      const storedUser = sessionStorage.getItem("currentUser");
      
      if (!storedUser) {
        navigate("/hr-login", { replace: true });
        return;
      }

      try {
        const parsedData = JSON.parse(storedUser);
        
        if (!parsedData || !parsedData.id) {
            throw new Error("Invalid session data structure");
        }

        setUser(parsedData); 
        
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', parsedData.id)
          .single();

        if (error) {
            console.error("Dashboard Supabase sync failed:", error.message);
        }

        if (data) {
          const updatedUser = { ...parsedData, ...data };
          setUser(updatedUser);
          sessionStorage.setItem("currentUser", JSON.stringify(updatedUser));
        }

      } catch (e) {
        console.error("Session verification failed:", e);
        sessionStorage.removeItem("currentUser");
        navigate("/hr-login", { replace: true });
      }
    };

    checkSession();
  }, [navigate]);

  if (!user) return null;

  const displayName = user?.full_name || user?.name || "User";
  const userInitials = displayName !== "User" 
    ? displayName.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase()
    : "UA";

  return (
    <div className="space-y-6 pb-10">
      
      {/* Top Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-bold text-card-foreground">
            Good morning, <span className="text-blue-500">{displayName.split(" ")[0]}</span>
          </h2>
          <p className="mt-2 text-2xl font-serif text-muted-foreground italic tracking-wide">
            "{quote}"
          </p>
        </div>
        
        <div className="bg-blue-600 rounded-2xl p-6 text-white text-center shadow-lg shadow-blue-600/20 min-w-[160px]">
          <h3 className="text-5xl font-black">{daysLeft}</h3>
          <p className="text-blue-100 font-medium mt-1 text-sm">days left</p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* ================= LEFT COLUMN (Spans 2) ================= */}
        <div className="xl:col-span-2 space-y-6">
          
          {/* ✅ REVENUE OVERVIEW (Exactly matching Image 2) */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="text-[15px] font-semibold text-card-foreground flex items-center gap-2 mb-6">
              <IndianRupee className="h-[18px] w-[18px] text-muted-foreground" /> Revenue Overview
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Sales */}
              <div className="bg-background border border-border/50 rounded-xl p-4 flex flex-col justify-between h-[100px]">
                <div className="flex justify-between items-start">
                  <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Sales</p>
                  <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-2xl font-black text-white">0 <span className="text-sm font-medium text-muted-foreground tracking-normal">sales</span></p>
              </div>
              
              {/* Booked */}
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex flex-col justify-between h-[100px]">
                <div className="flex justify-between items-start">
                  <p className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Booked</p>
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                </div>
                <p className="text-2xl font-black text-blue-400">₹0</p>
              </div>
              
              {/* Credited */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4 flex flex-col justify-between h-[100px]">
                <div className="flex justify-between items-start">
                  <p className="text-[11px] font-bold text-green-400 uppercase tracking-wider">Credited</p>
                  <CreditCard className="h-4 w-4 text-green-400" />
                </div>
                <p className="text-2xl font-black text-green-400">₹0</p>
              </div>
              
              {/* Pending */}
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex flex-col justify-between h-[100px]">
                <div className="flex justify-between items-start">
                  <p className="text-[11px] font-bold text-yellow-500 uppercase tracking-wider">Pending</p>
                  <Clock className="h-4 w-4 text-yellow-500" />
                </div>
                <p className="text-2xl font-black text-yellow-500">₹0</p>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW: TOP PERFORMERS & EVENTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* ✅ TOP PERFORMERS (Podium View exactly like Image 2) */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col min-h-[240px]">
              <h3 className="text-[15px] font-semibold text-card-foreground flex items-center gap-2 mb-8">
                <Trophy className="h-[18px] w-[18px] text-yellow-500" /> Top Performers
              </h3>
              
              <div className="flex-1 flex items-end justify-center gap-6 pb-2">
                {[topPerformers[1], topPerformers[0], topPerformers[2]].map((p, i) => {
                  const borderColors = ["border-gray-400", "border-yellow-400", "border-orange-600"];
                  const nameColors = ["text-gray-300", "text-yellow-400", "text-orange-400"];
                  const heights = ["h-12 w-12", "h-[70px] w-[70px]", "h-10 w-10"];
                  const badgeColors = ["bg-gray-600", "bg-yellow-500", "bg-orange-700"];
                  const labels = ["2nd", "1st", "3rd"];

                  return (
                    <div key={p.rank} className="flex flex-col items-center relative">
                      {i === 1 && <Crown className="h-6 w-6 text-yellow-400 absolute -top-8 animate-pulse" />}
                      <div className={`relative rounded-full border-[3px] ${borderColors[i]} p-[2px] mb-4 shadow-lg`}>
                        <div className={`${heights[i]} rounded-full bg-accent flex items-center justify-center text-xs font-bold overflow-hidden shadow-inner`}>
                          {p.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className={`absolute -bottom-2.5 left-1/2 -translate-x-1/2 text-[10px] font-black text-white ${badgeColors[i]} px-2 py-0.5 rounded-full z-10 shadow-md`}>
                          {labels[i]}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-white mt-1 truncate max-w-[80px] text-center">{p.name.split(" ")[0]}</p>
                      <p className={`text-[11px] font-black tracking-wide ${nameColors[i]} mt-0.5`}>{formatCurrency(p.booked)}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ✅ UPCOMING EVENTS */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm flex flex-col min-h-[240px]">
              <div className="flex items-center gap-2 mb-6">
                <CalendarDays className="h-[18px] w-[18px] text-blue-500" />
                <h3 className="text-[15px] font-semibold text-card-foreground tracking-wide">Upcoming Events</h3>
              </div>
              
              {upcomingEvents.length === 0 ? (
                <div className="flex-1 flex items-start mt-4">
                  <p className="text-sm text-muted-foreground font-medium">No upcoming special events.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Event mapping logic left intact in case you add data later */}
                </div>
              )}
            </div>
            
          </div>
        </div>

        {/* ================= RIGHT COLUMN (Spans 1) ================= */}
        <div className="space-y-6"> 
          
          <ClockInWidget /> 

          {/* ✅ SLEEK PROFILE CARD (Exactly like Image 2 right side) */}
          <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden relative">
            
            {/* Blue Banner Header */}
            <div className="bg-blue-600 p-5 flex justify-between items-center h-24">
              <div className="flex items-center gap-2 text-white pb-4">
                <GraduationCap className="h-[22px] w-[22px]" />
                <span className="font-bold text-[17px] tracking-wide">UrbAcademy</span>
              </div>
              <BadgeCheck className="text-white/90 h-[22px] w-[22px] pb-4" />
            </div>

            {/* Content Section */}
            <div className="px-6 pt-10 pb-6 relative">
              
              {/* Overlapping Avatar */}
              <div className="absolute -top-10 left-6">
                <div className="h-[76px] w-[76px] rounded-full border-[5px] border-card bg-primary flex items-center justify-center text-2xl font-black text-white shadow-md">
                  {userInitials}
                </div>
              </div>

              {/* Name & Role */}
              <div className="mt-1">
                <h3 className="text-xl font-bold text-card-foreground leading-tight">{displayName}</h3>
                <p className="text-blue-500 text-[13px] font-semibold mt-1.5">{user?.role === 'admin' ? 'Administrator' : 'Business Development Associate'}</p>
                <p className="text-muted-foreground text-[11px] mt-0.5 tracking-wide">{user?.employee_id || "EMP-PENDING"}</p>
              </div>

              {/* Detail List */}
              <div className="mt-8 space-y-4">
                <div className="flex items-center gap-4 text-muted-foreground">
                  <Briefcase className="h-[15px] w-[15px] opacity-70" />
                  <div>
                    <p className="text-[10px] text-muted-foreground/70 mb-0.5">Department</p>
                    <p className="text-xs text-card-foreground font-medium">{user?.department || "Intern"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <Mail className="h-[15px] w-[15px] opacity-70" />
                  <div>
                    <p className="text-[10px] text-muted-foreground/70 mb-0.5">Email</p>
                    <p className="text-xs text-card-foreground font-medium truncate max-w-[200px]">{user?.email || "Not Provided"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <Phone className="h-[15px] w-[15px] opacity-70" />
                  <div>
                    <p className="text-[10px] text-muted-foreground/70 mb-0.5">Phone</p>
                    <p className="text-xs text-card-foreground font-medium">{user?.phone || "Not Provided"}</p>
                  </div>
                </div>
              </div>

              {/* Divider & Footer */}
              <div className="mt-8 pt-5 border-t border-border/50 text-center">
                <p className="text-[11px] text-muted-foreground font-medium">
                  Since {user?.created_at ? new Date(user.created_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "Jan 2026"} • Urb Academy
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}