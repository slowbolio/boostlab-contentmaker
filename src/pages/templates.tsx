import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useTemplates, useTemplatesByPlatform } from "@/hooks/use-templates";
import { Instagram, Facebook, Linkedin, Twitter, BookOpen, EyeIcon, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Templates() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activePlatform, setActivePlatform] = useState("all");
  const { data: templates, isLoading, error } = useTemplatesByPlatform(activePlatform);
  
  if (error) {
    toast({
      title: "Error loading templates",
      description: "Failed to load content templates. Please refresh the page.",
      variant: "destructive"
    });
  }

  // Filter templates based on search query
  const filteredTemplates = templates?.filter(template => 
    template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="h-5 w-5" />;
      case 'facebook':
        return <Facebook className="h-5 w-5" />;
      case 'linkedin':
        return <Linkedin className="h-5 w-5" />;
      case 'twitter':
        return <Twitter className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };

  const handleUseTemplate = (template: any) => {
    if (template.premium) {
      toast({
        title: "Premium mall",
        description: "Denna mall kräver premium-prenumeration.",
        variant: "destructive"
      });
      return;
    }
    
    // Visa bekräftelse att mallen har valts
    toast({
      title: "Mall vald",
      description: `Du har valt mallen "${template.title}". Du kommer att omdirigeras till innehållsskaparen.`,
    });
    
    // Kort fördröjning för att visa toast innan omdirigering
    setTimeout(() => {
      // Navigate to content creator with selected template
      navigate('/content-creator', { 
        state: { 
          template: template,
          fromTemplates: true
        }
      });
    }, 500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Innehållsmallar</h1>
        <p className="text-muted-foreground">
          Utforska och använd professionella mallar för ditt innehåll
        </p>
      </div>
      
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <Input
          placeholder="Sök efter mallar..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
      </div>
      
      <Tabs defaultValue="all" onValueChange={setActivePlatform}>
        <TabsList>
          <TabsTrigger value="all" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            <span>Alla</span>
          </TabsTrigger>
          <TabsTrigger value="instagram" className="flex items-center gap-2">
            <Instagram className="h-4 w-4" />
            <span>Instagram</span>
          </TabsTrigger>
          <TabsTrigger value="facebook" className="flex items-center gap-2">
            <Facebook className="h-4 w-4" />
            <span>Facebook</span>
          </TabsTrigger>
          <TabsTrigger value="linkedin" className="flex items-center gap-2">
            <Linkedin className="h-4 w-4" />
            <span>LinkedIn</span>
          </TabsTrigger>
          <TabsTrigger value="twitter" className="flex items-center gap-2">
            <Twitter className="h-4 w-4" />
            <span>Twitter</span>
          </TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          {isLoading ? (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
            <>
              {filteredTemplates && filteredTemplates.length > 0 ? (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredTemplates.map((template) => (
                    <Card key={template.id} className={`overflow-hidden transition-all hover:shadow-md ${template.premium ? 'border-amber-500/50' : ''}`}>
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <div className="space-y-1">
                            <CardTitle className="text-base">{template.title}</CardTitle>
                            <CardDescription>{template.description}</CardDescription>
                          </div>
                          <div className={`p-2 rounded-full ${
                            template.platform === 'instagram' ? 'bg-pink-500/10 text-pink-500' :
                            template.platform === 'facebook' ? 'bg-blue-500/10 text-blue-500' :
                            template.platform === 'linkedin' ? 'bg-sky-500/10 text-sky-500' :
                            template.platform === 'twitter' ? 'bg-cyan-500/10 text-cyan-500' :
                            'bg-slate-500/10 text-slate-500'
                          }`}>
                            {getPlatformIcon(template.platform)}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-3">
                        <div className="bg-muted p-3 rounded-md max-h-32 overflow-hidden relative text-xs text-muted-foreground">
                          {template.template.slice(0, 150)}
                          {template.template.length > 150 && '...'}
                          {template.premium && (
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 flex items-end justify-center pb-4">
                              <Badge variant="outline" className="flex items-center gap-1 border-amber-500/50 text-amber-500">
                                <Lock className="h-3 w-3" />
                                <span>Premium</span>
                              </Badge>
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between pt-3">
                        <div className="flex flex-wrap gap-2">
                          {template.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {template.tags.length > 2 && <Badge variant="secondary" className="text-xs">+{template.tags.length - 2}</Badge>}
                        </div>
                        <Button size="sm" onClick={() => handleUseTemplate(template)}>
                          <EyeIcon className="h-4 w-4 mr-2" />
                          Använd
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium">Inga mallar hittades</h3>
                  <p className="text-muted-foreground mt-2">
                    Prova en annan sökterm eller välj en annan kategori
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </Tabs>
    </div>
  );
}