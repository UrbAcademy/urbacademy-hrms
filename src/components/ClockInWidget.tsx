import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Clock, Play, Square, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function ClockInWidget() {
  const [status, setStatus] = useState<'loading' | 'clocked-out' | 'clocked-in' | 'completed'>('loading');
  const [clockInTime, setClockInTime] = useState<string | null>(null);
  const [recordId, setRecordId] = useState<string | null>(null);

  useEffect(() => {
    checkStatus();
  }, []);

  const checkStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return setStatus('clocked-out');

    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase
      .from('attendance')
      .select('*')
      .eq('user_id', user.id)
      .eq('date', today)
      .maybeSingle();

    if (data) {
      setRecordId(data.id);
      if (data.clock_out_time) {
        setStatus('completed');
      } else {
        setStatus('clocked-in');
        setClockInTime(new Date(data.clock_in_time).toLocaleTimeString());
      }
    } else {
      setStatus('clocked-out');
    }
  };

  const handleClockIn = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return toast.error("Log in first");

    const now = new Date().toISOString();
    
    // 1. Instant UI Feedback (Optimistic Update)
    setStatus('clocked-in');
    setClockInTime(new Date().toLocaleTimeString());

    // 2. Database Sync
    const { data, error } = await supabase
      .from('attendance')
      .insert([{ user_id: user.id, clock_in_time: now }])
      .select()
      .single();

    if (error) {
      toast.error("DB Error: " + error.message);
      setStatus('clocked-out'); // Rollback if it failed
    } else {
      setRecordId(data.id);
      toast.success("Clocked In!");
    }
  };

  const handleClockOut = async () => {
    if (!recordId) return toast.error("No record ID found");

    const now = new Date().toISOString();
    
    // 1. Instant UI Feedback
    setStatus('completed');

    const { error } = await supabase
      .from('attendance')
      .update({ clock_out_time: now })
      .eq('id', recordId);

    if (error) {
      toast.error("DB Error: " + error.message);
      setStatus('clocked-in'); // Rollback
    } else {
      toast.success("Clocked Out!");
    }
  };

  if (status === 'loading') return <div className="p-6 bg-card border rounded-xl animate-pulse h-24" />;

  return (
    <div className="p-6 bg-card border rounded-xl shadow-sm flex items-center justify-between border-l-4 border-l-primary">
      <div className="flex items-center gap-4">
        <Clock className={`h-6 w-6 ${status === 'clocked-in' ? 'text-green-500' : 'text-primary'}`} />
        <div>
          <h3 className="font-bold">Attendance</h3>
          <p className="text-sm text-muted-foreground uppercase">{status.replace('-', ' ')}</p>
        </div>
      </div>

      <div>
        {status === 'clocked-out' && (
          <button onClick={handleClockIn} className="bg-primary text-white px-6 py-2 rounded-lg font-bold">Start Shift</button>
        )}
        {status === 'clocked-in' && (
          <button onClick={handleClockOut} className="bg-red-500 text-white px-6 py-2 rounded-lg font-bold">End Shift</button>
        )}
        {status === 'completed' && (
          <div className="text-green-500 font-bold flex items-center gap-2"><CheckCircle2 /> Finished</div>
        )}
      </div>
    </div>
  );
}