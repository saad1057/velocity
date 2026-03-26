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
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { getActivityLogs, getRecruiters, ActivityLog, ActivityFilter, deleteActivities, purgeActivities } from '@/services/adminService';
import { User } from '@/services/authService';
import { Card, CardContent } from '@/components/ui/card';
import { format } from 'date-fns';
import { ChevronDown, ChevronRight, Filter, Info, UserCircle, RefreshCw, ArrowLeft, Trash2, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from '@/components/ui/alert-dialog';

const ActivityLogs: React.FC = () => {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ActivityFilter>({
    userId: undefined,
    feature: undefined,
    action: undefined,
    startDate: undefined,
    endDate: undefined,
    limit: 50,
  });
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    fetchUsers();
    fetchLogs();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getRecruiters();
      if (res.success) setUsers(res.data);
    } catch (error) {
      console.error('Failed to fetch users for filter', error);
    }
  };

  const fetchLogs = async (currentFilters = filters) => {
    try {
      setLoading(true);
      const res = await getActivityLogs(currentFilters);
      if (res.success) {
        setLogs(res.data);
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to load activity logs', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value === 'all' ? undefined : value };
    setFilters(newFilters);
  };

  const applyFilters = () => {
    fetchLogs();
  };

  const resetFilters = () => {
    const defaultFilters = { userId: undefined, feature: undefined, action: undefined, limit: 50 };
    setFilters(defaultFilters);
    fetchLogs(defaultFilters);
  };

  const toggleExpandRow = (id: string, e: React.MouseEvent) => {
    // Prevent expansion when clicking checkbox or its container
    if ((e.target as HTMLElement).closest('.selection-cell')) return;
    setExpandedRow(expandedRow === id ? null : id);
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === logs.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(logs.map(log => log._id));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    try {
      setIsDeleting(true);
      const res = await deleteActivities(selectedIds);
      if (res.success) {
        toast({ title: 'Success', description: `${selectedIds.length} logs deleted.` });
        setSelectedIds([]);
        fetchLogs();
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to delete logs', variant: 'destructive' });
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePurge = async () => {
    try {
      setIsDeleting(true);
      const res = await purgeActivities();
      if (res.success) {
        toast({ title: 'Success', description: 'All activity logs cleared.' });
        setSelectedIds([]);
        fetchLogs();
      }
    } catch (error) {
      toast({ title: 'Error', description: 'Failed to clear logs', variant: 'destructive' });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
            <p className="text-muted-foreground mt-1">Audit trail of all platform activities.</p>
          </div>
          <div className="flex gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-rose-600 border-rose-200 hover:bg-rose-50 hover:text-rose-700 gap-2">
                  <Trash2 className="h-4 w-4" /> Purge All
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete ALL activity logs. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handlePurge} className="bg-rose-600 hover:bg-rose-700">Purge Everything</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            
            <Button onClick={() => fetchLogs()} variant="outline" size="sm" className="gap-2">
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </Button>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="bg-indigo-600 text-white p-3 rounded-lg shadow-lg flex justify-between items-center animate-in slide-in-from-top-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">{selectedIds.length} activities selected</span>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:bg-indigo-700" 
                onClick={() => setSelectedIds([])}
              >
                Cancel
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" className="bg-white text-indigo-700 hover:bg-slate-100 gap-2 font-bold">
                    <Trash2 className="h-4 w-4" /> Delete Selected
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Selected Logs?</AlertDialogTitle>
                    <AlertDialogDescription>
                      You are about to delete {selectedIds.length} selected activity logs. This cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteSelected} className="bg-rose-600 hover:bg-rose-700">Delete Permanently</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        )}

      <Card className="border-none shadow-sm bg-slate-50/50">
        <CardContent className="p-4 flex flex-wrap gap-4 items-end">
          <div className="space-y-1.5 min-w-[200px]">
            <Label className="text-xs uppercase font-semibold text-slate-500">User</Label>
            <Select onValueChange={(val) => handleFilterChange('userId', val)} value={filters.userId || 'all'}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="All Users" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Users</SelectItem>
                {users.map(u => (
                  <SelectItem key={u._id} value={u._id}>{u.firstname} {u.lastname}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 min-w-[150px]">
            <Label className="text-xs uppercase font-semibold text-slate-500">Feature</Label>
            <Select onValueChange={(val) => handleFilterChange('feature', val)} value={filters.feature || 'all'}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="All Features" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Features</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="recruitment">Recruitment</SelectItem>
                <SelectItem value="assessments">Assessments</SelectItem>
                <SelectItem value="users">Users</SelectItem>
                <SelectItem value="resume">Resume</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5 min-w-[150px]">
            <Label className="text-xs uppercase font-semibold text-slate-500">Action Type</Label>
            <Select onValueChange={(val) => handleFilterChange('action', val)} value={filters.action || 'all'}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="All Actions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Actions</SelectItem>
                <SelectItem value="CREATE_POST">Create</SelectItem>
                <SelectItem value="READ_GET">Read</SelectItem>
                <SelectItem value="UPDATE_PATCH">Update</SelectItem>
                <SelectItem value="DELETE_DELETE">Delete</SelectItem>
                <SelectItem value="RESET_PASSWORD">Reset Password</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2">
            <Button onClick={applyFilters} className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Filter className="h-4 w-4" /> Apply Filters
            </Button>
            <Button onClick={resetFilters} variant="ghost" className="text-slate-500">Reset</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-none shadow-md overflow-hidden bg-white/50 backdrop-blur-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="w-[40px] px-4">
                  <Checkbox 
                    checked={selectedIds.length === logs.length && logs.length > 0} 
                    onCheckedChange={toggleSelectAll}
                  />
                </TableHead>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>User</TableHead>
                <TableHead>Feature</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Path</TableHead>
                <TableHead>Timestamp</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-20">
                    <div className="flex flex-col items-center gap-2">
                      <RefreshCw className="h-8 w-8 animate-spin text-slate-300" />
                      <span className="text-slate-400">Loading activity data...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-20 text-slate-400">
                    No activity logs match your current filters.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <React.Fragment key={log._id}>
                    <TableRow 
                      className={`cursor-pointer hover:bg-slate-50/30 transition-colors ${expandedRow === log._id ? 'bg-slate-50/80 border-b-transparent' : ''} ${selectedIds.includes(log._id) ? 'bg-indigo-50/40' : ''}`}
                      onClick={(e) => toggleExpandRow(log._id, e)}
                    >
                      <TableCell className="px-4 selection-cell" onClick={(e) => e.stopPropagation()}>
                        <Checkbox 
                          checked={selectedIds.includes(log._id)} 
                          onCheckedChange={() => toggleSelectRow(log._id)}
                        />
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {expandedRow === log._id ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-xs">
                            {log.userId?.firstname?.[0] || 'U'}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium text-slate-900">{log.userId?.firstname} {log.userId?.lastname}</span>
                            <span className="text-xs text-slate-500">{log.userId?.email}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize border-slate-200 text-slate-600 bg-white">
                          {log.feature}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-semibold text-slate-700">{log.action.replace('_', ' ')}</span>
                      </TableCell>
                      <TableCell>
                        <code className="text-[10px] sm:text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-600 line-clamp-1 max-w-[150px]">
                          {log.metadata?.path || '/'}
                        </code>
                      </TableCell>
                      <TableCell className="text-slate-500 text-xs">
                        {format(new Date(log.createdAt), 'MMM dd, yyyy HH:mm:ss')}
                      </TableCell>
                      <TableCell>
                        {log.metadata?.statusCode ? (
                          <Badge className={log.metadata.statusCode < 400 ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-600 border-rose-100'}>
                             {log.metadata.statusCode}
                          </Badge>
                        ) : '-'}
                      </TableCell>
                    </TableRow>
                    {expandedRow === log._id && (
                      <TableRow className="bg-slate-50/80 border-t-0 shadow-inner">
                        <TableCell colSpan={7} className="pb-6 px-12 animate-in fade-in slide-in-from-top-2 duration-300">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2"><Info className="h-3 w-3" /> Request Metadata</h4>
                              <div className="bg-white border rounded-lg p-3 space-y-2 overflow-auto max-h-[300px]">
                                <table className="w-full text-xs">
                                  <tbody>
                                    <tr className="border-b"><td className="py-1 font-semibold text-slate-500 pr-4">Method</td><td>{log.metadata?.method || 'GET'}</td></tr>
                                    <tr className="border-b"><td className="py-1 font-semibold text-slate-500 pr-4">Full Path</td><td className="break-all">{log.metadata?.path || '/'}</td></tr>
                                    {log.metadata?.params && Object.keys(log.metadata.params).length > 0 && (
                                      <tr className="border-b"><td className="py-1 font-semibold text-slate-500 pr-4">URL Params</td><td><pre className="mt-1 text-[10px]">{JSON.stringify(log.metadata.params, null, 2)}</pre></td></tr>
                                    )}
                                    {log.metadata?.query && Object.keys(log.metadata.query).length > 0 && (
                                      <tr className="border-b"><td className="py-1 font-semibold text-slate-500 pr-4">Query Params</td><td><pre className="mt-1 text-[10px]">{JSON.stringify(log.metadata.query, null, 2)}</pre></td></tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-2"><UserCircle className="h-3 w-3" /> Connection Info</h4>
                              <div className="bg-white border rounded-lg p-3 space-y-2">
                                <table className="w-full text-xs">
                                  <tbody>
                                    <tr className="border-b"><td className="py-1 font-semibold text-slate-500 pr-4">IP Address</td><td>{log.ip || 'Unknown'}</td></tr>
                                    <tr className="border-b">
                                      <td className="py-1 font-semibold text-slate-500 pr-4">User Agent</td>
                                      <td className="text-[10px] text-slate-400 leading-tight py-1 break-all">{log.userAgent || 'Unknown'}</td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      </div>
    </DashboardLayout>
  );
};

export default ActivityLogs;
