import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-secondary/5 to-transparent" />
      
      <div className="container relative z-10 mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary animate-fade-in">
            <Sparkles className="h-4 w-4" />
            <span>AI-Powered Recruitment Platform</span>
          </div>
          
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl animate-fade-in-up">
            Transform Your Hiring Process with{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Artificial Intelligence
            </span>
          </h1>
          
          <p className="mb-10 text-lg text-muted-foreground md:text-xl animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            Streamline recruitment with intelligent candidate sourcing, automated resume parsing, 
            dynamic assessments, and real-time analytics—all powered by cutting-edge AI technology.
          </p>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <Button size="lg" className="group bg-primary hover:bg-primary-dark text-primary-foreground">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/5 hover:border-primary/40">
              Watch Demo
            </Button>
          </div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  );
};
