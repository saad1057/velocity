import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Briefcase, MapPin, Clock } from "lucide-react";

const Jobs = () => {
  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      location: "Remote",
      type: "Full-time",
      applicants: 45,
      status: "Active",
      posted: "2 days ago"
    },
    {
      id: 2,
      title: "Backend Engineer",
      location: "New York, NY",
      type: "Full-time",
      applicants: 32,
      status: "Active",
      posted: "1 week ago"
    },
    {
      id: 3,
      title: "UI/UX Designer",
      location: "Remote",
      type: "Contract",
      applicants: 28,
      status: "Draft",
      posted: "3 days ago"
    },
    {
      id: 4,
      title: "DevOps Engineer",
      location: "San Francisco, CA",
      type: "Full-time",
      applicants: 19,
      status: "Active",
      posted: "5 days ago"
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Job Postings</h1>
            <p className="text-muted-foreground">Manage your job specifications</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Job
          </Button>
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <Card key={job.id} className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <Briefcase className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-1">{job.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {job.posted}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Badge className={job.status === "Active" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}>
                    {job.status}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">{job.type}</Badge>
                  <span className="text-muted-foreground">{job.applicants} applicants</span>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">View Details</Button>
                  <Button size="sm" className="flex-1">Manage</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Jobs;
