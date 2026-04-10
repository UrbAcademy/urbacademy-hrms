import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient"; 
// ✅ FIXED: Added 'Calendar' and 'User' to the imports right here!
import { Search, Mail, MessageCircle, Phone, Briefcase, MapPin, Circle, Loader2, ArrowLeft, ShoppingCart, TrendingUp, CreditCard, Clock, Crown, Shield, Calendar, User } from "lucide-react";

const Teams = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedTeamCard, setSelectedTeamCard] = useState<any | null>(null);

  // 1. Fetch real data from Supabase
  useEffect(() => {
    async function fetchTeam() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*');

        if (error) throw error;

        const formattedData = data.map(member => {
          const nameParts = member.full_name ? member.full_name.split(' ') : ['U', 'N'];
          const initials = nameParts.length > 1 
            ? nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase()
            : nameParts[0][0].toUpperCase();

          const colors = ["bg-blue-600", "bg-purple-600", "bg-green-600", "bg-pink-600", "bg-yellow-600", "bg-red-600"];
          const randomColor = colors[(member.full_name?.length || 0) % colors.length];

          return {
            id: member.id,
            name: member.full_name || "Unknown",
            role: member.role === 'bda' ? 'BDA (Employee)' : 'Admin',
            dept: member.department || "Unassigned",
            email: member.email || "",
            status: "Online", 
            location: "Office",
            phone: "0000000000",
            initials: initials,
            color: randomColor
          };
        });

        setTeamMembers(formattedData);
      } catch (error: any) {
        console.error("Error fetching team:", error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTeam();
  }, []);

  const filteredTeam = teamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) || member.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = filterDept === "All" || member.dept === filterDept;
    return matchesSearch && matchesDept;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Online": return "text-green-500";
      case "Busy": return "text-red-500";
      case "Away": return "text-yellow-500";
      default: return "text-gray-500";
    }
  };

  if (selectedTeamCard) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500 pb-10">
        
        {/* Back Button */}
        <button 
          onClick={() => setSelectedTeamCard(null)}
          className="flex items-center gap-2 text-sm font-medium text-white hover:text-gray-300 transition-colors mb-2"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Teams
        </button>

        {/* Top Header Card */}
        <div className="bg-[#1c181a] border border-[#2d2225] p-6 rounded-2xl flex items-start gap-6">
          <div className="h-24 w-24 rounded-2xl overflow-hidden relative shadow-lg shrink-0 border border-white/5">
            <div className="absolute inset-0 bg-blue-600" />
            <div className="absolute top-0 right-0 w-16 h-16 bg-red-600 translate-x-4 -translate-y-4 rotate-45" />
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-teal-600 -translate-x-4 translate-y-4 -rotate-12" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-0 h-0 border-t-[12px] border-t-transparent border-l-[20px] border-l-white border-b-[12px] border-b-transparent ml-2" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold text-white">Dominator</h1>
              <span className="bg-red-500/10 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-500/20">
                50% Performance
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-4">Leading the charge with strategic excellence and market dominance.</p>
            <div className="flex items-center gap-6 text-xs text-gray-500 font-medium">
              <div className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> Created Dec 9, 2025</div>
              <div className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> 9 members</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-[#181b21] border border-white/5 p-5 rounded-2xl">
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              <ShoppingCart className="h-3.5 w-3.5" /> Total Sales
            </div>
            <p className="text-2xl font-black text-red-500">4</p>
            <p className="text-xs text-gray-500 font-medium mt-1">April 2026</p>
          </div>
          <div className="bg-[#181b21] border border-white/5 p-5 rounded-2xl">
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Revenue Booked
            </div>
            <p className="text-2xl font-black text-white">₹23.00K</p>
          </div>
          <div className="bg-[#181b21] border border-white/5 p-5 rounded-2xl">
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Revenue Credited
            </div>
            <p className="text-2xl font-black text-green-500">₹2.00K</p>
          </div>
          <div className="bg-[#181b21] border border-white/5 p-5 rounded-2xl">
            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Revenue Pending
            </div>
            <p className="text-2xl font-black text-yellow-500">₹21.00K</p>
          </div>
        </div>

        {/* Leadership Section */}
        <div className="bg-[#181b21] border border-white/5 p-6 rounded-2xl">
          <h3 className="text-lg font-bold text-white mb-4">Leadership</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="bg-[#2a1a1f] border border-[#3d252c] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                  <Crown className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Team Lead</p>
                  <p className="text-sm font-bold text-white">Sourish Bansal</p>
                </div>
              </div>
              <button className="text-xs font-bold text-white hover:text-gray-300">View</button>
            </div>

            <div className="bg-[#1c181a] border border-[#2d2225] rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center text-red-500/50">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider mb-0.5">Assistant Team Lead</p>
                  <p className="text-sm font-bold text-white">Not assigned</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Team Members List */}
        <div className="bg-[#181b21] border border-white/5 p-6 rounded-2xl">
          <div className="flex items-center gap-3 mb-6">
            <h3 className="text-lg font-bold text-white">Team Members</h3>
            <span className="bg-white/5 text-gray-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/10">
              9 members
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="bg-[#1e1e1e] border border-white/5 rounded-xl p-3 flex items-center justify-between group hover:border-white/20 transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-md bg-black/50 flex items-center justify-center text-gray-400"><User className="h-4 w-4" /></div>
                <div>
                  <p className="text-sm font-bold text-white leading-none mb-1">Sourish Bansal</p>
                  <p className="text-[10px] font-bold text-red-500">Team Lead</p>
                </div>
              </div>
              <Crown className="h-4 w-4 text-red-500/80" />
            </div>

            {[
              "Ijju Pradeep Kumar", "Mahi Dhingra", "Kumar Vishwash Rana", 
              "Koninika Roy", "Shubh Gupta", "Bodanapati Vinay", 
              "Rahul roy", "Shubhendu Goswami"
            ].map((name, i) => (
              <div key={i} className="bg-[#1e1e1e] border border-white/5 rounded-xl p-3 flex items-center gap-3 group hover:border-white/20 transition-colors cursor-pointer">
                <div className="h-8 w-8 rounded-md bg-black/50 flex items-center justify-center text-gray-400"><User className="h-4 w-4" /></div>
                <p className="text-sm font-bold text-white leading-none">{name}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    );
  }

  // --- STANDARD DIRECTORY VIEW ---
  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Team Directory</h2>
          <p className="text-gray-400 mt-1">Connect with your colleagues across departments.</p>
        </div>

        <div className="flex gap-2 bg-[#181b21] p-1 rounded-xl border border-white/10">
          {["All", "Sales", "CA Leads", "Tech", "HR"].map((dept) => (
            <button
              key={dept}
              onClick={() => setFilterDept(dept)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filterDept === dept 
                ? "bg-white/10 text-white shadow-sm" 
                : "text-gray-400 hover:text-white"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-500" />
        <input 
          type="text" 
          placeholder="Search by name or role..." 
          className="w-full bg-[#181b21] border border-white/10 text-white pl-10 pr-4 py-3 rounded-xl focus:border-blue-500 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
        </div>
      ) : (
        /* Team Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeam.map((member) => (
            <div 
              key={member.id} 
              onClick={() => setSelectedTeamCard(member)}
              className="group bg-[#181b21] border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-all hover:-translate-y-1 relative overflow-hidden cursor-pointer"
            >
              
              <div className={`absolute top-0 left-0 w-full h-1 ${member.color}`} />

              <div className="flex justify-between items-start mb-4">
                <div className={`h-16 w-16 rounded-2xl ${member.color} flex items-center justify-center text-2xl font-bold text-white shadow-lg`}>
                  {member.initials}
                </div>
                <div className={`flex items-center gap-1.5 text-xs font-bold border px-2 py-1 rounded-full ${
                  member.status === "Online" ? "border-green-500/20 bg-green-500/10 text-green-500" :
                  member.status === "Busy" ? "border-red-500/20 bg-red-500/10 text-red-500" :
                  "border-gray-500/20 bg-gray-500/10 text-gray-400"
                }`}>
                  <Circle className={`h-2 w-2 fill-current`} /> {member.status}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{member.name}</h3>
                <p className="text-sm text-gray-400 font-medium">{member.role}</p>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Briefcase className="h-4 w-4" /> {member.dept}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MapPin className="h-4 w-4" /> {member.location}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-white/5 flex justify-between gap-2">
                <button 
                  className="flex-1 bg-white/5 hover:bg-white/10 text-gray-300 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  onClick={(e) => { e.stopPropagation(); window.location.href = `mailto:${member.email}`; }}
                >
                  <Mail className="h-4 w-4" /> Email
                </button>
                <button 
                  className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-500 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  onClick={(e) => { e.stopPropagation(); window.open(`https://wa.me/91${member.phone}`, '_blank'); }}
                >
                  <MessageCircle className="h-4 w-4" /> Chat
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

      {!loading && filteredTeam.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No team members found matching "{searchTerm}"</p>
        </div>
      )}

    </div>
  );
};

export default Teams;