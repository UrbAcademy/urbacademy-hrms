import { useState } from "react";
import { 
  Youtube, MessageCircle, Link as LinkIcon, CreditCard, Award, 
  FileText, FileCheck, BookOpen, Folder, Trophy, Mic, QrCode, 
  RefreshCw, Search, Copy, ExternalLink, Calendar, PlayCircle,
  CheckCircle2, FilePlus, Trash2, Download, Eye, Plus, X,
  Shield, Globe // ✅ Added for Documentations
} from "lucide-react";

// Mock data for the sidebar menu
const resourceMenus = [
  { id: 'youtube', label: 'YouTube', icon: Youtube },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle },
  { id: 'razorpay', label: 'Razorpay Payment Links', icon: LinkIcon },
  { id: 'payu', label: 'PayU Payment Links', icon: CreditCard },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'invoices', label: 'Custom Invoices [PENDING]', icon: FileText },
  { id: 'receipts', label: 'Custom Receipts [PAID]', icon: FileCheck },
  { id: 'blogs', label: 'Blogs', icon: BookOpen },
  { id: 'docs', label: 'Documentations', icon: Folder },
  { id: 'stories', label: 'Success Stories', icon: Trophy },
  { id: 'pitches', label: 'Pitches', icon: Mic },
  { id: 'gatepass', label: 'My Gate Pass', icon: QrCode },
];

// Rebranded to UrbAcademy
const mockVideos = [
  { id: 1, title: "L4: Discretionary Trading Explained for Beginners | Tradin...", date: "19 Mar 2026", channel: "UrbAcademy" },
  { id: 2, title: "L9: Introduction to Risk Management | Beginner Guide", date: "19 Mar 2026", channel: "UrbAcademy" },
  { id: 3, title: "L6: Introduction to Forex Market | Beginner Guide", date: "19 Mar 2026", channel: "UrbAcademy" },
  { id: 4, title: "L7: Strategy & Backtesting Masterclass", date: "18 Mar 2026", channel: "UrbAcademy" },
  { id: 5, title: "L8: Live Trading & Practical MT5 Overview", date: "18 Mar 2026", channel: "UrbAcademy" },
  { id: 6, title: "L5: Discretionary Trading for Equity Markets", date: "18 Mar 2026", channel: "UrbAcademy" }
];

const whatsappGroups = [
  { 
    id: 1, 
    title: "UrbAcademy Official NCR Channel", 
    desc: "Official NCR community channel", 
    link: "https://chat.whatsapp.com/Ga3MOtk13u8LoCSzn2T16x", 
    theme: { bg: "bg-purple-900/20", border: "border-purple-500/30", icon: "text-purple-400", button: "bg-purple-600 hover:bg-purple-700" }
  },
  { 
    id: 2, 
    title: "Fight Club Official", 
    desc: "Your team's official group", 
    link: "https://chat.whatsapp.com/GbS1jGPuNeRH682qfUZ9T6", 
    theme: { bg: "bg-green-900/20", border: "border-green-500/30", icon: "text-green-400", button: "bg-[#16a34a] hover:bg-[#15803d]" } 
  },
  { 
    id: 3, 
    title: "Fight Club Unofficial", 
    desc: "Your team's unofficial group", 
    link: "https://chat.whatsapp.com/Ktwdjcn3KlmDRPxtnp5Lva", 
    theme: { bg: "bg-blue-900/20", border: "border-blue-500/30", icon: "text-blue-400", button: "bg-[#0ea5e9] hover:bg-[#0284c7]" } 
  },
];

const razorpayLinks = [
  { id: 1, amount: "1,000", link: "" },
  { id: 2, amount: "1,500", link: "" },
  { id: 3, amount: "2,000", link: "" },
  { id: 4, amount: "2,500", link: "" },
  { id: 5, amount: "3,000", link: "" },
  { id: 6, amount: "3,500", link: "" },
  { id: 7, amount: "4,000", link: "" },
  { id: 8, amount: "5,000", link: "" },
  { id: 9, amount: "6,000", link: "" },
];

