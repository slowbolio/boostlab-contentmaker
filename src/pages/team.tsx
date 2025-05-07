import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function Team() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground">
            Manage your team members and permissions
          </p>
        </div>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Member
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Team Members</CardTitle>
          <CardDescription>
            Manage access and permissions for your team
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border p-8 text-center">
            <p className="text-muted-foreground">
              Team management interface will be implemented here
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}