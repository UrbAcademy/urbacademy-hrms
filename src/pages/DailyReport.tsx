import { useState, useEffect } from "react";
import { Calendar, CheckCircle, Send, FileText, Flame, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient"; // 👈 Import Supabase client

const DailyReport = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // New States for Database
  const [history, setHistory] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  // Form State
  const [formData, setFormData] = useState({
    calls: "",
    leads: "",
    tasks: "",
    learning: "",
    mood: "Productive 🚀" // Default mood
  });

  // 👇 1. Get Logged-in User & Fetch Their History on Load
  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchHistory(parsedUser.employee_id);
    }
  }, []);

  const fetchHistory = async (empId: string) => {
    try {
      const { data, error } = await supabase
        .from('daily_reports')
        .select('*')
        .eq('employee_id', empId) // Only get THIS user's reports
        .order('created_at', { ascending: false })
        .limit(5); // Get last 5 reports

      if (error) throw error;
      if (data) setHistory(data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  // 👇 2. Submit the Report to Supabase
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('daily_reports')
        .insert([
          {
            employee_id: user.employee_id,
            employee_name: user.name,
            calls_made: parseInt(formData.calls) || 0,
            leads_generated: parseInt(formData.leads) || 0,
            tasks: formData.tasks,
            learning: formData.learning,
            mood: formData.mood
          }
        ]);

      if (error) throw error;

      // Success!
      setSubmitted(true);
      fetchHistory(user.employee_id); // Refresh the history list on the right
      
      // Clear form
      setFormData({ calls: "", leads: "", tasks: "", learning: "", mood: "Productive 🚀" });

    } catch (error) {
      console.error("Error submitting report:", error);
      alert("Failed to submit report. Please check console.");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toLocaleDateString("en-IN", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // SUCCESS SCREEN
  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-6 animate-in zoom-in-50 duration-500">
        <div className="h-24 w-24 bg-green-500/10 rounded-full flex items-center justify-center">
          <CheckCircle className="h-12 w-12 text-green-500" />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Report Submitted!</h2>
          <p className="text-gray-400 mt-2">Great work today, {user?.name.split(" ")[0]}. See you tomorrow! 👋</p>
        </div>
        <button 
          onClick={() => setSubmitted(false)}
          className="text-blue-500 hover:text-blue-400 underline"
        >
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* 1. Header & Streak */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Daily Work Report</h2>
          <div className="flex items-center gap-2 text-gray-400 mt-1">
            <Calendar className="h-4 w-4" /> {today}
          </div>
        </div>
        
        {/* Streak Badge */}
        <div className="bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-xl flex items-center gap-3">
          <div className="bg-orange-500/20 p-2 rounded-full">
            <Flame className="h-5 w-5 text-orange-500 fill-orange-500" />
          </div>
          <div>
            <p className="text-xs text-orange-300 uppercase font-bold">Current Streak</p>
            <p className="text-xl font-bold text-white">{history.length > 0 ? history.length : 0} Days 🔥</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. THE FORM */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Metrics Section */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Calls Made</label>
                <input 
                  type="number" 
                  placeholder="0"
                  required
                  min="0"
                  className="w-full bg-[#181b21] border border-white/10 text-white rounded-xl p-4 focus:border-blue-500 outline-none text-lg font-mono transition-colors"
                  value={formData.calls}
                  onChange={(e) => setFormData({...formData, calls: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-400">Leads Generated</label>
                <input 
                  type="number" 
                  placeholder="0"
                  required
                  min="0"
                  className="w-full bg-[#181b21] border border-white/10 text-white rounded-xl p-4 focus:border-blue-500 outline-none text-lg font-mono transition-colors"
                  value={formData.leads}
                  onChange={(e) => setFormData({...formData, leads: e.target.value})}
                />
              </div>
            </div>

            {/* Tasks Textarea */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-400">Key Tasks Completed</label>
              <textarea 
                rows={4}
                placeholder="- Called 20 students&#10;- Updated Sales Sheet&#10;- Attended Training Session"
                required
                className="w-full bg-[#181b21] border border-white/10 text-white rounded-xl p-4 focus:border-blue-500 outline-none leading-relaxed transition-colors"
                value={formData.tasks}
                onChange={(e) => setFormData({...formData, tasks: e.target.value})}
              />
            </div>

            {/* Learning Section (Intern Specific) */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-400">What did you learn today?</label>
              <textarea 
                rows={2}
                placeholder="Learned how to handle objections regarding pricing..."
                className="w-full bg-[#181b21] border border-white/10 text-white rounded-xl p-4 focus:border-blue-500 outline-none transition-colors"
                value={formData.learning}
                onChange={(e) => setFormData({...formData, learning: e.target.value})}
              />
            </div>

            {/* Mood Selector */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-400">How was your day?</label>
              <div className="grid grid-cols-3 gap-3">
                {["Productive 🚀", "Challenging 😓", "Average 😐"].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setFormData({...formData, mood: m})}
                    className={`p-3 rounded-xl text-sm font-medium border transition-all ${
                      formData.mood === m 
                      ? "bg-blue-500/20 border-blue-500 text-blue-400" 
                      : "bg-[#181b21] border-white/10 text-gray-400 hover:bg-white/5"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={loading}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                loading ? "bg-blue-600/50 text-white/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20 hover:scale-[1.02]"
              }`}
            >
              {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Submitting...</> : <><Send className="h-5 w-5" /> Submit Report</>}
            </button>

          </form>
        </div>

        {/* 3. Sidebar: Previous Reports (Now live from Database) */}
        <div className="space-y-6">
          <div className="bg-[#181b21] border border-white/5 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-gray-400" /> Recent History
            </h3>
            
            <div className="space-y-4">
              {history.length === 0 ? (
                <p className="text-sm text-gray-500 italic text-center py-4">No reports submitted yet.</p>
              ) : (
                history.map((report) => (
                  <div key={report.id} className="flex gap-4 items-start pb-4 border-b border-white/5 last:border-0 last:pb-0">
                    <div className="h-10 w-10 bg-blue-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">
                        {new Date(report.created_at).toLocaleDateString("en-IN", { day: '2-digit', month: 'long', year: 'numeric' })}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{report.calls_made} Calls • {report.leads_generated} Leads</p>
                      <span className="inline-block mt-2 text-[10px] border border-white/10 px-2 py-0.5 rounded-full text-gray-300">
                        {report.mood}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-500/20 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-2">💡 Pro Tip</h3>
            <p className="text-sm text-blue-200/80 leading-relaxed">
              Consistently submitting reports unlocks the <strong>"Intern of the Month"</strong> badge and bonus stipend!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default DailyReport;