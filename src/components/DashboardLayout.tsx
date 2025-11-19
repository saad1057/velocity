import { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Search, Bell } from "lucide-react";
import Sidebar from "./Sidebar";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navbar */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Search className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">VELOCITY</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              How it Works
            </Link>
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Technology
            </Link>
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell className="h-5 w-5 text-accent" />
            </button>
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">SJ</AvatarFallback>
              </Avatar>
              <span className="text-foreground font-medium">Sarah Johnson</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
