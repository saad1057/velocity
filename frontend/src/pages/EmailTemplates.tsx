import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Mail, Edit, Trash2, Copy } from "lucide-react";
import api from "@/lib/api";

type EmailTemplate = {
  _id: string;
  name: string;
  subject: string;
  category: string;
  body?: string;
};

const CATEGORY_OPTIONS = ["Interview", "Rejection", "Offer", "Acceptance", "Follow-up"];

const buildFormalTemplateBody = (category: string, subject: string) => {
  const safeSubject = subject.trim() || "this opportunity";
  const lowerCategory = category.toLowerCase();

  if (lowerCategory.includes("offer")) {
    return `Dear [Candidate Name],

I hope you are doing well.

Following our recent discussions, I am pleased to extend an offer for the [Job Title] position at [Company Name]. Please find the key details of this offer attached/included for your review.

Kindly review the offer and let us know if you have any questions. We would appreciate your response by [Response Date].

We are excited about the possibility of you joining our team.

Sincerely,
[Your Name]
[Your Role]
[Company Name]`;
  }

  if (lowerCategory.includes("rejection")) {
    return `Dear [Candidate Name],

Thank you for your interest in the [Job Title] position at [Company Name], and for taking the time to participate in our process.

After careful consideration, we have decided to move forward with another candidate whose profile is currently a closer fit for this role.

We appreciate your time and effort, and we encourage you to apply for future opportunities that align with your experience.

We wish you every success in your job search.

Sincerely,
[Your Name]
[Your Role]
[Company Name]`;
  }

  if (lowerCategory.includes("interview")) {
    return `Dear [Candidate Name],

Thank you for your application for the [Job Title] role at [Company Name].

We would like to invite you to an interview to discuss your background and experience in more detail.

Please let us know your availability for the following time slots:
- [Option 1]
- [Option 2]
- [Option 3]

If these options are not suitable, feel free to suggest an alternative.

We look forward to speaking with you.

Sincerely,
[Your Name]
[Your Role]
[Company Name]`;
  }

  if (lowerCategory.includes("accept")) {
    return `Dear [Hiring Manager Name],

I hope you are doing well.

I am writing to formally accept the offer for the [Job Title] position at [Company Name].

I confirm my intent to join the company and I look forward to contributing to the team.

Please let me know the next steps required to complete the onboarding process. I will be ready to begin on [Start Date] (or as otherwise confirmed).

Thank you once again for this opportunity.

Sincerely,
[Your Name]
[Your Role]
[Company Name]`;
  }

  if (lowerCategory.includes("follow")) {
    return `Dear [Candidate Name],

I hope you are doing well.

I am following up regarding the [Job Title] application and the next steps in the process.

If there is any additional information you need from me, I would be happy to provide it.

Thank you for your time and consideration. I look forward to your update.

Sincerely,
[Your Name]
[Your Role]
[Company Name]`;
  }

  return `Dear [Candidate Name],

I hope you are doing well.

I am writing regarding ${safeSubject}. We appreciate your continued interest and wanted to share an update with you.

Please let us know if you have any questions or require any additional information.

Thank you for your time.

Sincerely,
[Your Name]
[Your Role]
[Company Name]`;
};

