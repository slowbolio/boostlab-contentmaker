import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import SettingsLayout from "@/components/settings/settings-layout";
import ProfileSettings from "@/components/settings/profile-settings";
import AccountSettings from "@/components/settings/account-settings";
import AppearanceSettings from "@/components/settings/appearance-settings";
import NotificationSettings from "@/components/settings/notification-settings";
import IntegrationSettings from "@/components/settings/integration-settings";

export default function Settings() {
  return (
    <SettingsLayout defaultTab="profile">
      <TabsContent value="profile">
        <Card>
          <ProfileSettings />
        </Card>
      </TabsContent>
      
      <TabsContent value="account">
        <Card>
          <AccountSettings />
        </Card>
      </TabsContent>
      
      <TabsContent value="appearance">
        <Card>
          <AppearanceSettings />
        </Card>
      </TabsContent>
      
      <TabsContent value="notifications">
        <Card>
          <NotificationSettings />
        </Card>
      </TabsContent>
      
      <TabsContent value="integrations">
        <Card>
          <IntegrationSettings />
        </Card>
      </TabsContent>
    </SettingsLayout>
  );
}