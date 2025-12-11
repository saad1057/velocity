import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Upload, Search, CheckCircle, Users } from "lucide-react";

const HowItWorks = () => {
  const steps = [
    {
      icon: Upload,
      title: "Post Your Job",
      description: "Create a detailed job specification with requirements and qualifications."
    },
    {
      icon: Search,
      title: "AI Matching",
      description: "Our AI analyzes candidates and matches them to your job requirements."
    },
    {
      icon: CheckCircle,
      title: "Review Matches",
      description: "Review and filter the top-matched candidates with detailed insights."
    },
    {
      icon: Users,
      title: "Hire the Best",
      description: "Connect with candidates and make data-driven hiring decisions."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">How It Works</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Simple, efficient, and powerful recruitment process powered by AI
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-4 rounded-full bg-primary/10">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <div className="mb-2 text-2xl font-bold text-primary">{index + 1}</div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HowItWorks;








