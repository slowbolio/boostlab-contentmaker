import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, ArrowRight, BarChart } from "lucide-react";
import CreateTestDialog from "@/components/ab-testing/create-test-dialog";
import { useABTests } from "@/hooks/use-ab-testing";
import { useToast } from "@/components/ui/use-toast";

export default function ABTesting() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const { data: tests, isLoading, error } = useABTests();
  
  if (error) {
    toast({
      variant: "destructive",
      title: "Error loading tests",
      description: "Failed to load A/B tests. Please refresh the page.",
    });
  }

  const filteredTests = tests?.filter(test => 
    activeTab === "active" 
      ? test.status === "active" || test.status === "draft" 
      : test.status === "completed"
  ) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">A/B Testing</h1>
          <p className="text-muted-foreground">
            Create and manage A/B tests for your content
          </p>
        </div>
        <div className="hidden sm:block">
          <CreateTestDialog />
        </div>
      </div>

      <div className="flex space-x-4 border-b">
        <button
          className={`pb-2 text-sm font-medium ${
            activeTab === "active"
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("active")}
        >
          Active Tests
        </button>
        <button
          className={`pb-2 text-sm font-medium ${
            activeTab === "completed"
              ? "border-b-2 border-primary text-foreground"
              : "text-muted-foreground"
          }`}
          onClick={() => setActiveTab("completed")}
        >
          Completed Tests
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="opacity-60">
              <CardHeader>
                <div className="h-6 w-3/4 rounded-md bg-muted animate-pulse mb-2"></div>
                <div className="h-4 w-1/2 rounded-md bg-muted animate-pulse"></div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="h-4 w-full rounded-md bg-muted animate-pulse"></div>
                <div className="h-4 w-full rounded-md bg-muted animate-pulse"></div>
                <div className="h-4 w-3/4 rounded-md bg-muted animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {activeTab === "active" && (
            <Card className="bg-primary/5 border-dashed border-primary/20">
              <CardHeader className="flex items-center justify-center pt-8">
                <Lightbulb className="h-12 w-12 text-primary opacity-80" />
              </CardHeader>
              <CardContent className="flex flex-col items-center text-center">
                <CardTitle className="text-xl mt-4">Create New A/B Test</CardTitle>
                <CardDescription className="mt-2 mb-4">
                  Test different versions of your content to see which performs better.
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-center pb-8">
                <CreateTestDialog />
              </CardFooter>
            </Card>
          )}

          {filteredTests.length > 0 ? (
            filteredTests.map((test) => (
              <Card key={test.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">{test.title}</CardTitle>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      test.status === "active" 
                        ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" 
                        : test.status === "draft"
                        ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
                        : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                    }`}>
                      {test.status === "active" ? "Active" : test.status === "draft" ? "Draft" : "Completed"}
                    </div>
                  </div>
                  <CardDescription>{new Date(test.created_at).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Variants</span>
                    <span>{test.variants?.length || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Total views</span>
                    <span>{test.metrics?.total_impressions || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Conversion rate</span>
                    <span>{(test.metrics?.conversion_rate || 0).toFixed(2)}%</span>
                  </div>
                  {test.status === "completed" && test.winner_id && (
                    <div className="flex justify-between text-sm font-medium">
                      <span>Winner</span>
                      <span className="text-primary">
                        {test.variants?.find(v => v.id === test.winner_id)?.title || "Unknown"}
                      </span>
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => navigate(`/ab-testing/${test.id}`)}
                  >
                    {test.status === "active" ? (
                      <>
                        <BarChart className="mr-2 h-4 w-4" />
                        Visa resultat
                      </>
                    ) : (
                      <>
                        <ArrowRight className="mr-2 h-4 w-4" />
                        Visa detaljer
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">
                {activeTab === "active" 
                  ? "No active tests found. Create your first A/B test!" 
                  : "No completed tests found."}
              </p>
            </div>
          )}
        </div>
      )}
      
      <div className="sm:hidden">
        <CreateTestDialog />
      </div>
    </div>
  );
}