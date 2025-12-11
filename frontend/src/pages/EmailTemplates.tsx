import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Mail, Edit, Trash2 } from "lucide-react";

const EmailTemplates = () => {
  const templates = [
    {
      id: 1,
      name: "Interview Invitation",
      subject: "Interview Invitation - {{position}}",
      category: "Interview"
    },
    {
      id: 2,
      name: "Rejection Email",
      subject: "Thank you for your application - {{position}}",
      category: "Rejection"
    },
    {
      id: 3,
      name: "Offer Letter",
      subject: "Job Offer - {{position}}",
      category: "Offer"
    },
    {
      id: 4,
      name: "Follow-up Email",
      subject: "Follow-up on your application",
      category: "Follow-up"
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Email Templates</h1>
            <p className="text-muted-foreground">Manage your email templates for candidate communication</p>
          </div>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create Template
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Mail className="h-6 w-6 text-primary" />
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
              <h3 className="text-xl font-semibold text-foreground mb-2">{template.name}</h3>
              <p className="text-sm text-muted-foreground mb-3">{template.subject}</p>
              <span className="inline-block px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded">
                {template.category}
              </span>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EmailTemplates;




