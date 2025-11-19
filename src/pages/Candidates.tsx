import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Plus } from "lucide-react";

const Candidates = () => {
  const candidates = [
    { id: 1, name: "John Smith", position: "Senior Frontend Developer", status: "Shortlisted", score: 92 },
    { id: 2, name: "Sarah Johnson", position: "Backend Engineer", status: "Assessed", score: 88 },
    { id: 3, name: "Michael Brown", position: "Full Stack Developer", status: "New", score: 85 },
    { id: 4, name: "Emily Davis", position: "UI/UX Designer", status: "Interview", score: 90 },
    { id: 5, name: "David Wilson", position: "DevOps Engineer", status: "Shortlisted", score: 87 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Shortlisted": return "bg-primary/10 text-primary";
      case "Assessed": return "bg-secondary/10 text-secondary";
      case "Interview": return "bg-accent/10 text-accent";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Candidates</h1>
            <p className="text-muted-foreground">Manage and review all candidates</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Candidate
          </Button>
        </div>

        {/* Search and Filter */}
        <Card className="p-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search candidates..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </Card>

        {/* Candidates Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Position</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Match Score</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {candidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-foreground font-medium">{candidate.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{candidate.position}</td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(candidate.status)}>
                        {candidate.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="text-primary font-semibold">{candidate.score}%</span>
                        <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full" 
                            style={{ width: `${candidate.score}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Button variant="outline" size="sm">View Details</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Candidates;
