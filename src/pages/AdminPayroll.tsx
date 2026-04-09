import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Banknote, Calculator, CheckCircle2, Loader2, Receipt } from "lucide-react";
import { toast } from "sonner";

export default function AdminPayroll() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });

  useEffect(() => {
    fetchPayrollData();
  }, []);

  async function fetchPayrollData() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, role, department, base_salary');

      if (error) throw error;

      const formattedData = data.map(emp => ({
        ...emp,
        base_salary: emp.base_salary || 25000,
        deductions: 0,
        commissions: 0,
      }));

      setEmployees(formattedData);
    } catch (error) {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (id, field, value) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === id ? { ...emp, [field]: Number(value) } : emp
    ));
  };

  const handleProcessPayment = async (emp) => {
    setProcessingId(emp.id);
    const netSalary = emp.base_salary - emp.deductions + emp.commissions;

    try {
      const { error } = await supabase
        .from('payroll_records')
        .insert([
          {
            employee_id: emp.id,
            month_year: currentMonth,
            base_salary: emp.base_salary,
            deductions: emp.deductions,
            commissions: emp.commissions,
            net_salary: netSalary,
            status: 'Paid'
          }
        ]);

      if (error) throw error;
      toast.success(`Payslip generated for ${emp.full_name}!`);
    } catch (error) {
      toast.error("Failed to process payment");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
          <Banknote className="text-green-500 h-8 w-8" />
          Payroll Processing
        </h2>
        <p className="text-gray-400 mt-1">Manage salaries for {currentMonth}.</p>
      </div>

      <div className="bg-[#181b21] border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 text-xs uppercase text-gray-500 font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">Employee</th>
                <th className="px-6 py-4">Base Salary</th>
                <th className="px-6 py-4">Deductions (₹)</th>
                <th className="px-6 py-4">Commissions (₹)</th>
                <th className="px-6 py-4">Net Pay</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-20"><Loader2 className="animate-spin h-8 w-8 mx-auto text-blue-500" /></td></tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white">{emp.full_name}</p>
                      <p className="text-xs text-gray-500">{emp.role}</p>
                    </td>
                    <td className="px-6 py-4">₹{emp.base_salary.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <input 
                        type="number" 
                        value={emp.deductions}
                        onChange={(e) => handleInputChange(emp.id, 'deductions', e.target.value)}
                        className="w-24 bg-black/30 border border-white/10 rounded-lg p-2 text-red-400 focus:border-red-500 outline-none"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <input 
                        type="number" 
                        value={emp.commissions}
                        onChange={(e) => handleInputChange(emp.id, 'commissions', e.target.value)}
                        className="w-24 bg-black/30 border border-white/10 rounded-lg p-2 text-green-400 focus:border-green-500 outline-none"
                      />
                    </td>
                    <td className="px-6 py-4 text-lg font-bold text-white">
                      ₹{(emp.base_salary - emp.deductions + emp.commissions).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleProcessPayment(emp)}
                        disabled={processingId === emp.id}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition-all w-full justify-center disabled:opacity-50"
                      >
                        {processingId === emp.id ? <Loader2 className="animate-spin h-4 w-4" /> : "Process"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}