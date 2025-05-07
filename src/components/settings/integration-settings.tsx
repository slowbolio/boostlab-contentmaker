import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Switch } from "@/components/ui/switch";
import { Loader2, ExternalLink, Check, X } from "lucide-react";
import { useIntegrationSettings } from "@/hooks/use-settings";
import { setUseRealBackend } from "@/components/initialization";

const integrationFormSchema = z.object({
  apiKey: z.string().optional(),
  openAIApiKey: z.string().optional(),
  googleAnalyticsId: z.string().optional(),
  wordpressUrl: z.string().url().optional().or(z.literal("")),
  wordpressUsername: z.string().optional(),
  wordpressAppPassword: z.string().optional(),
  enableTwitter: z.boolean().default(false),
  enableFacebook: z.boolean().default(false),
  enableLinkedin: z.boolean().default(false),
  enableOpenRouterBackend: z.boolean().default(false),
  openRouterApiKey: z.string().optional(),
});

type IntegrationFormValues = z.infer<typeof integrationFormSchema>;

export default function IntegrationSettings() {
  const { toast } = useToast();
  const [apiKeyVisible, setApiKeyVisible] = useState(false);
  const [openRouterKeyVisible, setOpenRouterKeyVisible] = useState(false);
  const { 
    settings, 
    isLoading: isSettingsLoading, 
    updateIntegrations 
  } = useIntegrationSettings();

  // Check if OpenRouter backend is enabled
  const [isOpenRouterEnabled, setIsOpenRouterEnabled] = useState(
    localStorage.getItem('useRealBackend') === 'true'
  );

  const form = useForm<IntegrationFormValues>({
    resolver: zodResolver(integrationFormSchema),
    defaultValues: {
      apiKey: "",
      openAIApiKey: "",
      googleAnalyticsId: "",
      wordpressUrl: "",
      wordpressUsername: "",
      wordpressAppPassword: "",
      enableTwitter: false,
      enableFacebook: false,
      enableLinkedin: false,
      enableOpenRouterBackend: isOpenRouterEnabled,
      openRouterApiKey: localStorage.getItem('openRouterApiKey') || "",
    },
  });
  
  // Update form when settings data is loaded
  useEffect(() => {
    if (settings) {
      const mergedSettings = {
        ...settings,
        enableOpenRouterBackend: isOpenRouterEnabled,
        openRouterApiKey: localStorage.getItem('openRouterApiKey') || "",
      };
      form.reset(mergedSettings);
    }
  }, [settings, form, isOpenRouterEnabled]);

  async function onSubmit(data: IntegrationFormValues) {
    try {
      // Handle OpenRouter backend toggle
      if (data.enableOpenRouterBackend !== isOpenRouterEnabled) {
        setIsOpenRouterEnabled(data.enableOpenRouterBackend);
        setUseRealBackend(data.enableOpenRouterBackend);
      }
      
      // Save OpenRouter API key
      if (data.openRouterApiKey) {
        localStorage.setItem('openRouterApiKey', data.openRouterApiKey);
      }
      
      // Update other integration settings
      await updateIntegrations.mutateAsync(data);
      
      toast({
        title: "Integration settings updated",
        description: "Your integration settings have been saved successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to update integrations",
        description: "An error occurred. Please try again later.",
      });
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle>Integrations</CardTitle>
        <CardDescription>
          Connect your account to external services and platforms
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* OpenRouter Backend Integration Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">OpenRouter Backend Integration</h3>
              
              <FormField
                control={form.control}
                name="enableOpenRouterBackend"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                    <div>
                      <FormLabel>Enable OpenRouter Backend</FormLabel>
                      <FormDescription className="text-xs">
                        Use the OpenRouter backend for enhanced AI features and data persistence.
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
              
              {form.watch("enableOpenRouterBackend") && (
                <FormField
                  control={form.control}
                  name="openRouterApiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>OpenRouter API Key</FormLabel>
                      <div className="flex space-x-2">
                        <FormControl>
                          <Input 
                            type={openRouterKeyVisible ? "text" : "password"} 
                            placeholder="sk-or-v1-xxxxxxxx" 
                            {...field} 
                          />
                        </FormControl>
                        <Button 
                          type="button" 
                          variant="outline" 
                          size="icon"
                          onClick={() => setOpenRouterKeyVisible(!openRouterKeyVisible)}
                        >
                          {openRouterKeyVisible ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                        </Button>
                      </div>
                      <FormDescription>
                        Your OpenRouter API key for accessing multiple AI models.{" "}
                        <a 
                          href="https://openrouter.ai/keys" 
                          target="_blank" 
                          rel="noreferrer"
                          className="text-primary inline-flex items-center hover:underline"
                        >
                          Get your API key
                          <ExternalLink className="ml-1 h-3 w-3" />
                        </a>
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            {/* Original Integration Sections */}
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">API Keys</h3>
              
              <FormField
                control={form.control}
                name="apiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content Maker API Key</FormLabel>
                    <div className="flex space-x-2">
                      <FormControl>
                        <Input 
                          type={apiKeyVisible ? "text" : "password"} 
                          placeholder="Enter your API key" 
                          {...field} 
                        />
                      </FormControl>
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="icon"
                        onClick={() => setApiKeyVisible(!apiKeyVisible)}
                      >
                        {apiKeyVisible ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                      </Button>
                    </div>
                    <FormDescription>
                      Your API key for accessing the Content Maker API.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="openAIApiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>OpenAI API Key</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your OpenAI API key" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Used for custom AI content generation.{" "}
                      <a 
                        href="https://platform.openai.com/api-keys" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-primary inline-flex items-center hover:underline"
                      >
                        Get your API key
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="googleAnalyticsId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Analytics ID</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="UA-XXXXXXXXX-X or G-XXXXXXXXXX" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Used for tracking content performance.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">WordPress Integration</h3>
              
              <FormField
                control={form.control}
                name="wordpressUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WordPress Site URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://your-site.com" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Your WordPress site URL.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="wordpressUsername"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WordPress Username</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Enter your WordPress username" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="wordpressAppPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WordPress Application Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter your WordPress application password" 
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      Generate an application password in your WordPress admin.{" "}
                      <a 
                        href="https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/" 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-primary inline-flex items-center hover:underline"
                      >
                        Learn more
                        <ExternalLink className="ml-1 h-3 w-3" />
                      </a>
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="space-y-4 pt-4 border-t">
              <h3 className="text-lg font-medium">Social Media Integrations</h3>
              
              <FormField
                control={form.control}
                name="enableTwitter"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                    <div>
                      <FormLabel>Twitter / X</FormLabel>
                      <FormDescription className="text-xs">
                        Allow sharing content directly to Twitter/X.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    {field.value && (
                      <Button type="button" variant="outline" size="sm" className="absolute right-16">
                        Connect
                      </Button>
                    )}
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="enableFacebook"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                    <div>
                      <FormLabel>Facebook</FormLabel>
                      <FormDescription className="text-xs">
                        Allow sharing content directly to Facebook.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    {field.value && (
                      <Button type="button" variant="outline" size="sm" className="absolute right-16">
                        Connect
                      </Button>
                    )}
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="enableLinkedin"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between p-3 border rounded-md">
                    <div>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormDescription className="text-xs">
                        Allow sharing content directly to LinkedIn.
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    {field.value && (
                      <Button type="button" variant="outline" size="sm" className="absolute right-16">
                        Connect
                      </Button>
                    )}
                  </FormItem>
                )}
              />
            </div>
            
            <Button type="submit" disabled={updateIntegrations.isPending} className="mt-6">
              {updateIntegrations.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Integration Settings
            </Button>
          </form>
        </Form>
      </CardContent>
    </>
  );
}