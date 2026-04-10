import { useState, useEffect } from "react";
import { Phone, MessageCircle, MoreHorizontal, Search, Plus, Calendar, Loader2, X, Upload, UserCheck, Users, FileText, Copy, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import Papa from "papaparse"; 

const SalesLeads = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  
  // ✅ NEW UI States for tabs matching screenshots
  const [tab, setTab] = useState<"leads" | "form">("leads");
  
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
        .select(`*, profiles(full_name)`) 
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
            course_interested: formData.course,
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
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* 1. Header Section exactly like screenshot */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Sales Leads</h2>
          <p className="text-gray-400 mt-1 text-sm font-medium">Manage and track your sales leads</p>
        </div>
        <div className="flex gap-3">
          <label className="bg-[#181b21] hover:bg-white/5 border border-white/10 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer shadow-sm transition-all">
            <Upload className="h-4 w-4" /> Upload Leads
            <input type="file" accept=".csv" className="hidden" onChange={handleBulkUpload} />
          </label>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-white hover:bg-gray-200 text-black px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all"
          >
            <Plus className="h-4 w-4" /> Add New Lead
          </button>
        </div>
      </div>

      {/* 2. Top Navigation Tabs */}
      <div className="flex gap-4 p-1.5 bg-[#181b21] w-fit rounded-2xl border border-white/5 shadow-sm">
        <button
          onClick={() => setTab("leads")}
          className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            tab === "leads" 
            ? "bg-white/10 text-white shadow-lg ring-1 ring-white/10" 
            : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <Users className="h-4 w-4" />
          My Leads
        </button>
        <button
          onClick={() => setTab("form")}
          className={`flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
            tab === "form" 
            ? "bg-white/10 text-white shadow-lg ring-1 ring-white/10" 
            : "text-gray-500 hover:text-gray-300"
          }`}
        >
          <FileText className="h-4 w-4" />
          Salesform
          <span className="ml-1 bg-blue-600/20 text-blue-400 px-2 py-0.5 rounded-full text-[10px]">7</span>
        </button>
      </div>

      {/* 3. Conditional Content */}
      {tab === "leads" ? (
        <div className="space-y-6">
          {/* Search Box */}
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input 
              type="text"
              placeholder="Search by name, email, or phone..." 
              className="w-full bg-[#181b21] border border-white/10 text-white pl-11 pr-4 py-3 rounded-xl text-sm focus:border-blue-500 outline-none transition-all" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Empty State / Table Logic */}
          {loading ? (
             <div className="flex flex-col items-center justify-center py-24 bg-[#181b21]/30 rounded-3xl border border-dashed border-white/5 space-y-4">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                <p className="text-gray-400 text-sm">Fetching live leads...</p>
             </div>
          ) : filteredLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 bg-[#181b21]/30 rounded-3xl border border-dashed border-white/5 space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-white/[0.02] flex items-center justify-center text-gray-600 border border-white/5">
                <UserCheck className="h-8 w-8" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-bold text-white">No leads assigned</h3>
                <p className="text-sm text-gray-500 max-w-xs">You don't have any sales leads assigned yet. Check the Fresh Leads tab to get started.</p>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#181b21]/50">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-white/5 bg-white/[0.02]">
                    <th className="p-4 text-[10px] uppercase font-black text-gray-500 tracking-wider">Student Name</th>
                    <th className="p-4 text-[10px] uppercase font-black text-gray-500 tracking-wider">Course Interest</th>
                    <th className="p-4 text-[10px] uppercase font-black text-gray-500 tracking-wider">Status</th>
                    {isAdmin && <th className="p-4 text-[10px] uppercase font-black text-gray-500 tracking-wider">Assigned To</th>}
                    <th className="p-4 text-[10px] uppercase font-black text-gray-500 tracking-wider text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="font-bold text-white text-sm">{lead.name}</div>
                        <div className="text-xs text-gray-500 font-mono mt-0.5">{lead.phone}</div>
                      </td>
                      <td className="p-4 text-[11px] font-medium text-gray-300">{lead.course_interested}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black border ${getStatusColor(lead.status)}`}>
                          {lead.status.toUpperCase()}
                        </span>
                      </td>
                      {isAdmin && (
                        <td className="p-4">
                          <select 
                            className="bg-black/40 border border-white/10 text-[10px] text-gray-300 rounded-lg p-2 outline-none focus:border-blue-500"
                            value={lead.assigned_to || ""}
                            onChange={(e) => handleAssignLead(lead.id, e.target.value)}
                          >
                            <option value="">Unassigned</option>
                            {employees.map(emp => <option key={emp.id} value={emp.id}>{emp.full_name}</option>)}
                          </select>
                        </td>
                      )}
                      <td className="p-4 text-center">
                        <div className="flex justify-center items-center gap-2">
                          <button onClick={() => handleCall(lead.phone)} className="p-2 rounded-lg bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white transition-all"><Phone className="h-4 w-4" /></button>
                          <button onClick={() => handleWhatsApp(lead.phone, lead.name)} className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white transition-all"><MessageCircle className="h-4 w-4" /></button>
                          <button onClick={() => handleStatusUpdate(lead.id, lead.name, lead.status)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all"><MoreHorizontal className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        /* Salesform Tab Content */
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">My Form URL</label>
            <div className="relative group max-w-3xl">
              <input 
                readOnly 
                value="https://internship.form.urbacademy.in/kQj61QU85YwNkSacTfjf" 
                className="w-full bg-[#181b21] border border-white/10 text-gray-400 pl-4 pr-12 py-3 rounded-xl text-xs font-mono group-hover:border-white/20 transition-all outline-none" 
              />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-white transition-colors">
                <Copy className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#181b21]/50 shadow-xl">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  {["Name", "College", "Branch", "Year", "Module", "Status", "Created"].map((h) => (
                    <th key={h} className="p-4 text-[10px] uppercase font-black text-gray-500 tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs text-gray-500">
                <tr><td colSpan={7} className="p-12 text-center italic font-medium">No form submissions found for this URL yet.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. Add Lead Modal (Unchanged functionality) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#181b21] border border-white/10 rounded-2xl w-full max-w-md shadow-2xl relative">
            <button onClick={() => setShowModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"><X className="h-5 w-5" /></button>
            <div className="p-6 border-b border-white/5"><h3 className="text-xl font-bold text-white">Add New Lead</h3></div>
            <form onSubmit={handleAddLead} className="p-6 space-y-4">
              <input type="text" required placeholder="Student Name" className="w-full bg-black/20 border border-white/10 text-white rounded-lg p-3 focus:border-blue-500 outline-none" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
              <input type="tel" required placeholder="Phone Number" className="w-full bg-black/20 border border-white/10 text-white rounded-lg p-3 focus:border-blue-500 outline-none" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <select className="bg-black/20 border border-white/10 text-white rounded-lg p-3 outline-none" value={formData.course} onChange={(e) => setFormData({...formData, course: e.target.value})}>
                  <option value="Data Science">Data Science</option>
                  <option value="Full Stack">Full Stack</option>
                </select>
                <select className="bg-black/20 border border-white/10 text-white rounded-lg p-3 outline-none" value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})}>
                  <option value="New">New</option>
                  <option value="Interested">Interested</option>
                </select>
              </div>
              <textarea rows={2} placeholder="Notes" className="w-full bg-black/20 border border-white/10 text-white rounded-lg p-3 focus:border-blue-500 outline-none" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} />
              <button type="submit" disabled={isSubmitting} className="w-full font-bold py-3 rounded-xl bg-white text-black hover:bg-gray-200 transition-all">{isSubmitting ? "Saving..." : "Save Lead"}</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default SalesLeads;