import { useState, useEffect } from "react";
import { Plus, IndianRupee, CreditCard, TrendingUp, Clock, Search, Filter, X } from "lucide-react";
import StatCard from "@/components/StatCard";
import { formatCurrency } from "@/lib/mock-data";
import { supabase } from "@/lib/supabaseClient"; // Make sure this path points to your supabase client

const weeklyTargets = [
  { week: "Feb 17 - Feb 23", target: 20000, achieved: 8500, redeemed: false },
  { week: "Feb 10 - Feb 16", target: 20000, achieved: 15000, redeemed: false },
  { week: "Feb 3 - Feb 9", target: 20000, achieved: 20000, redeemed: true },
];

export default function Revenue() {
  const [tab, setTab] = useState<"paid" | "pending">("paid");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Supabase Data States
  const [liveSales, setLiveSales] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Form Input States
  const [customerName, setCustomerName] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [totalAmount, setTotalAmount] = useState("");
  const [domain, setDomain] = useState("Technical");

  // Fetch Live Data from Supabase
  const fetchSales = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching sales:", error.message);
    } else {
      setLiveSales(data || []);
    }
    setIsLoading(false);
  };

  // Run fetch on component load
  useEffect(() => {
    fetchSales();
  }, []);

  // Save New Sale to Supabase
  const handleSaveSale = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data, error } = await supabase
      .from('sales')
      .insert([
        { 
          customer_name: customerName, 
          amount_paid: parseInt(amountPaid), 
          total_amount: parseInt(totalAmount),
          domain: domain,
          status: parseInt(amountPaid) >= parseInt(totalAmount) ? 'Paid' : 'Pending'
        }
      ]);

    if (error) {
      alert("Error saving sale: " + error.message);
      console.error(error);
    } else {
      alert("Sale saved successfully!");
      setIsModalOpen(false);
      
      // Clear the form
      setCustomerName("");
      setAmountPaid("");
      setTotalAmount("");
      setDomain("Technical");
      
      // Refresh the table with the new data
      fetchSales(); 
    }
  };

  return (
    <div className="space-y-6">
      {/* Incentive Section */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">Revenue Incentive</h3>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" /> Add New Sale
          </button>
        </div>
        <div className="space-y-4">
          {weeklyTargets.map((w) => {
            const pct = Math.min(100, Math.round((w.achieved / w.target) * 100));
            return (
              <div key={w.week} className="rounded-xl border border-border bg-accent/30 p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{w.week}</p>
                    <p className="text-xs text-muted-foreground">Target: {formatCurrency(w.target)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-card-foreground">{pct}%</p>
                    {pct >= 100 ? (
                      <button className={`text-xs font-medium px-3 py-1 rounded-full ${w.redeemed ? "bg-success/20 text-success" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
                        {w.redeemed ? "Redeemed ₹500" : "Redeem ₹500"}
                      </button>
                    ) : (
                      <span className="text-xs text-muted-foreground">Not reached</span>
                    )}
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-blue-400 transition-all" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-border pb-0">
        {(["paid", "pending"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            Registration {t === "paid" ? "Paid" : "Pending"}
          </button>
        ))}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Sales" value="3" icon={<TrendingUp className="h-5 w-5" />} variant="primary" />
        <StatCard title="Booked" value="₹60,000" icon={<IndianRupee className="h-5 w-5" />} variant="success" />
        <StatCard title="Credited" value="₹40,000" icon={<CreditCard className="h-5 w-5" />} variant="primary" />
        <StatCard title="Pending" value="₹20,000" icon={<Clock className="h-5 w-5" />} variant="warning" />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {["All Teams", "All Types", "All Domains", "All Groups"].map((f) => (
          <button key={f} className="flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent transition-colors">
            <Filter className="h-3 w-3" /> {f}
          </button>
        ))}
        <div className="relative ml-auto">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3 w-3 text-muted-foreground" />
          <input placeholder="Search..." className="rounded-lg border border-input bg-background pl-8 pr-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
        </div>
      </div>

      {/* Sales table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-accent/30">
              {["REG ID", "Date", "BDA", "Customer", "Status", "ZoopSign", "Paid", "Pending", "Total"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">Loading live data...</td></tr>
            ) : liveSales.filter((s) => tab === "paid" ? s.status === "Paid" : s.status === "Pending").length === 0 ? (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">No records found in database</td></tr>
            ) : (
              liveSales.filter((s) => tab === "paid" ? s.status === "Paid" : s.status === "Pending").map((s) => (
                <tr key={s.id} className="border-b border-border/50 hover:bg-accent/20 transition-colors">
                  <td className="px-4 py-3 font-medium text-card-foreground">#{s.id}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(s.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-card-foreground">You</td>
                  <td className="px-4 py-3 text-card-foreground">{s.customer_name}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.status === "Paid" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">Pending</td>
                  <td className="px-4 py-3 text-success">{formatCurrency(s.amount_paid)}</td>
                  <td className="px-4 py-3 text-warning">{formatCurrency(s.total_amount - s.amount_paid)}</td>
                  <td className="px-4 py-3 font-medium text-card-foreground">{formatCurrency(s.total_amount)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add New Sale Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-card-foreground">Add New Sale</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-accent rounded-full">
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <form className="space-y-4" onSubmit={handleSaveSale}>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Customer Name</label>
                <input 
                  type="text" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Student name" 
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none" 
                  required 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Paid Amount</label>
                  <input 
                    type="number" 
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    placeholder="₹" 
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Total Amount</label>
                  <input 
                    type="number" 
                    value={totalAmount}
                    onChange={(e) => setTotalAmount(e.target.value)}
                    placeholder="₹" 
                    className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none" 
                    required 
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Domain</label>
                <select 
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-2 text-sm focus:border-primary focus:outline-none"
                >
                  <option value="Technical">Technical</option>
                  <option value="Non-Technical">Non-Technical</option>
                </select>
              </div>
              <div className="pt-4 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-lg border border-border py-2 text-sm font-medium hover:bg-accent transition-colors">Cancel</button>
                <button type="submit" className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">Save Sale</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}