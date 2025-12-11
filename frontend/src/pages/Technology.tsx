import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Brain, Database, Shield, Zap } from "lucide-react";

const Technology = () => {
  const technologies = [
    {
      icon: Brain,
      title: "Machine Learning",
      description: "Advanced ML algorithms for intelligent candidate matching and ranking."
    },
    {
      icon: Database,
      title: "Big Data Processing",
      description: "Efficient processing of large candidate databases with real-time updates."
    },
    {
      icon: Shield,
      title: "Security & Privacy",
      description: "End-to-end encryption and secure data handling with compliance standards."
    },
    {
      icon: Zap,
      title: "Cloud Infrastructure",
      description: "Scalable cloud-based architecture for high performance and reliability."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">Technology</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Built with cutting-edge technology to deliver the best recruitment experience
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {technologies.map((tech, index) => {
            const Icon = tech.icon;
            return (
              <div key={index} className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow text-center">
                <div className="mb-4 flex justify-center">
                  <Icon className="h-12 w-12 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{tech.title}</h3>
                <p className="text-muted-foreground">{tech.description}</p>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Technology;








