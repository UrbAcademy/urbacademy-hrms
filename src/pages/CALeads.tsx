import { useState } from "react";
import { Search, Filter, MessageSquare } from "lucide-react";
import { caLeads } from "@/lib/mock-data";

export default function CALeads() {
  const [tab, setTab] = useState<"leads" | "form">("leads");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-foreground">My Leads <span className="text-muted-foreground text-base font-normal">(229)</span></h2>
      </div>

      <div className="flex gap-2 border-b border-border">
        {(["leads", "form"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tab === t ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"}`}>
            {t === "leads" ? "My Leads" : "CA Form"}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input placeholder="Search leads..." className="w-full rounded-lg border border-input bg-background pl-10 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none" />
        </div>
        <button className="flex items-center gap-1 rounded-lg border border-border bg-card px-3 py-2 text-sm text-muted-foreground hover:bg-accent transition-colors">
          <Filter className="h-4 w-4" /> All statuses
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-accent/30">
              {["Lead Details", "Uploaded At", "BDA", "Status", "Role", "WhatsApp", "College", "Branch"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {caLeads.map((l, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-accent/20 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-medium text-card-foreground">{l.name}</p>
                  <p className="text-xs text-muted-foreground">{l.email}</p>
                  <p className="text-xs text-muted-foreground">{l.phone}</p>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{l.uploadedAt}</td>
                <td className="px-4 py-3 text-card-foreground">{l.bda}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    l.status === "Fresh" ? "bg-info/10 text-info" :
                    l.status === "Contacted" ? "bg-warning/10 text-warning" :
                    "bg-success/10 text-success"
                  }`}>{l.status}</span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{l.role}</td>
                <td className="px-4 py-3">
                  <button className="rounded-md p-1 text-success hover:bg-success/10 transition-colors">
                    <MessageSquare className="h-4 w-4" />
                  </button>
                </td>
                <td className="px-4 py-3 text-card-foreground">{l.college}</td>
                <td className="px-4 py-3 text-muted-foreground">{l.branch}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-4 py-3 text-xs text-muted-foreground border-t border-border">
          Showing 3 of 229 leads loaded
        </div>
      </div>
    </div>
  );
}
