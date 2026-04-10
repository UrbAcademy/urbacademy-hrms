import { useState } from "react";
import { Search, Filter, MessageSquare, Users, FileText, Copy, Download, ChevronDown } from "lucide-react";
import { caLeads } from "@/lib/mock-data";

export default function CALeads() {
  const [tab, setTab] = useState<"leads" | "form">("leads");
  const [subTab, setSubTab] = useState<"new" | "downloaded">("new");

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      {/* 1. Header Section */}
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">CA Leads</h2>
        <p className="text-gray-400 mt-1 text-sm font-medium">Manage and track your assigned leads</p>
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
          <span className="ml-1 bg-white/10 px-2 py-0.5 rounded-full text-[10px]">249</span>
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
          CA Form
        </button>
      </div>

      {/* 3. Conditional Content */}
      {tab === "leads" ? (
        <div className="space-y-6">
          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input 
                placeholder="Search by name, email, or phone..." 
                className="w-full bg-[#181b21] border border-white/10 text-white pl-11 pr-4 py-3 rounded-xl text-sm focus:border-blue-500 outline-none transition-all" 
              />
            </div>
            <div className="relative">
              <label className="absolute -top-2 left-4 px-1 bg-[#0a0a0a] text-[10px] font-bold text-gray-500 uppercase tracking-widest z-10">Status</label>
              <div className="relative group">
                <select className="w-full bg-[#181b21] border border-white/10 text-white px-4 py-3 rounded-xl text-sm appearance-none outline-none cursor-pointer focus:border-blue-500">
                  <option>All statuses</option>
                  <option>CALL FORWARDED</option>
                  <option>NOT INTERESTED</option>
                  <option>DNP</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none group-hover:text-white transition-colors" />
              </div>
            </div>
          </div>

          <div className="text-sm font-medium text-gray-500 px-1">
            50 of 249 leads loaded
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-2xl border border-white/5 bg-[#181b21]/50 shadow-xl">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b border-white/5 bg-white/[0.02]">
                  {["Lead Details", "Uploaded At", "BDA", "Status", "Role", "WhatsApp", "College", "Branch"].map((h) => (
                    <th key={h} className="p-4 text-[10px] uppercase font-black text-gray-500 tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {caLeads.map((l, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <p className="font-bold text-white text-sm leading-tight">{l.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{l.email}</p>
                      <p className="text-xs text-gray-500">{l.phone}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-xs font-bold text-gray-400">{l.uploadedAt}</p>
                      <p className="text-[10px] text-gray-600 mt-0.5">12:40 pm</p>
                    </td>
                    <td className="p-4 text-xs font-bold text-white">{l.bda}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-tight ${
                        l.status === "Fresh" ? "bg-blue-500/10 text-blue-400" :
                        l.status === "CALL FORWARDED" ? "bg-blue-600/10 text-blue-500" :
                        l.status === "NOT INTERESTED" ? "bg-red-500/10 text-red-500" :
                        l.status === "DNP" ? "bg-rose-900/20 text-rose-500" :
                        "bg-green-500/10 text-green-500"
                      }`}>{l.status.toUpperCase()}</span>
                    </td>
                    <td className="p-4 text-gray-600 font-medium">—</td>
                    <td className="p-4">
                      <button className="h-8 w-8 flex items-center justify-center rounded-lg bg-white/5 text-gray-500 hover:text-green-500 hover:bg-green-500/10 transition-all">
                        <MessageSquare className="h-4 w-4" />
                      </button>
                    </td>
                    <td className="p-4 text-[11px] font-medium text-gray-400 leading-relaxed max-w-[180px] truncate">{l.college}</td>
                    <td className="p-4 text-[11px] font-medium text-gray-400">{l.branch}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* CA Form Section matching screenshot */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-1">My CA Form URL</label>
            <div className="flex gap-2">
              <div className="relative flex-1 group">
                <input 
                  readOnly 
                  value="https://ca.internship.forms.urbacademy.in/kQj61QU85YwNkSacTfjf" 
                  className="w-full bg-[#181b21] border border-white/10 text-gray-400 pl-4 pr-12 py-3 rounded-xl text-xs font-mono group-hover:border-white/20 transition-all outline-none" 
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-white transition-colors">
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-[#181b21] text-xs font-bold text-white hover:bg-white/5 transition-all shadow-sm">
                <Download className="h-4 w-4" /> Export to CSV
              </button>
            </div>
          </div>

          {/* Sub-tabs logic */}
          <div className="flex gap-1 p-1 bg-[#181b21] w-fit rounded-xl border border-white/5">
            <button 
              onClick={() => setSubTab("new")}
              className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${subTab === "new" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}
            >
              New Leads
            </button>
            <button 
              onClick={() => setSubTab("downloaded")}
              className={`px-6 py-2 rounded-lg text-xs font-black transition-all ${subTab === "downloaded" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}
            >
              Downloaded
            </button>
          </div>

          {/* Empty State placeholder */}
          <div className="flex flex-col items-center justify-center py-24 bg-[#181b21]/30 rounded-3xl border border-dashed border-white/5 space-y-4">
            <div className="h-16 w-16 rounded-2xl bg-white/[0.02] flex items-center justify-center text-gray-600 border border-white/5">
              <FileText className="h-8 w-8" />
            </div>
            <div className="text-center">
              <h3 className="text-lg font-bold text-white">No CA form leads found</h3>
              <p className="text-sm text-gray-500">No one has submitted any leads through the CA form yet.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}