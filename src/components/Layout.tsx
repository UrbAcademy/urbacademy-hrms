import { useState, createContext, useContext, ReactNode, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, IndianRupee, Trophy, Users, CalendarDays, CheckCircle,
  Wallet, UserSearch, TrendingUp, MessageSquare, FileText, ClipboardList,
  BookOpen, GraduationCap, FolderOpen, Ticket, User, ChevronLeft,
  Bell, Moon, Sun, Menu, LogOut, ShieldCheck, UserPlus // 👈 Added UserPlus here
} from "lucide-react";
import { cn } from "@/lib/utils";

type ThemeContextType = { dark: boolean; toggle: () => void };
const ThemeContext = createContext<ThemeContextType>({ dark: true, toggle: () => {} });
export const useTheme = () => useContext(ThemeContext);

const navItems = [
  { label: "Admin Panel", icon: ShieldCheck, path: "/admin", adminOnly: true }, 
  { label: "Add Employee", icon: UserPlus, path: "/add-employee", adminOnly: true }, // 👈 Added this link
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Revenue", icon: IndianRupee, path: "/revenue" },
  { label: "Leaderboard", icon: Trophy, path: "/leaderboard" },
  { label: "Teams", icon: Users, path: "/teams" },
  { label: "Leaves", icon: CalendarDays, path: "/leaves" },
  { label: "Attendance", icon: CheckCircle, path: "/attendance" },
  { label: "Payroll", icon: Wallet, path: "/payroll" },
  { label: "CA Leads", icon: UserSearch, path: "/ca-leads" },
  { label: "Sales Leads", icon: TrendingUp, path: "/sales-leads" },
  { label: "WA Group Update", icon: MessageSquare, path: "/wa-groups" },
  { label: "CA Report", icon: FileText, path: "/ca-report" },
  { label: "Daily Report", icon: ClipboardList, path: "/daily-report" },
  { label: "Rules", icon: BookOpen, path: "/rules" },
  { label: "Scholarship Slots", icon: GraduationCap, path: "/scholarship" },
  { label: "Resources", icon: FolderOpen, path: "/resources", badge: "NEW" },
  { label: "Tickets", icon: Ticket, path: "/tickets" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();

  const userStr = localStorage.getItem("currentUser");
  const user = userStr ? JSON.parse(userStr) : null;
  
  // Robust Admin Detection
  const isAdmin = 
    user?.role === 'admin' || 
    user?.email === 'admin@test.com'; 

  const initials = user?.name 
    ? user.name.split(" ").map((n: string) => n[0]).join("").substring(0, 2).toUpperCase() 
    : "UA";

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    localStorage.removeItem("attendanceStatus");
    localStorage.removeItem("attendanceStartTime");
    navigate("/hr-login");
  };

  const toggle = () => {
    setDark((d) => {
      document.documentElement.classList.toggle("dark", !d);
      return !d;
    });
  };

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const pageTitle = navItems.find((i) => i.path === location.pathname)?.label || "Dashboard";

  return (
    <ThemeContext.Provider value={{ dark, toggle }}>
      <div className="flex h-screen overflow-hidden bg-background">
        {mobileOpen && (
          <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={() => setMobileOpen(false)} />
        )}

        <aside
          className={cn(
            "fixed md:relative z-50 flex h-full flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
            collapsed ? "w-16" : "w-60",
            mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
          )}
        >
          <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
            {!collapsed && (
              <Link to={isAdmin ? "/admin" : "/"} className="text-lg font-bold gradient-text">
                Urb Academy
              </Link>
            )}
            <button onClick={() => { setCollapsed((c) => !c); setMobileOpen(false); }} className="rounded-md p-1 text-sidebar-foreground hover:bg-sidebar-accent">
              <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
            {navItems.map((item) => {
              // Hide admin items from regular users
              if (item.adminOnly && !isAdmin) return null;

              const active = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary font-bold shadow-sm"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    item.adminOnly && "text-blue-400 border border-blue-500/20 bg-blue-500/5 mb-2" 
                  )}
                >
                  <item.icon className={cn("h-4 w-4 shrink-0", item.adminOnly && "text-blue-400")} />
                  {!collapsed && (
                    <span className="truncate">{item.label}</span>
                  )}
                  {!collapsed && item.badge && (
                    <span className="ml-auto rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-primary-foreground">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-sidebar-border p-2 space-y-1">
            <Link
              to="/profile"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                location.pathname === "/profile"
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              )}
            >
              <User className="h-4 w-4 shrink-0" />
              {!collapsed && <span>My Profile</span>}
            </Link>

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              {!collapsed && <span>Sign Out</span>}
            </button>
          </div>
        </aside>

        <div className="flex flex-1 flex-col overflow-hidden">
          <header className="flex h-14 items-center justify-between border-b border-border bg-card/50 backdrop-blur-sm px-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileOpen(true)} className="md:hidden rounded-md p-1 text-foreground hover:bg-accent">
                <Menu className="h-5 w-5" />
              </button>
              <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={toggle} className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              <button className="relative rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-foreground transition-colors">
                <Bell className="h-4 w-4" />
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-destructive" />
              </button>
              
              <Link to="/profile" className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-bold uppercase">
                {initials}
              </Link>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4 md:p-6 animate-fade-in">
            {children}
          </main>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}