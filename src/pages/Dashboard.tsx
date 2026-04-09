import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IndianRupee, CreditCard, TrendingUp, Trophy, Calendar, User, Mail, Phone, BadgeCheck, Edit } from "lucide-react"; // ✅ Added Edit icon
import StatCard from "@/components/StatCard";
import { motivationalQuotes, topPerformers, formatCurrency } from "@/lib/mock-data";
import ClockInWidget from "@/components/ClockInWidget";
import { supabase } from "@/lib/supabaseClient"; // ✅ Added Supabase import

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null); 

  const today = new Date();
  const quote = motivationalQuotes[today.getDate() % motivationalQuotes.length];
  const daysLeft = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate() - today.getDate();

  useEffect(() => {
    // ✅ Made this async to fetch fresh profile data
    const checkSession = async () => {
      const storedUser = sessionStorage.getItem("currentUser");
      
      if (storedUser) {
        try {
          const parsedData = JSON.parse(storedUser);
          setUser(parsedData); // Set immediately for fast UI loading
          
          // ✅ Fetch latest data from Supabase to keep dashboard fresh
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', parsedData.id)
            .single();

          if (data) {
            const updatedUser = { ...parsedData, ...data };
            setUser(updatedUser);
            // Silently update local storage so it stays in sync
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));
          }

        } catch (e) {
          localStorage.removeItem("currentUser");
          navigate("/hr-login", { replace: true });
        }
      } else {
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
    <div className="space-y-6">
      {/* Welcome */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-card-foreground">
              Welcome back, <span className="gradient-text">{displayName}</span>! 👋
            </h2>
            <p className="mt-1 text-sm text-muted-foreground italic">"{quote}"</p>
          </div>
          <div className="flex gap-3">
            <div className="rounded-xl border border-border bg-accent/50 px-4 py-2 text-center">
              <p className="text-xs text-muted-foreground">Today</p>
              <p className="text-sm font-bold text-card-foreground">{today.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
            </div>
            <div className="rounded-xl border border-primary/20 bg-primary/5 px-4 py-2 text-center">
              <p className="text-xs text-muted-foreground">Days Left</p>
              <p className="text-sm font-bold text-primary">{daysLeft}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Revenue cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Booked" value="₹0" icon={<IndianRupee className="h-5 w-5" />} variant="primary" />
        <StatCard title="Credited" value="₹0" icon={<CreditCard className="h-5 w-5" />} variant="success" />
        <StatCard title="Payments" value="0" icon={<TrendingUp className="h-5 w-5" />} variant="warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-6 text-lg font-semibold text-card-foreground flex items-center gap-2">
            <Trophy className="h-5 w-5 text-warning" /> Top Performers
          </h3>
          <div className="flex items-end justify-center gap-4 mb-8">
            {[topPerformers[1], topPerformers[0], topPerformers[2]].map((p, i) => {
              const heights = ["h-24", "h-32", "h-20"];
              const gradients = ["podium-silver", "podium-gold", "podium-bronze"];
              const emojis = ["🥈", "🥇", "🥉"];
              return (
                <div key={p.rank} className="flex flex-col items-center">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-foreground shadow-sm">
                    {p.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <p className="text-xs font-medium text-card-foreground mb-1">{p.name}</p>
                  <p className="text-[10px] text-muted-foreground mb-2">{formatCurrency(p.booked)}</p>
                  <div className={`w-20 ${heights[i]} ${gradients[i]} rounded-t-lg flex items-start justify-center pt-2`}>
                    <span className="text-lg">{emojis[i]}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-muted-foreground">
                  <th className="pb-2 text-left font-medium">Rank</th>
                  <th className="pb-2 text-left font-medium">Name</th>
                  <th className="pb-2 text-right font-medium">Booked</th>
                  <th className="pb-2 text-right font-medium">Credited</th>
                  <th className="pb-2 text-right font-medium">Sales</th>
                </tr>
              </thead>
              <tbody>
                {topPerformers.map((p) => (
                  <tr key={p.rank} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                    <td className="py-2.5 font-medium text-card-foreground">#{p.rank}</td>
                    <td className="py-2.5 text-card-foreground">{p.name}</td>
                    <td className="py-2.5 text-right text-card-foreground">{formatCurrency(p.booked)}</td>
                    <td className="py-2.5 text-right text-success">{formatCurrency(p.credited)}</td>
                    <td className="py-2.5 text-right text-card-foreground">{p.sales}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6"> 
          
          <ClockInWidget /> 

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            {/* ✅ Added navigation wrapper to Header */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-card-foreground flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> My Profile
              </h3>
              <button 
                onClick={() => navigate('/my-profile')}
                className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1 text-xs"
              >
                <Edit className="h-3 w-3" /> Edit
              </button>
            </div>
            
            <div className="flex flex-col items-center mb-6">
              <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold tracking-wider shadow-md">
                {userInitials}
              </div>
              <p className="text-lg font-semibold text-card-foreground">{displayName}</p>
              <span className="mt-1 rounded-full bg-primary/10 border border-primary/20 px-3 py-0.5 text-xs font-bold text-primary uppercase tracking-wider">
                {user?.role || "Employee"}
              </span>
            </div>
            
            <div className="space-y-3 text-sm">
              {[
                { icon: BadgeCheck, label: "Employee ID", value: user?.employee_id || "N/A" },
                { icon: BadgeCheck, label: "Department", value: user?.department || "N/A" },
                { icon: Mail, label: "Email", value: user?.email || "Not Provided" },
                { icon: Phone, label: "Phone", value: user?.phone || "Not Provided" },
                { icon: Calendar, label: "Joined", value: user?.created_at ? new Date(user.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Recently" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 rounded-lg bg-accent/30 p-2.5 hover:bg-accent/50 transition-colors">
                  <item.icon className="mt-0.5 h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                    <p className="text-card-foreground font-medium text-xs truncate max-w-[150px]">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}