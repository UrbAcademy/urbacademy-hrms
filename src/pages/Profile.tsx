import { useState, useEffect } from "react";
import { User, Briefcase, CreditCard, FileText, Upload, Save, Loader2, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function MyProfile() {
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profileData, setProfileData] = useState({
    id: "",
    full_name: "",
    email: "",
    phone: "",
    dob: "",
    address: "",
    department: "",
    designation: "",
    joining_date: "",
    bank_name: "",
    account_number: "",
    ifsc_code: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;
      if (data) {
        setProfileData({ ...data, email: user.email }); // Email usually comes from auth
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone,
          dob: profileData.dob,
          address: profileData.address,
          bank_name: profileData.bank_name,
          account_number: profileData.account_number,
          ifsc_code: profileData.ifsc_code,
        })
        .eq('id', profileData.id);

      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, docType: string) => {
    // Note: You will need to set up Supabase Storage buckets for this to actually save files.
    // For now, this is the UI logic.
    const file = e.target.files?.[0];
    if (!file) return;
    toast.success(`${docType} selected for upload: ${file.name}`);
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-blue-500 h-8 w-8" /></div>;

  const tabs = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "professional", label: "Professional", icon: Briefcase },
    { id: "bank", label: "Bank Details", icon: CreditCard },
    { id: "documents", label: "Documents", icon: FileText },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white tracking-tight">My Profile</h2>
          <p className="text-gray-400 mt-1">Manage your personal and professional information.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar - Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold transition-all",
                  activeTab === tab.id 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" 
                    : "bg-[#181b21] text-gray-400 hover:bg-white/5 hover:text-white border border-white/5"
                )}
              >
                <Icon size={18} /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Content Area */}
        <div className="lg:col-span-3 bg-[#181b21] border border-white/5 rounded-3xl p-6 shadow-xl min-h-[400px]">
          
          {/* TAB 1: PERSONAL INFO */}
          {activeTab === "personal" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-xl font-bold text-white border-b border-white/5 pb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase">Full Name</label>
                  <input type="text" value={profileData.full_name || ""} onChange={(e) => setProfileData({...profileData, full_name: e.target.value})} className="w-full bg-black/20 border border-white/10 text-white rounded-xl p-3 focus:border-blue-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase">Email (Read Only)</label>
                  <input type="email" value={profileData.email || ""} disabled className="w-full bg-black/40 border border-white/5 text-gray-500 cursor-not-allowed rounded-xl p-3" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase">Phone Number</label>
                  <input type="tel" value={profileData.phone || ""} onChange={(e) => setProfileData({...profileData, phone: e.target.value})} className="w-full bg-black/20 border border-white/10 text-white rounded-xl p-3 focus:border-blue-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase">Date of Birth</label>
                  <input type="date" value={profileData.dob || ""} onChange={(e) => setProfileData({...profileData, dob: e.target.value})} className="w-full bg-black/20 border border-white/10 text-white rounded-xl p-3 focus:border-blue-500 outline-none [color-scheme:dark]" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase">Current Address</label>
                  <textarea rows={3} value={profileData.address || ""} onChange={(e) => setProfileData({...profileData, address: e.target.value})} className="w-full bg-black/20 border border-white/10 text-white rounded-xl p-3 focus:border-blue-500 outline-none" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PROFESSIONAL */}
          {activeTab === "professional" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-xl font-bold text-white border-b border-white/5 pb-4">Professional Details</h3>
              <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl text-blue-400 text-sm mb-6 flex items-center gap-2">
                <CheckCircle2 size={16} /> These details are managed by Urb Academy HR. Contact admin to change.
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase">Department</label>
                  <input type="text" value={profileData.department || "Sales"} disabled className="w-full bg-black/40 border border-white/5 text-gray-500 cursor-not-allowed rounded-xl p-3" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase">Designation</label>
                  <input type="text" value={profileData.designation || "Business Development Associate"} disabled className="w-full bg-black/40 border border-white/5 text-gray-500 cursor-not-allowed rounded-xl p-3" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase">Date of Joining</label>
                  <input type="date" value={profileData.joining_date || "2024-01-15"} disabled className="w-full bg-black/40 border border-white/5 text-gray-500 cursor-not-allowed rounded-xl p-3 [color-scheme:dark]" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BANK DETAILS */}
          {activeTab === "bank" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-xl font-bold text-white border-b border-white/5 pb-4">Bank Information</h3>
              <p className="text-sm text-gray-400">This account will be used for processing your monthly payroll.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase">Bank Name</label>
                  <input type="text" placeholder="e.g. HDFC Bank" value={profileData.bank_name || ""} onChange={(e) => setProfileData({...profileData, bank_name: e.target.value})} className="w-full bg-black/20 border border-white/10 text-white rounded-xl p-3 focus:border-blue-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase">Account Number</label>
                  <input type="password" placeholder="••••••••••••" value={profileData.account_number || ""} onChange={(e) => setProfileData({...profileData, account_number: e.target.value})} className="w-full bg-black/20 border border-white/10 text-white rounded-xl p-3 focus:border-blue-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase">IFSC Code</label>
                  <input type="text" placeholder="e.g. HDFC0001234" value={profileData.ifsc_code || ""} onChange={(e) => setProfileData({...profileData, ifsc_code: e.target.value.toUpperCase()})} className="w-full bg-black/20 border border-white/10 text-white rounded-xl p-3 focus:border-blue-500 outline-none" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: DOCUMENTS */}
          {activeTab === "documents" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-xl font-bold text-white border-b border-white/5 pb-4">My Documents</h3>
              <p className="text-sm text-gray-400 mb-4">Upload your required KYC and professional documents here.</p>
              
              <div className="space-y-4">
                {/* Document Item */}
                {['Aadhar Card', 'PAN Card', 'Updated Resume'].map((docName) => (
                  <div key={docName} className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-xl hover:border-white/10 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center">
                        <FileText size={20} />
                      </div>
                      <div>
                        <p className="text-white font-semibold">{docName}</p>
                        <p className="text-xs text-gray-500">PDF or Image (Max 5MB)</p>
                      </div>
                    </div>
                    <label className="cursor-pointer bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors">
                      <Upload size={16} /> Upload
                      <input type="file" className="hidden" accept=".pdf,image/*" onChange={(e) => handleFileUpload(e, docName)} />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}