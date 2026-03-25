import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Mail, Edit, Trash2 } from "lucide-react";
import api from "@/lib/api";

type EmailTemplate = {
  _id: string;
  name: string;
  subject: string;
  category: string;
};

const CATEGORY_OPTIONS = ["Interview", "Rejection", "Offer", "Follow-up"];

const EmailTemplates = () => {
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState({ name: "", subject: "", category: CATEGORY_OPTIONS[0] });
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
    setForm({ name: "", subject: "", category: CATEGORY_OPTIONS[0] });
    setFormError("");
  };

  const openCreate = () => {
    resetForm();
    setCreateOpen(true);
  };

  const openEdit = (tpl: EmailTemplate) => {
    setEditingId(tpl._id);
    setForm({ name: tpl.name, subject: tpl.subject, category: tpl.category });
    setFormError("");
    setEditOpen(true);
  };

  const submitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!form.name.trim() || !form.subject.trim() || !form.category.trim()) {
      setFormError("Name, subject, and category are required.");
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

    if (!form.name.trim() || !form.subject.trim() || !form.category.trim()) {
      setFormError("Name, subject, and category are required.");
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
                <span className="inline-block px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded">
                  {template.category}
                </span>
              </Card>
            ))}
        </div>
      </div>

      {/* Create dialog */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Template</DialogTitle>
            <DialogDescription>Define the template name, subject and category.</DialogDescription>
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
                onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tplCategory">Category</Label>
              <select
                id="tplCategory"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
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

      {/* Edit dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Template</DialogTitle>
            <DialogDescription>Update the template details.</DialogDescription>
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
                onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="editTplCategory">Category</Label>
              <select
                id="editTplCategory"
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              >
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
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











