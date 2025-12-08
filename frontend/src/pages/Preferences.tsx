import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, Bell, Mail, Globe } from "lucide-react";

const Preferences = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in max-w-4xl">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Preferences</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">General Settings</h2>
          </div>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" defaultValue="UTC" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Input id="language" defaultValue="English" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="date-format">Date Format</Label>
              <Input id="date-format" defaultValue="MM/DD/YYYY" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Notifications</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">Receive email notifications for important updates</p>
              </div>
              <Switch id="email-notifications" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="candidate-updates">Candidate Updates</Label>
                <p className="text-sm text-muted-foreground">Get notified when candidates apply or update their status</p>
              </div>
              <Switch id="candidate-updates" defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="job-matches">Job Matches</Label>
                <p className="text-sm text-muted-foreground">Receive notifications for new candidate matches</p>
              </div>
              <Switch id="job-matches" defaultChecked />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Mail className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold text-foreground">Email Preferences</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="weekly-digest">Weekly Digest</Label>
                <p className="text-sm text-muted-foreground">Receive a weekly summary of your recruitment activities</p>
              </div>
              <Switch id="weekly-digest" />
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="marketing-emails">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">Receive updates about new features and tips</p>
              </div>
              <Switch id="marketing-emails" />
            </div>
          </div>
        </Card>

        <div className="flex justify-end">
          <Button className="bg-primary hover:bg-primary/90">
            Save Preferences
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Preferences;

