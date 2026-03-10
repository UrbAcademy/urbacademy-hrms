import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Ticket, CheckCircle, Clock, AlertCircle, MessageSquare, X } from "lucide-react";

// Mock Data
const initialTickets = [
  { id: 1, subject: "Laptop Battery Issue", category: "IT Support", priority: "High", status: "Open", date: "10 Mar, 2026" },
  { id: 2, subject: "Salary Slip Discrepancy", category: "Payroll", priority: "Medium", status: "In Progress", date: "08 Mar, 2026" },
  { id: 3, subject: "PF Account Query", category: "HR", priority: "Low", status: "Resolved", date: "01 Mar, 2026" },
];

const Tickets = () => {
  const [tickets, setTickets] = useState(initialTickets);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({
    subject: "",
    category: "IT Support",
    priority: "Medium",
    description: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newTicket = {
      id: tickets.length + 1,
      subject: formData.subject,
      category: formData.category,
      priority: formData.priority,
      status: "Open",
      date: new Date().toLocaleDateString("en-IN", { day: 'numeric', month: 'short', year: 'numeric' })
    };
    setTickets([newTicket, ...tickets]);
    setShowForm(false);
    setFormData({ subject: "", category: "IT Support", priority: "Medium", description: "" });
  };

  const getPriorityColor = (p: string) => {
    if (p === "High") return "text-red-500 bg-red-500/10 border-red-500/20";
    if (p === "Medium") return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
    return "text-blue-500 bg-blue-500/10 border-blue-500/20";
  };

  const getStatusIcon = (s: string) => {
    if (s === "Resolved") return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (s === "In Progress") return <Clock className="h-4 w-4 text-yellow-500" />;
    return <AlertCircle className="h-4 w-4 text-blue-500" />;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* 1. Header & Action */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Help Desk</h2>
          <p className="text-gray-400 mt-1">Raise tickets for IT, HR, or Payroll issues.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all hover:scale-105"
        >
          <Plus className="h-5 w-5" /> Raise New Ticket
        </button>
      </div>

      {/* 2. NEW TICKET FORM (Modal/Card) */}
      {showForm && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#181b21] border border-white/5 p-6 rounded-2xl relative"
        >
          <button 
            onClick={() => setShowForm(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>

          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Ticket className="h-5 w-5 text-blue-500" /> New Support Request
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase">Category</label>
                <select 
                  className="w-full bg-black/20 border border-white/10 text-white rounded-lg p-3 focus:border-blue-500 outline-none"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option>IT Support</option>
                  <option>Payroll & Accounts</option>
                  <option>HR & Policy</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase">Priority</label>
                <select 
                  className="w-full bg-black/20 border border-white/10 text-white rounded-lg p-3 focus:border-blue-500 outline-none"
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase">Subject</label>
              <input 
                type="text" 
                placeholder="Brief issue title..."
                required
                className="w-full bg-black/20 border border-white/10 text-white rounded-lg p-3 focus:border-blue-500 outline-none"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
              <textarea 
                rows={3}
                placeholder="Describe the issue in detail..."
                required
                className="w-full bg-black/20 border border-white/10 text-white rounded-lg p-3 focus:border-blue-500 outline-none"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg font-bold">Submit Ticket</button>
            </div>
          </form>
        </motion.div>
      )}

      {/* 3. Ticket List */}
      <div className="bg-[#181b21] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-lg font-semibold text-white">Your Recent Tickets</h3>
        </div>
        
        <div className="divide-y divide-white/5">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="p-4 hover:bg-white/5 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              
              <div className="flex items-start gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 mt-1">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold">{ticket.subject}</h4>
                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                    <span>{ticket.category}</span>
                    <span>•</span>
                    <span>{ticket.date}</span>
                    <span>•</span>
                    <span>Ticket #{1000 + ticket.id}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto pl-14 md:pl-0">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
                
                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                  ticket.status === "Resolved" ? "text-green-500 bg-green-500/10 border-green-500/20" :
                  ticket.status === "In Progress" ? "text-yellow-500 bg-yellow-500/10 border-yellow-500/20" :
                  "text-gray-400 bg-gray-500/10 border-gray-500/20"
                }`}>
                  {getStatusIcon(ticket.status)}
                  {ticket.status}
                </span>
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Tickets;