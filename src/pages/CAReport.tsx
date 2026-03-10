import { cn } from "@/lib/utils";

const caNames = ["Arun K.", "Meena D.", "Suresh P.", "Pooja V.", "Ravi M.", "Anita S.", "Deepak Y.", "Neha R.", "Vikas J."];
const daysInMonth = 25;

function randomStatus() {
  const r = Math.random();
  if (r < 0.6) return "P";
  if (r < 0.85) return "A";
  return "-";
}

const calendarData = caNames.map((name) => ({
  name,
  starred: Math.random() > 0.5,
  days: Array.from({ length: daysInMonth }, () => randomStatus()),
}));

export default function CAReport() {
  const todayPresent = calendarData.filter((c) => c.days[17] === "P").length;
  const todayAbsent = calendarData.filter((c) => c.days[17] === "A").length;
  const todayUnmarked = calendarData.filter((c) => c.days[17] === "-").length;

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground">February 2026</h2>

      {/* Today's stats */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: "Present", value: todayPresent, color: "bg-success/10 text-success" },
          { label: "Absent", value: todayAbsent, color: "bg-destructive/10 text-destructive" },
          { label: "Terminated", value: 0, color: "bg-muted text-muted-foreground" },
          { label: "Unmarked", value: todayUnmarked, color: "bg-warning/10 text-warning" },
        ].map((s) => (
          <div key={s.label} className={`rounded-full px-3 py-1 text-xs font-medium ${s.color}`}>
            {s.label}: {s.value}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="text-xs">
          <thead>
            <tr className="border-b border-border bg-accent/30">
              <th className="px-3 py-2 text-left font-medium text-muted-foreground">S.No</th>
              <th className="px-3 py-2 text-left font-medium text-muted-foreground min-w-[100px]">CA Name</th>
              <th className="px-3 py-2 text-center font-medium text-muted-foreground">⭐</th>
              {Array.from({ length: daysInMonth }, (_, i) => (
                <th key={i} className="px-2 py-2 text-center font-medium text-muted-foreground">{i + 1}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {calendarData.map((ca, i) => (
              <tr key={i} className="border-b border-border/50 hover:bg-accent/20">
                <td className="px-3 py-2 text-muted-foreground">{i + 1}</td>
                <td className="px-3 py-2 font-medium text-card-foreground">{ca.name}</td>
                <td className="px-3 py-2 text-center cursor-pointer">{ca.starred ? "⭐" : "☆"}</td>
                {ca.days.map((d, j) => (
                  <td key={j} className="px-2 py-2 text-center">
                    <span className={cn(
                      "inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold",
                      d === "P" && "bg-success/20 text-success",
                      d === "A" && "bg-destructive/20 text-destructive",
                      d === "-" && "text-muted-foreground",
                    )}>
                      {d}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
