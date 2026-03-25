import { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/services/authService";
import { getEmployees, updateEmployeeStatus } from "@/services/employeeService";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Requests = () => {
  const [employees, setEmployees] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      toast({
        title: "Error fetching requests",
        description: "Failed to load employee requests.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateEmployeeStatus(id, status);
      toast({
        title: "Success",
        description: `Employee ${status} successfully.`,
      });
      fetchEmployees();
    } catch (error) {
      toast({
        title: "Action failed",
        description: "Could not update employee status.",
        variant: "destructive",
      });
    }
  };

  const renderRequests = (status: string) => {
    const filtered = employees.filter(e => e.status === status);
    
    if (filtered.length === 0) {
      return (
        <Card className="mt-4">
          <CardContent className="pt-6 text-center text-muted-foreground p-8">
            No {status} requests right now.
          </CardContent>
        </Card>
      );
    }

    return (
      <div className="space-y-4 mt-4">
        {filtered.map(emp => (
          <Card key={emp._id}>
            <CardContent className="p-6 flex justify-between items-center">
              <div>
                <p className="font-medium text-lg">{emp.firstname} {emp.lastname}</p>
                <p className="text-sm text-muted-foreground">{emp.email}</p>
              </div>
              <div className="flex gap-2">
                {status !== 'approved' && (
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2 border-green-500 text-green-500 hover:bg-green-50"
                    onClick={() => handleStatusChange(emp._id, 'approved')}
                  >
                    <CheckCircle className="h-4 w-4" />
                    Approve
                  </Button>
                )}
                {status !== 'rejected' && (
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-50"
                    onClick={() => handleStatusChange(emp._id, 'rejected')}
                  >
                    <XCircle className="h-4 w-4" />
                    Reject
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Employee Requests</h1>
          <p className="text-muted-foreground">Manage incoming signup requests for your company.</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Tabs defaultValue="pending">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value="pending">{renderRequests('pending')}</TabsContent>
            <TabsContent value="approved">{renderRequests('approved')}</TabsContent>
            <TabsContent value="rejected">{renderRequests('rejected')}</TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Requests;
