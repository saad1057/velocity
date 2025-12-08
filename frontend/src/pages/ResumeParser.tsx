import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UploadCloud, FileText, Loader2, Download } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const positionOptions = [
  "Software Engineer",
  "Data Scientist",
  "Product Manager",
  "Designer",
  "Sales",
];

type ParsedResult = Record<string, unknown> | null;

const ResumeParser = () => {
  const [file, setFile] = useState<File | null>(null);
  const [position, setPosition] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ParsedResult>(null);

  const downloadResult = () => {
    if (!result) return;
    const filename = (file?.name || "resume").replace(/\.[^.]+$/, "");
    const blob = new Blob([JSON.stringify(result, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${filename}-parsed.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const toBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = reader.result as string;
        const base64 = dataUrl.split(",")[1] || "";
        resolve(base64);
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });

  const handleSubmit = async () => {
    setError(null);
    setResult(null);

    if (!file) {
      setError("Please upload a resume (PDF or DOCX).");
      return;
    }

    setLoading(true);
    try {
      const documentBase64 = await toBase64(file);
      const response = await fetch(`${API_URL}/api/resume/parse`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentBase64,
          fileName: file.name,
          position,
          description,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.message || "Failed to parse resume");
      }

      const data = await response.json();
      setResult(data.data || data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Upload Resume</h1>
          <p className="text-muted-foreground mt-1">
            Upload a candidate resume and test the parsing pipeline.
          </p>
        </div>

        <Card className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 bg-card/70">
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-1">Job Description</h2>
              <p className="text-sm text-muted-foreground">
                Add context to improve downstream matching.
              </p>
            </div>

            <Select value={position} onValueChange={setPosition}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Position" />
              </SelectTrigger>
              <SelectContent>
                {positionOptions.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Description</label>
              <Textarea
                placeholder="Paste a short job description to help the parser context (optional)"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full lg:w-auto"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Parsing...
                </div>
              ) : (
                "Submit"
              )}
            </Button>

            {error && (
              <div className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-md p-3">
                {error}
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-center bg-muted/30">
              <div className="p-4 bg-primary/10 rounded-full mb-3">
                <UploadCloud className="h-8 w-8 text-primary" />
              </div>
              <p className="font-semibold text-foreground">Drag or upload resume</p>
              <p className="text-sm text-muted-foreground mb-4">PDF or DOCX up to ~5MB</p>
              <Input
                type="file"
                accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              {file && (
                <div className="flex items-center gap-2 mt-3 text-sm text-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{file.name}</span>
                </div>
              )}
            </div>
          </div>
        </Card>

        {result && (
          <Card className="p-4 bg-card border-border">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">Parsed Result</h3>
            </div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Preview (JSON)</p>
              <Button variant="outline" size="sm" onClick={downloadResult} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download JSON
              </Button>
            </div>
            <pre className="text-sm text-foreground bg-muted/50 rounded-lg p-3 overflow-auto max-h-96">
              {JSON.stringify(result, null, 2)}
            </pre>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ResumeParser;

