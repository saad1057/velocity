import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo, useState } from "react";
import {
  Briefcase,
  CalendarClock,
  LayoutGrid,
  ListChecks,
  MapPin,
  Plus,
  Search,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import JobSpecForm from "@/components/recruitment/JobSpecForm";

const Jobs = () => {
  // Note: this page previously used mock data. We keep it mocked for now,
  // but enhance the UX heavily (search, tabs, dialogs, better visuals).
  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      location: "Remote",
      type: "Full-time",
      applicants: 45,
      status: "Active",
      posted: "2 days ago",
      postedDaysAgo: 2,
    },
    {
      id: 2,
      title: "Backend Engineer",
      location: "New York, NY",
      type: "Full-time",
      applicants: 32,
      status: "Active",
      posted: "1 week ago",
      postedDaysAgo: 7,
    },
    {
      id: 3,
      title: "UI/UX Designer",
      location: "Remote",
      type: "Contract",
      applicants: 28,
      status: "Draft",
      posted: "3 days ago",
      postedDaysAgo: 3,
    },
    {
      id: 4,
      title: "DevOps Engineer",
      location: "San Francisco, CA",
      type: "Full-time",
      applicants: 19,
      status: "Active",
      posted: "5 days ago",
      postedDaysAgo: 5,
    },
  ];

  const { toast } = useToast();
  const [statusTab, setStatusTab] = useState<"all" | "Active" | "Draft">("all");
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "applicants_desc" | "title_asc">("newest");
  const [view, setView] = useState<"cards" | "table">("cards");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [createOpen, setCreateOpen] = useState(false);

  const selectedJob = useMemo(() => {
    if (!selectedJobId) return null;
    return jobs.find((j) => j.id === selectedJobId) || null;
  }, [jobs, selectedJobId]);

  const filteredJobs = useMemo(() => {
    const q = query.trim().toLowerCase();

    const withStatus =
      statusTab === "all" ? jobs : jobs.filter((job) => job.status === statusTab);

    const withQuery =
      q.length === 0
        ? withStatus
        : withStatus.filter((job) => {
            const haystack = `${job.title} ${job.location} ${job.type} ${job.status}`.toLowerCase();
            return haystack.includes(q);
          });

    const sorted = [...withQuery].sort((a, b) => {
      if (sortBy === "newest") return a.postedDaysAgo - b.postedDaysAgo;
      if (sortBy === "applicants_desc") return b.applicants - a.applicants;
      return a.title.localeCompare(b.title);
    });

    return sorted;
  }, [jobs, query, sortBy, statusTab]);

  const openDetails = (jobId: number) => {
    setSelectedJobId(jobId);
    setDetailsOpen(true);
  };

  const applicantPercent = (count: number) => {
    // Convert applicant count to a "momentum" percentage for the progress UI.
    // 50 applicants == 100% (tweakable visual scale).
    return Math.min(100, Math.round((count / 50) * 100));
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-card p-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.18),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(20,184,166,0.14),transparent_40%)]" />
          <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Job Postings</h1>
              <p className="text-muted-foreground">
                Search, review, and manage your recruitment job specifications.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center rounded-lg border bg-background/60 px-1 py-1">
                <Button
                  variant={view === "cards" ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                  onClick={() => setView("cards")}
                >
                  <LayoutGrid className="h-4 w-4" />
                  Cards
                </Button>
                <Button
                  variant={view === "table" ? "default" : "ghost"}
                  size="sm"
                  className="gap-2"
                  onClick={() => setView("table")}
                >
                  <ListChecks className="h-4 w-4" />
                  Table
                </Button>
              </div>

              <Dialog open={createOpen} onOpenChange={setCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-primary hover:bg-primary/90 gap-2">
                    <Plus className="h-4 w-4" />
                    Create Job
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create Job Specification</DialogTitle>
                    <DialogDescription>
                      Fill the form to generate and manage assessments for the role.
                    </DialogDescription>
                  </DialogHeader>
                  <JobSpecForm />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        {/* Controls */}
        <Card className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            <div className="md:col-span-5 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by job title, location, or type..."
                className="pl-10"
              />
            </div>

            <div className="md:col-span-3">
              <Tabs value={statusTab} onValueChange={(v) => setStatusTab(v as any)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="Active">Active</TabsTrigger>
                  <TabsTrigger value="Draft">Draft</TabsTrigger>
                </TabsList>
                <TabsContent value={statusTab} />
              </Tabs>
            </div>

            <div className="md:col-span-3">
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as any)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="applicants_desc">Most applicants</SelectItem>
                  <SelectItem value="title_asc">Title A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="md:col-span-1 flex justify-end sm:hidden">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setView((prev) => (prev === "cards" ? "table" : "cards"))}
                aria-label="Toggle view"
              >
                {view === "cards" ? <LayoutGrid className="h-4 w-4" /> : <ListChecks className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </Card>

        {/* Jobs */}
        {view === "cards" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredJobs.length === 0 ? (
              <Card className="p-10 text-center">
                <p className="text-muted-foreground">No jobs match your search.</p>
              </Card>
            ) : null}

            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                className="p-6 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-primary/10 blur-[2px]" />

                <div className="relative space-y-4">
                  <div className="flex items-start justify-between gap-4">
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
                            <CalendarClock className="h-4 w-4" />
                            {job.posted}
                          </span>
                        </div>
                      </div>
                    </div>

                    <Badge
                      className={
                        job.status === "Active"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {job.status}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Badge variant="outline">{job.type}</Badge>
                    <span className="text-muted-foreground">{job.applicants} applicants</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">Applicant momentum</span>
                      <span className="font-medium text-foreground">{job.applicants} applicants</span>
                    </div>
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300"
                        style={{ width: `${applicantPercent(job.applicants)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => openDetails(job.id)}
                    >
                      View Details
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => {
                        toast({
                          title: "Manage (demo)",
                          description: "Open the details dialog to review this job.",
                        });
                        openDetails(job.id);
                      }}
                    >
                      Manage
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Job</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Location</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Posted</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Applicants</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredJobs.length === 0 ? (
                    <tr>
                      <td className="px-6 py-10 text-center text-muted-foreground" colSpan={6}>
                        No jobs match your search.
                      </td>
                    </tr>
                  ) : null}

                  {filteredJobs.map((job) => (
                    <tr key={job.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 text-foreground font-medium">{job.title}</td>
                      <td className="px-6 py-4 text-muted-foreground">{job.location}</td>
                      <td className="px-6 py-4">
                        <Badge
                          className={
                            job.status === "Active"
                              ? "bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }
                        >
                          {job.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">{job.posted}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-primary font-semibold">{job.applicants}</span>
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${applicantPercent(job.applicants)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDetails(job.id)}
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              toast({
                                title: "Manage (demo)",
                                description: "Open the details dialog to review this job.",
                              });
                              openDetails(job.id);
                            }}
                          >
                            Manage
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="max-w-3xl h-[85vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>{selectedJob?.title || "Job Details"}</DialogTitle>
              <DialogDescription>
                {selectedJob
                  ? `${selectedJob.location} • ${selectedJob.type} • ${selectedJob.applicants} applicants`
                  : "Review the job specification details."}
              </DialogDescription>
            </DialogHeader>

            <ScrollArea className="flex-1 pr-3">
              {selectedJob ? (
                <div className="space-y-6 pb-2">
                  <div className="flex flex-wrap gap-2 items-center">
                    <Badge
                      className={
                        selectedJob.status === "Active"
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      }
                    >
                      {selectedJob.status}
                    </Badge>
                    <Badge variant="outline">{selectedJob.type}</Badge>
                    <Badge variant="outline" className="gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {selectedJob.location}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <CalendarClock className="h-3.5 w-3.5" />
                      {selectedJob.posted}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4 bg-muted/20">
                      <p className="text-sm text-muted-foreground">Applicant count</p>
                      <p className="text-3xl font-bold text-foreground mt-1">{selectedJob.applicants}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        A quick indicator for how many candidates are matching your role.
                      </p>
                    </Card>
                    <Card className="p-4 bg-muted/20">
                      <p className="text-sm text-muted-foreground">Highlights</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge variant="secondary">Recruitment</Badge>
                        <Badge variant="secondary">Assessment</Badge>
                        <Badge variant="secondary">Analytics</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-3">
                        Next step: create an assessment and send it to shortlisted candidates.
                      </p>
                    </Card>
                  </div>

                  <Card className="p-5">
                    <h3 className="font-semibold mb-3">Quick actions</h3>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() =>
                          toast({
                            title: "View Details (demo)",
                            description: "In the next step, wire this dialog to your backend job-spec list.",
                          })
                        }
                      >
                        Open Spec
                      </Button>
                      <Button
                        className="flex-1"
                        onClick={() =>
                          toast({
                            title: "Manage (demo)",
                            description: "Connect this to sending assessments or candidate flow.",
                          })
                        }
                      >
                        Continue to Candidates
                      </Button>
                    </div>
                  </Card>
                </div>
              ) : (
                <p className="text-muted-foreground">No job selected.</p>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Jobs;
