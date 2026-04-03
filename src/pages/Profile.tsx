import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { User, Lock, Save, Loader2 } from "lucide-react";

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  // User Data State
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  
  // Password State
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    fetchUserData();
  }, []);

  async function fetchUserData() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) throw error;
      
      if (user) {
        setEmail(user.email || "");
        // Supabase stores extra user info in the user_metadata object
        setFullName(user.user_metadata?.full_name || "");
        setPhone(user.user_metadata?.phone || "");
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  }

  // --- BULLETPROOF SAVE PROFILE INFO ---
  async function handleSaveProfile() {
    try {
      setSavingProfile(true);
      
      // 1. Force Supabase to grab the current session from the browser
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error("Session fetch error:", sessionError);
        return alert("Failed to get session. Please log out and log back in.");
      }

      if (!session) {
        console.warn("Session is NULL!");
        return alert("Your session has expired! You must log out and log back in.");
      }

      console.log("Valid session found for user:", session.user.id);

      // 2. Now attempt the update
      const { error: updateError } = await supabase.auth.updateUser({
        data: { 
          full_name: fullName, 
          phone: phone 
        }
      });

      if (updateError) {
        console.error("Update failed:", updateError);
        throw updateError;
      }
      
      alert("Profile updated successfully!");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      alert("Error updating profile: " + error.message);
    } finally {
      setSavingProfile(false);
    }
  }

  // --- SAVE NEW PASSWORD ---
  async function handleChangePassword() {
    if (newPassword.length < 6) {
      return alert("Password must be at least 6 characters long.");
    }

    try {
      setSavingPassword(true);
      
      // Always good to check session here too just in case!
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return alert("Session expired. Please log in again.");

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;
      
      alert("Password changed successfully!");
      setNewPassword(""); // Clear the input field
    } catch (error: any) {
      alert("Error changing password: " + error.message);
    } finally {
      setSavingPassword(false);
    }
  }

  if (loading) {
    return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      
      {/* Header Card */}
      <div className="rounded-2xl border border-border bg-card p-8 flex flex-col items-center justify-center text-center">
        <div className="h-24 w-24 rounded-full bg-primary/20 text-primary flex items-center justify-center text-3xl font-bold mb-4">
          {fullName ? fullName.charAt(0).toUpperCase() : <User size={40} />}
        </div>
        <h2 className="text-2xl font-bold text-card-foreground">{fullName || "Add your name below"}</h2>
        <p className="text-muted-foreground">{email}</p>
      </div>

      {/* Personal Information Form */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <User className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Personal Information</h3>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Full Name</label>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full rounded-lg border border-border bg-background p-3 text-foreground focus:border-primary focus:outline-none"
              placeholder="e.g. Rahul Sharma"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-lg border border-border bg-background p-3 text-foreground focus:border-primary focus:outline-none"
              placeholder="+91 98765 43210"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Email (Cannot be changed)</label>
            <input 
              type="email" 
              value={email}
              disabled
              className="w-full rounded-lg border border-border bg-muted p-3 text-muted-foreground cursor-not-allowed"
            />
          </div>

          <button 
            onClick={handleSaveProfile}
            disabled={savingProfile}
            className="mt-4 flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {savingProfile ? <Loader2 className="animate-spin h-4 w-4" /> : <Save className="h-4 w-4" />}
            Save Changes
          </button>
        </div>
      </div>

      {/* Security / Password Change */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-6">
          <Lock className="text-primary" />
          <h3 className="text-lg font-semibold text-card-foreground">Security</h3>
        </div>

        <div className="space-y-4 max-w-md">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">New Password</label>
            <input 
              type="password" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-lg border border-border bg-background p-3 text-foreground focus:border-primary focus:outline-none"
              placeholder="Enter new password"
            />
          </div>

          <button 
            onClick={handleChangePassword}
            disabled={savingPassword || !newPassword}
            className="flex items-center gap-2 bg-transparent border border-border text-foreground px-4 py-2 rounded-lg font-medium hover:bg-muted disabled:opacity-50 transition-colors"
          >
            {savingPassword ? <Loader2 className="animate-spin h-4 w-4" /> : "Update Password"}
          </button>
        </div>
      </div>

    </div>
  );
}