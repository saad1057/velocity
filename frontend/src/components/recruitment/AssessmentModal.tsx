import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export interface AssessmentQuestion {
  question: string;
  options: string[];
  answer: string;
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

export interface AssessmentData {
  _id?: string;
  jobTitle: string;
  questions: AssessmentQuestion[];
  generatedAt: string;
  totalQuestions: number;
}

interface AssessmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assessment: AssessmentData | null;
  loading: boolean;
  error: string;
  onRetry: () => void;
  onSendExam: (candidateEmail: string, candidateName: string) => Promise<string | null>;
  onCreateExamLink: (candidateEmail: string, candidateName: string) => Promise<string | null>;
}

const getOptionLetter = (option: string, index: number) => {
  const trimmed = option.trim();
  if (/^[A-D][\.)\-:]/i.test(trimmed)) {
    return trimmed.charAt(0).toUpperCase();
  }

  return String.fromCharCode(65 + index);
};

const AssessmentModal = ({
  open,
  onOpenChange,
  assessment,
  loading,
  error,
  onRetry,
  onSendExam,
  onCreateExamLink,
}: AssessmentModalProps) => {
  const { toast } = useToast();
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [candidateEmail, setCandidateEmail] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [sendingEmail, setSendingEmail] = useState(false);
  const [creatingLink, setCreatingLink] = useState(false);
  const [generatedExamLink, setGeneratedExamLink] = useState("");

  useEffect(() => {
    if (open) {
      setAnswers({});
      setSubmitted(false);
      setCandidateEmail("");
      setCandidateName("");
      setSendingEmail(false);
      setCreatingLink(false);
      setGeneratedExamLink("");
    }
  }, [open, assessment?._id]);

  const score = useMemo(() => {
    if (!assessment || !submitted) {
      return 0;
    }

    return assessment.questions.reduce((total, question, index) => {
      return answers[index] === question.answer ? total + 1 : total;
    }, 0);
  }, [assessment, answers, submitted]);

  const handleCopyLink = async () => {
    const link = assessment?._id
      ? `${window.location.origin}/dashboard?assessment=${assessment._id}`
      : `${window.location.origin}/dashboard`;

    try {
      await navigator.clipboard.writeText(link);
      toast({
        title: "Assessment link copied",
        description: "You can now share this link (placeholder for SendGrid flow).",
      });
    } catch {
      toast({
        title: "Unable to copy",
        description: "Please copy the URL manually from the browser.",
      });
    }
  };

  const handleSendExam = async () => {
    if (!candidateEmail.trim()) {
      toast({
        title: "Candidate email required",
        description: "Enter candidate email to send the exam link.",
      });
      return;
    }

    try {
      setSendingEmail(true);
      const examLink = await onSendExam(candidateEmail.trim(), candidateName.trim());
      if (examLink) {
        setGeneratedExamLink(examLink);
        toast({
          title: "Exam sent",
          description: `Invitation sent to ${candidateEmail.trim()}`,
        });
      }
    } finally {
      setSendingEmail(false);
    }
  };

  const handleCreateExamLink = async () => {
    if (!candidateEmail.trim()) {
      toast({
        title: "Candidate email required",
        description: "Enter your email (or candidate email) to create a test link.",
      });
      return;
    }

    try {
      setCreatingLink(true);
      const examLink = await onCreateExamLink(candidateEmail.trim(), candidateName.trim());
      if (examLink) {
        setGeneratedExamLink(examLink);
        toast({
          title: "Exam link created",
          description: "Open this link in a new tab to take the test.",
        });
      }
    } finally {
      setCreatingLink(false);
    }
  };

  const openGeneratedExamLink = () => {
    if (!generatedExamLink) {
      return;
    }

    window.open(generatedExamLink, "_blank", "noopener,noreferrer");
  };

  const copyGeneratedExamLink = async () => {
    if (!generatedExamLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(generatedExamLink);
      toast({
        title: "Exam link copied",
        description: "You can now open it as a candidate.",
      });
    } catch {
      toast({
        title: "Unable to copy",
        description: "Please copy the link manually.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh]">
        <DialogHeader>
          <DialogTitle>
            {assessment?.jobTitle || "Assessment"} {assessment ? "- 40 Questions Generated" : ""}
          </DialogTitle>
          <DialogDescription>
            {submitted && assessment
              ? `${score} / ${assessment.questions.length} correct`
              : "Answer all questions and submit to view score and explanations."}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex h-full flex-col items-center justify-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            <p className="text-sm text-muted-foreground">Generating assessment with AI...</p>
          </div>
        ) : null}

        {!loading && error ? (
          <div className="flex h-full flex-col items-center justify-center gap-4">
            <p className="text-sm text-red-500">{error}</p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Back to Results
              </Button>
              <Button onClick={onRetry}>Retry</Button>
            </div>
          </div>
        ) : null}

        {!loading && !error && assessment ? (
          <>
            <div className="grid grid-cols-1 gap-3 rounded-md border p-3 md:grid-cols-3">
              <div className="space-y-1">
                <Label htmlFor="candidateName">Candidate Name</Label>
                <Input
                  id="candidateName"
                  value={candidateName}
                  onChange={(event) => setCandidateName(event.target.value)}
                  placeholder="Jane Doe"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <Label htmlFor="candidateEmail">Candidate Email</Label>
                <div className="flex gap-2">
                  <Input
                    id="candidateEmail"
                    value={candidateEmail}
                    onChange={(event) => setCandidateEmail(event.target.value)}
                    placeholder="candidate@email.com"
                  />
                  <Button onClick={handleSendExam} disabled={sendingEmail}>
                    {sendingEmail ? "Sending..." : "Send Exam Email"}
                  </Button>
                  <Button variant="outline" onClick={handleCreateExamLink} disabled={creatingLink}>
                    {creatingLink ? "Creating..." : "Create Test Link"}
                  </Button>
                </div>
              </div>
            </div>

            {generatedExamLink ? (
              <div className="space-y-2 rounded-md border p-3">
                <Label htmlFor="generatedExamLink">Generated Test Link</Label>
                <Input id="generatedExamLink" value={generatedExamLink} readOnly />
                <div className="flex gap-2">
                  <Button variant="outline" onClick={copyGeneratedExamLink}>Copy Link</Button>
                  <Button onClick={openGeneratedExamLink}>Open Link</Button>
                </div>
              </div>
            ) : null}

            <ScrollArea className="h-full pr-3">
              <div className="space-y-4 pb-4">
                {assessment.questions.map((question, index) => {
                  const selectedAnswer = answers[index];
                  const correctAnswer = question.answer;

                  return (
                    <Card key={`${question.question}-${index}`}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                          Q{index + 1}. {question.question}
                        </CardTitle>
                        <p className="text-xs uppercase text-muted-foreground">Difficulty: {question.difficulty}</p>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <RadioGroup
                          value={selectedAnswer || ""}
                          onValueChange={(value) => setAnswers((prev) => ({ ...prev, [index]: value }))}
                          disabled={submitted}
                        >
                          {question.options.map((option, optionIndex) => {
                            const letter = getOptionLetter(option, optionIndex);
                            const isCorrect = letter === correctAnswer;
                            const isSelected = selectedAnswer === letter;

                            const optionClass = submitted
                              ? isCorrect
                                ? "border-green-500 bg-green-50"
                                : isSelected && !isCorrect
                                  ? "border-red-500 bg-red-50"
                                  : ""
                              : "";

                            return (
                              <div
                                key={`${letter}-${option}`}
                                className={`flex items-center gap-3 rounded-md border p-3 ${optionClass}`.trim()}
                              >
                                <RadioGroupItem value={letter} id={`q-${index}-${letter}`} />
                                <Label htmlFor={`q-${index}-${letter}`} className="w-full cursor-pointer">
                                  {option}
                                </Label>
                              </div>
                            );
                          })}
                        </RadioGroup>

                        {submitted ? <p className="text-sm text-muted-foreground">{question.explanation}</p> : null}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>

            <div className="flex flex-wrap justify-end gap-2 border-t pt-4">
              {!submitted ? (
                <Button onClick={() => setSubmitted(true)}>
                  Submit Assessment
                </Button>
              ) : null}
              <Button variant="outline" onClick={handleCopyLink}>
                Copy Assessment Link
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Back to Results
              </Button>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default AssessmentModal;
