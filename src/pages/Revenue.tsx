import { useState, useEffect } from "react";
// ✅ FIXED: Added Mail, Phone, and MessageCircle to the imports!
import { Plus, IndianRupee, CreditCard, TrendingUp, Clock, Search, Filter, X, ChevronDown, ChevronUp, CalendarDays, Hash, User, FileText, AlertTriangle, Link, CheckSquare, Square, Mail, Phone, MessageCircle } from "lucide-react";
import StatCard from "@/components/StatCard";
import { formatCurrency } from "@/lib/mock-data";
import { supabase } from "@/lib/supabaseClient"; 

const weeklyTargets = [
  { week: "Feb 17 - Feb 23", target: 20000, achieved: 8500, redeemed: false },
  { week: "Feb 10 - Feb 16", target: 20000, achieved: 15000, redeemed: false },
  { week: "Feb 3 - Feb 9", target: 20000, achieved: 20000, redeemed: true },
];

export default function Revenue() {
  const [tab, setTab] = useState<"paid" | "pending">("paid");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [showFilters, setShowFilters] = useState(false);

  const [isFullPayment, setIsFullPayment] = useState(true);

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
          amount_paid: parseInt(amountPaid) || 0,
          total_amount: parseInt(totalAmount) || 0,
          domain: domain,
          status: (parseInt(amountPaid) >= parseInt(totalAmount)) ? 'Paid' : 'Pending'
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
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground tracking-tight">Revenue & Sales</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-foreground text-background px-4 py-2 text-sm font-bold hover:opacity-90 transition-opacity"
        >
          <Plus className="h-4 w-4" /> Add New Sale
        </button>
      </div>

      {/* Incentive Section */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-card-foreground mb-1">Revenue Incentive</h3>
            <p className="text-sm text-muted-foreground">Achieve your weekly target and you will be eligible for your incentive</p>
          </div>
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center h-10 w-10 rounded-xl border transition-colors ${showFilters ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground hover:bg-accent hover:text-foreground"}`}
          >
            {showFilters ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
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

      {/* Advanced Filters Section */}
      <div className="space-y-4 pt-2">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input 
            type="text"
            placeholder="Search by name, email, phone, or reg ID..." 
            className="w-full rounded-xl border border-border bg-card pl-10 pr-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none transition-all" 
          />
        </div>

        {showFilters && (
          <div className="rounded-xl border border-border bg-card p-5 space-y-5 animate-in fade-in slide-in-from-top-2">
            
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mr-1">
                <Filter className="h-4 w-4" /> Filters:
              </div>
              
              <select className="bg-background border border-border text-foreground text-sm rounded-lg px-3 py-1.5 outline-none focus:border-primary">
                <option>All Teams</option>
              </select>
              <select className="bg-background border border-border text-foreground text-sm rounded-lg px-3 py-1.5 outline-none focus:border-primary">
                <option>All Types</option>
              </select>
              <select className="bg-background border border-border text-foreground text-sm rounded-lg px-3 py-1.5 outline-none focus:border-primary">
                <option>All Domains</option>
              </select>

              <div className="flex items-center gap-1 bg-background border border-border rounded-lg p-1 ml-1">
                <button className="bg-foreground text-background px-3 py-1 text-xs font-bold rounded-md">All Groups</button>
                <button className="text-muted-foreground hover:text-foreground px-3 py-1 text-xs font-bold rounded-md transition-colors">CGFL</button>
                <button className="text-muted-foreground hover:text-foreground px-3 py-1 text-xs font-bold rounded-md transition-colors">SGFL</button>
              </div>

              <button className="ml-auto flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-3 w-3" /> Clear All
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="text-sm font-medium text-muted-foreground mr-1">
                Date Range:
              </div>

              <div className="flex items-center gap-1.5">
                {["Today", "This Week", "This Month", "This Year"].map((d) => (
                  <button key={d} className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-colors ${d === "This Month" ? "bg-foreground text-background border-foreground" : "bg-background border-border text-muted-foreground hover:text-foreground"}`}>
                    {d}
                  </button>
                ))}
              </div>

              <button className="flex items-center gap-2 bg-background border border-border text-foreground px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-accent transition-colors ml-1">
                <CalendarDays className="h-4 w-4 text-muted-foreground" /> Apr 01, 2026 - Apr 30, 2026
              </button>

              <button className="ml-auto flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-3 w-3" /> Clear Date
              </button>
            </div>

          </div>
        )}
      </div>

      {/* Sales table */}
      <div className="overflow-x-auto rounded-xl border border-border bg-card mt-4">
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

      {/* Massive, Beautiful Enterprise Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 sm:p-6">
          <div className="w-full max-w-5xl flex flex-col rounded-2xl border border-white/10 bg-[#121212] shadow-2xl overflow-hidden max-h-[90vh] animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 p-6 bg-[#181b21] shrink-0">
              <div>
                <h3 className="text-xl font-bold text-white">Fill in the details below to record a new sale entry</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>

            {/* Scrollable Form Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#121212]">
              <form id="new-sale-form" onSubmit={handleSaveSale} className="space-y-6">
                
                {/* Section 1: Sale Information */}
                <div className="bg-[#181b21] rounded-2xl border border-white/5 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-500">
                      <Hash className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white leading-none mb-1">Sale Information</h4>
                      <p className="text-xs text-gray-400">Basic details about the sale</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white">REG ID</label>
                      <div className="relative">
                        <input type="text" value="EDV2604-017" readOnly className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-gray-400 outline-none" />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 text-white text-[10px] font-bold px-2 py-1 rounded-md">Auto</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white">Date <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input type="date" required className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none custom-date-input" />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white">BDA</label>
                      <select className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none appearance-none">
                        <option>Ravi Kumar Tiwari</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white">Team</label>
                      <select className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none appearance-none">
                        <option>Fight Club</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-2 border border-white/10 rounded-lg p-4 bg-black/20 w-max pr-8">
                    <CheckSquare className="h-5 w-5 text-white" />
                    <span className="text-sm font-bold text-white">SGFL</span>
                  </div>
                </div>

                {/* Section 2: Customer Details */}
                <div className="bg-[#181b21] rounded-2xl border border-white/5 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded-lg bg-green-500/20 flex items-center justify-center text-green-500">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white leading-none mb-1">Customer Details</h4>
                      <p className="text-xs text-gray-400">Information about the customer</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white flex items-center gap-1"><User className="h-3 w-3"/> Name</label>
                      <input 
                        type="text" 
                        required 
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        placeholder="Customer Name" 
                        className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none" 
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white flex items-center gap-1"><Mail className="h-3 w-3"/> Email</label>
                      <input type="email" placeholder="email@example.com" className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white flex items-center gap-1"><Clock className="h-3 w-3"/> College <span className="text-gray-500 font-normal">(Optional)</span></label>
                      <input type="text" placeholder="College Name (optional)" className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white flex items-center gap-1"><Phone className="h-3 w-3"/> Contact No</label>
                      <input type="tel" placeholder="1234567890" className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white flex items-center gap-1"><Phone className="h-3 w-3"/> WhatsApp No</label>
                      <input type="tel" placeholder="1234567890 (optional)" className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white flex items-center gap-1"><Phone className="h-3 w-3"/> Parents No <span className="text-gray-500 font-normal">(Optional)</span></label>
                      <input type="tel" placeholder="1234567890 (optional)" className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white flex items-center gap-1">Domain <span className="text-gray-500 font-normal">(Optional)</span></label>
                      <select 
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none"
                      >
                        <option value="Technical">Technical</option>
                        <option value="Non-Technical">Non-Technical</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white flex items-center gap-1">Batch <span className="text-gray-500 font-normal">(Optional)</span></label>
                      <select className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none">
                        <option>Select Batch</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Section 3: Payment Details */}
                <div className="bg-[#181b21] rounded-2xl border border-white/5 p-6 relative">
                  <span className="absolute top-6 right-6 bg-white text-black text-xs font-bold px-3 py-1 rounded-full">Full Payment</span>
                  
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded-lg bg-yellow-500/20 flex items-center justify-center text-yellow-500">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white leading-none mb-1">Payment Details</h4>
                      <p className="text-xs text-gray-400">Payment information and status</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white">Total Amount <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input 
                          type="number" 
                          required 
                          value={totalAmount}
                          onChange={(e) => {
                            setTotalAmount(e.target.value);
                            if(isFullPayment) setAmountPaid(e.target.value);
                          }}
                          placeholder="Enter total amount" 
                          className="w-full rounded-lg border border-white/10 bg-black/20 pl-9 pr-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none" 
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-black/20">
                      <div>
                        <p className="text-sm font-bold text-white">Payment Type</p>
                        <p className="text-xs text-gray-400">Customer will pay the {isFullPayment ? "full" : "partial"} amount</p>
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold">
                        <span className={!isFullPayment ? "text-white" : "text-gray-500"}>Partial</span>
                        <button 
                          type="button"
                          onClick={() => {
                            setIsFullPayment(!isFullPayment);
                            if(!isFullPayment) setAmountPaid(totalAmount); 
                          }}
                          className={`w-12 h-6 rounded-full p-1 transition-colors flex ${isFullPayment ? "bg-white justify-end" : "bg-gray-600 justify-start"}`}
                        >
                          <div className={`w-4 h-4 rounded-full shadow-sm ${isFullPayment ? "bg-black" : "bg-white"}`} />
                        </button>
                        <span className={isFullPayment ? "text-white" : "text-gray-500"}>Full</span>
                      </div>
                    </div>

                    {!isFullPayment && (
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-white">Paid Amount (Partial) <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <input 
                            type="number" 
                            required={!isFullPayment}
                            value={amountPaid}
                            onChange={(e) => setAmountPaid(e.target.value)}
                            placeholder="Enter amount customer is paying now" 
                            className="w-full rounded-lg border border-white/10 bg-black/20 pl-9 pr-4 py-2.5 text-sm text-white focus:border-blue-500 outline-none" 
                          />
                        </div>
                      </div>
                    )}

                    <div className="p-6 rounded-xl border border-[#143022] bg-[#0c1a13] flex items-center justify-between">
                      <span className="text-gray-400 text-sm font-medium">Amount to collect</span>
                      <span className="text-3xl font-black text-[#22c55e]">₹{isFullPayment ? totalAmount || "0" : amountPaid || "0"}</span>
                    </div>

                    <div className="p-4 rounded-xl border border-white/10 bg-black/20">
                      <p className="text-sm font-bold text-white mb-2">Notify Customer</p>
                      <div className="flex gap-6">
                        <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                          <CheckSquare className="h-4 w-4" /> <MessageCircle className="h-4 w-4 text-gray-400"/> SMS
                        </label>
                        <label className="flex items-center gap-2 text-sm text-white cursor-pointer">
                          <CheckSquare className="h-4 w-4" /> <Mail className="h-4 w-4 text-gray-400"/> Email
                        </label>
                      </div>
                    </div>

                    <p className="text-xs font-medium text-orange-500 flex items-center gap-1.5">
                      <AlertTriangle className="h-3 w-3" /> Fill in customer name, email and contact to generate payment link
                    </p>

                    <button type="button" className="w-full py-3 rounded-xl bg-gray-400 text-black font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-300 transition-colors">
                      <Link className="h-4 w-4" /> Generate Payment Link
                    </button>
                  </div>
                </div>

                {/* Section 4: Commission & Status */}
                <div className="bg-[#181b21] rounded-2xl border border-white/5 p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="h-8 w-8 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-500">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-white leading-none mb-1">Commission & Status</h4>
                      <p className="text-xs text-gray-400">Commission details and document status</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-white/10 bg-black/20 text-xs text-gray-300 mb-6">
                    <span className="font-bold text-white">Single BDA:</span> Commission A receives 50% of payment amount (₹0)
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white flex items-center gap-2">Commission A <span className="bg-white/10 px-1.5 rounded text-[10px]">50%</span></label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <input type="text" value="0" readOnly className="w-full rounded-lg border border-white/10 bg-black/20 pl-8 pr-4 py-2.5 text-sm text-gray-400 outline-none" />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-[10px] font-bold">Auto</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white flex items-center gap-2">Commission B <span className="bg-white/10 px-1.5 rounded text-[10px]">N/A</span></label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <input type="text" value="0" readOnly className="w-full rounded-lg border border-white/10 bg-black/20 pl-8 pr-4 py-2.5 text-sm text-gray-400 outline-none" />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-[10px] font-bold">Auto</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-white">Total Salary</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₹</span>
                        <input type="text" value="0" readOnly className="w-full rounded-lg border border-white/10 bg-black/20 pl-8 pr-4 py-2.5 text-sm text-gray-400 outline-none" />
                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-white text-[10px] font-bold">Auto</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-6 mb-6">
                    <p className="text-xs font-bold text-gray-400 mb-3">Document Status</p>
                    <div className="flex gap-4">
                      <button type="button" className="flex items-center gap-3 px-4 py-2.5 border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-sm font-bold text-white">
                        <Square className="h-4 w-4 text-gray-500" /> SIGNED
                      </button>
                      <button type="button" className="flex items-center gap-3 px-4 py-2.5 border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-sm font-bold text-white">
                        <Square className="h-4 w-4 text-gray-500" /> ORIENTATION
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-white mb-1.5 block">Remarks</label>
                    <textarea 
                      rows={3} 
                      placeholder="Add any additional notes here..." 
                      className="w-full rounded-xl border border-white/10 bg-black/20 p-4 text-sm text-white focus:border-blue-500 outline-none resize-none" 
                    />
                  </div>
                </div>
              </form>
            </div>

            {/* Modal Footer / Save Button */}
            <div className="border-t border-white/10 p-6 bg-[#181b21] flex justify-end shrink-0">
              <button 
                type="submit" 
                form="new-sale-form"
                className="rounded-xl bg-white text-black px-8 py-3 text-sm font-bold flex items-center gap-2 hover:bg-gray-200 transition-colors"
              >
                <CheckSquare className="h-4 w-4" /> Save Sale
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}