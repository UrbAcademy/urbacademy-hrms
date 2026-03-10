import { useState, useEffect } from "react";
import { Play, Square, Clock, Calendar } from "lucide-react";

const ClockInWidget = () => {
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // 1. Load saved state on startup
  useEffect(() => {
    const savedStatus = localStorage.getItem("attendanceStatus");
    const savedTime = localStorage.getItem("attendanceStartTime");
    
    if (savedStatus === "in" && savedTime) {
      setIsClockedIn(true);
      setStartTime(parseInt(savedTime));
      // Calculate elapsed time immediately so it doesn't jump
      setElapsedTime(Math.floor((Date.now() - parseInt(savedTime)) / 1000));
    }
  }, []);

  // 2. The Timer Logic (Ticks every second)
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isClockedIn && startTime) {
      interval = setInterval(() => {
        const now = Date.now();
        const seconds = Math.floor((now - startTime) / 1000);
        setElapsedTime(seconds);
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isClockedIn, startTime]);

  // 3. Handle Button Clicks
  const handleClockIn = () => {
    const now = Date.now();
    setIsClockedIn(true);
    setStartTime(now);
    localStorage.setItem("attendanceStatus", "in");
    localStorage.setItem("attendanceStartTime", now.toString());
  };

  const handleClockOut = () => {
    if (confirm("Are you sure you want to clock out for today?")) {
      setIsClockedIn(false);
      setStartTime(null);
      setElapsedTime(0);
      localStorage.removeItem("attendanceStatus");
      localStorage.removeItem("attendanceStartTime");
      alert("Clocked Out Successfully! Total hours saved.");
    }
  };

  // Helper to format seconds into HH:MM:SS
  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
  };

  // Get current date string
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' });

  return (
    <div className="bg-[#181b21] border border-white/5 p-6 rounded-2xl mb-6 shadow-lg relative overflow-hidden group">
      {/* Background Glow Effect */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-[80px] transition-all duration-700 ${isClockedIn ? "bg-green-500/10" : "bg-blue-500/10"}`} />

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div>
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Today's Attendance</p>
          <div className="flex items-center gap-2 text-white font-bold text-lg">
            <Calendar className="h-4 w-4 text-blue-500" />
            {today}
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold border ${isClockedIn ? "bg-green-500/10 border-green-500/20 text-green-500" : "bg-gray-500/10 border-gray-500/20 text-gray-400"}`}>
          {isClockedIn ? "• ON DUTY" : "• AWAYS"}
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-center py-4 relative z-10">
        <div className="text-4xl font-mono font-bold text-white tracking-widest tabular-nums">
          {isClockedIn ? formatTime(elapsedTime) : "00h 00m 00s"}
        </div>
        <p className="text-gray-500 text-xs mt-2">Total Working Hours</p>
      </div>

      {/* Actions */}
      <div className="mt-6 relative z-10">
        {!isClockedIn ? (
          <button 
            onClick={handleClockIn}
            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/20"
          >
            <Play className="h-4 w-4 fill-current" /> Clock In
          </button>
        ) : (
          <button 
            onClick={handleClockOut}
            className="w-full bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/50 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
          >
            <Square className="h-4 w-4 fill-current" /> Clock Out
          </button>
        )}
      </div>
    </div>
  );
};

export default ClockInWidget;