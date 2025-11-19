import { Zap } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t border-border bg-muted/30 py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">
                AI Recruit<span className="text-primary">Pro</span>
              </span>
            </div>
            <p className="mb-4 max-w-md text-sm text-muted-foreground">
              Transform your recruitment process with cutting-edge AI technology. 
              Faster hiring, better matches, and data-driven insights.
            </p>
            <p className="text-xs text-muted-foreground">
              © 2024 AI RecruitPro. All rights reserved.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Features</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Pricing</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Security</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Integrations</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-semibold text-foreground">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">About</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Blog</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Careers</a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">Contact</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};
