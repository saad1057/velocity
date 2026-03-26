import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Users, Activity, FileText, LayoutDashboard, ArrowUpRight, TrendingUp, AlertCircle, ArrowLeft } from 'lucide-react';
import { getRecruiters, getActivityLogs } from '@/services/adminService';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeActivities: 0,
    recentLogs: [] as any[],
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [usersRes, logsRes] = await Promise.all([
          getRecruiters(),
          getActivityLogs({ limit: 5 })
        ]);
        
        setStats({
          totalUsers: usersRes.success ? usersRes.data.length : 0,
          activeActivities: logsRes.success ? logsRes.pagination.total : 0,
          recentLogs: logsRes.success ? logsRes.data : [],
        });
      } catch (error) {
        console.error('Failed to load dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="flex flex-col gap-1">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 flex items-center gap-3">
          <LayoutDashboard className="h-10 w-10 text-indigo-600" />
          Admin Overview
        </h1>
          <p className="text-slate-500 text-lg">System-wide monitoring and resource management.</p>
        </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-none shadow-lg bg-indigo-600 text-white overflow-hidden relative group">
          <CardHeader className="pb-2">
            <CardTitle className="text-indigo-100 flex items-center justify-between font-bold uppercase text-xs tracking-wider">
              Total Recruiters
              <Users className="h-5 w-5 text-indigo-300 group-hover:scale-125 transition-transform" />
            </CardTitle>
            <CardDescription className="text-white text-3xl font-extrabold">{stats.totalUsers}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-indigo-200 mt-2">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+2.5% from last week</span>
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="h-24 w-24 -mr-6 -mt-6" />
          </div>
        </Card>

        <Card className="border-none shadow-lg overflow-hidden relative group bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-400 flex items-center justify-between font-bold uppercase text-xs tracking-wider">
              Total Activity
              <Activity className="h-5 w-5 text-amber-500 group-hover:scale-125 transition-transform" />
            </CardTitle>
            <CardDescription className="text-slate-900 text-3xl font-extrabold">{stats.activeActivities}</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="flex items-center text-xs text-emerald-600 mt-2 font-medium">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>Healthy System Load</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg overflow-hidden relative group bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-400 flex items-center justify-between font-bold uppercase text-xs tracking-wider">
              Server Status
              <AlertCircle className="h-5 w-5 text-emerald-500" />
            </CardTitle>
            <CardDescription className="text-slate-900 text-3xl font-extrabold">99.9%</CardDescription>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="text-[10px] bg-emerald-50 text-emerald-700 border-emerald-100 mt-2 animate-pulse">Running Service</Badge>
          </CardContent>
        </Card>

        <Card className="border-none shadow-lg overflow-hidden relative group bg-white border-l-4 border-l-rose-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-slate-400 flex items-center justify-between font-bold uppercase text-xs tracking-wider">
              Reported Issues
              <FileText className="h-5 w-5 text-rose-500" />
            </CardTitle>
            <CardDescription className="text-slate-900 text-3xl font-extrabold">0</CardDescription>
          </CardHeader>
          <CardContent>
             <p className="text-xs text-slate-400 mt-2">All systems optimal</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-xl bg-white/70 backdrop-blur-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>The most recent actions performed across the platform.</CardDescription>
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-full shadow-sm hover:bg-slate-50">
              <Link to="/admin/activity" className="gap-1 flex items-center">
                View All <ArrowUpRight className="h-3 w-3" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader className="bg-slate-50/50">
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-6">Loading...</TableCell></TableRow>
                ) : stats.recentLogs.length === 0 ? (
                  <TableRow><TableCell colSpan={4} className="text-center py-6">No recent logs</TableCell></TableRow>
                ) : (
                  stats.recentLogs.map((log) => (
                    <TableRow key={log._id} className="group cursor-default hover:bg-slate-50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                            {log.userId?.firstname?.[0] || 'U'}
                          </div>
                          <span className="text-xs font-medium">{log.userId?.firstname} {log.userId?.lastname}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="text-[10px] uppercase font-bold text-slate-600 bg-slate-100 group-hover:bg-amber-100 group-hover:text-amber-800 transition-colors">
                          {log.action.split('_')[0]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[10px] text-slate-500 font-mono">
                        {log.metadata?.path?.substring(4) || '/'}
                      </TableCell>
                      <TableCell className="text-right text-[10px] text-slate-400">
                        {new Date(log.createdAt).toLocaleTimeString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-none shadow-xl bg-white overflow-hidden">
          <CardHeader className="bg-slate-900 text-white rounded-t-xl">
             <CardTitle className="text-lg">Quick Actions</CardTitle>
             <CardDescription className="text-slate-400">Administrative tools shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4 pt-6">
            <Link to="/admin/recruiters">
              <Button className="w-full justify-start gap-3 h-14 text-indigo-700 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 transition-all shadow-sm">
                <div className="bg-indigo-600 p-2 rounded-lg text-white">
                  <Users className="h-4 w-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-bold text-sm leading-tight">Manage Recruiters</span>
                  <span className="text-[10px] opacity-70">Edit or delete user accounts</span>
                </div>
              </Button>
            </Link>
            
            <Link to="/admin/activity">
              <Button className="w-full justify-start gap-3 h-14 text-slate-700 bg-slate-50 border border-slate-200 hover:bg-slate-100 hover:border-slate-300 transition-all shadow-sm">
                <div className="bg-slate-800 p-2 rounded-lg text-white">
                  <Activity className="h-4 w-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-bold text-sm leading-tight">View Audit Logs</span>
                  <span className="text-[10px] opacity-70">Track system activities</span>
                </div>
              </Button>
            </Link>

            <div className="pt-6 border-t mt-6">
               <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 px-1">Internal Documentation</h4>
               <ul className="space-y-3">
                 <li className="flex items-center gap-3 text-xs text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer px-1">
                   <div className="h-1.5 w-1.5 rounded-full bg-indigo-600"></div>
                   Security Protocols
                 </li>
                 <li className="flex items-center gap-3 text-xs text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer px-1">
                   <div className="h-1.5 w-1.5 rounded-full bg-indigo-600"></div>
                   Recruiter Onboarding
                 </li>
                 <li className="flex items-center gap-3 text-xs text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer px-1">
                   <div className="h-1.5 w-1.5 rounded-full bg-indigo-600"></div>
                   Compliance Guidelines
                 </li>
               </ul>
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
