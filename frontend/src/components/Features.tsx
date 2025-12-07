import { 
  Brain, 
  FileSearch, 
  Filter, 
  ClipboardCheck, 
  Mail, 
  BarChart3, 
  Shield, 
  Activity 
} from "lucide-react";
import { FeatureCard } from "./FeatureCard";

const features = [
  {
    icon: Brain,
    title: "AI Candidate Sourcing",
    description: "Leverage advanced AI algorithms to discover and attract top talent from multiple channels automatically.",
  },
  {
    icon: FileSearch,
    title: "Intelligent Resume Parsing",
    description: "Extract and structure candidate information with high accuracy using natural language processing.",
  },
  {
    icon: Filter,
    title: "AI-Based Filtering & Ranking",
    description: "Automatically filter and rank candidates based on job requirements and predictive success metrics.",
  },
  {
    icon: ClipboardCheck,
    title: "Dynamic Test Generation",
    description: "Create customized assessments tailored to specific roles using intelligent question generation.",
  },
  {
    icon: Mail,
    title: "Automated Email Communication",
    description: "Send personalized, timely communications to candidates throughout the recruitment journey.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Gain actionable insights with comprehensive metrics and visualization of your recruitment pipeline.",
  },
  {
    icon: Shield,
    title: "JWT-Based Authentication",
    description: "Enterprise-grade security with token-based authentication and role-based access control.",
  },
  {
    icon: Activity,
    title: "Real-Time Tracking",
    description: "Monitor candidate progress and recruitment stages with live updates and notifications.",
  },
];

export const Features = () => {
  return (
    <section className="py-20 md:py-32 bg-background">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center mb-16 animate-fade-in">
          <h2 className="mb-4 text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Comprehensive AI Recruitment Suite
          </h2>
          <p className="text-lg text-muted-foreground">
            Everything you need to revolutionize your hiring process, powered by cutting-edge artificial intelligence.
          </p>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {features.map((feature, index) => (
            <FeatureCard
              key={feature.title}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 100}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
