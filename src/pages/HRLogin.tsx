import { useState } from "react";
import { motion } from "framer-motion";
import { User, Lock, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient"; // 👈 Make sure you have your supabase client imported

const HRLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ employeeId: "", password: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 👇 REAL DATABASE CHECK
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .eq('employee_id', formData.employeeId)
        .eq('password', formData.password) // Checking password directly (Simple method)
        .single();

      if (error || !data) {
        throw new Error("Invalid Credentials");
      }

      // ✅ SUCCESS
      // Save the user data we got from the database
      localStorage.setItem("currentUser", JSON.stringify(data));
      setLoading(false);
      navigate("/"); // Go to Dashboard

    } catch (err) {
      // ❌ FAILURE
      setLoading(false);
      setError("Invalid Employee ID or Password.");
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1115] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-[#181b21] border border-white/5 p-8 rounded-3xl w-full max-w-md shadow-2xl relative z-10"
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl bg-blue-600/20 text-blue-500 mb-4">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">UrbAcademy <span className="text-blue-500">Internal</span></h1>
          <p className="text-gray-400 text-sm mt-2">Database Connected</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }} 
              animate={{ opacity: 1, height: "auto" }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2"
            >
              <AlertCircle className="h-4 w-4" /> {error}
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Employee ID</label>
            <div className="relative group">
              <User className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Ex: EDV-2024-001"
                className="w-full bg-[#0f1115] border border-white/10 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                value={formData.employeeId}
                onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-4 top-3.5 h-5 w-5 text-gray-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="password" 
                placeholder="••••••••"
                className="w-full bg-[#0f1115] border border-white/10 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-gray-600"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg ${
              loading ? "bg-gray-700 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 shadow-blue-900/20 text-white"
            }`}
          >
            {loading ? "Checking Database..." : <>Sign In <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default HRLogin;