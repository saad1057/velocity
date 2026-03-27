import { useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Briefcase, Users, Trophy, BarChart3, Mail, FileText, Bot, Settings, User, LogOut, ShieldCheck, ClipboardList } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { logout, user } = useAuth();
  const sidebarRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    const savedPos = sessionStorage.getItem("sidebarScroll");
    if (savedPos && sidebarRef.current) {
      sidebarRef.current.scrollTop = parseInt(savedPos, 10);
    }
    
    const handleScroll = () => {
      if (sidebarRef.current) {
        sessionStorage.setItem("sidebarScroll", sidebarRef.current.scrollTop.toString());
      }
    };
    
    const currentRef = sidebarRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }
    
    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);
  
  const isActive = (path: string) => location.pathname === path;
  
  const handleLogout = async () => {
    await logout();
  };
  
  const mainMenuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Briefcase, label: "Job Specifications", path: "/jobs" },
    { icon: Users, label: "Candidates", path: "/candidates" },
    { icon: Trophy, label: "Assessments", path: "/assessments" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
  ];
  
  const toolsItems = [
    { icon: Mail, label: "Email Templates", path: "/email-templates" },
    { icon: FileText, label: "Resume Parser", path: "/resume-parser" },
  ];
  
  const settingsItems = [
    { icon: Settings, label: "Preferences", path: "/preferences" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  const adminMenuItems = [
    { icon: ShieldCheck, label: "Admin Dashboard", path: "/admin/dashboard" },
    { icon: Users, label: "Manage Recruiters", path: "/admin/recruiters" },
    { icon: ClipboardList, label: "Activity Logs", path: "/admin/activity" },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-6 overflow-y-auto" ref={sidebarRef}>
      <nav className="space-y-8">
        {/* Admin Section (Conditional) */}
        {user?.role === 'admin' && (
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2 flex items-center gap-2">
              <ShieldCheck className="h-3 w-3 text-indigo-500" /> Administrative
            </h3>
            {adminMenuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? "bg-indigo-500/10 text-indigo-600"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
            <div className="h-px bg-border mx-4 my-4" />
          </div>
        )}

        {/* Main Menu */}
        <div className="space-y-2">
          {mainMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Tools Section */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
            Tools
          </h3>
          {toolsItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </div>

        {/* Settings Section */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 mb-2">
            Settings
          </h3>
          {settingsItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-muted-foreground hover:bg-muted hover:text-foreground w-full text-left"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
