import { useState, useEffect, useRef } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { getCurrentUser, updateProfile } from "@/services/userService";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user: authUser, refreshUser } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    companyname: "",
    email: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [selectedPicture, setSelectedPicture] = useState<File | null>(null);

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await getCurrentUser();
        if (response.success && response.data) {
          const user = response.data;
          setFormData({
            firstname: user.firstname || "",
            lastname: user.lastname || "",
            companyname: user.companyname || "",
            email: user.email || "",
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          
          // Set profile picture if exists
          if (user.picture && user.picture.data) {
            const base64Image = `data:${user.picture.contentType};base64,${user.picture.data}`;
            setProfilePicture(base64Image);
          }
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    if (authUser) {
      loadUserData();
    }
  }, [authUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handlePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handlePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid File",
        description: "Please select an image file",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Store selected file and show preview
    setSelectedPicture(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfilePicture(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate password fields if any password field is filled
      const hasPasswordFields = formData.currentPassword || formData.newPassword || formData.confirmPassword;
      
      if (hasPasswordFields) {
        if (!formData.currentPassword) {
          toast({
            title: "Validation Error",
            description: "Current password is required to change password",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        if (!formData.newPassword) {
          toast({
            title: "Validation Error",
            description: "New password is required",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        if (formData.newPassword.length < 6) {
          toast({
            title: "Validation Error",
            description: "Password must be at least 6 characters long",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
          toast({
            title: "Validation Error",
            description: "New password and confirm password do not match",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        if (formData.currentPassword === formData.newPassword) {
          toast({
            title: "Validation Error",
            description: "New password must be different from your current password",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
      }

      const updateData: {
        firstname: string;
        lastname?: string;
        companyname?: string;
        email: string;
        password?: string;
        currentPassword?: string;
        picture?: File;
      } = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        companyname: formData.companyname,
        email: formData.email,
      };

      if (hasPasswordFields) {
        updateData.password = formData.newPassword;
        updateData.currentPassword = formData.currentPassword;
      }

      if (selectedPicture) {
        updateData.picture = selectedPicture;
      }

      const response = await updateProfile(updateData);
      
      if (response.success) {
        // Refresh user data in context
        await refreshUser();
        
        // Clear password fields and selected picture
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        }));
        setSelectedPicture(null);
        
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        toast({
          title: "Success",
          description: "Profile updated successfully",
        });
      }
    } catch (error: unknown) {
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || "Failed to update profile";
      toast({
        title: "Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getUserInitials = () => {
    const first = formData.firstname?.[0] || "";
    const last = formData.lastname?.[0] || "";
    return (first + last).toUpperCase() || formData.email[0]?.toUpperCase() || "U";
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">Profile Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Profile Picture */}
          <Card className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  {profilePicture ? (
                    <AvatarImage src={profilePicture} alt="Profile" />
                  ) : null}
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={handlePictureClick}
                  className="absolute bottom-0 right-0 p-2 bg-primary rounded-full hover:bg-primary/90 transition-colors"
                >
                  <Camera className="h-4 w-4 text-primary-foreground" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePictureChange}
                  className="hidden"
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Profile Picture</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Upload a new profile picture (Max 5MB)
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePictureClick}
                >
                  Change Picture
                </Button>
              </div>
            </div>
          </Card>

          {/* Personal Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstname">First Name</Label>
                <Input
                  id="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="companyname">Company Name</Label>
                <Input
                  id="companyname"
                  value={formData.companyname}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </Card>

          {/* Password */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-6">Change Password</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Leave blank if you don't want to change your password
            </p>
            <div className="space-y-4 max-w-md">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  placeholder="Enter current password"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  placeholder="Enter new password (min. 6 characters)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.location.reload()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default Profile;
