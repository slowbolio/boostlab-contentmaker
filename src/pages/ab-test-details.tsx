import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";
import { useABTest } from "@/hooks/use-ab-testing";
import { ABTestResults } from "@/components/ab-testing/test-results";

export default function ABTestDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { data: test, isLoading, error } = useABTest(parseInt(id || '0'));

  // När vi navigerar tillbaka till listan
  const handleBackToList = () => {
    navigate('/ab-testing');
  };

  useEffect(() => {
    if (error) {
      toast({
        title: "Fel vid hämtning av testdetaljer",
        description: "Kunde inte hämta information om det begärda testet.",
        variant: "destructive"
      });
    }
  }, [error, toast]);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={handleBackToList} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Tillbaka
          </Button>
          <div className="h-8 w-1/3 rounded-md bg-muted animate-pulse"></div>
        </div>
        <div className="space-y-4">
          <div className="h-72 rounded-md bg-muted animate-pulse"></div>
          <div className="h-96 rounded-md bg-muted animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={handleBackToList}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Tillbaka till tester
        </Button>
        <div className="text-center py-12">
          <h2 className="text-xl font-bold mb-2">Test hittades inte</h2>
          <p className="text-muted-foreground">
            Det begärda testet kunde inte hittas eller har tagits bort.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={handleBackToList} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Tillbaka till tester
      </Button>

      <ABTestResults
        testId={test.id.toString()}
        testTitle={test.title}
        testDescription={test.description}
        status={test.status}
        dateCreated={test.created_at}
        dateCompleted={test.completed_at}
      />
    </div>
  );
}