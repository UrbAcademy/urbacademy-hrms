import { useState, useEffect } from "react";
import { Phone, MessageCircle, MoreHorizontal, Search, Plus, Calendar, Loader2, X, DollarSign } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner"; // Ensure sonner is installed for notifications

const SalesLeads = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    course: "Data Science", // Default option
    status: "New",
    notes: ""
  });

  // 👇 NEW: Handle Status Change & Conversion
  const handleStatusUpdate = async (leadId: string, leadName: string, currentStatus: string) => {
    const statuses = ["New", "Interested", "Follow Up", "Converted", "Rejected"];
    const nextStatus = window.prompt(
      `Update status for ${leadName}?\nOptions: ${statuses.join(", ")}`, 
      currentStatus
    );

    if (!nextStatus || !statuses.includes(nextStatus) || nextStatus === currentStatus) return;

    try {
      // 1. Update Lead Status
      const { error: updateError } = await supabase
        .from('leads')
        .update({ status: nextStatus })
        .eq('id', leadId);

      if (updateError) throw updateError;

      // 2. Logic for "Converted" -> Add to Sales table
      if (nextStatus === "Converted") {
        const amount = window.prompt(`Conversion! Enter the course fee for ${leadName}:`, "5000");
        
        if (amount) {
          const userStr = localStorage.getItem("currentUser");
          const user = userStr ? JSON.parse(userStr) : null;

          const { error: salesError } = await supabase
            .from('sales')
            .insert([{
              employee_id: user?.id,
              customer_name: leadName,
              amount: parseFloat(amount),
              status: 'completed'
            }]);

          if (salesError) throw salesError;
          toast.success("Lead converted and Sales recorded! 💰");
        }
      } else {
        toast.success(`Status updated to ${nextStatus}`);
      }

      fetchLeads(); // Refresh list
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update status");
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      if (data) setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddLead = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { data, error } = await supabase
        .from('leads')
        .insert([
          {
            name: formData.name,
            phone: formData.phone,
            course: formData.course,
            status: formData.status,
            notes: formData.notes
          }
        ])
        .select();

      if (error) throw error;

      if (data) {
        setLeads([data[0], ...leads]);
        setShowModal(false);
        setFormData({ name: "", phone: "", course: "Data Science", status: "New", notes: "" });
        toast.success("Lead added successfully!");
      }
    } catch (error) {
      console.error("Error adding lead:", error);
      toast.error("Failed to add lead.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || lead.phone.includes(searchTerm);
    const matchesStatus = filterStatus === "All" || lead.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const handleCall = (phone: string) => window.location.href = `tel:${phone}`;
  
  const handleWhatsApp = (phone: string, name: string) => {
    const message = `Hi ${name}, I am calling from UrbAcademy regarding your enquiry. Are you free to talk?`;
    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Interested": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Converted": return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Follow Up": return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "Rejected": return "bg-red-500/10 text-red-500 border-red-500/20";
      default: return "bg-gray-500/10 text-gray-500";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10 relative">
      
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Sales Leads</h2>
          <p className="text-gray-400 mt-1">Manage and track your student enquiries.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all hover:scale-105"
        >
          <Plus className="h-5 w-5" /> Add New Lead
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-[#181b21] border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search by name or phone..." 
            className="w-full bg-black/20 border border-white/10 text-white pl-9 pr-4 py-2 rounded-lg text-sm focus:border-blue-500 outline-none transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          {["All", "New", "Interested", "Follow Up", "Converted"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors border ${
                filterStatus === status 
                ? "bg-white/10 text-white border-white/20" 
                : "text-gray-400 border-transparent hover:text-white hover:bg-white/5"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#181b21] border border-white/5 rounded-2xl overflow-hidden shadow-xl min-h-[400px]">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
            <p className="text-gray-400">Fetching live data from Supabase...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-xs uppercase text-gray-500 bg-white/5 border-b border-white/5">
                  <th className="p-4 font-semibold">Student Name</th>
                  <th className="p-4 font-semibold">Course Interest</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-sm">
                {filteredLeads.map((lead) => (
                  <tr key={lead.id} className="group hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="font-medium text-white">{lead.name}</div>
                      <div className="text-xs text-gray-500 font-mono mt-0.5">{lead.phone}</div>
                    </td>
                    <td className="p-4 text-gray-300">
                      {lead.course}
                      {lead.notes && (
                        <p className="text-[10px] text-gray-500 mt-1 truncate max-w-[150px]">"{lead.notes}"</p>
                      )}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-400 flex items-center gap-2">
                      <Calendar className="h-3 w-3" /> 
                      {lead.date ? new Date(lead.date).toLocaleDateString("en-IN", { day: 'numeric', month: 'short' }) : 'Just now'}
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center items-center gap-2">
                        <button onClick={() => handleCall(lead.phone)} className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all">
                          <Phone className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleWhatsApp(lead.phone, lead.name)} className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all">
                          <MessageCircle className="h-4 w-4" />
                        </button>
                        {/* 👇 UPDATED: More Actions triggers Status Update */}
                        <button 
                          onClick={() => handleStatusUpdate(lead.id, lead.name, lead.status)}
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Lead Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-[#181b21] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
              <X className="h-5 w-5" />
            </button>
            <div className="p-6 border-b border-white/5">
              <h3 className="text-xl font-bold text-white">Add New Lead</h3>
            </div>
            <form onSubmit={handleAddLead} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase">Student Name</label>
                <input 
                  type="text" required placeholder="Ex: Karan Sharma"
                  className="w-full bg-black/20 border border-white/10 text-white rounded-lg p-3 focus:border-blue-500 outline-none"
                  value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase">Phone Number</label>
                <input 
                  type="tel" required placeholder="10-digit mobile number"
                  className="w-full bg-black/20 border border-white/10 text-white rounded-lg p-3 focus:border-blue-500 outline-none"
                  value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase">Course</label>
                  <select 
                    className="w-full bg-black/20 border border-white/10 text-white rounded-lg p-3 focus:border-blue-500 outline-none"
                    value={formData.course} onChange={(e) => setFormData({...formData, course: e.target.value})}
                  >
                    <option value="Data Science">Data Science</option>
                    <option value="Full Stack">Full Stack</option>
                    <option value="UI/UX Design">UI/UX Design</option>
                    <option value="Cybersecurity">Cybersecurity</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-400 uppercase">Status</label>
                  <select 
                    className="w-full bg-black/20 border border-white/10 text-white rounded-lg p-3 focus:border-blue-500 outline-none"
                    value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="New">New</option>
                    <option value="Interested">Interested</option>
                    <option value="Follow Up">Follow Up</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-400 uppercase">Initial Notes</label>
                <textarea 
                  rows={2} placeholder="Any specific requirements?"
                  className="w-full bg-black/20 border border-white/10 text-white rounded-lg p-3 focus:border-blue-500 outline-none"
                  value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})}
                />
              </div>
              <button 
                type="submit" disabled={isSubmitting}
                className={`w-full font-bold py-3 rounded-xl transition-all flex justify-center items-center gap-2 ${
                  isSubmitting ? "bg-blue-600/50 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
              >
                {isSubmitting ? "Saving..." : "Save Lead"}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SalesLeads;