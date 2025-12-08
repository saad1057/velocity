import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Zap, Users, BarChart3, Shield, Bot, FileText } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Bot,
      title: "AI-Powered Matching",
      description: "Intelligent candidate-job matching using advanced machine learning algorithms."
    },
    {
      icon: FileText,
      title: "Resume Parsing",
      description: "Automatically extract and parse information from resumes with high accuracy."
    },
    {
      icon: Users,
      title: "Candidate Management",
      description: "Comprehensive candidate database with advanced search and filtering capabilities."
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Real-time insights and analytics to track your recruitment performance."
    },
    {
      icon: Shield,
      title: "Secure & Compliant",
      description: "Enterprise-grade security with GDPR and data protection compliance."
    },
    {
      icon: Zap,
      title: "Fast Processing",
      description: "Lightning-fast candidate processing and job matching in seconds."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Features</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the powerful features that make Velocity the leading AI recruitment platform
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div key={index} className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
                <div className="mb-4">
                  <Icon className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Features;





