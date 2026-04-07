import { useState, useEffect } from "react";
import { Users, IndianRupee, FileText, Activity, Check, X, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";

// Utility for cleaner class management
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({ revenue: 0, sales: 0, pendingLeaves: 0, employees: 0 });
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [pendingLeaves, setPendingLeaves] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  async function fetchAdminData() {
    setIsLoading(true);
    try {
      // 1. Fetch ALL Sales (Updated to match your SQL columns)
      const { data: sales, error: salesError } = await supabase
        .from('sales')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (salesError) console.error("Sales Fetch Error:", salesError);

      // 2. Fetch Pending Leaves with Profile Join
      const { data: leaves, error: leaveError } = await supabase
        .from('leaves')
        .select(`
          *,
          profiles (
            full_name
          )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (leaveError) {
        console.error("Supabase Join Error:", leaveError);
        // Fallback: fetch without join if the relation fails
        const { data: fallback } = await supabase.from('leaves').select('*').eq('status', 'pending');
        if (fallback) setPendingLeaves(fallback);
      } else {
        setPendingLeaves(leaves || []);
      }

      // 3. Fetch Count of Active Employees
      const { count: employeeCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // ✅ FIXED: Calculate revenue using 'amount' instead of 'total_amount'
      const totalRev = sales ? sales.reduce((sum, s) => sum + (Number(s.amount) || 0), 0) : 0;
      
      setStats({
        revenue: totalRev,
        sales: sales?.length || 0,
        pendingLeaves: leaves?.length || 0,
        employees: employeeCount || 0
      });

      if (sales) setRecentSales(sales.slice(0, 5));

    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // --- APPROVAL ACTION ---
  async function handleLeaveAction(id: string, newStatus: 'approved' | 'rejected') {
    try {
      const { error } = await supabase
        .from('leaves')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;
      
      toast.success(`Request marked as ${newStatus}`);
      fetchAdminData(); // Refresh everything instantly
    } catch (error: any) {
      toast.error(error.message);
    }
  }

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <div>
        <h1 className="text-3xl font-black text-white tracking-tight">Admin Command Center</h1>
        <p className="text-muted-foreground mt-1">Real-time oversight and employee management.</p>
      </div>

      {/* Real-Time Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-6">
          <div className="flex items-center justify-between text-blue-400">
            <p className="text-xs font-bold uppercase tracking-wider">Total Revenue</p>
            <IndianRupee className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-3xl font-black text-white">
            {isLoading ? "..." : formatMoney(stats.revenue)}
          </h3>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between text-muted-foreground">
            <p className="text-xs font-bold uppercase tracking-wider">Sales Closed</p>
            <Activity className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-3xl font-black text-white">
            {isLoading ? "..." : stats.sales}
          </h3>
        </div>

        <div className={cn(
          "rounded-xl border p-6 transition-all",
          stats.pendingLeaves > 0 ? "border-orange-500/50 bg-orange-500/10 animate-pulse" : "border-border bg-card"
        )}>
          <div className="flex items-center justify-between text-orange-400">
            <p className="text-xs font-bold uppercase tracking-wider">Pending Leaves</p>
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-3xl font-black text-white">{stats.pendingLeaves}</h3>
        </div>

        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between text-muted-foreground">
            <p className="text-xs font-bold uppercase tracking-wider">Total Staff</p>
            <Users className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-3xl font-black text-white">{stats.employees}</h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ACTION: Approval Inbox */}
        <div className="rounded-xl border border-border bg-card overflow-hidden shadow-xl">
          <div className="border-b border-border p-6 bg-muted/20">
            <h3 className="font-bold text-lg text-white">Approval Inbox</h3>
            <p className="text-sm text-muted-foreground">Approve or reject employee leave requests.</p>
          </div>
          <div className="p-0">
            {pendingLeaves.length === 0 ? (
              <div className="p-10 text-center text-muted-foreground">No pending requests.</div>
            ) : (
              <div className="divide-y divide-border">
                {pendingLeaves.map((leave) => {
                  // ✅ FIXED: Support for standard Supabase join structure
                  const profile = Array.isArray(leave.profiles) ? leave.profiles[0] : leave.profiles;
                  const employeeName = profile?.full_name || "New Employee";

                  return (
                    <div key={leave.id} className="p-6 flex items-center justify-between hover:bg-muted/10">
                      <div>
                        <p className="font-black text-white uppercase text-sm">
                          {employeeName}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          <span className="font-bold text-primary capitalize">{leave.leave_type}</span>: {leave.reason}
                        </p>
                        <p className="text-[10px] text-muted-foreground/60 mt-2">
                          {leave.start_date} → {leave.end_date}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleLeaveAction(leave.id, 'approved')}
                          className="p-2 bg-success/20 text-success rounded-lg hover:bg-success hover:text-white transition-all"
                        >
                          <Check className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleLeaveAction(leave.id, 'rejected')}
                          className="p-2 bg-destructive/20 text-destructive rounded-lg hover:bg-destructive hover:text-white transition-all"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* FEED: Recent Activity */}
        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <div className="border-b border-border p-6 bg-muted/20">
            <h3 className="font-bold text-lg text-white">Recent Sales</h3>
            <p className="text-sm text-muted-foreground">The 5 most recent closures across all teams.</p>
          </div>
          <table className="w-full text-sm">
            <tbody className="divide-y divide-border">
              {recentSales.map((sale) => (
                <tr key={sale.id} className="hover:bg-muted/10 transition-colors">
                  <td className="px-6 py-4 font-bold text-white">{sale.customer_name}</td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">
                    {new Date(sale.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right font-black text-success">
                    {formatMoney(sale.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentSales.length === 0 && (
            <div className="p-10 text-center text-muted-foreground">No sales recorded yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}