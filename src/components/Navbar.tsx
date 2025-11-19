import { Button } from "@/components/ui/button";
import { Menu, X, Zap } from "lucide-react";
import { useState } from "react";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">
              AI Recruit<span className="text-primary">Pro</span>
            </span>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            <a href="#analytics" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Analytics
            </a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Contact
            </a>
          </div>

          <div className="hidden items-center gap-4 md:flex">
            <Button variant="ghost" className="text-foreground">
              Sign In
            </Button>
            <Button className="bg-primary hover:bg-primary-dark text-primary-foreground">
              Get Started
            </Button>
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
              <a href="#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Features
              </a>
              <a href="#analytics" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Analytics
              </a>
              <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
              <a href="#contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </a>
              <div className="flex flex-col gap-2 pt-4">
                <Button variant="ghost" className="w-full justify-start">
                  Sign In
                </Button>
                <Button className="w-full bg-primary hover:bg-primary-dark text-primary-foreground">
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
