import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Trophy, Users, Calendar, Edit, Trash2 } from "lucide-react";

const Assessments = () => {
  const assessments = [
    {
      id: 1,
      title: "Frontend Developer Assessment",
      candidates: 24,
      date: "2024-01-15",
      status: "Active"
    },
    {
      id: 2,
      title: "Backend Engineer Test",
      candidates: 18,
      date: "2024-01-20",
      status: "Active"
    },
    {
      id: 3,
      title: "Full Stack Developer Quiz",
      candidates: 32,
      date: "2024-01-10",
      status: "Completed"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Assessments</h1>
            <p className="text-muted-foreground">Create and manage candidate assessments</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Assessment
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {assessments.map((assessment) => (
            <Card key={assessment.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">{assessment.title}</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>{assessment.candidates} candidates</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{assessment.date}</span>
                </div>
              </div>
              
              <span
                className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                  assessment.status === "Active"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {assessment.status}
              </span>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Assessments;




