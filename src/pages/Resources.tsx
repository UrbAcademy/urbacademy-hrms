import { FileText, Download, PlayCircle, Link as LinkIcon, Folder, Shield } from "lucide-react";

// Mock Resource Data
const resources = [
  {
    category: "Onboarding 🚀",
    items: [
      { id: 1, title: "Offer Letter", type: "PDF", size: "1.2 MB", date: "15 Sep, 2024" },
      { id: 2, title: "Company Handbook", type: "PDF", size: "4.5 MB", date: "01 Jan, 2024" },
      { id: 3, title: "Internship Guidelines", type: "PDF", size: "800 KB", date: "10 Sep, 2024" },
    ]
  },
  {
    category: "Training Modules 🎓",
    items: [
      { id: 4, title: "Sales Pitch Script", type: "DOC", size: "45 KB", date: "Updated Yesterday" },
      { id: 5, title: "Handling Objections", type: "Video", size: "15 Min", date: "Recorded Session" },
      { id: 6, title: "CRM Tutorial", type: "Link", size: "External", date: "Loom Video" },
    ]
  },
  {
    category: "Legal & Policies ⚖️",
    items: [
      { id: 7, title: "Non-Disclosure Agreement", type: "PDF", size: "2.1 MB", date: "Signed" },
      { id: 8, title: "Leave Policy", type: "PDF", size: "1.5 MB", date: "2024 Revised" },
    ]
  }
];

const Resources = () => {
  
  const getIcon = (type: string) => {
    if (type === "Video") return <PlayCircle className="h-6 w-6 text-red-500" />;
    if (type === "Link") return <LinkIcon className="h-6 w-6 text-blue-500" />;
    return <FileText className="h-6 w-6 text-orange-500" />;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* Header */}
      <div>
        <h2 className="text-3xl font-bold text-white tracking-tight">Resources & Docs</h2>
        <p className="text-gray-400 mt-1">Access all your official documents and training materials.</p>
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 gap-8">
        {resources.map((section) => (
          <div key={section.category} className="space-y-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Folder className="h-5 w-5 text-gray-500" /> {section.category}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {section.items.map((item) => (
                <div 
                  key={item.id} 
                  className="group bg-[#181b21] border border-white/5 hover:border-blue-500/30 p-4 rounded-xl transition-all hover:-translate-y-1 cursor-pointer flex justify-between items-start"
                >
                  <div className="flex gap-4">
                    <div className="bg-white/5 p-3 rounded-lg group-hover:bg-blue-500/10 transition-colors">
                      {getIcon(item.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-white group-hover:text-blue-400 transition-colors">{item.title}</h4>
                      <p className="text-xs text-gray-500 mt-1">{item.type} • {item.size}</p>
                      <p className="text-[10px] text-gray-600 mt-0.5">{item.date}</p>
                    </div>
                  </div>
                  
                  <button className="text-gray-500 hover:text-white transition-colors">
                    <Download className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Pro Tip Footer */}
      <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-4 flex gap-4 items-start max-w-2xl">
        <Shield className="h-6 w-6 text-blue-400 flex-shrink-0 mt-0.5" />
        <div>
           <h4 className="text-sm font-bold text-blue-100">Confidentiality Notice</h4>
           <p className="text-xs text-blue-200/60 mt-1 leading-relaxed">
             All documents listed here are property of UrbAcademy. Sharing internal training material or sales scripts with outsiders is a violation of your NDA.
           </p>
        </div>
      </div>

    </div>
  );
};

export default Resources;