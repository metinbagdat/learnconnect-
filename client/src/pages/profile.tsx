import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Badge, Lock, Bell, Globe } from "lucide-react";

// Profile update schema
const profileSchema = z.object({
  displayName: z.string().min(2, "Display name must be at least 2 characters"),
  avatarUrl: z.string().optional(),
});

// Password change schema
const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// Notification preferences schema
const notificationSchema = z.object({
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  pushNotifications: z.boolean().default(true),
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;
type NotificationFormValues = z.infer<typeof notificationSchema>;

export default function Profile() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isUpdating, setIsUpdating] = useState(false);

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: user?.displayName || "",
      avatarUrl: user?.avatarUrl || "",
    },
  });

  // Password form
  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Notification preferences form (mock for UI since there's no backend support yet)
  const notificationForm = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
    },
  });

  // Update profile handler
  const onProfileSubmit = async (data: ProfileFormValues) => {
    if (!user) return;
    
    setIsUpdating(true);
    try {
      await apiRequest("PATCH", `/api/user/${user.id}`, data);
      
      // Update cache
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated",
      });
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was a problem updating your profile",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Change password handler (mock since we don't have a real endpoint)
  const onPasswordSubmit = async (data: PasswordFormValues) => {
    setIsUpdating(true);
    try {
      // This would make a real API call in a production app
      // await apiRequest("POST", "/api/user/change-password", data);
      
      // For now, just show success
      setTimeout(() => {
        toast({
          title: "Password Changed",
          description: "Your password has been successfully updated",
        });
        passwordForm.reset({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        setIsUpdating(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was a problem updating your password",
        variant: "destructive",
      });
      setIsUpdating(false);
    }
  };

  // Notification preferences handler (mock)
  const onNotificationSubmit = async (data: NotificationFormValues) => {
    setIsUpdating(true);
    try {
      // This would make a real API call in a production app
      // await apiRequest("POST", "/api/user/notification-preferences", data);
      
      // For now, just show success
      setTimeout(() => {
        toast({
          title: "Preferences Saved",
          description: "Your notification preferences have been updated",
        });
        setIsUpdating(false);
      }, 1000);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "There was a problem saving your preferences",
        variant: "destructive",
      });
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      {/* Sidebar - Desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <div className="flex flex-col flex-1 w-0 overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white border-b border-neutral-100 flex items-center justify-between px-4">
          <div className="flex items-center">
            <svg className="w-8 h-8 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838l-2.727 1.17 5.727 2.45a1 1 0 00.788 0l7-3a1 1 0 000-1.841l-7-3z"></path>
              <path d="M2.492 8.825l-.787.335c-.483.207-.795.712-.551 1.168.192.357.667.511 1.033.351l1.298-.558-.992-1.296zm10.665 2.31l-7.673 3.291c-.481.206-.796.71-.551 1.168.192.357.667.511 1.033.351l8.235-3.529c.392-.168.446-.707.098-.99-.27-.22-.67-.235-.968-.106l-.174.075v-.26z"></path>
            </svg>
            <span className="ml-2 text-xl font-semibold text-neutral-900">EduLearn</span>
          </div>
        </div>
        
        {/* Main Content */}
        <main className="flex-1 relative overflow-y-auto focus:outline-none pb-16 md:pb-0">
          <div className="py-6">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
              <h1 className="text-2xl font-bold text-neutral-900">Profile Settings</h1>
              <p className="mt-1 text-sm text-neutral-600">Manage your account preferences and settings</p>
              
              <div className="mt-8">
                <Tabs defaultValue="profile">
                  <TabsList className="w-full grid grid-cols-3 mb-8">
                    <TabsTrigger value="profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </TabsTrigger>
                    <TabsTrigger value="security" className="flex items-center">
                      <Lock className="mr-2 h-4 w-4" />
                      <span>Security</span>
                    </TabsTrigger>
                    <TabsTrigger value="notifications" className="flex items-center">
                      <Bell className="mr-2 h-4 w-4" />
                      <span>Notifications</span>
                    </TabsTrigger>
                  </TabsList>
                  
                  {/* Profile Settings Tab */}
                  <TabsContent value="profile">
                    <Card>
                      <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>
                          Update your profile information
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {/* Profile Picture */}
                        <div className="flex items-center mb-6">
                          <div className="relative">
                            <img 
                              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow" 
                              src={user?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=128&q=80"} 
                              alt="Profile" 
                            />
                            <Button 
                              size="sm" 
                              variant="secondary" 
                              className="absolute -bottom-2 -right-2 rounded-full"
                            >
                              Change
                            </Button>
                          </div>
                          <div className="ml-6">
                            <h3 className="font-medium text-neutral-900">{user?.displayName}</h3>
                            <p className="text-sm text-neutral-500 capitalize">{user?.role}</p>
                          </div>
                        </div>
                        
                        <Form {...profileForm}>
                          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                            <FormField
                              control={profileForm.control}
                              name="displayName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Display Name</FormLabel>
                                  <FormControl>
                                    <Input placeholder="Your name" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    This is the name that will be displayed to other users.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={profileForm.control}
                              name="avatarUrl"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Profile Picture URL</FormLabel>
                                  <FormControl>
                                    <Input placeholder="https://example.com/avatar.jpg" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Enter a URL for your profile picture.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="flex items-center space-x-4">
                              <Button type="submit" disabled={isUpdating || !profileForm.formState.isDirty}>
                                {isUpdating ? "Saving..." : "Save Changes"}
                              </Button>
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => profileForm.reset()} 
                                disabled={isUpdating || !profileForm.formState.isDirty}
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                    
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                        <CardDescription>
                          Your account details
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                            <div>
                              <p className="text-sm font-medium text-neutral-900">Username</p>
                              <p className="text-sm text-neutral-500">{user?.username}</p>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2 border-b border-neutral-100">
                            <div>
                              <p className="text-sm font-medium text-neutral-900">Role</p>
                              <p className="text-sm text-neutral-500 capitalize">{user?.role}</p>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center py-2">
                            <div>
                              <p className="text-sm font-medium text-neutral-900">Account Status</p>
                              <p className="text-sm text-success">Active</p>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Security Tab */}
                  <TabsContent value="security">
                    <Card>
                      <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>
                          Update your password to ensure account security
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Form {...passwordForm}>
                          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                            <FormField
                              control={passwordForm.control}
                              name="currentPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Current Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Enter your current password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={passwordForm.control}
                              name="newPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>New Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Enter your new password" {...field} />
                                  </FormControl>
                                  <FormDescription>
                                    Password must be at least 8 characters with uppercase, lowercase, and numbers.
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <FormField
                              control={passwordForm.control}
                              name="confirmPassword"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Confirm New Password</FormLabel>
                                  <FormControl>
                                    <Input type="password" placeholder="Confirm your new password" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="flex items-center space-x-4">
                              <Button type="submit" disabled={isUpdating || !passwordForm.formState.isDirty}>
                                {isUpdating ? "Updating..." : "Update Password"}
                              </Button>
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => passwordForm.reset()} 
                                disabled={isUpdating || !passwordForm.formState.isDirty}
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        </Form>
                      </CardContent>
                    </Card>
                    
                    <Card className="mt-6">
                      <CardHeader>
                        <CardTitle>Login Sessions</CardTitle>
                        <CardDescription>
                          Manage your active sessions
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center p-4 bg-primary-50 rounded-lg">
                            <div className="flex items-center">
                              <Globe className="h-5 w-5 text-primary mr-3" />
                              <div>
                                <p className="text-sm font-medium text-neutral-900">Current Session</p>
                                <p className="text-xs text-neutral-500">Started 2 hours ago • Web Browser</p>
                              </div>
                            </div>
                            <div>
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success bg-opacity-10 text-success">
                                Active
                              </span>
                            </div>
                          </div>
                          
                          <Button variant="destructive" className="w-full">Sign Out Of All Sessions</Button>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                  
                  {/* Notifications Tab */}
                  <TabsContent value="notifications">
                    <Card>
                      <CardHeader>
                        <CardTitle>Notification Preferences</CardTitle>
                        <CardDescription>
                          Manage how you receive notifications
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-6">
                          <div className="space-y-4">
                            <h3 className="text-sm font-medium text-neutral-900">Email Notifications</h3>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-neutral-900">Course Updates</p>
                                <p className="text-xs text-neutral-500">Receive notifications when courses are updated</p>
                              </div>
                              <div className="ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-primary text-white hover:bg-primary/90"
                                >
                                  Enabled
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-neutral-900">Assignment Reminders</p>
                                <p className="text-xs text-neutral-500">Receive reminders for upcoming assignments</p>
                              </div>
                              <div className="ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-primary text-white hover:bg-primary/90"
                                >
                                  Enabled
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-neutral-900">Marketing Communications</p>
                                <p className="text-xs text-neutral-500">Receive promotional emails and special offers</p>
                              </div>
                              <div className="ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                >
                                  Disabled
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <h3 className="text-sm font-medium text-neutral-900">Push Notifications</h3>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-neutral-900">New Content Alerts</p>
                                <p className="text-xs text-neutral-500">Get notified when new content is available</p>
                              </div>
                              <div className="ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-primary text-white hover:bg-primary/90"
                                >
                                  Enabled
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-neutral-900">Discussion Replies</p>
                                <p className="text-xs text-neutral-500">Get notified when someone replies to your comments</p>
                              </div>
                              <div className="ml-4">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="bg-primary text-white hover:bg-primary/90"
                                >
                                  Enabled
                                </Button>
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-4 border-t border-neutral-100">
                            <Button>Save Preferences</Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden">
        <MobileNav />
      </div>
    </div>
  );
}
