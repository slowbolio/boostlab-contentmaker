import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, AlertCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { usePasswordUpdate, useAccountDeletion } from "@/hooks/use-account";

const passwordFormSchema = z.object({
  currentPassword: z.string().min(1, {
    message: "Current password is required.",
  }),
  newPassword: z.string().min(8, {
    message: "New password must be at least 8 characters.",
  }).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
  }),
  confirmPassword: z.string().min(1, {
    message: "Confirm password is required.",
  }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordFormSchema>;

export default function AccountSettings() {
  const { toast } = useToast();
  const passwordUpdate = usePasswordUpdate();
  const accountDeletion = useAccountDeletion();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(data: PasswordFormValues) {
    try {
      await passwordUpdate.mutateAsync({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      
      toast({
        title: "Password updated",
        description: "Your password has been updated successfully.",
      });
      form.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update password",
        description: "An error occurred. Please check your current password and try again.",
      });
    }
  }
  
  async function handleDeleteAccount() {
    try {
      await accountDeletion.mutateAsync();
      toast({
        title: "Account deleted",
        description: "Your account has been successfully deleted.",
      });
      // In a real app, this would redirect to a logged-out state
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to delete account",
        description: "An error occurred. Please try again later.",
      });
    } finally {
      setShowDeleteConfirm(false);
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Account Security</CardTitle>
        <CardDescription>
          Update your password and manage account security options
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormDescription>
                    Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="pt-4">
              <Button type="submit" disabled={passwordUpdate.isPending}>
                {passwordUpdate.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Password
              </Button>
            </div>
          </form>
        </Form>
        
        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-medium">Delete Account</h3>
          <p className="text-sm text-muted-foreground mt-2 mb-4">
            Permanently delete your account and all of your content.
            This action cannot be undone.
          </p>
          
          {!showDeleteConfirm ? (
            <Button 
              variant="destructive" 
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </Button>
          ) : (
            <div className="space-y-2">
              <p className="text-sm font-medium text-destructive flex items-center">
                <AlertCircle className="h-4 w-4 mr-2" />
                Are you sure you want to delete your account?
              </p>
              <div className="flex space-x-2">
                <Button 
                  variant="destructive" 
                  onClick={handleDeleteAccount}
                  disabled={accountDeletion.isPending}
                >
                  {accountDeletion.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Yes, Delete My Account
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </>
  );
}