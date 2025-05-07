import { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

interface SettingsLayoutProps {
  defaultTab?: string;
  children: ReactNode;
}

export default function SettingsLayout({ defaultTab = "profile", children }: SettingsLayoutProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences
        </p>
      </div>
      
      <Tabs defaultValue={defaultTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 lg:grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="integrations" className="hidden lg:inline-flex">Integrations</TabsTrigger>
        </TabsList>
        
        {children}
      </Tabs>
    </div>
  );
}