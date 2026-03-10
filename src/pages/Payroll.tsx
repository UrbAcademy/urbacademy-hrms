import { useState } from "react";
import { Download, DollarSign, TrendingUp, Calendar, CreditCard, ChevronDown, ChevronUp } from "lucide-react";

const Payroll = () => {
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);

  // Mock Salary History
  const salaryHistory = [
    { id: 1, month: "February 2026", amount: 24500, status: "Credited", date: "01 Mar, 2026", transactionId: "TXN-883920" },
    { id: 2, month: "January 2026", amount: 22000, status: "Credited", date: "01 Feb, 2026", transactionId: "TXN-774821" },
    { id: 3, month: "December 2025", amount: 22000, status: "Credited", date: "01 Jan, 2026", transactionId: "TXN-663910" },
  ];

  // Salary Breakdown Data
  const salaryStructure = [
    { label: "Basic Salary", amount: 12000, color: "bg-blue-500" },
    { label: "HRA", amount: 6000, color: "bg-purple-500" },
    { label: "Special Allowance", amount: 4000, color: "bg-green-500" },
    { label: "Performance Bonus", amount: 2500, color: "bg-yellow-500" },
  ];

  const totalSalary = salaryStructure.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">My Payroll</h2>
        <p className="text-gray-400 mt-1">Manage your salary, bonuses, and payslips.</p>
      </div>

      {/* 1. Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#181b21] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-green-500/10 rounded-xl text-green-500">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase font-semibold">Net Salary</p>
            <h3 className="text-2xl font-bold text-white">₹{totalSalary.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-[#181b21] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-blue-500/10 rounded-xl text-blue-500">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase font-semibold">YTD Earnings</p>
            <h3 className="text-2xl font-bold text-white">₹2,84,000</h3>
          </div>
        </div>

        <div className="bg-[#181b21] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-purple-500/10 rounded-xl text-purple-500">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase font-semibold">Next Payout</p>
            <h3 className="text-2xl font-bold text-white">01 Apr, 2026</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* 2. Salary Structure (Visual Breakdown) */}
        <div className="lg:col-span-1 bg-[#181b21] border border-white/5 p-6 rounded-2xl h-fit">
          <h3 className="text-lg font-semibold text-white mb-6">Salary Structure</h3>
          
          {/* Progress Bar Visual */}
          <div className="flex h-4 w-full rounded-full overflow-hidden mb-6">
            {salaryStructure.map((item, index) => (
              <div key={index} style={{ width: `${(item.amount / totalSalary) * 100}%` }} className={item.color} />
            ))}
          </div>

          <div className="space-y-4">
            {salaryStructure.map((item, index) => (
              <div key={index} className="flex justify-between items-center group">
                <div className="flex items-center gap-3">
                  <div className={`h-3 w-3 rounded-full ${item.color}`} />
                  <span className="text-gray-300 text-sm group-hover:text-white transition-colors">{item.label}</span>
                </div>
                <span className="text-white font-medium">₹{item.amount.toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t border-white/10 pt-4 mt-4 flex justify-between items-center">
              <span className="text-gray-400 font-semibold">Gross Pay</span>
              <span className="text-xl font-bold text-green-400">₹{totalSalary.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* 3. Payslip History Table */}
        <div className="lg:col-span-2 bg-[#181b21] border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Payslip History</h3>
            <button className="text-sm text-blue-500 hover:text-blue-400">View All</button>
          </div>
          
          <div className="divide-y divide-white/5">
            {salaryHistory.map((slip) => (
              <div key={slip.id} className="p-4 hover:bg-white/5 transition-colors">
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedMonth(expandedMonth === slip.id ? null : slip.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400">
                      <CreditCard className="h-5 w-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{slip.month}</h4>
                      <p className="text-xs text-gray-500">{slip.transactionId}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-white font-bold">₹{slip.amount.toLocaleString()}</p>
                      <span className="text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                        {slip.status}
                      </span>
                    </div>
                    {expandedMonth === slip.id ? <ChevronUp className="text-gray-500 h-5 w-5" /> : <ChevronDown className="text-gray-500 h-5 w-5" />}
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedMonth === slip.id && (
                  <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center animate-in slide-in-from-top-2">
                    <div className="text-sm text-gray-400">
                      <p>Credited on: <span className="text-white">{slip.date}</span></p>
                      <p>Bank: <span className="text-white">HDFC Bank **** 8829</span></p>
                    </div>
                    <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">
                      <Download className="h-4 w-4" /> Download PDF
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Payroll;