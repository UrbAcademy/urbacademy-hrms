import { CheckCircle, Clock, XCircle, Percent } from "lucide-react";
import StatCard from "@/components/StatCard";
import { attendanceSummary, attendanceCalendar } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  present: "bg-success/20 text-success",
  late: "bg-destructive/20 text-destructive",
  halfday: "bg-chart-4/20 text-chart-4",
  absent: "bg-muted text-muted-foreground",
};

const statusLabels: Record<string, string> = {
  present: "P",
  late: "L",
  halfday: "HD",
  absent: "A",
};

export default function Attendance() {
  const days = Array.from({ length: 28 }, (_, i) => i + 1);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const firstDayOfMonth = new Date(2026, 1, 1).getDay();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Present" value={attendanceSummary.present} icon={<CheckCircle className="h-5 w-5" />} variant="success" />
        <StatCard title="Half Day" value={attendanceSummary.halfDay} icon={<Clock className="h-5 w-5" />} variant="warning" />
        <StatCard title="Absent" value={attendanceSummary.absent} icon={<XCircle className="h-5 w-5" />} variant="destructive" />
        <StatCard title="Rate" value={`${attendanceSummary.rate}%`} icon={<Percent className="h-5 w-5" />} variant="primary" />
      </div>

      {/* Calendar */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-4 text-lg font-semibold text-card-foreground">February 2026</h3>
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((d) => (
            <div key={d} className="py-2 text-center text-xs font-medium text-muted-foreground">{d}</div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {days.map((day) => {
            const status = attendanceCalendar[day];
            return (
              <div
                key={day}
                className={cn(
                  "flex flex-col items-center justify-center rounded-lg p-2 text-xs transition-colors",
                  status ? statusColors[status] : "text-muted-foreground"
                )}
              >
                <span className="font-medium">{day}</span>
                {status && <span className="text-[10px] mt-0.5">{statusLabels[status]}</span>}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap gap-4 text-xs">
          {Object.entries(statusLabels).map(([key, label]) => (
            <div key={key} className="flex items-center gap-1.5">
              <div className={cn("h-3 w-3 rounded", statusColors[key])} />
              <span className="text-muted-foreground capitalize">{key} ({label})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Today's Action */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="mb-3 text-lg font-semibold text-card-foreground">Today's Action</h3>
        <div className="flex items-center gap-3 rounded-xl bg-success/5 border border-success/20 p-4">
          <CheckCircle className="h-8 w-8 text-success" />
          <div>
            <p className="font-medium text-card-foreground">Checked In</p>
            <p className="text-sm text-muted-foreground">09:15 AM • Office Location</p>
          </div>
        </div>
      </div>
    </div>
  );
}