const payuLinks = [
  { id: 1, amount: "1,000", link: "" },
  { id: 2, amount: "1,500", link: "" },
  { id: 3, amount: "2,000", link: "" },
  { id: 4, amount: "2,500", link: "" },
  { id: 5, amount: "3,000", link: "" },
  { id: 6, amount: "3,500", link: "" },
  { id: 7, amount: "4,000", link: "" },
  { id: 8, amount: "4,500", link: "" },
  { id: 9, amount: "5,000", link: "" },
];

// ✅ NEW: Documentations Mock Data matching SS
const documentations = [
  { title: "CATC Certiport Certificate", id: null, verification: null, hasVerify: false, logo: "Certiport" },
  { title: "Startup India Certificate", id: "DIPP121653", verification: "Startup India Verification", hasVerify: true, logo: "Startup India" },
  { title: "Company PAN Card", id: null, verification: null, hasVerify: false, logo: "Income Tax Department" },
  { title: "Udyam Registration Certificate", id: "UDYAM-DL-11-0117029", verification: "UDYAM Verification", hasVerify: true, logo: "Udyam Registration" },
  { title: "Tax Deduction and Collection Account Number", id: "DELI219538B", verification: null, hasVerify: false, logo: "Income Tax Department" },
  { title: "GST Certificate", id: "07AAICE7591H1Z8", verification: null, hasVerify: false, logo: "Goods and Services Tax" },
  { title: "Certificate of Incorporation", id: "U85400DL2025PTC445067", verification: null, hasVerify: false, logo: "Ministry of Corporate Affairs" },
];

