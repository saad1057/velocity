import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Briefcase, Users, Trophy, BarChart3, Mail, FileText, Bot, Settings, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  
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
    { icon: Bot, label: "AI Assistant", path: "/ai-assistant" },
  ];
  
  const settingsItems = [
    { icon: Settings, label: "Preferences", path: "/preferences" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <aside className="w-64 bg-card border-r border-border min-h-screen p-6">
      <nav className="space-y-8">
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
