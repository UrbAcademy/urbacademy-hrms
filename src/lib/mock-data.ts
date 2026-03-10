export const currentUser = {
  name: "Rahul Sharma",
  role: "Member",
  employeeId: "EDV-2024-0847",
  email: "rahul.sharma@eduveda.com",
  phone: "+91 98765 43210",
  joinDate: "2024-09-15",
  isIntern: true,
  avatar: "",
};

export const motivationalQuotes = [
  "Success is not final, failure is not fatal: it is the courage to continue that counts.",
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "Education is the most powerful weapon which you can use to change the world.",
];

export const revenueOverview = {
  booked: 0,
  credited: 0,
  payments: 0,
};

export const topPerformers = [
  { rank: 1, name: "Priya Patel", booked: 185000, credited: 92000, sales: 18 },
  { rank: 2, name: "Arjun Singh", booked: 156000, credited: 78000, sales: 15 },
  { rank: 3, name: "Sneha Gupta", booked: 142000, credited: 68000, sales: 13 },
  { rank: 4, name: "Vikram Rao", booked: 128000, credited: 61000, sales: 12 },
  { rank: 5, name: "Ananya Joshi", booked: 115000, credited: 55000, sales: 10 },
  { rank: 6, name: "Karan Mehta", booked: 98000, credited: 48000, sales: 9 },
  { rank: 7, name: "Divya Nair", booked: 85000, credited: 42000, sales: 8 },
  { rank: 8, name: "Rahul Sharma", booked: 72000, credited: 35000, sales: 7 },
];

export const teams = [
  {
    name: "Dominator",
    logo: "🔥",
    sales: 28,
    booked: 156000,
    credited: 32000,
    pending: 124000,
    teamLead: "Priya Patel",
    asstLead: "Arjun Singh",
    members: 9,
  },
  {
    name: "Dynamo",
    logo: "⚡",
    sales: 24,
    booked: 134000,
    credited: 28000,
    pending: 106000,
    teamLead: "Sneha Gupta",
    asstLead: "Vikram Rao",
    members: 9,
  },
  {
    name: "Fight Club",
    logo: "💪",
    sales: 22,
    booked: 118000,
    credited: 24000,
    pending: 94000,
    teamLead: "Ananya Joshi",
    asstLead: "Karan Mehta",
    members: 9,
  },
  {
    name: "Mavericks",
    logo: "🚀",
    sales: 20,
    booked: 99000,
    credited: 22000,
    pending: 77000,
    teamLead: "Divya Nair",
    asstLead: "Rohit Kumar",
    members: 9,
  },
];

export const leaveHistory = [
  { date: "2026-02-10", type: "Unpaid", reason: "Personal work", status: "Approved", appliedOn: "2026-02-08" },
  { date: "2026-01-20", type: "Unpaid", reason: "Family function", status: "Approved", appliedOn: "2026-01-17" },
  { date: "2026-01-05", type: "Unpaid", reason: "Medical", status: "Approved", appliedOn: "2026-01-03" },
];

export const attendanceSummary = {
  present: 10,
  halfDay: 1,
  absent: 5,
  rate: 66,
};

export const attendanceCalendar: Record<number, string> = {
  1: "present", 2: "present", 3: "present", 4: "absent", 5: "present",
  6: "late", 7: "present", 8: "absent", 9: "present", 10: "halfday",
  11: "present", 12: "absent", 13: "present", 14: "present", 15: "absent",
  16: "present", 17: "absent", 18: "present", 19: "present",
};

export const salesData = [
  { regId: "REG-001", date: "2026-02-18", bda: "Rahul Sharma", customer: "Amit Kumar", status: "Paid", zoopSign: "Signed", signed: true, paid: 15000, pending: 5000, total: 20000 },
  { regId: "REG-002", date: "2026-02-17", bda: "Rahul Sharma", customer: "Pooja Verma", status: "Pending", zoopSign: "Pending", signed: false, paid: 5000, pending: 15000, total: 20000 },
  { regId: "REG-003", date: "2026-02-15", bda: "Rahul Sharma", customer: "Suresh Patel", status: "Paid", zoopSign: "Signed", signed: true, paid: 20000, pending: 0, total: 20000 },
];

