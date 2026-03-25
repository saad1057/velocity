import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/services/authService";
import { getEmployees, updateEmployee, deleteEmployee, resetEmployeePassword } from "@/services/employeeService";
import { Loader2, Settings2, Trash2, KeyRound } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

const Employees = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const [editUser, setEditUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({ firstname: '', lastname: '', email: '' });
  
  const [resetUser, setResetUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState('');

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await getEmployees('approved');
      setEmployees(data);
    } catch (error) {
      toast({
        title: "Error fetching employees",
        description: "Failed to load employee list.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editUser) return;
    try {
      await updateEmployee(editUser._id, editFormData);
      toast({ title: "Success", description: "Employee updated successfully." });
      setEditUser(null);
      fetchEmployees();
    } catch (error) {
      toast({ title: "Update failed", description: "Failed to update employee details.", variant: "destructive" });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetUser || newPassword.length < 6) return;
    try {
      await resetEmployeePassword(resetUser._id, newPassword);
      toast({ title: "Success", description: "Password reset successfully." });
      setResetUser(null);
      setNewPassword('');
    } catch (error) {
      toast({ title: "Reset failed", description: "Failed to reset password.", variant: "destructive" });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee? This action cannot be undone.")) return;
    try {
      await deleteEmployee(id);
      toast({ title: "Success", description: "Employee deleted." });
      fetchEmployees();
    } catch (error) {
      toast({ title: "Delete failed", description: "Could not delete employee.", variant: "destructive" });
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Employees</h1>
          <p className="text-muted-foreground">View and manage your organization's approved employees.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.length === 0 ? (
              <div className="col-span-full">
                <Card className="text-center p-8 text-muted-foreground">
                  No active employees found.
                </Card>
              </div>
            ) : (
              employees.map(emp => (
                <Card key={emp._id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{emp.firstname} {emp.lastname}</CardTitle>
                    <CardDescription>{emp.email}</CardDescription>
                  </CardHeader>
                  <CardContent className="mt-auto flex gap-2">
                    <Button 
                      variant="outline" size="sm" className="flex-1"
                      onClick={() => {
                        setEditUser(emp);
                        setEditFormData({ firstname: emp.firstname, lastname: emp.lastname || '', email: emp.email });
                      }}
                    >
                      <Settings2 className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="outline" size="sm" className="flex-1"
                      onClick={() => setResetUser(emp)}
                    >
                      <KeyRound className="w-4 h-4 mr-1" /> Reset
                    </Button>
                    <Button 
                      variant="outline" size="sm" className="flex-1 text-red-500 hover:text-red-600 hover:bg-red-50 hover:border-red-200"
                      onClick={() => handleDelete(emp._id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>

      {/* Edit Dialog */}
      <Dialog open={!!editUser} onOpenChange={(open) => !open && setEditUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Employee</DialogTitle>
            <DialogDescription>Update the details for this employee.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>First Name</Label>
              <Input value={editFormData.firstname} onChange={e => setEditFormData({...editFormData, firstname: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <Label>Last Name</Label>
              <Input value={editFormData.lastname} onChange={e => setEditFormData({...editFormData, lastname: e.target.value})} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} required />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setEditUser(null)}>Cancel</Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={!!resetUser} onOpenChange={(open) => !open && setResetUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>Set a new password for {resetUser?.firstname}.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input 
                type="password" 
                value={newPassword} 
                onChange={e => setNewPassword(e.target.value)} 
                minLength={6} 
                required 
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setResetUser(null)}>Cancel</Button>
              <Button type="submit">Reset Password</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Employees;
