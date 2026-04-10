import { useState } from "react";
import { ExternalLink, Target, Plus, ChevronDown, MessageSquare, Loader2 } from "lucide-react";
import { waGroups } from "@/lib/mock-data";

const weeklyWA = [
  { week: "1st Apr - 7th Apr", target: 500, achieved: 0, status: "Not requested" },
  { week: "8th Apr - 14th Apr", target: 500, achieved: 0, status: "Not requested" },
  { week: "15th Apr - 21st Apr", target: 500, achieved: 0, status: "Not requested" },
];

export default function WAGroupUpdate() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 shrink-0">
            <MessageSquare className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">WhatsApp Groups</h2>
            <p className="text-gray-400 mt-1 text-sm font-medium">Manage and track your WhatsApp groups</p>
          </div>
        </div>
        <button className="bg-white hover:bg-gray-200 text-black px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all">
          <Plus className="h-4 w-4" /> Submit New Group
        </button>
      </div>

      {/* 2. WhatsApp Incentive Card */}
      <div className="rounded-2xl border border-white/5 bg-[#181b21] p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">WhatsApp Incentive</h3>
            <p className="text-sm text-gray-400">Achieve your weekly target of group of 500 members and you will be eligible for your incentive</p>
          </div>
          <button className="flex items-center justify-center h-10 w-10 rounded-xl border border-white/10 bg-background text-muted-foreground hover:bg-white/5 transition-colors">
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>
        
        <div className="space-y-6">
          {weeklyWA.map((w) => {
            const pct = Math.min(100, Math.round((w.achieved / w.target) * 100));
            return (
              <div key={w.week} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white">{w.week}</p>
                    <p className="text-xs text-gray-500 font-medium">{w.achieved}/{w.target} members</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="bg-white/5 border border-white/10 text-gray-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                      {w.status}
                    </span>
                    <button className="bg-white/5 border border-white/10 text-gray-400 px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-white/10 transition-colors">
                      Redeem Rs 500
                    </button>
                    <span className="text-xs font-bold text-white min-w-[24px] text-right">{pct}%</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div 
                    className="h-full rounded-full bg-white/20 transition-all duration-500" 
                    style={{ width: `${pct}%` }} 
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. My Groups Table */}
      <div className="rounded-2xl border border-white/5 bg-[#181b21] p-6 overflow-hidden">
        <h3 className="text-lg font-semibold text-white mb-6">My Groups <span className="text-gray-500 text-sm font-normal ml-1">({waGroups.length})</span></h3>
        <div className="overflow-x-auto -mx-6">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                {["Type", "Group Name", "College", "BDA", "Members", "Potential", "Created", "Link"].map((h) => (
                  <th key={h} className="px-6 py-4 text-[10px] uppercase font-black text-gray-500 tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {waGroups.map((g, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-black tracking-tight ${
                      g.type === "CGFL" ? "bg-blue-500/10 text-blue-400" : "bg-purple-500/10 text-purple-400"
                    }`}>{g.type}</span>
                  </td>
                  <td className="px-6 py-4 font-bold text-white text-sm">{g.name}</td>
                  <td className="px-6 py-4 text-[11px] font-medium text-gray-400 max-w-[200px] truncate">{g.college}</td>
                  <td className="px-6 py-4 text-xs font-bold text-white">{g.bda}</td>
                  <td className="px-6 py-4 text-sm font-bold text-white">{g.members}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">{g.potential}</td>
                  <td className="px-6 py-4 text-xs text-gray-500">{g.createdAt}</td>
                  <td className="px-6 py-4">
                    <button className="flex items-center gap-1.5 rounded-lg bg-blue-500/10 px-3 py-1.5 text-xs font-bold text-blue-400 hover:bg-blue-500 hover:text-white transition-all shadow-sm">
                      <ExternalLink className="h-3.5 w-3.5" /> Join
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}