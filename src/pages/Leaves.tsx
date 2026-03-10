import { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Plus, Clock, CheckCircle, XCircle, FileText, ChevronRight } from "lucide-react";

// Mock Data for Leave History
const initialLeaves = [
  { id: 1, type: "Sick Leave", from: "2024-03-10", to: "2024-03-11", days: 2, status: "Approved", reason: "Viral Fever" },
  { id: 2, type: "Casual Leave", from: "2024-02-15", to: "2024-02-15", days: 1, status: "Rejected", reason: "Personal work" },
  { id: 3, type: "Privilege Leave", from: "2024-01-20", to: "2024-01-25", days: 5, status: "Approved", reason: "Family Vacation" },
];

const Leaves = () => {
  const [leaves, setLeaves] = useState(initialLeaves);
  const [showForm, setShowForm] = useState(false);
  
  // Form State
  const [formData, setFormData] = useState({ type: "Casual Leave", from: "", to: "", reason: "" });

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    // Create a new mock leave entry
    const newLeave = {
      id: leaves.length + 1,
      type: formData.type,
      from: formData.from,
      to: formData.to,
      days: 1, // Logic to calc days would go here
      status: "Pending",
      reason: formData.reason
    };
    setLeaves([newLeave, ...leaves]);
    setShowForm(false);
    alert("Leave Request Sent Successfully!");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* 1. Header & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Leave Management</h2>
          <p className="text-gray-400 mt-1">Track your time off and balances.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg shadow-blue-900/20 transition-all hover:scale-105"
        >
          <Plus className="h-5 w-5" /> Apply New Leave
        </button>
      </div>

      {/* 2. APPLY FORM (Collapsible) */}
      {showForm && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }} 
          animate={{ opacity: 1, height: "auto" }}
          className="bg-[#181b21] border border-white/5 p-6 rounded-2xl overflow-hidden"
        >
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-500" /> New Request
          </h3>
          <form onSubmit={handleApply} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase">Leave Type</label>
              <select 
                className="w-full bg-black/20 border border-white/10 text-white rounded-lg p-3 focus:border-blue-500 outline-none"
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
              >
                <option>Casual Leave</option>
                <option>Sick Leave</option>
                <option>Privilege Leave</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase">Reason</label>
              <input 
                type="text" 
                required
                placeholder="Ex: Doctor Appointment"
                className="w-full bg-black/20 border border-white/10 text-white rounded-lg p-3 focus:border-blue-500 outline-none"
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase">From Date</label>
              <input 
                type="date" 
                required
                className="w-full bg-black/20 border border-white/10 text-white rounded-lg p-3 focus:border-blue-500 outline-none [color-scheme:dark]"
                value={formData.from}
                onChange={(e) => setFormData({...formData, from: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 uppercase">To Date</label>
              <input 
                type="date" 
                required
                className="w-full bg-black/20 border border-white/10 text-white rounded-lg p-3 focus:border-blue-500 outline-none [color-scheme:dark]"
                value={formData.to}
                onChange={(e) => setFormData({...formData, to: e.target.value})}
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3 mt-2">
              <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button type="submit" className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-medium">Submit Request</button>
            </div>
          </form>
        </motion.div>
      )}

      {/* 3. Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: "Casual Leaves", used: 4, total: 12, color: "text-blue-500", bg: "bg-blue-500/10" },
          { title: "Sick Leaves", used: 2, total: 10, color: "text-red-500", bg: "bg-red-500/10" },
          { title: "Privilege Leaves", used: 5, total: 15, color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map((item, i) => (
          <div key={i} className="bg-[#181b21] border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${item.bg}`}>
                <Calendar className={`h-6 w-6 ${item.color}`} />
              </div>
              <span className="text-2xl font-bold text-white">{item.total - item.used}</span>
            </div>
            <h3 className="text-gray-400 font-medium mb-1">{item.title}</h3>
            <div className="w-full bg-gray-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div 
                className={`h-full rounded-full ${item.color.replace('text', 'bg')}`} 
                style={{ width: `${(item.used / item.total) * 100}%` }} 
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">{item.used} used of {item.total}</p>
          </div>
        ))}
      </div>

      {/* 4. Leave History Table */}
      <div className="bg-[#181b21] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h3 className="text-lg font-semibold text-white">Request History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs uppercase text-gray-500 bg-white/5">
                <th className="p-4 font-semibold">Type</th>
                <th className="p-4 font-semibold">Duration</th>
                <th className="p-4 font-semibold">Days</th>
                <th className="p-4 font-semibold">Reason</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {leaves.map((leave) => (
                <tr key={leave.id} className="text-gray-300 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-medium text-white">{leave.type}</td>
                  <td className="p-4 text-gray-400">{leave.from} <span className="text-gray-600 px-1">to</span> {leave.to}</td>
                  <td className="p-4">{leave.days} Day(s)</td>
                  <td className="p-4 text-gray-400">{leave.reason}</td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${
                      leave.status === "Approved" ? "bg-green-500/10 text-green-500 border-green-500/20" :
                      leave.status === "Rejected" ? "bg-red-500/10 text-red-500 border-red-500/20" :
                      "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    }`}>
                      {leave.status === "Approved" && <CheckCircle className="h-3 w-3" />}
                      {leave.status === "Rejected" && <XCircle className="h-3 w-3" />}
                      {leave.status === "Pending" && <Clock className="h-3 w-3" />}
                      {leave.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {leaves.length === 0 && (
            <div className="p-8 text-center text-gray-500">No leave history found.</div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Leaves;