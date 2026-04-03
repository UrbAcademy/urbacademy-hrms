import { useEffect, useState } from "react";
import { CheckCircle, Clock, XCircle, Percent, Loader2, LogIn } from "lucide-react";
import StatCard from "@/components/StatCard";
import { supabase } from "@/lib/supabaseClient";
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
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [attendanceRecords, setAttendanceRecords] = useState<any[]>([]);
  const [summary, setSummary] = useState({ present: 0, halfDay: 0, absent: 0, rate: 0 });

  // Keeping February 2026 so it perfectly matches your SQL test data
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const daysInMonth = 28;
  const firstDayOfMonth = new Date(2026, 1, 1).getDay();

  useEffect(() => {
    fetchAttendance();
  }, []);

  async function fetchAttendance() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log("No user is currently logged in!");
        return;
      }

      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id);

      // --- THE TRUTH SERUM ---
      // Right-click your website -> Inspect -> Console to see these!
      console.log("1. Logged in User ID:", user.id);
      console.log("2. Supabase Error:", error);
      console.log("3. Supabase Data:", data);
      // ------------------------

      if (error) throw error;

      if (data) {
        setAttendanceRecords(data);
        
        // Calculate Stats Dynamically
        const p = data.filter(r => r.status === 'present').length;
        const hd = data.filter(r => r.status === 'halfday').length;
        const a = data.filter(r => r.status === 'absent').length;
        const total = p + hd + a;
        const rate = total > 0 ? Math.round((p / total) * 100) : 0;

        setSummary({ present: p, halfDay: hd, absent: a, rate });
      }
    } catch (error) {
      console.error("Error loading attendance:", error);
    } finally {
      setLoading(false);
    }
  }

  // NEW FEATURE: Real Check-in Button Logic
  async function handleCheckIn() {
    try {
      setActionLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return alert("Please log in first");

      const today = new Date().toISOString().split('T')[0]; // Gets YYYY-MM-DD
      
      const { error } = await supabase
        .from('attendance')
        .insert([
          { user_id: user.id, status: 'present', date: today }
        ]);

      if (error) throw error;
      
      alert("Success! You are clocked in for today.");
      fetchAttendance(); // Refresh the data to update the UI
    } catch (error: any) {
      console.error("Error checking in:", error);
      alert("Failed to check in: " + error.message);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Present" value={summary.present} icon={<CheckCircle className="h-5 w-5" />} variant="success" />
        <StatCard title="Half Day" value={summary.halfDay} icon={<Clock className="h-5 w-5" />} variant="warning" />
        <StatCard title="Absent" value={summary.absent} icon={<XCircle className="h-5 w-5" />} variant="destructive" />
        <StatCard title="Rate" value={`${summary.rate}%`} icon={<Percent className="h-5 w-5" />} variant="primary" />
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
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            
            // Format day to match database string (e.g., "01", "09", "10")
            const paddedDay = day.toString().padStart(2, '0');
            const targetDateString = `2026-02-${paddedDay}`;
            
            // Find if there is a record for this specific day
            const record = attendanceRecords.find(r => r.date.startsWith(targetDateString));
            const status = record?.status;

            return (
              <div
                key={day}
                className={cn(
                  "flex flex-col items-center justify-center rounded-lg p-2 text-xs transition-colors h-14",
                  status ? statusColors[status] : "bg-muted/5 text-muted-foreground border border-dashed border-border"
                )}
              >
                <span className="font-medium">{day}</span>
                {status && <span className="text-[10px] mt-0.5 font-bold">{statusLabels[status]}</span>}
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

      {/* Today's Action - NOW INTERACTIVE */}
      <div className="rounded-2xl border border-border bg-card p-6 flex items-center justify-between">
        <div>
          <h3 className="mb-1 text-lg font-semibold text-card-foreground">Today's Action</h3>
          <p className="text-sm text-muted-foreground">Mark your attendance for today.</p>
        </div>
        <button 
          onClick={handleCheckIn}
          disabled={actionLoading}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {actionLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <LogIn className="h-5 w-5" />}
          Clock In Now
        </button>
      </div>
    </div>
  );
}