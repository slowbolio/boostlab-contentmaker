import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { useCreateABTest } from "@/hooks/use-ab-testing";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  content: z.string().min(20, "Content must be at least 20 characters"),
  generateWithAI: z.boolean().default(true),
  numVariants: z.number().min(2).max(4),
});

type FormValues = z.infer<typeof formSchema>;

export default function CreateTestForm({ onSuccess }: { onSuccess?: () => void }) {
  const { toast } = useToast();
  const [variantCount, setVariantCount] = useState<number>(2);
  const createTestMutation = useCreateABTest();
  
  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
      generateWithAI: true,
      numVariants: 2,
    },
  });

  const generateWithAI = watch("generateWithAI");

  const onSubmit = async (data: FormValues) => {
    try {
      await createTestMutation.mutateAsync({
        ...data,
        num_variants: variantCount,
      });
      
      toast({
        title: "A/B Test Created",
        description: "Your new A/B test has been successfully created.",
      });

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to create A/B test",
        description: "An error occurred while creating your test. Please try again.",
      });
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardHeader>
          <CardTitle>Create A/B Test</CardTitle>
          <CardDescription>
            Create a new A/B test to optimize your content performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Test Title</Label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Test Description</Label>
            <Textarea id="description" {...register("description")} />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="content">Original Content</Label>
            <Textarea 
              id="content" 
              {...register("content")} 
              className="min-h-[120px]"
              placeholder="Enter your original content here. This will be used as the control version."
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content.message}</p>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="generateWithAI"
              {...register("generateWithAI")}
              defaultChecked
            />
            <Label htmlFor="generateWithAI">Generate variants with AI</Label>
          </div>
          
          {generateWithAI && (
            <div className="space-y-2">
              <Label>Number of Variants</Label>
              <div className="flex space-x-2">
                {[2, 3, 4].map((num) => (
                  <Button
                    key={num}
                    type="button"
                    variant={variantCount === num ? "default" : "outline"}
                    onClick={() => setVariantCount(num)}
                    className="flex-1"
                  >
                    {num}
                  </Button>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Select how many variants to generate in addition to your original content.
              </p>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={createTestMutation.isPending}
          >
            {createTestMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Create A/B Test
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}