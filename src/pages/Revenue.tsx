import { useState } from "react";
import { Plus, IndianRupee, CreditCard, TrendingUp, Clock, Search, Filter } from "lucide-react";
import StatCard from "@/components/StatCard";
import { salesData, formatCurrency } from "@/lib/mock-data";

const weeklyTargets = [
  { week: "Feb 17 - Feb 23", target: 20000, achieved: 8500, redeemed: false },
  { week: "Feb 10 - Feb 16", target: 20000, achieved: 15000, redeemed: false },
  { week: "Feb 3 - Feb 9", target: 20000, achieved: 20000, redeemed: true },
];

export default function Revenue() {
  const [tab, setTab] = useState<"paid" | "pending">("paid");

  return (
    <div className="space-y-6">
      {/* Incentive Section */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-card-foreground">Revenue Incentive</h3>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors">
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
            {salesData.filter((s) => tab === "paid" ? s.status === "Paid" : s.status === "Pending").map((s) => (
              <tr key={s.regId} className="border-b border-border/50 hover:bg-accent/20 transition-colors">
                <td className="px-4 py-3 font-medium text-card-foreground">{s.regId}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.date}</td>
                <td className="px-4 py-3 text-card-foreground">{s.bda}</td>
                <td className="px-4 py-3 text-card-foreground">{s.customer}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${s.status === "Paid" ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{s.zoopSign}</td>
                <td className="px-4 py-3 text-success">{formatCurrency(s.paid)}</td>
                <td className="px-4 py-3 text-warning">{formatCurrency(s.pending)}</td>
                <td className="px-4 py-3 font-medium text-card-foreground">{formatCurrency(s.total)}</td>
              </tr>
            ))}
            {salesData.filter((s) => tab === "paid" ? s.status === "Paid" : s.status === "Pending").length === 0 && (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">No records found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
