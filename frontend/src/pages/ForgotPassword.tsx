import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Search, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { forgotPassword } from "@/services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure both passwords are identical.",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      const response = await forgotPassword(email, password);
      if (response.success) {
        toast({
          title: "Success",
          description: "Password updated. Please sign in with your new password.",
        });
        navigate("/login");
      }
    } catch (error: any) {
      const errorMessage = error?.response?.data?.message || "Unable to reset password. Please try again.";
      toast({
        title: "Reset failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-2 mb-8">
            <Search className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">VELOCITY</span>
          </div>

          <Card className="p-8 bg-card/80 backdrop-blur">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Forgot Password</h1>
              <p className="text-muted-foreground">
                Enter your account email and choose a new password.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating password...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>

              <div className="flex justify-between text-sm text-muted-foreground">
                <Link to="/login" className="text-primary hover:underline">
                  Back to Login
                </Link>
                <Link to="/signup" className="text-primary hover:underline">
                  Create account
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/20 to-secondary/20 items-center justify-center p-12">
        <div className="max-w-lg text-center space-y-6">
          <div className="w-64 h-64 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
            <Search className="h-32 w-32 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground">
            Reset your access securely
          </h2>
          <p className="text-lg text-muted-foreground">
            Keep your account protected with a fresh password.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

