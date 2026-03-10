import { useState } from "react";
import { Search, Mail, MessageCircle, Phone, Briefcase, MapPin, Circle } from "lucide-react";

// Mock Team Data
const teamMembers = [
  { id: 1, name: "Rahul Sharma", role: "Sales Intern", dept: "Sales", status: "Online", location: "Mumbai", phone: "9876543210", email: "rahul@urbacademy.com", initials: "RS", color: "bg-blue-600" },
  { id: 2, name: "Priya Patel", role: "Sales Manager", dept: "Sales", status: "Busy", location: "Bangalore", phone: "9876500000", email: "priya@urbacademy.com", initials: "PP", color: "bg-purple-600" },
  { id: 3, name: "Arjun Singh", role: "Tech Lead", dept: "Tech", status: "Offline", location: "Delhi", phone: "9123456789", email: "arjun@urbacademy.com", initials: "AS", color: "bg-green-600" },
  { id: 4, name: "Sneha Gupta", role: "HR Executive", dept: "HR", status: "Online", location: "Pune", phone: "9988776655", email: "sneha@urbacademy.com", initials: "SG", color: "bg-pink-600" },
  { id: 5, name: "Vikram Rao", role: "Sales Intern", dept: "Sales", status: "Online", location: "Chennai", phone: "8877665544", email: "vikram@urbacademy.com", initials: "VR", color: "bg-yellow-600" },
  { id: 6, name: "Ananya Joshi", role: "Content Writer", dept: "Marketing", status: "Away", location: "Remote", phone: "7766554433", email: "ananya@urbacademy.com", initials: "AJ", color: "bg-indigo-600" },
];

const Teams = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("All");

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

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* 1. Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Team Directory</h2>
          <p className="text-gray-400 mt-1">Connect with your colleagues across departments.</p>
        </div>

        <div className="flex gap-2 bg-[#181b21] p-1 rounded-xl border border-white/10">
          {["All", "Sales", "Tech", "HR"].map((dept) => (
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

      {/* 2. Search Bar */}
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

      {/* 3. Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTeam.map((member) => (
          <div key={member.id} className="group bg-[#181b21] border border-white/5 p-6 rounded-2xl hover:border-blue-500/30 transition-all hover:-translate-y-1 relative overflow-hidden">
            
            {/* Top Pattern */}
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
                <Briefcase className="h-4 w-4" /> {member.dept} Department
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin className="h-4 w-4" /> {member.location}
              </div>
            </div>

            {/* Action Buttons */}
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

      {filteredTeam.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No team members found matching "{searchTerm}"</p>
        </div>
      )}

    </div>
  );
};

export default Teams;