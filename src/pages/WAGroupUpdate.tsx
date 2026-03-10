import { ExternalLink, Target } from "lucide-react";
import { waGroups } from "@/lib/mock-data";

const weeklyWA = [
  { week: "Feb 17 - Feb 23", target: 500, achieved: 180, status: "Not requested" },
  { week: "Feb 10 - Feb 16", target: 500, achieved: 350, status: "Not requested" },
  { week: "Feb 3 - Feb 9", target: 500, achieved: 500, status: "Redeemed" },
];

export default function WAGroupUpdate() {
  return (
    <div className="space-y-6">
      {/* Weekly targets */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" /> Weekly Target (500 members)
        </h3>
        <div className="space-y-4">
          {weeklyWA.map((w) => {
            const pct = Math.min(100, Math.round((w.achieved / w.target) * 100));
            return (
              <div key={w.week} className="rounded-xl border border-border bg-accent/30 p-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-card-foreground">{w.week}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-card-foreground">{pct}%</span>
                    <button className={`text-xs px-3 py-1 rounded-full font-medium ${w.status === "Redeemed" ? "bg-success/20 text-success" : "bg-muted text-muted-foreground"}`}>
                      {w.status === "Redeemed" ? "Redeemed ₹500" : "Redeem ₹500"}
                    </button>
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-primary to-blue-400" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Groups */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-lg font-semibold text-card-foreground mb-4">My Groups <span className="text-muted-foreground text-sm font-normal">(10)</span></h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-accent/30">
                {["Type", "Group Name", "College", "BDA", "Members", "Potential", "Created", "Link"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {waGroups.map((g, i) => (
                <tr key={i} className="border-b border-border/50 hover:bg-accent/20 transition-colors">
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${g.type === "CGFL" ? "bg-primary/10 text-primary" : "bg-chart-4/10 text-chart-4"}`}>{g.type}</span>
                  </td>
                  <td className="px-4 py-3 font-medium text-card-foreground">{g.name}</td>
                  <td className="px-4 py-3 text-card-foreground">{g.college}</td>
                  <td className="px-4 py-3 text-muted-foreground">{g.bda}</td>
                  <td className="px-4 py-3 text-card-foreground">{g.members}</td>
                  <td className="px-4 py-3 text-muted-foreground">{g.potential}</td>
                  <td className="px-4 py-3 text-muted-foreground">{g.createdAt}</td>
                  <td className="px-4 py-3">
                    <button className="flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20 transition-colors">
                      <ExternalLink className="h-3 w-3" /> Join
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