export default function Resources() {
  const [activeMenu, setActiveMenu] = useState('docs'); // Default to docs for immediate view
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-in fade-in duration-500 pb-10 min-h-[calc(100vh-6rem)]">
      
      {/* LEFT SIDEBAR: Resource Menu */}
      <div className="w-full md:w-72 shrink-0 flex flex-col">
        <div className="bg-[#181b21] rounded-2xl border border-white/5 p-4 flex-1">
          <div className="mb-6 px-2">
            <h3 className="text-xs font-bold text-gray-500 tracking-wider uppercase mb-1">Resources</h3>
            <p className="text-sm text-gray-400">Choose a section to open its dedicated page.</p>
          </div>

          <nav className="space-y-0.5">
            {resourceMenus.map((menu) => (
              <button
                key={menu.id}
                onClick={() => setActiveMenu(menu.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeMenu === menu.id 
                    ? "bg-white/10 text-white shadow-sm" 
                    : "text-gray-400 hover:bg-white/5 hover:text-gray-200"
                }`}
              >
                <menu.icon className={`h-4 w-4 shrink-0 ${activeMenu === menu.id ? "text-white" : "text-gray-500"}`} />
                <span className="truncate">{menu.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* RIGHT AREA: Main Content */}
      <div className="flex-1 min-w-0 flex flex-col gap-6">
        
        {/* Render YouTube Section */}
        {activeMenu === 'youtube' ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                  <Youtube className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">UrbAcademy Videos</h2>
                  <p className="text-sm text-gray-400">Browse and share videos (62 videos)</p>
                </div>
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/10 bg-black/20 text-sm font-medium text-white hover:bg-white/5 transition-colors shrink-0">
                <RefreshCw className="h-4 w-4" /> Refresh
              </button>
            </div>

            <div className="relative flex items-center bg-[#181b21] rounded-xl border border-white/5 p-1.5 focus-within:border-white/20 transition-colors">
              <Search className="absolute left-4 h-5 w-5 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search videos..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-none pl-12 pr-4 py-2 text-sm text-white placeholder:text-gray-500 outline-none"
              />
              <button className="flex items-center gap-2 px-6 py-2 rounded-lg bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors shrink-0">
                Search
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockVideos.map((video) => (
                <div key={video.id} className="bg-[#181b21] rounded-2xl border border-white/5 overflow-hidden flex flex-col hover:border-white/20 transition-all hover:-translate-y-1 group">
                  <div className="w-full aspect-video bg-gradient-to-br from-blue-900/20 to-[#0a0a0a] border-b border-white/5 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
                      {video.title.split(':')[0] || 'Video'}
                    </div>
                    <div className="absolute top-2 right-2 opacity-50">
                      <Youtube className="h-4 w-4 text-white" />
                    </div>
                    <PlayCircle className="h-12 w-12 text-white/20 group-hover:text-white/40 transition-colors" />
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 opacity-50">
                      <div className="w-4 h-1 bg-blue-500 rounded-full" />
                      <div className="w-1 h-1 bg-white rounded-full" />
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <h3 className="text-sm font-bold text-white mb-3 line-clamp-2 leading-snug group-hover:text-blue-400 transition-colors">{video.title}</h3>
                    <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium mb-5 mt-auto">
                      <Calendar className="h-3 w-3" />
                      <span>{video.date}</span><span className="mx-0.5">•</span><span>{video.channel}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border border-white/10 bg-black/20 text-sm font-bold text-gray-300 hover:bg-white/5 hover:text-white transition-colors">
                        <Copy className="h-4 w-4" /> Copy Link
                      </button>
                      <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors">
                        Watch <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) 
        
        /* Render WhatsApp Section */
        : activeMenu === 'whatsapp' ? (
          <div className="flex flex-col h-full gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-[#16a34a]/10 border border-[#16a34a]/20 flex items-center justify-center text-[#16a34a] shrink-0">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">WhatsApp Groups</h2>
                <p className="text-sm text-gray-400">Scan QR codes to join official WhatsApp groups</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {whatsappGroups.map((group) => (
                <div key={group.id} className={`flex flex-col rounded-2xl border ${group.theme.border} bg-[#181b21] overflow-hidden`}>
                  <div className={`${group.theme.bg} p-5 border-b ${group.theme.border} flex items-start gap-3`}>
                    <div className={`mt-0.5 h-6 w-6 rounded-md bg-white/10 flex items-center justify-center ${group.theme.icon}`}>
                      <MessageCircle className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-white leading-snug">{group.title}</h3>
                      <p className="text-xs text-gray-400 mt-0.5">{group.desc}</p>
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col">
                    <div className="bg-white p-3 rounded-xl mx-auto w-40 h-40 flex items-center justify-center mb-6 shadow-inner">
                      <QrCode className="w-full h-full text-black" strokeWidth={1} />
                    </div>

                    <div className="mt-auto space-y-3">
                      <div className="relative">
                        <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                        <input 
                          type="text" 
                          readOnly 
                          value={group.link}
                          className="w-full bg-black/40 border border-white/5 rounded-lg pl-9 pr-3 py-2 text-[10px] text-gray-400 outline-none truncate"
                        />
                      </div>
                      
                      <div className="flex gap-2">
                        <button className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-white text-xs font-bold transition-colors ${group.theme.button}`}>
                          <Copy className="h-3.5 w-3.5" /> Copy Link
                        </button>
                        <button className="flex items-center justify-center w-10 rounded-lg border border-white/10 bg-black/20 text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                          <ExternalLink className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto bg-[#181b21] rounded-xl border border-white/5 p-4 flex items-center shadow-sm">
              <p className="text-sm font-bold text-gray-400">
                Your Team: <span className="text-white font-medium ml-1">Fight Club</span>
              </p>
            </div>
          </div>
        ) 
        
        /* Render Razorpay Section */
        : activeMenu === 'razorpay' ? (
          <div className="flex flex-col h-full gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-[#3b82f6]/10 border border-[#3b82f6]/20 flex items-center justify-center text-blue-500 shrink-0">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Razorpay Payment Links</h2>
                <p className="text-sm text-gray-400">Click to copy Razorpay payment links for different amounts</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {razorpayLinks.map((item) => (
                <div key={item.id} className="bg-[#181b21] rounded-2xl border border-white/5 p-5 flex flex-col gap-5">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                      <CreditCard className="h-3.5 w-3.5 fill-current" />
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-wide">₹{item.amount}</h3>
                  </div>

                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                    <input 
                      type="text" 
                      readOnly 
                      value={item.link}
                      className="w-full bg-black/40 border border-white/5 rounded-lg pl-9 pr-3 py-2.5 text-[11px] text-gray-400 outline-none truncate"
                    />
                  </div>
                  
                  <div className="flex gap-2 mt-auto">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-colors">
                      <Copy className="h-4 w-4" /> Copy Link
                    </button>
                    <button className="flex items-center justify-center w-11 rounded-lg border border-white/10 bg-black/20 text-gray-400 hover:text-white hover:bg-white/5 transition-colors shrink-0">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
        
        /* Render PayU Section */
        : activeMenu === 'payu' ? (
          <div className="flex flex-col h-full gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                <CreditCard className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">PayU Payment Links</h2>
                <p className="text-sm text-gray-400">Click to copy PayU payment links for different amounts</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {payuLinks.map((item) => (
                <div key={item.id} className="bg-[#181b21] rounded-2xl border border-white/5 p-5 flex flex-col gap-5">
                  <div className="flex items-center gap-3">
                    <div className="h-7 w-7 rounded-full bg-green-500 flex items-center justify-center text-white shrink-0">
                      <CreditCard className="h-3.5 w-3.5 fill-current" />
                    </div>
                    <h3 className="text-xl font-bold text-white tracking-wide">₹{item.amount}</h3>
                  </div>

                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
                    <input 
                      type="text" 
                      readOnly 
                      value={item.link}
                      className="w-full bg-black/40 border border-white/5 rounded-lg pl-9 pr-3 py-2.5 text-[11px] text-gray-400 outline-none truncate"
                    />
                  </div>
                  
                  <div className="flex gap-2 mt-auto">
                    <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-bold transition-colors">
                      <Copy className="h-4 w-4" /> Copy Link
                    </button>
                    <button className="flex items-center justify-center w-11 rounded-lg border border-white/10 bg-black/20 text-gray-400 hover:text-white hover:bg-white/5 transition-colors shrink-0">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )
        
        /* Render Certificates Section */
        : activeMenu === 'certificates' ? (
          <div className="flex flex-col h-full gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500 shrink-0">
                <Award className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Certificate Generator</h2>
                <p className="text-sm text-gray-400">Generate enrollment certificates for students</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="bg-[#181b21] rounded-2xl border border-white/5 overflow-hidden">
                <div className="bg-gradient-to-b from-[#ea580c]/10 to-transparent p-6 border-b border-white/5">
                  <div className="flex items-center gap-3 mb-1">
                    <Award className="h-5 w-5 text-[#ea580c]" />
                    <h3 className="text-base font-bold text-white">Generate Certificate</h3>
                  </div>
                  <p className="text-sm text-gray-400">Enter student details to generate an enrollment certificate</p>
                </div>
                <div className="p-6 space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white">Student Name</label>
                    <input type="text" placeholder="Enter student name" className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:border-[#ea580c] outline-none transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white">Enrollment Month</label>
                    <input type="text" placeholder="Jan - Mar" className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:border-[#ea580c] outline-none transition-colors" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white">Course Domain</label>
                    <input type="text" placeholder="e.g., Web Development" className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white focus:border-[#ea580c] outline-none transition-colors" />
                  </div>
                  <button className="w-full mt-2 py-3 rounded-xl bg-[#ea580c] hover:bg-[#c2410c] text-white text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                    <Award className="h-4 w-4" /> Generate Certificate
                  </button>
                </div>
              </div>

              <div className="bg-[#181b21] rounded-2xl border border-white/5 overflow-hidden flex flex-col h-full min-h-[400px]">
                <div className="bg-gradient-to-b from-[#16a34a]/10 to-transparent p-6 border-b border-white/5">
                  <div className="flex items-center gap-3 mb-1">
                    <CheckCircle2 className="h-5 w-5 text-[#16a34a]" />
                    <h3 className="text-base font-bold text-white">Certificate Preview</h3>
                  </div>
                  <p className="text-sm text-gray-400">View and download the generated certificate</p>
                </div>
                <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                  <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                    <Award className="h-8 w-8 text-gray-600" />
                  </div>
                  <p className="text-sm text-gray-400 max-w-xs leading-relaxed">Fill in the details and generate a certificate to preview it here</p>
                </div>
              </div>
            </div>
          </div>
        )

        : activeMenu === 'invoices' ? (
          <div className="flex flex-col h-full gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                <FilePlus className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Custom Invoice Generator</h2>
                <p className="text-sm text-gray-400">Create manual invoices by entering invoice details and line items</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="bg-[#181b21] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                <div className="bg-blue-600/10 p-5 border-b border-white/5 flex items-center gap-3">
                   <FileText className="h-4 w-4 text-blue-400" />
                   <h3 className="text-sm font-bold text-white">Generate Invoice</h3>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-white uppercase tracking-wider">Invoice Reference No.</label>
                      <input type="text" value="INV-20260409-ISQCNR" readOnly className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-xs text-gray-400" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-white uppercase tracking-wider">Invoice Date</label>
                      <input type="date" className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-xs text-white outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-white uppercase tracking-wider">Customer Name</label>
                      <input type="text" placeholder="ravi" className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-xs text-white outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-white uppercase tracking-wider">Customer Mobile</label>
                      <input type="text" placeholder="7607238088" className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-xs text-white outline-none" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-[11px] font-bold text-white uppercase tracking-wider">Line Items</label>
                      <button className="flex items-center gap-1.5 px-3 py-1 rounded-lg border border-white/10 bg-white/5 text-[10px] font-bold text-white hover:bg-white/10">
                        <Plus className="h-3 w-3" /> Add Item
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <input type="text" placeholder="8000" className="flex-1 rounded-lg border border-white/10 bg-black/20 px-4 py-2 text-xs text-white outline-none" />
                      <input type="number" placeholder="1" className="w-16 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white outline-none" />
                      <input type="text" placeholder="Price" className="w-24 rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-xs text-white outline-none" />
                      <button className="p-2 text-gray-500 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
                    </div>
                    <p className="text-[10px] text-gray-500">Amount: ₹0.00</p>
                  </div>

                  <div className="flex justify-between items-center py-4 border-t border-white/5">
                    <span className="text-xs font-bold text-white">Total Amount</span>
                    <span className="text-sm font-black text-white tracking-wide">₹0.00</span>
                  </div>

                  <div className="flex gap-2">
                    <button className="flex-1 py-3 rounded-xl bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                      <FileText className="h-4 w-4" /> Generate Invoice
                    </button>
                    <button className="p-3 rounded-xl border border-white/10 bg-white/5 text-gray-400">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <div className="bg-[#181b21] rounded-2xl border border-white/5 overflow-hidden flex flex-col h-full min-h-[500px]">
                  <div className="bg-green-600/10 p-5 border-b border-white/5 flex items-center gap-3">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <h3 className="text-sm font-bold text-white">Invoice Preview</h3>
                  </div>
                  <div className="flex-1 p-6 flex items-center justify-center">
                    <div className="w-full h-full bg-white rounded shadow-2xl p-8 flex flex-col relative text-black">
                       <div className="flex justify-between items-start mb-10">
                          <div className="flex items-center gap-2">
                             <PlayCircle className="h-6 w-6 text-blue-600 fill-current" />
                             <span className="font-black text-xl tracking-tighter uppercase">urbacademy</span>
                          </div>
                          <div className="text-right">
                             <h1 className="text-3xl font-black text-blue-900 tracking-widest uppercase">Invoice</h1>
                          </div>
                       </div>
                       <p className="text-[10px] text-gray-500">UrbAcademy Billing System Preview</p>
                    </div>
                  </div>
                </div>
                <div className="bg-black/40 border border-white/10 p-4 rounded-xl flex flex-col gap-2">
                    <button className="w-full py-2.5 rounded-lg bg-[#22c55e] text-black text-xs font-bold flex items-center justify-center gap-2"><ExternalLink className="h-4 w-4" /> Open in New Tab</button>
                    <button className="w-full py-2.5 rounded-lg border border-white/10 text-white text-xs font-bold flex items-center justify-center gap-2"><Download className="h-4 w-4" /> Download PDF</button>
                </div>
              </div>
            </div>
          </div>
        )

        : activeMenu === 'receipts' ? (
          <div className="flex flex-col h-full gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                <FileCheck className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Custom Receipt Generator</h2>
                <p className="text-sm text-gray-400">Create manual payment receipts by entering payment details</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
              <div className="bg-[#181b21] rounded-2xl border border-white/5 overflow-hidden shadow-xl">
                <div className="bg-green-600/10 p-5 border-b border-white/5 flex items-center gap-3">
                   <FileText className="h-4 w-4 text-green-400" />
                   <h3 className="text-sm font-bold text-white">Generate Receipt</h3>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" value="RCT-20260409-8SJ2B1" readOnly className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-xs text-gray-400" />
                    <input type="text" placeholder="12203002" className="w-full rounded-lg border border-white/10 bg-black/20 px-4 py-2.5 text-xs text-white outline-none" />
                  </div>
                  <button className="w-full py-3 rounded-xl bg-[#22c55e] text-black text-xs font-bold flex items-center justify-center gap-2 transition-colors">
                    <FileText className="h-4 w-4" /> Generate Receipt
                  </button>
                </div>
              </div>
              <div className="bg-[#181b21] rounded-2xl border border-white/5 overflow-hidden flex flex-col h-full min-h-[550px]">
                <div className="bg-blue-600/10 p-5 border-b border-white/5 flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-blue-400" />
                  <h3 className="text-sm font-bold text-white">Receipt Preview</h3>
                </div>
                <div className="flex-1 p-6 flex flex-col items-center justify-center text-center">
                  <FileCheck className="h-8 w-8 text-gray-600 mb-4" />
                  <p className="text-sm text-gray-400 max-w-xs leading-relaxed">Fill details and generate a receipt to preview it here</p>
                </div>
              </div>
            </div>
          </div>
        )

        /* ✅ NEW: Render Documentation Section exactly like screenshot */
        : activeMenu === 'docs' ? (
          <div className="flex flex-col h-full gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                <Folder className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Company Documentations</h2>
                <p className="text-sm text-gray-400">Permanent links for legal and compliance documents</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documentations.map((doc, idx) => (
                <div key={idx} className="bg-[#181b21] rounded-2xl border border-white/5 overflow-hidden flex flex-col hover:border-white/10 transition-all group">
                  <div className="p-4 border-b border-white/5 flex justify-between items-center">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Document</span>
                    <div className="flex gap-2">
                       <span className="bg-white/5 text-gray-400 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">Govt</span>
                       <span className="bg-white/5 text-gray-400 text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">PDF</span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="bg-black/20 rounded-xl p-8 mb-4 aspect-video flex flex-col items-center justify-center text-center gap-3">
                       <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                          <Shield className="h-5 w-5 text-gray-600" />
                       </div>
                       <span className="text-[9px] font-bold text-gray-600 uppercase tracking-tighter leading-none">{doc.logo}</span>
                    </div>
                    
                    <h3 className="text-xs font-bold text-white mb-3 line-clamp-1">{doc.title}</h3>

                    {doc.verification && (
                      <div className="flex items-center gap-1.5 text-green-500 mb-3">
                         <CheckCircle2 className="h-3 w-3" />
                         <span className="text-[9px] font-bold uppercase tracking-tight">{doc.verification}</span>
                      </div>
                    )}

                    <div className="mt-auto space-y-2.5">
                      <div className="bg-black/40 border border-white/5 rounded-lg flex items-center overflow-hidden min-h-[32px]">
                        {doc.id && <span className="pl-3 text-[9px] font-mono text-gray-400 truncate max-w-[120px]">{doc.id}</span>}
                        <button className="ml-auto flex items-center gap-1.5 px-3 py-2 text-[9px] font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-colors border-l border-white/5">
                           <Copy className="h-3 w-3" /> Copy PDF Link
                        </button>
                      </div>
                      
                      <div className="flex gap-2">
                        <button className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-[9px] font-bold hover:bg-white/10 transition-colors">
                          <ExternalLink className="h-3 w-3" /> Open Document
                        </button>
                        <button className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-500 text-[9px] font-bold hover:text-white transition-colors">
                          {doc.hasVerify ? (
                            <><CheckCircle2 className="h-3 w-3" /> Verify</>
                          ) : (
                            <><Globe className="h-3 w-3" /> No Verify Link</>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

        : (
          <div className="flex-1 flex flex-col items-center justify-center p-12 text-center border border-white/5 rounded-2xl bg-[#181b21] border-dashed">
            <h3 className="text-xl font-bold text-white mb-2">Section Ready</h3>
            <p className="text-gray-500">Please select a section from the menu.</p>
          </div>
        )}

      </div>
    </div>
  );
}