const EmailTemplates = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    subject: "",
    category: CATEGORY_OPTIONS[0],
    body: buildFormalTemplateBody(CATEGORY_OPTIONS[0], ""),
  });
  const [formError, setFormError] = useState("");

  const refresh = async () => {
    try {
      setError("");
      const response = await api.get("/email-templates");
      setTemplates(response?.data?.data || []);
    } catch (e: any) {
      setError(e?.response?.data?.error || "Failed to load email templates");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      subject: "",
      category: CATEGORY_OPTIONS[0],
      body: buildFormalTemplateBody(CATEGORY_OPTIONS[0], ""),
    });
    setFormError("");
  };

  const openCreate = () => {
    resetForm();
    setCreateOpen(true);
  };

  const openEdit = (tpl: EmailTemplate) => {
    setEditingId(tpl._id);
    setForm({
      name: tpl.name,
      subject: tpl.subject,
      category: tpl.category,
      body: tpl.body || buildFormalTemplateBody(tpl.category, tpl.subject),
    });
    setFormError("");
    setEditOpen(true);
  };

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim() || !form.subject.trim() || !form.category.trim() || !form.body.trim()) {
      setFormError("Name, subject, category, and email body are required.");
      return;
    }

    try {
      setLoading(true);
      await api.post("/email-templates", form);
      setCreateOpen(false);
      await refresh();
    } catch (err: any) {
      setFormError(err?.response?.data?.error || "Failed to create template");
    } finally {
      setLoading(false);
    }
  };

  const submitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    setFormError("");

    if (!form.name.trim() || !form.subject.trim() || !form.category.trim() || !form.body.trim()) {
      setFormError("Name, subject, category, and email body are required.");
      return;
    }

    try {
      setLoading(true);
      await api.put(`/email-templates/${editingId}`, form);
      setEditOpen(false);
      setEditingId(null);
      await refresh();
    } catch (err: any) {
      setFormError(err?.response?.data?.error || "Failed to update template");
    } finally {
      setLoading(false);
    }
  };

  const removeTemplate = async (tpl: EmailTemplate) => {
    if (!window.confirm(`Delete template "${tpl.name}"?`)) return;
    try {
      setLoading(true);
      await api.delete(`/email-templates/${tpl._id}`);
      await refresh();
    } catch (err: any) {
      setError(err?.response?.data?.error || "Failed to delete template");
    } finally {
      setLoading(false);
    }
  };

  const cards = useMemo(() => templates, [templates]);

  const handleGenerateFormalDraft = () => {
    setForm((p) => ({ ...p, body: buildFormalTemplateBody(p.category, p.subject) }));
  };

  const copyTemplate = async (tpl: EmailTemplate) => {
    const templateBody = tpl.body || buildFormalTemplateBody(tpl.category, tpl.subject);
    const textToCopy = `Subject: ${tpl.subject}\n\n${templateBody}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      window.alert("Template copied to clipboard.");
    } catch {
      window.alert("Failed to copy template. Please copy manually.");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Email Templates</h1>
            <p className="text-muted-foreground">Manage your email templates for candidate communication</p>
          </div>

          <Button className="bg-primary hover:bg-primary/90" onClick={openCreate}>
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>

        {error ? <p className="text-sm text-red-500">{error}</p> : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? <p className="text-sm text-muted-foreground col-span-full">Loading...</p> : null}
          {!loading && cards.length === 0 ? (
            <p className="text-sm text-muted-foreground col-span-full">No templates yet.</p>
          ) : null}

          {!loading &&
            cards.map((template) => (
              <Card key={template._id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => copyTemplate(template)} title="Copy template">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => openEdit(template)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => removeTemplate(template)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{template.subject}</p>
                <p className="text-sm text-foreground/90 mb-3 whitespace-pre-line line-clamp-4">
                  {template.body || buildFormalTemplateBody(template.category, template.subject)}
                </p>
                <span className="inline-block px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded">
                  {template.category}
                </span>
              </Card>
            ))}
        </div>
      </div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Template</DialogTitle>
            <DialogDescription>Define the template name, subject, category, and full formal body.</DialogDescription>
          </DialogHeader>

          <form onSubmit={submitCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tplName">Name</Label>
              <Input id="tplName" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tplSubject">Subject</Label>
              <Input
                id="tplSubject"
                value={form.subject}
                onChange={(e) => {
                  const nextSubject = e.target.value;
                  setForm((p) => ({
                    ...p,
                    subject: nextSubject,
                    body: buildFormalTemplateBody(p.category, nextSubject),
                  }));
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tplCategory">Category</Label>
              <select
                id="tplCategory"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.category}
                onChange={(e) => {
                  const nextCategory = e.target.value;
                  setForm((p) => ({
                    ...p,
                    category: nextCategory,
                    body: buildFormalTemplateBody(nextCategory, p.subject),
                  }));
                }}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="tplBody">Formal Email Body</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleGenerateFormalDraft}>
                  Generate Formal Draft
                </Button>
              </div>
              <Textarea
                id="tplBody"
                value={form.body}
                rows={10}
                onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
                placeholder="Write the full formal email template..."
              />
            </div>

            {formError ? <p className="text-sm text-red-500">{formError}</p> : null}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setCreateOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Create</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>Update the template details and full formal body.</DialogDescription>
          </DialogHeader>

          <form onSubmit={submitEdit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="editTplName">Name</Label>
              <Input id="editTplName" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editTplSubject">Subject</Label>
              <Input
                id="editTplSubject"
                value={form.subject}
                onChange={(e) => {
                  const nextSubject = e.target.value;
                  setForm((p) => ({
                    ...p,
                    subject: nextSubject,
                    body: buildFormalTemplateBody(p.category, nextSubject),
                  }));
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editTplCategory">Category</Label>
              <select
                id="editTplCategory"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.category}
                onChange={(e) => {
                  const nextCategory = e.target.value;
                  setForm((p) => ({
                    ...p,
                    category: nextCategory,
                    body: buildFormalTemplateBody(nextCategory, p.subject),
                  }));
                }}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="editTplBody">Formal Email Body</Label>
                <Button type="button" variant="outline" size="sm" onClick={handleGenerateFormalDraft}>
                  Generate Formal Draft
                </Button>
              </div>
              <Textarea
                id="editTplBody"
                value={form.body}
                rows={10}
                onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
                placeholder="Write the full formal email template..."
              />
            </div>

            {formError ? <p className="text-sm text-red-500">{formError}</p> : null}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setEditOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default EmailTemplates;











