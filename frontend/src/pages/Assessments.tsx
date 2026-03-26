import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Trophy, Calendar } from "lucide-react";
import api from "@/lib/api";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Submission {
  id: string;
  candidateName: string;
  candidateEmail: string;
  status: "sent" | "started" | "submitted" | "expired" | "cancelled";
  score: number;
  totalQuestions: number;
  submittedAt: string | null;
  startedAt: string | null;
  jobTitle: string;
  antiCheat: {
    tabSwitchCount: number;
    fullScreenExitCount: number;
    visibilityHiddenCount: number;
    micTrackActive: boolean;
    cameraTrackActive: boolean;
    integrityNotes: string;
  };
}

interface SubmissionQuestionBreakdown {
  index: number;
  question: string;
  options: string[];
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

interface SubmissionDetail extends Submission {
  cancelledAt: string | null;
  cancelledReason: string;
  questionBreakdown: SubmissionQuestionBreakdown[];
}

const Assessments = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<SubmissionDetail | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/assessments/submissions");
      setSubmissions(response?.data?.data || []);
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || "Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissionDetail = async (submissionId: string) => {
    try {
      setDetailOpen(true);
      setDetailLoading(true);
      setDetailError("");
      setSelectedSubmission(null);
      const response = await api.get(`/assessments/submissions/${submissionId}`);
      setSelectedSubmission(response?.data?.data || null);
    } catch (requestError: any) {
      setDetailError(requestError?.response?.data?.message || "Failed to load submission details");
    } finally {
      setDetailLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Assessments</h1>
            <p className="text-muted-foreground">Review sent exams and candidate submissions</p>
          </div>
          <Button variant="outline" onClick={loadSubmissions}>
            Refresh
          </Button>
        </div>

        {loading ? <p className="text-muted-foreground">Loading submissions...</p> : null}
        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        {!loading && submissions.length === 0 ? (
          <p className="text-muted-foreground">No exam submissions yet.</p>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {submissions.map((submission) => (
            <Card key={submission.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <Button variant="outline" size="sm" onClick={() => loadSubmissionDetail(submission.id)}>
                  View Attempt
                </Button>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-1">{submission.jobTitle}</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {submission.candidateName} ({submission.candidateEmail})
              </p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>
                    Score: {submission.score}/{submission.totalQuestions}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{submission.submittedAt ? new Date(submission.submittedAt).toLocaleString() : "Not submitted"}</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Focus exits: {submission.antiCheat?.tabSwitchCount || 0}, hidden events: {submission.antiCheat?.visibilityHiddenCount || 0}, fullscreen exits: {submission.antiCheat?.fullScreenExitCount || 0}
                </p>
              </div>
              
              <span
                className={`inline-block px-2 py-1 text-xs font-medium rounded ${
                  submission.status === "submitted"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {submission.status}
              </span>
            </Card>
          ))}
        </div>

        <Dialog open={detailOpen} onOpenChange={setDetailOpen}>
          <DialogContent className="max-w-5xl h-[90vh]">
            <DialogHeader>
              <DialogTitle>
                {selectedSubmission?.jobTitle || "Assessment Attempt"}
              </DialogTitle>
              <DialogDescription>
                {selectedSubmission
                  ? `${selectedSubmission.candidateName} (${selectedSubmission.candidateEmail}) - Score ${selectedSubmission.score}/${selectedSubmission.totalQuestions}`
                  : "Review candidate selected answers against correct options."}
              </DialogDescription>
            </DialogHeader>

            {detailLoading ? <p className="text-sm text-muted-foreground">Loading attempt details...</p> : null}
            {detailError ? <p className="text-sm text-red-500">{detailError}</p> : null}

            {!detailLoading && !detailError && selectedSubmission ? (
              <ScrollArea className="h-full pr-3">
                <div className="space-y-4 pb-4">
                  {selectedSubmission.questionBreakdown.map((item) => (
                    <div key={`${item.index}-${item.question}`} className="rounded-md border p-4">
                      <p className="font-medium mb-1">Q{item.index + 1}. {item.question}</p>
                      <p className="text-xs text-muted-foreground mb-3 uppercase">Difficulty: {item.difficulty}</p>

                      <div className="space-y-2 mb-3">
                        {item.options.map((option, optionIndex) => {
                          const letter = String.fromCharCode(65 + optionIndex);
                          const isSelected = item.selectedAnswer === letter;
                          const isCorrect = item.correctAnswer === letter;

                          const optionClass = isCorrect
                            ? "border-green-500 bg-green-50"
                            : isSelected && !isCorrect
                              ? "border-red-500 bg-red-50"
                              : "";

                          return (
                            <div key={`${item.index}-${letter}`} className={`rounded border p-2 text-sm ${optionClass}`.trim()}>
                              {option}
                            </div>
                          );
                        })}
                      </div>

                      <div className="text-sm space-y-1">
                        <p>Candidate selected: <span className="font-medium">{item.selectedAnswer || "No answer"}</span></p>
                        <p>Correct answer: <span className="font-medium">{item.correctAnswer}</span></p>
                        <p className={item.isCorrect ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                          {item.isCorrect ? "Correct" : "Incorrect"}
                        </p>
                        <p className="text-muted-foreground">Explanation: {item.explanation}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : null}
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default Assessments;











