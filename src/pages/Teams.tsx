import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient"; // Make sure this path is correct for your project
import { Search, Mail, MessageCircle, Phone, Briefcase, MapPin, Circle, Loader2 } from "lucide-react";

const Teams = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch real data from Supabase
  useEffect(() => {
    async function fetchTeam() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*');

        if (error) throw error;

        // Map database columns to match your UI expectations
        const formattedData = data.map(member => {
          // Generate initials from full_name (e.g., "Raj Sharma" -> "RS", "boss" -> "B")
          const nameParts = member.full_name ? member.full_name.split(' ') : ['U', 'N'];
          const initials = nameParts.length > 1 
            ? nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase()
            : nameParts[0][0].toUpperCase();

          // Assign a random color block based on the length of their name just for UI aesthetics
          const colors = ["bg-blue-600", "bg-purple-600", "bg-green-600", "bg-pink-600", "bg-yellow-600"];
          const randomColor = colors[(member.full_name?.length || 0) % colors.length];

          return {
            id: member.id,
            name: member.full_name || "Unknown",
            role: member.role === 'bda' ? 'BDA (Employee)' : 'Admin',
            dept: member.department || "Unassigned",
            email: member.email || "",
            // Provide fallbacks for data you might not be collecting yet
            status: "Online", // Defaulting to online for now
            location: "Office",
            phone: "0000000000",
            initials: initials,
            color: randomColor
          };
        });

        setTeamMembers(formattedData);
      } catch (error) {
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Online": return "text-green-500";
      case "Busy": return "text-red-500";
      case "Away": return "text-yellow-500";
      default: return "text-gray-500";
    }
  };

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
            <div key={member.id} className="group bg-[#181b21] border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-all hover:-translate-y-1 relative overflow-hidden">
              
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
                  onClick={() => window.location.href = `mailto:${member.email}`}
                >
                  <Mail className="h-4 w-4" /> Email
                </button>
                <button 
                  className="flex-1 bg-green-500/10 hover:bg-green-500/20 text-green-500 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                  onClick={() => window.open(`https://wa.me/91${member.phone}`, '_blank')}
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