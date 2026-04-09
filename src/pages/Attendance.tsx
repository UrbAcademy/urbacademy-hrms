import { useState, useEffect } from "react";
import { 
  CheckCircle, Clock, XCircle, Percent, Loader2, 
  LogIn, LogOut, CheckCircle2, MapPin, ShieldCheck, 
  Calendar as CalendarIcon 
} from "lucide-react";
import StatCard from "@/components/StatCard";
import { supabase } from "@/lib/supabaseClient";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// Leaflet Map Imports
import { MapContainer, TileLayer, Circle, Marker } from "react-leaflet";
import L from 'leaflet';
import "leaflet/dist/leaflet.css";

// --- MAP MARKER ICON FIX ---
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- CONFIGURATION ---
const OFFICE_LOCATION: [number, number] = [28.6139, 77.2090]; 
const RADIUS_METERS = 100;

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

  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [isLocationVerified, setIsLocationVerified] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  const currentMonth = currentTime.getMonth();
  const currentYear = currentTime.getFullYear();
  const monthName = currentTime.toLocaleString('default', { month: 'long' });
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  useEffect(() => {
    fetchAttendance();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371e3; 
    const p1 = lat1 * Math.PI/180;
    const p2 = lat2 * Math.PI/180;
    const dp = (lat2-lat1) * Math.PI/180;
    const dl = (lon2-lon1) * Math.PI/180;
    const a = Math.sin(dp/2) * Math.sin(dp/2) + Math.cos(p1) * Math.cos(p2) * Math.sin(dl/2) * Math.sin(dl/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c; 
  };

  const handleVerifyLocation = () => {
    if (!navigator.geolocation) return toast.error("Browser does not support geolocation");
    setActionLoading(true);
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setUserPos([latitude, longitude]);
      const distance = calculateDistance(latitude, longitude, OFFICE_LOCATION[0], OFFICE_LOCATION[1]);
      if (distance <= RADIUS_METERS) {
        setIsLocationVerified(true);
        toast.success("Location Verified! You are in the office.");
      } else {
        setIsLocationVerified(false);
        toast.error(`Too far! You are ${Math.round(distance)}m away from office.`);
      }
      setActionLoading(false);
    }, () => {
      toast.error("Location access denied.");
      setActionLoading(false);
    });
  };

  async function fetchAttendance() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const todayStr = new Date().toISOString().split('T')[0];
      const { data, error } = await supabase.from('attendance').select('*').eq('user_id', user.id);
      if (error) throw error;
      if (data) {
        setAttendanceRecords(data);
        const todayData = data.find(r => r.date === todayStr);
        setTodayRecord(todayData);
        if (todayData) setIsLocationVerified(true);
        const p = data.filter(r => r.status === 'present').length;
        const hd = data.filter(r => r.status === 'halfday').length;
        const a = data.filter(r => r.status === 'absent').length;
        const total = p + hd + a;
        setSummary({ present: p, halfDay: hd, absent: a, rate: total > 0 ? Math.round((p / total) * 100) : 0 });
      }
    } catch (error) { console.error("Error loading attendance:", error); } finally { setLoading(false); }
  }

  async function handleAttendanceAction() {
    if (!isLocationVerified) return toast.error("Please verify location first!");
    try {
      setActionLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const todayStr = new Date().toISOString().split('T')[0];
      const nowIso = new Date().toISOString();
      if (!todayRecord) {
        const { error } = await supabase.from('attendance').insert([{ user_id: user.id, status: 'present', date: todayStr, clock_in_time: nowIso }]);
        if (error) throw error;
        toast.success("Clocked in successfully!");
      } else {
        const { error } = await supabase.from('attendance').update({ clock_out_time: nowIso }).eq('id', todayRecord.id);
        if (error) throw error;
        toast.success("Clocked out successfully!");
      }
      fetchAttendance();
    } catch (error: any) { toast.error(error.message); } finally { setActionLoading(false); }
  }

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Present" value={summary.present} icon={<CheckCircle className="h-5 w-5" />} variant="success" />
        <StatCard title="Half Day" value={summary.halfDay} icon={<Clock className="h-5 w-5" />} variant="warning" />
        <StatCard title="Absent" value={summary.absent} icon={<XCircle className="h-5 w-5" />} variant="destructive" />
        <StatCard title="Rate" value={`${summary.rate}%`} icon={<Percent className="h-5 w-5" />} variant="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-[#181b21] border border-white/5 p-6 rounded-3xl flex flex-col justify-between shadow-2xl">
          <div>
            <h3 className="text-xl font-bold text-white">Today's Action</h3>
            <p className="text-gray-400 text-sm mt-1">Mark your attendance after location check.</p>
          </div>
          <div className="space-y-4 my-8">
            <button onClick={handleVerifyLocation} disabled={isLocationVerified && !!todayRecord} className={cn("w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg", isLocationVerified ? "bg-success/20 text-success border border-success/30" : "bg-blue-600 text-white hover:bg-blue-500")}>
              {isLocationVerified ? <ShieldCheck size={20} /> : <MapPin size={20} />}
              {isLocationVerified ? "LOCATION VERIFIED" : "VERIFY LOCATION"}
            </button>
            {(!todayRecord || !todayRecord.clock_out_time) && (
              <button onClick={handleAttendanceAction} disabled={!isLocationVerified || actionLoading} className={cn("w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 transition-all shadow-lg", !isLocationVerified ? "bg-gray-800 text-gray-500 cursor-not-allowed" : !todayRecord ? "bg-primary text-white" : "bg-destructive text-white")}>
                {actionLoading ? <Loader2 className="animate-spin h-5 w-5" /> : !todayRecord ? <LogIn size={20} /> : <LogOut size={20} />}
                {!todayRecord ? "CLOCK IN" : "CLOCK OUT"}
              </button>
            )}
            {todayRecord?.clock_out_time && (
               <div className="bg-success/10 text-success p-4 rounded-2xl flex items-center justify-center gap-2 font-black border border-success/20">
                 <CheckCircle2 size={20} /> SHIFT COMPLETED
               </div>
            )}
          </div>
          <div className="text-center p-4 bg-black/20 rounded-2xl border border-white/5">
             <p className="text-2xl font-black text-white">{currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
             <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Urb Academy Policy Active</p>
          </div>
        </div>

        {/* ✅ FIXED: Added 'style' prop and removed whitespace for Leaflet v4 compatibility */}
        <div className="bg-[#181b21] border border-white/5 rounded-3xl overflow-hidden min-h-[400px] shadow-2xl relative">
          <MapContainer center={OFFICE_LOCATION} zoom={15} className="z-0" style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Circle 
              center={OFFICE_LOCATION} 
              radius={RADIUS_METERS} 
              pathOptions={{ fillColor: '#3b82f6', color: '#3b82f6', weight: 1, fillOpacity: 0.2 }} 
            />
            {userPos && <Marker position={userPos} />}
          </MapContainer>
          <div className="absolute bottom-4 right-4 z-[10] bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] text-white border border-white/10 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
            100M OFFICE RADIUS
          </div>
        </div>

        <div className="bg-[#181b21] border border-white/5 p-6 rounded-3xl shadow-2xl">
          <h3 className="mb-4 text-lg font-bold text-white">{monthName} {currentYear}</h3>
          <div className="grid grid-cols-7 gap-1">
            {dayNames.map((d) => <div key={d} className="py-2 text-center text-[10px] font-bold text-gray-500">{d}</div>)}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
              const record = attendanceRecords.find(r => r.date === dateStr);
              const isToday = new Date().toISOString().split('T')[0] === dateStr;
              return (
                <div key={day} className={cn("flex flex-col items-center justify-center rounded-xl h-12 text-xs transition-all border", record ? statusColors[record.status] : "bg-white/[0.02] text-gray-600 border-white/5", isToday && !record && "border-blue-500/50 bg-blue-500/10")}>
                  <span className="font-bold">{day}</span>
                  {record && <span className="text-[8px] font-black">{statusLabels[record.status]}</span>}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-[#181b21] border border-white/5 rounded-3xl p-6 shadow-xl">
         <div className="flex items-center gap-3 text-white">
            <CalendarIcon className="text-gray-500" size={20} />
            <h3 className="font-semibold">Recent Activity</h3>
         </div>
         <p className="text-gray-500 text-sm mt-4 italic">No recent clock-in activity found outside today.</p>
      </div>
    </div>
  );
}