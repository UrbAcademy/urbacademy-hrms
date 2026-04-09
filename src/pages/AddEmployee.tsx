import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { UserPlus, Loader2 } from "lucide-react";
import { toast } from "sonner"; // Using toast for better feedback

export default function RegisterEmployee() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    department: "Sales", // Set default to one of your actual departments
    role: "bda", // Default to 'bda' to match your routing logic
  });

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Generate a random temporary password
      const tempPassword = "Urb" + Math.floor(Math.random() * 10000) + "!";
      
      // 2. Generate the next Employee ID 
      const newEmpId = `UA-2026-${Math.floor(Math.random() * 900 + 100)}`; 
      const email = `${newEmpId.toLowerCase()}@urbacademy.com`;

      // 3. Create the user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: tempPassword,
        options: {
          data: {
            full_name: formData.fullName,
            employee_id: newEmpId,
          }
        }
      });

      if (authError) throw authError;

      // 4. ✅ BULLETPROOF FIX: Use 'update' instead of 'upsert'
      // The Supabase trigger already created the blank row, so we just update it.
      const { error: dbError } = await supabase
        .from('profiles')
        .update({ 
          email: email,
          employee_id: newEmpId,
          full_name: formData.fullName,
          department: formData.department,
          role: formData.role.toLowerCase().includes('admin') ? 'admin' : 'bda' // Maps to your system roles
        })
        .eq('id', authData.user?.id); // Matches the exact row created by the trigger

  if (dbError) throw dbError;

      // 5. Success! (Using toast instead of the ugly browser alert)
      toast.success("Employee Onboarded Successfully!", {
        description: `Email: ${email}  |  Password: ${tempPassword}`,
        duration: 10000, // Stays on screen for 10 seconds
      });
      
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto p-8 bg-[#181b21] border border-white/5 rounded-2xl shadow-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 bg-blue-500/20 text-blue-500 rounded-lg flex items-center justify-center">
          <UserPlus size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">Onboard New Employee</h2>
          <p className="text-xs text-gray-400">System will auto-generate Email and ID.</p>
        </div>
      </div>

      <form onSubmit={handleRegister} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">Full Name</label>
          <input 
            type="text" required
            placeholder="Ex: Karan Sharma"
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none focus:border-blue-500 transition-all"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">Department</label>
            <select 
              value={formData.department}
              onChange={(e) => setFormData({...formData, department: e.target.value})}
              className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none"
            >
              <option value="Sales">Sales</option>
              <option value="CA Leads">CA Leads</option>
              <option value="Tech">Tech</option>
              <option value="HR">HR</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-1.5">System Access</label>
            <select 
              value={formData.role}
              onChange={(e) => setFormData({...formData, role: e.target.value})}
              className="w-full p-3 bg-black/20 border border-white/10 rounded-xl text-white outline-none"
            >
              <option value="bda">BDA (Employee)</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <button 
          type="submit" disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-xl font-bold mt-4 flex justify-center items-center gap-2 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" /> : "Generate ID & Create Account"}
        </button>
      </form>
    </div>
  );
}