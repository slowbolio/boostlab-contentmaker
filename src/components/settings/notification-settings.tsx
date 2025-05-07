import { useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { useNotificationSettings } from "@/hooks/use-settings";

const notificationFormSchema = z.object({
  emailUpdates: z.boolean().default(true),
  projectReminders: z.boolean().default(true),
  teamActivity: z.boolean().default(true),
  contentAlerts: z.boolean().default(true),
  performanceReports: z.boolean().default(true),
  marketingEmails: z.boolean().default(false),
  productUpdates: z.boolean().default(true),
});

type NotificationFormValues = z.infer<typeof notificationFormSchema>;

export default function NotificationSettings() {
  const { toast } = useToast();
  const { 
    settings, 
    isLoading: isSettingsLoading, 
    updateNotifications 
  } = useNotificationSettings();

  const form = useForm<NotificationFormValues>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailUpdates: true,
      projectReminders: true,
      teamActivity: true,
      contentAlerts: true,
      performanceReports: true,
      marketingEmails: false,
      productUpdates: true,
    },
  });
  
  // Update form when settings data is loaded
  useEffect(() => {
    if (settings) {
      form.reset(settings);
    }
  }, [settings, form]);

  async function onSubmit(data: NotificationFormValues) {
    try {
      await updateNotifications.mutateAsync(data);
      
      toast({
        title: "Notification settings updated",
        description: "Your notification preferences have been saved.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update settings",
        description: "An error occurred. Please try again later.",
      });
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Choose which notifications you want to receive
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Email Notifications</h3>
              
              <FormField
                control={form.control}
                name="emailUpdates"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                    <div>
                      <FormLabel>Account Updates</FormLabel>
                      <FormDescription className="text-xs">
                        Receive emails about your account activity and security.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="projectReminders"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                    <div>
                      <FormLabel>Project Reminders</FormLabel>
                      <FormDescription className="text-xs">
                        Get notified about upcoming project deadlines and tasks.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="teamActivity"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                    <div>
                      <FormLabel>Team Activity</FormLabel>
                      <FormDescription className="text-xs">
                        Receive notifications when team members make changes or comments.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">Content Notifications</h3>
              
              <FormField
                control={form.control}
                name="contentAlerts"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                    <div>
                      <FormLabel>Content Alerts</FormLabel>
                      <FormDescription className="text-xs">
                        Get notified when content you're monitoring is updated.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="performanceReports"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                    <div>
                      <FormLabel>Performance Reports</FormLabel>
                      <FormDescription className="text-xs">
                        Receive weekly performance insights about your content.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">Marketing Communications</h3>
              
              <FormField
                control={form.control}
                name="marketingEmails"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                    <div>
                      <FormLabel>Marketing Emails</FormLabel>
                      <FormDescription className="text-xs">
                        Receive emails about new features, special offers, and promotions.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="productUpdates"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                    <div>
                      <FormLabel>Product Updates</FormLabel>
                      <FormDescription className="text-xs">
                        Stay informed about new features and improvements.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" disabled={updateNotifications.isPending} className="mt-6">
              {updateNotifications.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Notification Settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </>
  );
}