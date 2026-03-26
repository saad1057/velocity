import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { getRecruiters, updateRecruiter, deleteRecruiter, resetPassword, createRecruiter } from '@/services/adminService';
import { User } from '@/services/authService';
import { Edit, Trash2, Key, UserPlus, Search, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RecruiterManagement: React.FC = () => {
  const [recruiters, setRecruiters] = useState<User[]>([]);
  const [filteredRecruiters, setFilteredRecruiters] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [editForm, setEditForm] = useState({ firstname: '', lastname: '', email: '', companyname: '' });
  const [createForm, setCreateForm] = useState({ firstname: '', lastname: '', email: '', password: '', companyname: '' });
  
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecruiters();
  }, []);

  useEffect(() => {
    const filtered = recruiters.filter(r => 
      r.firstname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredRecruiters(filtered);
  }, [searchTerm, recruiters]);

  const fetchRecruiters = async () => {
    try {
      setLoading(true);
      const res = await getRecruiters();
      if (res.success) {
        setRecruiters(res.data);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load recruiters', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditForm({ 
      firstname: user.firstname, 
      lastname: user.lastname || '', 
      email: user.email,
      companyname: user.companyname || ''
    });
    setEditDialogOpen(true);
  };

  const handleCreate = async () => {
    try {
      if (!createForm.firstname || !createForm.email || !createForm.password) {
        toast({ title: 'Error', description: 'Please fill in all required fields', variant: 'destructive' });
        return;
      }
      const res = await createRecruiter(createForm);
      if (res.success) {
        toast({ title: 'Success', description: 'User created successfully' });
        setCreateDialogOpen(false);
        setCreateForm({ firstname: '', lastname: '', email: '', password: '', companyname: '' });
        fetchRecruiters();
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.response?.data?.message || 'Creation failed', variant: 'destructive' });
    }
  };

  const handleUpdate = async () => {
    if (!selectedUser) return;
    try {
      const res = await updateRecruiter(selectedUser._id, editForm);
      if (res.success) {
        toast({ title: 'Success', description: 'User updated successfully' });
        setEditDialogOpen(false);
        fetchRecruiters();
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Update failed', variant: 'destructive' });
    }
  };

  const handleDelete = async () => {
    if (!selectedUser) return;
    try {
      const res = await deleteRecruiter(selectedUser._id);
      if (res.success) {
        toast({ title: 'Success', description: 'User deleted successfully' });
        setDeleteDialogOpen(false);
        fetchRecruiters();
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Delete failed', variant: 'destructive' });
    }
  };

  const handleResetPassword = async () => {
    if (!selectedUser || !newPassword) return;
    try {
      const res = await resetPassword(selectedUser._id, newPassword);
      if (res.success) {
        toast({ title: 'Success', description: 'Password reset successful' });
        setResetDialogOpen(false);
        setNewPassword('');
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Reset failed', variant: 'destructive' });
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Recruiter Management</h1>
            <p className="text-muted-foreground mt-1">Manage and track all recruiter accounts in the system.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search..." 
                className="pl-9 w-64 h-10 bg-white" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2" onClick={() => setCreateDialogOpen(true)}>
              <UserPlus className="h-4 w-4" /> Create New Recruiter
            </Button>
          </div>
        </div>

      <Card className="border-none shadow-md overflow-hidden bg-white/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">Loading recruiters...</TableCell>
                </TableRow>
              ) : filteredRecruiters.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10">No recruiters found.</TableCell>
                </TableRow>
              ) : (
                filteredRecruiters.map((recruiter) => (
                  <TableRow key={recruiter._id} className="hover:bg-slate-50/30 transition-colors">
                    <TableCell className="font-medium">
                      {recruiter.firstname} {recruiter.lastname}
                    </TableCell>
                    <TableCell>{recruiter.email}</TableCell>
                    <TableCell>{recruiter.companyname || 'N/A'}</TableCell>
                    <TableCell>{recruiter.createdAt ? new Date(recruiter.createdAt).toLocaleDateString() : 'N/A'}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => handleEditClick(recruiter)} title="Edit">
                        <Edit className="h-4 w-4 text-blue-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedUser(recruiter); setResetDialogOpen(true); }} title="Reset Password">
                        <Key className="h-4 w-4 text-amber-500" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setSelectedUser(recruiter); setDeleteDialogOpen(true); }} title="Delete">
                        <Trash2 className="h-4 w-4 text-rose-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Recruiter</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="c-firstname">First Name <span className="text-rose-500">*</span></Label>
                <Input 
                  id="c-firstname" 
                  placeholder="John"
                  value={createForm.firstname} 
                  onChange={(e) => setCreateForm({...createForm, firstname: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="c-lastname">Last Name</Label>
                <Input 
                  id="c-lastname" 
                  placeholder="Doe"
                  value={createForm.lastname} 
                  onChange={(e) => setCreateForm({...createForm, lastname: e.target.value})} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-email">Email <span className="text-rose-500">*</span></Label>
              <Input 
                id="c-email" 
                type="email" 
                placeholder="john@example.com"
                value={createForm.email} 
                onChange={(e) => setCreateForm({...createForm, email: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-company">Company Name</Label>
              <Input 
                id="c-company" 
                placeholder="Tech Corp"
                value={createForm.companyname} 
                onChange={(e) => setCreateForm({...createForm, companyname: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="c-password">Password <span className="text-rose-500">*</span></Label>
              <Input 
                id="c-password" 
                type="password" 
                placeholder="Min 6 characters"
                value={createForm.password} 
                onChange={(e) => setCreateForm({...createForm, password: e.target.value})} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700 text-white">Create User</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Recruiter</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstname">First Name</Label>
                <Input 
                  id="firstname" 
                  value={editForm.firstname} 
                  onChange={(e) => setEditForm({...editForm, firstname: e.target.value})} 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Last Name</Label>
                <Input 
                  id="lastname" 
                  value={editForm.lastname} 
                  onChange={(e) => setEditForm({...editForm, lastname: e.target.value})} 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                value={editForm.email} 
                onChange={(e) => setEditForm({...editForm, email: e.target.value})} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="companyname">Company Name</Label>
              <Input 
                id="companyname" 
                placeholder="N/A"
                value={editForm.companyname} 
                onChange={(e) => setEditForm({...editForm, companyname: e.target.value})} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdate} className="bg-blue-600 hover:bg-blue-700 text-white">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Enter a new password for {selectedUser?.firstname} {selectedUser?.lastname}.
            </p>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input 
                id="newPassword" 
                type="password" 
                placeholder="Min 6 characters" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleResetPassword} className="bg-amber-600 hover:bg-amber-700 text-white">Reset Password</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-rose-600">Delete Account</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete the account for <strong>{selectedUser?.email}</strong>? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete Permanently</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </DashboardLayout>
  );
};

export default RecruiterManagement;
