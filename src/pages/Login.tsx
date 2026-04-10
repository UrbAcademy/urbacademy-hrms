import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { motion, AnimatePresence } from "framer-motion"; 
import { BackgroundBeams } from "@/components/ui/BackgroundBeams"; 

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // --- LOGIC PRESERVED EXACTLY ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    if (authData.user) {
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*") 
        .eq("id", authData.user.id)
        .single();

      const role = profileData?.role || "bda";
      const userSession = { ...authData.user, ...profileData, role: role };
      sessionStorage.setItem("currentUser", JSON.stringify(userSession));

      if (role === "admin") {
        navigate("/admin"); 
      } else {
        navigate("/dashboard");
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
    if (error) setError(error.message);
  };
  // --- END LOGIC ---

  // 👇 FIXED: Changed the ease array to a standard string so TypeScript is happy
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden bg-[#020202] font-sans">
      {/* BACKGROUND ANIMATION ENGINE */}
      <BackgroundBeams />

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
        className="w-full max-w-[420px] z-10"
      >
        {/* LOGO SECTION */}
        <motion.div variants={itemVariants} className="text-center mb-10">
          <h1 className="text-5xl sm:text-6xl font-black text-white tracking-tight drop-shadow-[0_0_20px_rgba(59,130,246,0.4)]">
            Urb<span className="text-blue-500">Academy</span>
          </h1>
          <p className="mt-3 text-blue-400/80 font-bold uppercase tracking-[0.25em] text-[10px]">
            Authorization Terminal
          </p>
        </motion.div>

        {/* PREMIUM CARD */}
        <motion.div 
          variants={itemVariants}
          className="relative rounded-3xl border border-white/10 bg-black/40 backdrop-blur-2xl p-8 sm:p-10 shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden"
        >
          {/* Subtle top border highlight for 3D glass effect */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-50" />
          
          {/* Soft inner ambient light */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-[60px] pointer-events-none" />

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* INPUT FIELD 1 */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                Identity Hub
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@urbacademy.com"
                  required
                  className="w-full rounded-xl border border-white/5 bg-white/[0.02] pl-12 pr-4 py-4 text-sm text-gray-100 placeholder:text-gray-600 focus:bg-white/[0.05] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all outline-none"
                />
              </div>
            </div>

            {/* INPUT FIELD 2 */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">
                Access Key
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500 group-focus-within:text-blue-400 transition-colors" />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-white/5 bg-white/[0.02] pl-12 pr-12 py-4 text-sm text-gray-100 placeholder:text-gray-600 focus:bg-white/[0.05] focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all outline-none"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPw(!showPw)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPw ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {/* PRIMARY BUTTON */}
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit" 
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 py-4 text-[13px] font-bold text-white tracking-widest shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] transition-all disabled:opacity-50 border border-blue-400/20 mt-2"
            >
              {loading ? "AUTHENTICATING..." : "INITIALIZE SESSION"}
            </motion.button>
          </form>

          {/* DIVIDER */}
          <div className="relative mt-10 mb-8 flex items-center justify-center">
            <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <span className="relative bg-black/40 backdrop-blur-md px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-500 border border-white/5">
              Verification
            </span>
          </div>

          {/* SECONDARY BUTTON */}
          <motion.button
            whileHover={{ y: -2, backgroundColor: "rgba(255,255,255,0.06)" }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] py-4 text-[13px] font-bold text-gray-200 hover:text-white transition-all"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google Identity
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}