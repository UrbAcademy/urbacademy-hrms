import { useState, useMemo } from "react";
import { 
  Search, Plus, ChevronDown, Calendar, X, 
  MessageSquare, Ticket, AlertCircle, CheckCircle, Clock,
  UserPlus // ✅ FIXED: Added UserPlus to the imports
} from "lucide-react";
import { toast } from "sonner";

interface SupportTicket {
  id: string;
  title: string;
  user: string;
  status: "Open" | "In Progress" | "Resolved";
  priority: "Low" | "Medium" | "High";
  category: string;
  type: string;
  createdAt: string;
  ownership: "assigned" | "my";
}

const initialTickets: SupportTicket[] = [
  { id: "TIC-1024", title: "Laptop keyboard not working", user: "Ravi Kumar", status: "Open", priority: "High", category: "IT Support", type: "Hardware", createdAt: "10 Apr 2026", ownership: "assigned" },
  { id: "TIC-1025", title: "Salary slip not generated for March", user: "Self", status: "In Progress", priority: "Medium", category: "Payroll", type: "Query", createdAt: "09 Apr 2026", ownership: "my" },
];

const Tickets = () => {
  const [activeTab, setActiveTab] = useState<"assigned" | "my">("assigned");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>(initialTickets);

  // Form State
  const [newTicket, setNewTicket] = useState({ title: "", category: "IT Support", priority: "Medium" });

  // Filter Logic
  const filteredTickets = useMemo(() => {
    return tickets.filter(ticket => {
      const matchesTab = ticket.ownership === activeTab;
      const matchesSearch = ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            ticket.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ticket.id.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    });
  }, [tickets, activeTab, searchTerm]);

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    const ticket: SupportTicket = {
      id: `TIC-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newTicket.title,
      user: "Self",
      status: "Open",
      priority: newTicket.priority as any,
      category: newTicket.category,
      type: "Manual",
      createdAt: "10 Apr 2026",
      ownership: "my"
    };

    setTickets([ticket, ...tickets]);
    setShowCreateModal(false);
    setNewTicket({ title: "", category: "IT Support", priority: "Medium" });
    toast.success("Support ticket raised successfully!");
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Resolved": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "In Progress": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      default: return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* 1. Header & Action Row */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Tickets</h2>
          <p className="text-gray-400 mt-1 text-sm font-medium">Manage and track support tickets</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-white hover:bg-gray-200 text-black px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg active:scale-95"
        >
          <Plus className="h-4 w-4" /> Create Ticket
        </button>
      </div>

      {/* 2. Search and Filter Bar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search by title or user..." 
            className="w-full bg-[#181b21] border border-white/10 text-white pl-10 pr-4 py-2.5 rounded-xl text-sm focus:border-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <button className="flex items-center gap-2 bg-[#181b21] border border-white/10 px-4 py-2.5 rounded-xl text-xs font-bold text-white hover:bg-white/5 transition-all">
          Status <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px]">2</span>
          <ChevronDown className="h-3 w-3 text-gray-500" />
        </button>
        <button className="flex items-center gap-2 bg-[#181b21] border border-white/10 px-4 py-2.5 rounded-xl text-xs font-bold text-white hover:bg-white/5 transition-all">
          Priority <ChevronDown className="h-3 w-3 text-gray-500" />
        </button>
        <button className="flex items-center gap-2 bg-[#181b21] border border-white/10 px-4 py-2.5 rounded-xl text-xs font-bold text-white hover:bg-white/5 transition-all">
          Date Range <Calendar className="h-4 w-4 text-gray-500" />
        </button>
      </div>

      {/* 3. Navigation Tabs */}
      <div className="flex gap-4 p-1.5 bg-[#181b21] w-fit rounded-2xl border border-white/5 shadow-sm">
        <button
          onClick={() => setActiveTab("assigned")}
          className={`flex items-center gap-2.5 px-8 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === "assigned" 
            ? "bg-white/10 text-white shadow-lg ring-1 ring-white/10" 
            : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <Ticket className={`h-4 w-4 ${activeTab === 'assigned' ? 'text-blue-400' : ''}`} />
          Assigned to Me
        </button>
        <button
          onClick={() => setActiveTab("my")}
          className={`flex items-center gap-2.5 px-8 py-2.5 rounded-xl text-xs font-black transition-all ${
            activeTab === "my" 
            ? "bg-white/10 text-white shadow-lg ring-1 ring-white/10" 
            : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <UserPlus className={`h-4 w-4 ${activeTab === 'my' ? 'text-blue-400' : ''}`} />
          My Tickets
        </button>
      </div>

      {/* 4. Content Area */}
      {filteredTickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 bg-[#181b21]/30 rounded-3xl border border-dashed border-white/5">
          <p className="text-sm font-bold text-white/40 italic">No tickets found in this section</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/5 bg-[#181b21]/50 shadow-xl">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="p-4 text-[10px] uppercase font-black text-gray-500 tracking-wider">Issue Details</th>
                <th className="p-4 text-[10px] uppercase font-black text-gray-500 tracking-wider">Priority</th>
                <th className="p-4 text-[10px] uppercase font-black text-gray-500 tracking-wider">Status</th>
                <th className="p-4 text-[10px] uppercase font-black text-gray-500 tracking-wider text-right">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-white text-sm">{ticket.title}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{ticket.id} • {ticket.category}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-black tracking-tight border ${
                      ticket.priority === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                    }`}>
                      {ticket.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4">
                     <span className={`flex items-center gap-1.5 w-fit px-2.5 py-1 rounded-md text-[10px] font-black border ${getStatusStyle(ticket.status)}`}>
                        {ticket.status === 'Resolved' ? <CheckCircle className="h-3 w-3"/> : <Clock className="h-3 w-3"/>}
                        {ticket.status.toUpperCase()}
                     </span>
                  </td>
                  <td className="p-4 text-right">
                    <p className="text-xs font-bold text-gray-400">{ticket.createdAt}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 5. Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#181b21] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 italic tracking-tighter uppercase">
                <Ticket className="h-5 w-5 text-blue-500" /> Raise New Support Ticket
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Subject / Issue Title</label>
                <input 
                  required autoFocus
                  className="w-full bg-black/20 border border-white/10 text-white px-4 py-3 rounded-xl text-sm focus:border-blue-500 outline-none transition-all" 
                  placeholder="Brief description of the problem..."
                  value={newTicket.title}
                  onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Category</label>
                  <select 
                    className="w-full bg-black/20 border border-white/10 text-white px-4 py-3 rounded-xl text-sm appearance-none outline-none focus:border-blue-500"
                    value={newTicket.category}
                    onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                  >
                    <option>IT Support</option>
                    <option>HR & Policy</option>
                    <option>Payroll</option>
                    <option>Management</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">Priority</label>
                  <select 
                    className="w-full bg-black/20 border border-white/10 text-white px-4 py-3 rounded-xl text-sm appearance-none outline-none focus:border-blue-500"
                    value={newTicket.priority}
                    onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-white/5">
                <button 
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl text-xs transition-all"
                >
                  DISCARD
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-white hover:bg-gray-200 text-black font-bold py-3 rounded-xl text-xs transition-all shadow-lg active:scale-95"
                >
                  SUBMIT TICKET
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tickets;