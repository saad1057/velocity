import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { Menu, X, Search, LogOut, User, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const getUserInitials = () => {
    if (!user) return "U";
    const first = user.firstname?.[0] || "";
    const last = user.lastname?.[0] || "";
    return (first + last).toUpperCase() || user.email[0].toUpperCase();
  };

  const getUserDisplayName = () => {
    if (!user) return "User";
    if (user.firstname && user.lastname) {
      return `${user.firstname} ${user.lastname}`;
    }
    return user.firstname || user.email;
  };

  const handleLogout = async () => {
    await logout();
  };

  const navLinkClass = (path: string) => {
    const isActive = location.pathname === path;
    return `text-sm font-medium transition-colors ${isActive
        ? "text-primary"
        : "text-muted-foreground hover:text-foreground"
      }`;
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Search className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">
              Velocity
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {!isAuthenticated && (
              <>
                <Link to="/features" className={navLinkClass("/features")}>
                  Features
                </Link>
                <Link to="/how-it-works" className={navLinkClass("/how-it-works")}>
                  How it Works
                </Link>
                <Link to="/pricing" className={navLinkClass("/pricing")}>
                  Pricing
                </Link>
                <Link to="/contact" className={navLinkClass("/contact")}>
                  Contact
                </Link>
              </>
            )}
          </div>

          <div className="hidden items-center gap-4 md:flex">
            {isAuthenticated ? (
              <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-3 h-auto p-2 hover:bg-muted">
                      <Avatar>
                        {user?.picture?.data && typeof user.picture.data === "string" ? (
                          <AvatarImage
                            src={`data:${user.picture.contentType};base64,${user.picture.data}`}
                            alt={getUserDisplayName()}
                          />
                        ) : null}
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm font-medium text-foreground">{getUserDisplayName()}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{getUserDisplayName()}</p>
                        <p className="text-xs text-muted-foreground">{user?.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-foreground">
                    Sign In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button className="bg-primary hover:bg-primary-dark text-primary-foreground">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>

        {isOpen && (
          <div className="border-t border-border py-4 md:hidden animate-fade-in">
            <div className="flex flex-col gap-4">
              {!isAuthenticated && (
                <>
                  <Link to="/features" className={navLinkClass("/features")}>
                    Features
                  </Link>
                  <Link to="/how-it-works" className={navLinkClass("/how-it-works")}>
                    How it Works
                  </Link>
                  <Link to="/pricing" className={navLinkClass("/pricing")}>
                    Pricing
                  </Link>
                  <Link to="/contact" className={navLinkClass("/contact")}>
                    Contact
                  </Link>
                </>
              )}
              <div className="flex flex-col gap-2 pt-4">
                {isAuthenticated ? (
                  <>
                    <Link to="/profile">
                      <Button variant="ghost" className="w-full justify-start">
                        Profile
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-destructive hover:text-destructive"
                      onClick={handleLogout}
                    >
                      Logout
                    </Button>
                  </>
                ) : (
                  <>
                    <Link to="/login">
                      <Button variant="ghost" className="w-full justify-start">
                        Sign In
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button className="w-full bg-primary hover:bg-primary-dark text-primary-foreground">
                        Get Started
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
