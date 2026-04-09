import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Download, DollarSign, TrendingUp, Calendar, CreditCard, ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // ✅ Changed this import for stability

const MyPayroll = () => {
  const [expandedMonth, setExpandedMonth] = useState<string | null>(null);
  const [salaryHistory, setSalaryHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMyPayslips() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('payroll_records')
          .select('*')
          .eq('employee_id', user.id)
          .order('paid_at', { ascending: false });

        if (error) throw error;
        setSalaryHistory(data || []);
      } catch (error) {
        console.error("Error fetching payslips:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMyPayslips();
  }, []);

  const generatePDF = (slip: any) => {
    console.log("Starting PDF generation for:", slip.month_year); // 👈 Check your console for this!
    
    try {
      const doc = new jsPDF();
      
      // Header & Branding
      doc.setFontSize(22);
      doc.setTextColor(40, 44, 52);
      doc.text("URB ACADEMY", 105, 20, { align: "center" });
      
      doc.setFontSize(10);
      doc.text("Official Salary Statement", 105, 28, { align: "center" });
      doc.line(20, 32, 190, 32); 

      // Employee & Summary Info
      doc.setFontSize(12);
      doc.text(`Month: ${slip.month_year}`, 20, 45);
      doc.text(`Transaction: TXN-${slip.id.substring(0, 8).toUpperCase()}`, 20, 52);
      doc.text(`Status: ${slip.status}`, 150, 45);

      // Financial Table
      const tableRows = [
        ["Description", "Amount (INR)"],
        ["Base Salary", `Rs. ${slip.base_salary.toLocaleString()}`],
        ["Commissions / Bonus", `+ Rs. ${slip.commissions.toLocaleString()}`],
        ["Deductions (Unpaid Leaves)", `- Rs. ${slip.deductions.toLocaleString()}`],
        ["Net Total Paid", `Rs. ${slip.net_salary.toLocaleString()}`],
      ];

      // ✅ Using the direct autoTable call (more robust)
      autoTable(doc, {
        startY: 65,
        head: [tableRows[0]],
        body: tableRows.slice(1),
        theme: 'striped',
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontStyle: 'normal' },
        didParseCell: (data) => {
          // Make the "Net Total" row bold
          if (data.section === 'body' && data.row.index === 3) {
            data.cell.styles.fontStyle = 'bold';
          }
        }
      });

      doc.setFontSize(9);
      doc.setTextColor(150);
      doc.text("This is an electronically generated document. No signature is required.", 105, 280, { align: "center" });

      // Save the file
      doc.save(`UrbAcademy_Payslip_${slip.month_year.replace(/\s+/g, '_')}.pdf`);
      console.log("PDF saved successfully!");
    } catch (err) {
      console.error("PDF Generation Error:", err);
      alert("Check the console - there was an error generating the PDF.");
    }
  };

  // Salary Breakdown Visual
  const salaryStructure = [
    { label: "Basic Salary", amount: 12000, color: "bg-blue-500" },
    { label: "HRA", amount: 6000, color: "bg-purple-500" },
    { label: "Special Allowance", amount: 4000, color: "bg-green-500" },
    { label: "Performance Bonus", amount: 2500, color: "bg-yellow-500" },
  ];

  const totalSalary = salaryStructure.reduce((acc, curr) => acc + curr.amount, 0);
  const ytdEarnings = salaryHistory.reduce((sum, slip) => sum + Number(slip.net_salary), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">My Payroll</h2>
        <p className="text-gray-400 mt-1">Manage your salary, bonuses, and payslips.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#181b21] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-green-500/10 rounded-xl text-green-500">
            <DollarSign className="h-6 w-6" />
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase font-semibold">Net Salary (Base)</p>
            <h3 className="text-2xl font-bold text-white">₹{totalSalary.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-[#181b21] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-blue-500/10 rounded-xl text-blue-500">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase font-semibold">YTD Earnings</p>
            <h3 className="text-2xl font-bold text-white">₹{ytdEarnings.toLocaleString()}</h3>
          </div>
        </div>

        <div className="bg-[#181b21] border border-white/5 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-4 bg-purple-500/10 rounded-xl text-purple-500">
            <Calendar className="h-6 w-6" />
          </div>
          <div>
            <p className="text-gray-400 text-xs uppercase font-semibold">Next Payout</p>
            <h3 className="text-2xl font-bold text-white">01 May, 2026</h3>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-[#181b21] border border-white/5 p-6 rounded-2xl h-fit">
          <h3 className="text-lg font-semibold text-white mb-6">Salary Structure</h3>
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

        <div className="lg:col-span-2 bg-[#181b21] border border-white/5 rounded-2xl overflow-hidden">
          <div className="p-6 border-b border-white/5 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-white">Payslip History</h3>
          </div>
          <div className="divide-y divide-white/5">
            {loading ? (
              <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-blue-500 h-10 w-10" /></div>
            ) : salaryHistory.length === 0 ? (
              <div className="p-12 text-center text-gray-500 italic">No records found for this year.</div>
            ) : (
              salaryHistory.map((slip) => (
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
                        <h4 className="text-white font-medium">{slip.month_year}</h4>
                        <p className="text-xs text-gray-500">TXN-{slip.id.substring(0, 8).toUpperCase()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-white font-bold">₹{slip.net_salary.toLocaleString()}</p>
                        <span className="text-xs text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                          {slip.status}
                        </span>
                      </div>
                      {expandedMonth === slip.id ? <ChevronUp className="text-gray-500 h-5 w-5" /> : <ChevronDown className="text-gray-500 h-5 w-5" />}
                    </div>
                  </div>

                  {expandedMonth === slip.id && (
                    <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center animate-in slide-in-from-top-2">
                      <div className="text-sm text-gray-400 space-y-1">
                        <p>Base Salary: <span className="text-white">₹{slip.base_salary.toLocaleString()}</span></p>
                        <p>Commissions: <span className="text-green-400">+₹{slip.commissions.toLocaleString()}</span></p>
                        <p>Deductions: <span className="text-red-400">-₹{slip.deductions.toLocaleString()}</span></p>
                      </div>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent the accordion from closing
                          generatePDF(slip);
                        }}
                        className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors"
                      >
                        <Download className="h-4 w-4" /> Download PDF
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPayroll;