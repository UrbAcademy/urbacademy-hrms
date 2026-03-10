import { useState } from "react";
import { motion } from "framer-motion";
import { Trophy, TrendingUp, TrendingDown, Minus, Crown, Search, Filter } from "lucide-react";

// Mock Data
const initialData = [
  { rank: 1, name: "Priya Patel", sales: 42, revenue: 185000, trend: "up", avatar: "PP" },
  { rank: 2, name: "Arjun Singh", sales: 38, revenue: 156000, trend: "up", avatar: "AS" },
  { rank: 3, name: "Sneha Gupta", sales: 35, revenue: 142000, trend: "down", avatar: "SG" },
  { rank: 4, name: "Vikram Rao", sales: 31, revenue: 128000, trend: "same", avatar: "VR" },
  { rank: 5, name: "Ananya Joshi", sales: 29, revenue: 115000, trend: "up", avatar: "AJ" },
  { rank: 6, name: "Karan Mehta", sales: 24, revenue: 98000, trend: "down", avatar: "KM" },
  { rank: 7, name: "Divya Nair", sales: 21, revenue: 85000, trend: "up", avatar: "DN" },
  { rank: 8, name: "Rahul Sharma", sales: 19, revenue: 76000, trend: "same", avatar: "RS" }, // Current User
  { rank: 9, name: "Amit Verma", sales: 15, revenue: 62000, trend: "down", avatar: "AV" },
  { rank: 10, name: "Zara Khan", sales: 12, revenue: 48000, trend: "up", avatar: "ZK" },
];

const Leaderboard = () => {
  const [timeFrame, setTimeFrame] = useState("This Month");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredData = initialData.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const top3 = filteredData.slice(0, 3);
  const rest = filteredData.slice(3);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* 1. Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <Trophy className="h-8 w-8 text-yellow-500" /> Sales Leaderboard
          </h2>
          <p className="text-gray-400 mt-1">Real-time performance rankings.</p>
        </div>
        
        {/* Time Toggle */}
        <div className="bg-[#181b21] p-1 rounded-xl flex border border-white/10">
          {["Today", "This Week", "This Month"].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeFrame(tf)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                timeFrame === tf 
                ? "bg-blue-600 text-white shadow-lg" 
                : "text-gray-400 hover:text-white"
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* 2. THE PODIUM (Top 3) */}
      <div className="relative pt-10 pb-4">
        {/* Background Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-500/10 rounded-full blur-[100px] -z-10" />

        <div className="flex justify-center items-end gap-4 md:gap-8">
          
          {/* Rank 2 (Silver) */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="flex flex-col items-center"
          >
            <div className="mb-3 relative">
              <div className="h-16 w-16 rounded-full border-4 border-gray-400 bg-[#181b21] flex items-center justify-center text-xl font-bold text-gray-400">
                {top3[1]?.avatar}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-gray-400 text-black text-xs font-bold px-2 py-0.5 rounded-full">#2</div>
            </div>
            <div className="text-center mb-2">
              <p className="font-bold text-white text-sm">{top3[1]?.name}</p>
              <p className="text-blue-400 text-xs font-mono">₹{(top3[1]?.revenue/1000).toFixed(0)}k</p>
            </div>
            <div className="w-24 md:w-32 h-32 bg-gradient-to-t from-gray-800 to-gray-600/50 rounded-t-2xl border-t border-gray-500/30 flex items-end justify-center pb-4">
              <span className="text-4xl">🥈</span>
            </div>
          </motion.div>

          {/* Rank 1 (Gold) */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
            className="flex flex-col items-center z-10"
          >
            <div className="mb-3 relative">
              <Crown className="absolute -top-8 left-1/2 -translate-x-1/2 text-yellow-500 h-8 w-8 animate-bounce" />
              <div className="h-20 w-20 rounded-full border-4 border-yellow-500 bg-[#181b21] flex items-center justify-center text-2xl font-bold text-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]">
                {top3[0]?.avatar}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded-full">#1</div>
            </div>
            <div className="text-center mb-2">
              <p className="font-bold text-white text-lg">{top3[0]?.name}</p>
              <p className="text-blue-400 font-mono font-bold">₹{(top3[0]?.revenue/1000).toFixed(0)}k</p>
            </div>
            <div className="w-28 md:w-36 h-44 bg-gradient-to-t from-yellow-900/40 to-yellow-600/40 rounded-t-2xl border-t border-yellow-500/30 flex items-end justify-center pb-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-yellow-500/10 animate-pulse" />
              <span className="text-5xl relative z-10">🏆</span>
            </div>
          </motion.div>

          {/* Rank 3 (Bronze) */}
          <motion.div 
            initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }}
            className="flex flex-col items-center"
          >
            <div className="mb-3 relative">
              <div className="h-16 w-16 rounded-full border-4 border-orange-700 bg-[#181b21] flex items-center justify-center text-xl font-bold text-orange-700">
                {top3[2]?.avatar}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-orange-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">#3</div>
            </div>
            <div className="text-center mb-2">
              <p className="font-bold text-white text-sm">{top3[2]?.name}</p>
              <p className="text-blue-400 text-xs font-mono">₹{(top3[2]?.revenue/1000).toFixed(0)}k</p>
            </div>
            <div className="w-24 md:w-32 h-24 bg-gradient-to-t from-orange-900/40 to-orange-700/40 rounded-t-2xl border-t border-orange-600/30 flex items-end justify-center pb-4">
              <span className="text-4xl">🥉</span>
            </div>
          </motion.div>

        </div>
      </div>

      {/* 3. The List (Rank 4+) */}
      <div className="bg-[#181b21] border border-white/5 rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/5 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search employee..." 
              className="bg-black/20 border border-white/10 text-white pl-9 pr-4 py-2 rounded-lg text-sm focus:border-blue-500 outline-none w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 text-gray-400 hover:text-white text-sm">
            <Filter className="h-4 w-4" /> Filter
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xs uppercase text-gray-500 bg-white/5">
                <th className="p-4 text-center w-16">Rank</th>
                <th className="p-4">Employee</th>
                <th className="p-4 text-right">Sales Count</th>
                <th className="p-4 text-right">Revenue</th>
                <th className="p-4 text-center">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {rest.map((user) => (
                <tr 
                  key={user.rank} 
                  className={`group transition-colors ${user.name === "Rahul Sharma" ? "bg-blue-500/10 border-l-4 border-blue-500" : "hover:bg-white/5 border-l-4 border-transparent"}`}
                >
                  <td className="p-4 text-center font-bold text-gray-500">#{user.rank}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-400">
                        {user.avatar}
                      </div>
                      <span className={`font-medium ${user.name === "Rahul Sharma" ? "text-blue-400" : "text-white"}`}>
                        {user.name} {user.name === "Rahul Sharma" && "(You)"}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-right text-gray-300 font-mono">{user.sales}</td>
                  <td className="p-4 text-right font-bold text-green-400">₹{user.revenue.toLocaleString()}</td>
                  <td className="p-4 flex justify-center">
                    {user.trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
                    {user.trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
                    {user.trend === "same" && <Minus className="h-4 w-4 text-gray-500" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default Leaderboard;