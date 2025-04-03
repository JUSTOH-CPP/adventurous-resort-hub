
import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2 } from 'lucide-react';
import AuthMiddleware from '@/middleware/AuthMiddleware';

const Profile = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [name, setName] = useState(user?.user_metadata?.name || '');
  const [loading, setLoading] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      
      const { error: updateError } = await supabase.auth.updateUser({
        data: { name }
      });
      
      if (updateError) throw updateError;
      
      // Update the profile in the users table
      const { error: profileError } = await supabase
        .from('users')
        .update({ name })
        .eq('id', user?.id);
        
      if (profileError) throw profileError;
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleChangePassword = async () => {
    try {
      setLoading(true);
      
      // Validate passwords
      if (newPassword !== confirmPassword) {
        toast({
          title: "Passwords Don't Match",
          description: "New password and confirm password must match.",
          variant: "destructive",
        });
        return;
      }
      
      if (newPassword.length < 8) {
        toast({
          title: "Password Too Short",
          description: "Password must be at least 8 characters long.",
          variant: "destructive",
        });
        return;
      }
      
      // First verify the current password by trying to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user?.email || '',
        password: currentPassword,
      });
      
      if (signInError) {
        toast({
          title: "Current Password Incorrect",
          description: "Please enter your current password correctly.",
          variant: "destructive",
        });
        return;
      }
      
      // Update the password
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });
      
      if (updateError) throw updateError;
      
      toast({
        title: "Password Updated",
        description: "Your password has been updated successfully.",
      });
      
      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Error changing password:', error);
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteAccount = async () => {
    try {
      // Delete user data
      const { error: deleteUserDataError } = await supabase
        .from('users')
        .delete()
        .eq('id', user?.id);
        
      if (deleteUserDataError) throw deleteUserDataError;
      
      // Sign out and redirect
      await signOut();
      navigate('/');
      
      toast({
        title: "Account Deleted",
        description: "Your account has been deleted successfully.",
      });
    } catch (error: any) {
      console.error('Error deleting account:', error);
      toast({
        title: "Delete Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };
  
  return (
    <AuthMiddleware>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow container mx-auto px-4 py-10">
          <h1 className="text-3xl font-bold mb-6">My Profile</h1>
          
          <Tabs defaultValue="profile" className="w-full max-w-3xl mx-auto">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="danger">Danger Zone</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user?.email || ''}
                      disabled
                      className="bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleUpdateProfile}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>
                    Update your account password
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={handleChangePassword}
                    disabled={loading || !currentPassword || !newPassword || !confirmPassword}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      "Change Password"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="danger">
              <Card className="border-red-200">
                <CardHeader>
                  <CardTitle className="text-red-500">Danger Zone</CardTitle>
                  <CardDescription>
                    Actions here cannot be undone
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border border-red-200 rounded-lg p-4">
                    <h3 className="font-medium mb-2">Delete Account</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      This will permanently delete your account and all associated data.
                      This action cannot be undone.
                    </p>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive">Delete Account</Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            account and remove all your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={handleDeleteAccount}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete Account
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
        
        <Footer />
      </div>
    </AuthMiddleware>
  );
};

export default Profile;
