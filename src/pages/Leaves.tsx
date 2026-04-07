import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Calendar, FileText, Send, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function Leaves() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [myLeaves, setMyLeaves] = useState<any[]>([]);
  
  // Form State
  const [formData, setFormData] = useState({
    leave_type: "casual",
    start_date: "",
    end_date: "",
    reason: ""
  });

  useEffect(() => {
    fetchMyLeaves();
  }, []);

  async function fetchMyLeaves() {
    try {
      setFetching(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('leaves')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setMyLeaves(data || []);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setFetching(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return toast.error("Please login");

      const { error } = await supabase
        .from('leaves')
        .insert([{
          user_id: user.id,
          leave_type: formData.leave_type,
          start_date: formData.start_date,
          end_date: formData.end_date,
          reason: formData.reason,
          status: 'pending' // Default status
        }]);

      if (error) throw error;

      toast.success("Leave request submitted to Admin!");
      setFormData({ leave_type: "casual", start_date: "", end_date: "", reason: "" });
      fetchMyLeaves();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in duration-500">
      
      {/* LEFT: Request Form */}
      <div className="lg:col-span-1 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Calendar className="text-primary h-5 w-5" /> Request Leave
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Type</label>
              <select 
                value={formData.leave_type}
                onChange={(e) => setFormData({...formData, leave_type: e.target.value})}
                className="w-full mt-1 bg-background border border-border rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="casual">Casual Leave</option>
                <option value="sick">Sick Leave</option>
                <option value="earned">Earned Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">From</label>
                <input 
                  type="date" 
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                  className="w-full mt-1 bg-background border border-border rounded-lg p-2.5"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">To</label>
                <input 
                  type="date" 
                  required
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                  className="w-full mt-1 bg-background border border-border rounded-lg p-2.5"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-muted-foreground">Reason</label>
              <textarea 
                required
                rows={3}
                placeholder="Explain why you need leave..."
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                className="w-full mt-1 bg-background border border-border rounded-lg p-2.5"
              />
            </div>

            <button 
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-all"
            >
              {loading ? <Loader2 className="animate-spin h-5 w-5" /> : <Send className="h-4 w-4" />}
              Submit Request
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT: History Table */}
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm overflow-hidden">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Clock className="text-primary h-5 w-5" /> Leave History
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left">Type</th>
                  <th className="px-4 py-3 text-left">Duration</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {fetching ? (
                  <tr><td colSpan={3} className="text-center py-8 opacity-50">Loading history...</td></tr>
                ) : myLeaves.length === 0 ? (
                  <tr><td colSpan={3} className="text-center py-8 opacity-50">No leave requests found.</td></tr>
                ) : (
                  myLeaves.map((leave) => (
                    <tr key={leave.id} className="hover:bg-muted/20">
                      <td className="px-4 py-4">
                        <div className="font-bold capitalize">{leave.leave_type}</div>
                        <div className="text-xs text-muted-foreground max-w-[200px] truncate">{leave.reason}</div>
                      </td>
                      <td className="px-4 py-4 text-muted-foreground">
                        {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-4 text-center">
                        <span className={cn(
                          "px-3 py-1 rounded-full text-[10px] font-black uppercase",
                          leave.status === 'pending' && "bg-warning/20 text-warning",
                          leave.status === 'approved' && "bg-success/20 text-success",
                          leave.status === 'rejected' && "bg-destructive/20 text-destructive",
                        )}>
                          {leave.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}