import { useEffect, useState } from "react";
import { CheckCircle, Clock, XCircle, Percent, Loader2, LogIn, LogOut, CheckCircle2 } from "lucide-react";
import StatCard from "@/components/StatCard";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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
  const [todayRecord, setTodayRecord] = useState<any>(null);

  // --- DYNAMIC CALENDAR LOGIC ---
  const now = new Date();
  const currentMonth = now.getMonth(); // 0-indexed
  const currentYear = now.getFullYear();
  const monthName = now.toLocaleString('default', { month: 'long' });

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    fetchAttendance();
  }, []);

  async function fetchAttendance() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const todayStr = new Date().toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('user_id', user.id);

      if (error) throw error;

      if (data) {
        setAttendanceRecords(data);
        const todayData = data.find(r => r.date === todayStr);
        setTodayRecord(todayData);

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

  async function handleAttendanceAction() {
    try {
      setActionLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return toast.error("Please log in first");

      const todayStr = new Date().toISOString().split('T')[0];
      const nowIso = new Date().toISOString();

      if (!todayRecord) {
        const { error } = await supabase
          .from('attendance')
          .insert([{ user_id: user.id, status: 'present', date: todayStr, clock_in_time: nowIso }]);
        if (error) throw error;
        toast.success("Clocked in successfully!");
      } else {
        const { error } = await supabase
          .from('attendance')
          .update({ clock_out_time: nowIso })
          .eq('id', todayRecord.id);
        if (error) throw error;
        toast.success("Clocked out successfully!");
      }

      fetchAttendance();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setActionLoading(false);
    }
  }

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Present" value={summary.present} icon={<CheckCircle className="h-5 w-5" />} variant="success" />
        <StatCard title="Half Day" value={summary.halfDay} icon={<Clock className="h-5 w-5" />} variant="warning" />
        <StatCard title="Absent" value={summary.absent} icon={<XCircle className="h-5 w-5" />} variant="destructive" />
        <StatCard title="Rate" value={`${summary.rate}%`} icon={<Percent className="h-5 w-5" />} variant="primary" />
      </div>

      {/* Dynamic Calendar */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-bold text-card-foreground">{monthName} {currentYear}</h3>
        <div className="grid grid-cols-7 gap-1">
          {dayNames.map((d) => (
            <div key={d} className="py-2 text-center text-xs font-bold text-muted-foreground/60">{d}</div>
          ))}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const paddedDay = day.toString().padStart(2, '0');
            const paddedMonth = (currentMonth + 1).toString().padStart(2, '0');
            const targetDateString = `${currentYear}-${paddedMonth}-${paddedDay}`;
            
            const record = attendanceRecords.find(r => r.date === targetDateString);
            const status = record?.status;
            const isToday = new Date().toISOString().split('T')[0] === targetDateString;

            return (
              <div
                key={day}
                className={cn(
                  "flex flex-col items-center justify-center rounded-lg p-2 text-xs transition-all h-14 border",
                  status ? statusColors[status] : "bg-muted/5 text-muted-foreground/40 border-dashed border-border",
                  isToday && !status && "border-primary/50 bg-primary/5 ring-1 ring-primary/20"
                )}
              >
                <span className={cn("font-bold", isToday && "text-primary")}>{day}</span>
                {status && <span className="text-[10px] mt-1 font-black opacity-80">{statusLabels[status]}</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Card */}
      <div className="rounded-2xl border border-border bg-card p-6 flex items-center justify-between border-l-4 border-l-primary shadow-md">
        <div>
          <h3 className="mb-1 text-lg font-bold text-card-foreground">Daily Check-in</h3>
          <p className="text-sm text-muted-foreground">
            {!todayRecord ? "Shift hasn't started yet." : 
             !todayRecord.clock_out_time ? "Shift is currently active." : 
             "You have finished for today!"}
          </p>
        </div>

        {todayRecord?.clock_out_time ? (
          <div className="flex items-center gap-2 text-success bg-success/10 px-8 py-3 rounded-xl font-black">
            <CheckCircle2 className="h-5 w-5" /> COMPLETED
          </div>
        ) : (
          <button 
            onClick={handleAttendanceAction}
            disabled={actionLoading}
            className={cn(
              "flex items-center gap-3 text-white px-8 py-3 rounded-xl font-black transition-all transform active:scale-95 disabled:opacity-50 shadow-lg",
              !todayRecord ? "bg-primary shadow-primary/20" : "bg-destructive shadow-destructive/20"
            )}
          >
            {actionLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 
             !todayRecord ? <LogIn className="h-5 w-5" /> : <LogOut className="h-5 w-5" />}
            {!todayRecord ? "CLOCK IN" : "CLOCK OUT"}
          </button>
        )}
      </div>
    </div>
  );
}