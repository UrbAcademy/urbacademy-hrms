import { useState } from "react";
import { Shield, Clock, Lock, Users, AlertTriangle, CheckCircle, FileText } from "lucide-react";

const Rules = () => {
  const [acknowledged, setAcknowledged] = useState(false);

  // Policy Data
  const policies = [
    {
      title: "General Conduct",
      icon: <Users className="h-6 w-6 text-blue-400" />,
      content: "All employees are expected to maintain professionalism. Respect towards colleagues, clients, and partners is mandatory. Harassment of any kind is strictly prohibited.",
      color: "border-blue-500/20 bg-blue-500/10"
    },
    {
      title: "Attendance & Timing",
      icon: <Clock className="h-6 w-6 text-green-400" />,
      content: "Standard work hours are 10:00 AM to 7:00 PM. Login before 10:15 AM is mandatory. Late marks will apply for check-ins after 10:30 AM.",
      color: "border-green-500/20 bg-green-500/10"
    },
    {
      title: "Data Confidentiality",
      icon: <Lock className="h-6 w-6 text-purple-400" />,
      content: "Company data (leads, student details, strategies) must not be shared externally. Usage of personal devices for storing sensitive data is prohibited.",
      color: "border-purple-500/20 bg-purple-500/10"
    },
    {
      title: "Leave Policy",
      icon: <FileText className="h-6 w-6 text-yellow-400" />,
      content: "Leaves must be applied for at least 3 days in advance (except sick leave). Uninformed absence for more than 3 consecutive days will lead to disciplinary action.",
      color: "border-yellow-500/20 bg-yellow-500/10"
    },
    {
      title: "Zero Tolerance",
      icon: <AlertTriangle className="h-6 w-6 text-red-400" />,
      content: "We have zero tolerance for fraud, data theft, or workplace discrimination. Any violation will result in immediate termination.",
      color: "border-red-500/20 bg-red-500/10"
    },
    {
      title: "IT & Security",
      icon: <Shield className="h-6 w-6 text-cyan-400" />,
      content: "Use strong passwords and 2FA. Do not install unauthorized software on company laptops. Report phishing attempts immediately.",
      color: "border-cyan-500/20 bg-cyan-500/10"
    }
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      
      {/* 1. Header */}
      <div className="text-center md:text-left border-b border-white/5 pb-6">
        <h2 className="text-3xl font-bold text-white tracking-tight">Company Policies</h2>
        <p className="text-gray-400 mt-2">Code of Conduct and Guidelines for UrbAcademy Employees.</p>
        <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-800 border border-white/10 text-xs text-gray-400">
          <span>Last Updated: 01 Jan, 2026</span>
          <span className="h-1 w-1 rounded-full bg-gray-500" />
          <span>Version 2.4</span>
        </div>
      </div>

      {/* 2. Policy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {policies.map((policy, index) => (
          <div 
            key={index} 
            className={`p-6 rounded-2xl border ${policy.color} hover:bg-opacity-20 transition-all cursor-default group`}
          >
            <div className="mb-4 bg-[#181b21] w-fit p-3 rounded-xl border border-white/5 group-hover:scale-110 transition-transform">
              {policy.icon}
            </div>
            <h3 className="text-lg font-bold text-white mb-2">{policy.title}</h3>
            <p className="text-sm text-gray-400 leading-relaxed">{policy.content}</p>
          </div>
        ))}
      </div>

      {/* 3. Acknowledgement Section */}
      <div className="bg-[#181b21] border border-white/5 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 mt-8">
        <div>
          <h4 className="text-lg font-bold text-white mb-1">Acknowledgement</h4>
          <p className="text-sm text-gray-400">
            By clicking "I Agree", you confirm that you have read and understood the policies.
          </p>
        </div>

        {!acknowledged ? (
          <button 
            onClick={() => setAcknowledged(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-blue-900/20 transition-all hover:scale-105 flex items-center gap-2 whitespace-nowrap"
          >
            I Agree & Confirm
          </button>
        ) : (
          <div className="bg-green-500/10 border border-green-500/20 text-green-500 px-8 py-3 rounded-xl font-bold flex items-center gap-2 animate-in zoom-in">
            <CheckCircle className="h-5 w-5" /> Agreed on {new Date().toLocaleDateString()}
          </div>
        )}
      </div>

    </div>
  );
};

export default Rules;