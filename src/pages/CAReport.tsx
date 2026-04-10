import { useState } from "react";
import { cn } from "@/lib/utils";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter, 
  Circle, 
  CheckSquare, 
  Square, 
  FileText,
  UserPlus,
  X,
  User
} from "lucide-react";
import { toast } from "sonner"; // Assuming you use sonner for notifications

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
  const [showStarred, setShowStarred] = useState(false);
  const [hideHires, setHideHires] = useState(false);
  
  // ✅ NEW: State for Modal and Form
  const [showModal, setShowModal] = useState(false);
  const [newCAName, setNewCAName] = useState("");

  // Month Navigation State
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3)); // April 2026

  const handlePrevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const monthYearString = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Logic for stats
  const todayPresent = calendarData.filter((c) => c.days[17] === "P").length;
  const todayAbsent = calendarData.filter((c) => c.days[17] === "A").length;
  const todayUnmarked = calendarData.filter((c) => c.days[17] === "-").length;

  // ✅ NEW: Form Submit Handler
  const handleAddCA = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCAName) return;
    
    // Simulate adding logic
    console.log("Adding CA:", newCAName);
    toast.success(`${newCAName} added to the system!`);
    setShowModal(false);
    setNewCAName("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 relative">
      
      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">CA Report</h2>
          <p className="text-gray-400 mt-1 text-sm font-medium">Manage attendance and performance of CAs.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-[#181b21] border border-white/10 rounded-xl overflow-hidden shadow-sm">
            <button onClick={handlePrevMonth} className="p-2.5 hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="px-4 py-2 text-sm font-bold text-white min-w-[120px] text-center">
              {monthYearString}
            </div>
            <button onClick={handleNextMonth} className="p-2.5 hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* ✅ UPDATED: Added onClick to open modal */}
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-white hover:bg-gray-200 text-black px-5 py-2.5 rounded-xl text-xs font-bold transition-all shadow-lg active:scale-95"
          >
            <UserPlus className="h-4 w-4" /> Add CA
          </button>
        </div>
      </div>

      {/* 2. Today's Stats Bar */}
      <div className="flex items-center gap-4 py-2">
        <span className="text-sm font-bold text-gray-400">Today:</span>
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 px-3 py-1 rounded-full text-[11px] font-black text-green-500">
            <Circle className="h-2 w-2 fill-current" /> {todayPresent} Present
          </div>
          <div className="flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 px-3 py-1 rounded-full text-[11px] font-black text-red-500">
            <Circle className="h-2 w-2 fill-current" /> {todayAbsent} Absent
          </div>
          <div className="flex items-center gap-1.5 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full text-[11px] font-black text-blue-400">
            <Circle className="h-2 w-2 fill-current" /> 0 Terminated
          </div>
          <div className="flex items-center gap-1.5 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full text-[11px] font-black text-yellow-500">
            <Circle className="h-2 w-2 fill-current" /> {todayUnmarked} Unmarked
          </div>
        </div>
      </div>

      {/* 3. Filters Section */}
      <div className="flex flex-wrap items-center gap-6 py-2">
        <button className="flex items-center gap-2 bg-[#181b21] border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-white hover:bg-white/5 transition-all">
          <Filter className="h-4 w-4 text-gray-500" /> Filter by User 
          <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">1</span>
          <ChevronRight className="h-3 w-3 text-gray-500 rotate-90" />
        </button>

        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer" onClick={() => setHideHires(!hideHires)}>
            {hideHires ? <CheckCircle className="h-4 w-4 text-blue-500" /> : <Square className="h-4 w-4 text-gray-600" />}
            Hide today's hires
          </label>
          <label className="flex items-center gap-2 text-xs font-bold text-white cursor-pointer" onClick={() => setShowStarred(!showStarred)}>
            {showStarred ? <CheckCircle className="h-4 w-4 text-blue-500" /> : <Square className="h-4 w-4 text-gray-600" />}
            Show starred only
          </label>
        </div>
      </div>

      {/* 4. Empty State Area */}
      <div className="flex flex-col items-center justify-center py-32 bg-[#181b21]/30 rounded-3xl border border-dashed border-white/5 space-y-4">
        <div className="h-16 w-16 rounded-2xl bg-white/[0.02] flex items-center justify-center text-gray-700 border border-white/5">
          <FileText className="h-8 w-8" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-white/50">No CAs found for the selected users</h3>
        </div>
      </div>

      {/* ✅ NEW: Add CA Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#181b21] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden relative">
            {/* Close Button */}
            <button 
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="p-6 border-b border-white/5">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-500" /> Add New Campus Ambassador
              </h3>
            </div>

            <form onSubmit={handleAddCA} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                  <input 
                    autoFocus
                    required
                    type="text" 
                    placeholder="Enter CA's name..." 
                    className="w-full bg-black/20 border border-white/10 text-white pl-10 pr-4 py-3 rounded-xl text-sm focus:border-blue-500 outline-none transition-all" 
                    value={newCAName}
                    onChange={(e) => setNewCAName(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Initial Status</label>
                <select className="w-full bg-black/20 border border-white/10 text-white px-4 py-3 rounded-xl text-sm appearance-none outline-none focus:border-blue-500">
                  <option>Present</option>
                  <option>Unmarked</option>
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl text-sm transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-white hover:bg-gray-200 text-black font-bold py-3 rounded-xl text-sm transition-all active:scale-95 shadow-lg"
                >
                  Add CA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

function CheckCircle({ className }: { className?: string }) {
  return (
    <div className={cn("bg-blue-500 rounded flex items-center justify-center", className)}>
      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </div>
  );
}