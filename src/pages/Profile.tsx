import { useState, useEffect } from "react";
import { User, Briefcase, CreditCard, FileText, Upload, Save, Loader2, CheckCircle2, PhoneCall, Camera } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function MyProfile() {
  const [activeTab, setActiveTab] = useState("personal");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profileData, setProfileData] = useState({
    id: "",
    employee_id: "", // NEW: Added Employee ID
    avatar_url: "",  // NEW: Added Avatar URL
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
    emergency_contact_name: "",
    emergency_contact_relation: "",
    emergency_contact_phone: "",
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
        setProfileData({ ...data, email: user.email }); 
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
          emergency_contact_name: profileData.emergency_contact_name,
          emergency_contact_relation: profileData.emergency_contact_relation,
          emergency_contact_phone: profileData.emergency_contact_phone,
          // Note: To save avatar_url permanently, you'll need Supabase Storage buckets to upload the file first.
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
    const file = e.target.files?.[0];
    if (!file) return;
    toast.success(`${docType} selected for upload: ${file.name}`);
  };

  // NEW: Handle Avatar Selection for immediate preview
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Creates a temporary local URL so the user can preview their image instantly
    const objectUrl = URL.createObjectURL(file);
    setProfileData(prev => ({ ...prev, avatar_url: objectUrl }));
    toast.success("Profile picture updated! (Configure Supabase Storage to save permanently)");
  };

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="animate-spin text-blue-500 h-8 w-8" /></div>;

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      
      {/* HEADER: Upgraded with Avatar and Dynamic ID */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-[#181b21] p-6 rounded-3xl border border-white/5 shadow-xl">
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full">
          {/* PROFILE AVATAR CIRCLE */}
          <div className="relative group shrink-0">
            <div className="h-24 w-24 rounded-full border-4 border-[#0a0a0a] bg-gray-800 overflow-hidden flex items-center justify-center shadow-lg">
              {profileData.avatar_url ? (
                <img src={profileData.avatar_url} alt="Profile" className="h-full w-full object-cover" />
              ) : (
                <User size={40} className="text-gray-400" />
              )}
            </div>
            {/* Upload Button Overlay */}
            <label className="absolute bottom-0 right-0 h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer border-2 border-[#181b21] shadow-lg group-hover:bg-blue-500 transition-colors">
              <Camera size={14} className="text-white" />
              <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} />
            </label>
          </div>

          {/* USER DETAILS & BADGES */}
          <div className="flex flex-col gap-1 text-center sm:text-left w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              {profileData.full_name || "Employee Name"}
            </h2>
            <p className="text-blue-400 text-lg font-medium mb-3">
              {profileData.designation || "Business Development Associate"}
            </p>
            
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              {/* DYNAMIC ID BADGE */}
              <span className="bg-[#2a2d36] text-white px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider border border-white/10">
                {profileData.employee_id || `EMP-${profileData.id?.substring(0,6).toUpperCase() || "NEW"}`}
              </span>
              <span className="bg-blue-900/20 border border-blue-500/40 text-blue-400 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider">
                Intern
              </span>
              <span className="bg-green-900/20 border border-green-500/40 text-green-400 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider">
                Full Time
              </span>
              <span className="bg-emerald-900/20 border border-emerald-500/40 text-emerald-400 px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wider flex items-center gap-1.5">
                <CheckCircle2 size={12} strokeWidth={3} /> Onboarded
              </span>
            </div>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button 
          onClick={handleSave}
          disabled={saving}
          className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-[0_0_20px_rgba(37,99,235,0.3)] transition-all shrink-0 w-full md:w-auto justify-center"
        >
          {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* TABS & CONTENT LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-4">
        
        {/* Left Sidebar - Tabs */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: "personal", label: "Personal Info", icon: User },
            { id: "professional", label: "Professional", icon: Briefcase },
            { id: "bank", label: "Bank Details", icon: CreditCard },
            { id: "emergency", label: "Emergency Contact", icon: PhoneCall },
            { id: "documents", label: "Documents", icon: FileText },
          ].map((tab) => {
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

          {/* TAB 4: EMERGENCY CONTACT */}
          {activeTab === "emergency" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-xl font-bold text-white border-b border-white/5 pb-4">Emergency Contact Information</h3>
              <p className="text-sm text-gray-400">Please provide details of the person to contact in case of an emergency.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase">Contact Name</label>
                  <input type="text" placeholder="e.g. Jane Doe" value={profileData.emergency_contact_name || ""} onChange={(e) => setProfileData({...profileData, emergency_contact_name: e.target.value})} className="w-full bg-black/20 border border-white/10 text-white rounded-xl p-3 focus:border-blue-500 outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase">Relationship</label>
                  <input type="text" placeholder="e.g. Father, Spouse" value={profileData.emergency_contact_relation || ""} onChange={(e) => setProfileData({...profileData, emergency_contact_relation: e.target.value})} className="w-full bg-black/20 border border-white/10 text-white rounded-xl p-3 focus:border-blue-500 outline-none" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold text-gray-400 uppercase">Phone Number</label>
                  <input type="tel" placeholder="+91 9876543210" value={profileData.emergency_contact_phone || ""} onChange={(e) => setProfileData({...profileData, emergency_contact_phone: e.target.value})} className="w-full bg-black/20 border border-white/10 text-white rounded-xl p-3 focus:border-blue-500 outline-none" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DOCUMENTS */}
          {activeTab === "documents" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-xl font-bold text-white border-b border-white/5 pb-4">My Documents</h3>
              <p className="text-sm text-gray-400 mb-4">Upload your required KYC and professional documents here.</p>
              
              <div className="space-y-4">
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