export const caLeads = [
  { name: "Ravi Kumar", email: "ravi@gmail.com", phone: "+91 98765 43211", uploadedAt: "2026-02-18", bda: "Rahul Sharma", status: "Fresh", role: "CA", college: "IIT Delhi", branch: "CSE" },
  { name: "Meena Devi", email: "meena@gmail.com", phone: "+91 98765 43212", uploadedAt: "2026-02-17", bda: "Rahul Sharma", status: "Contacted", role: "CA", college: "NIT Trichy", branch: "ECE" },
  { name: "Ajay Verma", email: "ajay@gmail.com", phone: "+91 98765 43213", uploadedAt: "2026-02-16", bda: "Rahul Sharma", status: "Interested", role: "CA", college: "BITS Pilani", branch: "Mech" },
];

export const waGroups = [
  { type: "CGFL", name: "IIT Delhi CSE 2026", college: "IIT Delhi", bda: "Rahul Sharma", assignedTo: "Rahul Sharma", members: 85, potential: 120, createdAt: "2026-01-15", link: "#" },
  { type: "SGFL", name: "NIT Trichy ECE Group", college: "NIT Trichy", bda: "Rahul Sharma", assignedTo: "Rahul Sharma", members: 62, potential: 90, createdAt: "2026-01-20", link: "#" },
  { type: "CGFL", name: "BITS Pilani Batch 2026", college: "BITS Pilani", bda: "Rahul Sharma", assignedTo: "Rahul Sharma", members: 95, potential: 150, createdAt: "2026-01-10", link: "#" },
];

export const scholarshipBookings = [
  { id: 1, name: "Arun Kumar", email: "arun@gmail.com", phone: "+91 99887 76655", date: "2026-02-18", slot: "10:00 AM", callStatus: "Not set" },
  { id: 2, name: "Swati Mishra", email: "swati@gmail.com", phone: "+91 99887 76656", date: "2026-02-17", slot: "11:00 AM", callStatus: "Not set" },
  { id: 3, name: "Deepak Yadav", email: "deepak@gmail.com", phone: "+91 99887 76657", date: "2026-02-16", slot: "02:00 PM", callStatus: "Not set" },
];

export const rules = [
  { code: "12.07.G", title: "CA Stipends Reimbursement", category: "Campus Ambassador" },
  { code: "12.07.F", title: "Stipend Structure", category: "Campus Ambassador" },
  { code: "12.07.E", title: "Performance Evaluation Criteria", category: "Campus Ambassador" },
  { code: "12.07.D", title: "Attendance Policy", category: "Campus Ambassador" },
  { code: "12.07.C", title: "Leave Policy", category: "Campus Ambassador" },
  { code: "12.07.B", title: "Code of Conduct", category: "Campus Ambassador" },
  { code: "12.07.A", title: "Termination Guidelines", category: "Campus Ambassador" },
];

export const dailyReports = [
  { date: "2026-02-18", caLeadsAssigned: 5, caHired: 2, groups: 3, salesLeads: 4, payments: 1, remarks: "Good day" },
  { date: "2026-02-17", caLeadsAssigned: 8, caHired: 3, groups: 2, salesLeads: 6, payments: 2, remarks: "Productive" },
  { date: "2026-02-16", caLeadsAssigned: 4, caHired: 1, groups: 1, salesLeads: 3, payments: 0, remarks: "Follow ups" },
  { date: "2026-02-15", caLeadsAssigned: 6, caHired: 2, groups: 4, salesLeads: 5, payments: 1, remarks: "Target met" },
];

export const resources = [
  { title: "How to Close a Sale - Complete Guide", date: "2026-02-15", thumbnail: "", type: "video" },
  { title: "Objection Handling Techniques", date: "2026-02-12", thumbnail: "", type: "video" },
  { title: "Product Demo Walkthrough", date: "2026-02-10", thumbnail: "", type: "video" },
  { title: "CA Onboarding Process", date: "2026-02-08", thumbnail: "", type: "video" },
  { title: "Advanced Selling Skills", date: "2026-02-05", thumbnail: "", type: "video" },
  { title: "Customer Relationship Building", date: "2026-02-01", thumbnail: "", type: "video" },
];

export const payrollHistory = [
  { month: "February 2026", netPay: 0, status: "Pending", remarks: "-", proof: "-" },
  { month: "January 2026", netPay: 12500, status: "Paid", remarks: "Incentive included", proof: "Available" },
  { month: "December 2025", netPay: 10000, status: "Paid", remarks: "-", proof: "Available" },
];

export function formatCurrency(amount: number): string {
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(2)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(1)}K`;
  return `₹${amount.toLocaleString("en-IN")}`;
}
