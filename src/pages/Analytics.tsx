import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { TrendingUp, Users, Target, Award } from "lucide-react";

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Detailed recruitment analytics and insights</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm text-green-500 font-medium">+12.5%</span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">1,247</p>
            <p className="text-muted-foreground text-sm">Total Applications</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-secondary/10 to-secondary/5">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-secondary/20 rounded-lg">
                <Users className="h-6 w-6 text-secondary" />
              </div>
              <span className="text-sm text-green-500 font-medium">+8.2%</span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">247</p>
            <p className="text-muted-foreground text-sm">Active Candidates</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-accent/10 to-accent/5">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-accent/20 rounded-lg">
                <Target className="h-6 w-6 text-accent" />
              </div>
              <span className="text-sm text-green-500 font-medium">+15.3%</span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">23</p>
            <p className="text-muted-foreground text-sm">Shortlisted</p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/5">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-primary/20 rounded-lg">
                <Award className="h-6 w-6 text-primary" />
              </div>
              <span className="text-sm text-green-500 font-medium">+5.7%</span>
            </div>
            <p className="text-3xl font-bold text-foreground mb-1">92%</p>
            <p className="text-muted-foreground text-sm">Match Score Avg</p>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Candidate Pipeline</h3>
            <div className="space-y-4">
              {[
                { stage: "Applied", count: 247, percentage: 100 },
                { stage: "Screened", count: 156, percentage: 63 },
                { stage: "Assessed", count: 89, percentage: 36 },
                { stage: "Interviewed", count: 45, percentage: 18 },
                { stage: "Shortlisted", count: 23, percentage: 9 },
              ].map((item) => (
                <div key={item.stage}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground font-medium">{item.stage}</span>
                    <span className="text-sm text-muted-foreground">{item.count} candidates</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500" 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Top Performing Jobs</h3>
            <div className="space-y-4">
              {[
                { title: "Senior Frontend Developer", applicants: 87, quality: 92 },
                { title: "Backend Engineer", applicants: 65, quality: 88 },
                { title: "Full Stack Developer", applicants: 54, quality: 85 },
                { title: "UI/UX Designer", applicants: 41, quality: 90 },
              ].map((job, index) => (
                <div key={index} className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground">{job.title}</span>
                    <span className="text-sm text-primary font-semibold">{job.quality}% quality</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{job.applicants} applicants</div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Additional Insights */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Real-time Analytics Dashboard</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <p className="text-4xl font-bold text-primary mb-2">4.2</p>
              <p className="text-muted-foreground">Avg. Days to Hire</p>
            </div>
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <p className="text-4xl font-bold text-secondary mb-2">78%</p>
              <p className="text-muted-foreground">Offer Acceptance Rate</p>
            </div>
            <div className="text-center p-6 bg-muted/30 rounded-lg">
              <p className="text-4xl font-bold text-accent mb-2">$2.4k</p>
              <p className="text-muted-foreground">Cost per Hire</p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
