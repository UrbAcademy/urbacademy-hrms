import { useState, useEffect } from "react";
import { Phone, MessageCircle, MoreHorizontal, Search, Plus, Calendar, Loader2, X, Upload, UserCheck } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import Papa from "papaparse"; 

const SalesLeads = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isAdmin, setIsAdmin] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);

  const [showModal, setShowModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    course: "Data Science", 
    status: "New",
    notes: ""
  });

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    const user = userStr ? JSON.parse(userStr) : null;
    const adminStatus = user?.role === 'admin' || user?.email === 'admin@test.com';
    setIsAdmin(adminStatus);

    if (adminStatus) {
      fetchEmployees();
    }
    fetchLeads();
  }, []);

  const fetchEmployees = async () => {
    const { data } = await supabase.from('profiles').select('id, full_name');
    if (data) setEmployees(data);
  };

  const fetchLeads = async () => {
    try {
      const { data, error } = await supabase
        .from('leads')
       .select(`*, profiles(full_name)`) // ✅ FIXED: Using direct column join to avoid Join Error
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkUpload = (e: any) => {
    const file = e.target.files[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        // ✅ FIXED: Mapping 'course' from CSV to 'course_interested' in DB
        const newLeads = results.data.map((row: any) => ({
          name: row.name || row.Name,
          phone: row.phone || row.Phone,
          course_interested: row.course || row.Course || "General",
          status: "New",
          notes: row.notes || "Bulk Uploaded"
        }));

        const { error } = await supabase.from('leads').insert(newLeads);
        if (error) {
          console.error("Insert Error:", error);
          toast.error("Upload failed. Check column names.");
        } else {
          toast.success(`${newLeads.length} leads added!`);
          fetchLeads();
        }
      }
    });
  };

  const handleAssignLead = async (leadId: string, employeeId: string) => {
    try {
      const { error } = await supabase
        .from('leads')
        .update({ assigned_to: employeeId })
        .eq('id', leadId);

      if (error) throw error;
      toast.success("Lead reassigned!");
      fetchLeads();
    } catch (error) {
      toast.error("Assignment failed");
    }
  };

  const handleStatusUpdate = async (leadId: string, leadName: string, currentStatus: string) => {
    const statuses = ["New", "Interested", "Follow Up", "Converted", "Rejected"];
    const nextStatus = window.prompt(
      `Update status for ${leadName}?\nOptions: ${statuses.join(", ")}`, 
      currentStatus
    );

    if (!nextStatus || !statuses.includes(nextStatus) || nextStatus === currentStatus) return;

    try {
      const { error: updateError } = await supabase
        .from('leads')
        .update({ status: nextStatus })
        .eq('id', leadId);

      if (updateError) throw updateError;

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
      fetchLeads(); 
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Failed to update status");
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
            course_interested: formData.course, // ✅ FIXED: Using DB column name
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
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Sales Leads</h2>
          <p className="text-gray-400 mt-1">Manage and track your student enquiries.</p>
        </div>
        <div className="flex gap-3">
          {isAdmin && (
            <label className="bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 cursor-pointer shadow-lg transition-all active:scale-95">
              <Upload className="h-5 w-5" /> Bulk Upload
              <input type="file" accept=".csv" className="hidden" onChange={handleBulkUpload} />
            </label>
          )}
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-all hover:scale-105"
          >
            <Plus className="h-5 w-5" /> Add New Lead
          </button>
        </div>
      </div>

      <div className="bg-[#181b21] border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search by name or phone..." 
            className="w-full bg-black/20 border border-white/10 text-white pl-9 pr-4 py-2 rounded-lg text-sm focus:border-blue-500 outline-none"
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
                  {isAdmin && <th className="p-4 font-semibold">Assigned To</th>}
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
                    {/* ✅ FIXED: Correct dynamic key */}
                    <td className="p-4 text-gray-300">{lead.course_interested}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
                        {lead.status}
                      </span>
                    </td>
                    
                    {isAdmin && (
                      <td className="p-4">
                        <select 
                          className="bg-black/40 border border-white/10 text-xs text-gray-300 rounded-lg p-2 outline-none focus:border-blue-500"
                          value={lead.assigned_to || ""}
                          onChange={(e) => handleAssignLead(lead.id, e.target.value)}
                        >
                          <option value="">Unassigned</option>
                          {employees.map(emp => (
                            <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                          ))}
                        </select>
                        {lead.assigned_profile?.full_name && (
                           <div className="text-[10px] text-blue-400 mt-1 italic">Assigned: {lead.assigned_profile.full_name}</div>
                        )}
                      </td>
                    )}

                    <td className="p-4 text-center">
                      <div className="flex justify-center items-center gap-2">
                        <button onClick={() => handleCall(lead.phone)} className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all">
                          <Phone className="h-4 w-4" />
                        </button>
                        <button onClick={() => handleWhatsApp(lead.phone, lead.name)} className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all">
                          <MessageCircle className="h-4 w-4" />
                        </button>
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