import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EnhancedAIAssistant } from "@/components/content/enhanced-ai-assistant";
import { AIContentPreview } from "@/components/content/ai-content-preview";
import SEOAnalyzer from "@/components/seo/seo-analyzer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { Save, Send, FileText, Search, BarChart, Edit, ExternalLink, Loader2 } from "lucide-react";
import { ContentTemplate } from "@/services/templates-service";
import { useAuthContext } from "@/contexts/auth-context";
import { useCreateProjectCombined } from "@/hooks/use-projects-combined";

export default function ContentCreator() {
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [contentTitle, setContentTitle] = useState('');
  const [contentText, setContentText] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [showSeoAnalysis, setShowSeoAnalysis] = useState(false);
  const [seoScore, setSeoScore] = useState<number | null>(null);
  const [originalTemplate, setOriginalTemplate] = useState<ContentTemplate | null>(null);
  
  // Use the combined create project mutation that works with both backend implementations
  const createProjectMutation = useCreateProjectCombined();
  
  // Kontrollera om vi har fått en mall från templates-sidan eller ett projekt från saved-projects
  useEffect(() => {
    const state = location.state as { 
      template?: ContentTemplate, 
      fromTemplates?: boolean,
      project?: any,
      fromSavedProjects?: boolean 
    } | null;
    
    if (state?.fromTemplates && state.template) {
      const template = state.template;
      
      // Spara originalmallen för att kunna återställa senare
      setOriginalTemplate(template);
      
      // Fyll i innehåll från mallen
      setContentTitle(template.title || '');
      setContentText(template.template || '');
      setSelectedPlatform(template.platform || '');
      
      // Lägg till taggarna som nyckelord
      if (template.tags && template.tags.length > 0) {
        setKeywords(template.tags);
      }
      
      // Visa en bekräftelse till användaren
      toast({
        title: "Mall laddad",
        description: `Mallen "${template.title}" har laddats in. Anpassa innehållet efter dina behov.`,
      });
    } 
    else if (state?.fromSavedProjects && state.project) {
      const project = state.project;
      
      // Fyll i innehåll från det sparade projektet
      setContentTitle(project.title || '');
      setContentText(project.content || '');
      setMetaDescription(project.description || '');
      setSelectedPlatform(project.platform || '');
      
      // Lägg till taggarna som nyckelord
      if (project.tags && project.tags.length > 0) {
        setKeywords(project.tags);
      }
      
      // Visa en bekräftelse till användaren
      toast({
        title: "Projekt laddat",
        description: `Projektet "${project.title}" har laddats för redigering.`,
      });
    }
  }, [location.state, toast]);
  
  // Funktion för att återställa mallinnehållet
  const resetTemplateContent = () => {
    if (originalTemplate) {
      setContentText(originalTemplate.template || '');
      toast({
        title: "Innehåll återställt",
        description: "Mallinnehållet har återställts till ursprungligt skick.",
      });
    }
  };

  const handleCreate = () => {
    if (!contentTitle.trim()) {
      toast({
        title: "Titel krävs",
        description: "Ange en titel för ditt innehåll.",
        variant: "destructive"
      });
      return;
    }

    if (!contentText.trim()) {
      toast({
        title: "Innehåll krävs",
        description: "Ange innehåll att publicera.",
        variant: "destructive"
      });
      return;
    }

    setIsCreating(true);

    // Först sparar vi projektet
    handleSaveProject().then(() => {
      toast({
        title: "Innehåll skapat",
        description: "Ditt innehåll har skapats och sparats som utkast."
      });
      setIsCreating(false);
    }).catch(() => {
      setIsCreating(false);
    });
  };
  
  const handleSaveProject = async () => {
    if (!contentTitle.trim()) {
      toast({
        title: "Titel krävs",
        description: "Ange en titel för att spara projektet.",
        variant: "destructive"
      });
      return Promise.reject("Titel krävs");
    }

    setIsSaving(true);
    
    try {
      // Prepare project data - works for both backend implementations
      const projectData = {
        title: contentTitle,
        description: metaDescription || undefined,
        content: contentText,
        platform: selectedPlatform || undefined,
        tags: keywords.length > 0 ? keywords : undefined,
        status: 'draft',
        author: {
          id: user?.id?.toString() || '1',
          name: user?.name || 'Användare'
        }
      };
      
      // Create project using the combined mutation
      const newProject = await createProjectMutation.mutateAsync(projectData);
      
      toast({
        title: "Projekt sparat",
        description: "Ditt innehåll har sparats som ett projekt."
      });
      
      return newProject;
    } catch (error) {
      console.error('Error saving project:', error);
      toast({
        title: "Kunde inte spara",
        description: "Ett fel uppstod när projektet skulle sparas.",
        variant: "destructive"
      });
      return Promise.reject(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApplySuggestion = (newContent: string) => {
    setContentText(newContent);
  };
  
  const handleAddKeyword = (keyword: string) => {
    if (keyword.trim() && !keywords.includes(keyword.trim())) {
      setKeywords([...keywords, keyword.trim()]);
    }
  };

  const handleAnalysisComplete = (score: number) => {
    setSeoScore(score);
  };
  
  const toggleSeoAnalysis = () => {
    setShowSeoAnalysis(!showSeoAnalysis);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Innehållsgenerator</h1>
          <p className="text-muted-foreground">
            Skapa innehåll med AI-assistans för dina sociala medier
          </p>
        </div>
        <Link to="/advanced-editor">
          <Button variant="outline" className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            <span className="hidden sm:inline">Avancerad editor</span>
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 lg:col-span-2">
          <Tabs defaultValue="editor">
            <TabsList className="mb-4">
              <TabsTrigger value="editor" className="flex items-center">
                <FileText className="mr-2 h-4 w-4" />
                Editor
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center">
                <Send className="mr-2 h-4 w-4" />
                Förhandsgranskning
              </TabsTrigger>
              <TabsTrigger value="seo" className="flex items-center" onClick={() => setShowSeoAnalysis(true)}>
                <Search className="mr-2 h-4 w-4" />
                SEO Analys
                {seoScore !== null && (
                  <span className={`ml-2 px-1.5 py-0.5 text-xs rounded-full ${
                    seoScore >= 80 ? 'bg-green-500/20 text-green-400' : 
                    seoScore >= 60 ? 'bg-green-500/20 text-green-400' : 
                    seoScore >= 40 ? 'bg-yellow-500/20 text-yellow-400' : 
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {seoScore}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="editor">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Nytt innehåll</span>
                    <Link to="/advanced-editor" className="sm:hidden">
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 h-8 px-2">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only sm:not-sr-only">Avancerad</span>
                      </Button>
                    </Link>
                  </CardTitle>
                  <CardDescription>
                    Skapa nytt innehåll med hjälp av AI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Titel</Label>
                    <Input 
                      id="title" 
                      placeholder="Ange en titel för ditt innehåll" 
                      value={contentTitle}
                      onChange={(e) => setContentTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="meta-description">Meta beskrivning</Label>
                    <Textarea 
                      id="meta-description" 
                      placeholder="Ange en meta beskrivning för sökmotorer (120-160 tecken)" 
                      value={metaDescription}
                      onChange={(e) => setMetaDescription(e.target.value)}
                      rows={2}
                    />
                    {metaDescription && (
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{metaDescription.length} tecken</span>
                        <span className={metaDescription.length < 120 || metaDescription.length > 160 ? 'text-yellow-400' : 'text-green-400'}>
                          Rekommenderat: 120-160 tecken
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="platform">Plattform</Label>
                    <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                      <SelectTrigger id="platform">
                        <SelectValue placeholder="Välj plattform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="instagram">Instagram</SelectItem>
                        <SelectItem value="facebook">Facebook</SelectItem>
                        <SelectItem value="linkedin">LinkedIn</SelectItem>
                        <SelectItem value="twitter">Twitter</SelectItem>
                        <SelectItem value="tiktok">TikTok</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="content">Innehåll</Label>
                        {location.state?.fromTemplates && (
                          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                            Från mall
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Link to="/advanced-editor" className="text-xs text-primary hover:underline hidden sm:inline-block">
                          Använd avancerad editor
                        </Link>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-xs flex items-center gap-1 h-7 px-2" 
                          onClick={toggleSeoAnalysis}
                        >
                          <Search className="h-3 w-3" />
                          {showSeoAnalysis ? 'Dölj SEO analys' : 'Visa SEO analys'}
                          {seoScore !== null && !showSeoAnalysis && (
                            <span className={`ml-1 px-1.5 py-0.5 text-xs rounded-full ${
                              seoScore >= 80 ? 'bg-green-500/20 text-green-400' : 
                              seoScore >= 60 ? 'bg-green-500/20 text-green-400' : 
                              seoScore >= 40 ? 'bg-yellow-500/20 text-yellow-400' : 
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {seoScore}
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                    <Textarea 
                      id="content" 
                      placeholder={location.state?.fromTemplates 
                        ? "Anpassa mallinnehållet genom att ersätta texten inom [klamrar] med ditt eget innehåll..." 
                        : "Skriv eller generera ditt innehåll här... Använd Avancerad Editor för formatering, bilder och mer"
                      } 
                      className="min-h-[300px]"
                      value={contentText}
                      onChange={(e) => setContentText(e.target.value)}
                    />
                    <div className="flex justify-between items-center text-xs text-muted-foreground">
                      {originalTemplate && (
                        <button 
                          type="button" 
                          onClick={resetTemplateContent}
                          className="hover:underline flex items-center gap-1 text-primary"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                          </svg>
                          Återställ malltexten
                        </button>
                      )}
                      <Link to="/advanced-editor" className="hover:underline flex items-center ml-auto gap-1">
                        <Edit className="h-3 w-3" />
                        Formatera med Avancerad Editor
                      </Link>
                    </div>
                  </div>
                  
                  {location.state?.fromTemplates && originalTemplate && (
                    <div className="mt-4 p-3 bg-primary/5 rounded-md border border-primary/10">
                      <h4 className="text-sm font-medium mb-1 flex items-center gap-1 text-primary">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                        </svg>
                        Tips för att använda mallen
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        För att anpassa innehållet, ersätt texten inom [hakparenteser] med din egen information.
                      </p>
                      <div className="text-xs grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-primary">Exempel:</span> 
                          <span className="bg-secondary/50 px-1 py-0.5 rounded">[Produktnamn]</span> 
                          <span>→</span> 
                          <span className="bg-primary/10 px-1 py-0.5 rounded">Min Produkt</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-primary">Exempel:</span> 
                          <span className="bg-secondary/50 px-1 py-0.5 rounded">[Fördel 1]</span> 
                          <span>→</span> 
                          <span className="bg-primary/10 px-1 py-0.5 rounded">Sparar tid</span>
                        </div>
                      </div>
                    </div>
                  )}
                
                  {showSeoAnalysis && (
                    <div className="mt-4">
                      <SEOAnalyzer
                        initialContent={contentText}
                        initialTitle={contentTitle}
                        initialMetaDescription={metaDescription}
                        initialKeywords={keywords}
                        onAnalysisComplete={handleAnalysisComplete}
                      />
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="outline" 
                      onClick={handleSaveProject}
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sparar...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Spara utkast
                        </>
                      )}
                    </Button>
                    <Button 
                      onClick={handleCreate} 
                      disabled={isCreating || isSaving}
                    >
                      {isCreating ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Skapar...
                        </>
                      ) : (
                        'Skapa innehåll'
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="preview">
              <Card>
                <CardHeader>
                  <CardTitle>Förhandsgranskning</CardTitle>
                  <CardDescription>
                    Så här kommer ditt innehåll att se ut på {selectedPlatform || 'vald plattform'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(!contentTitle && !contentText) ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Inget innehåll att förhandsgranska</p>
                      <p className="text-sm">Lägg till titel och innehåll i editor-fliken</p>
                    </div>
                  ) : (
                    <div className="rounded-lg border p-4">
                      {contentTitle && <h3 className="text-lg font-bold mb-2">{contentTitle}</h3>}
                      <div className="whitespace-pre-wrap">{contentText}</div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="seo">
              <Card>
                <CardHeader>
                  <CardTitle>SEO Analys</CardTitle>
                  <CardDescription>
                    Optimera ditt innehåll för bättre synlighet i sökmotorer
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {(!contentTitle && !contentText) ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>Inget innehåll att analysera</p>
                      <p className="text-sm">Lägg till titel och innehåll i editor-fliken för att få en SEO-analys</p>
                    </div>
                  ) : (
                    <SEOAnalyzer
                      initialContent={contentText}
                      initialTitle={contentTitle}
                      initialMetaDescription={metaDescription}
                      initialKeywords={keywords}
                      onAnalysisComplete={handleAnalysisComplete}
                      autoAnalyze={false}
                    />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="col-span-1 space-y-4">
          {/* AI Assistent */}
          <EnhancedAIAssistant 
            currentContent={contentText} 
            onApplySuggestion={handleApplySuggestion}
            selectedPlatform={selectedPlatform}
          />
          
          {/* Keyword Suggestions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">SEO Nyckelord</CardTitle>
              <CardDescription>
                Lägg till nyckelord för SEO-optimering
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-2">
                  <Input 
                    placeholder="Lägg till nyckelord"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.currentTarget.value) {
                        handleAddKeyword(e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <Button variant="secondary" onClick={() => {
                    const input = document.querySelector('input[placeholder="Lägg till nyckelord"]') as HTMLInputElement;
                    if (input && input.value) {
                      handleAddKeyword(input.value);
                      input.value = '';
                    }
                  }}>
                    Lägg till
                  </Button>
                </div>
                
                {keywords.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {keywords.map((keyword, index) => (
                      <div key={index} className="group flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs">
                        <span>{keyword}</span>
                        <button
                          onClick={() => setKeywords(keywords.filter(k => k !== keyword))}
                          className="opacity-60 hover:opacity-100 focus:opacity-100"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    Lägg till nyckelord för att förbättra din SEO
                  </p>
                )}
                
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium mb-2">Föreslagna nyckelord</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedPlatform === 'instagram' && (
                      <>
                        <button onClick={() => handleAddKeyword('instagram')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">instagram</button>
                        <button onClick={() => handleAddKeyword('instapost')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">instapost</button>
                        <button onClick={() => handleAddKeyword('socialmedia')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">socialmedia</button>
                      </>
                    )}
                    {selectedPlatform === 'facebook' && (
                      <>
                        <button onClick={() => handleAddKeyword('facebook')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">facebook</button>
                        <button onClick={() => handleAddKeyword('facebookpost')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">facebookpost</button>
                        <button onClick={() => handleAddKeyword('socialmedia')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">socialmedia</button>
                      </>
                    )}
                    {selectedPlatform === 'linkedin' && (
                      <>
                        <button onClick={() => handleAddKeyword('linkedin')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">linkedin</button>
                        <button onClick={() => handleAddKeyword('business')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">business</button>
                        <button onClick={() => handleAddKeyword('professional')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">professional</button>
                      </>
                    )}
                    {selectedPlatform === 'twitter' && (
                      <>
                        <button onClick={() => handleAddKeyword('twitter')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">twitter</button>
                        <button onClick={() => handleAddKeyword('tweet')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">tweet</button>
                        <button onClick={() => handleAddKeyword('trending')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">trending</button>
                      </>
                    )}
                    {selectedPlatform === 'tiktok' && (
                      <>
                        <button onClick={() => handleAddKeyword('tiktok')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">tiktok</button>
                        <button onClick={() => handleAddKeyword('fyp')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">fyp</button>
                        <button onClick={() => handleAddKeyword('viral')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">viral</button>
                      </>
                    )}
                    {!selectedPlatform && (
                      <>
                        <button onClick={() => handleAddKeyword('content')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">content</button>
                        <button onClick={() => handleAddKeyword('marketing')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">marketing</button>
                        <button onClick={() => handleAddKeyword('socialmedia')} className="px-2 py-1 rounded-full text-xs bg-muted hover:bg-muted/80">socialmedia</button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* AI Content Examples */}
          <AIContentPreview 
            platform={selectedPlatform || 'general'} 
          />
          
          {/* Advanced Editor Promo */}
          <Card className="bg-gradient-to-br from-primary/20 to-transparent border-primary/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Avancerad Editor
              </CardTitle>
              <CardDescription>
                För mer avancerade publiceringsalternativ
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <p>
                  Prova vår avancerade editor med formatering, bilduppladdning, direktpublicering och mer!
                </p>
                <ul className="space-y-1 list-disc pl-4 text-muted-foreground">
                  <li>Rik formatering (fet, kursiv, listor, etc.)</li>
                  <li>Bilduppladdning från mobil/dator</li>
                  <li>Förhandsgranskning för olika plattformar</li>
                  <li>Direktpublicering från mobilen</li>
                </ul>
                <Link to="/advanced-editor">
                  <Button className="w-full mt-2">
                    <Edit className="mr-2 h-4 w-4" />
                    Öppna avancerad editor
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}